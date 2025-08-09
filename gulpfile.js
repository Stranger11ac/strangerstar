import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {src,dest, watch} from 'gulp';

const sass = gulpSass(dartSass);
export function css(done) {
    src('static/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('static/css'));

    done();
}

export function watchFiles() {
    watch('static/scss/**/*.scss', css);
}