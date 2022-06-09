var gulp          = require('gulp'),
    exec          = require('child_process').exec,

    /** Utils */
    watch         = require('gulp-watch'),
    browserSync   = require('browser-sync').create('jekyll'),
    requireDir    = require('require-dir'),
    runSequence   = require('run-sequence'),
    gutil         = require('gulp-util'),
    gulpAutoTask  = require('gulp-auto-task'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    utils = requireDir('gulp-tasks'); // ex. utils.buildJekyll();
    /** Utilities */
    rename      = require('gulp-rename'),
    size        = require('gulp-filesize'),
  /** CSS */
    sass          = require('gulp-sass'),
    minifyCss     = require('gulp-minify-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    /** Utilities */
    socket = require("socket.io-client")("localhost:3000", {
      rejectUnauthorized: false // WARN: please do not do this in production
    });
    /** Config */
    paths        = require('./package.json').paths;
/** CSS Build */
module.exports = function buildCss () {

  return gulp.src(paths.css.src + 'main.scss')
    .pipe(sass({
      includePaths: [paths.sass.src] // Tell Sass where to look for files
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(size()) // Logs the minified file size to the console
    .pipe(gulp.dest(paths.css.dest));
};
/** Import Main Tasks */
// Require them so they can be called as functions
// Automagically set up tasks
gulpAutoTask('{*,**/*}.js', {
  base: paths.tasks,
  gulp: gulp
});

module.exports = function buildJs() {

  // Build vendor files
  gulp.src(paths.vendor.src + '*.js')
  // Concat files
    .pipe(concat('vendor.js'))
  // Minify combined files and rename
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(size())
    .pipe(gulp.dest(paths.vendor.dest));

  return gulp.src(paths.js.src + '*.js')
  // Concat files
    .pipe(concat('main.js'))
  // Lint file
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
  // Minify files and rename
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(size())
    .pipe(gulp.dest(paths.js.dest));

};
module.exports = function optimizeImg() {

  return gulp.src([paths.img.src + '*', paths.img.src + '**/*'])
    .pipe(imagemin({
      progressive: true,
      use: [pngquant({
        quality: '65-75'
      })]
    }))
    .pipe(gulp.dest(paths.img.dest));

};
module.exports = function buildJekyll(callback, env) {
  var cmd = 'jekyll build --config ';
  cmd += (env === 'prod' ? '_config.build.yml' : '_config.yml');

  // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  return exec(cmd, function(error, stdout, stderror) {
    gutil.log(stdout); // Log the output to the console
    return callback(error !== null ? 'ERROR: Jekyll process exited with code: '+error.code : null);
  });
};
var spawn   = require('child_process').spawn;

// Gulp tasks get passed a callback first, so our secondary arg
// MUST be the second arg. Successful processes return callback(null).
module.exports = function buildJekyll(callback, env) {
  var opts = ['build', '--config']; // add base opts

  // if `env` is 'prod', use the production config file
  opts.push(env === 'prod' ? '_config.build.yml' : '_config.yml');

  // Init the `jekyll` command with our `opts` array
  var jekyll = spawn('jekyll', opts, {
  // https://nodejs.org/api/child_process.html#child_process_options_stdio
    stdio: 'inherit' // use stdin, stdout, etc.
  });

    // Once finished, fire the Gulp callback
    return jekyll.on('exit', function(code) {
      return callback(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
  };
  /** Helper Tasks */
  gulp.task('build', function(callback) {
    return utils.buildJekyll(callback, 'serve');
  });

  gulp.task('build:prod', function(callback) {
    return utils.buildJekyll(callback, 'prod');
  });

  gulp.task('build:assets', ['buildCss', 'buildJs', 'optimizeImg']);

  // BrowserSync needs to get required at the top of the file

 /** BrowserSync */
 // Init server to build directory
 gulp.task('browser', function() {
   browserSync.init({
     server: "./" + paths.build,
     socket: {
         domain: "http://localhost:3000"
    }
   });
 });

 // Force reload across all devices
 gulp.task('browser:reload', function() {
   browserSync.reload();
 });
 /**
  * Main Builds
  */
 gulp.task('serve', ['browser'], function() {
   runSequence('build', ['build:assets']);
   // CSS/SCSS
   gulp.watch([
         paths.src +'fonts/*',
         paths.sass.src +'*.scss',
         paths.css.src +'main.scss',
         paths.sass.src +'**/*.scss',
   ], function() {
     runSequence('buildCss', ['browser:reload']);
   });
   // JS
   watch([paths.js.src +'*.js', paths.vendor.src +'*.js'], function() {
     runSequence('buildJs', ['browser:reload']);
   });

  // Markup / Posts/ Data
  watch([
        paths.src +'*',
        paths.src +'_data/*',
        paths.src +'_plugins/*',
        paths.src +'**/*.md',
        paths.src +'**/*.html',
        paths.src +'**/*.markdown',
        paths.src +'_includes/**/*.md',
        paths.src +'_includes/**/*.svg',
        paths.src +'_includes/**/*.html',
  ], function() {
    runSequence('build', ['build:assets', 'browser:reload']);
  });

  gutil.log('Watching for changes.');
});

gulp.task('deploy', function() {
  runSequence('build:prod', ['build:assets']);
});
