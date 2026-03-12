#!/usr/bin/env python3
"""
Inject description field into _posts/*.md front matter from static site excerpts.
"""

import os
import re

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "_posts")

# Excerpts extracted from the static site article listings
DESCRIPTIONS = {
    "Yabai and SKHD Configs": "Snippets from my yabai and skhd configurations and scripts.",
    "Installing CLI Tools (fish, php, composer, nvm) with Arch Linux and Docker Image": "Just some notes from what I was experimenting with Arch Linux and setting up fish shell.",
    "Creating User Through Command Line on Linux (Ubuntu 20.04)": "Just some notes for creating a new user and setting up an environment on Linux (Ubuntu 20.04)",
    "Install Ubuntu and Docker Desktop for Windows 10 (Early 2021)": "Learn how to set up Ubuntu on Windows 10 using Window Subsystem for Linux (WSL)",
    "Common Composer Commands": "These are notes on using composer and basic commands that I commonly use to update, remove, and query packages.",
    "How to Quickly Change Node Versions Between Projects Using Nvm And Shell Scripting": "Learn how I quickly switch between node versions when working on different projects.",
    "How to quickly convert multiple word documents to PDFs on macOS": "Learn how to use soffice on the command line to quickly convert multiple word documents to pdf documents.",
    "Shell script functions that can take arguments as either named or abbreviated values": "Using case statements in shell script functions to pass in named or abbreviated parameters as arguments.",
    "Hide Desktop Icons in macOS": "Conducting a training or giving a presentation? Look more professional and hide your desktop.",
    "Fixing Foundation for Emails on node 10.15.3 in October 2019": "The Foundation for emails framework has not had a release since 2016. Here is how to fix the issues that come with using the outdated npm modules in 2019.",
    "Learning React Snippet (1)": "Snippet from React learning course.",
    "The Remote Workforce from a Developers Perspective": "Working remote is one of the privileges we have as developers, but it has it's down sides as well.",
    "Annual Plan 2019": "Learn, Teach, and be Positive. Learn new technologies in a methodical manner taking notes and documentation to refer back to in the future. Teach others how to improve themselves and their knowledge of software development. Create a positive environment that is conducive to learning and problem solving.",
    "What are/were your biggest challenges as a new software developer?": "For the longest time the most difficult challenge was finding a group of like minded people outside of school and work. Even today I have not found a face to face group of people to discuss web development with and explore new technologies.",
    "Generating Word Docs with Node, Pandoc, and Knex": "Using Node, Pandoc, and Knex to create Word Docs from database table.",
    "Features New to PHP7": "A few new PHP7 features that would be useful for frontend developers.",
    "Setting up Sublime Text 3 with Prettier on macOS High Sierra": "Learn how to setup Sublime Text with JsPretter and the Prettier CLI on macOS to format your code and enjoy more consistent formatting.",
    "Adding Empty Spaces to macOS Dock": "Having spaces in your docker sometimes makes it easier to organize your applications into groups.",
    "Helpful Docker Shell Script Aliases and Functions": "Quick shell script snippets for more easily working with docker commands. These are specific to my workflow, but maybe they'll help you with creating new ideas.",
    "Docker Notes": "These are just my notes while learning docker with some resources and basic commands.",
    "Sublime Text 3 Snippets": "Sublime Text Snippets can help you speed up your development time by reducing the need to manually typing out repetitive code. Learn how to create these snippets for different file types.",
    "Setting up WordPress Coding Standards (WPCS) Globally": "Coding a WordPress theme can be difficult when work on a team. And it's for this reason you should have a standard way to determine what quality code should look like. Learn how to setup the WordPress Coding Standard to help assist your team in writing maintainable code.",
    "Setting up PHPCS in Sublime Text 3": "Learn how to install the Sublime Text 3 PHPCS linter packages and view errors/warnings while you type your code.",
}


def split_front_matter(text):
    if not text.startswith("---"):
        return "", text
    end = text.find("---", 3)
    if end == -1:
        return "", text
    fm = text[: end + 3]
    body = text[end + 3 :]
    return fm, body


def get_title_from_fm(fm):
    """Extract the title value from raw front matter string."""
    m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return None


def inject_description(fm, description):
    """Insert description field after the title line."""
    escaped = description.replace('"', '\\"')
    new_line = f'description: "{escaped}"'
    # Insert after the title: line
    lines = fm.split("\n")
    result = []
    inserted = False
    for line in lines:
        result.append(line)
        if not inserted and re.match(r'^title:', line):
            result.append(new_line)
            inserted = True
    if not inserted:
        # Fallback: insert before closing ---
        result.insert(-1, new_line)
    return "\n".join(result)


posts = sorted(f for f in os.listdir(POSTS_DIR) if f.endswith(".md"))
updated = 0
skipped = 0

for filename in posts:
    path = os.path.join(POSTS_DIR, filename)
    with open(path, encoding="utf-8") as f:
        raw = f.read()

    fm, body = split_front_matter(raw)
    if not fm:
        print(f"  SKIP (no front matter): {filename}")
        skipped += 1
        continue

    if "description:" in fm:
        print(f"  SKIP (already has description): {filename}")
        skipped += 1
        continue

    title = get_title_from_fm(fm)
    if not title:
        print(f"  SKIP (no title found): {filename}")
        skipped += 1
        continue

    description = DESCRIPTIONS.get(title)
    if not description:
        print(f"  SKIP (no excerpt match): {filename}  [{title!r}]")
        skipped += 1
        continue

    new_fm = inject_description(fm, description)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_fm + body)

    print(f"  UPDATED: {filename}")
    updated += 1

print(f"\nDone. {updated} updated, {skipped} skipped.")
