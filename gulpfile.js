var gulp    = require('gulp');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");

gulp.task('scripts', function() {
  gulp.src(['./views/**/*.js', '!./views/**/*.test.js', '!./views/app.min.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('./app.min.js'))
      //.pipe(uglify({mangle: true}))
      .pipe(gulp.dest('views'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('views'));
});

gulp.task('watch', function() {
  watch(['./views/**/*.js', '!./views/**/*.test.js', '!./views/app.min.js'], function () {
    gulp.start('scripts');
  });
});

gulp.task('default', ['scripts'/*, 'watch'*/]);