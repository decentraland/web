var path        = require('path')
var gulp        = require('gulp')
var merge       = require('merge-stream')
var addsrc      = require('gulp-add-src')
var concat      = require('gulp-concat')
var uglify      = require('gulp-uglify')
var minifyCss   = require('gulp-minify-css')
var imagemin    = require('gulp-imagemin')
var rename      = require('gulp-rename')
var clean       = require('gulp-clean');
var nunjucks    = require('gulp-nunjucks')
var rev         = require("gulp-rev")
var revReplace  = require("gulp-rev-replace")
var revOverride = require('gulp-rev-css-url')


var paths = {
  views: [ path.join('views', '*.html') ],

  js: [ path.join('js', '*.js') ],
  vendorjs: [
    path.join('js', 'vendor', 'picoModal.min.js'),
    path.join('js', 'vendor', 'siema.min.js'),
    path.join('js', 'vendor', 'chartjs.min.js')
  ],
  copyjs: [ path.join('js', 'vendor', 'wow.min.js'), path.join('js', 'vendor', 'smooth-scroll.min.js') ],

  css: [ path.join('css', 'main.css') ],
  copycss: [ path.join('css', 'bootstrap.min.css'), path.join('css', 'animate.min.css') ],

  favicon: 'favicon.ico',
  images: path.join('images', '*'),
  videos: path.join('videos', '*'),

  fonts: path.join('fonts', 'SourceSans*')
}

gulp.task('clean', function() {
  if (isProduction()) {
    return gulp.src('dist', {read: false})
        .pipe(clean())
  }
})

gulp.task('scripts', ['clean'], function() {
  var copy = gulp.src(paths.copyjs)
    .pipe(gulp.dest('dist/js'))

  var vendor = gulp.src(paths.vendorjs)
    .pipe(concat('vendor-bundle.min.js'))
    .pipe(gulp.dest('dist/js'))

  var js = gulp.src(paths.js)

  if (isProduction()) {
    js = js.pipe(uglify())
  }

  js = js
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dist/js'))

  return merge(copy, vendor, js)
})

gulp.task('styles', ['clean'], function() {
  var copy = gulp.src(paths.copycss)
    .pipe(gulp.dest('dist/css'))

  var css = gulp.src(paths.css)
      .pipe(minifyCss({keepSpecialComments: 0}))
      .pipe(concat('main.min.css'))
    .pipe(gulp.dest('dist/css'))

  return merge(copy, css)
})

gulp.task('views', ['clean'], function() {
  return gulp.src(paths.views)
    .pipe(nunjucks.compile({}))
    .pipe(gulp.dest('dist/'))
})

gulp.task('images', ['clean'], function() {
  var favicon = gulp.src(paths.favicon)
    .pipe(gulp.dest('dist/'))

  var images = gulp.src(paths.images)

  if (isProduction() && process.env.MIN_IMAGES) {
    images = images.pipe(imagemin({optimizationLevel: 5}))
  }
  images = images.pipe(gulp.dest('dist/images'))

  return merge(favicon, images)
})

gulp.task('videos', ['clean'], function() {
  return gulp.src(paths.videos)
    .pipe(gulp.dest('dist/videos'))
})

gulp.task('fonts', ['clean'], function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('watch', function() {
  var toWatch = paths.views.concat(paths.js).concat(paths.css)
  console.log(toWatch.join('\n'))
  gulp.watch(toWatch, [ 'build' ])
})

gulp.task('build', ['clean', 'views', 'scripts', 'styles', 'images', 'fonts', 'videos'])

gulp.task('revision', ['build'], function() {
  if (isProduction()) {
    var toRev = ['png', 'jpg', 'svg', 'css', 'js'].map(function(ext) { return 'dist/**/*' + ext })

    return gulp.src(toRev)
      .pipe(rev())
      .pipe(revOverride())
      .pipe(gulp.dest('./dist'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./dist'))
  }
})

gulp.task('make', ['revision'], function() {
  if (isProduction()) {
    var manifest = gulp.src('./dist/rev-manifest.json');

    return gulp.src('./dist/*.html')
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest('./dist'));
  }
})

gulp.task('default', ['watch', 'build'])



// ---------------------------------------------------------
// Utils

function isProduction() {
  return process.env.NODE_ENV === 'production'
}
