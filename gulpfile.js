'use strict';

var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    cssmin = require('gulp-minify-css'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    minify = require('gulp-minify'),
    include = require('gulp-include'),
    autoprefixer = require('gulp-autoprefixer');


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/common.js',
        style: 'src/css/style.scss',
        mobileStyle: 'src/css/mobile.scss',
        img: 'src/images/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/images/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Ivan"
};

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return   gulp.src(path.src.js)
        .pipe(include())
        .on('error', console.log)
        .pipe(minify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('mobileStyle:build', function () {
    return gulp.src(path.src.mobileStyle)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('cleanCSSBuild', () => {
    return gulp.src(path.build.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('pug', function () {
    return  gulp.src(['./**/*.pug', '!./node_modules/**'])
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('./'))
});

gulp.task('image:build', function () {
    return  gulp.src(path.src.img)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});


gulp.task('build',
    gulp.series('html:build',
        'pug',
        'style:build',
        'mobileStyle:build',
        'cleanCSSBuild',
        'js:build',
        'image:build'));

gulp.task('watch', function(){
    gulp.watch('src/**/*.html').on('change', browserSync.reload);
    browserSync.init({
        files: gulp.parallel('src/index.html'),
        server:{
            baseDir:'./build',
            directory: true
        }
    });

    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    }, browserSync.reload);
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    }, browserSync.reload);
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:build');
    }, browserSync.reload);
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', gulp.series('build', 'pug', 'html:build', 'style:build', 'mobileStyle:build', 'webserver', 'watch', 'js:build', 'image:build'));