---
layout: post
title: "How to Quickly Change Node Versions Between Projects Using Nvm And Shell Scripting"
description: "Learn how I quickly switch between node versions when working on different projects."
date: 2020-05-09 03:16:08 -0500
modified_date: 2020-10-02 21:09:51 -0500
categories: ["Snippets"]
tags: ["command-line", "learning", "macos", "node", "shell-script"]
image: "/assets/uploads/2020/05/facebook.webp"
---

I switch between projects that use different versions of node very often. What I typically have to do is open the
    package.json and find the node version then use nvm to switch to that node version. I do this often enough that I
    wanted to automate this process to save some time.

## Here is my solution:

I have a function to find the node version and a function to switch to that version.

First, in the `what_node` function I use [ripgrep](https://github.com/BurntSushi/ripgrep) (rg)
    to find the line in the `package.json` file that holds the node version. Note I’m only looking in
    the current directory as some sub directories could have their own `package.json` files.

Make sure line numbers and the filenames are turned off in the output to get clean results.

```bash
> rg \"node\" 'package.json' --no-line-number --no-filename
    "node": "10.15.0"
```

Then I `awk` this over using the colon as the delimiter.

```bash
> rg \"node\" 'package.json' --no-line-number --no-filename | awk -F ':' '{print $2}'
 "10.15.0"
```

Now that we have our node version I clean this up with
    [translate](http://linuxcommand.org/lc3_man_pages/tr1.html) (tr) to remove the quite and any white space.

```bash
> rg \"node\" 'package.json' --no-line-number --no-filename | awk -F ':' '{print $2}' | tr -dc '0-9.\n'
10.15.0
```

Next is to create a function that will take our node version and switch us over to it using
    [nvm](https://github.com/nvm-sh/nvm). Because `nvm` might not have the exact version of node I
    need for this project I `awk` the node version to get the major version number and save this in a
    variable.

```bash
> what_node | awk -F '.' '{print $1}'
10
```

Finally, I use this variable as a check to see if it found anything and with use nvm to switch to that version or
    output a message telling me no node version was found.

## Put together this is what you get:

```bash
what_node() {
    rg \"node\" 'package.json' --no-line-number --no-filename | awk -F ':' '{print $2}' | tr -dc '0-9.\n'
}

switch_node() {
    local NODE_VERSION=$(what_node | awk -F '.' '{print $1}')
    if [ -z "${NODE_VERSION}" ]; then
        echo "\nNo node version found.\n"
    else
        echo "Project wants node: \e[32m$(what_node)\e[m"
        printf "\e[33m"
        nvm use "v$NODE_VERSION"
        printf "\e[m"
    fi
}
```

Usage:

```bash
> switch_node
Project wants node: 10.15.0
Now using node v10.18.1 (npm v6.13.4)
```

You would place these shell script functions in your
    `.bash_profile` or `.zshrc` files depending on what shell you are using.
