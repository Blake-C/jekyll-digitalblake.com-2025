---
layout: post
title: "Installing CLI Tools (fish, php, composer, nvm) with Arch Linux and Docker Image"
description: "Just some notes from what I was experimenting with Arch Linux and setting up fish shell."
date: 2021-03-19 01:38:13 -0500
categories: ["Notes"]
tags: ["arch", "command-line", "docker", "linux"]
---

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

## Installing fish and set it as your default shell:

```bash
sudo pacman -Fy # Sync the files database
sudo pacman -Syu fish curl which git
which fish # if this is different from below, use this value
chsh -s /usr/bin/fish
fish

# https://github.com/jorgebucaran/fisher
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

# If you don't want to use tide, don't install it
fisher install ilancosman/<a class="__cf_email__" data-cfemail="97e3fef3f2d7e1a3b9a6b9a6" href="/cdn-cgi/l/email-protection">[email protected]</a>
```

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
