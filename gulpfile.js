const { watch, dest, src } = require("gulp")
const sass = require('gulp-sass');

function defaultTask(cb) {

	cb()
}
// gulp.task('default', function() {

// })

function buildSass() {
	watch(["./stylesheets/*.scss"], function(cb) {
		return src("./stylesheets/**/*.scss")
			.pipe(sass().on("error", sass.logError))
			.pipe(dest("./stylesheets"))
	
		cb()
	})
}


exports.default = buildSass



