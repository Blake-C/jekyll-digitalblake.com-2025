---
layout: post
title: 'Automating macOS Setup: Bootstrap, Teardown, and Keeping It All in Sync'
description: 'Setting up a new Mac used to mean an afternoon of clicking through installers and trying to remember what I had last time. I fixed that with a single bash script — and learned a few things the hard way.'
date: 2026-04-22 17:44:08 CDT -0500
categories: ['Articles']
tags: ['macos', 'shell-script', 'command-line', 'homebrew', 'dot-files', 'yabai', 'automation']
image: 'assets/uploads/2025/04/automating-macos-setup-bootstrap-teardown-and-keeping-it-all-in-sync.webp'
---

Every time I had to set up a new Mac I would spend an hour or two clicking through installers, reconfiguring dot files, and trying to remember which global npm packages I actually cared about. It got old. So I spent some time putting together `bootstrap.sh`, a script that handles most of the setup so I don't have to think about it next time.

It is not a perfect system. There were things I had to fix along the way, and I am sure there are still edge cases I haven't hit yet. But it is a lot better than starting from scratch every time, and writing it down forced me to actually think about what is on my machine and why.

## Write the Teardown at the Same Time

If you build a bootstrap, write the teardown alongside it. Not later, at the same time, section by section.

I didn't do this at first and paid for it. By the time I got around to writing the teardown, the two scripts had already drifted. Casks, macOS settings, and a handful of other changes had gone into bootstrap without a matching removal in teardown. I had to go back and reconcile them by hand.

The teardown mirrors bootstrap in reverse, with a `confirm()` prompt before each phase so you can bail out of sections you want to keep:

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

## `set -euo pipefail` Has a Few Sharp Edges

`set -euo pipefail` is worth using. It exits the script on errors, undefined variables, and pipeline failures, which catches a lot of mistakes early. What it doesn't tell you is that some commands return a non-zero exit code even when they work fine.

The one that caught me: `ssh -T git@github.com` exits `1` on a successful auth handshake, because GitHub doesn't give you shell access. If you pipe that straight into `grep`, the script dies before it can check the output.

The workaround is to capture the output first:

```bash
SSH_TEST=$(ssh -T git@github.com 2>&1 || true)
if echo "$SSH_TEST" | grep -q "successfully authenticated"; then
    success "GitHub SSH connection verified"
else
    warn "Could not verify GitHub SSH — check your key"
fi
```

The `|| true` keeps the exit code from killing the script.

## Homebrew Won't Be on PATH Right After You Install It

This one is obvious in hindsight, but if Homebrew isn't installed yet, it's also not on PATH yet. Any `brew` command immediately after the install will fail.

Source the environment right after installing:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
```

## Stop Your Window Manager (Yabai) Before Running `brew upgrade`

This one took me longer to figure out than I'd like to admit. Any time `brew upgrade` updated yabai, my system would lock up, a security popup would appear that I couldn't interact with because the window manager was in a broken state.

The cause was a race condition with launchd. yabai runs as a launchd service with `KeepAlive` enabled. When brew replaces the binary, yabai can exit mid-run and launchd immediately tries to restart it, before the old process has let go of its lock file at `/tmp/yabai_$USER.lock`. The new instance can't get the lock, aborts, and you're left with a dead window manager.

Stopping yabai before the upgrade prevents launchd from trying to respawn it during the process:

```bash
yabai --stop-service
skhd --stop-service

brew update && brew upgrade && brew cleanup

rm -f "/tmp/yabai_${USER}.lock"
yabai --start-service
skhd --start-service
```

`--stop-service` calls `launchctl bootout`, which fully unloads the service. The `rm -f` on the lock file is just extra insurance.

While I was digging through the logs I also noticed yabai was throwing errors on every startup for config commands that were removed in v7 — `window_topmost`, `window_border`, `window_border_width`. They had been in my config for a while without me noticing. Worth checking your own `yabairc` if you've upgraded without revisiting the config.

## NVM Doesn't Move Your Global Packages Automatically

When you install a new LTS version of Node, your globally installed packages don't carry over on their own. Worth knowing before you upgrade and wonder where everything went.

```bash
PREV_NODE="$(nvm version default)"
nvm install --lts
nvm alias default lts/*
nvm reinstall-packages "$PREV_NODE"
```

`nvm reinstall-packages` takes the previous version as an argument and reinstalls everything from it. Simple enough once you know it exists.

## Having a Script at All Is the Point

The main thing I got out of this is just having a record. The bootstrap is now the canonical list of what's on my machine. If I want to add something, I add it to the script. If I'm wondering why something is installed, I look there first.

The scripts themselves aren't complicated — a few hundred lines of bash, a list of packages, and some `defaults write` calls. The value is just in having something written down rather than relying on memory.

To give you a starting point, here's a stripped-down version of both scripts. Swap in your own packages and you're most of the way there.

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

Every section you add to one should go into the other. That's really the whole trick. The pattern is the same as above, just with more packages. Build yours around what you actually use. Start small and add to it as you go.
