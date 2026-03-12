---
layout: post
title: "Docker Notes"
date: 2018-08-12 14:53:54 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ["Notes"]
tags: ["docker"]
---

### Resources

- Getting started with Docker:
        [https://docs.docker.com/mac/](https://docs.docker.com/mac/)
- Docker Toolbox:
        [https://docs.docker.com/toolbox/overview/](https://docs.docker.com/toolbox/overview/)
- [https://visible.vc/engineering/docker-environment-for-wordpress/](https://visible.vc/engineering/docker-environment-for-wordpress/)
- [https://visible.vc/engineering/optimize-wordpress-theme-assets-and-deploy-to-s3-cloudfront/](https://visible.vc/engineering/optimize-wordpress-theme-assets-and-deploy-to-s3-cloudfront/)

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
