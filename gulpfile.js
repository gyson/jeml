
var gulp = require('gulp')


gulp.task('dev', function () {

// exports.watch = function () {
    var fs = require('fs')
    var sh = require('shelljs')
    var path = require('path')

    var last = Date.now()

    fs.watch(path.join(__dirname, 'index.js'), handler)
    fs.watch(path.join(__dirname, 'dev.js'), handler)

    function handler() {
        var now = Date.now()
        if (last + 2000 < now) {
            last = now
            sh.exec('clear; node dev')
        }
    }
})
