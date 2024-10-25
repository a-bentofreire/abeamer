"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildGalleryLatest = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var sysFs = require("fs");
var child_process_1 = require("child_process");
var fsix_js_1 = require("../vendor/fsix.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * Builds gallery-release files.
 * Read the [](#config-file.md) for more information.
 */
var BuildGalleryLatest;
(function (BuildGalleryLatest) {
    BuildGalleryLatest.EXAMPLE_ZIP_FILE = 'code.zip';
    BuildGalleryLatest.releaseExamples = [];
    /**
     * Fills the `releaseExamples` list with every gallery example that
     * is prepared to be released.
     */
    function populateReleaseExamples(cfg) {
        var exclusions = fsix_js_1.fsix
            .loadJsonSync("".concat(cfg.paths.GALLERY_SRC_PATH, "/exclude-from-release.json"));
        sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH).forEach(function (folder) {
            if (exclusions.indexOf(folder) !== -1) {
                return;
            }
            var srcFullPath = "".concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(folder);
            var dstFullPath = "".concat(cfg.paths.GALLERY_LATEST_PATH, "/").concat(folder);
            var iniFileName = "".concat(srcFullPath, "/abeamer.ini");
            if (sysFs.existsSync(iniFileName)) {
                var ex_1 = {
                    width: 0,
                    height: 0,
                    folder: folder,
                    srcFullPath: srcFullPath,
                    dstFullPath: dstFullPath,
                    iniFileName: iniFileName,
                    description: [],
                    usesLive: false,
                    noGifImage: false,
                    genMovie: false,
                    teleportable: true,
                    movieSnapshot: '',
                    movieViewPage: '',
                };
                var prevNr_1 = 0;
                var lastDescLine_1 = '';
                fsix_js_1.fsix.readUtf8Sync(iniFileName).replace(/[\$@]abeamer-([a-z\-]+)(\d*)\s*:\s*"?([^";]+)"?/g, function (_all, id, nr, value) {
                    switch (id) {
                        case 'description':
                            nr = parseInt(nr || '1');
                            if (nr !== prevNr_1 + 1) {
                                console.warn("Incorrect description numbering in ".concat(iniFileName));
                            }
                            prevNr_1 = nr;
                            if (lastDescLine_1 && !lastDescLine_1.match(/[:\.]$/)) {
                                lastDescLine_1 += ' ' + value;
                                ex_1.description[ex_1.description.length - 1] = lastDescLine_1;
                            }
                            else {
                                ex_1.description.push(value);
                                lastDescLine_1 = value;
                            }
                            break;
                        case 'width':
                            ex_1.width = parseInt(value);
                            break;
                        case 'height':
                            ex_1.height = parseInt(value);
                            break;
                        case 'uses-live':
                            ex_1.usesLive = value.toLowerCase() === 'true';
                            break;
                        case 'no-gif-image':
                            ex_1.noGifImage = value.toLowerCase() === 'true';
                            break;
                        case 'gen-movie':
                            ex_1.genMovie = value.toLowerCase() === 'true';
                            ex_1.noGifImage = ex_1.noGifImage || ex_1.genMovie;
                            break;
                        case 'teleportable':
                            ex_1.teleportable = value.toLowerCase() === 'true';
                            break;
                        case 'movie-snapshot':
                            ex_1.movieSnapshot = value;
                            break;
                        case 'movie-view-page':
                            ex_1.movieViewPage = value;
                            break;
                    }
                    return '';
                });
                if (!ex_1.description.length) {
                    ex_1.description.push(folder);
                }
                BuildGalleryLatest.releaseExamples.push(ex_1);
            }
        });
    }
    BuildGalleryLatest.populateReleaseExamples = populateReleaseExamples;
    // ------------------------------------------------------------------------
    //                               buildReadMe
    // ------------------------------------------------------------------------
    /**
     * Builds the gallery-release ReadMe file
     */
    function buildReadMe(cfg) {
        var galleryLinks = [];
        var missingFiles = [];
        var rnd = Math.round(Math.random() * 100000000);
        function checkFile(fileName) {
            if (!sysFs.existsSync(fileName)) {
                missingFiles.push(fileName);
            }
            return fileName;
        }
        BuildGalleryLatest.releaseExamples.forEach(function (ex) {
            galleryLinks.push("\n--------------------------"
                + "\n### ".concat(ex.folder, "\n")
                + "".concat(ex.description.join('  \n')).concat('  '));
            var storyFramesFolder = "".concat(ex.folder, "/story-frames");
            if (!ex.noGifImage) {
                checkFile("./".concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(ex.folder, "/story-frames/story.gif"));
                galleryLinks.push("\n  "
                    + "\n![Image](".concat(storyFramesFolder, "/story.gif?").concat(rnd, ")").concat('  ', "\n  "));
            }
            if (ex.genMovie) {
                galleryLinks.push("\n  "
                    + "\n[![Image](".concat(storyFramesFolder, "/../").concat(ex.movieSnapshot, ")]")
                    + "(".concat(storyFramesFolder, "/../").concat(ex.movieViewPage, ")").concat('  ', "\n  "));
            }
            galleryLinks.push("\nDownload code: [zip](".concat(ex.folder, "/").concat(BuildGalleryLatest.EXAMPLE_ZIP_FILE, ").").concat('  ', "\nTry it <a href=\"").concat(ex.folder, "/index-online.html\">online</a>.").concat('  ', "\n").concat(ex.usesLive ? '**WARNING** This example requires a live server.  \n' : '  \n', "\n").concat(!ex.teleportable ? '**WARNING** This example doesn\'t supports teleportation.  \n' : '  \n', "\n    "));
        });
        var outREADME = fsix_js_1.fsix.readUtf8Sync("".concat(cfg.paths.GALLERY_SRC_PATH, "/README-rel.md"))
            + galleryLinks.join('');
        sysFs.writeFileSync("".concat(cfg.paths.GALLERY_LATEST_PATH, "/README.md"), outREADME);
        if (missingFiles.length) {
            console.error("Missing files:\n" + missingFiles.join('\n'));
            //   throw `Missing files:\n` + missingFiles.join('\n');
        }
    }
    BuildGalleryLatest.buildReadMe = buildReadMe;
    // ------------------------------------------------------------------------
    //                               Runs External Commands
    // ------------------------------------------------------------------------
    function runSpawn(cmdLine, args, callback) {
        console.log("spawn cmdLine: ".concat(cmdLine));
        console.log("args: ".concat(args));
        var ls = (0, child_process_1.spawn)(cmdLine, args);
        ls.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        ls.stderr.on('data', function (data) {
            console.error(data.toString());
        });
        ls.on('close', function () {
            callback();
        });
    }
    // ------------------------------------------------------------------------
    //                               buildGifs
    // ------------------------------------------------------------------------
    function buildGifs(cfg) {
        populateReleaseExamples(cfg);
        BuildGalleryLatest.releaseExamples.forEach(function (example /* , index */) {
            if (example.noGifImage) {
                return;
            }
            // if (example.folder === 'animate-attack-task') { // use to test one example only
            runSpawn('npm', ['run', '--', 'render', '--dp', '--url', "".concat(cfg.webLinks.localServer, "/").concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(example.folder, "/"), '--config', "./".concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(example.folder, "/abeamer.ini"),
            ], function () {
                runSpawn('npm', ['run', '--', 'gif', "".concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(example.folder, "/")], function () {
                    console.log("Done example: ".concat(example.folder));
                });
            });
            // }
            console.log("example.folder: ".concat(example.folder));
        });
    }
    BuildGalleryLatest.buildGifs = buildGifs;
})(BuildGalleryLatest || (exports.BuildGalleryLatest = BuildGalleryLatest = {}));
//# sourceMappingURL=build-gallery-latest.js.map