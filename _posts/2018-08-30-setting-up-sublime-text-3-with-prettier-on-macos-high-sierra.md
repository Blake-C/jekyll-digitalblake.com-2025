---
layout: post
title: 'Setting up Sublime Text 3 with Prettier on macOS High Sierra'
description: 'Learn how to setup Sublime Text with JsPretter and the Prettier CLI on macOS to format your code and enjoy more consistent formatting.'
date: 2018-08-30 23:50:53 -0500
modified_date: 2020-10-02 21:09:54 -0500
categories: ['Guides']
tags: ['javascript', 'prettier', 'sublime-text', 'wordpress']
image: '/assets/uploads/2018/08/prettier-sublime-facebook.webp'
---

> Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing
> it with its own rules that take the maximum line length into account, wrapping code when necessary.

I’ve fallen in love with Prettier and how I can write my code and leave the formatting up to my tooling. Here are several reason why you should use prettier.

- Consistent formatting within teams
- Automated ruler limiting
- Less thought process in formatting code
- Less time debating formatting with teammates
- Has many integrations with other tools like ESLint

Most people I know are using VSCode as their main text editor, but I still like Sublime Text and wanted to share my process setting up Prettier in case anyone else runs into the same issues that I did.

Here is what this process will look like.

- Install Prettier globally using NPM. This also means you need node installed
- Install the
  [JsPrettier](https://packagecontrol.io/packages/JsPrettier) Sublime Text package
- Configure JsPrettier Settings
- Configure .prettierrc within your project

### 1. Install Prettier

The prerequisite to installing Prettier globally on your system is having NodeJS and NPM installed first. I use nvm to manage my Node versions; so my setup is a little different from the norm and there will be more on why nvm might pose an issue further down.

Install Node if you don’t already have it: [https://nodejs.org/en/](https://nodejs.org/en/)

If you would prefer nvm, you can install it from here: [https://github.com/creationix/nvm](https://github.com/creationix/nvm).

Once Node is installed run `npm install prettier -g`. If you prefer yarn the command will be `yarn global add prettier`.

### 2. Install JsPrettier in Sublime Text

If you need to download Sublime Text you can do so from here: [https://www.sublimetext.com/](https://www.sublimetext.com/).

You will also need the Sublime Text package manager which can be installed following the instructions from here: [https://packagecontrol.io/installation](https://packagecontrol.io/installation).

Once you have both installed hit `cmd + shift + p` and search for install package and look up and install the JsPrettier plugin.

### 3. Configure JsPrettier Settings

Now it’s time to configure JsPrettier. To do this goto `Sublime Text > Preferences > Package Settings > JsPrettier > Settings - User`. If you need to see all available settings you can open up the sibling file `Settings - Default`.

![Configure JsPrettier Settings](/assets/uploads/2018/08/sublime-text-jsprettier-settings.webp)

Here is what my settings file for JsPrettier looks like:

```json
{
	"debug": false,
	"node_path": "/Users/your-user-directory/.nvm/versions/node/v8.9.1/bin/node",
	"auto_format_on_save": true,
	"prettier_cli_path": "/Users/your-user-directory/.nvm/versions/node/v8.9.1/bin/prettier",
	"auto_format_on_save_requires_prettier_config": true,
	"auto_format_on_save_excludes": ["*/node_modules/*", "*.json"],
	"allow_inline_formatting": false,
	"prettier_options": {
		"arrowParens": "avoid",
		"bracketSpacing": true,
		"jsxBracketSameLine": false,
		"parser": "babylon",
		"printWidth": 80,
		"semi": false,
		"tabWidth": 4,
		"singleQuote": true,
		"trailingComma": "es5",
		"useTabs": true
	}
}
```

The first thing that should standout are the `node_path` and `prettier_cli_path` settings. If you installed Node without using nvm I don’t think you will need these settings, but if you run into the issue where JsPrettier does not run then give these two settings a try. What I had to do since I’m using nvm is tell JsPrettier where I had Node and the Prettier CLI packages installed.

To fill in the `node_path` and `prettier_cli_path` settings you can open your terminal application and run `which node` and `which prettier` the output of these two commands should give the full path to the package binaries the JsPrettier plugin needs to run.

I feel like the other settings in this file are fairly self explanatory. But if you need more information on each setting and what they do read the `Settings - Default` file or the JsPrettier documentation.

[https://packagecontrol.io/packages/JsPrettier](https://packagecontrol.io/packages/JsPrettier)

FYI, if you are coding on a team then I highly encourage you to keep the `"auto_format_on_save_requires_prettier_config": true,` set to true. Don’t format files that your team does not already use Prettier with. This is something you need to bring up with your team and decide if you will commit code to your repos that have been formatted and your team has decided to use consistently.

### 4. Configure .prettierrc within your project

What we have done so far is set global setting within Sublime Text. Not super useful unless your team and projects have also decided to use Prettier. To setup your projects to use Prettier and the JsPrettier plugin with Sublime Text you will want to add a .prettierrc file with the settings that should be specific to that project. Any settings you don’t set will fallback to the global setting from earlier.

Here is why the .prettierrc file in my projects looks like:

```json
{
	"printWidth": 80,
	"semi": false,
	"singleQuote": true,
	"tabWidth": 4,
	"trailingComma": "es5",
	"useTabs": true
}
```

The project that I use can be found at [https://github.com/Blake-C/wp-foundation-six](https://github.com/Blake-C/wp-foundation-six). The specific .prettierrc file for this project can be found in the [theme directory](https://github.com/Blake-C/wp-foundation-six/tree/master/public_html/wp-content/themes/wp-foundation-six).

If there are files and directories you want Prettier to ignore you can add a .prettierignore file that works just like a .gitignore file

Here is what my .prettierignore file looks like:

```json
*.json
*.yml
node_modules
assets
```

I don’t like having Prettier touch my JSON and YAML files so I have those ignored entirely.

Once you have everything setup test out Prettier. Open a JavaScript file and remove all the indents and git `cmd + s`. What should happen is all the code will become instantly formatted again. If you have never ran Prettier on the file before it might be a little different from what is was initially.

My favorite part of Prettier is that is does only work with JavaScript files but all kinds of files types. SCSS, CSS, Markdown, YAML, JSON. Checkout the [Prettier](https://github.com/prettier/prettier) documentation for more details.

Something I want to be clear about is that Prettier does not allow you to write better code and does not prevent errors. Therefore, you still need to mindfull of the logic you create in your applications; Prettier only formats the code that you write.
