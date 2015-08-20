'use strict';

var jeml = require('..')

var fn = jeml`${'def grade'}
    ${'if grade > 80'}
        <p> Great! </p>
    ${'else if grade > 70'}
        <p> Good! </p>
    ${'else if grade > 60'}
        <p> Okk! </p>
    ${'else'}
        <p> Bad! </p>
    ${'end'}
`

console.log(fn(88))

console.log(fn(77))

console.log(fn(66))

console.log(fn(55))
