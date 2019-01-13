var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var removeFiles = require('gulp-remove-files');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * ',(new Date()), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/main.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    gulp.src('dist/css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
    gulp.src('dist/css/main.css')
        .pipe(removeFiles());
    gulp.src('dist/css/cookiealert.css')
        .pipe(removeFiles());
});

gulp.task('css', ['less', 'minify-css'], function () {

});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['img/**/*']).pipe(gulp.dest('dist/img'));
    gulp.src(['files/**/*']).pipe(gulp.dest('dist/files'));
    gulp.src(['index.html']).pipe(gulp.dest('dist'));
    gulp.src(['robots.txt']).pipe(gulp.dest('dist'));
    gulp.src(['sitemap.xml']).pipe(gulp.dest('dist'));
});

// Run everything
gulp.task('default', ['css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    })
});

// Dev task with browserSync
// gulp.task('dev', ['css', 'minify-js', 'browserSync'], function() {
//     gulp.watch('less/*.less', ['less']);
//     gulp.watch('css/*.css', ['minify-css']);
//     gulp.watch('js/*.js', ['minify-js']);
//     // Reloads the browser whenever HTML or JS files change
//     gulp.watch('*.html', browserSync.reload);
//     gulp.watch('js/**/*.js', browserSync.reload);
// });

gulp.task('serve', [ 'default', 'browserSync'], function () {
    gulp.watch('less/*.less', ['css']);
    gulp.watch('js/*.js', ['minify-js']);
    gulp.watch('index.html', ['copy']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/**/*', browserSync.reload);
});