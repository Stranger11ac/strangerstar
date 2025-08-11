import { src, dest, watch, series } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import terser from "gulp-terser";

const sass = gulpSass(dartSass);
export function css(done) {
    src("static/scss/**/*.scss", { sourcemaps: true })
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(dest("static/css"), { sourcemaps: "." });

    done();
}

export function js(done) {
    src("static/functions/**/*.js")
        .pipe(terser())
        .on("error", function(err) {console.error("Error in compressing JS:", err.toString());})
        .pipe(dest("static/js"));

    done();
}

export function watchFiles() {
    watch("static/scss/**/*.scss", css);
    watch("static/functions/**/*.js", js);
}

// Este se ejecuta al mandar llamar `gulp` en el pakage.json
// Las funciones se ejecutan en serie consecutiva.
// Utiliza `parallel` para ejecutar en paralelo (todo a la vez).
export default series(js, css, watchFiles);
