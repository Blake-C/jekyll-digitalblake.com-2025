---
layout: post
title: "Supply Chain Attacks Got Smarter. Here's What I Did About It."
description: 'The Shai Hulud worm hit TanStack and dozens of other npm packages by poisoning a pnpm store cache in GitHub Actions. Here is how the attack worked and the concrete steps I took to harden my own projects against it.'
date: 2026-05-15 04:41:03 CDT -0500
categories: ['Articles']
tags: ['security', 'supply-chain', 'pnpm', 'docker', 'github-actions', 'npm', 'nodejs']
image: '/assets/uploads/2025/05/supply-chain-attacks-got-smarter.webp'
---

The Shai Hulud worm has now hit the npm ecosystem four times. The latest iteration tore through TanStack, Mistral, UiPath, and dozens of other packages, eventually spreading into PyPI. The Syntax.fm hosts covered it this week and, after watching, I spent an afternoon auditing my own repos.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/kYqpxJE4DyE" title="Shai Hulud Supply Chain Attack, Syntax.fm" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## How the attack actually worked

This one is worth understanding because it wasn't a stolen password or a compromised developer machine. It was a misconfiguration in GitHub Actions and a shared cache.

GitHub Actions has two event types for pull requests: `pull_request` and `pull_request_target`. The difference is significant. `pull_request` sandboxes contributor code from repository secrets and the cache used by elevated workflows. `pull_request_target` does not. When maintainers use `pull_request_target` to give PR workflows access to things like bundle-size comparisons or deploy previews, they inadvertently share a pnpm store cache with the repository's release pipeline.

The attackers opened a pull request against a TanStack repo. The PR triggered a workflow that used `pull_request_target`, which gave the attacker's code access to that shared pnpm store cache. They poisoned it with a malicious payload, then closed the PR and deleted the code.

The poisoned cache stayed. When a legitimate commit was later merged and the elevated `release.yml` workflow ran, pnpm looked up that cached store and executed the payload. The cleanup handler of the failed step captured an OIDC token scoped to npm publishing. With that token, the attacker could publish to npm as the legitimate maintainer.

Once they had publish access, they pushed compromised versions of multiple packages. Those packages contained postinstall scripts that harvested AWS credentials and environment variables. From there, the worm self-propagated through other packages in the ecosystem.

Two things stand out about this one. First, the payload injected itself into `~/.claude/settings.json` and VS Code's `tasks.json`, both of which auto-execute code when those tools start up. Infection persisted past the npm install. Second, the attacker installed a dead man switch: the payload pinged the GitHub API to watch for token revocation, and if the token was rotated, it ran `rm -rf $HOME`.

## What the episode recommends

A few direct takeaways from the Syntax.fm hosts:

- **Don't use `pull_request_target`** unless you actually need elevated permissions. Most repos don't. [Step Security's GitHub Actions scanner](https://app.stepsecurity.io) will flag it for you.
- **Use package security tooling.** [Socket.dev](https://socket.dev) and [Snyk](https://snyk.io) both scan the npm registry continuously. Socket detected this attack within six minutes of the compromised packages being published.
- **Enable a minimum package age.** pnpm 11 defaults to only installing packages at least 24 hours old, which would have blocked most users from installing the compromised versions on day one. Yarn, Bun, and npm have equivalent settings (`npmMinimumAgeGate`, `minReleaseAge`, `min-release-age` in `.npmrc`) but don't enable them by default.
- **Block postinstall scripts by default.** pnpm 11's `onlyBuiltDependencies` / `allowBuilds` means packages can't run install scripts unless they're on an explicit allowlist. The Shai Hulud payload was a postinstall script. An allowlist would have blocked it.
- **Block exotic subdependencies.** pnpm 11's `blockExoticSubdeps` prevents any dependency from resolving to a git repo or arbitrary tarball. The attacker linked to a GitHub-hosted tarball rather than publishing malicious code directly to npm. This setting closes that door.
- **Use Socket's CLI.** Running `socket npm install` wraps your package manager and checks packages against Socket's threat intelligence at install time.
- **Run tooling in containers.** If a malicious postinstall script runs inside Docker, it can only reach the container filesystem. `rm -rf $HOME` destroys the container's home directory, not yours.

## What I changed in my own projects

After the episode I audited two repos: this Jekyll site and a Next.js app. Here's what I actually changed.

### Lock the registry

The simplest one. Explicitly pinning the registry in `.npmrc` prevents dependency-confusion attacks, where an attacker publishes a package with the same name as a private internal package to the public registry and wins the resolution race.

```ini
# .npmrc
# Explicit registry: prevents dependency-confusion attacks
registry=https://registry.npmjs.org/
```

### pnpm workspace configuration

pnpm 11 moved most settings out of `.npmrc` and into `pnpm-workspace.yaml`. That migration is worth doing intentionally. Here's the full config from this site's repo:

```yaml
packages:
    - '.'

confirmModulesPurge: false
frozenLockfile: true
saveExact: true
auditLevel: moderate
verifyStoreIntegrity: true
strictDeprecatedDependencies: warn

fetchTimeout: 60000
fetchRetryMinTimeout: 1000
fetchRetryMaxTimeout: 10000

allowBuilds:
    '@parcel/watcher': true

catalog:
    micromodal: 0.4.10
    prismjs: 1.30.0
    eslint: 10.2.1
    stylelint: 17.8.0
    webpack: 5.106.2
    webpack-cli: 7.0.2
    sass: 1.99.0
    postcss-cli: 11.0.1
    husky: 9.1.7
    lint-staged: 17.0.4
```

What each security-relevant setting does:

- **`frozenLockfile: true`**: Refuses to install if `pnpm-lock.yaml` is out of sync with `package.json`. Prevents the "just run `pnpm install` and let it resolve" habit that silently pulls in unreviewed versions outside of a code review.
- **`saveExact: true`**: When you run `pnpm add`, it records `1.2.3` instead of `^1.2.3`. A caret range means "give me any compatible update automatically," which is exactly the kind of unreviewed code a supply chain attack exploits during the next install.
- **`auditLevel: moderate`**: Runs a CVE check on every install and fails if anything rates moderate or higher. Catches known vulnerabilities before they make it into a build.
- **`verifyStoreIntegrity: true`**: Re-hashes every cached package on each install. Detects if something tampered with a package in the local pnpm store between installs.
- **`allowBuilds`**: The most direct mitigation against this attack. Only the packages listed here can run postinstall scripts. Everything else is blocked. In this repo, only `@parcel/watcher` needs a build script. The Shai Hulud payload was a postinstall script. It would not have run.
- **`catalog:`**: Centralizes version pins for high-risk dependencies in one file. A version bump requires an explicit edit here, making it visible in code review rather than buried in a lockfile diff.

The Next.js app has an additional setting worth noting: `hoist: false` combined with an explicit `publicHoistPattern`. This prevents phantom dependency exploitation, where a package that isn't in your direct dependencies can be imported because it was hoisted into `node_modules` by something else.

```yaml
hoist: false
publicHoistPattern:
    - '*types*'
    - '@eslint*'
    - 'eslint*'
    - next
    - '@next*'
```

### Lock the Node and pnpm versions

```json
{
	"packageManager": "pnpm@11.1.1",
	"engines": {
		"node": ">=24",
		"pnpm": ">=11"
	}
}
```

Corepack uses the `packageManager` field to enforce the exact pnpm version. The `engines` field makes the constraint explicit and visible.

### Pin GitHub Actions to commit SHAs

Mutable tags like `@v4` can be force-pushed. If someone compromises a GitHub Action and redirects the tag, every CI run that uses it will execute the attacker's code. Pinning to an immutable commit SHA eliminates that surface.

```yaml
# Before: the tag can be moved to point at anything
- uses: pnpm/action-setup@v4

# After: locked to the exact commit, tag kept as a comment for readability
- uses: pnpm/action-setup@f40ffcd9367d9f12939873eb1018b921a783ffaa # v4
```

The full actions block from this site's deploy workflow, all pinned:

```yaml
- uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
- uses: pnpm/action-setup@f40ffcd9367d9f12939873eb1018b921a783ffaa # v4
- uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
  with:
      node-version: '24.15.0'
      cache: 'pnpm'
- uses: ruby/setup-ruby@c4e5b1316158f92e3d49443a9d58b31d25ac0f8f # v1.306.0
  with:
      ruby-version: '3.4.9'
      bundler-cache: true
```

I also added an audit step to the CI pipeline that fails the build on any high or critical CVE:

```yaml
- name: Audit dependencies
  run: pnpm audit --audit-level=high
```

### Run containers as a non-root user

If a compromised dependency runs code during install, running as root inside the container means it can modify anything the container can reach. A non-root user limits the blast radius to files that user owns.

This site's Dockerfile creates a dedicated `appuser` and switches to it before any application code or dependency installation happens:

```dockerfile
FROM ruby:3.4.9-slim

# ... install Node, ImageMagick, Bundler ...

ENV COREPACK_HOME=/usr/local/share/corepack
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

WORKDIR /app

RUN useradd --uid 1001 --create-home appuser \
    && mkdir -p /home/appuser/.local/share/pnpm \
    && chown -R appuser:appuser /app /usr/local/bundle /home/appuser/.local/share/pnpm \
    && chmod -R 755 /usr/local/share/corepack

USER appuser
```

The root-only work (installing corepack, preparing pnpm) happens first, then the user drops to `appuser` before `pnpm install` runs.

The Next.js app's dev Dockerfile takes it further by also pinning the base image to a SHA digest, so the image can't silently change between builds:

```dockerfile
FROM node:22-alpine@sha256:878502560e388e361461a000e680a7435625020683c98e9eb3562f26215df298

ENV PNPM_HOME="/pnpm"
ENV COREPACK_HOME="/corepack"
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p /pnpm /corepack \
    && corepack enable \
    && corepack prepare pnpm@11.1.1 --activate \
    && apk add --no-cache libc6-compat git \
    && chown -R node:node /pnpm /corepack

WORKDIR /app
RUN chown node:node /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./
ENV HUSKY=0
RUN pnpm install --frozen-lockfile
```

### Drop Linux capabilities in Docker Compose

Even as a non-root user, containers inherit a default set of Linux kernel capabilities. Dropping them all and adding back only what's actually needed shrinks the attack surface further. From the Next.js app's `docker-compose.yml`:

```yaml
services:
    app:
        security_opt:
            - no-new-privileges:true
        cap_drop:
            - ALL

    db:
        image: postgres:17-alpine@sha256:c7526c0f6c3f30260a563d7bcf8ad778effac59a44f8ffa86678c35418338609
        security_opt:
            - no-new-privileges:true
        cap_drop:
            - ALL
        cap_add:
            - SYS_NICE # PostgreSQL needs this for process priority management
```

`no-new-privileges:true` prevents any process inside the container from gaining elevated privileges through `setuid` binaries. `cap_drop: ALL` removes the default capability set. PostgreSQL needs `SYS_NICE` for process scheduling; that's the only capability added back.

### Scan staged files for secrets before committing

The Shai Hulud payload harvested credentials. Keeping secrets out of the repo in the first place cuts off one part of that chain. The pre-commit hook in this repo runs [gitleaks](https://github.com/gitleaks/gitleaks) against staged files before lint-staged touches anything:

```bash
docker run --rm -v "$(pwd):/repo" -w /repo zricethezav/gitleaks:v8.30.1 protect --staged --source .
docker compose run --rm --no-deps app pnpm exec lint-staged
```

gitleaks runs first. If it finds a credential pattern in staged files, the commit is blocked.

### Force patched versions of vulnerable transitive dependencies

Sometimes a transitive dependency (something your dependencies depend on) has a known CVE and the upstream maintainer hasn't shipped a fix yet. pnpm lets you force a specific version across all consumers. From the Next.js app's `package.json`:

```json
"pnpm": {
    "overrides": {
        "postcss": "8.5.13"
    }
}
```

Any package in the dependency tree that pulls in postcss gets `8.5.13` regardless of what version it declares.

## Docker as your sandbox

The dead man switch in this attack ran `rm -rf $HOME`. If you're running all your tooling inside Docker (this project does: all Node and Ruby commands run in a container with the project directory bind-mounted), that command hits the container's home directory, not yours. The container is gone. Your machine is intact.

Dev containers extend this further by isolating the entire development environment. CJ from Syntax [covered this in a recent video](https://www.youtube.com/watch?v=kPMA9cnpScU&t=1s). It's not a perfect defense, but "attacker nukes a container" is a materially better outcome than "attacker nukes your home directory."

## Closing

Nobody at TanStack had their password stolen. Nobody's laptop was compromised. The attack surface was a single GitHub Actions event type and a shared cache. That's it.

Most of what's above is one or two lines of configuration. Some of it, like the pnpm workspace settings, pnpm 11 does by default now. The rest just requires being deliberate about it. The next worm is already being written somewhere. Worth making your repos a harder target before it shows up.
