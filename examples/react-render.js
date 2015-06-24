'use strict';

var jeml = require('..')
var React = require('react')

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
