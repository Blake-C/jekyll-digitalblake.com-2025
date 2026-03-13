---
layout: post
title: "Common Composer Commands"
description: "These are notes on using composer and basic commands that I commonly use to update, remove, and query packages."
date: 2020-07-25 09:46:00 -0500
modified_date: 2020-10-02 21:09:51 -0500
categories: ["Notes"]
tags: ["build-systems", "command-line", "composer", "learning", "macos", "php", "php7", "phpcs", "wpcs"]
image: "/assets/uploads/2020/07/common-composer-commands.webp"
---

These commands can be used globally or locally. To use locally just remove the global keyword. To learn more about these commands and others that are not listed here go to the [composer documentation](https://getcomposer.org/doc/03-cli.md).

---

To show installed packages:

```bash
composer global show
```

To show primary packages without dependencies:

```bash
composer global show --self
```

To show all packages installed regardless of dependencies:

```bash
composer global show --all
```

To show all outdated packages:

```bash
composer global outdated
```

To upgrade packages:

```bash
composer global upgrade
```

To install packages

```bash
composer global require "vendor/package"
```

To remove packages:

```bash
composer global remove "vendor/package"
```

```bash
composer global remove "vendor/*"
```

To update composer:

```bash
composer global self-update
```
