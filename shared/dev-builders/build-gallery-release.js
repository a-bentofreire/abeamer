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
                fsix_js_1.fsix.readUtf8Sync(iniFileName).replace(/[\$@]abeamer-([a-z\-]+)(\d*)\s*:\s*"?([^";]+)"?/g, function (all, id, nr, value) {
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
                BuildGalleryRelease.releaseExamples.push(ex_1);
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
        var missingFiles = [];
        function checkFile(fileName) {
            if (!sysFs.existsSync(fileName)) {
                missingFiles.push(fileName);
            }
            return fileName;
        }
        BuildGalleryRelease.releaseExamples.forEach(function (ex) {
            galleryLinks.push("\n--------------------------"
                + ("\n### " + ex.folder + "\n")
                + ("" + ex.description.join('  \n') + '  '));
            var storyFramesFolder = ex.folder + "/story-frames";
            if (!ex.noGifImage) {
                checkFile("./" + BuildGalleryRelease.SRC_GALLERY_PATH + "/" + ex.folder + "/story-frames/story.gif");
                galleryLinks.push("\n  "
                    + ("\n![Image](" + storyFramesFolder + "/story.gif)" + '  ' + "\n  "));
            }
            if (ex.genMovie) {
                galleryLinks.push("\n  "
                    + ("\n[![Image](" + storyFramesFolder + "/../" + ex.movieSnapshot + ")]")
                    + ("(" + storyFramesFolder + "/../" + ex.movieViewPage + ")" + '  ' + "\n  "));
            }
            galleryLinks.push("\nDownload code: [zip](" + ex.folder + "/" + BuildGalleryRelease.EXAMPLE_ZIP_FILE + ")" + '  ' + "\nTry it <a href=\"" + ex.folder + "/index-online.html\">online</a>." + '  ' + "\n" + (ex.usesLive ? '**WARNING** This example requires a live server.  \n' : '  \n') + "\n" + (!ex.teleportable ? '**WARNING** This example doesn\'t supports teleportation.  \n' : '  \n') + "\n    ");
        });
        var outREADME = fsix_js_1.fsix.readUtf8Sync(BuildGalleryRelease.SRC_GALLERY_PATH + "/README-rel.md")
            + galleryLinks.join('');
        sysFs.writeFileSync(BuildGalleryRelease.DST_GALLERY_RELEASE_PATH + "/README.md", outREADME);
        if (missingFiles.length) {
            throw "Missing files:\n" + missingFiles.join('\n');
        }
        return outREADME;
    }
    BuildGalleryRelease.buildReadMe = buildReadMe;
    function markdownToHtml(markdownCompiler, highlightJs, sourceMarkdown) {
        markdownCompiler.setOptions({
            renderer: new markdownCompiler.Renderer(),
            highlight: function (code) { return highlightJs
                ? highlightJs.highlightAuto(code).value : code; },
            pedantic: false,
            gfm: true,
            tables: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false,
        });
        /* spell-checker: disable */
        var html = '<html>\n<head>\n'
            // this sytle used in html output of the markdown is designed to be similar
            // to the github markdown rendered in order to have a good simulation of
            // how the user will see the documentation.
            + (highlightJs ? "\n  <link rel=\"stylesheet\" href=\"node_modules/github.css\">\n  <link rel=\"stylesheet\" href=\"node_modules/font-awesome.css\">\n  <style>\n  body {\n    font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,\n      sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n      color: #24292e;\n      background-color: white;\n  }\n  pre {\n    background-color: #1b1f230d;\n    padding: 0.2em 0.4em;\n  }\n  #__page {\n     max-width: 980px;\n     padding: 45px;\n     border-bottom-right-radius: 3px;\n     border-bottom-left-radius: 3px;\n     margin-left: 20px;\n  }\n  code {\n    background-color: #1b1f230d;\n    padding: 0.2em 0.4em;\n  }\n  pre code {\n    background-color: transparent;\n    padding: 0;\n  }\n\n  </style>\n  <script src=\"node_modules/highlight.js\"></script>\n  <script>hljs.initHighlightingOnLoad();</script>\n" : '')
            + '</head>\n<body>\n<div id=__page>'
            + markdownCompiler(sourceMarkdown)
            + '</div></body>\n</html>';
        return html;
    }
    function buildIndexHtml(readMe, gaID) {
        var markdownCompiler = require('marked');
        var highlightJs = require('highlight.js');
        var indexHtml = integrateHtmlWithWebSite(markdownToHtml(markdownCompiler, highlightJs, readMe), { gaID: gaID }, true);
        sysFs.writeFileSync(BuildGalleryRelease.DST_GALLERY_RELEASE_PATH + "/index.html", indexHtml);
    }
    BuildGalleryRelease.buildIndexHtml = buildIndexHtml;
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
        BuildGalleryRelease.releaseExamples.forEach(function (example /* , index */) {
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
    function integrateHtmlWithWebSite(content, opts, isIndex) {
        var css = "\n<style>\nbody {\n  margin: 0 !important;\n}\n.website-header {\n  background-color: #2C3E50 !important;\n  font-family: \"Lato\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \n  \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 1.5;\n  color: white;\n  text-align: left;\n  padding: 1rem 1rem;\n}\n.website-header a:link, .website-header a:visited {\n  color: white;\n}\n.website-header .separator {\n  padding: 3px;\n}\n  </style>";
        if (!isIndex) {
            content = content
                .replace(/"abeamer\//g, "\"" + opts.onlineLink + "/")
                .replace(/(<head>)/, "$1\n<title>ABeamer example: [" + opts.folder + "]</title>");
        }
        else {
            content = content
                .replace(/(<head>)/, "$1\n<title>ABeamer Gallery</title>\n" + css)
                .replace(/(<body>)/, "$1\n<div class=website-header><a href=\"/\">Home</a><span class=separator>&gt;</span>Gallery</div>\n");
        }
        content = content
            .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1')
            .replace(/<\/head>/, function () { return "\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=" + opts.gaID + "\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '" + opts.gaID + "');\n</script>\n</head>\n"; });
        return content;
    }
    BuildGalleryRelease.integrateHtmlWithWebSite = integrateHtmlWithWebSite;
})(BuildGalleryRelease = exports.BuildGalleryRelease || (exports.BuildGalleryRelease = {}));
//# sourceMappingURL=build-gallery-release.js.map