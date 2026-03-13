---
layout: post
title: "How to quickly convert multiple word documents to PDFs on macOS"
description: "Learn how to use soffice on the command line to quickly convert multiple word documents to pdf documents."
date: 2020-04-29 05:05:39 -0500
modified_date: 2020-10-02 21:09:51 -0500
categories: ["Articles"]
tags: ["command-line", "learning", "macos", "shell-script"]
image: "/assets/uploads/2020/04/facebook-1.webp"
---

If you need to convert a single word document to a pdf it’s easy enough to open the file in Microsoft Word or
    Adobe Acrobat and save it out as a PDF. However, what if you have multiple documents you need to convert to a PDF,
    we’re talking about tens or even hundreds of Word Documents that need to be converted. This could be articles
    you’ve written that you now want to share through a website archive linking out the PDF documents or HR
    documents that need to be saved in less editable file format for archive purposes.

## Enter LibreOffice

LibreOffice is a free and powerful office suite that can be installed on macOS, Windows 10, and even linux. But
    it’s not exactly LibreOffice that we are wanting to use; it’s something that come with LibreOffice that
    we need to track down.

[https://www.libreoffice.org/](https://www.libreoffice.org/)

It’s easy enough to download and install LibreOffice, it’s free and open source. But for what we want to
    do we will need to turn to the command line. After installing the application you can find the tool we want here on
    macOS:

`/Applications/LibreOffice.app/Contents/MacOS/soffice`

It’s called soffice. A manual page for this tool can be found here:
    [https://www.systutorials.com/docs/linux/man/1-soffice/](https://www.systutorials.com/docs/linux/man/1-soffice/)

The way we can go about this is to specify an output file format then the input file to be converted. Here is what
    this looks like on a single file:

- cd into the directory with your file
- list the file with ls to be sure you’re in the correct directory
- The use the full path to soffice to run the application
- we are doing this in `headless` mode to not have to open LibreOffice
- Then we say what we are converting to with `--convert-to pdf`
- And finally give it the name of our file

```bash
cd ~/Desktop/convert

ls -lagh
total 28K
drwxr-xr-x  3  96  Wed. Apr 29 2020 - 04:32:56 AM  .
drwx------+ 7 224  Wed. Apr 29 2020 - 04:32:56 AM  ..
-rw-r--r--  1 25K  Wed. Apr 29 2020 - 04:32:30 AM  mywordoc.docx

/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf mywordoc.docx
convert /Users/bcerecero/Desktop/convert/mywordoc.docx -> /Users/bcerecero/Desktop/convert/mywordoc.pdf using filter : writer_pdf_Export
```

It will then convert the document from docx to pdf without losing formatting or images.

## Using soffice for multiple files

To do this for multiple files we are going to use another command line application called find. This will already be
    available by default on the command line. Here is what this will look like:

- We will use find to run a regular expression on the current directory and find all files ending with doc or docx
- We are using the `-iregex` option as we want to grab all files ending it doc or docx regardless of
        the casing of the file format.

If you run this command by itself it’ll look as follows:

```bash
find -E . -type f -iregex ".*\.(doc|docx)$"
./mywordoc.docx
```

Now that we captured all of our Word documents we will use finds
    `-exec` option to pass the found files into soffice:

```bash
find -E . -type f -iregex '.*\.(doc|docx)$' -exec /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf '{}' \+

convert /Users/bcerecero/Desktop/convert/mywordoc.docx -> /Users/bcerecero/Desktop/convert/mywordoc.pdf using filter : writer_pdf_Export
```

- We use find to get all doc or docx files
- Pass them into soffice using finds `-exec` option
- In `-exec` we can place each item soffice using ‘{}’
- Then be sure to end the command with `\+`

When the command is executed it will show each file that was converted. One thing to note is that all the converted
    files will be placed in the directory that you executed the command in so I also like to pass the
    `--outdir` option with soffice place all these files into one directory.

Also, note that I ended the command with `\;` rather than `\+` so that we could add the
    `--outdir` option after the `'{}'`.

```bash
find -E . -type f -iregex '.*\.(doc|docx)$' -exec /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf '{}' --outdir './converted-files' \;

convert /Users/bcerecero/Desktop/convert/mywordoc2.docx -> /Users/bcerecero/Desktop/convert/converted-files/mywordoc2.pdf using filter : writer_pdf_Export
convert /Users/bcerecero/Desktop/convert/mywordoc.docx -> /Users/bcerecero/Desktop/convert/converted-files/mywordoc.pdf using filter : writer_pdf_Export
```

One more option for passing the output of find into soffice is to pipe it into xargs like so:

```bash
find -E . -type f -iregex '.*\.(doc|docx)$' | xargs -I{} /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf {} --outdir ./converted-documents
```

## Making soffice easier to use

I don’t like having to constantly path directly to
    `/Applications/LibreOffice.app/Contents/MacOS/soffice` each time I want to use it. So, what I do it in my
    .`.zshrc` file is I add the following line to add the LibreOffice CLI applications to my system path.

`export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"`

If you don’t use zsh, you would place this in your
    `.bash_profile` file. Both of these files can be found in your user directory which you can get to by
    typing `cd ~` into your terminal application.

Now instead of
    `/Applications/LibreOffice.app/Contents/MacOS/soffice` you can use `soffice`!
