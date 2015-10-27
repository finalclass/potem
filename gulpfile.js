var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('default', ['watch', 'commonjs', 'amd']);

gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['commonjs', 'amd']);
});

var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('commonjs', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            emitError: false,
            noImplicitAny: false,
            module: 'commonjs',
            target: 'ES5',
            declaration: true,
            sourcemap: true
        }));

    return merge([
       tsResult.dts.pipe(gulp.dest('build/commonjs')),
       tsResult.js.pipe(gulp.dest('build/commonjs'))
   ]);
});

gulp.task('amd', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            emitError: false,
            noImplicitAny: false,
            module: 'commonjs',
            target: 'ES5',
            declaration: true,
            sourcemap: true
        }));

    return merge([
       tsResult.dts.pipe(gulp.dest('build/amd')),
       tsResult.js.pipe(gulp.dest('build/amd'))
   ]);
});
