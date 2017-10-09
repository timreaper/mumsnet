/**------------------------------------------------------------------------------------------------------------------**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * ------------------------------------ Ed's Gulp File for Handlebars Projects! ------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 **------------------------------------------------------------------------------------------------------------------**/

/**-------------------------------*
 * Variable Declarations (Custom)
 *--------------------------------*/

/**
 * Source Paths
 ***/
var config = require('./config.json');

/**--------------------------------*
 * Variable Declarations (Requires)
 *---------------------------------*/

/* Auto adds vendor prefixes for CSS*/
var autoPrefixer = require('autoprefixer');

/* Refreshes the browser on change of code */
var browserSync = require('browser-sync').create();

/* Concatenates all files in pipe into one file */
var concat = require('gulp-concat');

/* Deletes files */
var del = require('del');

/* The almighty runner of tasks */
var gulp = require('gulp');

/* Compiles the handlebars templates*/
var handlebars = require('gulp-hb');

/* Minifies the HTML */
var htmlMin = require('gulp-htmlmin');

/* Compresses the image */
var imageMin = require('gulp-imagemin');

/* Minifies the CSS */
var minifyCSS = require('gulp-clean-css');

/* Creates a notify message for when task is complete */
var notify = require('gulp-notify');

/* Allows for gathering path data on files in the pipe */
var path = require('path');

/* CSS post processor for Gulp */
var postCSS = require('gulp-postcss');

/* Image optimiser */
var pngQuant = require('imagemin-pngquant');

/* Prints out filenames of all the files that pass through a task */
var print = require('gulp-print');

var reload = browserSync.reload;

/* Renames files & file extensions */
var rename = require('gulp-rename');

/* Compiles SASS/SCSS into CSS */
var sass = require('gulp-sass');

/* Wrapper allowing for use of object streams */
var through = require('through2');

/* Minifies the JS */
var uglify = require('gulp-uglify');

/**-----------------------------*
 * Tasks (Fetching & Compiling)
 *------------------------------*/

/**
 * Browser Sync
 *      Updates the website in the browser
 ***/
gulp.task('browser_sync', function () {
	browserSync.init({
		proxy: "mumsnet.dev",
		injectChanges: true,
		files: config.dist.rootpath
	});
});

/**
 * Handlebars
 *       Runs through all the JSON files in the pages folder in the data directory,
 *       pumps them through the index Handlebars template and then outputs HTML files
 ***/

gulp.task('handlebars', function () {
	return gulp.src(config.src.rootpath + config.src.data.rootpath + '/*.{js,json}')
		.pipe(through.obj(function (file, enc, cb) {
			var name = path.parse(file.path).name;
			var data = JSON.parse(String(file.contents));

			gulp.src(config.src.rootpath + config.src.handlebars.rootpath + config.src.handlebars.pages.rootpath + '/' + name + '.hbs')
				.pipe(handlebars({
					helpers: config.src.rootpath + config.src.handlebars.rootpath + config.src.handlebars.helpers,
					partials: config.src.rootpath + config.src.handlebars.rootpath + config.src.handlebars.partials.rootpath + '/**/*.hbs',
					bustCache: true
				}).data(data))
				.pipe(rename({
					basename: 'index',
					extname: '.html'
				}))
				.pipe(htmlMin({
					collapseWhitespace: true,
					minifyCSS: true,
					minifyJS: true,
					removeStyleLinkTypeAttributes: true,
					removeScriptTypeAttributes: true,
					useShortDoctype: true
				}))
				.pipe(gulp.dest(config.dist.rootpath + '/' + name))
				.on('error', cb)
				.on('end', cb);
		}));
});

/**
 * Images
 *      Deletes all images in dist, minifies all the images files in source & them moves them into dist
 ***/
gulp.task('images', function () {
	del([config.dist.rootpath + config.dist.images.rootpath + '/**/*']); // Clean images folder repopulating
	return gulp.src(config.src.rootpath + config.src.images.rootpath + '/**/*.{svg,png,gif,jpg,jpeg}')
		.pipe(imageMin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngQuant()]
		}))
		.pipe(gulp.dest(config.dist.rootpath + config.dist.images.rootpath));
});

/**
 * Javascript
 *       Compiles all the Javascript files in the JS directory
 ***/
gulp.task('js', function () {
	return gulp.src(config.src.rootpath + config.src.js.rootpath + '/**/*.js')
		.pipe(order([
			"jquery.js",
			'*.js'
		], jsLib))
		.pipe(print(function (filepath) {
			return "JS: " + filepath;
		}))
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.dist.rootpath + config.dist.js.rootpath));
});


/**
 * SCSS (App)
 *       Compiles all the SCSS stylesheets in the app directory
 ***/
gulp.task('scss_app', function () {
	return gulp.src(config.src.rootpath + config.src.sass.rootpath + config.src.sass.app.rootpath + config.src.sass.app.file)
		.pipe(concat('app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(postCSS([
			autoPrefixer({browsers: ['last 3 versions']})
		]))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.dist.rootpath + config.dist.css.rootpath));
});

/**
 * SCSS (Libraries)
 *       Compiles all the SCSS stylesheets in the libraries directory
 ***/
gulp.task('scss_libraries', function () {
	return gulp.src(config.src.rootpath + config.src.sass.rootpath + config.src.sass.libraries.rootpath + config.src.sass.libraries.file)
		.pipe(concat('libraries.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(postCSS([
			autoPrefixer({browsers: ['last 3 versions']})
		]))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.dist.rootpath + config.dist.css.rootpath));
});

/**----------------------------*
 * Tasks (Watchers)
 *-----------------------------*/

gulp.task('watch', ['browser_sync'], function () {
	gulp.watch(config.src.rootpath + config.src.images.rootpath + '/**/*', ['images']).on("change", reload);
	gulp.watch(config.src.rootpath + config.src.js.rootpath + '/**/*.js', ['js']).on("change", reload);
	gulp.watch(config.src.rootpath + config.src.sass.rootpath + config.src.sass.app.rootpath + '/**/*.scss', ['scss_app']).on("change", reload);
	gulp.watch(config.src.rootpath + config.src.sass.rootpath + config.src.sass.libraries.rootpath + '/**/*.scss', ['scss_libraries']).on("change", reload);
	gulp.watch([config.src.rootpath + config.src.handlebars.rootpath + '/**/*.hbs', config.src.rootpath + config.src.data.rootpath + '/**/*.json'], ['handlebars']);
});

/**----------------------------*
 * Tasks (Running & Executing)
 *-----------------------------*/

/**
 * SCSS (SCSS group task)
 *
 ***/
gulp.task('scss', ['scss_app', 'scss_libraries'], function () {
	console.log('Gulp (SCSS) complete.');
});


/**
 * Default (THE MOST IMPORTANT TASK OF ALL)
 *
 ***/
gulp.task('default', ['handlebars', 'images', 'js', 'scss'], function () {
	console.log('Gulp (Default) complete.');
});

