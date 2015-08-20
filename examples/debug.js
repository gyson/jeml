'use strict';

var jeml = require('..')

// has error to compile ?

try {
var f1 = jeml`{def name, number}
    ${'= name'}: {= number}

    ${'if number > 10'}
    ${''/* miss `{end}` here */}
`
} catch (e) {
    console.log(e.name, e.message)
    console.log(e.body)
}
// result
/*
SyntaxError Unexpected token ) while compiling jeml template
function _jeml_0__fn_name_(name, number){var _jeml_s_='';_jeml_s_+='\
\n    ';_jeml_s_+=_jeml_escape_((name));_jeml_s_+=': ';_jeml_s_+=_jeml_escape_((number));_jeml_s_+='\
\n\
\n    ';if(number > 10){_jeml_s_+='\
\n    ';_jeml_s_+=(_jeml_inputs_[0]);_jeml_s_+='\
\n';;return _jeml_s_}
*/

// runtime error

var fn2 = jeml`{def name, number}
    <body>
        {= name}: {= name} {= noexist}
    </body>
`
console.log(fn2('hello', 123)) // stack trace works as expected
