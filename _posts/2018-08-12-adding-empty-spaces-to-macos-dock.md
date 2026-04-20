---
layout: post
title: 'Adding Empty Spaces to macOS Dock'
description: 'Having spaces in your docker sometimes makes it easier to organize your applications into groups.'
date: 2018-08-12 15:10:25 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ['Snippets']
tags: ['macos', 'shell-script']
image: '/assets/uploads/2018/08/adding-empty-spaces-to-macos-dock-1200x630-facebook-share.webp'
---

### Shell Script Function

I always forget what this command is so I add this function to my `~/.bash_profile` or `~/.zshrc` files to make adding more spaces to my dock easier.

```bash
dockSpace(){
    defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'

    killall Dock
}
```

Having spaces in your docker sometimes makes it easier to organize your applications into groups.
