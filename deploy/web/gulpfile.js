var gulp = require('gulp'),
	sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
	connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware');

var path = {
    app: 'app/',
    output: 'app/'
};

gulp.task('lint', function() {
    gulp.src(path.app + 'scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
    gulp.src(path.app + 'styles/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.output + 'styles'))
        .pipe(connect.reload());        
});

gulp.task('js', function () {
    gulp.src(path.app + 'scripts/**/*.js')
        .pipe(connect.reload());        
});

gulp.task('watch', function() {
	gulp.watch([path.app + 'views/**/*', path.app + 'style/**/*', path + 'index.html'], ['views']);
	gulp.watch(path.app + 'scripts/**/*.js', ['js']);
});

gulp.task('views', function() {
	gulp.src(path.app + 'views/**/*')
		.pipe(connect.reload());
	
	gulp.src(path.app + 'index.html')
		.pipe(connect.reload());
	

	gulp.src(path.app + 'styles/**/*')
		.pipe(connect.reload());
		
});

gulp.task('default', ['sass', 'watch', 'connect']);
gulp.task('serve', ['sass', 'watch', 'connect']);

gulp.task('connect', function() {
  connect.server({
    root: ['.', 'app'],
    livereload: true,
    port: 8000,
    middleware: function(conn, opt) {
        return [
            proxy('/rest', {
                target: 'http://127.0.0.1:8081',
                ws: true
            })
        ];
    }
  });
});
