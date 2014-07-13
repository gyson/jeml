'use strict';

var fs = require('fs');
var template = require('./src/template');
var Readable = require('stream').Readable;

// based on _.each
function each (obj, iterator, context) {
    if (obj == null) return obj;
    var i, len = obj.length;
    if (len === +len) {
        for (i = 0; i < len; i++) {
            iterator.call(context, obj[i], i, obj);
        }
    } else {
        var keys = Object.keys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            iterator.call(context, obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
};

function escape (arg) {
    return (typeof arg === 'string' ? arg : String(arg))
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// module.exports = jeml.import(__dirname);
// jeml._compile(src, dest)

// function (require, module, exports, __filename, __dirname)

var jeml = {};

// ignore options for now
jeml.parse = function (str, options) {
    return template.parse(str);
};

jeml.render = function (templateFn) {
    var list = [];

    //based on benchmark
    var context = createContext(function (a) {
        // diff from array.push, only be able to push one item
        // in this way, get best performance
        //list.push(typeof a === 'string' ? a : String(a));
        list.push(a);
    });

    optimizedCall(templateFn, context, arguments);

    return list.join('');
};

function createContext (push) {
    return {
        push: push,
        each: each,
        escape: escape
        // more, ...
    }
}

function optimizedCall (templateFn, context, args) {
    switch (args.length) {
    case 1:
        templateFn.call(context);
        break;
    case 2:
        templateFn.call(context, args[1]);
        break;
    case 3:
        templateFn.call(context, args[1], args[2]);
        break;
    case 4:
        templateFn.call(context, args[1], args[2], args[3]);
        break;
    case 5:
        templateFn.call(context, args[1], args[2], args[3], args[4]);
        break;
    default:
        var args2 = [];
        for (var i = 1, length = args.length; i < length; i++) {
            args2.push(args[i]);
        }
        templateFn.apply(context, args2);
    }
}

/*
p: push

e: each
*/

/*

jeml.stream(templateFn, a1, a2).pipe(process.stdout)
jeml.stream(templateFn, a1, a2).pipe(response)

*/

jeml.stream = function (templateFn) {
    var rs = new Readable;

    // based on benchmark
    var context = createContext(function (a) {
        rs.push(typeof a === 'string' ? a : String(a));
    });

    var args = arguments;

    setImmediate(function () {
        optimizedCall(templateFn, context, args);
        rs.push(null);
    });

    return rs;
};

/*

index.jeml:

default {
    p: 'Hi, I am gyson!'
}

// &"scan"
// &`transform`

var view = jeml.view(__dirname + '/views');

view('index', a1, a2, a3)

view('index@default', a1, a2, a3)

// use with koa
this.body = view('index');

*/

jeml.view = function (dirname, options) {
    // name could be 'index' or 'index@default'
    var view = viewHelper(jeml.render, dirname);

    view.render = view;
    view.stream = viewHelper(jeml.stream, dirname);

    return view;
};

// Not support Non-cache now.

function viewHelper (fn, dirname) {
    return function (name) {
        // index || index@default
        // page/abc@efg
        var n = name.split('@');
        var filename = dir + '/' + n[0] + '.jeml';
        var field = n[1] || "default";
        var templateFn = jeml.cache[filename] || require(filename);

        arguments[0] = templateFn[field];
        return fn.apply(null, arguments);
    };
}

/*
    // not support non-cache yet
    jeml.renderFile({
        file: "path/to/file",
        cache: false
    })

    // streamFile(path, )
*/
jeml.renderFile = function (filePath) {
    if (filePath[0] !== '/') {
        throw new Error(filePath + ' is not absolute path!');
    }
    arguments[0] = jeml.cache[filePath] || require(filePath);
    return jeml.render.apply(null, arguments);
};


jeml.streamFile = function (filePath) {
    if (filePath[0] !== '/') {
        throw new Error(filePath + ' is not absolute path!');
    }
    arguments[0] = jeml.cache[filePath] || require(filePath);
    return jeml.stream.apply(null, arguments);
};

/*

jeml.compileFile('path/to/template')

*/

jeml.cache = {};
// based on nodejs source code
require('module')._extensions['.jeml'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    module._compile(jeml.parse(content, jeml.setting), filename);
    jeml.cache[filename] = require(filename);
};


module.exports = jeml;
