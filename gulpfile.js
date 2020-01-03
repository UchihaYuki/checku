const gulp = require("gulp");
const del = require("del");
const tsb = require("gulp-tsb");
const mocha = require("gulp-mocha");

const src = tsb.create("src/tsconfig.json");
const srcRelease = tsb.create("src/tsconfig-release.json");
const test = tsb.create("test/tsconfig.json");

gulp.task("clean", () => del([
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "src/**/*.js",
    "src/**/*.js.map",
    "test/**/*.js",
    "test/**/*.js.map"]));

gulp.task("build:src-release", () => gulp
    .src(["src/**/*.ts"])
    .pipe(srcRelease())
    .pipe(gulp.dest("lib")));

gulp.task("build:src", () => gulp
    .src(["src/index.ts"])
    .pipe(src())
    .pipe(gulp.dest("src")));

gulp.task("build:test", () => gulp
    .src(["test/**/*.ts"])
    .pipe(test())
    .pipe(gulp.dest("test")));

gulp.task("run:test", () => gulp
    .src(["test/**/*.js"], { read: false })
    .pipe(mocha({ reporter: "dot" })));


gulp.task("test", gulp.series("clean", "build:src", "build:test", "run:test"));
gulp.task("prepublish", gulp.series("test", "build:src-release"));

