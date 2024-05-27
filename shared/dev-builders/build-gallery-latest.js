"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            .loadJsonSync(cfg.paths.GALLERY_SRC_PATH + "/exclude-from-release.json");
        sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH).forEach(function (folder) {
            if (exclusions.indexOf(folder) !== -1) {
                return;
            }
            var srcFullPath = cfg.paths.GALLERY_SRC_PATH + "/" + folder;
            var dstFullPath = cfg.paths.GALLERY_LATEST_PATH + "/" + folder;
            var iniFileName = srcFullPath + "/abeamer.ini";
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
                                console.warn("Incorrect description numbering in " + iniFileName);
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
                + ("\n### " + ex.folder + "\n")
                + ("" + ex.description.join('  \n') + '  '));
            var storyFramesFolder = ex.folder + "/story-frames";
            if (!ex.noGifImage) {
                checkFile("./" + cfg.paths.GALLERY_SRC_PATH + "/" + ex.folder + "/story-frames/story.gif");
                galleryLinks.push("\n  "
                    + ("\n![Image](" + storyFramesFolder + "/story.gif?" + rnd + ")" + '  ' + "\n  "));
            }
            if (ex.genMovie) {
                galleryLinks.push("\n  "
                    + ("\n[![Image](" + storyFramesFolder + "/../" + ex.movieSnapshot + ")]")
                    + ("(" + storyFramesFolder + "/../" + ex.movieViewPage + ")" + '  ' + "\n  "));
            }
            galleryLinks.push("\nDownload code: [zip](" + ex.folder + "/" + BuildGalleryLatest.EXAMPLE_ZIP_FILE + ")." + '  ' + "\nTry it <a href=\"" + ex.folder + "/index-online.html\">online</a>." + '  ' + "\n" + (ex.usesLive ? '**WARNING** This example requires a live server.  \n' : '  \n') + "\n" + (!ex.teleportable ? '**WARNING** This example doesn\'t supports teleportation.  \n' : '  \n') + "\n    ");
        });
        var outREADME = fsix_js_1.fsix.readUtf8Sync(cfg.paths.GALLERY_SRC_PATH + "/README-rel.md")
            + galleryLinks.join('');
        sysFs.writeFileSync(cfg.paths.GALLERY_LATEST_PATH + "/README.md", outREADME);
        if (missingFiles.length) {
            throw "Missing files:\n" + missingFiles.join('\n');
        }
    }
    BuildGalleryLatest.buildReadMe = buildReadMe;
    // ------------------------------------------------------------------------
    //                               Runs External Commands
    // ------------------------------------------------------------------------
    function runSpawn(cmdLine, args, callback) {
        console.log("spawn cmdLine: " + cmdLine);
        console.log("args: " + args);
        var ls = child_process_1.spawn(cmdLine, args);
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
            runSpawn('npm', ['run', '--', 'render', '--dp', '--url',
                cfg.webLinks.localServer + "/" + cfg.paths.GALLERY_SRC_PATH + "/" + example.folder + "/",
                '--config', "./" + cfg.paths.GALLERY_SRC_PATH + "/" + example.folder + "/abeamer.ini",
            ], function () {
                runSpawn('npm', ['run', '--', 'gif', cfg.paths.GALLERY_SRC_PATH + "/" + example.folder + "/"], function () {
                    console.log("Done example: " + example.folder);
                });
            });
            // }
            console.log("example.folder: " + example.folder);
        });
    }
    BuildGalleryLatest.buildGifs = buildGifs;
})(BuildGalleryLatest = exports.BuildGalleryLatest || (exports.BuildGalleryLatest = {}));
//# sourceMappingURL=build-gallery-latest.js.map