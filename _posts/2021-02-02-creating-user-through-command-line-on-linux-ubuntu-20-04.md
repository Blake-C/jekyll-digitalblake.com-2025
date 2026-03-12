---
layout: post
title: "Creating User Through Command Line on Linux (Ubuntu 20.04)"
date: 2021-02-02 23:37:13 -0600
modified_date: 2021-02-03 01:43:14 -0600
categories: ["Notes"]
tags: ["command-line", "linux", "ubuntu"]
image: "/assets/uploads/2021/02/random-1-1200x630-facebook-share.webp"
---

![](/assets/uploads/2021/02/random-1.webp)

Adding new user, change USERNAME with the name you want to use.

<pre class="wp-block-code lang-bash line-numbers"><code>adduser USERNAME
usermod -aG sudo USERNAME

# switch to user
su - USERNAME</code></pre>

Log out and log back in as new user. Be sure to add SSH key to new users ~/.ssh if using SSH to login.

Change directory user and group:

<pre class="wp-block-code lang-bash line-numbers"><code># changes recursively
sudo chown -R username:group directory

# changes only the directory
sudo chown username:group directory</code></pre>

To add zsh and OMZ:

<pre class="wp-block-code lang-bash line-numbers"><code>sudo apt update
sudo apt install zsh
chsh -s $(which zsh)</code></pre>

Follow these instructions to install OMZ:

- [https://ohmyz.sh/#install](https://ohmyz.sh/#install)

<pre class="wp-block-code lang-bash line-numbers"><code>vim ~/.zshrc

# add:
alias l="ls --color -lahGg --group-directories-first --time-style='+ %a. %b %d %Y - %r '"
alias ll="ls --color -lah --group-directories-first"

# if the above does not work, run:
sudo apt install coreutils

# load in zshrc changes
source ~/.zshrc</code></pre>
