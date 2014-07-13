
var jeml = require('..');

var templateFn = require('./small/small.js');

//console.log(typeof templateFn)

exports.simple = function () {
    // var p = [];
    // var push = function () {
    //     for (var i = 0, len = arguments.length; i < len; i++) {
    //         p.push(arguments[i]);
    //     }
    // }
    // var push = function () {
    //     for (var i = arguments.length, len = arguments.length; i < len; i++) {
    //         p.push(arguments[i]);
    //     }
    // }
    // var push = function (a) {
    //     for (var i = a.length, len = a.length; i < len; i++) {
    //         p.push(a[i]);
    //     }
    // }
    //var push = [].push.bind(p)//Array.prototype.push.bind(p);
    // var fn = templateFn.bind(push);
    // fn('Guo', 'Yunsong');
    // readJSON
    return jeml.render(templateFn, 'Hello!', 'Feeling good!')
    //return ['<p>Hi, I am ', 'Guo', ', ', 'Yunsong', '.</p>'].join('')
}

//console.log(exec());
