---
layout: post
title: 'Patching the Claude Code VS Code Extension'
description: 'The official Claude Code extension had five behaviors that added friction to my workflow. Rather than waiting, I built a companion extension that patches it in-place.'
date: 2026-05-09 00:19:51 -0500
categories: ['Articles']
tags: ['claude-code', 'vscode', 'extension', 'developer-tools', 'typescript']
pillar: claude-code-ai
pillar_section: tooling
image: assets/uploads/2025/05/patching-the-claude-code-vs-code-extension-social-share-image.webp
---

The official [Claude Code extension for VS Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) is good enough that I use it constantly. That's precisely why five small behaviors became impossible to ignore. They weren't bugs exactly, more like defaults that didn't match the way I work. I don't know when or whether Anthropic will change them upstream, so I stopped waiting and built a companion extension that patches Claude Code directly.

The extension, [`claude-overwrite-features-vscode`](https://github.com/Blake-C/claude-overwrite-features-vscode), installs alongside the official extension. When VS Code starts, it locates the Claude Code installation, applies a set of targeted string replacements to three of its files, and backs up the originals. If Claude Code is updated, the extension detects the version change and re-applies the patches automatically.

## The Five Patches

**Include-file toggle defaults to OFF.** The chat footer has a button that attaches the currently open file or selection to your next message. By default it's always on. That meant every message I sent included whatever file happened to be open, whether I wanted it or not. The patch flips the initial state to disabled. If I want to include the file, I toggle it on. If I don't, it stays out of the way.

**Attachments are withheld from slash commands.** When you have files attached and type `/compact`, those attachments get sent along with the compaction command. The result is that the files are consumed and cleared, so they don't survive to the next regular message. The patch intercepts slash command submissions and strips attachments from them, so files stay attached for the next real message you send.

**Compact button requires confirmation.** The context usage indicator in the chat footer also acts as a button that triggers compaction immediately when clicked. I misclicked it more than once mid-thought and lost context I wanted to keep. The patch intercepts that click and shows a dialog first, styled with VS Code's own theme CSS variables so it doesn't look out of place.

**Plan mode respects `~/.claude/settings.json` permissions.** Claude Code has a permissions system that lets you allow specific commands without being prompted every time. In plan mode, that allow list wasn't being checked, so every command still prompted regardless. The patch extends the permission-checking logic to read `~/.claude/settings.json` and apply the user's `allow` list during plan mode, including wildcard rules.

**Panel title shows "Claude Code - Patched."** A small one. The extension patches the display names in `package.json` so the sidebar and panel show "Claude Code - Patched" instead of "Claude Code." It's the fastest way to confirm at a glance that the patched version is loaded and active.

## How It Works

The extension activates on the `onStartupFinished` event and locates Claude Code via `vscode.extensions.getExtension('anthropic.claude-code')`. From there it applies string replacements to three files inside the Claude Code installation: the minified React webview bundle (about 4.8 MB), `extension.js`, and `package.json`.

Each patch is defined as a `from` / `to` pair. Applying runs `from` -> `to`; reverting swaps them. The extension verifies each pattern is unique before touching anything, backs up originals on first run, and logs the result of every patch to an output channel: applied, already applied, or pattern not found.

The command palette exposes both an apply command and a revert command, so you can roll back to stock Claude Code without reinstalling.

## The Trade-off

Patching minified code is fragile. If Anthropic ships a Claude Code update that changes the specific code paths these patches target, the patterns won't match and you'll see "pattern not found" in the output channel instead of "applied." The version tracking means you know immediately when that happens rather than running silently on stale patches.

That's the cost of this approach. For personal tooling I'm comfortable maintaining it myself when it breaks. The alternative was accepting defaults that actively got in my way every day.

The extension is about 350 lines of TypeScript. The repository is [on GitHub](https://github.com/Blake-C/claude-overwrite-features-vscode).
