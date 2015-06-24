'use strict';

module.exports = jeml

var reEscape = /[&<>"'\/]/g
var hasEscapedChars = /[&<>"'\/]/
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

function assert(bool, message) {
    if (!bool) {
        throw new Error(message || '')
    }
}

var ESCAPE = '_jeml_escape_'
var INPUTS = '_jeml_inputs_'
var JEML_STRING = '_jeml_s_'
var JEML_ASSERT = '_jeml_assert_'

var reBody = /(\}(?:\\\{|[^\{])*)|(\{(?:\\\}|[^\}])*)/g
var reInput = new RegExp(`(\\(${INPUTS}\\[\\d+\\]\\))`)

var count = 0
function getUniqueName() {
    return `_jeml_${count++}_`
}

// line number
function jeml(strings) {
    var inputs = [].slice.call(arguments, 1)

    var stack = new Error().stack.split('\n')[2]
    var lineNum = ~~(/:(\d+):\d+/.exec(stack)[1]) - 1

    var str  = '}' + strings.raw[0]
    for (var i = 1; i < arguments.length; i++) {
        str += `(${INPUTS}[${i - 1}])`
        str += strings.raw[i]
    }

    var args = ''
    var body = ''

    var result = str.replace(reBody, function (match, text, exp) {
        if (match[0] === '}') {
            var result = ''
            text.slice(1).split(reInput).forEach(function (str, index) {
                if (index % 2 === 0) {
                    str = str.replace(/\n/g, '\\\n\\n')
                            .replace(/\\\{/g, '{')
                            .replace(/\\\}/g, '}')
                            .replace(/\'/g, '\\\'')
                    if (str !== '') {
                        result += `${JEML_STRING}+=\'${str}\';`
                    }
                } else {
                    result += `${JEML_STRING}+=${str};`
                }
            })
            return result
        }

        var ret = exp.slice(1)
                    .replace(/\\\{/g, '{')
                    .replace(/\\\}/g, '}')
        var parsed

        // {def a, b, c}
        if (parsed = /^\s*def\s*([^]*)/.exec(ret)) {
            args = parsed[1]
            return ''
        }

        // {each index, value in exp}
        if ((parsed = /^\s*each\s+(\w+)\s*,\s*(\w+)\s+in\s+([^]*)/.exec(ret)) !== null) {
            var i = getUniqueName()
            var e = getUniqueName()
            var l = getUniqueName()
            var index = parsed[1]
            var value = parsed[2]
            var exp = parsed[3]
            return `for(var ${i}=0,${e}=(${exp}),${l}=(${e}&&${e}.length)||0;${i}<${l};${i}++){var ${value}=${e}[${i}],${index}=${i};`
        }

        // {each value in exp}
        if (parsed = /^\s*each\s+(\w+)\s+in\s+([^]*)/.exec(ret)) {
            var i = getUniqueName()
            var e = getUniqueName()
            var l = getUniqueName()
            var value = parsed[1]
            var exp = parsed[2]
            return `for(var ${i}=0,${e}=(${exp}),${l}=(${e}&&${e}.length)||0;${i}<${l};${i}++){var ${value}=${e}[${i}];`
        }

        // {for value of map}
        // {for key in obj}
        if (parsed = /^\s*for\s*([^]*)/.exec(ret)) {
            return `for(var ${parsed[1]}){`
        }

        // {else if exp}
        if (parsed = /^\s*else\s+if\s*([^]*)/.exec(ret)) {
            return `}else if(${parsed[1]}){`
        }

        // {if exp}
        if (parsed = /^\s*if\s*([^]*)/.exec(ret)) {
            // console.log(parsed)
            return `if(${parsed[1]}){`
        }

        // {else}
        if (parsed = /^\s*else\s*/.exec(ret)) {
            return `}else{`
        }

        // {end}
        if (parsed = /^\s*end\s*/.exec(ret)) {
            return '}'
        }

        // {js throw new Error()}
        if (parsed = /^\s*js\s*([^]*)/.exec(ret)) {
            return `${parsed[1]};`
        }

        if (parsed = /^\s*assert\s*([^]*)/.exec(ret)) {
            return `${JEML_ASSERT}(${parsed[1]});`
        }

        // {script ${fs.readFileSync("path/to/file.js")}}
        if (parsed = /^\s*script\s*([^]*)/.exec(ret)) {
            return `${JEML_STRING}+='<script>';${JEML_STRING}+=${parsed[1]};${JEML_STRING}+='</script>';`
        }

        // {style ${fs.readFileSync("path/to/file.css")}}
        if (parsed = /^\s*style\s*([^]*)/.exec(ret)) {
            return `${JEML_STRING}+='<style>';${JEML_STRING}+=${parsed[1]};${JEML_STRING}+='</style>';`
        }

        // unescape
        if (parsed = /^\s*>\s*([^]*)/.exec(ret)) {
            return `${JEML_STRING}+=${parsed[1]};`
        }

        // escape
        if (parsed = /^\s*=\s*([^]*)/.exec(ret)) {
            return `${JEML_STRING}+=${ESCAPE}((${parsed[1]}));`
        }

        // comment
        if (parsed = /^\s*\*\s*([^]*)/.exec(ret)) {
            return parsed[1].replace(/[^\n]/g, '')
        }

        // line number ?
        var err = new Error(`Invalid expression: \`{${ret}}\``)
        err.body = ''
        throw err // jeml syntax error
    })

    var nameId = getUniqueName() + '_fn_name_'
    var body = `function ${nameId}(${args}){var ${JEML_STRING}='';${result};return ${JEML_STRING}}`

    try {
        var fn = (new Function(ESCAPE, INPUTS, JEML_ASSERT, `'use strict';return ${body}`)(escape, inputs, assert))
        function _jeml_ignore_() {
            try {
                return fn.apply(this, arguments)
            } catch (e) {
                if (e && typeof e.stack === 'string') {
                    e.stack = e.stack.split('\n').map(function (line) {
                        if (line.indexOf(nameId) !== -1) {
                            var ret = (/<anonymous>:(\d+):(\d+)/.exec(line))
                            return stack.replace(/:\d+:\d+/, ':' + (~~ret[1] + lineNum) + ':' + ret[2])
                        }
                        return line
                    }).filter(function (line) {
                        return !(/_jeml_ignore_/.exec(line))
                    }).join('\n')
                }
                throw e // jeml runtime error
            }
        };
        _jeml_ignore_.toString = fn.toString.bind(fn);
        return _jeml_ignore_;
    } catch (e) {
        e.message += ` while compiling jeml template`
        e.body = body
        throw e // jeml syntax error
    }
}
