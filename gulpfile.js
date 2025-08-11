import { src, dest, watch, series } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import terser from "gulp-terser";
import rename from "gulp-rename";
import cleanCSS from "gulp-clean-css";

const sass = gulpSass(dartSass);
export function scss(done) {
    src("src/scss/app.scss", { sourcemaps: true })
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(dest("static/css", { sourcemaps: "." }));

    done();
}

export function css(done) {
    src("src/css/**/*.css", { sourcemaps: true })
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("static/css", { sourcemaps: "." }));

    done();
}

export function js(done) {
    src("src/js/**/*.js")
        .pipe(terser())
        .on("error", function(err) {console.error("Error in compressing JS:", err.toString());})
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("static/js", { sourcemaps: "." }));

    done();
}

export function watchFiles() {
    watch("src/scss/**/*.scss", scss);
    watch("src/css/**/*.css", css);
    watch("src/js/**/*.js", js);
}

// Este se ejecuta al mandar llamar `gulp` en el pakage.json
// Las funciones se ejecutan en serie consecutiva.
// Utiliza `parallel` para ejecutar en paralelo (todo a la vez).
export default series(js, css, watchFiles);
