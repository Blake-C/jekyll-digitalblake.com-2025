---
layout: post
title: 'Patching the Claude Code VS Code Extension'
description: 'Five defaults in the Claude Code VS Code extension I changed with a companion extension that patches its files and re-applies after every update.'
date: 2026-05-09 00:19:51 -0500
modified_date: 2026-07-29 14:44:51 CDT -0500
categories: ['Articles']
tags: ['claude-code', 'vscode', 'extension', 'developer-tools', 'typescript']
pillar: claude-code-ai
pillar_section: tooling
image: '/assets/uploads/2025/05/patching-the-claude-code-vs-code-extension-social-share-image.webp'
---

I use the official [Claude Code extension for VS Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) very regularly, and in order to fix five issues that I had with it and to make it match more with how I work, I created a companion extension to patch them.

The extension, [`claude-overwrite-features-vscode`](https://github.com/Blake-C/claude-overwrite-features-vscode), installs alongside the official extension. When VS Code starts, it locates the Claude Code installation, applies a set of string replacements to three of its files, and backs up the originals. If Claude Code is updated, the extension detects the version change and re-applies the patches automatically.

## The Five Patches

**Include-file toggle defaults to OFF.** The chat footer has a button that attaches the currently open file or selection to your next message. By default it's always on. That meant every message I sent included whatever file was open. The patch flips the initial state to disabled. I can still toggle it on for a message.

**Attachments are withheld from slash commands.** When you have files attached and type `/compact`, those attachments get sent along with the compaction command. The files are consumed and cleared, so they are not still attached for the next regular message. The patch intercepts slash command submissions and strips attachments from them, so files stay attached for the next real message you send.

**Compact button requires confirmation.** The context usage indicator in the chat footer also acts as a button that triggers compaction immediately when clicked. I misclicked it more than once and lost context I wanted to keep. The patch intercepts that click and shows a dialog first, styled with VS Code's own theme CSS variables.

**Plan mode respects `~/.claude/settings.json` permissions.** Claude Code has a permissions system that lets you allow specific commands without being prompted every time. In plan mode, Claude Code wasn't checking the allow list, so every command still prompted. The patch extends the permission-checking logic to read `~/.claude/settings.json` and apply the user's `allow` and `deny` lists during plan mode, including wildcard rules. A tool that matches a deny rule still prompts, even if an allow rule also matches it.

**Panel title shows "Claude Code - Patched."** The extension patches the display names in `package.json` so the sidebar and panel show "Claude Code - Patched" instead of "Claude Code." The title tells me the patched version is loaded and active.

## How It Works

The extension activates on the `onStartupFinished` event and locates Claude Code via `vscode.extensions.getExtension('anthropic.claude-code')`. From there it applies string replacements to three files inside the Claude Code installation.

- the minified React webview bundle (about 4.8 MB)
- `extension.js`
- `package.json`

Each patch is defined as a `from` / `to` pair. Applying runs `from` -> `to`; reverting swaps them. The extension checks that the pattern is present and not already patched before writing, backs up originals on first run, and logs the result of every patch to an output channel as applied, already applied, or pattern not found.

The command palette exposes seven commands, including an apply command and a revert command, so you can roll back to stock Claude Code without reinstalling.

## The Trade-off

Patching minified code is fragile. If a Claude Code update changes the specific code paths these patches target, the patterns won't match and you'll see "pattern not found" in the output channel instead of "applied." The version tracking means the output channel reports the failure on the next startup instead of leaving the stale patches in place unreported.

For personal tooling I'm comfortable maintaining it myself when it breaks.

The extension is 729 lines of TypeScript across four files. The repository is [on GitHub](https://github.com/Blake-C/claude-overwrite-features-vscode).

---

**Updated July 29, 2026:** The extension has kept growing since this was written. It now also routes Claude Code to a local Ollama model instead of the Anthropic API, and the command palette exposes seven commands rather than two. The five patches described above still work the same way. The repository has the current behavior.
