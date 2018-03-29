/*eslint-env node */

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');

gulp.task('default', ['styles', 'lint'], function() {
  gulp.watch('css/**/*.css', ['styles']);
  gulp.watch('js/app.js', ['lint']).on('change', browserSync.reload);
  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('subpages/**/*.html').on('change', browserSync.reload);

  browserSync.init({
    server:'.'
  });
});

gulp.task('lint', function(){
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('styles', function(done) {
  gulp.src('css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('/css'))
    .pipe(browserSync.stream());
  done();
});
