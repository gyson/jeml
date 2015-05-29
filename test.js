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
test('def block', function (t) {
    var fn = jeml`{def x, y, z}
        {x} {y} {z}
    `
    var result = fn(1, 2, 3).replace(/w+/, '')
    var expected = '123'
    // assert(result === expected)

    // should throw
    var fn = jeml`{def name}
        <p> hello, { name } </p>
    `

    t.equal(
        fn('okkk').replace(/ /g, ''),
        '<p>hello,okkk</p>'
    )

    t.end()
})

test('${} block', function (t) {

    var fn = jeml`
        <p> ${ 'hello' } </p>
    `

    // should escaped

    t.equal(
        fn().replace(/ /g, ''),
        '<p>hello</p>'
    )

    t.end()
})

//
// {if exp}      // if (exp) {
// {else if exp} // } else if (exp) {
// {else if exp} // } else if (exp) {
// {else}        // } else {
// {end}         // => }
//
test('if block', function (t) {

    t.end()
})

//
// {each name in abc}       // for (var i = 0; i < xxx; i++) {
// {each key, value in abc} // ...
// {end}                    // }
// {each name in abc if name > 10} // for (var i = 0; i < xx; i++) { if(exp) {continue}
//
test('each block', function (t) {

    t.end()
})

// {case exp}
// {when exp, exp2}
//     {case exp}
//     {when exp1, exp2}
//     {else}
//     {end}
// {end}

//
// {case exp1}      // if (XXX = exp1, false) {
// {when exp2}      // } else if (XXX === exp2) {
// {when exp3}      // } else if (XXX === exp3) {
// {else}           // } else {
// {end}            // }
//
// test('case block', function () {
//
// })

// escaped
test('expression block', function (t) {

    t.end()
})

// unescaped
test('raw block', function (t) {

    t.end()
})

//
// {script $(function (global) { ... })}
// =>
// // bad ? <script> var global = (new Function('return this')()); ... </script> // problematic ?
// or ?
// // perfered <script> ;(function(global) { ... }(new Function('return this')())); <script>
//
// throw exception if found '</script>' ???
test('script block', function (t) {
    var fn = jeml`
        {script ${`
            var x = 10;
            var y = 20;
        `}}
    `
    t.end()
})

//
// {style ${`body { background: #ffffff }`}} // minify ?
//
test('style block', function (t) {

    t.end()
})
