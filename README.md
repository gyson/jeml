# jeml

Template engine powered by tagged template strings.

## Installation

```
$ npm install jeml
```

## Usage

```js
var jeml = require('jeml')
var assert = require('assert')

var page = jeml`{def name}
<p> Hello, {= name}! </p>
`
assert(typeof page === 'function')
page('jeml') // => "<p> Hello, jeml! </p>"
```

## License

MIT
