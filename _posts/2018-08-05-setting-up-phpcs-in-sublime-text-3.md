---
layout: post
title: 'Setting up PHPCS in Sublime Text 3'
description: 'Learn how to install the Sublime Text 3 PHPCS linter packages and view errors/warnings while you type your code.'
date: 2018-08-05 04:36:21 -0500
modified_date: 2020-10-02 21:09:55 -0500
categories: ['Guides']
tags: ['php', 'phpcs', 'sublime-text']
image: '/assets/uploads/2018/08/output-sublimelinter.webp'
---

Install the [sublime-linter](https://packagecontrol.io/packages/SublimeLinter) plugin and the [sublime-linter-phpcs](https://packagecontrol.io/packages/SublimeLinter-phpcs) plugin through the Sublime Text package manager. This article assumes that you have already installed PHPCS globally on your machine, if not, follow the instructions on the [PHPCS github page](https://github.com/squizlabs/PHP_CodeSniffer). Or checkout my article on [Setting up WordPress Coding Standards (WPCS) Globally](/2018/08/05/setting-up-wordpress-coding-standards-wpcs/).

Once both plugins are installed go to Sublime Text > Preferences > Package Settings > SublimeLinter > Settings. These instructions are assuming you’re running macOS.

In your settings add the following configurations. These settings assume that you will have your phpcs.xml file at the root of you project when opened in Sublime Text. You’ll also want to tell sublime-linter-phpcs where your .composer/vendor/bin directory is located under the “paths” section as seen below.

```json
{
	"linters": {
		"phpcs": {
			"args": "--standard='${folder}/phpcs.xml'",
			"styles": [
				{
					"icon": "triangle"
				}
			]
		}
	},
	"paths": {
		"linux": [],
		"osx": ["~/.composer/vendor/bin"],
		"windows": []
	}
}
```

When you open your project in Sublime Text you will be able to see any PHPCS errors highlighted. Optionally, you can open the Sublime Text console by clicking the button in the bottom left of the Sublime Text editor and clicking “Output: SublimeLinter”. This will display a list of all the PHPCS errors/warnings in a list for all open files.

![Output: SublimeLinter](/assets/uploads/2018/08/output-sublimelinter.webp)
