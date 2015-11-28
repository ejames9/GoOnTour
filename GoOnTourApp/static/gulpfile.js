//gulp.js file for GoOnTour.org application.

//// Configuration /////

var gulp = require('gulp');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHtml = require('gulp-minify-html');
var conCat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var extReplace = require('gulp-ext-replace');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');


var webpackConfig1 = {
  target: 'webworker',
  entry: './src/js/reactDateRangePicker2.js',
  output: {
    filename: 'reactDateRangePickerBundle.js'
  }
};

var webpackConfig2 = {
  target: 'webworker',
  entry: './src/js/initiate.js',
  output: {
    filename: 'GoOnTour.js'
  }
};

//// Script Tasks ////

gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('babel', function() {
  var jsxSrc = ['./src/prejs/*.js', './src/prejs/*.jsx'],
      jsDst = './src/js/';
  return gulp.src(jsxSrc)
    .pipe(babel())
    .pipe(extReplace('.js'))
    .pipe(gulp.dest(jsDst));
});

// gulp.task('babel2', function() {
//   var jsSrc = './src/prejs/*.js',
//       jsDst = './src/js/';
//   return gulp.src(jsSrc)
//     .pipe(babel())
//     .pipe(gulp.dest(jsDst));
// });

gulp.task('webpack', function() {
  var compiler = gulpWebpack(webpackConfig1, webpack),
      jsSrc    = './src/js/reactDateRangePicker2.js',
      jsDst    = './build/js/';
  return gulp.src(jsSrc)
    .pipe(compiler)
    .pipe(gulp.dest(jsDst));
});

gulp.task('webpack2', function() {
  var compiler = gulpWebpack(webpackConfig2, webpack),
      jsSrc    = './src/js/initiate.js',
      jsDst    = './build/js/';
  return gulp.src(jsSrc)
    .pipe(compiler)
    .pipe(notify('Scripts Bundled.'))
    .pipe(gulp.dest(jsDst));
});

gulp.task('indexJS', function() {
  var jsSrc = './build/js/*.js',
      jsDst = './build/index/';
  return gulp.src(jsSrc)
    .pipe(conCat('GoOnTourIndex.js'))
    // .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(jsDst));
});

gulp.task('transbundle', function() {
  runSequence('babel', 'webpack');
});
gulp.task('JS', function() {
  runSequence('babel', 'webpack', 'webpack2');
});


//// Image Tasks ////

gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});


//// HTML Tasks ////

gulp.task('build-html', function() {
  var htmlSrc = '../templates/src/*.html',
      htmlDst = '../templates/build/';
  return gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHtml())
    .pipe(notify('Template Built.'))
    .pipe(gulp.dest(htmlDst));
});


//// Style Tasks ////

gulp.task('build-styles', function() {
  var cssSrc = './src/css/*.css',
      cssDst = './build/css/';
  return gulp.src(cssSrc)
    .pipe(conCat('preGoOnTour.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDst));
});
//Add Google font imports.
gulp.task('final-styles', function() {
  var cssSrc = ['./build/css/importFonts.css', './build/css/preGoOnTour.css'],
      cssDst = './build/index/';
  return gulp.src(cssSrc)
    .pipe(conCat('GoOnTour.css'))
    .pipe(notify('CSS Ready.'))
    .pipe(gulp.dest(cssDst));
});
gulp.task('CSS', function() {
  runSequence('build-styles', 'final-styles');
});

//// Automation ////

gulp.task('default', function() {
  runSequence('imagemin', 'build-html', 'CSS', 'JS');

  // Watch for changes in DatePicker jsx
  gulp.watch('./src/prejs/reactDateRangePicker2.jsx', function() {
    gulp.run('JS');
  });

  //Watch for changes in HTML files
  gulp.watch('../templates/src/*.html', function() {
    gulp.run('build-html');
  });

  //Watch for changes in CSS files
  gulp.watch('./src/css/*.css', function() {
    gulp.run('CSS');
  });

  //Watch for changes in JavaScript files
  gulp.watch('./src/prejs/*.js', function() {
    gulp.run('JS');
  });

});
