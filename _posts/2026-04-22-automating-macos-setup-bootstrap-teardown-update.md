---
layout: post
title: 'Automating macOS Setup with Bootstrap and Teardown Scripts'
description: 'How I replaced an afternoon of new-Mac setup with bootstrap.sh, and why the teardown script has to be written at the same time.'
date: 2026-04-22 17:44:08 CDT -0500
modified_date: 2026-07-29 20:04:04 -0500
categories: ['Articles']
tags: ['macos', 'shell-script', 'command-line', 'homebrew', 'dot-files', 'yabai', 'automation']
pillar: shell-macos
pillar_section: macos
image: 'assets/uploads/2025/04/automating-macos-setup-bootstrap-teardown-and-keeping-it-all-in-sync.webp'
---

Every time I had to set up a new Mac I would spend an hour or two clicking through installers, reconfiguring dot files, and trying to remember which global npm packages I actually cared about, so I wrote `bootstrap.sh` to handle most of the setup.

`bootstrap.sh` provisions a new machine, `teardown.sh` removes what bootstrap installed, and a shell function called `update_cli` keeps an existing machine current in between. There were things I had to fix along the way, and I am sure there are still edge cases I haven't hit yet.

## Using the Bootstrap as the Record of What Is Installed

The bootstrap is now the canonical list of what's on my machine. If I want to add something, I add it to the script. If I'm wondering why something is installed, I look there first.

Each script is a few hundred lines of bash, a list of packages, and some `defaults write` calls. Having it written down means I'm not relying on memory for any of it.

## What the Three Pieces Look Like

Below is a stripped-down version of all three. Swap in your own packages.

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

**update_cli**

```bash
update_cli() {
    local RUNUPDATE
    vared -p "Run Updates? (y/n): " -c RUNUPDATE
    [[ "$RUNUPDATE" != "y" ]] && { warn "No updates ran"; return; }

    # Homebrew, with yabai stopped so launchd can't restart it mid-upgrade
    command -v yabai >/dev/null 2>&1 && yabai --stop-service || true

    brew update && brew upgrade && brew cleanup && brew autoremove

    rm -f "/tmp/yabai_${USER}.lock"
    command -v yabai >/dev/null 2>&1 && yabai --start-service || true

    # Composer globals
    composer global self-update
    composer global upgrade

    # Node, then reactivate the package manager shims in the new version
    if command -v fnm >/dev/null 2>&1; then
        fnm install --lts
        fnm default lts-latest
        fnm use lts-latest
        corepack enable && corepack prepare pnpm@latest --activate
    fi

    # Python
    pip3 install --upgrade pip
    pip3 list --outdated --format=freeze | cut -d= -f1 | xargs -r pip3 install --upgrade || true

    # Submodules in the setup repo itself
    git -C "$REPO_ROOT" submodule update --remote --merge

    success "Done"
}
```

Every section you add to one of these should go into the other two. My own versions follow the same pattern with more packages in them.

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

Both scripts live in a git repo alongside the dot files they symlink, so the repo has to be on the machine before `bootstrap.sh` can run. My repo also has seventeen submodules, which hold the zsh plugins and the Powerlevel10k theme among other things, and those have to be initialized or the directories the symlinks point at are empty.

Downloading the repo as a zip does not work, because a zip has no `.git` directory and `git submodule update --init` needs one. So the repo has to be cloned over SSH, which means an SSH key has to exist on the machine before any of the automation runs. I create that first key by hand.

Bootstrap generates a second key for GitHub once it is running:

```bash
ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)" -f "$SSH_KEY" -N ""
eval "$(ssh-agent -s)"
ssh-add "$SSH_KEY"
```

It prints the public key with a link to GitHub's key settings page, and the `ssh -T` check above confirms the key was added before the script clones the submodules.

## Homebrew Won't Be on PATH Right After You Install It

Bootstrap installs Homebrew and then installs packages with it, and those two steps happen in the same shell. The installer does not add `brew` to PATH in the shell that ran it, so any `brew` command immediately after the install fails.

Homebrew's [installation docs](https://docs.brew.sh/Installation) say to add `eval "$(brew shellenv)"` to your shell config, and the script runs the same line right after installing so `brew` works in the current session:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
```

## Node Through fnm Needs the Same Treatment

Bootstrap installs the Node version manager [fnm](https://github.com/Schniz/fnm) with `brew install fnm`, and then `node` still does not exist in that shell until fnm's environment is evaluated:

```bash
brew install fnm
eval "$(fnm env --shell bash)"
fnm install --lts
fnm use lts-latest
fnm default lts-latest
```

npm's [`prefix` defaults to the location where node is installed](https://docs.npmjs.com/cli/v11/configuring-npm/folders), and global installs go into `{prefix}/lib/node_modules`, so under fnm each Node version gets its own set of global packages. That is why they go in after a version is selected and made the default. The script installs pnpm and checks first so a re-run does not reinstall it:

```bash
if ! npm list -g pnpm --depth=0 >/dev/null 2>&1; then
    npm install -g pnpm
fi
```

## Bootstrap Sets Up, update_cli Maintains, Teardown Removes

Bootstrap runs once, on a machine that has nothing on it. Teardown runs once, when I am done with the machine. Everything in between is maintenance, and that runs through `update_cli`, a shell function that prompts once and then updates Homebrew, Composer, and the rest of the package managers in order.

Bootstrap installs a package that is not there yet, and `update_cli` replaces a package that is running.

## Stop Your Window Manager Before update_cli Touches It

Any time `brew upgrade` updated yabai, my system would lock up and a security popup would appear that I couldn't interact with, because the window manager was in a broken state.

The cause was a race condition with launchd. yabai runs as a launchd service whose `KeepAlive` is a dictionary rather than a plain `true`, setting `SuccessfulExit` to `false` and `Crashed` to `true`. That means launchd restarts yabai when it exits with a non-zero status or crashes, which is exactly what happens when brew replaces the binary underneath a running process. launchd starts the new instance before the old one has released its lock file at `/tmp/yabai_$USER.lock`, so the new instance can't get the lock and aborts, which leaves the window manager stopped.

The fix is to stop yabai first, which is what the `yabai --stop-service` and `yabai --start-service` calls around the brew commands in the `update_cli` example above do.

`--stop-service` [calls `launchctl bootout`](https://github.com/koekeishiya/yabai/blob/master/src/misc/service.h), which unloads the service. The `rm -f` on the lock file is there in case the old process left it behind.

The logs also showed an error on every yabai startup for three config commands that [v7.0.0 removed](https://github.com/koekeishiya/yabai/blob/master/CHANGELOG.md):

- `window_topmost`
- `window_border`
- `window_border_width`

All three had been sitting in my `yabairc` since before the upgrade. Check your own `yabairc` if you've upgraded yabai without revisiting the config.

## Where That Leaves the Setup

Setting up a new Mac now takes one SSH key made by hand, one clone, and one script.

Three of the fixes came from a command not behaving the way the script assumed. `ssh -T` returns `1` after a successful authentication. `brew` is not callable in the shell that just installed it. `node` does not exist until fnm's environment is evaluated. Each one needed a line in the script.

Teardown gets edited alongside bootstrap, so the two do not drift again. Upgrades go through `update_cli`, which stops yabai before Homebrew replaces it.
