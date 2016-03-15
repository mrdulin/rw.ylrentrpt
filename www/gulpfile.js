var gulp = require('gulp');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
// var useref = require('gulp-useref');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var runSequence = require('run-sequence');
 
var path = {
	scripts: [
		"./node_modules/angular/angular.js",
		"./node_modules/angular-touch/angular-touch.js",
		"./node_modules/angular-ui-router/release/angular-ui-router.js",
		"./node_modules/angular-resource/angular-resource.js",
		"./node_modules/angular-animate/angular-animate.js",
		"./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
		"./node_modules/angular-i18n/angular-locale_zh-cn.js",
		"./node_modules/moment/moment.js",
		"./node_modules/underscore/underscore.js",
		"./node_modules/jquery/dist/jquery.js",
		"./node_modules/bootstrap-daterangepicker/daterangepicker.js",
		"./node_modules/angular-daterangepicker/js/angular-daterangepicker.js",
		"./node_modules/angular-loading-bar/build/loading-bar.js",
		"./src/app.js",
		"./src/router.js",
		"./src/**/*.js"
	],
	styles: [
		"./node_modules/bootstrap/dist/css/bootstrap-theme.css",
		"./node_modules/bootstrap/dist/css/bootstrap.css",
		"./node_modules/bootstrap-daterangepicker/daterangepicker.css",
		"./node_modules/angular-loading-bar/build/loading-bar.css",
		"./src/**/*.css"
	]	
}
 
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

gulp.task('copyFont', function() {
	return gulp.src('./node_modules/bootstrap/dist/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts/'));
});
 
gulp.task('templateCache', function () {
  return gulp.src('src/**/*.html')
    .pipe(templateCache({
    	standalone: true,
    	moduleSystem: 'IIFE'
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('scripts', ['clean', 'templateCache'], function () {
    return gulp.src(path.scripts)
        .pipe(ngAnnotate())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('styles', function() {
	return gulp.src(path.styles)
		.pipe(concatCss("all.css"))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/styles'))
});

gulp.task('build', ['scripts', 'styles'], function() {
  gulp.src('index.html')
    .pipe(htmlreplace({
    	'css': 'styles/all.min.css',
        'js': 'scripts/all.min.js'
    }))
    .pipe(gulp.dest('./dist/'));
});d

gulp.task('default', function() {
	runSequence(['scripts', 'styles'], 'build', 'copyFont');
});

// gulp.task('webserver', function() {
// 	gulp.src('./')
// 		.pipe(webserver({
// 			livereload: true,
// 			directoryListing: false,
// 			open: true,
// 			fallback: 'index.html'
// 		}));
// });