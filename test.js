'use strict';

var test = require('tape')
var jeml = require('./index')

//
// {def a, b, c}
// it should only defined at the very beginning
//
// {def}
// {def x}
// {def x, y}
// {def x, y, z}
//
test('{def block}', function (t) {
    var fn, result, expected

    fn = jeml`{def x, y, z}
        {x} {y} {z}
    `
    result = fn(1, 2, 3).replace(/ /g, '')
    expected = '123'
    t.equal(result, expected)

    // should throw
    fn = jeml`{def name}
        <p> hello, { name } </p>
    `
    result = fn('okkk').replace(/ /g, '')
    expected = '<p>hello,okkk</p>'
    t.equal(result, expected)

    fn = jeml`{def a, b, c, d, e, f}`
    result = fn.length
    expected = 6
    t.equal(result, expected)

    t.end()
})

test('${ block }', function (t) {
    var fn, result, expected

    fn = jeml`
        <p> ${ 'hello' } </p>
    `
    result = fn().replace(/ /g, '')
    expected = '<p>hello</p>'
    t.equal(result, expected)

    fn = jeml`
        ${ "&><'" }
    `
    result = fn().replace(/ /g, '')
    expected = '&amp;&gt;&lt;&#39;'
    t.equal(result, expected)

    t.end()
})

//
// {if exp}      // if (exp) {
// {else if exp} // } else if (exp) {
// {else if exp} // } else if (exp) {
// {else}        // } else {
// {end}         // => }
//
test('{if block}', function (t) {
    var fn, result, expected

    fn = jeml`
        {if 10 > 5}
            okk
        {end}
    `
    result = fn().replace(/ /g, '')
    expected = 'okk'
    t.equal(result, expected)

    fn = jeml`
        {if 10 < 5}
            none
        {else}
            okk
        {end}
    `
    result = fn().replace(/ /g, '')
    expected = 'okk'
    t.equal(result, expected)

    fn = jeml`
        {if false}
            bad
        {else if false}
            bad
        {else if true}
            okk
        {else}
            bad
        {end}
    `
    result = fn().replace(/ /g, '')
    expected = 'okk'
    t.equal(result, expected)

    t.end()
})

//
// {each name in abc}       // for (var i = 0; i < xxx; i++) {
// {each key, value in abc} // ...
// {end}                    // }
// {each name in abc if name > 10} // for (var i = 0; i < xx; i++) { if(exp) {continue}
//
test('each block', function (t) {
    var fn, result, expected

    fn = jeml`
        {each name in ${[1, 2, 3, 4]}}
            <p>{name}</p>
        {end}
    `
    result = fn().replace(/ /g, '')
    expected = '<p>1</p><p>2</p><p>3</p><p>4</p>'
    t.equal(result, expected)

    fn = jeml`
        {each index, value in ${['hello', 'good', 'bye']}}
            <p>{index} : {value}</p>
        {end}
    `
    result = fn().replace(/ /g, '')
    expected = '<p>0:hello</p><p>1:good</p><p>2:bye</p>'
    t.equal(result, expected)

    t.end()
})

// escaped
test('{expression}', function (t) {
    var fn, result, expected

    fn = jeml`{def name}
        {"hello," + name}
    `
    result = fn("ggyy").replace(/ /g, '')
    expected = 'hello,ggyy'
    t.equal(result, expected)

    fn = jeml`
        { "><'"}
    `
    result = fn().replace(/ /g, '')
    expected = '&gt;&lt;&#39;'
    t.equal(result, expected)

    t.end()
})

// unescaped
test('raw block', function (t) {
    var fn, result, expected

    fn = jeml`
        {raw "><'"}
    `
    result = fn().replace(/ /g, '')
    expected = '><\''
    t.equal(result, expected)

    var f1 = jeml`{def name}
        <hello> {name} </hello>
    `
    var f2 = jeml`
        <strong>{raw ${f1}("okk")}</strong>
    `
    result = f2().replace(/ /g, '')
    expected = '<strong><hello>okk</hello></strong>'
    t.equal(result, expected)

    t.end()
})


// {script ${function (global) { ... }}}
// =>
// bad ? <script> var global = (new Function('return this')()); ... </script> // problematic ?
// or ?
// perfered <script> ;(function(global) { ... }(new Function('return this')())); <script>

// throw exception if found '</script>' ???
test('{script block}', function (t) {
    var fn, result, expected

    fn = jeml`
        hello
        {script ${0,`var x = 10;var y = 20;`}}
    `
    // console.log(fn.toString())
    result = fn().replace(/ /g, '')
    expected = 'hello<script>varx=10;vary=20;</script>'
    t.equal(result, expected)

    t.end()
})

//
// {style ${`body { background: #ffffff }`}} // minify ?
//
test('{style block}', function (t) {
    var fn, result, expected

    try {
    fn = jeml`
        {style ${0,`body {background: red}`}}
    `
    } catch (e) {console.log(e.raw); throw e}
    result = fn().replace(/ /g, '')
    expected = '<style>body{background:red}</style>'
    t.equal(result, expected)

    t.end()
})
