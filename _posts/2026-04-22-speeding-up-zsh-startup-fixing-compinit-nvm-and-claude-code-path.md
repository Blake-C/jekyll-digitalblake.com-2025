---
layout: post
title: 'Faster Zsh Startup: compinit, NVM, and Claude Code PATH'
description: 'My zsh prompt took a second to appear, with compinit running three times. Profiling with zprof, fixing NVM, and stopping Claude Code losing Node.'
date: 2026-04-22 03:07:47 -0500
categories: ['Articles']
tags: ['macos', 'command-line', 'shell-script', 'zsh', 'claude-code', 'node', 'performance']
pillar: claude-code-ai
pillar_section: tooling
image: '/assets/uploads/2025/04/speeding-up-zsh-startup-fixing-compinit-nvm-and-claude-code-path-issues.webp'
---

Opening a new terminal tab paused before the prompt appeared, maybe 800ms, maybe a full second. It was not the kind of pause you file a bug report over, but I open tabs constantly, so it came up all day long, and it was long enough to feel every time.

The prompt worked, it was just slow, and I had been putting up with it for a long time.

I asked Claude Code to go through my dotfiles, profile what was happening, and help me fix it.

## Diagnosing the Problem

Zsh ships with a profiler in the [`zsh/zprof`](https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzprof-Module) module, so there is nothing to install. Add `zmodload zsh/zprof` at the top of your `.zshrc`, call `zprof` at the end of the file, then open a new shell and read the output.

The faster route is to run a timed non-interactive shell directly:

```bash
/usr/bin/time zsh -i -c exit
```

My output was:

```bash
1.04 real   0.55 user   0.41 sys
```

That is a full second to open a shell. To get the breakdown by function, I ran the profiler:

```bash
zsh -i -c 'zmodload zsh/zprof; source ~/.zshrc; zprof' 2>/dev/null | head -40
```

The output:

```bash
num  calls    time                  self            name
--------------------------------------------------------------
 1)    3       354ms   42.36%    354ms   42.36%   compdump
 2) 2457       192ms   23.05%    192ms   23.05%   compdef
 3)    3       767ms   91.76%    175ms   20.97%   compinit
 4)    6        45ms    5.39%     45ms    5.39%   compaudit
 5)    1        33ms    4.05%     33ms    4.02%   chruby_use
 6)    1        26ms    3.12%     26ms    3.12%   _awscli-homebrew-installed
```

`compinit` was being called **three times**, and those three calls accounted for over 91% of total startup time.

## Why compinit Is Expensive

[`compinit`](https://zsh.sourceforge.io/Doc/Release/Completion-System.html#Use-of-compinit) is the function that initializes Zsh's completion system. The first time it runs in a session it scans every directory in [`$fpath`](https://zsh.sourceforge.io/Doc/Release/Parameters.html#index-fpath), collects all the completion function files it finds, generates a dump file (`.zcompdump`), and then loads everything. My config had it doing that work three separate times on every shell open.

Here is how three calls ended up in my config:

**Call one**, in the Homebrew completion block:

```zsh
if type brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
  autoload -Uz compinit
  compinit
fi
```

**Call two**, in my `completion.zsh` file:

```zsh
autoload -Uz compinit && compinit
```

**Call three**, added by Docker Desktop at the bottom of my `.zshrc`:

```zsh
fpath=(/Users/me/.docker/completions $fpath)
autoload -Uz compinit
compinit
```

Each tool added its own block following its own documentation. None of those docs told me that I already had two other `compinit` calls. `compinit` only needs to run once per session, so all `fpath` additions have to happen before that single call, and the call should use a daily cache so the fpath scan only happens once every 24 hours instead of on every shell open.

## The Fix: One compinit, Once Per Day

At the top of your `.zshrc`, collect all your `fpath` additions before sourcing anything else:

```zsh
##################################
### fpath — must come before compinit
##################################

# Homebrew completions (hardcoded path avoids a slow subprocess)
[[ -d /opt/homebrew/share/zsh/site-functions ]] && FPATH="/opt/homebrew/share/zsh/site-functions:${FPATH}"

# Docker CLI completions
[[ -d ~/.docker/completions ]] && fpath=(~/.docker/completions $fpath)

# Any custom completions you have written
[[ -d ~/.config/zsh/zsh-completions ]] && fpath=(~/.config/zsh/zsh-completions $fpath)
```

Then, wherever you previously had your `compinit` call, replace it with the daily-cached version:

```zsh
autoload -Uz compinit
if [[ -n ${HOME}/.zcompdump(#qN.mh+24) ]]; then
  compinit
else
  compinit -C
fi
```

The `(#qN.mh+24)` is a Zsh [glob qualifier](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Glob-Qualifiers), where `.` matches plain files, `mh+24` matches a modification time more than 24 hours old, and `N` makes the pattern expand to nothing when it does not match. It evaluates to the dump file if it is older than 24 hours, and to nothing if it is fresh. So when the dump is more than 24 hours old, `compinit` runs fully and writes an updated dump. Otherwise `compinit -C` loads from the existing file without re-scanning `$fpath`. The `-C` flag is what saves the time, because it tells `compinit` to skip the check for new completion functions and use the dump file as it is.

Then remove every other `compinit` call in your config.

- the one in the Homebrew block
- the one Docker Desktop added
- any others you find

That leaves one `compinit` call in the config.

## The brew --prefix Subprocess

While I was in the Homebrew block, I noticed another small cost. The original code looked like this:

```zsh
FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
```

The `$(brew --prefix)` is a command substitution. It forks a subprocess, runs Homebrew, waits for the output, and then continues. On my machine [`brew --prefix`](https://docs.brew.sh/Manpage) always returns `/opt/homebrew`, so that fork was overhead on every shell open. Replace it with a direct path check:

```zsh
[[ -d /opt/homebrew/share/zsh/site-functions ]] && FPATH="/opt/homebrew/share/zsh/site-functions:${FPATH}"
```

If you are on Intel (older Mac), you might need `/usr/local` instead of `/opt/homebrew`. You can check once in a terminal with `brew --prefix` and then hardcode whatever it returns.

## Lazy-Loading Pyenv

My `pyenv` initialization was this:

```zsh
if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi
```

The [`eval "$(pyenv init -)"`](https://github.com/pyenv/pyenv#advanced-configuration) call forks a subprocess and injects a block of shell function code into your session. It runs even in shells where you never run Python.

The fix has two parts. First, add the pyenv shims directly to your `PATH`. [Shims](https://github.com/pyenv/pyenv#understanding-shims) are thin pre-generated wrapper scripts that pyenv puts in `~/.pyenv/shims/` and that pass each command along to pyenv. They let `python`, `python3`, and `pip` work without needing the full shell integration running:

```zsh
export PYENV_ROOT="$HOME/.pyenv"
[[ -d "$PYENV_ROOT/shims" ]] && export PATH="$PYENV_ROOT/shims:$PATH"
[[ -d "$PYENV_ROOT/bin" ]] && export PATH="$PYENV_ROOT/bin:$PATH"
```

Second, wrap the `pyenv` function so the full init only runs the first time you call `pyenv` yourself:

```zsh
function pyenv() {
  unfunction pyenv
  eval "$(command pyenv init -)"
  pyenv "$@"
}
```

The `unfunction pyenv` removes the wrapper, `pyenv init -` sets everything up, and then `pyenv "$@"` forwards your original arguments to the real command. After that first call, pyenv works normally for the rest of the session.

The tradeoff is narrower than it looks. The shims read the version themselves, [in the order `PYENV_VERSION`, then a `.python-version` file in the current directory, then the first one found in a parent directory, then the global version file](https://github.com/pyenv/pyenv#understanding-python-version-selection), so `.python-version` files are honored with no shell integration at all. What needs the function is `pyenv shell`, which sets `PYENV_VERSION` in the current shell and so will not take effect until you have called `pyenv` once in that session. Calling `pyenv local` works either way, because typing `pyenv` is what loads the full init.

## Claude Code and Lazy NVM: Node Missing From PATH

I have had lazy NVM loading in my config for years. NVM is slow to source and you only need it when you are running Node, so you define stub aliases for every Node-adjacent command, and the first time you run one of them the real NVM loads:

```zsh
if [ -s "$HOME/.nvm/nvm.sh" ] && [ ! "$(type -w __init_nvm)" = function ]; then
  declare -a __node_commands=('nvm' 'node' 'npm' 'npx' 'yarn' 'pnpm' 'prettier')

  function __init_nvm() {
    for i in "${__node_commands[@]}"; do unalias $i; done
    . "$NVM_DIR"/nvm.sh
    unset __node_commands
  }

  for i in "${__node_commands[@]}"; do
    alias $i='__init_nvm && '$i
  done
fi
```

The stub aliases work for interactive use, where you type a Node command yourself.

In April 2026 Claude Code was distributed as a Node application, which is what this section describes. Anthropic has since changed that, and the npm package now installs the same native binary as the standalone installer, so the `claude` binary no longer invokes Node itself. Back then, installing it globally with `npm install -g @anthropic-ai/claude-code` put the `claude` binary inside your NVM versions directory, at a path like `~/.nvm/versions/node/v22.0.0/bin/claude`. When your shell is fully initialized and NVM is loaded, that directory is in your `PATH`, and `claude` works fine.

But the lazy loading setup means NVM does not load until you type `node` or `npm` or something on that alias list. If Claude Code ever needs to spawn a Node process in a context where the aliases have not yet been triggered, such as when it is invoked from an IDE or another process, it gets a `PATH` that has no `node` in it.

The fix is to make the actual Node binary available in `PATH` at shell startup, without loading all of NVM. You read the default version from NVM's alias file and prepend that version's bin directory:

```zsh
# Put the default node version's bin into PATH at startup.
# This lets claude and other tools find `node` immediately,
# without triggering the full NVM load.
if [[ -s "$NVM_DIR/alias/default" ]]; then
  export PATH="$NVM_DIR/versions/node/$(cat $NVM_DIR/alias/default)/bin:$PATH"
fi
```

NVM stores its default alias at `$NVM_DIR/alias/default`. That file contains just the version string, such as `v22.0.0`, or a reference like [`lts/*`](https://github.com/nvm-sh/nvm#long-term-support) which NVM resolves at load time.

If your default alias is an alias name such as `lts/*`, `cat $NVM_DIR/alias/default` returns that name, so the path built from it will not exist. In that case you either pin your default to a specific version (`nvm alias default 22`) or resolve it at startup:

```zsh
if [[ -s "$NVM_DIR/alias/default" ]]; then
  _nvm_default=$(cat "$NVM_DIR/alias/default")
  # Resolve through indirect aliases if needed
  while [[ -f "$NVM_DIR/alias/$_nvm_default" ]]; do
    _nvm_default=$(cat "$NVM_DIR/alias/$_nvm_default")
  done
  export PATH="$NVM_DIR/versions/node/$_nvm_default/bin:$PATH"
  unset _nvm_default
fi
```

With this in place, `claude` is in `PATH` from the moment the shell finishes loading, the lazy NVM aliases still work exactly as before, and the full NVM source only happens when you actually need version management.

As of July 2026, my `.zshrc` no longer uses NVM. It runs `eval "$(fnm env --use-on-cd --version-file-strategy=recursive --shell zsh)"` instead, and that output puts an [fnm](https://github.com/Schniz/fnm#shell-setup)-managed bin directory on `PATH` when the shell starts and registers a `chpwd` hook that switches versions on `cd`. `node` is therefore on `PATH` with no lazy-load step, and the conflict above does not come up. The `compinit` cache, the consolidated `fpath` block, and the lazy `pyenv` function are all still what my config does today.

I also [built a companion extension that patches the Claude Code VS Code extension]({% post_url 2026-05-09-patching-the-claude-code-vscode-extension %}) to change five defaults that kept getting in my way.

## Startup Time After the Changes

After all of these changes, running the timing test again:

```bash
/usr/bin/time zsh -i -c exit
```

Output:

```bash
0.17 real   0.08 user   0.06 sys
```

Startup went from just over a second down to 170ms, an 84% reduction, and the difference was noticeable when opening tabs.

## What to Check in Your Own Config

If you are dealing with a slow Zsh prompt, work through it in this order.

**Profile first.** Add `zmodload zsh/zprof` at the top of your `.zshrc` and `zprof` at the bottom, open a new shell, and read the numbers. Or just run `/usr/bin/time zsh -i -c exit` to get the wall clock time.

**Count your `compinit` calls.** Search your entire config for `compinit` and `compdef`. Every call after the first repeats the same fpath scan and dump. Consolidate all `fpath` additions before a single `compinit`, and use the 24-hour cache pattern.

**Look for command substitutions at startup.** Any `$(some-command)` that runs during shell init is forking a subprocess. `$(brew --prefix)`, `$(git rev-parse HEAD)`, and `$(rbenv version-name)` all have a startup cost. If the value never changes, hardcode it. If it changes rarely, consider caching it.

**Lazy-load version managers.** NVM, RVM, pyenv, and similar tools all add to startup time. If you do not need the full shell integration active in every terminal session, add the relevant shims or bin directories to `PATH` directly and defer the full init.

**Check what your tools added to your config.** Docker Desktop, Homebrew, AWS CLI, and others often inject lines into your `.zshrc` during installation. Each installer follows its own documentation and does not check what is already there, so read through your config for duplicate blocks from time to time.

**Delete commented-out code.** This does not affect performance, but it makes the config easier to read and the real problems easier to spot.

My `.zshrc` grew over years, one tool's install block at a time, until it held three `compinit` calls, a `brew --prefix` subprocess, and a full `pyenv init` that ran in every shell. Profiling it and cleaning it up brought startup from just over a second down to 170ms.
