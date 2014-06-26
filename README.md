# JEML
Javascript-embedded Markup Language

## Introduction

Parse Jade-like syntax (without identation) and generator
pure javascript code with CommonJS module for usage. You can just
`require('/path/to/generated.js')` it for server side. Use
browserify if you want to use it in client side.

You may want to use [gulp-jeml](https://github.com/gyson/gulp-jeml)
to generate js files.

## Installation

```
$ npm install jeml
```

## Note

* It's recommended to use Javascript Syntax Highlight to get better look.
* Since generated file is pure javascript, you can use tools to minify or beautify it.

## Example

check [jeml-example](https://github.com/gyson/jeml-example) for usage.

## TODO

* command line tool
* tests
* bench
* performance optimization (may use some libs from js side)
