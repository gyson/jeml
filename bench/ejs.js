
var fs = require('fs');
var ejs = require('ejs');

var code = fs.readFileSync(__dirname + '/small/small.ejs', 'utf8');

var simpleTemplate = ejs.compile(code);

exports.simple = function () {
    return simpleTemplate({
        title: 'Hello!',
        text: 'Feeling good!'
    });
}
//
// console.log(exec());
//
// console.log(templateFn.toString());
//
// console.log(ejs.compile.toString())
