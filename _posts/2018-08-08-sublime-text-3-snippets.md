---
layout: post
title: "Sublime Text 3 Snippets"
description: "Sublime Text Snippets can help you speed up your development time by reducing the need to manually typing out repetitive code. Learn how to create these snippets for different file types."
date: 2018-08-08 22:12:35 -0500
modified_date: 2020-10-02 21:09:55 -0500
categories: ["Guides"]
tags: ["javascript", "php", "sublime-text", "wordpress"]
image: "/assets/uploads/2018/08/sublime-text-snippet.webp"
---

### Sublime Text Snippets

When creating a Sublime Text snippet you have 4 distinct sections.

1. Content
    - The content is the snippet code itself. The snippet can have several field markers for tab completion
                    and cursor placement.
2. Tab Trigger
    - The trigger is the keyword that will start to appear in the Sublime Text contextual menu (auto-complete)
                    as you start to type to get the snippet.
3. Scope
    - The scope will determine what file types the snippet will appear in. To include multiple file types you
                    only have to list them out in a comma separated list.
        - `<scope>source.js,source.jsx</scope>`
        - `<scope>source.php,embedding.php</scope>`
4. Description
    - The description shows up in the auto-complete menu as you type the snippet name.

### Simple Snippet

<pre><code class="line-numbers lang-xml"><snippet>
    <content><![CDATA[
console.log(${1:your_value});
$0
]]></content>
    <tabtrigger>cl</tabtrigger>
    <scope>source.js,source.jsx</scope>
    <description>console.log statement</description>
</snippet>
</code></pre>

In the above example you can see all 4 main sections of a Sublime Text snippet. The interesting part happens within
    the content section. This snippet simply outputs `console.log();` in JavaScript and JSX files and places
    the cursor within the parentheses. Then when done, places the cursors after the `console.log` statement.
    How does this work?

Inside the parentheses you will see the first field marker:
    `${1:your_value}`

This marker is the first tab stop in the snippet. It will output your_value highlighted and ready to be replaced
    with whatever you type. Then we end on the second field marker at `$0`. This field marker is where the
    cursor will be placed once all actions in the snippet are complete.

### Moderate Snippet

<pre><code class="line-numbers lang-xml"><snippet>
    <content><![CDATA[<?php if ( have_rows( '${1:repeater_field_name}' ) ) : ?>
    <?php while ( have_rows( '${1:repeater_field_name}' ) ) : ?>
        <?php the_row(); ?>

        <?php \$${2:my_field} = the_sub_field( '${3:sub_field_name}' ); ?>
    <?php endwhile; ?>
<?php endif; ?>
]]></content>
    <tabtrigger>acf_repeater</tabtrigger>
    <scope>source.php,embedding.php</scope>
    <description>An ACF repeater filed group</description>
</snippet>
</code></pre>

Here is a more complicated example where we have multiple field markers, and in one instance the same field marker
    twice. If you need to rename two parts of your snippet at the same time you can use the same field marker where both
    will be selected when you tab to that instance of the field marker.

This snippet is for a WordPress ACF Repeater template. The reason why I chose a PHP example here is to show you how
    to escape the `$` symbol in a snippet. The `$` is a reserved symbol that will determin the tab
    stops and to escape them you simply add a backslash, `\$`. You can see this on line 6 of the above
    example.

### Additional Information

There is an easy way to quickly generate a snippet template under Tools > Developer > New Snippet. When saving these
    files it’s important to rememeber that you can only have one snippet per file. For this reason I suggest you
    create a custom-snippets folder where you can store these. When you go to save the snippet that has been created
    using the Sublime Text menu, you’ll be show the proper location to save the file. For me this location is
    ~/Library/Application Support/Sublime Text 3/Packages/User/custom-snippets. Be sure to save the file as
    `.sublime-snippet` otherwise Sublime Text will not recognize your file.

![Sublime Text Snippet Location](/assets/uploads/2018/08/sublime-text-snippet.webp)

More information can be found on Sublime Text snippets on the snippets documentaion page:
    [http://sublimetext.info/docs/en/extensibility/snippets.html](http://sublimetext.info/docs/en/extensibility/snippets.html)
