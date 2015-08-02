var gulp = require('gulp');
var del = require('del');
var paths = require('vinyl-paths');
var debug = require('gulp-debug');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var tsConfig = require('gulp-tsconfig');
var tsLint = require('gulp-tslint');

var src = ['lib/**/*.ts'];
var dest = gulp.dest('lib');
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

gulp.task('clean:tests', function () {
  gulp.src(['tests/**/*.{js,map}']).pipe(paths(del));
});

gulp.task('clean:library', function () {
  gulp.src(['lib/**/*.{js,map}']).pipe(paths(del));
});

gulp.task('clean', ['clean:library', 'clean:tests']);

/**
 * Lint TypeScript files
 */
gulp.task('lint', function () {
  return gulp.src(src)
    .pipe(tsLint())
    .pipe(tsLint.report('verbose', {
      emitError: false
    }));
});

/**
 * Build & run tests (without building project)
 */
gulp.task('mocha', ['build:tests'], function () {
  return gulp.src('tests/**/*.js')
    .pipe(mocha());
});

/**
 * Build project and test, then run tests
 */
gulp.task('test', ['build'], function () {
  return gulp.src('tests/**/*.js')
    .pipe(mocha());
});

/**
 * Generate new tsconfig.json
 */
gulp.task('configure', function () {
  return gulp.src(src)
    .pipe(debug({ title: 'added to tsconfig.json' }))
    .pipe(tsConfigTask())
    .pipe(debug({ title: 'created' }))
    .pipe(gulp.dest('./'));
});


gulp.task('build:library', ['clean:library'], function () {
  return gulp.src(src)
    .pipe(ts(tsCompilerOptions))
    .pipe(debug({ title: 'compiled' }))
    .pipe(dest);
});

gulp.task('build:tests', ['clean:tests'], function () {
  return gulp.src('tests/**/*.ts')
    .pipe(ts(tsCompilerOptions))
    .pipe(debug({ title: 'compiled' }))
    .pipe(gulp.dest('tests'))
});

gulp.task('build', ['build:library', 'build:tests']);

gulp.task('watch', function() {
  return gulp.watch('{lib,tests}/**/*.ts', ['test']);
});


