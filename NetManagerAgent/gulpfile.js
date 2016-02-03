/**
 * Created by brendonallen on 3/02/16.
 */
"use strict";
const gulp = require("gulp");
const babel = require("gulp-babel");
const del = require("del");

gulp.task("copy:static", ["clean:static"], () => {
    return gulp.src("src/static/**/*")
        .pipe(gulp.dest("build/static/"));
});

gulp.task("compile:all", ["copy:static"], function () {
    return gulp.src(["src/**/*.js"])
    .pipe(babel({}))
    .pipe(gulp.dest("build"));
});

gulp.task("clean:static", () => {
    return del(["build/static/**/*"]);
});

gulp.task("clean:all", () => {
    return del(["build/**/*"]);
});