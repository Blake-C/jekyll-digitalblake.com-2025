---
layout: post
title: 'My yabai and skhd Config for macOS Tiling Window Management'
date: 2021-08-27 22:24:57 -0500
modified_date: 2026-07-21 20:04:04 -0500
description: 'My complete yabai setup for tiling window management on macOS, with the Karabiner Elements bindings (and the archived skhd config) that drive it: rules, scripts, keybindings, and mouse buttons you can copy and adapt.'
categories: ['Snippets']
tags: ['command-line', 'learning', 'shell-script']
pillar: shell-macos
pillar_section: macos
image: '/assets/uploads/2021/08/random-1-1200x630-facebook-share-1.webp'
---

[Yabai](https://github.com/koekeishiya/yabai) is a tiling window manager for macOS, and [skhd](https://github.com/koekeishiya/skhd) is a keyboard hotkey daemon from the same author that drives it. I have been running this setup for years and I do not see myself going back. The point of it, for me, is not having to rearrange windows by hand as I open and close them. I open a browser, then I need a document or a second page beside it, I hit command-N, and yabai picks up the new window and drops it into place on its own.

The other half is stacking. Say I have VS Code, iTerm, and Chrome open and then I open Tower, my git client. yabai stacks it on top of the VS Code window where I always keep it, and I flip between the stacked windows with a spare button on my mouse, wired up through Karabiner Elements (the setup is in the Karabiner section below). That works for any stack, including ones I make by hand. I lean on this for dev environments: a keyboard shortcut switches me between spaces, one for my personal workspace and one for development, and the dev space opens all the windows I need on a single desktop and lets yabai stack them so the whole thing stays manageable. A little manual arranging and I am set.

A note on System Integrity Protection before the configs. yabai's core window tiling works with SIP fully enabled, which is how I run it. Partially disabling SIP is what unlocks yabai's scripting addition and the extra features that ride on it, like moving an app from one desktop to another with a keystroke. I do not need those, and I would rather keep SIP on for the security it gives me, so I stick to the tiling. If you do want the scripting addition, that is a choice you can make on your end; follow the [official yabai wiki](https://github.com/koekeishiya/yabai/wiki) for the current steps, since they shift between macOS versions. Everything in the configs below, the rules, the stacking scripts, and the keyboard and mouse shortcuts, runs on my machine with SIP on and no scripting addition.

One more heads-up: on my current machine I have moved my keyboard shortcuts over to [Karabiner Elements](https://karabiner-elements.pqrs.org/) and dropped skhd. I am keeping the skhd config below for reference, since it still shows how the bindings map, but Karabiner is what handles them for me now.

## Yabai

The yabai config is mostly a long list of applications set to `manage=off`, which tells yabai to leave them floating instead of tiling them. Most windows float; the ones I actually want tiled are the handful I work in all day: the browser, my code editor, the terminal, my git client, and design apps like Photoshop and Sketch. Small utility windows, System Preferences and the various Finder pickers, stay floating. Below the rule list are the global and per-space settings (padding, gaps, split ratio, mouse behavior) and two signal scripts that fire when windows are created or activated.

yabairc:

```bash
#!/usr/bin/env sh

# the scripting-addition must be loaded manually if
# you are running yabai on macOS Big Sur. Uncomment
# the following line to have the injection performed
# when the config is executed during startup.
#
# for this to work you must configure sudo such that
# it will be able to run the command without password
#
# see this wiki page for information:
#  - https://github.com/koekeishiya/yabai/wiki/Installing-yabai-(latest-release)
#
# sudo yabai --load-sa
# yabai -m signal --add event=dock_did_restart action="sudo yabai --load-sa"

# float system preferences. Most of these just diable Yabai form resizing them.
yabai -m rule --add app="^1Password*" manage=off
yabai -m rule --add app="^Microsoft Teams*" manage=off
yabai -m rule --add app="^Adobe Creative Cloud$" manage=off
yabai -m rule --add app="^Adobe Media Encoder CC 2018$" manage=off
yabai -m rule --add app="^Audio Hijack$" manage=off
yabai -m rule --add app="^BrowserStackLocal$" manage=off
yabai -m rule --add app="^CodeKit$" manage=off
yabai -m rule --add app="^ColorSlurp$" manage=off
yabai -m rule --add app="^CraftManager$" manage=off
yabai -m rule --add app="^Dash$" manage=off
yabai -m rule --add app="^Docker Desktop$" manage=off
yabai -m rule --add app="^Dropbox$" manage=off
yabai -m rule --add app="^GIPHY CAPTURE$" manage=off
yabai -m rule --add app="^GlobalProtect$" manage=off
yabai -m rule --add app="^GoToMeeting$" manage=off
yabai -m rule --add app="^Hidden Bar$" manage=off
yabai -m rule --add app="^ImageOptim$" manage=off
yabai -m rule --add app="^Karabiner-Elements$" manage=off
yabai -m rule --add app="^Karabiner-EventViewer$" manage=off
yabai -m rule --add app="^Kitematic$" manage=off
yabai -m rule --add app="^Loopback$" manage=off
yabai -m rule --add app="^MAMP PRO$" manage=off
yabai -m rule --add app="^MAMP$" manage=off
yabai -m rule --add app="^Microsoft Remote Desktop$" manage=off
yabai -m rule --add app="^Microsoft Teams$" manage=off
yabai -m rule --add app="^NextDNS$" manage=off
yabai -m rule --add app="^Postman$" manage=off
yabai -m rule --add app="^Sequel Pro$" manage=off
yabai -m rule --add app="^The Unarchiver$" manage=off
# yabai -m rule --add app="^Tower$" manage=off
# yabai -m rule --add app="^Transmit$" manage=off
yabai -m rule --add app="^TunnelBear$" manage=off
yabai -m rule --add app="^VMware Fusion$" manage=off
yabai -m rule --add app="^Logitech G HUB$" manage=off
yabai -m rule --add app="^p4merge$" manage=off
yabai -m rule --add app="^zoom.us$" manage=off
yabai -m rule --add app="^Finder$" manage=off
yabai -m rule --add app="^Disk Utility$" manage=off
yabai -m rule --add app="^Activity Monitor$" manage=off
yabai -m rule --add app="^Path Finder$" manage=off
yabai -m rule --add app="^TeamViewer$" manage=off
yabai -m rule --add app="^Private Internet Access$" manage=off
# yabai -m rule --add app="^Discord$" manage=off
yabai -m rule --add app="^Calendar$" manage=off
yabai -m rule --add app="^Calculator$" manage=off
yabai -m rule --add app="^Podcasts$" manage=off
# yabai -m rule --add app="^Music$" manage=off
yabai -m rule --add app="^DisplayLinkUserAgent$" manage=off
yabai -m rule --add app="^Cursor Pro$" manage=off
yabai -m rule --add app='^Simulator$' manage=off
yabai -m rule --add app='^Local$' manage=off
yabai -m rule --add app='^IVPN Client$' manage=off
yabai -m rule --add app='^Image Viewer$' manage=off
yabai -m rule --add app='^ImageViewer$' manage=off

# float system preferences
yabai -m rule --add app="^System Information$" manage=off
yabai -m rule --add app="^System Preferences$" manage=off
yabai -m rule --add title='Preferences$' manage=off
yabai -m rule --add title='^Archive Utility$' manage=off

# float settings windows
yabai -m rule --add title='Settings$' manage=off
yabai -m rule --add app='Settings$' manage=off

# global settings
yabai -m config mouse_follows_focus          off
yabai -m config focus_follows_mouse          off # off, autoraise, autofocus
yabai -m config window_placement             second_child
yabai -m config window_shadow                on
yabai -m config window_opacity               off
yabai -m config window_opacity_duration      0.0
yabai -m config active_window_opacity        1.0
yabai -m config normal_window_opacity        0.90
yabai -m config insert_feedback_color        0xffd75f5f
yabai -m config split_ratio                  .468
yabai -m config auto_balance                 off
yabai -m config mouse_modifier               fn
yabai -m config mouse_action1                move
yabai -m config mouse_action2                resize
yabai -m config mouse_drop_action            swap

# general space settings
yabai -m config layout                       bsp
yabai -m config top_padding                  0
yabai -m config bottom_padding               0
yabai -m config left_padding                 55
yabai -m config right_padding                215
yabai -m config window_gap                   5

# yabai -m config --space 5 right_padding 30

# Cache display list once — used for all per-display space padding below
DISPLAYS=$(yabai -m query --displays)

# Space 1 & 2 of display with id 2
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==2)) | .[0].spaces[0]')" left_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==2)) | .[0].spaces[0]')" right_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==2)) | .[0].spaces[1]')" left_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==2)) | .[0].spaces[1]')" right_padding 0

# Space 1 & 2 of display with id 3
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==3)) | .[0].spaces[0]')" left_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==3)) | .[0].spaces[0]')" right_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==3)) | .[0].spaces[1]')" left_padding 0
yabai -m config --space "$(echo "$DISPLAYS" | jq 'map(select(.index==3)) | .[0].spaces[1]')" right_padding 0

# killall limelight &> /dev/null
# limelight &> /dev/null &

yabai -m signal --add event=application_activated action="zsh ~/.config/yabai/application-activated.sh"
yabai -m signal --add event=window_created action="zsh ~/.config/yabai/window-created.sh"

echo "yabai configuration loaded.."
```

The two signal scripts are where the custom behavior lives. `window-created.sh` runs whenever a new window opens and repositions specific ones. Here it pins Finder windows to a consistent spot and size, choosing the coordinates based on which display I am on, instead of macOS's default of cascading each new window down and to the right until it runs out of room and starts over at the top. I want Finder in the same place every time, so the script forces it there.

window-created.sh

```bash
#!/bin/bash

is_app() {
    yabai -m query --windows --space \
    | jq -r 'map(
        select(
            .id=='"$YABAI_WINDOW_ID"' and
            .app=="'"$1"'" and
            .subrole=="AXStandardWindow" and
            ."is-floating"==true and
            (.title|endswith("Info")|not)
        )
    ) | .[].app'
}


if [[ $(is_app "Finder") == "Finder" ]]; then
    local SCREEN_WIDTH=$(yabai -m query --displays --display | jq -r '.frame.w')
    # local SCREEN_HEIGHT=$(yabai -m query --displays --display | jq -r '.frame.h')

    if [[ "$SCREEN_WIDTH" == "1728.0000" ]]; then # Macbook Pro 16" Display
        yabai -m window --focus "$YABAI_WINDOW_ID" \
            && yabai -m window --move abs:0:500 \
            && yabai -m window --resize abs:1500:730
    elif [[ "$SCREEN_WIDTH" == "1920.0000" ]]; then # Display at 1920px width
        yabai -m window --focus "$YABAI_WINDOW_ID" \
            && yabai -m window --move abs:0:350 \
            && yabai -m window --resize abs:1500:730
    elif [[ "$SCREEN_WIDTH" == "2560.0000" ]]; then # Display at 2560px width
        yabai -m window --focus "$YABAI_WINDOW_ID" \
            && yabai -m window --move abs:0:710 \
            && yabai -m window --resize abs:1500:730
    fi
fi
```

`application-activated.sh` runs when I switch to an app. It counts the unfloated, unminimized windows on the current space and, once there are more than three, stacks related ones together so the space does not get crowded. In the version below, VS Code and Tower stack onto each other, Chrome and Transmit do the same, and Photoshop and Illustrator both stack onto Sketch as the anchor.

application-activated.sh

```bash
#!/bin/bash

# When there are more than 3 windows open on the current space we stack Google
# Chrome and Transmit along with stacking VSCode and Tower if both are open.

# Cache the raw yabai response once — all subsequent operations read from this variable
WINDOWS_JSON=$(yabai -m query --windows --space)

# Cheap count gate: count first, build filtered array only if needed
NUMBER_OF_WINDOWS=$(echo "$WINDOWS_JSON" | jq '[.[] | select(."is-minimized"==false and ."is-floating"==false)] | length')

[ "$NUMBER_OF_WINDOWS" -lt "4" ] && exit 0

# Filtered array — computed only when we have enough windows to act on
WINDOWS_ARRAY=$(echo "$WINDOWS_JSON" | jq 'map(select(."is-minimized"==false and ."is-floating"==false))')

# Stack VSCode and Tower
VSCODE_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Code" and ."stack-index"==0)) | .[0] | .id')
TOWER_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Tower" and ."stack-index"==0)) | .[0] | .id')

if [[ "$VSCODE_ID" != 'null' && "$TOWER_ID" != 'null' ]]; then
	yabai -m window "$VSCODE_ID" --stack "$TOWER_ID"
fi

# Stack Google Chrome and Transmit
CHROME_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Google Chrome" and ."stack-index"==0)) | .[0] | .id')
TRANSMIT_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Transmit" and ."stack-index"==0)) | .[0] | .id')

if [[ "$CHROME_ID" != 'null' && "$TRANSMIT_ID" != 'null' ]]; then
	yabai -m window "$CHROME_ID" --stack "$TRANSMIT_ID"
fi

# Stack Adobe apps onto Sketch as anchor — Photoshop and Illustrator both stack onto Sketch
SKETCH_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Sketch" and ."stack-index"==0)) | .[0] | .id')
PHOTOSHOP_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Adobe Photoshop 2021" and ."stack-index"==0)) | .[0] | .id')
ILLUSTRATOR_ID=$(echo "$WINDOWS_ARRAY" | jq -r 'map(select(.app=="Adobe Illustrator 2021" and ."stack-index"==0)) | .[0] | .id')

if [[ "$SKETCH_ID" != 'null' && "$PHOTOSHOP_ID" != 'null' ]]; then
	yabai -m window "$PHOTOSHOP_ID" --stack "$SKETCH_ID"
fi

if [[ "$SKETCH_ID" != 'null' && "$ILLUSTRATOR_ID" != 'null' ]]; then
	yabai -m window "$ILLUSTRATOR_ID" --stack "$SKETCH_ID"
fi
```

## SKHD

Before Karabiner, skhd handled all of this, and the config below is the version that ran for a long time. It still shows the mapping clearly. skhd binds key combinations to shell commands. I remapped Caps Lock into a hyper key (control, option, command, and shift together) so I could layer a full set of window commands on top of the keyboard without stepping on existing shortcuts. The bindings I used most: hyper plus W, A, S, D to move and warp the focused window, hyper plus I, J, K, L to resize it, hyper plus the arrow keys to build stacks, and hyper plus Tab to cycle through a stack. When I rebuilt these in Karabiner I kept the hyper layer almost unchanged, with one exception: resizing moved onto `fn` plus W, A, S, D.

skhdrc:

```bash
# Services
hyper - z : brew services restart yabai
hyper - x : brew services restart skhd

# Moving windows
hyper - w : yabai -m window --warp north || $(yabai -m window --display north; yabai -m display --focus north)
hyper - a : yabai -m window --warp west || $(yabai -m window --display west; yabai -m display --focus west)
hyper - s : yabai -m window --warp south || $(yabai -m window --display south; yabai -m display --focus south)
hyper - d : yabai -m window --warp east || $(yabai -m window --display east; yabai -m display --focus east)

# Toggle mouse focus mode
hyper - m : [[ $(yabai -m config focus_follows_mouse) = "disabled" ]] && \
    yabai -m config focus_follows_mouse autoraise || \
    yabai -m config focus_follows_mouse off

# Resize windowsa
hyper - i : \
    yabai -m window --resize top:0:-20 ; \
    yabai -m window --resize bottom:0:-20

hyper - j : \
    yabai -m window --resize left:-20:0 ; \
    yabai -m window --resize right:-20:0

hyper - k : \
    yabai -m window --resize bottom:0:20 ; \
    yabai -m window --resize top:0:20

hyper - l : \
    yabai -m window --resize right:20:0 ; \
    yabai -m window --resize left:20:0

# Rotate windows
hyper - r : yabai -m space --rotate 270

# Mirror tree y-axis
hyper - y : yabai -m space --mirror y-axis

# Balance size of windows
hyper - b : yabai -m space --balance

# float / unfloat window and center on screen
hyper - h : yabai -m window --toggle float;\
          yabai -m window --grid 4:4:1:1:2:2

# toggle window zoom
hyper - t : yabai -m window --toggle zoom-parent
hyper - f : yabai -m window --toggle zoom-fullscreen

# Enable / Disable gaps in current workspace
hyper - 0 : yabai -m space --toggle padding; yabai -m space --toggle gap

# Cycle windows forwards
hyper - e : yabai -m window --focus prev || yabai -m window --focus last
# hyper - e : yabai -m query --spaces --space \
#   | jq -re ".index" \
#   | xargs -I{} yabai -m query --windows --space {} \
#   | jq "map(select(.minimized == 0))" \
#   | jq -sre "add | sort_by(.display, .frame.x, .frame.y, .id) | reverse | nth(index(map(select(.focused == 1))) - 1).id" \
#   | xargs -I{} yabai -m window --focus {}

# Cycle windows backwards
hyper - q : yabai -m window --focus next || yabai -m window --focus first
# hyper - q  : yabai -m query --spaces --space \
#   | jq -re ".index" \
#   | xargs -I{} yabai -m query --windows --space {} \
#   | jq "map(select(.minimized == 0))" \
#   | jq -sre "add | sort_by(.display, .frame.x, .frame.y, .id) | nth(index(map(select(.focused == 1))) - 1).id" \
#   | xargs -I{} yabai -m window --focus {}

# Cycle windows forwards and backwards in focused stack only
hyper - tab : yabai -m window --focus stack.next || yabai -m window --focus stack.first

# Cycle windows forwards and backwards but stops at ends
# hyper - tab : yabai -m window --focus stack.prev || yabai -m window --focus prev || yabai -m window --focus last
# hyper - tab : yabai -m window --focus stack.next || yabai -m window --focus next || yabai -m window --focus first

hyper - up : yabai -m window --stack north
hyper - right : yabai -m window --stack east
hyper - down : yabai -m window --stack south
hyper - left : yabai -m window --stack west

# Make focused window stack starter
# hyper - tab : yabai -m query --spaces --space \
#   | jq -re ".index" \
#   | xargs -I{} yabai -m query --windows --space {} \
#   | jq -sre "add | sort_by(.display, .frame.x, .frame.y, .id) | nth(index(map(select(.focused == 1)))).id" \
#   | xargs -I{} yabai -m window {} --insert stack
```

## Karabiner Elements

[Karabiner Elements](https://karabiner-elements.pqrs.org/) is what drives yabai for me now. Each shortcut is a complex modification that runs the same `yabai -m ...` shell command the skhd binding used to, so the hyper layer above carries over almost unchanged (resizing is the exception, now on `fn` plus W, A, S, D). The reason I switched is the mouse: Karabiner can bind the extra buttons on a gaming mouse, which skhd cannot, and that is what powers the stack cycling I mentioned at the top.

I use a Logitech G600, and its extra buttons come through to macOS as `button3`, `button4`, and `button5`. I map two of them to cycle the focused stack and another to toggle fullscreen zoom, so I can page through stacked windows and blow one up without touching the keyboard:

```json
{
	"description": "Yabai cycle through stack (mouse button4)",
	"manipulators": [
		{
			"type": "basic",
			"from": { "pointing_button": "button4" },
			"to": [
				{
					"shell_command": "/bin/sh -c '/opt/homebrew/bin/yabai -m window --focus stack.next || /opt/homebrew/bin/yabai -m window --focus stack.first'"
				}
			]
		}
	]
}
```

`button5` runs the same command, so either button pages the stack, and `button3` maps to `yabai -m window --toggle zoom-fullscreen`. Swap `button4` for whatever your own mouse reports (Karabiner's EventViewer shows you the button name when you click it), and you have the same stack cycling on your machine.

The keyboard side is a longer list, but every entry follows the same shape as the snippet above: a `from` key combination and a `to` shell command calling yabai. It is a direct port of the skhd bindings, so the skhd config above is still the clearest reference for what each shortcut does.
