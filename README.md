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

## example
in `layout.jeml`:

```js
default (title, body) {
    html: {
        head: {
            title: `title`
            script(src="some_address...")
        }
        body: {
            `body`
        }
    }
}
```

in `view.jeml`:

```js
import layout "./layout" // import default mixin from layout.jeml

default {
    % var title = "I am title";
    `layout(title, body())`
}

mixin body {
    p: "I am body"

    % var users = {
    %     "foo": "I am foo",
    %     "bar": "I am bar"
    % }

    for name: introduction in `users` {
        p: { "name: " `name`}
        p: { "introduce: " `introduction`}
    }
}

export print_name (name) {
    p: { "my name is " `name` }
}
```

in `main.js`:

```js
// you need to compile *.jeml file to *.js file before `require`
var view = require('./view'); // path/to/generated/view.js

console.log(view());
/* output:
<html>
    <head>
        <title>I am title</title>
        <script src="some_address..."></script>
    </head>
    <body>
        <p>I am body</p>
        <p>name: foo</p>
        <p>introduce: I am foo</p>
        <p>name: bar</p>
        <p>introduce: I am bar</p>
    </body>
</html>
*/

console.log(view.print_name("Gyson"));
/* output:
<p>my name is Gyson</p>
*/

```

## TODO

* command line tool
* tests
* bench
* performance optimization (may use some libs from js side)
