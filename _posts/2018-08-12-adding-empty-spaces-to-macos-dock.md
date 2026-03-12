---
layout: post
title: "Adding Empty Spaces to macOS Dock"
date: 2018-08-12 15:10:25 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ["Snippets"]
tags: ["macos", "shell-script"]
---

### Shell Script Function

I always forget what this command is so I add this function to my
    `~/.bash_profile` or `~/.zshrc` files to make adding more spaces to my dock easier.

<pre><code class="line-numbers lang-bash">dockSpace(){
    defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'

    killall Dock
}
</code></pre>

Having spaces in your docker sometimes makes it easier to organize your applications into groups.
