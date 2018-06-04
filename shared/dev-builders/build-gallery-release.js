"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 4293b25a-0b5f-4af9-8dd7-a351ff686908
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var sysFs = require("fs");
var child_process_1 = require("child_process");
var fsix_js_1 = require("../vendor/fsix.js");
var dev_web_links_js_1 = require("../dev-web-links.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * Builds gallery-release files.
 * Read the [](#config-file.md) for more information.
 */
var BuildGalleryRelease;
(function (BuildGalleryRelease) {
    BuildGalleryRelease.SRC_GALLERY_PATH = 'gallery';
    BuildGalleryRelease.DST_GALLERY_RELEASE_PATH = 'gallery-release';
    BuildGalleryRelease.EXAMPLE_ZIP_FILE = 'code.zip';
    BuildGalleryRelease.releaseExamples = [];
    /**
     * Fills the `releaseExamples` list with every gallery example that
     * is prepared to be released.
     */
    function populateReleaseExamples() {
        var exclusions = fsix_js_1.fsix.loadJsonSync(BuildGalleryRelease.SRC_GALLERY_PATH + "/exclude-from-release.json");
        sysFs.readdirSync(BuildGalleryRelease.SRC_GALLERY_PATH).forEach(function (folder) {
            if (exclusions.indexOf(folder) !== -1) {
                return;
            }
            var srcFullPath = BuildGalleryRelease.SRC_GALLERY_PATH + "/" + folder;
            var dstFullPath = BuildGalleryRelease.DST_GALLERY_RELEASE_PATH + "/" + folder;
            var iniFileName = srcFullPath + "/abeamer.ini";
            if (sysFs.existsSync(iniFileName)) {
                var description_1 = [];
                var usesLive_1 = false;
                var noGifImage_1 = false;
                var teleportable_1 = true;
                var prevNr_1 = 0;
                var lastDescLine_1 = '';
                fsix_js_1.fsix.readUtf8Sync(iniFileName).replace(/[\$@]abeamer-([a-z\-]+)(\d*)\s*:\s*"([^"]+)"/g, function (all, id, nr, value) {
                    switch (id) {
                        case 'description':
                            nr = parseInt(nr || '1');
                            if (nr !== prevNr_1 + 1) {
                                console.warn("Incorrect description numbering in " + iniFileName);
                            }
                            prevNr_1 = nr;
                            if (lastDescLine_1 && !lastDescLine_1.endsWith('.')) {
                                lastDescLine_1 += ' ' + value;
                                description_1[description_1.length - 1] = lastDescLine_1;
                            }
                            else {
                                description_1.push(value);
                                lastDescLine_1 = value;
                            }
                            break;
                        case 'uses-live':
                            usesLive_1 = value.toLowerCase() === 'true';
                            break;
                        case 'no-gif-image':
                            noGifImage_1 = value.toLowerCase() === 'true';
                            break;
                        case 'teleportable':
                            teleportable_1 = value.toLowerCase() === 'true';
                            break;
                    }
                    return '';
                });
                if (!description_1.length) {
                    description_1.push(folder);
                }
                BuildGalleryRelease.releaseExamples.push({
                    folder: folder,
                    srcFullPath: srcFullPath,
                    dstFullPath: dstFullPath,
                    iniFileName: iniFileName,
                    description: description_1,
                    usesLive: usesLive_1,
                    noGifImage: noGifImage_1,
                    teleportable: teleportable_1,
                });
            }
        });
    }
    BuildGalleryRelease.populateReleaseExamples = populateReleaseExamples;
    // ------------------------------------------------------------------------
    //                               buildReadMe
    // ------------------------------------------------------------------------
    /**
     * Builds the gallery-release ReadMe file
     */
    function buildReadMe() {
        var galleryLinks = [];
        BuildGalleryRelease.releaseExamples.forEach(function (ex) {
            galleryLinks.push("\n--------------------------"
                + ("\n### " + ex.folder + "\n")
                + ("" + ex.description.join('  \n') + '  '));
            if (!ex.noGifImage) {
                galleryLinks.push("\n  "
                    + ("\n![Image](" + dev_web_links_js_1.DevWebLinks.repos.galleryReleaseRaw + ex.folder + "/story-frames/story.gif)" + '  ' + "\n  "));
            }
            galleryLinks.push("\nDownload code: [zip](" + dev_web_links_js_1.DevWebLinks.repos.galleryReleaseRaw + ex.folder + "/" + BuildGalleryRelease.EXAMPLE_ZIP_FILE + ")" + '  ' + "\n" + (ex.usesLive ? '**WARNING** This example requires a live server.  \n' : '  \n') + "\n" + (!ex.teleportable ? '**WARNING** This example doesn\'t supports teleportation.  \n' : '  \n') + "\n    ");
        });
        var outREADME = fsix_js_1.fsix.readUtf8Sync(BuildGalleryRelease.SRC_GALLERY_PATH + "/README-rel.md")
            + galleryLinks.join('');
        sysFs.writeFileSync(BuildGalleryRelease.DST_GALLERY_RELEASE_PATH + "/README.md", outREADME);
    }
    BuildGalleryRelease.buildReadMe = buildReadMe;
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
        ls.on('close', function (code) {
            callback();
        });
    }
    // ------------------------------------------------------------------------
    //                               buildGifs
    // ------------------------------------------------------------------------
    function buildGifs() {
        populateReleaseExamples();
        BuildGalleryRelease.releaseExamples.forEach(function (example, index) {
            if (example.noGifImage) {
                return;
            }
            // if (example.folder === 'animate-attack-task') { // use to test one example only
            runSpawn('npm', ['run', '--', 'render', '--dp', '--url',
                dev_web_links_js_1.DevWebLinks.repos.main + "gallery/" + example.folder + "/",
                '--config', "./gallery/" + example.folder + "/abeamer.ini",
            ], function () {
                runSpawn('npm', ['run', '--', 'gif', "gallery/" + example.folder + "/"], function () {
                    console.log("Done example: " + example.folder);
                });
            });
            // }
            console.log("example.folder: " + example.folder);
        });
    }
    BuildGalleryRelease.buildGifs = buildGifs;
})(BuildGalleryRelease = exports.BuildGalleryRelease || (exports.BuildGalleryRelease = {}));
//# sourceMappingURL=build-gallery-release.js.map