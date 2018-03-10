Tagz
====================

## About

#### Tagz is a terminal client for managing files tagging
It is conceived to be cross-platform and cross-"cloud provider" to easily share tags with your colleagues
and family members.

![tagz](https://github.com/teomurgi/tagz/blob/master/clip.gif?raw=true)

## Features

* Cross-platform
* Each directory will have a special __tagz file that stores tags for the other files in the same folder
* When you back up a folder, the __tagz file gets backed up as well
* Works with your cloud provider sync app of choice so that your colleagues immediately get the updated tags

## Intall

```bash
npm install tagz -g
tagz --help
```

## Usage

Here it is the main help message

```bash
Usage: tagz <cmd> [opts]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    list|ls [options] [path]         List files in directory
    add|a [options] <file> <tag>     Add tag to specified file
    delete|d [options] <file> <tag>  Remove tag to specified file
```

### List tags
```bash
Usage: list|ls [options] [path]

  Lists files in directory


  Options:

    -a, --all  Print complete details
    -h, --help  output usage information
```


### Add tag
```bash
Usage: add|a [options] <file> <tag>

  Adds tag to specified file


  Options:

    -r, --recursive  Apply to all the files of the current directory and of all the subdirectories
    -h, --help       output usage information
```

### Remove tag
```bash
  Usage: delete|d [options] <file> <tag>

  Removes tag to specified file


  Options:

    -r, --recursive  Apply to all the files of the current directory and of all the subdirectories
    -h, --help       output usage information
```

## LICENSE - "MIT License"

Copyright (c) 2018 Matteo Murgida

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
