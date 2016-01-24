// //////////////////////////////////////////
// Required
// //////////////////////////////////////////
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    nodemon = require('gulp-nodemon');

// //////////////////////////////////////////
// Developement: gulp dev 
// //////////////////////////////////////////
gulp.task('dev:watch', function(){
    gulp.watch('public/js/*.js').on('change', reload);
    gulp.watch('public/css/*.css').on('change', browserSync.stream);
    gulp.watch(['public/*.html','public/views/*.html']).on('change', reload);
});

gulp.task('dev:nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['public/**/*.js','public/**/*.html','public/**/*.css'],
        env: { 'NODE_ENV': 'develop,ment' }
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task('dev:browser-sync', ['dev:nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:8090",
        files: ["public/**/*.*"],
        port: 7000
    })
});

gulp.task('dev', ['dev:browser-sync','dev:watch']);


