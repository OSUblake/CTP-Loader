"use strict";
var gulp = require("gulp");
var browserSync = require("browser-sync");
//var browserSync = require("browser-sync");
var reload = browserSync.reload;
gulp.task("serve", function () {
    browserSync.init({
        port: 3000,
        browser: ["google chrome"],
        notify: true,
        logConnections: true,
        logFileChanges: true,
        injectChanges: false,
        files: ["src/**/*.{ts,css,html}", "!src/lib/**"],
        logPrefix: "CTP",
        server: {
            baseDir: ["src"],
            directory: true,
            index: "index.html",
            routes: {
                "/patches": "patches"
            }
        },
        startPath: "index.html",
        reloadOnRestart: true,
        tunnel: "gnomesayin"
    });
});
gulp.task("default", ["serve"]);
//# sourceMappingURL=gulpfile.js.map