
var Handlebars = require('handlebars');

var source = '<p>Hi, I am {{lastName}}, {{firstName}}.</p>'

var template = Handlebars.compile(source);

exports.exec = function () {
    return template({ firstName: 'Yunsong', lastName: 'Guo' });
}
