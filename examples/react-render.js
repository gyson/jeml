'use strict';

var jeml = require('..')
var React = require('react')
var beautify = require('js-beautify')

var e = React.createElement

class Name extends React.Component {
    render() {
        return e('p', null, "this is from react")
    }
}

var html = jeml`{def id}
<div id="{= id}">
    {> ${React.renderToString(e(Name, null))}}
</div>
`

console.log(html('react-node'))

// result:
/*
<div id="react-node">
    <p data-reactid=".d2djuygsu8" data-react-checksum="-584248826">this is from react</p>
</div>
*/
