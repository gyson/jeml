
var gulp = require('gulp');
var jison = require('gulp-jison');
var nodemon = require('gulp-nodemon');

gulp.task('dev', function () {
    // watch files
    // compile .jeml to .js
    // print .js file / save .js file to some src
    nodemon({
        script: "./src/template.js",
        args: ["./dev/test.jeml"],
        ext: "jison jeml"
    })
    .on('change', ['jison']);
});

// gulp.task('watch', function () {
//     gulp.watch("./src/*.jison", ['jison'])
// });

gulp.task('jison', function () {
    gulp.src('./src/*.jison')
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest('./src/'));
});

var fs = require('fs');
var jeml = require('./src/template');

gulp.task('compile', function () {
    var file = fs.readFileSync(__dirname + "/dev/test.jeml", "utf8");
    var parsedFile = jeml.parse(file);
    fs.writeFileSync(__dirname + "/dev/test.js", parsedFile, "utf8");
});

// gulp.task('compile', function () {
// // test.jsnp
//     gulp.src('./dev/*.jeml')
//         .pipe()
// });
