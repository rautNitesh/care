//
// Variables ===================================
//

// Load dependencies
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename')
const browsersync = require('browser-sync').create();
const cached = require('gulp-cached');
const cleancss = require('gulp-clean-css');
const del = require('del');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const imagemin = require('gulp-imagemin');
const purgecss = require('gulp-purgecss');
const webp = require('gulp-webp');

// Define paths
const paths = {
  base: {
    base: {
      dir: './'
    },
    node: {
      dir: './node_modules'
    }
  },
  dist: {
    base: {
      dir: './dist'
    },
    img:{
      dir: './dist/assets/images'
    }
  },
  src: {
    base: {
      dir: './src',
      files: './src/**/*'
    },
    css: {
      dir: './src/assets/css',
      files: './src/assets/css/**/*'
    },
    html: {
      dir: './src',
      files: './src/**/*.html'
    },
    img: {
      dir: './src/assets/images',
      files: './src/assets/images/**/*'
    },
    js: {
      dir: './src/assets/js',
      files: './src/assets/js/**/*'
    },
    partials: {
      dir: './src/partials',
      files: './src/partials/**/*'
    },
    scss: {
      dir: './src/assets/scss',
      files: './src/assets/scss/**/*',
      main: './src/assets/scss/**/*.scss'
    },
    tmp: {
      dir: './src/.tmp',
      files: './src/.tmp/**/*'
    }
  }
};

//
// Tasks ===================================
//

gulp.task('browsersync', function(callback) {
  browsersync.init({
    server: {
      baseDir: [paths.src.tmp.dir, paths.src.base.dir, paths.base.base.dir]
    }
  });
  callback();
});

gulp.task('browsersyncReload', function(callback) {
  browsersync.reload();
  callback();
});

gulp.task('watch', function() {
  gulp.watch(paths.src.scss.files, gulp.series('scss'));
  gulp.watch([paths.src.js.files, paths.src.img.files], gulp.series('browsersyncReload'));
  gulp.watch(
    [paths.src.html.files, paths.src.partials.files],
    gulp.series('fileinclude', 'browsersyncReload')
  );
});

gulp.task("js", function () {
  return gulp
    .src(paths.src.js.main)
    .pipe(uglify())
    .pipe(
      rename(function (path) {
        return {
          dirname: path.dirname + "",
          basename: path.basename + ".min",
          extname: ".js",
        }
      })
    )
    .pipe(gulp.dest(paths.src.css.dir))
    .pipe(browsersync.stream())
})

gulp.task("scss", function () {
  return gulp
    .src(paths.src.scss.main)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    // .pipe(purgecss())
    .pipe(cleancss())
    .pipe(
      rename(function (path) {
        return {
          dirname: path.dirname + "",
          basename: path.basename + ".min",
          extname: ".css",
        }
      })
    )
    .pipe(gulp.dest(paths.src.css.dir))
    .pipe(browsersync.stream())
})

gulp.task('copyfonts', function() {
  gulp.src('./src/assets/css/graphikfont/*.{ttf,woff,eot,woff2}')
  .pipe(gulp.dest('./dist/assets/css/graphikfont'));
});

// gulp.task('imageMinify', function() {
//   return gulp
//     .src(paths.src.img.files)
//     .pipe(imagemin())
//     .pipe(gulp.dest(paths.dist.img.dir))
// });
gulp.task('webp', () =>
    gulp.src(paths.src.img.files)
        .pipe(webp())
        .pipe(gulp.dest(paths.src.img.dir))
);
gulp.task('webp2', () =>
    gulp.src(paths.src.img.files)
        .pipe(webp())
        .pipe(gulp.dest(paths.dist.img.dir))
);

gulp.task('fileinclude', function(callback) {
  return gulp
    .src([paths.src.html.files, '!' + paths.src.tmp.files, '!' + paths.src.partials.files])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      })
    )
    .pipe(cached())
    .pipe(gulp.dest(paths.src.tmp.dir));
});

gulp.task('clean:tmp', function(callback) {
  del.sync(paths.src.tmp.dir);
  callback();
});

gulp.task('clean:dist', function(callback) {
  del.sync(paths.dist.base.dir);
  callback();
});

gulp.task('copy:all', function() {
  return gulp
    .src([
      paths.src.base.files,
      '!' + paths.src.partials.dir,
      '!' + paths.src.partials.files,
      '!' + paths.src.scss.dir,
      '!' + paths.src.scss.files,
      '!' + paths.src.tmp.dir,
      '!' + paths.src.tmp.files,
      '!' + paths.src.js.dir,
      '!' + paths.src.js.files,
      '!' + paths.src.css.dir,
      '!' + paths.src.css.files,
      '!' + paths.src.html.files
    ])
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('html', function() {
  return gulp
    .src([paths.src.html.files, '!' + paths.src.tmp.files, '!' + paths.src.partials.files])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      })
    )
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleancss()))
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task(
  'build',
  gulp.series(
    gulp.parallel('clean:tmp', 'clean:dist', 'copy:all'),
    'scss',
    'html',
    'webp',
    'webp2'
  )
);

gulp.task(
  'default',
  gulp.series(gulp.parallel('fileinclude', 'scss', 'webp'), gulp.parallel('browsersync', 'watch'))
);
