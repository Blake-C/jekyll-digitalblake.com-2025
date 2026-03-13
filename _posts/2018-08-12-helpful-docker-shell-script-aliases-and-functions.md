---
layout: post
title: 'Helpful Docker Shell Script Aliases and Functions'
description: "Quick shell script snippets for more easily working with docker commands. These are specific to my workflow, but maybe they'll help you with creating new ideas."
date: 2018-08-12 15:04:46 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ['Snippets']
tags: ['docker', 'shell-script']
render_with_liquid: false
---

### Docker Alias

Helpful short aliases for executing docker command more quickly.

```bash
alias dps="docker container list -a --format \"table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\""
alias dimg="docker image list"
alias dup="docker-compose up -d"
alias ddown="docker-compose down"
```

The dps command above is probably the most helpful when working on narrow devices.

### Docker Functions

The following two functions would go into your `~/.bash_profile` or `~/.zshrc` file.

The dockerit shell script function can be used to mount your current directory into the general-cli container giving you access to basic command line tools. This is helpful for when you are working on a new machine and have not setup all your command line tooling yet.

```bash
dockit() {
    docker run --rm -it -v $PWD:/var/www/public_html digitalblake/general-cli:0.0.6 zsh
}
```

The dsh function is useful for when working the wp-foundation-six project or are using the general-cli docker image with a project. This is just a quick way to enter into the general-cli container.

```bash
dsh() {
    docker exec -it $(dps | grep cli | head -c12) zsh
}
```
