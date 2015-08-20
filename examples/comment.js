'use strict';

var jeml = require('..')

var comment = jeml`{def name}

    ${'# this is comment'}

    ${{
        // this is comment nobody care
        // this a comment nobody care at all
        // you can write anything here
    }}

    ${{/* this is comment */}}

    <p> hello, ${'= name'} </p>
`

console.log(comment('world!')) // <p> hello, world! </p>
