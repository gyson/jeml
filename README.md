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

## Goodness

* High performance. Based on [benchmark](https://github.com/gyson/jeml/blob/master/bench/README.md),
it's a little bit slower than doT, but much faster than Jade, ejs, and handlebars.

## Note

* It's recommended to use Javascript Syntax Highlight to get better look.
* Since generated file is pure javascript, you can use tools to minify or beautify it.

## Example

check [jeml-example](https://github.com/gyson/jeml-example) for usage.
