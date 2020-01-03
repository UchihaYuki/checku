const gulp = require("gulp");
const del = require("del");
const tsb = require("gulp-tsb");
const mocha = require("gulp-mocha");

const debugProject = tsb.create("src/tsconfig.json");
const releaseProject = tsb.create("src/tsconfig-release.json");
const tests = tsb.create("test/tsconfig.json");

gulp.task("clean", () => del(["lib/index.js", "lib/index.js.map", "lib/index.d.ts", "src/index.js", "src/index.js.map", "test/**/*.js", "test/**/*.js.map"]));

gulp.task("build:checku-release", () => gulp
    .src(["src/index.ts"])
    .pipe(releaseProject())
    .pipe(gulp.dest("lib")));

    gulp.task("build:checku", () => gulp
    .src(["src/index.ts"])
    .pipe(debugProject())
    .pipe(gulp.dest("src")));

gulp.task("build:tests", () => gulp
    .src(["test/**/*.ts"])
    .pipe(tests())
    .pipe(gulp.dest("test")));

gulp.task("run:test", () => 
    gulp
        .src(["test/**/*.js"], { read: false })
        .pipe(mocha({ reporter: "dot" })));


gulp.task("test", gulp.series("clean", "build:checku", "build:tests", "run:test"));
gulp.task("prepublish", gulp.series("clean", "build:checku", "build:tests", "run:test", "build:checku-release"));

