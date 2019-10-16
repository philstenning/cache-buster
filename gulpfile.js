const { src, dest, series } = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
// const buildVersion = require('./buildVersion');
const urlAdjuster = require('gulp-css-url-adjuster');
const resVersion = require('gulp-res-version');

const md5 = require('md5');

/*
buildVersion is used for versioning the querystring.
*/
const buildVersion = {
    semVersion: 'v=1.0.1',
    number: 'b=12563789',
    hash: `${md5(Date.now)}`,
};

function appendCssWithQueryString() {
    const version = buildVersion.semVersion;
    return src('./src/**/*.css')
        .pipe(
            urlAdjuster({
                append: `?${version}`,
            })
        )
        .pipe(dest('./dist/'));
}

const cleanDest = () => {
    return src(['./dist/**/*.*']).pipe(clean());
};

function copyImages() {
    return src(['./src/**/*.jpg']).pipe(dest('./dist/'));
}

function append_QueryString() {
    return src(['./src/**/*.html'])
        .pipe(
            resVersion({
                rootdir: './dist/',
                ignore: [/#data$/i],
                qskey: buildVersion.semVersion,
            })
        )
        .pipe(dest('./dist/'));
}

exports.default = series(
    cleanDest,
    append_QueryString,
    appendCssWithQueryString,
    copyImages
);
exports.queryStringHtml = series(append_QueryString);
exports.queryStringCss = series(appendCssWithQueryString);
exports.clean = series(cleanDest);

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
