'use strict';

var jeml = require('../..')

module.exports = jeml`{def obj}
<div>
    <h1 class="header"> {= obj.header}</h1>
    <h2 class="header2">{= obj.header2}</h2>
    <h3 class="header3">{= obj.header3}</h3>
    <h4 class="header4">{= obj.header4}</h4>
    <h5 class="header5">{= obj.header5}</h5>
    <h6 class="header6">{= obj.header6}</h6>
    <ul class="list">
        {each item in obj.list}
            <li class="item">
                {= item}
            </li>
        {end}
    </ul>
    <ul class="list">
        {each project in obj.projects}
            <li class="project">
                {= project.name} : {= project.description}
            </li>
        {end}
    </ul>
</div>
`

// console.log(module.exports.toString())
// console.log(module.exports(require('./small-data')))
