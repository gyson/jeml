
var fs = require('fs');
var dot = require('dot');

var tempFn = dot.template("<p>Hi, I am {{=it.lastName}}, {{=it.firstName}}</p>");



console.log(tempFn.toString())

var simpleSource = fs.readFileSync(__dirname + '/small/small.dot', 'utf8');
var simpleTemplate = dot.template(simpleSource);
exports.simple = function () {
    return simpleTemplate({
        title: 'Hello!',
        text: 'Feeling good!'
    });
}
