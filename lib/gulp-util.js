
var jeml = require('../index');
var beautify = require('js-beautify');
var parser = require('gulp-file-parser');
var JisonParser = require('jison').Parser;

/*

gulp

*/

exports.jison = parser({
    name: 'gulp-jison',
    func: function (data, options) {
        return new JisonParser(data, options).generate();
    },
    extension: '.js'
});

exports.beautify = exports.js = parser({
    name: 'gulp-beautify',
    func: beautify
});

exports.html = parser({
    name: 'gulp-html',
    func: beautify.html
});

exports.jeml = parser({
    name: 'gulp-jeml',
    func: function (str) {
        // clear cache
        delete require.cache[require.resolve('../src/template')];
        return require('../src/template').parse(str);
    },
    extension: '.js'
});

exports.logger = parser({
    name: 'gulp-logger',
    func: function (data) {
        console.log('==================');
        console.log(data);
        console.log('==================');
        return data;
    }
});
