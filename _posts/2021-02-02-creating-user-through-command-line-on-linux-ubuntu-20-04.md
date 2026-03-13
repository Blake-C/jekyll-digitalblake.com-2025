---
layout: post
title: 'Creating User Through Command Line on Linux (Ubuntu 20.04)'
description: 'Just some notes for creating a new user and setting up an environment on Linux (Ubuntu 20.04)'
date: 2021-02-02 23:37:13 -0600
modified_date: 2021-02-03 01:43:14 -0600
categories: ['Notes']
tags: ['command-line', 'linux', 'ubuntu']
image: '/assets/uploads/2021/02/random-1-1200x630-facebook-share.webp'
---

![](/assets/uploads/2021/02/random-1.webp)

Adding new user, change USERNAME with the name you want to use.

```bash
adduser USERNAME
usermod -aG sudo USERNAME

# switch to user
su - USERNAME
```

Log out and log back in as new user. Be sure to add SSH key to new users ~/.ssh if using SSH to login.

Change directory user and group:

```bash
# changes recursively
sudo chown -R username:group directory

# changes only the directory
sudo chown username:group directory
```

To add zsh and OMZ:

```bash
sudo apt update
sudo apt install zsh
chsh -s $(which zsh)
```

Follow these instructions to install OMZ:

- [https://ohmyz.sh/#install](https://ohmyz.sh/#install)

```bash
vim ~/.zshrc

# add:
alias l="ls --color -lahGg --group-directories-first --time-style='+ %a. %b %d %Y - %r '"
alias ll="ls --color -lah --group-directories-first"

# if the above does not work, run:
sudo apt install coreutils

# load in zshrc changes
source ~/.zshrc
```
