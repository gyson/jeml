'use strict';

var jeml = require('..')

var fn = jeml`
    {for val of [1, 2, 3, 4]}
        <p> {= val} </p>
    {end}
`

console.log(fn())

var fn2 = jeml`{def obj}
    {for key in obj}
        <p> {= key} : {= obj[key]} <p>
    {end}
`

console.log(fn2({
    'hello': 123,
    'good': 345,
    'okkk': 5787
}))
