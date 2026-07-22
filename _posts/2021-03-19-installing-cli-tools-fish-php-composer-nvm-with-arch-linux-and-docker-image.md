---
layout: post
title: 'Installing fish, PHP, Composer, and nvm on Arch Linux (with Docker)'
description: 'How to install the fish shell, PHP, Composer, and nvm on Arch Linux, with a Docker image setup. Step-by-step commands and config notes.'
date: 2021-03-19 01:38:13 -0500
modified_date: 2026-07-21 20:04:04 -0500
categories: ['Notes']
tags: ['arch', 'command-line', 'docker', 'linux']
pillar: docker-linux
pillar_section: linux
image: '/assets/uploads/2021/03/Installing-CLI-Tools-fish-php-composer-nvm-with-Arch-Linux-and-Docker-Image-1200x630-facebook-share.webp'
---

I wanted to try [fish](https://fishshell.com/) because I kept reading how fast it was, and eventually the curiosity got the better of me. What I did not want was to tear up the shell setup on my main machine to find out. So I set the whole thing up inside a Docker container instead: something I could spin up, break, and throw away, pre-configure once, and re-run on another machine later if I needed to. That is why everything below runs in a container rather than on the host.

Walking through the install and getting it configured was enough to tell me the pitch holds up. Fish is fast, and I liked using it. The one thing that kept me from switching to it full-time is that it is not POSIX-compatible, so none of my existing bash scripts run as-is. Moving over for real would mean rewriting all of them in fish's own syntax, and that was more than I wanted to take on. The walkthrough was still worth doing, and the rest of this post is the setup I landed on: fish alongside PHP, Composer, and nvm on Arch Linux.

## Start the container

```bash
docker run --rm -it --privileged=true archlinux:latest bash

# https://endeavouros.com/docs/pacman/pacman-basic-commands/
pacman -Syu # Update
pacman -Syu sudo vim # Install vim

# Run the following and uncomment the line "%wheel ALL=(ALL) ALL"
sudo EDITOR=vim visudo
```

## Create your user account

```bash
sudo useradd -m digitalblake
sudo passwd digitalblake
usermod -aG wheel digitalblake
su - digitalblake
sudo whoami

# If you need to delete the user:
sudo userdel --remove digitalblake
```

## Installing fish and setting it as your default shell

Install fish along with a few tools the rest of this setup leans on, point your login shell at it with `chsh`, then bootstrap the [fisher](https://github.com/jorgebucaran/fisher) plugin manager and the [tide](https://github.com/IlanCosman/tide) prompt.

```bash
sudo pacman -Fy # Sync the files database
sudo pacman -Syu fish curl which git
which fish # if this is different from below, use this value
chsh -s /usr/bin/fish
fish

# https://github.com/jorgebucaran/fisher
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

# If you don't want to use tide, don't install it
fisher install ilancosman/tide@v4.1.1
```

A couple of notes on that block. `which fish` prints the absolute path to the binary; if it comes back as something other than `/usr/bin/fish`, use whatever it reports in the `chsh` line. `chsh -s` sets the login shell in `/etc/passwd`, so the switch takes effect on your next login rather than right away. Open a fresh session and run `echo $SHELL` to confirm it stuck. fisher is the plugin manager, and tide is an optional prompt: skip that last line if you would rather keep the default prompt or reach for a different one.

## Installing nvm and node

```bash
sudo pacman -Syu python
fisher install edc/bass

# https://github.com/nvm-sh/nvm#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
alias nvm "bass source ~/.nvm/nvm.sh --no-use ';' nvm $argv" -s

vim ~/.config/fish/config.fish
# In config.fish add the next two lines:
set -x NVM_DIR ~/.nvm
nvm use default --silent

nvm --version
nvm install v12
node -v

npm i gulp -g
```

## Installing php and composer

```bash
sudo pacman -Syu php php7 wget

# https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet

sudo mv composer.phar /usr/local/bin/composer
```

## Add fish aliases (functions)

```bash
alias install 'sudo pacman -Syu' -s
alias update 'sudo pacman -Syu' -s
alias remove 'sudo pacman -Rs' -s
alias search 'pacman -F' -s
alias clean 'sudo pacman -Sc' -s
alias list 'pacman -Qe' -s
alias l 'ls -lagh --group-directories-first' -s
alias composer 'php7 /usr/local/bin/composer' -s

vim ~/.config/fish/functions/take.fish
# https://fishshell.com/docs/current/cmds/function.html
function take -d "Create a directory and set CWD"
    command mkdir $argv
    if test $status = 0
        switch $argv[(count $argv)]
            case '-*'

            case '*'
                cd $argv[(count $argv)]
                return
        end
    end
end
```

## Resources

- [https://fishshell.com/](https://fishshell.com/)
- [https://github.com/jorgebucaran/fisher](https://github.com/jorgebucaran/fisher)
- [https://github.com/IlanCosman/tide](https://github.com/IlanCosman/tide)
- [https://github.com/IlanCosman/tide/wiki/Fish-version-compatibility](https://github.com/IlanCosman/tide/wiki/Fish-version-compatibility)
- [https://duckduckgo.com/?q=pacman+commands&ia=cheatsheet](https://duckduckgo.com/?q=pacman+commands&ia=cheatsheet)
- [https://linuxhint.com/add_users_arch_linux/](https://linuxhint.com/add_users_arch_linux/)
- [https://linuxhint.com/sudo_arch_linux/](https://linuxhint.com/sudo_arch_linux/)
- [https://serverfault.com/questions/1052963/pacman-doesnt-work-in-docker-image](https://serverfault.com/questions/1052963/pacman-doesnt-work-in-docker-image)
- [https://www.howtogeek.com/656549/how-to-delete-a-user-on-linux-and-remove-every-trace/](https://www.howtogeek.com/656549/how-to-delete-a-user-on-linux-and-remove-every-trace/)
- [https://linoxide.com/add-user-to-sudoers-or-sudo-group-arch-linux/](https://linoxide.com/add-user-to-sudoers-or-sudo-group-arch-linux/)
- [https://www.2daygeek.com/linux-fish-shell-friendly-interactive-shell/](https://www.2daygeek.com/linux-fish-shell-friendly-interactive-shell/)
- [https://linuxhint.com/list_installed_packages_pacman_arch_linux/](https://linuxhint.com/list_installed_packages_pacman_arch_linux/)
- [https://community.chakralinux.org/t/how-to-use-pacman-to-search-for-install-upgrade-and-uninstall-packages/7205](https://community.chakralinux.org/t/how-to-use-pacman-to-search-for-install-upgrade-and-uninstall-packages/7205)
- [https://itsfoss.com/pacman-command/](https://itsfoss.com/pacman-command/)
