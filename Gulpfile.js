var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var envify = require('envify/custom');
var source = require('vinyl-source-stream');
var del = require('del');
var jscs = require('gulp-jscs-custom');
var babel = require('gulp-babel');

var browserifyConfig = {
  entries: [path.join(__dirname, 'index.js')],
  standalone: 'Biff'
};

gulp.task('clean', function(cb) {
  del(['lib', 'dist'], cb);
});

gulp.task('lib', ['clean'], function() {
  return gulp.src(['src/**/*.js','!src/__tests__/*'])
             .pipe(babel())
             .pipe(gulp.dest('lib'))

});

gulp.task('browserify', ['lib'], function() {
  return browserify(browserifyConfig)
          .transform(envify({NODE_ENV: "production"}))
          .bundle()
          .pipe(source('Biff.js'))
          .pipe(gulp.dest('./dist/'))
});

gulp.task('jscs', function(){
  return gulp.src('src/*.js')
      .pipe(jscs({esnext: true}))
});

gulp.task('default', ['clean', 'lib', 'browserify']);
