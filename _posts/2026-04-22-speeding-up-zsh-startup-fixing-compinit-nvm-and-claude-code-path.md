---
layout: post
title: 'Speeding Up Zsh Startup: Fixing compinit, NVM, and Claude Code PATH Issues'
description: 'My terminal was taking over a second to show a prompt. One profiling command later, the culprit was obvious: compinit running three times. Here is what I found, how I fixed it, and how I made Claude Code stop losing track of Node.'
date: 2026-04-22 03:07:47 -0500
categories: ['Articles']
tags: ['macos', 'command-line', 'shell-script', 'zsh', 'claude-code', 'node', 'performance']
image: 'assets/uploads/2025/04/speeding-up-zsh-startup-fixing-compinit-nvm-and-claude-code-path-issues.webp'
---

There is a specific kind of developer frustration that does not announce itself loudly. It just slowly grinds you down. You open a new terminal tab, and there is a pause. Not a long pause. Maybe 800ms. Maybe a full second. Nothing worth filing a bug report over. But you open tabs constantly, and over the course of a day that lag adds up into something you notice, something that breaks your flow in that quiet, hard-to-articulate way.

That was my situation. My prompt was slow. Not broken, just slow. And I had been tolerating it long enough.

I asked Claude Code to go through my dotfiles, profile what was happening, and help me fix it. What followed was a good reminder that performance problems rarely look dramatic in code — they hide in duplication, in patterns that made sense when you added them and then accumulated over years into something expensive.

## Diagnosing the Problem

The first step is always measurement. Guessing at what is slow is a waste of time. Zsh ships with a built-in profiler called `zprof`. You do not need to install anything. You just add `zmodload zsh/zprof` at the top of your `.zshrc`, then call `zprof` at the end of the file, open a new shell, and read the output.

The faster route is to run a timed non-interactive shell directly:

```bash
/usr/bin/time zsh -i -c exit
```

My output was:

```
1.04 real   0.55 user   0.41 sys
```

A full second. For a shell prompt. That is not acceptable when you know what a well-configured shell feels like. To get the breakdown by function, I ran the profiler properly:

```bash
zsh -i -c 'zmodload zsh/zprof; source ~/.zshrc; zprof' 2>/dev/null | head -40
```

The output told the whole story immediately:

```
num  calls    time                  self            name
--------------------------------------------------------------
 1)    3       354ms   42.36%    354ms   42.36%   compdump
 2) 2457       192ms   23.05%    192ms   23.05%   compdef
 3)    3       767ms   91.76%    175ms   20.97%   compinit
 4)    6        45ms    5.39%     45ms    5.39%   compaudit
 5)    1        33ms    4.05%     33ms    4.02%   chruby_use
 6)    1        26ms    3.12%     26ms    3.12%   _awscli-homebrew-installed
```

Two things jumped out immediately. First, `compinit` was being called **three times**. Second, it was consuming over 91% of total startup time. Everything else was noise by comparison.

## Why compinit Is Expensive

`compinit` is the function that initializes Zsh's completion system. The first time it runs in a session it scans every directory in `$fpath`, collects all the completion function files it finds, generates a dump file (`.zcompdump`), and then loads everything. It is doing real work. The problem is that I had told it to do that work three separate times every single time I opened a shell.

Here is how three calls ended up in my config:

**Call one** — in the Homebrew completion block:

```zsh
if type brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
  autoload -Uz compinit
  compinit
fi
```

**Call two** — in my `completion.zsh` file:

```zsh
autoload -Uz compinit && compinit
```

**Call three** — added by Docker Desktop at the bottom of my `.zshrc`:

```zsh
fpath=(/Users/me/.docker/completions $fpath)
autoload -Uz compinit
compinit
```

Each tool added its own block following its own documentation. None of those docs told me that I already had two other `compinit` calls. The fix is to understand that `compinit` is a one-time-per-session operation, not something each tool gets to call independently. All `fpath` additions must happen before a single `compinit`, and that one call should use a daily cache so the fpath scan only happens once every 24 hours instead of every shell open.

## The Fix: One compinit, Once Per Day

The pattern is straightforward. At the top of your `.zshrc`, collect all your `fpath` additions before sourcing anything else:

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

The `(#qN.mh+24)` is a Zsh glob qualifier. It evaluates to the dump file if it is older than 24 hours, and to nothing if it is fresh. On a fresh dump, `compinit` runs fully and writes an updated dump. On a cached dump, `compinit -C` loads from that file without re-scanning `$fpath`. The `-C` flag is the thing doing the heavy lifting here — it tells Zsh to trust the cache completely.

Then remove every other `compinit` call in your config. Delete the one from the Homebrew block, delete the one Docker added, delete any others. There is only one now, and it lives in one place you control.

## The brew --prefix Subprocess

While I was in the Homebrew block, I noticed another small cost. The original code looked like this:

```zsh
FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
```

The `$(brew --prefix)` is a command substitution. It forks a subprocess, runs Homebrew, waits for the output, and then continues. On my machine that path is always `/opt/homebrew`. It never changes. So this fork was pure overhead on every single shell open. Replace it with a direct path check:

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

The `eval "$(pyenv init -)"` call forks a subprocess and injects a block of shell function code into your session. It is not as expensive as the compinit situation, but it is measurable overhead that runs even in shells where you will never touch Python.

The fix has two parts. First, add the pyenv shims directly to your `PATH`. Shims are thin pre-generated wrapper scripts that pyenv puts in `~/.pyenv/shims/`. They let `python`, `python3`, and `pip` work without needing the full shell integration running:

```zsh
export PYENV_ROOT="$HOME/.pyenv"
[[ -d "$PYENV_ROOT/shims" ]] && export PATH="$PYENV_ROOT/shims:$PATH"
[[ -d "$PYENV_ROOT/bin" ]] && export PATH="$PYENV_ROOT/bin:$PATH"
```

Second, wrap the `pyenv` function so the full init only fires when you actually call `pyenv` for real:

```zsh
function pyenv() {
  unfunction pyenv
  eval "$(command pyenv init -)"
  pyenv "$@"
}
```

The `unfunction pyenv` removes the wrapper, `pyenv init -` sets everything up, and then `pyenv "$@"` forwards your original arguments to the real command. After that first call, pyenv works normally for the rest of the session.

The tradeoff is that `pyenv shell`, `pyenv local`, and other version-switching commands will not take effect until you call `pyenv` for the first time in a given terminal session. If your Python work always starts with running `pyenv` explicitly that is a non-issue. If you rely on `.python-version` files being respected automatically when you `cd`, you will want to keep the full `pyenv init -` and accept the startup cost.

## Claude Code and Lazy NVM: A Specific Conflict

This one took a bit more thought. I have had lazy NVM loading in my config for years. The idea is simple: NVM is slow to source, but you only need it when you are actually using Node. So you define stub aliases for every Node-adjacent command, and the first time you run one of them the real NVM loads:

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

This works perfectly for interactive use. The problem is Claude Code.

Claude Code is a Node application. When you install it globally with `npm install -g @anthropic-ai/claude-code`, the `claude` binary lands somewhere inside your NVM versions directory — something like `~/.nvm/versions/node/v22.0.0/bin/claude`. When your shell is fully initialized and NVM is loaded, that directory is in your `PATH`, and `claude` works fine.

But the lazy loading setup means NVM does not load until you type `node` or `npm` or something on that alias list. If Claude Code ever needs to spawn a Node process in a context where the aliases have not yet been triggered — like when it is doing something behind the scenes, or when it is invoked from a tool like an IDE or another process — it hits a `PATH` that has no `node` in it.

The fix is to make the actual Node binary available in `PATH` at shell startup, without loading all of NVM. You read the default version from NVM's alias file and prepend that version's bin directory:

```zsh
# Put the default node version's bin into PATH at startup.
# This lets claude and other tools find `node` immediately,
# without triggering the full NVM load.
if [[ -s "$NVM_DIR/alias/default" ]]; then
  export PATH="$NVM_DIR/versions/node/$(cat $NVM_DIR/alias/default)/bin:$PATH"
fi
```

NVM stores its default alias at `$NVM_DIR/alias/default`. That file contains just the version string — something like `v22.0.0` or a reference like `lts/*` which NVM resolves at load time.

A note: if your default alias is something like `lts/*` rather than a pinned version, `cat $NVM_DIR/alias/default` will return the alias name, not the resolved version, and the path will not exist. In that case you either pin your default to a specific version (`nvm alias default 22`) or resolve it at startup:

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

## The Result

After all of these changes, running the timing test again:

```bash
/usr/bin/time zsh -i -c exit
```

Output:

```
0.17 real   0.08 user   0.06 sys
```

From just over a second down to 170ms. An 84% reduction, and it felt immediately different when opening tabs.

## Summary of What to Check in Your Own Config

If you are dealing with a slow Zsh prompt, here is the order I would work through it:

**Profile first.** Do not guess. Add `zmodload zsh/zprof` at the top of your `.zshrc` and `zprof` at the bottom, open a new shell, and read the numbers. Or just run `/usr/bin/time zsh -i -c exit` to get the wall clock time.

**Count your `compinit` calls.** Search your entire config for `compinit` and `compdef`. Every call beyond the first is waste. Consolidate all `fpath` additions before a single `compinit`, and use the 24-hour cache pattern.

**Look for command substitutions at startup.** Any `$(some-command)` that runs during shell init is forking a subprocess. `$(brew --prefix)`, `$(git rev-parse HEAD)`, `$(rbenv version-name)` — all of these have startup cost. If the value never changes, hardcode it. If it changes rarely, consider caching it.

**Lazy-load version managers.** NVM, RVM, pyenv, and friends all have non-trivial startup overhead. If you do not need the full shell integration active in every terminal session, add the relevant shims or bin directories to `PATH` directly and defer the full init.

**Check what your tools added without telling you.** Docker Desktop, Homebrew, AWS CLI, and others often inject lines into your `.zshrc` during installation. They tend to follow their own documentation without regard for what is already there. A periodic audit of your config for duplicate patterns is worth doing.

**Delete commented-out code.** This does not affect performance, but it reduces the cognitive load of reading your config, which makes it easier to catch the actual problems.

The shell config is one of those things that grows over years without any single change ever feeling significant. The result is a file that works fine but carries a lot of weight from previous decisions, previous jobs, previous projects. Taking an hour to profile it and clean it up is consistently worth the time.
