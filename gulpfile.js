const { src, dest, series, watch, task } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const clean = require('gulp-clean');

const cleanDest = () => {
    return src(['./dist/*.css', './dist/*.html']).pipe(clean());
};

// Step 1
function revision() {
    return src('./src/*.css')
        .pipe(rev())
        .pipe(dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(dest('./dist/'));
}

// Step 2
function rewrite() {
    const manifest = src('dist/rev-manifest.json');

    return src('./src/*.html')
        .pipe(revRewrite({ manifest }))
        .pipe(dest('./dist/'));
}

task('watch', () => {
    watch('./src/**/*.*', series(cleanDest, revision, rewrite));
});

exports.default = series(cleanDest, revision, rewrite);
