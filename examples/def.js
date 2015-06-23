'use strict';

var jeml = require('..')
var assert = require('assert')

// no define
var f1 = jeml`
    empty
`
assert(f1.length === 0)

var f2 = jeml`{def a, b, c}
    {= a + b + c}
`
assert(f2.length === 3)
assert(f2(1, 2, 3).replace(/\s+/g, '') === '6')
