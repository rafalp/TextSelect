'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var less = require('gulp-less');

// Entry points

gulp.task('build', [
  'source',
  'style'
]);

gulp.task('watch', ['build'], function() {
  gulp.watch('src/*.js', ['source']);
  gulp.watch('src/*.less', ['style']);
});

// Tasks

gulp.task('lintsource', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('source', ['lintsource'], function() {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('html'));
});

gulp.task('style', function() {
  return gulp.src('src/*.less')
    .pipe(less())
    .pipe(gulp.dest('html'));
});