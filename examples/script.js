'use strict';

var jeml = require('..')

var html = jeml`{def name}

<p> good, {= name} </p>

{script ${0, `
    var okk = 123;
`}}

`

console.log(html('nice'))
