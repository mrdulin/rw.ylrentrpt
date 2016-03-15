var gulp = require('gulp');
var loadPluginsConfig = {
	DEBUG: true,
	pattern: ['gulp-*', 'gulp.*'],
	config: 'package.json',
	scope: ['dependencies'],
	replaceString: /^gulp(-|\.)/,
	camelize: true,
	lazy: true
};
var $ = require('gulp-load-plugins')();

var runSequence = require('run-sequence');
var rename = require('gulp-rename');
 
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
		"./src/templates.js",
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
};
 
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe($.clean());
});

gulp.task('copyFont', function() {
	return gulp.src('./node_modules/bootstrap/dist/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts/'));
});
 
gulp.task('templateCache', function () {
  return gulp.src('src/**/*.html')
    .pipe($.angularTemplatecache({
    	root: './src/',
    	standalone: false,
    	module: 'ylrent.rpt.templateCache',
    	moduleSystem: 'IIFE'
    }))
    .pipe($.size())
    .pipe(gulp.dest('src'))
});

gulp.task('scripts', function () {
    return gulp.src(path.scripts)
        .pipe($.ngAnnotate())
        .pipe($.concat('all.min.js'))
        .pipe($.uglify())
        .pipe($.size())
        .pipe(gulp.dest('./dist/scripts'))
});

gulp.task('styles', function() {
	return gulp.src(path.styles)
		.pipe($.concatCss("all.css"))
		.pipe($.cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe($.size())
		.pipe(gulp.dest('./dist/styles'))
});

gulp.task('replaceHtml', function() {
  gulp.src('index.html')
    .pipe($.htmlReplace({
    	'css': 'styles/all.min.css',
        'js': 'scripts/all.min.js'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function() {
	// gulp.watch(path.scripts.concat(path.styles), function() {
		runSequence('clean', 'templateCache', 'scripts', 'styles', 'replaceHtml', 'copyFont');
	// });
});

// gulp.task('webserver', function() {
// 	gulp.src('./')
// 		.pipe($.webserver({
// 			port: 3000,
// 			livereload: true,
// 			directoryListing: false,
// 			open: true,
// 			fallback: 'index.html'
// 		}));
// });