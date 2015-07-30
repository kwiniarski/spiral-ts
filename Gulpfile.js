var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var tsConfig = require('gulp-tsconfig');
var tsLint = require('gulp-tslint');

var src = ['lib/**/*.ts'];
var tsProject = ts.createProject('tsconfig.json');
var tsCompilerOptions = {
    'module': 'commonjs',
    'target': 'ES5',
    'sourceMap': true,
    'removeComments': false,
    'experimentalDecorators': true					
};
var tsConfigTask = tsConfig({
	tsOrder: src,
	tsConfig: {
		'compilerOptions': tsCompilerOptions
	}
});

gulp.task('clean', function (cb) {
  del([
    'lib/**/*.js',
    'lib/**/*.js.map',
    'npm-debug.log'
  ], cb);
});

gulp.task('lint', function(){
  return gulp.src(src)
    .pipe(tsLint())
    .pipe(tsLint.report('verbose', {
      emitError: false
    }));
});

gulp.task('configure', function () {
  return gulp.src(src).pipe(tsConfigTask());
});

gulp.task('compile', ['configure'], function () {
  return tsProject.src().pipe(ts(tsProject)).js;
});

gulp.task('build', ['clean', 'compile']);
gulp.task('watch', function() {
  return gulp.watch(src, ['build']);
});


