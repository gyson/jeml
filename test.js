'use strict';

var test = require('tape')
var jeml = require('./index')

test('{def block}', function (t) {
    var fn, result, expected

    fn = jeml`{def x, y, z}
        {= x} {= y} {= z}
    `
    result = fn(1, 2, 3).replace(/\s+/g, '')
    expected = '123'
    t.equal(result, expected)

    // should throw
    fn = jeml`{def name}
        <p> hello, {= name} </p>
    `
    result = fn('okkk').replace(/\s+/g, '')
    expected = '<p>hello,okkk</p>'
    t.equal(result, expected)

    t.end()
})

// escaped
test('${escape expression}', function (t) {
    var fn, result, expected

    fn = jeml`{def name}
        {= "hello," + name}
    `
    result = fn("ggyy").replace(/\s+/g, '')
    expected = 'hello,ggyy'
    t.equal(result, expected)

    fn = jeml`
        {= "><'"}
    `
    result = fn().replace(/\s+/g, '')
    expected = '&gt;&lt;&#39;'
    t.equal(result, expected)

    t.end()
})

// unescaped
// {unescape: }
test('{raw unescaped}', function (t) {
    var fn, result, expected

    fn = jeml`
        {> "><'"}
    `
    result = fn().replace(/\s+/g, '')
    expected = '><\''
    t.equal(result, expected)

    var f1 = jeml`{def name}
        <hello> {= name} </hello>
    `
    var f2 = jeml`
        <strong>{> ${f1}("okk")}</strong>
    `
    result = f2().replace(/\s+/g, '')
    expected = '<strong><hello>okk</hello></strong>'
    t.equal(result, expected)

    // ${exp} is the same as {> ${exp}}
    fn = jeml`
        <p> ${ 'hello' } </p>
    `
    result = fn().replace(/\s+/g, '')
    expected = '<p>hello</p>'
    t.equal(result, expected)

    fn = jeml`
        ${ "&><'" }
    `
    result = fn().replace(/\s+/g, '')
    expected = '&><\''
    t.equal(result, expected)

    t.end()
})

test('{if exp}', function (t) {
    var fn, result, expected

    fn = jeml`
        {if 10 > 5}
            okk
        {end}
    `
    result = fn().replace(/\s+/g, '')
    expected = 'okk'
    t.equal(result, expected)

    fn = jeml`
        {if 10 < 5}
            none
        {else}
            okk
        {end}
    `
    result = fn().replace(/\s+/g, '')
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

        ${'if x.name'}
            ${'each abc in x.name'}

            ${'end'}
        ${'else'}
            <p> abcdefg </p>
        ${'end'}

    `

    ${'if x.name = 123'}


    result = fn().replace(/\s+/g, '')
    expected = 'okk'
    t.equal(result, expected)

    t.end()
})

test('{each val in exp}', function (t) {
    var fn, result, expected

    fn = jeml`
        {each name in [1, 2, 3, 4]}
            <p>{= name}</p>
        {end}

        ${'each name in abc'}
            ${'= name'}
        ${'end'}
    `
    result = fn().replace(/\s+/g, '')
    expected = '<p>1</p><p>2</p><p>3</p><p>4</p>'
    t.equal(result, expected)

    fn = jeml`
        {each index, value in ${['hello', 'good', 'bye']}}
            <p>{= index} : {= value}</p>
        {end}
    `
    result = fn().replace(/\s+/g, '')
    expected = '<p>0:hello</p><p>1:good</p><p>2:bye</p>'
    t.equal(result, expected)

    t.end()
})
