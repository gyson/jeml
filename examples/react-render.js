'use strict';

var jeml = require('..')
var React = require('react')

var e = React.createElement

class Name extends React.Component {
    render() {
        return e('p', null, "this is from react")
    }
}

var html = jeml`
<div>
    ${{ raw: React.renderToString(e(Name)) }}
</div>
`

var html2 = jeml`

    ${{ call: html, args: 'a, b, c, d' }}
`

console.log(html('react-node'))
