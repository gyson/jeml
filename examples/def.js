'use strict';

var jeml = require('..')
var assert = require('assert')

// no define
var page = jeml`{def name} ${': name, number, okk'}
<p> Hello, {= name}! </p>
`
assert(typeof page === 'function')
page('jeml') // => "<p> Hello, jeml! </p>"

var f2 = jeml`{def a, b, c}
    {= a + b + c}
`
assert(f2(1, 2, 3).replace(/\s+/g, '') === '6')
