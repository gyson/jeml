'use strict';

var assert = require('assert')

module.exports = jeml

var reEscape = /[&<>"'\/]/g

var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
}

var fnEscape = function (char) {
    return escapeMap[char]
}

var hasEscapedChars = /&<>"'\//

function escape(str) {
    if (str == null) {
        return ''
    }
    if (typeof str !== 'string') {
        str = String(str)
    }
    // when string is small, test string first
    if (str.length < 300 && !hasEscapedChars.test(str)) {
        return str
    }
    return str.replace(reEscape, fnEscape)
}

var ESCAPE = '_jeml_escape_'
var INPUTS = '_jeml_inputs_'
var JEML_STRING = '_jeml_s_'

var reBody = /(\}(?:\\\{|[^\{])*)|(\{(?:\\\}|[^\}])*)/g
var reInput = new RegExp(`[=?!]?\\(${ INPUTS }\\[(\\d+)\\]\\)`, 'g')

var count = 0
function getUniqueName() {
    return `_jeml_${count++}_`
}

// by default, it will eliminate space...

function jeml(strings) {
    var inputs = [].slice.call(arguments, 1)

    var str  = '}' + strings.raw[0]
    for (var i = 1; i < arguments.length; i++) {
        str += ` (${INPUTS}[${i - 1}]) `
        str += strings.raw[i]
    }

    var args = ''
    var body = ''

    var result = str.replace(reBody, function (match, text, exp, index, src) {
        // text
        if (match[0] === '}') {
            // scaning raw strings, get all {} // =>
            // {} ${}
            // { exp ? 'selected' : '' }
            // xxx="{expression}" yyy="/name/good/${expression}"
            var ret = text.slice(1)
                    .replace(reInput, function (_, index) {
                        return escape(inputs[index])
                    })
                    .replace(/\s+/g, ' ')
                    .replace(/\\\{/g, '{')
                    .replace(/\\\}/g, '}')
                    .replace(/\'/g, '\\\'')
            if (ret === '') {
                return ''
            } else {
                return `${JEML_STRING}+=\'${ret}\';`
            }
        }

        // exp
        // if (match[0] === '{') {
        var ret = exp.replace(/\{\s*/, '')
        var parsed

        // fn.length property: // function (a, b, c) ???
        // {def} => 0
        // { def a, b, c } => 3
        // { def a, b, ...c } => 2 // => support if env support
        if (parsed = /\s*def\s*([^]*)/.exec(ret)) {
            assert(!args)
            args = parsed[1]
            return ''
        }

        // // {each index, value in exp}
        // // for (var i = 0, e = exp, l = e.length; i < l; i++) { var value = e[i]; var index = i;
        if ((parsed = /\s*each\s+(\w+)\s*,\s*(\w+)\s+in\s+([^]*)/.exec(ret)) !== null) {
            var i = getUniqueName()
            var e = getUniqueName()
            var l = getUniqueName()
            var index = parsed[1]
            var value = parsed[2]
            var exp = parsed[3]
            return `for(var ${i}=0,${e}=${exp},${l}=(${e}&&${e}.length)||0;${i}<${l};${i}++){var ${value}=${e}[${i}],${index}=${i};`
        }

        // {each value in exp}
        // for (var i = 0, e = exp, l = (e && e.length) || 0; i < l; i++) { var value = e[i];
        // /\s*each\s+(\w+)\s+in\s+([^]*)/
        if (parsed = /\s*each\s+(\w+)\s+in\s+([^]*)/.exec(ret)) {
            var i = getUniqueName()
            var e = getUniqueName()
            var l = getUniqueName()
            var value = parsed[1]
            var exp = parsed[2]
            return `for(var ${i}=0,${e}=${exp},${l}=(${e}&&${e}.length)||0;${i}<${l};${i}++){var ${value}=${e}[${i}];`
        }

        // {else if exp}
        // } else if (exp) {
        if (parsed = /\s*else\s+if\s+([^]*)/.exec(ret)) {
            return `}else if(${parsed[1]}){`
        }

        // {if exp}
        // if (exp) {
        if (parsed = /\s*if\s+([^]*)/.exec(ret)) {
            // console.log(parsed)
            return `if(${parsed[1]}){`
        }

        // {else}
        // } else {
        if (parsed = /\s*else\s*/.exec(ret)) {
            return `}else{`
        }

        // {end}
        // }
        if (parsed = /\s*end\s*/.exec(ret)) {
            return '}'
        }

        if (parsed = /\s*raw\s+([^]*)/.exec(ret)) {
            //
            return `${JEML_STRING}+=${parsed[1]};`
        }

        // {script ${0, ` var a = 10; var b = 20 `}}
        // {script ${fs.readFileSync("path/to/file.js")}}
        // check escape ? </script> tag ?
        if (parsed = /\s*script\s+([^]*)/.exec(ret)) {
            // parse
            // assert it's ${ ... }
            // var script = parsed[1]
            return `${JEML_STRING}+='<script>';${JEML_STRING}+=${parsed[1]};${JEML_STRING}+='</script>';`
        }

        // {style ${0, `body { background: }`}}
        // {style ${fs.readFileSync("path/to/file.css")}}
        if (parsed = /style\s+([^]*)/.exec(ret)) {
            // assert it's ${` body ... `}
            return `${JEML_STRING}+='<style>';${JEML_STRING}+=${parsed[1]};${JEML_STRING}+='</style>';`
        }

        // it's just expression
        return `${JEML_STRING}+=${ESCAPE}((${ret}));`
    })

    // process args
    // args = args || 'function(){"use strict";'

    var body = `function(${args}){'use strict';var ${JEML_STRING}='';${result};return ${JEML_STRING}}`

    try {
        return (new Function(ESCAPE, INPUTS, `return ${body}`)(escape, inputs))
    } catch (e) {
        e.raw = body // or e.body ?
        throw e
    }
}
