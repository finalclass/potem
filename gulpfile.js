var gulp = require('gulp');
var tsc = require('gulp-tsc');

gulp.task('default', ['watch', 'commonjs', 'amd']);

gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['commonjs', 'amd']);
})

gulp.task('commonjs', function () {
  return gulp.src('src/**/*.ts')
    .pipe(tsc({
      emitError: false,
      noImplicitAny: true,
      module: 'commonjs',
      target: 'ES5',
      declaration: true,
      sourcemap: true
    }))
    .pipe(gulp.dest('build/commonjs'));
});

gulp.task('amd', function () {
  return gulp.src('src/**/*.ts')
    .pipe(tsc({
      emitError: false,
      noImplicitAny: true,
      module: 'amd',
      target: 'ES5',
      declaration: true,
      sourcemap: true
    }))
    .pipe(gulp.dest('build/amd'));
});
