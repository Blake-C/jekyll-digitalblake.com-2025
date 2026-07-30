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

There were things I had to fix along the way, and I am sure there are still edge cases I haven't hit yet. Writing it down forced me to think about what is on my machine and why.

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

[`set -euo pipefail`](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html) exits the script when a command returns non-zero, treats an unset variable as an error, and makes a pipeline return non-zero if any command in it fails. Some commands return a non-zero exit code even when they work fine, and the script exits on those too.

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

## Homebrew Won't Be on PATH Right After You Install It

If Homebrew isn't installed yet, it's also not on PATH, so any `brew` command immediately after the install fails.

Homebrew's [installation docs](https://docs.brew.sh/Installation) say to add `eval "$(brew shellenv)"` to your shell config, and the script runs the same line right after installing so `brew` works in the current session:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
```

## Stop Your Window Manager (Yabai) Before Running `brew upgrade`

Any time `brew upgrade` updated yabai, my system would lock up and a security popup would appear that I couldn't interact with, because the window manager was in a broken state.

The cause was a race condition with launchd. yabai runs as a launchd service whose `KeepAlive` is a dictionary rather than a plain `true`, setting `SuccessfulExit` to `false` and `Crashed` to `true`. That means launchd restarts yabai when it exits with a non-zero status or crashes, which is exactly what happens when brew replaces the binary underneath a running process. launchd starts the new instance before the old one has released its lock file at `/tmp/yabai_$USER.lock`, so the new instance can't get the lock and aborts, which leaves the window manager stopped.

Stopping yabai before the upgrade prevents launchd from restarting it during the upgrade.

This does not go in `bootstrap.sh`. Bootstrap runs once on a new machine, where it installs yabai rather than upgrading it, so there is no running service to stop. Updating an existing machine is a separate job, and it runs through a shell function called `update_cli` that walks through Homebrew, Composer, and the rest. Stopping yabai is the first thing that function does:

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

## NVM Doesn't Move Your Global Packages Automatically

**Note, July 2026:** `bootstrap.sh` no longer uses nvm. It now installs [fnm](https://github.com/Schniz/fnm) with `brew install fnm`, runs `eval "$(fnm env --shell bash)"`, then `fnm install --lts`, `fnm use lts-latest`, and `fnm default lts-latest`, and installs pnpm globally with npm. The nvm commands below are what the script used to do.

When you install a new LTS version of Node under nvm, your globally installed packages are not installed into it.

```bash
PREV_NODE="$(nvm version default)"
nvm install --lts
nvm alias default lts/*
nvm reinstall-packages "$PREV_NODE"
```

[`nvm reinstall-packages`](https://github.com/nvm-sh/nvm) takes the version you want to copy from as an argument and installs those global packages into the version you are using.

## Using the Bootstrap as the Record of What Is Installed

The bootstrap is now the canonical list of what's on my machine. If I want to add something, I add it to the script. If I'm wondering why something is installed, I look there first.

Each script is a few hundred lines of bash, a list of packages, and some `defaults write` calls. Having it written down means I'm not relying on memory for any of it.

Below is a stripped-down version of both scripts. Swap in your own packages.

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
