---
layout: post
title: "Yabai and SKHD Configs"
date: 2021-08-27 22:24:57 -0500
description: "Snippets from my yabai and skhd configurations and scripts."
categories: ["Snippets"]
tags: ["command-line", "learning", "shell-script"]
image: "/assets/uploads/2021/08/random-1-1200x630-facebook-share-1.webp"
---

## Yabai

yabairc:

<pre class="wp-block-code lang-bash"><code>#!/usr/bin/env sh

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
yabai -m rule --add app="^1Password 7$" manage=off
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
yabai -m rule --add app="^Discord$" manage=off
yabai -m rule --add app="^Calendar$" manage=off
yabai -m rule --add app="^Calculator$" manage=off
yabai -m rule --add app="^Podcasts$" manage=off
yabai -m rule --add app="^Music$" manage=off

# float system preferences
yabai -m rule --add app="^System Information$" manage=off
yabai -m rule --add app="^System Preferences$" manage=off
yabai -m rule --add title='Preferences$' manage=off
yabai -m rule --add title='^Archive Utility$' manage=off

# float settings windows
yabai -m rule --add title='Settings$' manage=off

# global settings
yabai -m config mouse_follows_focus          off
# focus_follows_mouse: off, autoraise, autofocus
yabai -m config focus_follows_mouse          off
yabai -m config window_placement             second_child
yabai -m config window_topmost               off
yabai -m config window_shadow                on
yabai -m config window_opacity               off
yabai -m config window_opacity_duration      0.0
yabai -m config active_window_opacity        1.0
yabai -m config normal_window_opacity        0.90
yabai -m config window_border                off
yabai -m config window_border_width          6
yabai -m config active_window_border_color   0xff775759
yabai -m config normal_window_border_color   0xff555555
yabai -m config insert_feedback_color        0xffd75f5f
yabai -m config split_ratio                  .447
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
yabai -m config right_padding                220
yabai -m config window_gap                   5

# yabai -m config --space 5 right_padding 30

yabai -m config --space $(yabai -m query --displays | jq 'map(select(.index==2)) | .[0].spaces[0]') left_padding 0
yabai -m config --space $(yabai -m query --displays | jq 'map(select(.index==2)) | .[0].spaces[0]') right_padding 0
yabai -m config --space $(yabai -m query --displays | jq 'map(select(.index==2)) | .[0].spaces[1]') left_padding 0
yabai -m config --space $(yabai -m query --displays | jq 'map(select(.index==2)) | .[0].spaces[1]') right_padding 0

# killall limelight &> /dev/null
# limelight &> /dev/null &

yabai -m signal --add event=application_activated action="zsh ~/.config/yabai/application-activated.zsh"
yabai -m signal --add event=window_created action="zsh ~/.config/yabai/window-created.zsh"

echo "yabai configuration loaded.."</code></pre>

window-created.zsh

<pre class="wp-block-code lang-bash"><code>#! /usr/bin/zsh

is_app() {
    echo $(yabai -m query --spaces --space \
        | jq -re ".index" \
        | xargs -I{} yabai -m query --windows --space {} \
        | jq -r 'map(select(.id=='$YABAI_WINDOW_ID' and .app=="'$1'" and .subrole=="AXStandardWindow")) | .[] | [.app][]')
}

if [[ $(is_app "Finder") == "Finder" ]]; then
    yabai -m window --focus $YABAI_WINDOW_ID \
        & yabai -m window --move abs:0:709 \
        & yabai -m window --resize abs:1500:730
fi</code></pre>

application-activated.zsh

<pre class="wp-block-code lang-bash"><code>#! /usr/bin/zsh

# When there are more than 3 windows open on the current space we stack Google
# Chrome and Transmit along with stacking VSCode and Tower if both are open.

# Get all the windows on current space
local WINDOWS_ARRAY=$(yabai -m query --spaces --space \
  | jq -re ".index" \
  | xargs -I{} yabai -m query --windows --space {} \
  | jq -r 'map(select(.minimized==0 and .floating==0))')

# Get the number of windows on the current space
local NUMBER_OF_WINDOWS=$(echo $WINDOWS_ARRAY | jq -r 'length')

# If we are Less than or equal to 3 windows on current space exit script
if [ "$NUMBER_OF_WINDOWS" -le "3" ]; then
    return 42
fi

# Stack first instance of VSCode and Tower when more than 3 windows
local VSCODE_ID=$(echo $WINDOWS_ARRAY | jq -r 'map(select(.app=="Code")) | .[0] | .id')
local TOWER_ID=$(echo $WINDOWS_ARRAY | jq -r 'map(select(.app=="Tower")) | .[0] | .id')

if [[ $VSCODE_ID != 'null' && $TOWER_ID != 'null' ]]; then;
    yabai -m window $VSCODE_ID --stack $TOWER_ID
fi

# Stack first instance of Google Chrome and Transmit when more than 3 windows
local CHROME_ID=$(echo $WINDOWS_ARRAY | jq -r 'map(select(.app=="Google Chrome")) | .[0] | .id')
local TRANSMIT_ID=$(echo $WINDOWS_ARRAY | jq -r 'map(select(.app=="Transmit")) | .[0] | .id')

if [[ $CHROME_ID != 'null' && $TRANSMIT_ID != 'null' ]]; then;
    yabai -m window $CHROME_ID --stack $TRANSMIT_ID
fi</code></pre>

## SKHD

skhdrc:

<pre class="wp-block-code lang-bash"><code># Services
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
#   | xargs -I{} yabai -m window {} --insert stack</code></pre>
