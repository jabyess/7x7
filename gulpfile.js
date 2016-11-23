var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
	return gulp.src('./stylesheets/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./stylesheets'));
})

gulp.task('watch', function() {
	gulp.watch('./stylesheets/*.scss', ['default']);
})