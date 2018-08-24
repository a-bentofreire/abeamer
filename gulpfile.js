"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 95a216ec-8c6f-4254-9a44-fe8795b3ee4f
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var sysFs = require("fs");
var sysPath = require("path");
var sysProcess = require("process");
var gulp = require("gulp");
var rimraf = require("rimraf");
var globule = require("globule");
var fsix_js_1 = require("./shared/vendor/fsix.js");
var dev_paths_js_1 = require("./shared/dev-paths.js");
var dev_web_links_js_1 = require("./shared/dev-web-links.js");
var build_d_ts_abeamer_js_1 = require("./shared/dev-builders/build-d-ts-abeamer.js");
var build_docs_js_1 = require("./shared/dev-builders/build-docs.js");
var build_shared_js_1 = require("./shared/dev-builders/build-shared.js");
var build_single_lib_file_js_1 = require("./shared/dev-builders/build-single-lib-file.js");
var build_gallery_release_js_1 = require("./shared/dev-builders/build-gallery-release.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * This gulp file builds the release files, definition files, cleans and
 * updates data.
 *
 * To see all the usages run `gulp`
 *
 * @HINT: It's advisable to execute these gulp tasks via `npm run task`
 *
 */
var Gulp;
(function (Gulp) {
    sysProcess.chdir(__dirname);
    /** List of files and folders to typical preserve on `rm -rf` */
    // const PRESERVE_FILES = ['README.md', 'README-dev.md', '.git', '.gitignore'];
    var CLIENT_UUID = '// uuid: 3b50413d-12c3-4a6c-9877-e6ead77f58c5\n\n';
    var COPYRIGHTS = '' +
        '// ------------------------------------------------------------------------\n' +
        '// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.\n' +
        '// Licensed under the MIT License+uuid License. See License.txt for details\n' +
        '// ------------------------------------------------------------------------\n\n';
    // const htmlmin = require('gulp-htmlmin');
    var gulpMinify = require('gulp-minify');
    var gulpReplace = require('gulp-replace');
    // const preprocess = require('gulp-preprocess');
    var gulpPreserveTime = require('gulp-preservetime');
    // const autoprefixer = require('gulp-autoprefixer');
    var gulpRename = require('gulp-rename');
    var gulpZip = require('gulp-zip');
    var gulpSequence = require('gulp-sequence');
    var mergeStream = require('merge-stream');
    // @TODO: Discover why if I remove `abeamer-logo`, it doesn't creates `hello-world` correctly.
    var RELEASE_DEMOS = ['hello-world' /* , 'abeamer-logo' */];
    // this line is not solving the problem above.
    var releaseDemosRegEx = RELEASE_DEMOS.length > 1 ?
        "{" + RELEASE_DEMOS.join(',') + "}" : RELEASE_DEMOS[0];
    var modulesList = fsix_js_1.fsix.loadJsonSync(dev_paths_js_1.DevPaths.MODULES_LIST_FILE);
    var libModules = modulesList.libModules;
    var pluginModules = modulesList.pluginModules;
    // ------------------------------------------------------------------------
    //                               Print Usage
    // ------------------------------------------------------------------------
    gulp.task('default', function () {
        console.log("gulp [task]\n  Where task is\n    bump-version - builds version files from package.json\n      when: before publishing a new version\n\n    clean - executes clean-gallery\n\n    build-release - builds the release files where all the files are compiled and minify\n      when: before publishing a new **stable** version and after testing\n\n    build-shared-lib - builds files from the client library to be used by server, tests and cli\n      when: every time a module tagged with @module shared or\n            constants that are useful for server and cli are modified\n\n    build-docs - builds both the end-user and developer documentation\n      when: before publishing a new **stable** version and after testing\n\n    post-build-docs - changes links for offline testing and adds other improvements\n\n    build-definition-files - builds definition files for end-user and developer\n      when: after any public or shared member of a class is modified\n\n    build-gallery-gifs - builds all the animated gifs for each example in the gallery\n      when: before build-gallery-release\n      warn: this can be a long operation\n\n    build-gallery-release - builds release version of the gallery\n      --local builds using local links\n      when: before publishing a new gallery, after build-gallery-gifs\n\n    clean-gallery - deletes all the gallery story-frames files and folder\n      when: cleaning day!\n\n    clean-gallery-png - deletes all the gallery/story-frames/*.png\n\n    update-gallery-scripts - builds a new version of " + dev_paths_js_1.DevPaths.GALLERY_PATH + "/*/index.html with script list updated\n      when: every time there is a new module on the library or a module change its name\n            first must update on the " + dev_paths_js_1.DevPaths.CLIENT_PATH + "/lib/js/modules.json\n\n    update-test-list - updates test-list.json and package.json with the full list of tests\n      when: every time there is a new test or a test change its name\n\n    list-docs-files-as-links - outputs the console the list of document files in markdown link format\n\n    README-to-online - converts all online README.md local links to online links\n\n    README-to-local - converts all online README.md online links to local links\n\n    ");
    });
    // ------------------------------------------------------------------------
    //                               rimrafExcept
    // ------------------------------------------------------------------------
    /**
     * Recursive deletes files and folders except the ones defined in the except list
     * Only the direct children files and folders from the root are allowed
     * to be in except list
     * @param root Root folder
     * @param except list of file
     */
    function rimrafExcept(root, except) {
        if (!sysFs.existsSync(root)) {
            return;
        }
        sysFs.readdirSync(root).forEach(function (fileBase) {
            if (except.indexOf(fileBase) === -1) {
                var fileName = root + "/" + fileBase;
                rimraf.sync("" + fileName);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               updateHtmlPages
    // ------------------------------------------------------------------------
    /**
     * Updates the html links.
     * For release and release-gallery it removes the individual links,
     * and replaces with the compiled version.
     * In other cases, just updates links.
     */
    function updateHtmlPages(srcPath, destPath, newScriptFiles, setReleaseLinks, srcOptions) {
        return gulp.src(srcPath, srcOptions)
            .pipe(gulpReplace(/<body>((?:.|\n)+)<\/body>/, function (all, p) {
            var lines = p.split('\n');
            var outLines = [];
            var state = 0;
            lines.forEach(function (line) {
                if (state < 2) {
                    if (line.match(/lib\/js\/[\w\-]+.js"/)) {
                        state = 1;
                        return;
                    }
                    else if (state === 1 && line.trim()) {
                        newScriptFiles.forEach(function (srcFile) {
                            outLines.push("   <script src=\"" + srcFile + ".js\"></script>");
                        });
                        state = 2;
                    }
                }
                outLines.push(line);
            });
            return '<body>' + outLines.join('\n') + '</body>';
        }))
            .pipe(gulpReplace(/^(?:.|\n)+$/, function (all) {
            return setReleaseLinks ? all.replace(/\.\.\/\.\.\/client\/lib/g, 'abeamer') : all;
        }))
            .pipe(gulp.dest(destPath));
    }
    // ------------------------------------------------------------------------
    //                               Clean
    // ------------------------------------------------------------------------
    gulp.task('clean', ['clean-gallery']);
    // ------------------------------------------------------------------------
    //                               Bump Version
    // ------------------------------------------------------------------------
    gulp.task('bump-version', function (cb) {
        var SRC_FILENAME = './package.json';
        var BADGES_FOLDER = "./" + dev_paths_js_1.DevPaths.BADGES_PATH + "/";
        var WARN_MSG = "\n  // This file was generated via gulp bump-version\n  // It has no uuid\n  //\n  // @WARN: Don't edit this file. See the " + SRC_FILENAME + "\n\n";
        var matches = fsix_js_1.fsix.readUtf8Sync(SRC_FILENAME).match(/"version": "([\d\.]+)"/);
        if (!matches) {
            throw "Unable to find the " + SRC_FILENAME + " version";
        }
        var version = matches[1];
        var VERSION_OUT = "export const VERSION = \"" + version + "\";";
        console.log(SRC_FILENAME + " version is " + version);
        sysFs.writeFileSync('./shared/version.ts', WARN_MSG + VERSION_OUT + '\n');
        sysFs.writeFileSync("./" + dev_paths_js_1.DevPaths.JS_PATH + "/version.ts", WARN_MSG + ("namespace ABeamer {\n  " + VERSION_OUT + "\n}\n"));
        var outBadgeFileBase = "v-" + version + ".gif";
        var outBadgeFileName = "" + BADGES_FOLDER + outBadgeFileBase;
        if (!sysFs.existsSync(outBadgeFileName)) {
            var path_1 = dev_paths_js_1.DevPaths.GALLERY_PATH + "/animate-badges";
            var url = "http://localhost:9000/" + path_1 + "/?var=name%3Dversion&"
                + ("var=value%3D" + version + "&var=wait%3D2s");
            var config = "./" + path_1 + "/abeamer.ini";
            // build animated badges
            var renderCmdLine = "node ./cli/abeamer-cli.js render --dp --url '" + url + "' --config " + config;
            console.log(renderCmdLine);
            fsix_js_1.fsix.runExternal(renderCmdLine, function (error, stdout, stderr) {
                if (stderr) {
                    console.error(stderr);
                    console.error('Animated Gif Badge Creation Failed');
                    console.log('Check out if the live server is running');
                }
                else {
                    var gifCmdLine = "node ./cli/abeamer-cli.js gif ./" + path_1 + "/ --loop 8 --gif " + outBadgeFileName;
                    console.log(gifCmdLine);
                    fsix_js_1.fsix.runExternal(gifCmdLine, function (_error, _stdout, _stderr) {
                        if (stderr) {
                            console.error(stderr);
                            console.error('Animated Gif Badge Creation Failed');
                        }
                        else {
                            console.log(stdout);
                            console.error('Animated Gif Badge Created!');
                        }
                    });
                }
            });
        }
        var vREADMEData = fsix_js_1.fsix.readUtf8Sync("./README.md");
        vREADMEData = vREADMEData.replace(/v-[\d\.]+\.gif/, outBadgeFileBase);
        sysFs.writeFileSync("./README.md", vREADMEData);
        fsix_js_1.fsix.runExternal('gulp build-shared-lib', function () {
            fsix_js_1.fsix.runExternal('tsc -p ./', function () {
                console.log('Version bumped');
                cb();
            });
        });
    });
    // ------------------------------------------------------------------------
    //                               Pre-Build Release
    // ------------------------------------------------------------------------
    var SINGLE_LIB_PATH = dev_paths_js_1.DevPaths.SHARED_PATH + "/dev-builders/output";
    var SINGLE_LIB_MODES = [
        { folder: 'min', suffix: '', isDebug: false },
        { folder: 'debug.min', suffix: '-debug', isDebug: true },
    ];
    gulp.task('pre-rel:clean', function (cb) {
        rimrafExcept(SINGLE_LIB_PATH, []);
        cb();
    });
    gulp.task('pre-rel:copy', function () {
        return mergeStream(SINGLE_LIB_MODES.map(function (mode) {
            return gulp.src([
                './tsconfig.json',
                './client/lib/typings/**',
                '!./client/lib/typings/release/**',
            ], { base: '.' })
                .pipe(gulp.dest(SINGLE_LIB_PATH + "/" + mode.folder));
        }));
    });
    gulp.task('pre-rel:build-single-file', function () {
        SINGLE_LIB_MODES.forEach(function (mode) {
            var singleLibFile = SINGLE_LIB_PATH + "/" + mode.folder + "/abeamer" + mode.suffix + ".ts";
            build_single_lib_file_js_1.BuildSingleLibFile.build(libModules, dev_paths_js_1.DevPaths.JS_PATH, SINGLE_LIB_PATH + "/" + mode.folder, singleLibFile, 'gulp `build-release`', ['_Story'], mode.isDebug);
        });
    });
    gulp.task('build-pre-release-internal', gulpSequence('pre-rel:clean', 'pre-rel:copy', 'pre-rel:build-single-file'));
    // ------------------------------------------------------------------------
    //                               Build Release
    // ------------------------------------------------------------------------
    var RELEASE_PATH = 'release/latest';
    gulp.task('rel:clean', function (cb) {
        rimrafExcept(RELEASE_PATH, ['.git']);
        cb();
    });
    gulp.task('rel:client', function () {
        return gulp.src([
            dev_paths_js_1.DevPaths.CLIENT_PATH + "/**",
            "!" + dev_paths_js_1.DevPaths.CLIENT_PATH + "/**/*.map",
            "!" + dev_paths_js_1.DevPaths.JS_PATH + "/*",
            "!" + dev_paths_js_1.DevPaths.PLUGINS_PATH + "/**",
            "!" + dev_paths_js_1.DevPaths.MESSAGES_PATH + "/*",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/release{,/**}",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/README.*",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/vendor/phantomjs{,/**}",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/vendor/README.*",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/*-dev.d.ts",
            "!" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/abeamer.d.ts",
            "!" + dev_paths_js_1.DevPaths.CLIENT_PATH + "/**/*[a-z][a-z].ts",
            "!" + dev_paths_js_1.DevPaths.CLIENT_PATH + "/**/*.scss",
            "!" + dev_paths_js_1.DevPaths.MODULES_LIST_FILE,
        ])
            .pipe(gulp.dest(RELEASE_PATH + "/client"))
            .pipe(gulpPreserveTime());
    });
    gulp.task('rel:jquery-typings', function () {
        return gulp.src("node_modules/@types/jquery/**")
            .pipe(gulp.dest(RELEASE_PATH + "/" + dev_paths_js_1.DevPaths.TYPINGS_PATH + "/vendor/jquery"))
            .pipe(gulpPreserveTime());
    });
    gulp.task('rel:client-js-join', function () {
        return gulp
            .src(SINGLE_LIB_PATH + "/*/abeamer*.js")
            .pipe(gulpMinify({
            noSource: true,
            ext: {
                min: '.min.js',
            },
        }))
            .pipe(gulpRename({ dirname: '' }))
            .pipe(gulpReplace(/^(.)/, CLIENT_UUID + COPYRIGHTS + '$1'))
            .pipe(gulp.dest(RELEASE_PATH + "/" + dev_paths_js_1.DevPaths.JS_PATH));
    });
    gulp.task('rel:gallery', function () {
        return gulp.src([
            dev_paths_js_1.DevPaths.GALLERY_PATH + "/" + releaseDemosRegEx + "/**",
            "!" + dev_paths_js_1.DevPaths.GALLERY_PATH + "/**/*.html",
            "!" + dev_paths_js_1.DevPaths.GALLERY_PATH + "/*/story-frames/*",
        ], { base: dev_paths_js_1.DevPaths.GALLERY_PATH })
            .pipe(gulp.dest(RELEASE_PATH + "/gallery"))
            .pipe(gulpPreserveTime());
    });
    gulp.task('rel:root', function () {
        return gulp.src([
            'abeamer.sh',
            'abeamer.cmd',
            'CHANGELOG.md',
            'LICENSE.txt',
            '.npmignore',
        ])
            .pipe(gulp.dest(RELEASE_PATH))
            .pipe(gulpPreserveTime());
    });
    gulp.task('rel:README', function () {
        return gulp.src([
            'README.md',
        ])
            .pipe(gulpReplace(/developer-badge\.gif/, 'end-user-badge.gif'))
            .pipe(gulp.dest(RELEASE_PATH))
            .pipe(gulpPreserveTime());
    });
    gulp.task('rel:gallery-html', function () {
        return mergeStream(updateHtmlPages(dev_paths_js_1.DevPaths.GALLERY_PATH + "/" + releaseDemosRegEx + "/*.html", RELEASE_PATH + "/gallery", ["../../" + dev_paths_js_1.DevPaths.JS_PATH + "/abeamer.min"], true, { base: dev_paths_js_1.DevPaths.GALLERY_PATH })
            .pipe(gulpPreserveTime()));
    });
    var JS_FILES = [
        'server/*.js',
        'cli/*.js',
        dev_paths_js_1.DevPaths.SHARED_PATH + "/*.js",
        dev_paths_js_1.DevPaths.SHARED_PATH + "/**/*.js",
        dev_paths_js_1.DevPaths.MESSAGES_PATH + "/*.js",
        dev_paths_js_1.DevPaths.PLUGINS_PATH + "/*/*.js",
        "!" + dev_paths_js_1.DevPaths.SHARED_PATH + "/dev-builders{/**,}",
        "!" + dev_paths_js_1.DevPaths.SHARED_PATH + "/dev-*.js",
        "!" + dev_paths_js_1.DevPaths.SHARED_PATH + "/**/dev-*.js",
    ];
    gulp.task('rel:minify', function () {
        // not required to preserve timestamp since `rel:add-copyrights` does the job
        return gulp.src(JS_FILES, { base: '.' })
            .pipe(gulpMinify({
            noSource: true,
            ext: {
                min: '.js',
            },
        }))
            .pipe(gulp.dest("" + RELEASE_PATH));
    });
    gulp.task('rel:add-copyrights', function (cb) {
        globule.find(JS_FILES).forEach(function (file) {
            var srcFileContent = fsix_js_1.fsix.readUtf8Sync(file);
            var uuidMatches = srcFileContent.match(/uuid:\s*([\w\-]+)/);
            if (uuidMatches) {
                var dstFileName = RELEASE_PATH + "/" + file;
                var content = fsix_js_1.fsix.readUtf8Sync(dstFileName);
                content = content.replace(/("use strict";)/, function (all) {
                    return all + "\n// uuid: " + uuidMatches[1] + "\n" + COPYRIGHTS;
                });
                sysFs.writeFileSync(dstFileName, content);
                var stat = sysFs.statSync(file);
                sysFs.utimesSync(dstFileName, stat.atime, stat.mtime);
            }
        });
        cb();
    });
    // copies package.json cleaning the unnecessary config
    gulp.task('rel:build-package.json', function () {
        return gulp.src('./package.json')
            .pipe(gulpReplace(/^((?:.|\n)+)$/, function (all, p) {
            var pkg = JSON.parse(p);
            // removes all dependencies
            pkg.devDependencies = {};
            // removes unnecessary scripts
            var scripts = {};
            ['compile', 'watch', 'abeamer', 'serve'].forEach(function (key) {
                scripts[key] = pkg.scripts[key];
            });
            pkg.scripts = scripts;
            // sets only the repo for the release version.
            // homepage and issue will remain intact
            // pkg.repository.url = pkg.repository.url + '-release';
            return JSON.stringify(pkg, undefined, 2);
        }))
            .pipe(gulp.dest("" + RELEASE_PATH))
            .pipe(gulpPreserveTime());
    });
    // copies tsconfig.ts to each demo cleaning the unnecessary config
    gulp.task('rel:build-tsconfig.ts', function () {
        return mergeStream(RELEASE_DEMOS.map(function (demo) {
            return gulp.src('./tsconfig.json')
                .pipe(gulpReplace(/^((?:.|\n)+)$/, function (all, p) {
                var tsconfig = JSON.parse(p);
                tsconfig.exclude = [];
                tsconfig["tslint.exclude"] = undefined;
                return JSON.stringify(tsconfig, undefined, 2);
            }))
                .pipe(gulp.dest(RELEASE_PATH + "/gallery/" + demo))
                .pipe(gulpPreserveTime());
        }));
    });
    // creates a plugin list from modules-list.json
    // don't use gulp-file in order to preserve the time-date
    gulp.task('rel:build-plugins-list.json', function () {
        return gulp.src(dev_paths_js_1.DevPaths.MODULES_LIST_FILE)
            .pipe(gulpReplace(/^((?:.|\n)+)$/, function (all, p) {
            return JSON.stringify(pluginModules, undefined, 2);
        }))
            .pipe(gulpRename('plugins-list.json'))
            .pipe(gulp.dest(RELEASE_PATH + "/" + dev_paths_js_1.DevPaths.PLUGINS_PATH))
            .pipe(gulpPreserveTime());
    });
    // joins abeamer.d.ts and abeamer-release.d.ts in a single file
    gulp.task('rel:build-abeamer.d.ts', function () {
        return gulp.src(dev_paths_js_1.DevPaths.TYPINGS_PATH + "/abeamer.d.ts")
            .pipe(gulpReplace(/declare namespace ABeamer \{/, function (all) {
            var releaseDTs = fsix_js_1.fsix.readUtf8Sync(dev_paths_js_1.DevPaths.TYPINGS_PATH + "/release/abeamer-release.d.ts");
            return all
                + releaseDTs
                    .replace(/^(?:.|\n)*declare namespace ABeamer \{/, '')
                    .replace(/}(?:\s|\n)*$/, '');
        }))
            .pipe(gulp.dest(RELEASE_PATH + "/" + dev_paths_js_1.DevPaths.TYPINGS_PATH))
            .pipe(gulpPreserveTime());
    });
    gulp.task('build-release-internal', ['rel:clean'], gulpSequence('rel:client', 'rel:gallery', 'rel:gallery-html', 'rel:client-js-join', 'rel:root', 'rel:README', 'rel:minify', 'rel:add-copyrights', 'rel:jquery-typings', 'rel:build-package.json', 'rel:build-tsconfig.ts', 'rel:build-abeamer.d.ts', 'rel:build-plugins-list.json'));
    // ------------------------------------------------------------------------
    //                               Builds Shared Modules from Client
    // ------------------------------------------------------------------------
    gulp.task('build-shared-lib', function () {
        build_shared_js_1.BuildShared.build(libModules, dev_paths_js_1.DevPaths.JS_PATH, dev_paths_js_1.DevPaths.SHARED_LIB_PATH, 'gulp build-shared-lib');
    });
    // ------------------------------------------------------------------------
    //                               Builds Definition Files
    // ------------------------------------------------------------------------
    gulp.task('build-definition-files', function () {
        build_d_ts_abeamer_js_1.BuildDTsFilesABeamer.build(libModules, pluginModules, CLIENT_UUID, COPYRIGHTS);
    });
    // ------------------------------------------------------------------------
    //                               Builds the documentation
    // ------------------------------------------------------------------------
    gulp.task('build-docs', function () {
        build_docs_js_1.BuildDocs.build(libModules, pluginModules);
    });
    gulp.task('post-build-docs', function () {
        var replacePaths = [
            [/"[^"]*highlight.[^"]*\.js"/, '"/vendor/highlight.js"'],
            [/"[^"]+jquery[^"]*\.js"/, '"/vendor/jquery-3.3.1.min.js"'],
            [/"[\.\/]*css\/theme(\w*)\.css"/g, '"/css/mydocs/theme$1.min.css"'],
            [/"[^"]+highlight.js[^"]*\.css"/, '"/css/my-code-theme.min.css"'],
        ];
        build_docs_js_1.BuildDocs.postBuild([
            dev_paths_js_1.DevPaths.END_USER_DOCS_PATH + "/en/site{/,/*/}*.html",
            dev_paths_js_1.DevPaths.DEV_DOCS_PATH + "/en/site{/,/*/}*.html"
        ], replacePaths);
    });
    // ------------------------------------------------------------------------
    //                               Builds Release Version Of The Gallery
    // ------------------------------------------------------------------------
    gulp.task('gal-rel:clear', function (cb) {
        rimrafExcept(dev_paths_js_1.DevPaths.GALLERY_RELEASE_PATH, ['.git']);
        cb();
    });
    gulp.task('gal-rel:get-examples', ['gal-rel:clear'], function (cb) {
        build_gallery_release_js_1.BuildGalleryRelease.populateReleaseExamples();
        cb();
    });
    gulp.task('gal-rel:copy-files', ['gal-rel:get-examples'], function () {
        return mergeStream(build_gallery_release_js_1.BuildGalleryRelease.releaseExamples.map(function (ex) {
            var srcList = [ex.srcFullPath + "/**",
                "!" + ex.srcFullPath + "/*.html",
                "!" + ex.srcFullPath + "/story.json",
                "!" + ex.srcFullPath + "/story-frames/*.png"];
            if (ex.srcFullPath.includes('remote-server')) {
                srcList.push("!" + ex.srcFullPath + "/assets{/**,}");
            }
            return gulp.src(srcList, { dot: true })
                .pipe(gulp.dest(ex.dstFullPath));
        }));
    });
    gulp.task('gal-rel:update-html-files', ['gal-rel:copy-files'], function () {
        return mergeStream(build_gallery_release_js_1.BuildGalleryRelease.releaseExamples.map(function (ex) {
            return updateHtmlPages(ex.srcFullPath + "/*.html", ex.dstFullPath, ["../../" + dev_paths_js_1.DevPaths.JS_PATH + "/abeamer.min"], true);
        }));
    });
    gulp.task('gal-rel:online-html-files', ['gal-rel:update-html-files'], function () {
        var onlineLink = dev_web_links_js_1.DevWebLinks.webDomain + "/" + dev_paths_js_1.DevPaths.RELEASE_LATEST_PATH + "/client/lib";
        return mergeStream(build_gallery_release_js_1.BuildGalleryRelease.releaseExamples.map(function (ex) {
            return gulp.src([ex.dstFullPath + "/index.html"])
                .pipe(gulpReplace(/^(?:.|\n)+$/, function (all) {
                return all
                    .replace(/"abeamer\//g, "\"" + onlineLink + "/")
                    .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1');
            }))
                .pipe(gulpRename('index-online.html'))
                .pipe(gulp.dest(ex.dstFullPath))
                .pipe(gulpPreserveTime());
        }));
    });
    gulp.task('gal-rel:create-zip', ['gal-rel:online-html-files'], function () {
        return mergeStream(build_gallery_release_js_1.BuildGalleryRelease.releaseExamples.map(function (ex) {
            return gulp.src([
                ex.dstFullPath + "/**",
                ex.dstFullPath + "/.allowed-plugins.json",
                "!" + ex.dstFullPath + "/index-online.html",
                "!" + ex.dstFullPath + "/*.zip",
                "!" + ex.dstFullPath + "/story-frames/*.{json,gif,mp4}",
            ])
                .pipe(gulpZip(build_gallery_release_js_1.BuildGalleryRelease.EXAMPLE_ZIP_FILE))
                .pipe(gulp.dest(ex.dstFullPath));
        }));
    });
    gulp.task('gal-rel:process-readme', ['gal-rel:create-zip'], function (cb) {
        build_gallery_release_js_1.BuildGalleryRelease.buildReadMe();
        cb();
    });
    gulp.task('build-gallery-release', ['gal-rel:process-readme']);
    // ------------------------------------------------------------------------
    //                               Deletes gallery story-frames folder
    // ------------------------------------------------------------------------
    gulp.task('clean-gallery', function (cb) {
        rimraf.sync(dev_paths_js_1.DevPaths.GALLERY_PATH + "/*/story-frames");
        cb();
    });
    gulp.task('clean-gallery-png', function (cb) {
        rimraf.sync(dev_paths_js_1.DevPaths.GALLERY_PATH + "/*/story-frames/*.png");
        cb();
    });
    // ------------------------------------------------------------------------
    //                               Creates gallery examples gif image
    // ------------------------------------------------------------------------
    gulp.task('build-gallery-gifs', ['clean-gallery-png'], function (cb) {
        build_gallery_release_js_1.BuildGalleryRelease.buildGifs();
        cb();
    });
    // ------------------------------------------------------------------------
    //                               Update Gallery Scripts
    // ------------------------------------------------------------------------
    gulp.task('update-gallery-scripts', function () {
        var DST_PATH = dev_paths_js_1.DevPaths.GALLERY_PATH + "-updated";
        rimraf.sync(DST_PATH + "/**");
        var newScriptFiles = libModules.map(function (srcFile) {
            return "../../" + dev_paths_js_1.DevPaths.JS_PATH + "/" + srcFile;
        });
        return mergeStream(updateHtmlPages(dev_paths_js_1.DevPaths.GALLERY_PATH + "/*/*.html", DST_PATH, newScriptFiles, false));
    });
    // ------------------------------------------------------------------------
    //                               Updates Test List
    // ------------------------------------------------------------------------
    gulp.task('update-test-list', function () {
        var tests = [];
        sysFs.readdirSync("./test/tests").forEach(function (file) {
            file.replace(/(test-.*)\.ts/, function (m, testName) {
                tests.push(testName);
                return '';
            });
        });
        var TEST_LIST_FILE = "./test/test-list.json";
        var curTestList = fsix_js_1.fsix.loadJsonSync(TEST_LIST_FILE);
        tests.forEach(function (test) {
            if (curTestList.active.indexOf(test) === -1 &&
                curTestList.disabled.indexOf(test) === -1) {
                console.log("Adding test " + test + " to " + TEST_LIST_FILE);
                curTestList.active.push(test);
            }
        });
        fsix_js_1.fsix.writeJsonSync(TEST_LIST_FILE, curTestList);
        console.log("Updated " + TEST_LIST_FILE);
        var PACKAGE_FILE = "./package.json";
        var pkg = fsix_js_1.fsix.loadJsonSync(PACKAGE_FILE);
        var scripts = pkg.scripts;
        tests.forEach(function (test) {
            if (scripts[test] === undefined) {
                console.log("Adding test " + test + " to " + PACKAGE_FILE);
                scripts[test] = "mocha test/tests/" + test + ".js";
            }
        });
        fsix_js_1.fsix.writeJsonSync(PACKAGE_FILE, pkg);
        console.log("Updated " + PACKAGE_FILE);
    });
    // ------------------------------------------------------------------------
    //                               Lists ./docs Files As Links
    // ------------------------------------------------------------------------
    gulp.task('list-docs-files-as-links', function () {
        sysFs.readdirSync("./docs").forEach(function (fileBase) {
            if (sysPath.extname(fileBase) !== '.md') {
                return;
            }
            var fileTitle = sysPath.parse(fileBase).name;
            var title = fileTitle.replace(/-/g, ' ')
                .replace(/\b(\w)/, function (all, firstChar) { return firstChar.toUpperCase(); });
            console.log("- [" + title + "](" + fileBase + ")");
        });
    });
    // ------------------------------------------------------------------------
    //                               Lists ./docs Files As Links
    // ------------------------------------------------------------------------
    function changeReadmeLinks(toLocal) {
        var IN_FILE = './README.md';
        var BAK_FILE = IN_FILE + '.bak.md';
        var srcRegEx = new RegExp('\\]\\(' + (toLocal ? dev_web_links_js_1.DevWebLinks.webDomain : '') + '/', 'g');
        var dstLink = '](' + (toLocal ? '' : dev_web_links_js_1.DevWebLinks.webDomain) + '/';
        var content = fsix_js_1.fsix.readUtf8Sync(IN_FILE);
        sysFs.writeFileSync(BAK_FILE, content);
        content = content.replace(srcRegEx, dstLink);
        sysFs.writeFileSync(IN_FILE, content);
    }
    gulp.task('README-to-online', function () {
        changeReadmeLinks(false);
    });
    gulp.task('README-to-local', function () {
        changeReadmeLinks(true);
    });
})(Gulp || (Gulp = {}));
//# sourceMappingURL=gulpfile.js.map