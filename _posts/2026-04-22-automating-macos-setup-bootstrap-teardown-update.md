---
layout: post
title: 'Automating macOS Setup with Bootstrap and Teardown Scripts'
description: 'How I replaced an afternoon of new-Mac setup with bootstrap.sh, and why the teardown script has to be written at the same time.'
date: 2026-04-22 17:44:08 CDT -0500
categories: ['Articles']
tags: ['macos', 'shell-script', 'command-line', 'homebrew', 'dot-files', 'yabai', 'automation']
pillar: shell-macos
pillar_section: macos
image: 'assets/uploads/2025/04/automating-macos-setup-bootstrap-teardown-and-keeping-it-all-in-sync.webp'
---

Every time I had to set up a new Mac I would spend an hour or two clicking through installers, reconfiguring dot files, and trying to remember which global npm packages I actually cared about, so I wrote `bootstrap.sh` to handle most of the setup.

Three pieces cover the whole life of a machine. `bootstrap.sh` provisions a new one, `teardown.sh` removes what bootstrap installed, and a shell function called `update_cli` keeps an existing machine current in between. There were things I had to fix along the way, and I am sure there are still edge cases I haven't hit yet.

## Using the Bootstrap as the Record of What Is Installed

The bootstrap is now the canonical list of what's on my machine. If I want to add something, I add it to the script. If I'm wondering why something is installed, I look there first.

Each script is a few hundred lines of bash, a list of packages, and some `defaults write` calls. Having it written down means I'm not relying on memory for any of it.

## What the Two Scripts Look Like

Below is a stripped-down version of both. Swap in your own packages.

**bootstrap.sh**

```bash
#!/bin/bash
set -euo pipefail

_green=$'\e[0;32m'; _yellow=$'\e[0;33m'; _red=$'\e[0;31m'; _reset=$'\e[0m'
info()    { printf "${_yellow}==> %s${_reset}\n" "$*"; }
success() { printf "${_green}    ✔ %s${_reset}\n" "$*"; }
warn()    { printf "${_red}    ✘ %s${_reset}\n" "$*"; }

# Homebrew
if ! command -v brew >/dev/null 2>&1; then
    info "Installing Homebrew"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

info "Installing packages"
brew install git gh neovim fzf ripgrep

info "Installing casks"
brew install --cask iterm2 visual-studio-code

# Node through fnm
info "Installing Node"
brew install fnm
eval "$(fnm env --shell bash)"
fnm install --lts
fnm use lts-latest
fnm default lts-latest
npm install -g pnpm

info "Creating symlinks"
ln -sf "$PWD/.zshrc" "$HOME/.zshrc"

success "Done"
```

**teardown.sh**

```bash
#!/bin/bash
set -euo pipefail

_green=$'\e[0;32m'; _yellow=$'\e[0;33m'; _red=$'\e[0;31m'; _reset=$'\e[0m'
info()    { printf "${_yellow}==> %s${_reset}\n" "$*"; }
success() { printf "${_green}    ✔ %s${_reset}\n" "$*"; }
warn()    { printf "${_red}    ✘ %s${_reset}\n" "$*"; }

confirm() {
    printf "\n${_yellow}%s${_reset} (y/n): " "$1"
    read -r answer && [[ "$answer" == "y" ]]
}

if confirm "Remove symlinks?"; then
    rm -f "$HOME/.zshrc" && success "Removed .zshrc"
fi

if confirm "Remove fnm and all Node.js versions?"; then
    for version in $(fnm list | awk '{print $2}'); do
        fnm uninstall "$version" || true
    done
    rm -rf "$HOME/.local/share/fnm"
    brew uninstall fnm || true
fi

if confirm "Uninstall casks?"; then
    brew uninstall --cask iterm2 visual-studio-code || true
fi

if confirm "Uninstall packages?"; then
    brew uninstall git gh neovim fzf ripgrep || true
    brew autoremove && brew cleanup
fi

success "Done"
```

Every section you add to one should go into the other. My own scripts follow the same pattern with more packages in them. Start with what you actually use and add to it as you go.

## Write the Teardown at the Same Time

If you build a bootstrap, write the teardown alongside it, section by section.

I didn't do this at first, so by the time I got around to writing the teardown, the two scripts had already drifted. Casks, macOS settings, and a handful of other changes had gone into bootstrap without a matching removal in teardown. I used Claude Code to walk both scripts and reconcile them section by section.

The teardown mirrors bootstrap in reverse, with a `confirm()` prompt before each phase so you can skip the sections you want to keep:

```bash
confirm() {
    local message="$1"
    if [ "$SKIP_PROMPTS" = true ]; then
        info "$message — auto-confirmed (--yes)"
        return 0
    fi
    printf "\n${_yellow}%s${_reset} (y/n): " "$message"
    local answer
    read -r answer
    [[ "$answer" == "y" ]]
}
```

A `--yes` flag skips all prompts for VM testing. `--include-ssh` opts into removing SSH keys, which are skipped by default.

## `set -euo pipefail` and Commands That Return Non-Zero When They Succeed

Both scripts open with the same line. [`set -euo pipefail`](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html) exits the script when a command returns non-zero, treats an unset variable as an error, and makes a pipeline return non-zero if any command in it fails. Some commands return a non-zero exit code even when they work fine, and the script exits on those too.

`ssh -T git@github.com` [exits `1` after a successful authentication](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection), because GitHub doesn't give you shell access. If you pipe that straight into `grep`, the script exits before it can check the output.

The workaround is to capture the output first:

```bash
SSH_TEST=$(ssh -T git@github.com 2>&1 || true)
if echo "$SSH_TEST" | grep -q "successfully authenticated"; then
    success "GitHub SSH connection verified"
else
    warn "Could not verify GitHub SSH — check your key"
fi
```

The `|| true` makes the assignment return zero, so `set -e` doesn't exit the script.

## You Need an SSH Key Before the Bootstrap Can Run

Both scripts live in a git repo alongside the dot files they symlink, so the repo has to be on the machine before `bootstrap.sh` can run. That repo has to be cloned over SSH rather than downloaded as a zip, because a zip has no `.git` directory and the seventeen submodules cannot be initialized without one.

So the first SSH key has to exist before any of the automation runs, and you create it by hand. That is the one manual step I have not been able to remove.

Bootstrap generates a second key for GitHub once it is running:

```bash
ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)" -f "$SSH_KEY" -N ""
eval "$(ssh-agent -s)"
ssh-add "$SSH_KEY"
```

It prints the public key with a link to GitHub's key settings page, and the `ssh -T` check above is what confirms the key was added before the script goes on to clone anything else.

## Homebrew Won't Be on PATH Right After You Install It

Bootstrap installs Homebrew and then installs packages with it, and those two steps happen in the same shell. If Homebrew isn't installed yet, it's also not on PATH, so any `brew` command immediately after the install fails.

Homebrew's [installation docs](https://docs.brew.sh/Installation) say to add `eval "$(brew shellenv)"` to your shell config, and the script runs the same line right after installing so `brew` works in the current session:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
```

## Node Through fnm Needs the Same Treatment

Installing a Node version manager has the same shape as installing Homebrew. Bootstrap installs [fnm](https://github.com/Schniz/fnm) with `brew install fnm`, and then `node` still does not exist in that shell until fnm's environment is evaluated:

```bash
brew install fnm
eval "$(fnm env --shell bash)"
fnm install --lts
fnm use lts-latest
fnm default lts-latest
```

Global npm packages are installed per Node version, so they go in after a version is selected and made the default. The script installs pnpm and checks first so a re-run does not reinstall it:

```bash
if ! npm list -g pnpm --depth=0 >/dev/null 2>&1; then
    npm install -g pnpm
fi
```

## Bootstrap Sets Up, update_cli Maintains, Teardown Removes

Bootstrap runs once, on a machine that has nothing on it. Teardown runs once, when I am done with the machine. Everything in between is maintenance, and that runs through `update_cli`, a shell function that prompts once and then walks Homebrew, Composer, and the rest of the package managers in order.

Keeping those separate matters because the two jobs are not the same. Bootstrap installs a package that is not there yet. `update_cli` replaces a package that is running.

## Stop Your Window Manager Before update_cli Touches It

Any time `brew upgrade` updated yabai, my system would lock up and a security popup would appear that I couldn't interact with, because the window manager was in a broken state.

The cause was a race condition with launchd. yabai runs as a launchd service whose `KeepAlive` is a dictionary rather than a plain `true`, setting `SuccessfulExit` to `false` and `Crashed` to `true`. That means launchd restarts yabai when it exits with a non-zero status or crashes, which is exactly what happens when brew replaces the binary underneath a running process. launchd starts the new instance before the old one has released its lock file at `/tmp/yabai_$USER.lock`, so the new instance can't get the lock and aborts, which leaves the window manager stopped.

Stopping yabai first is the fix, and it is the first thing `update_cli` does:

```bash
yabai --stop-service

brew update && brew upgrade && brew cleanup && brew autoremove

rm -f "/tmp/yabai_${USER}.lock"
yabai --start-service
```

`--stop-service` [calls `launchctl bootout`](https://github.com/koekeishiya/yabai/blob/master/src/misc/service.h), which unloads the service. The `rm -f` on the lock file is there in case the old process left it behind.

The logs also showed an error on every yabai startup for three config commands that [v7.0.0 removed](https://github.com/koekeishiya/yabai/blob/master/CHANGELOG.md):

- `window_topmost`
- `window_border`
- `window_border_width`

All three had been sitting in my `yabairc` since before the upgrade. Check your own `yabairc` if you've upgraded yabai without revisiting the config.

## Where That Leaves the Setup

Setting up a new Mac now takes one SSH key made by hand, one clone, and one script.

The parts that took longest to get right were the ones where an exit code or a `PATH` did not behave the way the script assumed. `ssh -T` returns `1` on success. `brew` is not callable in the shell that just installed it. `node` does not exist until fnm's environment is evaluated. Each of those needed a line of its own rather than a comment explaining the surprise later.

Teardown gets edited in the same commit as bootstrap, so the two do not drift again. And upgrades go through `update_cli` rather than a bare `brew upgrade`, which is what keeps a running window manager from being replaced underneath itself.
