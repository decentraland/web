var fs          = require('fs')
var path        = require('path')
var merge       = require('merge2');
var del         = require('del');
var gulp        = require('gulp')
var rename      = require('gulp-rename')
var addsrc      = require('gulp-add-src')
var concat      = require('gulp-concat')
var uglify      = require('gulp-uglify')
var minifyCss   = require('gulp-minify-css')
var imagemin    = require('gulp-imagemin')
var rename      = require('gulp-rename')
var nunjucks    = require('gulp-nunjucks')
var rev         = require("gulp-rev")
var revReplace  = require("gulp-rev-replace")
var revOverride = require('gulp-rev-css-url')

var DEFAULT_LANG = process.env.DEFAULT_LANG || 'en'
var DIST_FOLDER = process.env.DIST_FOLDER || 'dist'
var DIST_PATH = './' + DIST_FOLDER


var paths = {
  views: [ path.join('views', '*.html') ],

  js: [ path.join('js', 'main.js') ],
  vendorjs: [
    path.join('js', 'vendor', 'picoModal.min.js'),
    path.join('js', 'vendor', 'chartjs.min.js')
  ],
  copyjs: [ path.join('js', 'vendor', 'wow.min.js'), path.join('js', 'vendor', 'smooth-scroll.min.js') ],

  css: [ path.join('css', 'main.css') ],
  copycss: [ path.join('css', 'bootstrap.min.css'), path.join('css', 'animate.min.css') ],

  favicon: 'favicon.ico',
  pdfs: 'whitepaper.pdf',
  images: path.join('images', '*'),
  videos: path.join('videos', '*'),

  fonts: path.join('fonts', 'SourceSans*')
}

gulp.task('clean', function() {
  return del(DIST_FOLDER)
})

gulp.task('scripts', function() {
  var dist = toDist('js')

  del.sync(dist)

  var copy = gulp.src(paths.copyjs)
    .pipe(gulp.dest(dist))

  var vendor = gulp.src(paths.vendorjs)
    .pipe(concat('vendor-bundle.min.js'))
    .pipe(gulp.dest(dist))

  var js = gulp.src(paths.js)

  if (isProduction()) {
    js = js.pipe(uglify())
  }

  js = js
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(dist))

  return merge(copy, vendor, js)
})

gulp.task('styles', function() {
  var dist = toDist('css')

  del.sync(dist)

  var copy = gulp.src(paths.copycss)
    .pipe(gulp.dest(dist))

  var css = gulp.src(paths.css)
      .pipe(minifyCss({keepSpecialComments: 0}))
      .pipe(concat('main.min.css'))
    .pipe(gulp.dest(dist))

  return merge(copy, css)
})

gulp.task('views', function() {
  var langs = getAvailableLanguages()

  var streams = langs.map(function(lang) {
    var translations = getCurrentTranslations(lang)

    return gulp.src(paths.views)
      .pipe(nunjucks.compile(translations))
      .pipe(rename(getFilenameRenamerForLang(lang)))
      .pipe(gulp.dest(toDist()))
  })

  return merge.apply(null, streams)
})

gulp.task('favicon', function() {
  return gulp.src(paths.favicon)
    .pipe(gulp.dest(toDist()))
})

gulp.task('images', function() {
  var dist = toDist('images')

  del.sync(dist)

  var images = gulp.src(paths.images)

  if (isProduction() && process.env.MIN_IMAGES) {
    images = images.pipe(imagemin({optimizationLevel: 5}))
  }
  images = images.pipe(gulp.dest(dist))

  return images
})

gulp.task('videos', function() {
  return gulp.src(paths.videos)
    .pipe(gulp.dest(toDist('videos')))
})

gulp.task('pdfs', function() {
  return gulp.src(paths.pdfs)
    .pipe(gulp.dest(toDist()))
})

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(toDist('fonts')))
})

gulp.task('watch', function() {
  var toWatch = paths.views.concat(paths.js).concat(paths.css)
  gulp.watch(toWatch, [ 'build' ])
})

gulp.task('revision', ['views', 'scripts', 'styles', 'favicon', 'images', 'fonts', 'videos', 'pdfs'], function() {
  var toRev = ['.png', '.jpg', '.svg', '.min.css', '.min.js'].map(function(ext) { return toDist([ '**', '*' + ext]) })

  return gulp.src(toRev)
    .pipe(rev())
    .pipe(revOverride())
    .pipe(gulp.dest(toDist()))
    .pipe(rev.manifest())
    .pipe(gulp.dest(toDist()))
})

gulp.task('build', ['revision'], function() {
  var manifest = gulp.src(toDist('rev-manifest.json'))

  return gulp.src(toDist('*.html'))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(toDist()))
})

gulp.task('default', ['watch', 'build'])



// ---------------------------------------------------------
// Utils

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function toDist(paths) {
  if (! paths) return path.join(DIST_FOLDER, '/')

  paths = typeof paths === 'string' ? [ paths ] : paths

  return path.join.apply(null, [ DIST_FOLDER ].concat(paths))
}

function getAvailableLanguages() {
  var jsonRegexp = /\.json$/
  var langs = fs.readdirSync('./translations')

  return langs.filter(function(langFilename) {
    return langFilename.search(jsonRegexp) !== -1
  }).map(function(langFilename) {
    return langFilename.replace(jsonRegexp, '')
  })
}

function getCurrentTranslations(lang) {
  try {
    var translations = fs.readFileSync('./translations/' + lang + '.json')
    return JSON.parse(translations)

  } catch(error) {
    console.log('Found an error trying to get the translations for the lang: ' + lang)
    throw error
  }
}

function getFilenameRenamerForLang(lang) {
  return function(path) {
    if (lang !== DEFAULT_LANG) path.extname = '.' + lang + '.html'
  }
}
