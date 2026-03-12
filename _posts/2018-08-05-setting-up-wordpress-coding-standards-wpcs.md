---
layout: post
title: "Setting up WordPress Coding Standards (WPCS) Globally"
description: "Coding a WordPress theme can be difficult when work on a team. And it's for this reason you should have a standard way to determine what quality code should look like. Learn how to setup the WordPress Coding Standard to help assist your team in writing maintainable code."
date: 2018-08-05 20:22:58 -0500
modified_date: 2020-10-02 21:09:55 -0500
categories: ["Guides"]
tags: ["composer", "homebrew", "phpcs", "wordpress", "wpcs"]
---

### Install Homebrew

This guide is for developers how are using a Unix like system, more specifically macOS is the system I am using.

- [Follow the insuctions on the homebrew website](https://brew.sh/)

### Using Homebrew to Install Composer

<pre><code class="line-numbers lang-bash">brew install composer
</code></pre>

### Install PHPCS

Install PHPCS using composer, follow the instructions found on the
    [phpcs github page](https://github.com/squizlabs/PHP_CodeSniffer).

<pre><code class="line-numbers lang-bash">composer global require "squizlabs/php_codesniffer=*"
</code></pre>

### Create Utilities Directory

Create a directory in your user folder called utilities. Then clone down the
    [WPCS](https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards)
    and
    [PHPCompatibility](https://github.com/PHPCompatibility/PHPCompatibility)
    repos.

<pre><code class="line-numbers lang-bash">mkdir ~/utilities
cd ~/utilities
git clone https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards.git
git clone https://github.com/PHPCompatibility/PHPCompatibility.git
</code></pre>

Now change directories into the WordPress-Coding-Standards repo. Then use git to checkout the latest release. You
    can find what version is the most recent on the main
    [projects releases](https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/releases)
    page. For me this would be v0.14.1.

<pre><code class="line-numbers lang-bash">cd ~/utilities/WordPress-Coding-Standards
git checkout 0.14.1
</code></pre>

Do the same thing for PHPCompatibility. Change directories into PHPCompatibility and checkout the most recent or the
    version your team is using. For me this would be v8.2.0.

<pre><code class="line-numbers lang-bash">cd ~/utilities/PHPCompatibility
git checkout 8.2.0
</code></pre>

### Access PHPCS Globally

In order to access PHPCS globally you need to add composer to your global $PATH. Add the following to your
    `~/.bash_profile` or if you are using ZSH to your `~/.zshrc`. The $HOME variable will default
    to your user directory similiar to when you type `cd ~`.

<pre><code class="line-numbers lang-bash">export PATH="$PATH:$HOME/.composer/vendor/bin"
</code></pre>

Now when you run `phpcs --version`, you will get the current PHPCS version output. If you don’t,
    then look back at the instructions for the above tools to be sure they have installed successfully.

<pre><code class="line-numbers lang-bash">phpcs --version
PHP_CodeSniffer version 3.3.0 (stable) by Squiz (http://www.squiz.net)
</code></pre>

If you run `phpcs -i` you’ll get the default coding standards list.

<pre><code class="line-numbers lang-bash">phpcs -i
The installed coding standards are PEAR, Zend, PSR2, MySource, Squiz, PSR1, PSR12
</code></pre>

To add our WPCS and PHPCompatibility standards to this list run this command.

<pre><code class="line-numbers lang-bash">phpcs --config-set installed_paths $HOME/utilities/WordPress-Coding-Standards,/$HOME/utilities/PHPCompatibility
</code></pre>

Now when you run `phpcs -i` you will see WPCS and PHPCompatibility standards listed after the original
    standards.

<pre><code class="line-numbers lang-bash">phpcs -i
The installed coding standards are PEAR, Zend, PSR2, MySource, Squiz, PSR1, PSR12, WordPress-VIP, WordPress, WordPress-Extra, WordPress-Docs, WordPress-Core and PHPCompatibility
</code></pre>

### Setup the WordPress Theme for PHPCS

At the root of your WordPress Theme or Plugin create a file called
    `phpcs.xml` and add the following configurations. Feel free to change these to best suit your needs.

<pre><code class="line-numbers lang-xml"><?xml version="1.0"?>
<ruleset name="WordPress Theme Coding Standards">
    <!-- See https://github.com/squizlabs/PHP_CodeSniffer/wiki/Annotated-ruleset.xml -->
    <!-- See https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards -->
    <!-- See https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/wiki -->
    <!-- See https://github.com/wimg/PHPCompatibility -->
    <!-- See https://github.com/Automattic/_s/blob/master/phpcs.xml.dist -->

    <!-- Set a description for this ruleset. -->
    <description>A custom set of code standard rules to check for WordPress themes.</description>

    <!-- Pass some flags to PHPCS:
         p flag: Show progress of the run.
         s flag: Show sniff codes in all reports.
         v flag: Print verbose output.
         n flag: Do not print warnings.
    -->
    <arg value="psv"></arg>

    <!-- Strip the filepaths down to the relevant bit. -->
    <arg name="basepath" value="./"></arg>

    <!-- Check up to 8 files simultanously. -->
    <arg name="parallel" value="8"></arg>

    <!-- Only check the PHP files. JS files are checked separately with JSCS and JSHint. -->
    <arg name="extensions" value="php"></arg>

    <!-- Check all files in this directory and the directories below it. -->
    <file>.</file>

    <!-- Ignore these directories -->
    <exclude-pattern>./node_modules</exclude-pattern>
    <exclude-pattern>./bower_components</exclude-pattern>
    <exclude-pattern>./vendor</exclude-pattern>
    <exclude-pattern>./assets</exclude-pattern>

    <!-- Include the WordPress ruleset, with exclusions. -->
    <rule ref="WordPress">
        <!-- Getting error on placeholder files, index.php -->
        <exclude name="Squiz.Commenting.FileComment.SpacingAfterComment"></exclude>
    </rule>

    <!-- Verify that the text_domain is set to the desired text-domain.
         Multiple valid text domains can be provided as a comma-delimited list. -->
    <rule ref="WordPress.WP.I18n">
        <properties>
            <property name="text_domain" type="array" value="wp_foundation_six"></property>
        </properties>
    </rule>

    <!-- Allow for theme specific exceptions to the file name rules based
         on the theme hierarchy. -->
    <rule ref="WordPress.Files.FileName">
        <properties>
            <property name="is_theme" value="true"></property>
        </properties>
    </rule>

    <!-- Verify that no WP functions are used which are deprecated or have been removed.
         The minimum version set here should be in line with the minimum WP version
         as set in the "Requires at least" tag in the readme.txt file. -->
    <rule ref="WordPress.WP.DeprecatedFunctions">
        <properties>
            <property name="minimum_supported_version" value="4.5"></property>
        </properties>
    </rule>

    <!-- Include sniffs for PHP cross-version compatibility. -->
    <config name="testVersion" value="7.1-99.0"></config>

    <!-- Verify that everything in the global namespace is prefixed with a theme specific prefix.
         Multiple valid prefixes can be provided as a comma-delimited list. -->
    <rule ref="WordPress.NamingConventions.PrefixAllGlobals">
        <properties>
            <property name="prefixes" type="array" value="wp_foundation_six,wpfs"></property>
        </properties>
    </rule>

    <rule ref="PHPCompatibility">
        <!-- Whitelist PHP native classes, interfaces, functions and constants which
             are back-filled by WP.
             Based on:
             * /wp-includes/compat.php
             * /wp-includes/random_compat/random.php
        -->
        <exclude name="PHPCompatibility.PHP.NewClasses.errorFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewClasses.typeerrorFound"></exclude>

        <exclude name="PHPCompatibility.PHP.NewConstants.json_pretty_printFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewConstants.php_version_idFound"></exclude>

        <exclude name="PHPCompatibility.PHP.NewFunctions.hash_equalsFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewFunctions.json_last_error_msgFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewFunctions.random_intFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewFunctions.random_bytesFound"></exclude>
        <exclude name="PHPCompatibility.PHP.NewFunctions.array_replace_recursiveFound"></exclude>

        <exclude name="PHPCompatibility.PHP.NewInterfaces.jsonserializableFound"></exclude>
    </rule>

    <!-- Whitelist the WP Core mysql_to_rfc3339() function. -->
    <rule ref="PHPCompatibility.PHP.RemovedExtensions">
        <properties>
            <property name="functionWhitelist" type="array" value="mysql_to_rfc3339"></property>
        </properties>
    </rule>
</ruleset>
</code></pre>

Now if you change directories into your WordPress theme and run
    `phpcs --standard=phpcs.xml --colors`, PHPCS will run through the standards setup in your XML file and
    let you know if there are any errors or warnings.

<pre><code class="line-numbers lang-bash">phpcs --standard=phpcs.xml --colors
.................................................. 50 / 50 (100%)

Time: 7.63 secs; Memory: 14Mb
</code></pre>

With errors:

<pre><code class="line-numbers lang-bash">phpcs --standard=phpcs.xml --colors
...................................E.............. 50 / 50 (100%)

FILE: header.php
--------------------------------------------------------------------------------------------------------------------------------
FOUND 1 ERROR AFFECTING 1 LINE
--------------------------------------------------------------------------------------------------------------------------------
 70 | ERROR | [x] Expected 1 spaces after opening bracket; 0 found (PEAR.Functions.FunctionCallSignature.SpaceAfterOpenBracket)
--------------------------------------------------------------------------------------------------------------------------------
PHPCBF CAN FIX THE 1 MARKED SNIFF VIOLATIONS AUTOMATICALLY
--------------------------------------------------------------------------------------------------------------------------------

Time: 5.76 secs; Memory: 14Mb
</code></pre>

You can use PHPCBF (PHP Code Beautifier and Fixer) to automatically fix some issues. Typically these would be
    formatting and non-breaking changes.

<pre><code class="line-numbers lang-bash">phpcbf --standard=phpcs.xml --colors
...................................F.............. 50 / 50 (100%)

PHPCBF RESULT SUMMARY
----------------------------------------------------------------------
FILE                                                  FIXED  REMAINING
----------------------------------------------------------------------
header.php                                            1      0
----------------------------------------------------------------------
A TOTAL OF 1 ERROR WERE FIXED IN 1 FILE
----------------------------------------------------------------------

Time: 5.81 secs; Memory: 14Mb
</code></pre>

If you need to test a single file you can do so like this:

<pre><code class="line-numbers lang-bash">phpcs --standard=phpcs.xml --colors header.php
. 1 / 1 (100%)

No fixable errors were found

Time: 312ms; Memory: 12Mb
</code></pre>

### Update (2018-09-13)

A previous version of this article said to use:

<pre><code class="line-numbers lang-bash">phpcs --config-set installed_paths $HOME/utilities/wpcs,/$HOME/utilities/PHPCompatibility
</code></pre>

This was incorrect, the correct pathing would be:

<pre><code class="line-numbers lang-bash">phpcs --config-set installed_paths $HOME/utilities/WordPress-Coding-Standards,/$HOME/utilities/PHPCompatibility
</code></pre>
