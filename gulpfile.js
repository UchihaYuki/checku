const gulp = require("gulp");
const del = require("del");
const mocha = require("gulp-mocha");
const sourcemaps = require('gulp-sourcemaps')
const ts = require('gulp-typescript');

const src = ts.createProject("src/tsconfig.json");
const srcRelease = ts.createProject("src/tsconfig-release.json");
const test = ts.createProject("test/tsconfig.json");

gulp.task("clean", () => del([
    "lib",
    "src/**/*.js",
    "src/**/*.js.map",
    "test/**/*.js",
    "test/**/*.js.map"]));

gulp.task("build:src", () => gulp
    .src([
        "src/**/*.ts",
    ])
    .pipe(sourcemaps.init())
    .pipe(src())
    .pipe(sourcemaps.write(".", { sourceRoot: '.', includeContent: false }))
    .pipe(gulp.dest("src")));

gulp.task("build:test", () => gulp
    .src(["test/**/*.ts"])
    .pipe(sourcemaps.init())
    .pipe(test())
    .pipe(sourcemaps.write(".", { sourceRoot: '.', includeContent: false }))
    .pipe(gulp.dest("test")));

gulp.task("run:test", () => gulp
    .src(["test/**/*.js"], { read: false })
    .pipe(mocha({ reporter: "dot" })));

gulp.task("build:src-release", () => gulp
    .src([
        "src/**/*.ts"
    ])
    .pipe(srcRelease())
    .pipe(gulp.dest("lib")));

gulp.task("test", gulp.series("clean", "build:src", "build:test", "run:test"));
gulp.task("prepublish", gulp.series("test", "build:src-release"));

