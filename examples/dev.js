'use strict';

var jeml = require('..')


jeml`${'input name, abcd'}

`


var f = jeml`{def a, b, c}
    {* I am comment

    }
    goodness ${ ' okkk <hell\'o></hello>' }

<herf="good/${ "llll" }">

{> a}

{= a > 10 ? "hello" : "world" }


{each key, name in a}
    <p> {= name} </p>
{end}

{> ${name}(a, b, c)}

angular js template ?

{if a}
    hello
    <hello abc='hello'> </hello>
    <hello></hello>
{else if c > 30}
    good
{else}
    bad
{end}

${'raw expression'}

${'= expression'}

${''}

{> ${sum}(a, b, c)}

${'if x > 10'}

${'end'}

${{call: sum, args: 'a, b, c'}}

${{ call: sum, args: 'a, b, c' }}

`

function sum(a, b, c) {
    return a + b + c
}

console.log("============")
console.log(f(1, 2, 3))
console.log("============")
console.log(f.toString())
console.log("============")
