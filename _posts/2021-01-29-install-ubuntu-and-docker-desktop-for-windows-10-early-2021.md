---
layout: post
title: "Install Ubuntu and Docker Desktop for Windows 10 (Early 2021)"
description: "Learn how to set up Ubuntu on Windows 10 using Window Subsystem for Linux (WSL)"
date: 2021-01-29 01:04:59 -0600
modified_date: 2021-02-03 22:04:18 -0600
categories: ["Guides"]
tags: ["command-line", "docker", "ubuntu", "windows"]
image: "/assets/uploads/2021/01/random-1-1200x630-facebook-share.webp"
render_with_liquid: false
---

This document was written to help a co-worker set up our
    [wp-foundation-six](https://github.com/Blake-C/wp-foundation-six)
    project setup on Windows. In the past I’ve always set this project up on macOS, but Windows has its own
    challenges. If you just need to get Ubuntu running on Windows you only need to follow down to step 4. Everything
    else is specific to our use case.

## 1. Install Ubuntu

Open the windows store and install the Ubuntu application. These instructions are based on Ubuntu 20.04.

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-30-54-pm.webp)

## 1.1. Install Docker Desktop for Windows

You can download the Docker Desktop application from Docker website:

- [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

![](/assets/uploads/2021/02/Screen-Shot-2021-02-03-at-9.58.23-PM.webp)

## 2. Install WSL V2

The following instructions are based on
    [Docker Desktop WSL 2 backend](https://docs.docker.com/docker-for-windows/wsl/)
    documentation.

In the **windows terminal** run:

<pre class="wp-block-code lang-bash line-numbers"><code># To check the WSL mode, run:
wsl.exe -l -v

# To upgrade your existing Linux distro to v2, run:
wsl.exe --set-version ubuntu 2

# To set v2 as the default version for future installations, run:
wsl.exe --set-default-version 2</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-40-18-pm.webp)

## 3. Update Docker Settings

Open docker for desktop and go to the application settings.

Under “General” make sure “Use the WSL 2 based engine” is checked

Then under “Resources > WSL Integration” make sure Ubuntu-20.02 is checked off for Enable integration
    with additional distros.

Restart docker to make sure these settings have been applied.

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-41-28-pm.webp)

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-42-02-pm.webp)

## 4. If Docker Has Issues Starting (optional)

If docker refuses to start, shutdown docker and open the
    **windows terminal**. Then run the following:

<pre class="wp-block-code lang-bash line-numbers"><code>$ wsl --shutdown
$ notepad "$env:USERPROFILE/.wslconfig"</code></pre>

Add this to .wslconfig:

<pre class="wp-block-code lang-bash line-numbers"><code>[wsl2]
memory=1GB   # Make sure you have enough memory</code></pre>

***Save and restart docker***

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-43-32-pm.webp)

## 5. Setting Up Ubuntu

Open the **Ubuntu Terminal** and test that you have access to docker by running:

<pre class="wp-block-code lang-bash line-numbers"><code>docker container list -a</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-44-40-pm.webp)

### 5.1 Installing ZSH

These are optional tools to make the interface easier to use. These are my preferences; run with whatever shell you
    prefer.

<pre class="wp-block-code lang-bash line-numbers"><code>sudo apt install zsh # installs zsh
chsh -s $(which zsh) # makes zsh your default shell on startup</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-46-01-pm.webp)

### 5.2 Installing OhMyZSH

When I use zsh, I prefer to install OhMyZSH. Follow their documentation on how to
    [install OMZ](https://ohmyz.sh/#install).

After OMZ is installed open the `~/.zshrc` file and set the theme to: `af-magic`. See all the
    other OMZ themes here:

- https://github.com/ohmyzsh/ohmyzsh/wiki/Themes

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-49-54-pm.webp)

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-51-30-pm.webp)

### 5.3 Add aliases for Docker

Add this to the bottom of your `~/.zshrc` file:

<pre class="wp-block-code lang-bash line-numbers"><code># Docker Commands
alias dps="docker container list -a --format \"table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\""
alias dimg="docker image list"
alias dup="docker-compose up -d"
alias ddown="docker-compose down"

# This function is for easy access to general-cli
dsh() {
    docker exec -it $(dps | grep cli | head -c12) zsh
}</code></pre>

![](/assets/uploads/2021/01/Screen-Shot-2021-01-30-at-3.30.55-AM.webp)

Save your `~/.zshrc` file and update your shell by running:

<pre class="wp-block-code lang-bash line-numbers"><code>source ~/.zshrc</code></pre>

Or you can close and open a new **Ubuntu terminal** window.

### 5.4 Install NVM and Node

Install NVM using the instruction from the NVM repo:

- https://github.com/nvm-sh/nvm

Once installed run:

<pre class="wp-block-code lang-bash line-numbers"><code>nvm install v12.20.1
npm install gulp npm-check -g</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-53-12-pm.webp)

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-55-19-pm.webp)

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-10-59-48-pm.webp)

### 5.5 Install Composer

<pre class="wp-block-code lang-bash line-numbers"><code>sudo apt install php7.4 # use php8 if you are already on it
php -v # confirm that php is installed</code></pre>

Use the wget script at the bottom of this page on the
    [How do I install Composer programmatically](https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md)
    page.

The follow the instructions on how to install composer globally on this page:

- https://getcomposer.org/doc/00-intro.md

<pre class="wp-block-code lang-bash line-numbers"><code>sudo mv composer.phar /usr/local/bin/composer
composer -v</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-11-19-31-pm.webp)

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-11-21-35-pm.webp)

## 6. Installing dh-autoreconf:

wp-foundation-six uses imagemin-gifsicle which depends on gifsicle-bin which was removed from the GNU/Linux binary
    files of gifsicle due to security vulnerabilities in version 5.0.0. That is why the binary has to be built from
    source and why you need to install `dh-autoreconf`.

Run the following command:

<pre class="wp-block-code lang-bash line-numbers"><code>sudo apt update
sudo apt install dh-autoreconf</code></pre>

Now you should be able to run `npm install` without getting any errors.

## 7. Confirm wp-foundation-six works

If you installed all the docker alias commands into your
    `~/.zshrc` files from above; the following will work when ran in order.

<pre class="wp-block-code lang-bash line-numbers"><code>take ~/repositories
git clone https://github.com/Blake-C/wp-foundation-six.git
cd wp-foundation-six
dup
dsh
wp-init
exit</code></pre>

When wp-init is done you can exit general-cli and go to []()

When done run the follow to bring down wp-foundation-six:

<pre class="wp-block-code lang-bash line-numbers"><code>ddown</code></pre>

![](/assets/uploads/2021/01/screen-shot-2021-01-28-at-11-46-35-pm.webp)
