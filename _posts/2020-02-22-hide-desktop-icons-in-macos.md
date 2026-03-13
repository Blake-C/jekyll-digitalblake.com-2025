---
layout: post
title: "Hide Desktop Icons in macOS"
description: "Conducting a training or giving a presentation? Look more professional and hide your desktop."
date: 2020-02-22 14:20:02 -0600
modified_date: 2020-10-02 21:09:52 -0500
categories: ["Snippets"]
tags: ["command-line", "macos", "shell-script"]
image: "/assets/uploads/2020/02/facebook-hide-desktop-icons-in-macos.webp"
---

When I need to hold a training through a screen share with my desktop in full display I usually don’t want the
    people I am training to see any current projects, research, and notes that might be sitting on my desktop. There are
    several reasons why you might want to hide your desktop while doing a screen share:

- You have a messy desktop
- You don’t want research you’re doing on full display
- You don’t want to potentially share any sensitive material like client names
- To look more professional

I also didn’t want to have to remember the command to quickly kill the desktop in macOS so I created a quick
    shell script where I can just call
    `desktop` in my terminal and tell it to hide; then get on with my training. Run the command again and
    tell the script to show the desktop when you’re done.

Add the follow script to your .bash_profile, .zshrc, or which ever default shell you are using.

```bash
desktop(){
    vared -p "Show or hide Desktop? (show/hide): " -c SHOWHIDEDESKTOP

    if [[ "$SHOWHIDEDESKTOP" == "hide" ]]; then
        defaults write com.apple.finder CreateDesktop false
        killall Finder

        echo -e "\e[31mDesktop Hidden"
    else
        defaults write com.apple.finder CreateDesktop true
        killall Finder

        echo -e "\e[32mDesktop Visible"
    fi

    SHOWHIDEDESKTOP=""
}
```

One big thing you want to remember, if you choose to use this:
    **YOU WILL NOT HAVE ACCESS TO YOUR DESKTOP, AT ALL!**

If you need to drag and drop items from your desktop during your training you will need to rely on the finder as
    everything on your desktop will be inaccessible.
