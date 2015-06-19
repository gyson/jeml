'use strict';

var jeml = require('..')
var beautify = require('js-beautify')

var html = jeml`{def name}

<p> good, {= name} </p>

{style ${0, `
    body {
        background: #ffffff
    }
    head {
        background: #111111
    }
`}}

`

console.log(beautify.html(html('nice')))

// result:
/*
<p> good, nice </p>
<style>
    body {
        background: #ffffff
    }

    head {
        background: #111111
    }
</style>
*/
