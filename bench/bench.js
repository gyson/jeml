//
// var all = {
//     ejs: require('./ejs'),
//     jeml: require('./jeml'),
//     jade: require('./jade'),
//     handlebars: require('./handlebars'),
//     dot: require('./dot')
// };
var fs = require('fs');
var beautify = require('js-beautify');


var ejs = require('ejs');
var jeml = require('../index');
var jade = require('jade');
var dot = require('dot');
var handlebars = require('handlebars');

var all = {
    ejs: {
        compile: ejs.compile,
        execute: callTemplate
    },
    jeml: {
        compile: jeml.compile,
        execute: jeml.render
    },
    jade: {
        compile: jade.compile,
        execute: callTemplate
    },
    dot: {
        compile: dot.template,
        execute: callTemplate
    },
    handlebars: {
        compile: handlebars.compile,
        execute: callTemplate
    }
}

function callTemplate (templateFn, arg) {
    return templateFn(arg)
}

//var a = Object.keys(all).join(' ');

// bench `small`
// baded on http://jsperf.com/dom-vs-innerhtml-based-templating/964
'ejs jade jeml dot handlebars'
.split(' ').forEach(bench('small', 50000));

// small / medium / large
function bench (benchName, iteration) {
    var pathName = __dirname + '/' + benchName + '/' + benchName;

    //var htmlPage = fs.readFileSync(pathName + '.html', 'utf8').replace(/\s+/g, '');

    //console.log(htmlPage.length)

    return function (name) {
        // path/to/small/small

        var templateSource = fs.readFileSync(pathName + '.' + name, 'utf8');

        var templateFn = all[name].compile(templateSource);

        if (name === 'jeml') {
            templateFn = require('./small/small.js')
        }

        if (name === 'dot') {
            console.log(beautify(templateFn.toString()))
        }

        var data = require(pathName + '-data.js');

        console.log('\n========', name);

        var start = Date.now();

        // check correctness
        //console.log(all[name].execute(templateFn, data))
        //console.log(all[name].execute(templateFn, data).replace(/\s+/g, '').length)

        for (var i = 0; i < iteration; i++) {
            all[name].execute(templateFn, data);
        }

        var time = Date.now() - start;
        var speed = Math.round(iteration / time);

        console.log('takes %d miliseconds', time);
        console.log('speed %d k ops/second', speed);
    }
}
