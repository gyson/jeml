'use strict';

var jeml = require('..')
var markdown = require('markdown').markdown

var text = `
## title

This is description.

#### header

I am body
`

var mark = jeml`{def id}
<div id="{= id}">
    {> ${markdown.toHTML(text)}}
</div>
`

console.log(mark("markdown.text"))
