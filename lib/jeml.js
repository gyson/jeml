'use strict';

var fs = require('fs');
var each = require('./util').each;
var escape = require('./util').escape;

// module.exports = jeml.import(__dirname);
// jeml._compile(src, dest)

// function (require, module, exports, __filename, __dirname)

function parse(str) {
    // for dev only
    delete require.cache[require.resolve('./template')];
    var template = require('./template');
    return template.parse(str);
}
exports.parse = parse

// parse file
// function (require, module, exports, __filename, __dirname)
function parseFile(path, opts) {

}
exports.parseFile = parseFile

function render(templateFn) {
    var context = {
        s: "",
        each: each,
        escape: escape
        // more, ...
    };

    var args = [].slice.call(arguments)
    args.shift()

    templateFn.apply(context, args)

    return context.s;
}
exports.render = render

function renderFile(path) {

}
exports.renderFile = renderFile

/*
    var render = jeml.view(__dirname + '/views');

    render('index', a1, a2, a3)

    render('index@default', a1, a2, a3)

    // use with koa
    this.body = render('index');
*/

function view(dirname, options) {
    // name could be 'index' or 'index@default'

    return function (name) {
        // index || index@default
        // page/abc@efg
        var n = name.split('@');
        var filename = dirname + '/' + n[0] + (n[0].slice(-5) === '.jeml' ? '' : '.jeml');
        var field = n[1] || "default";
        var templateFn = jeml.cache[filename] || require(filename);

        arguments[0] = templateFn[field];
        return jeml.render.apply(null, arguments);
    };
}
exports.view = view

/*
    jeml.compile('string...')
    jeml.compileFile('path to that file')
*/

function compile(str) {
    var script = jeml.parse(str);
    var module = {};
    (new Function('module', 'exports', script))(module, {});
    return module.exports;
}
exports.compile = compile

function compileFile(filePath) {
    return require(filePath);
};
exports.compileFile = compileFile

// based on nodejs source code
require('module')._extensions['.jeml'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    module._compile(jeml.parse(content, jeml.setting), filename);
};

module.exports = jeml;
