---
layout: post
title: "Fixing Foundation for Emails on node 10.15.3 in October 2019"
description: "The Foundation for emails framework has not had a release since 2016. Here is how to fix the issues that come with using the outdated npm modules in 2019."
date: 2019-10-10 01:52:05 -0500
modified_date: 2020-10-02 21:09:52 -0500
categories: ["Guides"]
tags: ["build-systems", "command-line", "foundation", "foundation-for-emails"]
image: "/assets/uploads/2019/10/facebook.webp"
---

If you have been wanting to use Foundation for Emails, you’ll notice that the email building framework has not
    been updated since 2016. That’s over 3 years ago.

![June 30th 2016 was the last time the framework was updated.](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.05.27-AM.webp)

Here is what you need to do to get the packages building to start your next email template.

## 1. If you have not already, install the foundation-cli tooling for node.

```bash
npm install --global foundation-cli
```

## 2. Then build your email project.

```bash
foundation new --framework emails
```

## 3. Then you’ll notice the first issue the framework has when building.

The node modules did not install. Change directories into the project folder so that we can fix the issue.

![Installation instructions for the foundation for emails framework](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.08.49-AM.webp)

I like to use a tool called npm-check to update my node modules. When you have npm-check installed run
    `npm-check -u` in the project directory to see a list of all the outdated packages.

```bash
npm install npm-check -g
npm-check -u
```

![A list of the outdated npm packages](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.09.19-AM.webp)

Update all the modules and you’ll then see the node_modules directory.

![The updated node modules](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.10.29-AM.webp)

## 4. Now we can build the project

Now when you run `npm run build`, you’ll still get an error. The issue here is how gulp was added
    to the framework. We will have to fix this.

![Gulp error in terminal](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.10.48-AM.webp)

First, open the `package.json` files for the project and delete the line for gulp under the
    devDependencies.

![The project package.json file where the gulp line is located](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.11.14-AM.webp)

Next, delete the `package-lock.json` file. Reinstall gulp with `npm install gulp -D`. Then
    finally run `npm run build`.

```bash
rm package-lock.json
npm install gulp -D
npm run build
```

![Fixing the gulp issues preventing the build process](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.12.52-AM.webp)

Now you can use the framework as intended.

![The framework running in the browser](/assets/uploads/2019/10/Screen-Shot-2019-10-10-at-1.12.57-AM.webp)
