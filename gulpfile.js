
var gulp = require('gulp');
var jison = require('gulp-jison');
var nodemon = require('gulp-nodemon');

gulp.task('dev', function () {
    nodemon({
        script: "./src/template.js",
        args: ["./dev/test.jeml"],
        ext: "jison jeml"
    })
    .on('change', ['jison']);
});


gulp.task('jison', function () {
    gulp.src('./src/*.jison')
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest('./src/'));
});

var fs = require('fs');
var jeml = require('gulp-jeml');
var beautify = require('gulp-beautify');

gulp.task('compile', function () {
    gulp.src(["./example/*.jeml"])
        .pipe(jeml())
        .pipe(beautify({ indentSize: 4 }))
        .pipe(gulp.dest('./example/'));
});
