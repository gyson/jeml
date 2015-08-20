'use strict';

var jeml = require('..')

var fn = jeml`${'def items'}
    ${'each item in items'}
        <li> ${'= item.name'}: ${'= item.value'} </li>
    ${'end'} 
`

console.log(fn([
    {
        name: 'cool',
        value: 'yes'
    },
    {
        name: 'bad',
        value: 'nono'
    }
]))
