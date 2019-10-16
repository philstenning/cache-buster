const { src, dest, series, watch, task } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const clean = require('gulp-clean');
const md5 = require('md5');
const rename = require('gulp-rename');
const addsrc = require('gulp-add-src');
const modifyCssUrls = require('gulp-modify-css-urls');
const replace = require('gulp-replace');
const buildVersion = require('./buildVersion');
const bust = require('gulp-buster');

const urlAdjuster = require('gulp-css-url-adjuster');

const appendQueryString = require('gulp-append-query-string');
var cachebust = require('gulp-cache-bust');

var RevAll = require('gulp-rev-all');
const resversion = require('gulp-res-version');

function appendCssWithQueryString() {
    const version = buildVersion.semVersion;
    return src('./src/**/*.css')
        .pipe(
            urlAdjuster({
                append: version,
            })
        )
        .pipe(dest('./dist/'));
}

const cleanDest = () => {
    return src(['./dist/**/*.*']).pipe(clean());
};

// left in as a fallback works but not ideal

// function cssReplace() {
//     const version = build.semVersion;
//     return src('./src/**/*.css')
//         .pipe(replace('.jpg', `.jpg?${version}`))
//         .pipe(replace('.JPG', `.jpg?${version}`))
//         .pipe(replace('.jpeg', `.jpg?${version}`))
//         .pipe(replace('.JPEG', `.jpg?${version}`))
//         .pipe(replace('.png', `.png?${version}`))
//         .pipe(replace('.PNG', `.png?${version}`))
//         .pipe(replace('.gif', `.gif?${version}`))
//         .pipe(replace('.GIF', `.gif?${version}`))
//         .pipe(dest('./dist/'));
// }

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

function append_QueryString() {
    return src(['./src/**/*.html', './src/**/*.jpg'])
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

task('modifyUrls', () => {
    const semVersion = 'v3.1.4';
    return src('./src/**/*.css').pipe(
        modifyCssUrls({
            modify: function(url, filePath) {
                return 'app/' + url;
            },
            prepend: 'https://fancycdn.com/',
            append: '?cache-buster',
            // modify: (url, filePath) => url,
            // append: `?${semVersion}`,
        }).pipe(dest('./dist/'))
    );
});
function modify_Urls() {
    const semVersion = 'v3.1.4';
    return src('./src/**/*.css').pipe(
        modifyCssUrls({
            modify: function(url, filePath) {
                return 'app/' + url;
            },
            prepend: 'https://fancycdn.com/',
            append: '?cache-buster',
            // modify: (url, filePath) => url,
            // append: `?${semVersion}`,
        }).pipe(dest('./dist/'))
    );
}

// exports.default = series(cleanDest, revision, images, rewrite);
// exports.default = series(cleanDest, buster);
exports.default = series(cleanDest, appendCssWithQueryString);

exports.queryString = series(cleanDest, append_QueryString, copyImages);
exports.fileName = series(cleanDest, revision, images, rewrite);
exports.clean = series(cleanDest);
// exports.urls = series(cleanDest, modifyUrls);
