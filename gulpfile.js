
var gulp = require('gulp');
var jeml = require('./index')
var gutil = require('./lib/gulp-util')
var beautify_html = require('js-beautify').html;

gulp.task('watch', function () {
    gulp.watch('./lib/template.jison', ['jison']);
    gulp.watch('./dev/*.jeml', ['dev-jeml', 'dev-test']);
});

gulp.task('jison', function () {
    gulp.src('./lib/template.jison')
        .pipe(gutil.jison({ moduleType: 'commonjs' }))
        //.pipe(gutil.logger())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('dev-jeml', function () {
    gulp.src('./dev/*.jeml')
        .pipe(gutil.jeml())
        .pipe(gutil.beautify({ indentSize: 4 }))
        .pipe(gutil.logger())
        .pipe(gulp.dest('./dev/'))
});

gulp.task('bench-jeml', function () {
    gulp.src('./bench/small/*.jeml')
        .pipe(gutil.jeml())
        .pipe(gutil.beautify({ indentSize: 4 }))
        .pipe(gutil.logger())
        .pipe(gulp.dest('./bench/small/'))
});

gulp.task('dev-test', function () {
    // clear cache
    delete require.cache[require.resolve('./dev/test')]
    var templateFn = require('./dev/test');
    console.log(beautify_html(jeml.render(templateFn, "gyson")))
});
