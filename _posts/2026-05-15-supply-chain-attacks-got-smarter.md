---
layout: post
title: 'Shai Hulud npm Attack: How It Worked and How I Hardened My Repos'
description: 'The Shai Hulud worm poisoned a pnpm cache in GitHub Actions to hit TanStack and 170+ npm packages. How it worked and the steps I took to harden my repos.'
date: 2026-05-15 04:41:03 CDT -0500
modified_date: 2026-07-29 13:31:47 CDT -0500
categories: ['Articles']
tags: ['security', 'supply-chain', 'pnpm', 'docker', 'github-actions', 'npm', 'nodejs']
image: '/assets/uploads/2025/05/supply-chain-attacks-got-smarter.webp'
youtube_id: 'kYqpxJE4DyE'
---

The Shai Hulud worm has now hit npm [four times](https://snyk.io/blog/tanstack-npm-packages-compromised/). The latest one compromised packages from TanStack, Mistral, UiPath, and 170+ other packages, and it [also reached PyPI](https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised). The Syntax.fm hosts covered it this week and, after watching, I spent an afternoon auditing my own repos.

{% include youtube.html id="kYqpxJE4DyE" title="Shai Hulud Supply Chain Attack, Syntax.fm" %}

## How the attack worked

The attack used a GitHub Actions misconfiguration and a shared cache.

GitHub Actions has [two event types for pull requests](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

- `pull_request` runs the contributor's code in the context of the merge commit, and no repository secrets other than `GITHUB_TOKEN` are passed to the runner for a fork.
- `pull_request_target` runs in the context of the base repository, where the workflow's secrets and the repository's Actions cache are available. GitHub's own docs list cache poisoning as a risk of running untrusted code on this trigger.

A `pull_request_target` workflow that caches the pnpm store writes into the base repository's cache scope, which is the same scope the release workflow restores from.

The attacker opened a pull request against a TanStack repo. The PR triggered `bundle-size.yml`, which ran on `pull_request_target` and checked out the fork's merge ref, so the attacker's code ran with access to that shared pnpm store cache. The code wrote a payload into the pnpm store under the cache key the release workflow would later compute. The attacker then [force-pushed the PR back to a no-op, closed it, and deleted the branch](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem).

The poisoned cache entry stayed. When a maintainer merged an unrelated commit and `release.yml` ran on main, the poisoned pnpm store was restored and the payload ran. The payload found the GitHub Actions `Runner.Worker` process and read `/proc/<pid>/mem` to pull the OIDC token out of the runner's memory. npm's trusted publishing checks that the token came from `release.yml` on `refs/heads/main` and does not check which step minted it, so the attacker used that token to publish.

Once they had publish access, they pushed compromised versions of multiple packages. Those packages carried an `optionalDependencies` entry pointing at a package whose [`prepare` script](https://snyk.io/blog/tanstack-npm-packages-compromised/) ran the payload, and the UiPath packages used a [`preinstall` script running `node setup.mjs`](https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised). The payload harvested AWS credentials and environment variables. The worm then used those stolen credentials to publish infected versions of other maintainers' packages.

The payload also set up two things that outlive the install.

- It wrote [`.claude/settings.json` and `.vscode/tasks.json` into the project](https://snyk.io/blog/tanstack-npm-packages-compromised/), along with a copy of itself. Claude Code runs the hooks in `.claude/settings.json` on every tool event, and VS Code runs the task in `.vscode/tasks.json` when the folder is opened, so the code ran again after the npm install finished.
- It installed a dead man switch. A background service polled the GitHub API to watch for token revocation, and if the token was revoked it ran `rm -rf $HOME`.

## What the episode recommends

The Syntax.fm hosts gave these recommendations.

- **Don't use `pull_request_target`** unless you actually need elevated permissions. Most repos don't. [StepSecurity's GitHub checks](https://app.stepsecurity.io) include a PWN Request check, which [flags workflows where `pull_request_target` executes untrusted code from a forked pull request](https://docs.stepsecurity.io/github/github-checks/configuration).
- **Use package security tooling.** [Socket](https://socket.dev) says it runs its static analysis engine [across every package on npm, PyPI, Maven, Go, and other registries](https://docs.socket.dev/docs/faq). [Snyk](https://snyk.io) is pointed at your own project instead, and it [finds vulnerabilities in the open-source libraries your application already uses](https://docs.snyk.io/scan-fix-and-prevent/scan-with-snyk/snyk-open-source). Socket's scanner [flagged every malicious version within six minutes of publication](https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack).
- **Enable a minimum package age.** pnpm 11 [defaults `minimumReleaseAge` to 1440 minutes](https://pnpm.io/blog/releases/11.0), so a package version is not resolved until it is a day old. That would have blocked most users from installing the compromised versions on day one. Yarn, Bun, and npm have equivalent settings (`npmMinimalAgeGate`, `minimumReleaseAge`, `min-release-age` in `.npmrc`) and all three are [off by default](https://cooldowns.dev/).
- **Block install scripts by default.** pnpm 11 [removed `onlyBuiltDependencies` and replaced it with `allowBuilds`](https://pnpm.io/blog/releases/11.0), and a package can't run install scripts unless it's named in `allowBuilds`. Shai Hulud ran through a `prepare` script, and through a `preinstall` script on the UiPath packages. An allowlist would have blocked both.
- **Block exotic subdependencies.** pnpm 11's [`blockExoticSubdeps`](https://pnpm.io/supply-chain-security) stops a transitive dependency from resolving to a git repository or a direct tarball URL. The compromised packages carried an `optionalDependencies` entry pointing at a commit in a GitHub fork, and `blockExoticSubdeps` blocks that.
- **Use Socket's CLI.** Running `socket npm install` wraps your package manager and checks packages against Socket's threat intelligence at install time.
- **Run tooling in containers.** If a malicious install script runs inside Docker, it can only reach the container filesystem. `rm -rf $HOME` destroys the container's home directory and leaves the host machine alone.

## What I changed in my own projects

After the episode I audited two repos, this Jekyll site and a Next.js app.

### Lock the registry

Pinning the registry in `.npmrc` prevents dependency-confusion attacks, where an attacker publishes a package with the same name as a private internal package to the public registry and wins the resolution race.

```ini
# .npmrc
# Explicit registry: prevents dependency-confusion attacks
registry=https://registry.npmjs.org/
```

### pnpm workspace configuration

pnpm 11 moved most settings out of `.npmrc` and into `pnpm-workspace.yaml`. This is the full config from this site's repo.

```yaml
packages:
    - '.'

confirmModulesPurge: false
frozenLockfile: true
saveExact: true
auditLevel: moderate
verifyStoreIntegrity: true
blockExoticSubdeps: true
minimumReleaseAge: 10080 # (7 days - configure to your liking)
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

- **`frozenLockfile: true`**: Refuses to install if `pnpm-lock.yaml` is out of sync with `package.json`. Prevents the "just run `pnpm install` and let it resolve" habit that pulls in versions nobody read in a code review.
- **`saveExact: true`**: When you run `pnpm add`, it records `1.2.3` instead of `^1.2.3`. A caret range means "give me any compatible update automatically," which is how a compromised version gets installed on the next `pnpm install` without anyone reading it.
- **`auditLevel: moderate`**: Runs a CVE check on every install and fails if anything rates moderate or higher. Catches known vulnerabilities before they make it into a build.
- **`verifyStoreIntegrity: true`**: Re-hashes every cached package on each install. Detects if something tampered with a package in the local pnpm store between installs.
- **`blockExoticSubdeps: true`**: Rejects any transitive dependency sourced from outside the npm registry. That covers git URLs, `file:` paths, `https:` tarballs, and similar. A sub-dependency pulled from one of those never went through npm's publishing process, so nothing about it is checked against the registry.
- **`minimumReleaseAge: 10080`**: Refuses to install a package version published fewer than 7 days ago. Shai Hulud worked by publishing a malicious version and getting projects to install it in the first hours. A 7-day wait gives other people time to spot the version and report it first.
- **`allowBuilds`**: Only the packages listed here can run install scripts. Everything else is blocked. In this repo, only `@parcel/watcher` needs a build script. The Shai Hulud payload ran from a `prepare` script and a `preinstall` script, and neither would have run here.
- **`catalog:`**: Centralizes version pins for high-risk dependencies in one file. A version bump requires an explicit edit here, making it visible in code review rather than buried in a lockfile diff.

`confirmModulesPurge: false` is the one setting in that config that is operational and not security-related. It comes up in CI. pnpm asks for confirmation before it purges `node_modules` (for example when the store or hoisting config changes), and a non-interactive CI run has no way to answer that prompt. So the build fails with:

```
If you are running pnpm in CI, set the CI environment variable to true, or set the confirmModulesPurge setting to false.
```

Setting `confirmModulesPurge: false` in `pnpm-workspace.yaml` (or exporting `CI=true` in the pipeline) silences the prompt so installs run unattended. With `frozenLockfile: true` already forcing a clean, lockfile-exact install, skipping the purge confirmation in CI is safe.

The Next.js app also sets `hoist: false` with an explicit `publicHoistPattern`. This prevents phantom dependency exploitation, where a package that isn't in your direct dependencies can be imported because it was hoisted into `node_modules` by something else.

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

Mutable tags like `@v4` can be force-pushed. If someone compromises a GitHub Action and redirects the tag, every CI run that uses it will execute the attacker's code. A commit SHA cannot be moved, so pinning to one means CI runs the same code on every run.

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

If a compromised dependency runs code during install, running as root inside the container means it can modify anything the container can reach. A non-root user can only modify the files that user owns.

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

The Next.js app's dev Dockerfile also pins the base image to a SHA digest, so the image can't change between builds:

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

Even as a non-root user, containers inherit a default set of Linux kernel capabilities. Dropping them all and adding back only what is needed reduces what a process inside the container can do. From the Next.js app's `docker-compose.yml`:

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

The Shai Hulud payload harvested credentials. Keeping secrets out of the repo removes one place it could read them from. The pre-commit hook in this repo runs [gitleaks](https://github.com/gitleaks/gitleaks) against staged files before lint-staged touches anything:

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

## Running tooling in Docker

The dead man switch in this attack ran `rm -rf $HOME`. If you're running all your tooling inside Docker (this project does: all Node and Ruby commands run in a container with the project directory bind-mounted), that command deletes the container's home directory and leaves the host machine untouched.

Dev containers extend this further by isolating the entire development environment. CJ from Syntax [covered this in a recent video](https://www.youtube.com/watch?v=kPMA9cnpScU&t=1s). It does not stop the install from running the payload. It keeps the damage inside the container.

## What the attack used and what I changed

No TanStack maintainer had a password stolen and no maintainer laptop was compromised. The attack used one GitHub Actions event type and a shared cache.

Most of what's above is one or two lines of configuration. Some of it, like `minimumReleaseAge` and `blockExoticSubdeps`, pnpm 11 sets by default now.

---

**Updated May 15, 2026 (Update 1):** Added two settings to the pnpm workspace configuration section: `blockExoticSubdeps` and `minimumReleaseAge`. The Syntax.fm hosts mentioned both, and I had left them out of the original config. `blockExoticSubdeps` prevents sub-dependencies from resolving to git repos or arbitrary tarballs. `minimumReleaseAge` enforces a 7-day freshness gate before any package version can be installed.

**Corrected July 29, 2026 (Update 2):** Three claims in the original version of this article were wrong. I have fixed them in the text above and am listing them here so anyone who read the earlier version knows what changed.

- **How the OIDC token was stolen.** The article said the cleanup handler of a failed step captured the token. No account of the attack describes a failed step or a cleanup handler. The [TanStack postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) says the payload located the GitHub Actions `Runner.Worker` process through `/proc/*/cmdline`, then read `/proc/<pid>/maps` and `/proc/<pid>/mem` to dump the token out of the runner's memory. The token was accepted because the trusted-publisher binding is set per workflow and ref. As the postmortem puts it, "Once configured, any code path in the workflow can mint a publish-capable token."
- **`onlyBuiltDependencies` is not a pnpm 11 setting.** The article named it alongside `allowBuilds` as a pnpm 11 feature. The [pnpm 11.0 release post](https://pnpm.io/blog/releases/11.0) says `onlyBuiltDependencies` and four related settings "have all been removed", and `allowBuilds` is what replaced them.
- **The payload did not run from a postinstall script.** The article called it a postinstall script in four places. Snyk's writeup shows the injected dependency using a `prepare` script, and Wiz's shows the UiPath packages using a `preinstall` script. An `allowBuilds` allowlist blocks all of these, so the advice was right even though the hook name was wrong.

Two smaller scope corrections went in at the same time. `blockExoticSubdeps` restricts transitive dependencies rather than any dependency, and Socket flagged the malicious versions within six minutes rather than detecting the attack itself. The persistence paths are also now written as `.claude/settings.json` and `.vscode/tasks.json` in the project, which is where Snyk's file table puts them, rather than under the home directory.
