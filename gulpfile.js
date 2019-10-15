const { src, dest, series, watch, task } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const clean = require('gulp-clean');
const md5 = require('md5');
const rename = require('gulp-rename');
const addsrc = require('gulp-add-src');

var cachebust = require('gulp-cache-bust');

var RevAll = require('gulp-rev-all');
const resversion = require('gulp-res-version');

const cleanDest = () => {
    return src([
        './dist/*.css',
        './dist/**/*.html',
        './dist/**/*.json',
        './dist/**/*.jpg',
    ]).pipe(clean());
};

// Step 1
function revision() {
    return src('./src/*.css')
        .pipe(rev())

        .pipe(dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(dest('./dist/'));
}

function images() {
    const hash = md5(Date.now);
    return src('./src/**/*.jpg')
        .pipe(rev())
        .pipe(dest('./dist/'))
        .pipe(
            rename(function(path) {
                path.extname += `?${hash}`;
            })
        )
        .pipe(rev.manifest())

        .pipe(dest('./dist/images/'));
}

// Step 2
function rewrite() {
    const manifest = src('dist/rev-manifest.json');
    const ImageManifest = src('dist/images/rev-manifest.json');

    return src('./src/**/*.html')
        .pipe(revRewrite({ manifest }))
        .pipe(revRewrite({ ImageManifest }))

        .pipe(dest('./dist/'));
}

function all() {
    return (
        src('./src/**/*.jpg')
            .pipe(RevAll.revision())
            .pipe(dest('./dist/'))
            .pipe(addsrc(['./src/**/*.html', './src/**/*.css']))
            // .pipe(dest('./dist/'))
            .pipe(RevAll.revision({ dontRenameFile: 'html' }))
            .pipe(dest('./dist/'))
            .pipe(RevAll.manifestFile())
            .pipe(dest('./dist/'))
    );
}

function changeFilename() {
    return src(['./src/**/*.html', './src/**/*.css', './src/**/*.jpg'])
        .pipe(
            cachebust({
                type: 'timestamp',
            })
        )
        .pipe(dest('./dist/'));
}
function copyImages() {
    return src(['./src/**/*.jpg']).pipe(dest('./dist/'));
}

function appendQueryString() {
    return src(['./src/**/*.html', './src/**/*.css', './src/**/*.jpg'])
        .pipe(
            resversion({
                rootdir: './dist/',
                ignore: [/#data$/i],
                qskey: '3.1.2',
            })
        )
        .pipe(dest('./dist/'));
}

task('watch', () => {
    watch('./src/**/*.*', series(cleanDest, revision, images, rewrite));
    // watch('./src/**/*.*', series(images));
});

task('appendQueryString1', () => series(clean, appendQueryString));

exports.default = series(cleanDest, revision, images, rewrite);
// exports.default = series(cleanDest, appendQueryString);
// exports.default = series(cleanDest, changeFilename);
exports.queryString = series(cleanDest, appendQueryString, copyImages);
exports.fileName = series(cleanDest, revision, images, rewrite);
exports.clean = series(cleanDest);
