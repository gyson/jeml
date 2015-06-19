'use strict';

var jeml = require('..')
var beatify = require('js-beautify')
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

console.log(beatify.html(mark("markdown.text")))

// result:
/*
<div id="markdown.text">
    <h2>title</h2>

    <p>This is description.</p>

    <h4>header</h4>

    <p>I am body</p>
</div>
*/
