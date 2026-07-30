---
layout: post
title: 'Docker Notes'
description: 'These are just my notes while learning docker with some resources and basic commands.'
date: 2018-08-12 14:53:54 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ['Notes']
tags: ['docker']
pillar: docker-linux
pillar_section: docker
image: '/assets/uploads/2018/08/docker-notes-1200x630-facebook-share.webp'
---

### Resources

- [Installing Docker Desktop on macOS](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Docker Toolbox overview](https://web.archive.org/web/20211110121754/https://docs.docker.com/toolbox/overview/), archived. Docker retired Toolbox, and the original page now redirects to the retired docs index.
- [Setup a Wordpress development environment with Docker](https://web.archive.org/web/20210615191828/https://visible.vc/engineering/docker-environment-for-wordpress/), archived
- [Optimize your WordPress theme assets and deploy to S3 and CloudFront](https://web.archive.org/web/20191114190216/https://visible.vc/engineering/optimize-wordpress-theme-assets-and-deploy-to-s3-cloudfront/), archived

### Commands

- `docker images`
    - List docker repos
- `docker run [username]/[repo]`
    - runs image, otherwise pulls it down
- `docker rmi -f [image-id]`
    - removed docker image based off ID or repo name
- `docker push [username]/[repo]`
    - pushes the docker image to repo
    - `docker push [username]/[repo]:[tag]`
- `docker login --username=[username] --email=[emailaddress]`
    - login into docker hub
- `docker tag [image-id] [username]/[repo]:[tag]`
    - tag image before pushing
- `docker commit [container-id] [image-name]`
    - saves changes in a container as a new image
    - `docker commit [container-id] [username]/[repo]:[tag]`
- `docker build [options] [path]`
    - build container
    - `docker build -t [username]/[repo]:[tag] .`
        - `.` for current directory
- `docker-machine ls`
    - list docker machines
- `docker ps`
    - Lists containers
- `docker ps -l`
    - List container details
- `docker-compose up -d`
    - Run docker container
    - -d => in the background
- `docker info`
    - Get info on containers, images, and VM
- `docker-machine env default`
    - Get environment info
- `docker ps -a`
    - List all containers
- `docker run -it [image-name] bin/bash`
    - Run container and enter bash shell
    - -i => standard in (makes it interactive)
    - -t => sudo terminal
- control + p + q
    - Exit container without stopping it
- control + c
    - Exit container and stop it
- `docker run -d -P [image-name]`
    - Attaches container to local port to view in browser
- `docker start [container-name/id]`
    - Starts a container
- `docker stop [container-name/id]`
    - Stops a container
- `docker exec -it [container-id] /bin/bash`
    - Start terminal process into container
- `docker run -it -d -P -v $PWD:/www ubuntu:14.04`
    - Mount volume to container
- `docker run -d -p 8080:80 nginx`
    - Start a container and map to host port 80
- `docker rm $(docker ps -a -q)`
    - Remove all containers
