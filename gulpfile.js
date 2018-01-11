var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');
var jshint = require('gulp-jshint');
var lib = require('bower-files')();
var browserSync = require('browser-sync').create();
var babelify = require('babelify');

gulp.task('concatInterface', function() {
  return gulp.src(['./src/js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js']})
    .transform(babelify.configure({
      presets: ["es2015"]
    }))
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('minifyScripts', ['jsBrowserify'], function() {
  return gulp.src('./dist/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('clean', function() {
  return del(['dist', 'tmp']);
});

gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('bowerCSS', function () {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('build', ['clean'], function() {
  if(buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('htmlBuild');
  gulp.start('cssBuild');
});

gulp.task('jshint', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint']), function() {
  browserSync.reload();
};

gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
});

gulp.task('htmlBuild', function() {
  return gulp.src(['src/*.html'])
    .pipe(gulp.dest('./dist'));
  browserSync.reload();
});

gulp.task('cssBuild', function() {
  return gulp.src(['src/css/*.css'])
    .pipe(gulp.dest('./dist/css'));
  browserSync.reload();
})

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html"
    }
  });

  gulp.watch(['src/*.html'], ['htmlBuild']);
  gulp.watch(['src/css/*.css'], ['cssBuild']);
  gulp.watch(['src/js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
});
