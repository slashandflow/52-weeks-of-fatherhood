var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require("fs"),
    gulpIgnore = require('gulp-ignore'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    s3 = require("gulp-s3"),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    order = require('gulp-order'),
    uglify = require('gulp-uglify'),
    encrypt = require("gulp-simplecrypt").encrypt,
    decrypt = require("gulp-simplecrypt").decrypt,
    argv = require('yargs').argv,
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence'),
    slim = require("gulp-slim");

//**********************************************************************
// PROJECT DIRECTORIES
//**********************************************************************
var project_base_directory = '.';
var paths = {
  scripts_in: [project_base_directory+'/app/assets/javascripts/**/*.coffee'],
  scripts_out: project_base_directory+'/server/javascripts',
  sass_watch: [project_base_directory+'/app/assets/stylesheets/**/**/**'],
  sass_in: [project_base_directory+'/app/assets/stylesheets/*.scss'],
  sass_out: project_base_directory+'/server/stylesheets',
  slim_in: project_base_directory+'/app/views/*.slim',
  public_assets: [project_base_directory+'/server/**'],
  font_assets: [project_base_directory+'/server/fonts/**']
};


//**********************************************************************
// SLIM -> HTML
//**********************************************************************
gulp.task('slim', function(){
  gulp.src("./app/views/*.slim")
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest("./server/"));
});


//**********************************************************************
// COFFEE -> JAVASCRIPT
//**********************************************************************
gulp.task('scripts', function(callback){
  runSequence('scripts-development', 'delete-production', 'scripts-production', callback);
});

gulp.task('scripts-development', function(){
  return gulp.src(paths.scripts_in)
    .pipe(plumber())
    .pipe(coffee({
      bare: true
    }))
    .pipe(gulp.dest(paths.scripts_out));
});
gulp.task('scripts-production', function(){

  return gulp.src(project_base_directory+'/server/javascripts/**/*.js')
    .pipe(order([
      'vendor/*.js',
      'widgets/*.js',
      'BreakpointDetection.js',
      '*.js'
    ]))
    .pipe(gulpIgnore.exclude('production/production.js'))
    .pipe(concat("production.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts_out+"/production/"));
});

//**********************************************************************
// SASS -> CSS
//**********************************************************************
gulp.task('sass', function(callback){
  runSequence('sass-development', 'sass-production', callback);
});

gulp.task('sass-development', function () {
  return gulp.src(paths.sass_in)
      .pipe(sass({sourcemap: false}))
      .pipe(prefix())
      .pipe(gulp.dest(paths.sass_out))
});
gulp.task('sass-production', function () {
  return gulp.src(paths.sass_out+"/*.css")
      .pipe(minifyCSS())
      .pipe(gulp.dest(paths.sass_out+"/production/"))
});

//**********************************************************************
// AWS KEY ENCRYPTION AND DECRYPTION
//**********************************************************************
gulp.task('encrypt-keys', function() {
  encryption_details = JSON.parse(fs.readFileSync('encryption-details.json'));
  gulp.src('config/*.aws.json')
    .pipe(encrypt({
      password: encryption_details.password,
      salt: encryption_details.salt
    }))
    .pipe(gulp.dest('config/encrypted/'))
});
gulp.task('decrypt-keys', function() {
  encryption_details = JSON.parse(fs.readFileSync('encryption-details.json'));
  gulp.src('config/encrypted/*.aws.json')
    .pipe(decrypt({
      password: encryption_details.password,
      salt: encryption_details.salt
    }))
    .pipe(gulp.dest('config/'))
});

//**********************************************************************
// FONT ICON UPLOAD
// Upload font icons to S3.  You need to specify IAM keys.
//**********************************************************************
gulp.task('upload-fonts-to-s3', function() {

  if(! argv.key_file) {
    console.log('\n\nPlease enter the filename of the key you would like to use.\n\n');
    return;
  }

  aws = JSON.parse(fs.readFileSync('./keys/'+argv.key_file));

  options = {
    delay: 1000, // The delay needs to be kept, otherwise the transfer fails
    uploadPath: '/fonts/'
  }

  gulp.src(paths.font_assets, {read: false})
      .pipe(s3(aws, options));

});

//**********************************************************************
// S3 - MOVE ALL PUBLIC ASSETS TO S3
// You need to specify IAM keys.
//**********************************************************************
gulp.task('assets-to-s3', function() {

  if(! argv.key_file) {
    console.log('\n\nPlease enter the filename of the key you would like to use.\n\n');
    return;
  }

  aws = JSON.parse(fs.readFileSync('./keys/'+argv.key_file));

  options = { delay: 250 } // The delay needs to be kept, otherwise the transfer fails.

  gulp.src(paths.public_assets, {read: false})
    .pipe(gulpIgnore.exclude('*.gz')) // We want to upload gzip files with a specific header
    .pipe(s3(aws, options));

});

//**********************************************************************
// PRODUCTION - HOUSEKEEPING
// When updating production assets, we must delete the production Javascript.
//**********************************************************************
gulp.task('delete-production', function(){
  return gulp.src(project_base_directory+'/server/javascripts/production/production.js', { read: false }) // much faster
    .pipe(rimraf({ force: true }));
});

//**********************************************************************
// WATCHERS -- RUNS SCRIPT AND SASS TASKS
//**********************************************************************
gulp.task('watch', function () {
  gulp.watch(paths.scripts_in, ['scripts']);
  gulp.watch(paths.sass_watch, ['sass']);
  gulp.watch(paths.slim_in, ['slim']);
});


gulp.task('default', ['watch']);
gulp.task('production', function(callback){
  runSequence('delete-production', 'sass-production', 'scripts-production', callback);
});
