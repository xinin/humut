const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const removeFiles = require('gulp-remove-files');
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * ', (new Date()), ' <%= pkg.author %>\n',
  ' */\n',
  '',
].join('');

// Compile LESS files from /less into /css
gulp.task('less', () => gulp.src('less/main.less')
  .pipe(less())
  .pipe(header(banner, { pkg }))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({
    stream: true,
  })));

// Minify compiled CSS
gulp.task('minify-css', ['less'], () => {
  gulp.src('dist/css/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true,
    }));
  gulp.src('dist/css/main.css')
    .pipe(removeFiles());
  gulp.src('dist/css/cookiealert.css')
    .pipe(removeFiles());
});

gulp.task('css', ['less', 'minify-css'], () => {

});

// Minify JS
gulp.task('minify-js', () => gulp.src('js/*.js')
  .pipe(uglify())
  .pipe(header(banner, { pkg }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.reload({
    stream: true,
  })));

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', () => {
  gulp.src(['img/**/*']).pipe(gulp.dest('dist/img'));
  gulp.src(['files/**/*']).pipe(gulp.dest('dist/files'));
  gulp.src(['index.html']).pipe(gulp.dest('dist'));
  gulp.src(['robots.txt']).pipe(gulp.dest('dist'));
  gulp.src(['sitemap.xml']).pipe(gulp.dest('dist'));
});

// Run everything
gulp.task('default', ['css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
  });
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

gulp.task('serve', ['default', 'browserSync'], () => {
  gulp.watch('less/*.less', ['css']);
  gulp.watch('js/*.js', ['minify-js']);
  gulp.watch('index.html', ['copy']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('dist/**/*', browserSync.reload);
});
