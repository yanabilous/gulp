"use strict";
//
// const gulp = require("gulp");
// const sass = require("gulp-sass")(require("sass"));
// // const clean = require("gulp-clean");
// const cleanCSS = require("gulp-clean-css");
// const minifyJS = require("gulp-js-minify");
// // const autoprefixer = require('gulp-autoprefixer');
// const concat = require("gulp-concat");
//
// const uglify = require("gulp-uglify");
// const pipeline = require("readable-stream").pipeline;
//
// // exports.default = () => (
// // 	gulp.src('src/app.css')
// // 		.pipe(autoprefixer({
// // 			cascade: false
// // 		}))
// // 		.pipe(gulp.dest('dist'))
// // );
//
// const clean = require("gulp-clean");
// const imagemin = require("gulp-imagemin");
// const autoprefixer = require("autoprefixer");
// const imgMin = () => (
//     gulp.src("./src/img/*")
//         .pipe(imagemin())
//         .pipe(gulp.dest("./dist/img"))
// );
//
//
// const cleanDist = () => {
//     return gulp.src("./dist", {read: false})
//         .pipe(clean());
// };
//
// // gulp.task("compress", function () {
// //     return pipeline(
// //         gulp.src("src/*.js"),
// //         uglify(),
// //         gulp.dest("dist")
// //     );
// // });
//
// gulp.task("scripts", function () {
//     return gulp.src("./src/js/*.js")
//         .pipe(concat("all.js"))
//         .pipe(gulp.dest("./dist/"));
// });
//
//
// gulp.task("minify-js", function () {
//     gulp.src("./dist/a.js")
//         .pipe(minifyJS())
//         .pipe(gulp.dest("./dist/"));
// });
// gulp.task("cleanCSS", () => {
//     return gulp.src("styles/*.css")
//         .pipe(cleanCSS())
//         .pipe(gulp.dest("./dist/css"));
// });
//
// gulp.task("sass", function () {
//     return gulp.src("./src/sass/**/*.scss")
//         .pipe(sass().on("error", sass.logError))
//         .pipe(autoprefixer({
//             cascade: false
//         }))
//         .pipeline(uglify())
//         .pipe(gulp.dest("./dist/css"));
//
// });
// gulp.task("watch", function (done) {
//     gulp.watch("./src/sass/**/*.scss", gulp.series("sass"));
// });
// gulp.task("clone", function () {
//     return gulp.src("./src/view/**/*.html")
//         .pipe(gulp.dest("./dist/"));
// });
//
//
// gulp.task("build", gulp.series(
//     cleanDist,
//     imgMin,
// ));

const gulp = require("gulp"),
    clean = require("gulp-clean"),
    sass = require("gulp-sass")(require("sass")),
    browserSync = require("browser-sync").create(),
    concat = require("gulp-concat"),
    imagemin = require("gulp-imagemin"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    jsMinify = require("gulp-js-minify");

const paths = {
    src: {
        img: "./src/img/*.png",
        fix: "./dist/css/styles.min.css",
        styles: "./src/sass/**/*.scss",
        js: "./src/js/*.js",
        minCss: "./dist/css/*.css"
    },
    dist: {
        self: "./dist",
        styles: "./dist/css/",
        jsBuild: "./dist/js/",
        minImg: "./dist/img/"
    }
};
const cleanDist = () => (
    gulp.src(paths.dist.self, {allowEmpty: true})
        .pipe(clean())
);
const scssBuild = () => (
    gulp.src(paths.src.styles)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(paths.dist.styles))
)
;
const buildJs = () => (
    gulp.src(paths.src.js)
        .pipe(concat("scripts.min.js"))
        .pipe(gulp.dest(paths.dist.jsBuild))
        .pipe(browserSync.stream())
);
const autofix = () => (
    gulp.src("src/sass/style.scss")
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest("dist"))
);
const minImg = () => (
    gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.minImg))
);
const minifyCss = function () {
    return gulp.src(paths.src.minCss)
        .pipe(cleanCSS({compatibility: "ie8"}))
        .pipe(gulp.dest(paths.dist.styles)
        );
};
const minifyJs = () => (
    gulp.src(paths.src.js)
        .pipe(jsMinify())
        .pipe(gulp.dest(paths.dist.jsBuild))
);
const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false,
        online:true
    });
    gulp.watch(paths.src.styles, scssBuild).on("change", browserSync.reload);
    gulp.watch(paths.src.js, buildJs).on("change", browserSync.reload);
};
gulp.task("build", gulp.series(
    cleanDist,
    scssBuild,
    buildJs,
    autofix,
    minifyCss,
    minifyJs,
    minImg,
));
gulp.task("dev", watcher);
