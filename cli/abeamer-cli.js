#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: b88b17e7-5918-44f7-82f7-f0e80c242a82
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// @TODO: implement inject plugins
var sysFs = require("fs");
var sysPath = require("path");
var sysProcess = require("process");
var child_process_1 = require("child_process");
var opts_parser_js_1 = require("../shared/opts-parser.js");
var fsix_js_1 = require("../shared/vendor/fsix.js");
var version_js_1 = require("../shared/version.js");
var consts_js_1 = require("../shared/lib/consts.js");
var rel_consts_js_1 = require("../shared/rel-consts.js");
var http_server_ex_js_1 = require("../shared/vendor/http-server-ex.js");
// @doc-name Command Line
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * **ABeamer** command line utility is used to:
 *
 * 1. create projects: `abeamer create`.
 * 2. launch a live server: `abeamer serve`.
 * 3. render the project to disk: `abeamer render`.
 * 4. create gifs: `abeamer gif`.
 * 5. create movies: `abeamer movie`.
 *
 * ## Examples
 *
 *  Creates a TypeScript/JavaScript project.
 *  `abeamer create foo --width 720 --height 480 --fps 20`.
 *
 *  Creates a JavaScript project without TypeScript.
 *  `abeamer create foo-js --width 384 --height 288 --fps 30 --no-typescript`.
 *
 *  Starts the live server.
 * `abeamer serve`.
 *
 *  Starts the live server with list directory option if search part of url is `?dir`.
 * `abeamer serve --list-dir`.
 *
 *  Generate the animations in file image sequences and deletes the previous images.
 * `abeamer render --dp foo`.
 *
 *  Same as above, but it outputs detailed information about what is happening.
 * `abeamer render --ll 3 --dp foo`.
 *
 *  Creates an animated gif from the previous generated image sequence on `foo/story-frames/story.gif`.
 * `abeamer gif foo/`.
 *
 *  Creates an animated gif from the previous generated image sequence on `hello.gif`.
 * `abeamer gif foo/ --gif hello.gif`.
 *
 *  Creates an animated gif without looping.
 * `abeamer gif foo/ --loop 1`.
 *
 *  Creates a movie from the previous generated image sequence on `foo/story-frames/movie.mp4`.
 * `abeamer movie foo/`.
 *
 *  Creates the movie `foo/story.webm`.
 * `abeamer movie foo/ --movie foo/story.webm`.
 *
 *  Creates a movie from the previous generated image sequence using `foo/bkg-movie.mp4` as a background.
 * `abeamer movie foo/ --bkg-movie foo/bkg-movie.mp4`.
 */
var Cli;
(function (Cli) {
    // ------------------------------------------------------------------------
    //                               Global Vars
    // ------------------------------------------------------------------------
    var DO_PRINT_USAGE = 0;
    var DO_RUN_COMMAND = 1;
    var DO_EXIT = 2;
    var DEFAULT_PORT = 9000;
    var CMD_CREATE = 'create';
    var CMD_SERVE = 'serve';
    var CMD_RENDER = 'render';
    var CMD_GIF = 'gif';
    var CMD_MOVIE = 'movie';
    var DEFAULT_GIF_NAME = 'story.gif';
    var DEFAULT_MOVIE_NAME = 'story.mp4';
    var logLevel = consts_js_1.Consts.LL_ERROR;
    var isVerbose = false;
    var cmdName = '';
    var cmdParam = '';
    var outArgs = [];
    var argOpts = opts_parser_js_1.OptsParser.argOpts;
    argOpts['port'] = {
        param: 'int', desc: "port for serve command. default is " + DEFAULT_PORT,
    };
    argOpts['gif'] = {
        param: 'string', desc: "output gif filename. default is " + DEFAULT_GIF_NAME,
    };
    argOpts['movie'] = {
        param: 'string', desc: "output movie filename. default is " + DEFAULT_MOVIE_NAME,
    };
    argOpts['bkgMovie'] = {
        param: 'string', desc: "movie filename to be used as background to blend with transparent images",
    };
    argOpts['noPlugins'] = {
        desc: "creates a project without plugins",
    };
    argOpts['noTypescript'] = {
        desc: "creates a project without TypeScript files",
    };
    argOpts['listDir'] = {
        desc: "serve command lists the directory contents if url has the querystring '?dir'",
    };
    argOpts['loop'] = {
        param: 'string', desc: "defines how many times a gif will loop. set to -1 if you don't won't it to loop",
    };
    // ------------------------------------------------------------------------
    //                               Print Usage
    // ------------------------------------------------------------------------
    function printUsage() {
        console.log("abeamer [command] [options] [project-name|report-name]\nThe commands are:\n    " + CMD_CREATE + " creates a project with project-name\n    " + CMD_SERVE + "  starts a live server. Use it in case you need to load the config from JSON file\n    " + CMD_RENDER + " runs your project in the context of the headless browser.\n    " + CMD_GIF + "    creates an animated gif from the project-name or report-name\n    " + CMD_MOVIE + "  creates a movie from the project-name or report-name\n\n    e.g.\n      echo \"create folder foo and copy necessary files\"\n      abeamer " + CMD_CREATE + " --width 640 --height 480 --fps 25 foo\n\n      cd foo\n\n      echo \"start a live server\"\n      echo \"only required if you need to load your configuration from json file\"\n      abeamer " + CMD_SERVE + "\n\n      echo \"generates the png files and a report on story-frames folder\"\n      abeamer " + CMD_RENDER + "\n\n      echo \"creates story.gif file on story-frames folder\"\n      abeamer " + CMD_GIF + "\n\n      echo \"creates story.mp4 file on story-frames folder\"\n      abeamer " + CMD_MOVIE + "\n\n      For more information, read:\n      https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/abeamer-cli/\n\n");
        opts_parser_js_1.OptsParser.printUsage();
    }
    // ------------------------------------------------------------------------
    //                               Parse Arguments
    // ------------------------------------------------------------------------
    function parseArguments() {
        var args = sysProcess.argv;
        var argI = 1;
        // @TODO: Improve this code
        while (args[argI - 1].search(/abeamer/) === -1) {
            argI++;
        }
        cmdName = args[argI++];
        if (!cmdName) {
            return DO_PRINT_USAGE;
        }
        else if (cmdName === '--version') {
            console.log(version_js_1.VERSION);
            return DO_EXIT;
        }
        return opts_parser_js_1.OptsParser.iterateArgOpts(true, function () { return args[argI++]; }, function (option, value) {
            switch (option) {
                case '@param':
                    cmdParam = value;
                    outArgs.push(cmdParam);
                    return;
                case 'version':
                    console.log(version_js_1.VERSION);
                    return DO_EXIT;
                case 'll':
                    logLevel = value;
                    isVerbose = logLevel >= consts_js_1.Consts.LL_VERBOSE;
                    if (isVerbose) {
                        console.log("Args: [" + args.join('],[') + "]");
                        console.log("Current Path: " + sysProcess.cwd());
                    }
                    break;
            }
            switch (cmdName) {
                case CMD_RENDER:
                    outArgs.push('--' + option);
                    if (value) {
                        /* if (OptsParser.argOpts[option].param === 'string') {
                          value = `"${value}"`;
                        } */
                        outArgs.push(value);
                    }
                    break;
            }
        }) || DO_RUN_COMMAND;
    }
    // ------------------------------------------------------------------------
    //                               Runs External Commands
    // ------------------------------------------------------------------------
    function runSpawn(cmdLine, args, callback) {
        if (isVerbose) {
            console.log("spawn cmdLine: " + cmdLine);
            console.log("args: " + args.join(' '));
        }
        var ls = child_process_1.spawn(cmdLine, args);
        ls.stdout.on('data', function (data) {
            if (logLevel >= consts_js_1.Consts.LL_SILENT) {
                console.log(data.toString());
            }
        });
        ls.stderr.on('data', function (data) {
            if (logLevel >= consts_js_1.Consts.LL_SILENT) {
                console.error(data.toString());
            }
        });
        ls.on('close', function (code) {
            callback();
        });
    }
    // ------------------------------------------------------------------------
    //                                Command: Create
    // ------------------------------------------------------------------------
    function commandCreate() {
        var projName = fsix_js_1.fsix.toPosixSlash(cmdParam);
        if (projName === '' || projName[0] === '-'
            || projName.search(/[\\\/\?\*\+]/) !== -1) {
            throw "Error: " + projName + " is not valid project name";
        }
        if (!sysFs.existsSync(projName)) {
            throw "Error: Project " + projName + " already exists";
        }
        var ROOT_PATH = fsix_js_1.fsix.toPosixSlash(__dirname) + '/..';
        var TEMPLATE_PATH = ROOT_PATH + '/gallery/hello-world';
        var LIB_PATH = ROOT_PATH + '/client/lib';
        var width = argOpts.width.value || rel_consts_js_1.RelConsts.DEFAULT_WIDTH;
        var height = argOpts.height.value || rel_consts_js_1.RelConsts.DEFAULT_HEIGHT;
        var fps = argOpts.fps.value || rel_consts_js_1.RelConsts.DEFAULT_FPS;
        var noPlugins = argOpts['noPlugins'].hasOption;
        var noTypescript = argOpts['noTypescript'].hasOption;
        copyTree(TEMPLATE_PATH, projName, function (text, fileName) {
            var fileBase = sysPath.basename(fileName);
            switch (fileBase) {
                case 'main.js':
                case 'main.ts':
                    if (noTypescript) {
                        text = text.replace(/^.*sourceMappingURL=.*$/m, '');
                    }
                    text = text.replace(/createStory\([^)]*\)/, "createStory(/*FPS:*/" + fps + ")");
                    break;
                case 'abeamer.ini':
                    text = text.replace(/width:\s*\d+/, "width: " + width)
                        .replace(/height:\s*\d+/, "height: " + height);
                    break;
                case 'main.min.css':
                    text = text.replace(/.abeamer-scene{width:\d+px;height:\d+px}/, ".abeamer-scene{width:" + width + "px;height:" + height + "px}");
                    break;
                case 'index.html':
                    // inserts the plugins.
                    if (!noPlugins) {
                        var plugins_1 = fsix_js_1.fsix.loadJsonSync(ROOT_PATH + "/client/lib/plugins/plugins-list.json");
                        var pre_1 = '';
                        var post_1 = '';
                        text.replace(/^(.*)js\/abeamer\.min\.js(.*)$/m, function (app, _pre, _post) {
                            pre_1 = _pre;
                            post_1 = _post;
                            return '';
                        });
                        text = text.replace(/^(.*js\/main\.js.*)$/m, function (all) {
                            return "\n          <!-- remove the unnecessary plugins -->\n"
                                + plugins_1.map(function (plugin) { return pre_1 + "plugins/" + plugin + "/" + plugin + ".js" + post_1; }).join('\n')
                                + '\n\n' + all;
                        });
                    }
                    // readjusts file paths
                    text = text.replace(/\.\.\/\.\.\/client\/lib/g, 'abeamer');
                    break;
            }
            return text;
        }, function (fileBase) {
            if (noTypescript && fileBase.match(/(?:js\.map|\.ts|tsconfig\.json)$/)) {
                return false;
            }
            return true;
        });
        copyTree(LIB_PATH, projName + "/abeamer", undefined, function (fileBase) {
            if (noTypescript && fileBase.match(/(?:typings|\.ts)$/)) {
                return false;
            }
            if (noPlugins && fileBase.match(/plugins$/)) {
                return false;
            }
            return !fileBase.match(/plugins-list\.json$/);
        });
        if (logLevel > consts_js_1.Consts.LL_SILENT) {
            console.log("Project " + projName + " created");
        }
    }
    /**
     * Copies a tree structure from the `src` to `dst`,
     * allowing to modify the content via `onCopyText` callback,
     * and determine if copying a certain file or folder is allowed via `allowCopy`.
     */
    function copyTree(srcPath, dstPath, onCopyText, allowCopy) {
        if (isVerbose) {
            console.log("Copying Directory " + srcPath + " to " + dstPath);
        }
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.readdirSync(srcPath).forEach(function (fileBase) {
            if (allowCopy && !allowCopy(fileBase)) {
                return;
            }
            var srcFileName = srcPath + "/" + fileBase;
            var dstFileName = dstPath + "/" + fileBase;
            var stats = sysFs.statSync(srcFileName);
            if (stats.isFile()) {
                if (isVerbose) {
                    console.log("Copying " + srcFileName + " to " + dstFileName);
                }
                var data = fsix_js_1.fsix.readUtf8Sync(srcFileName);
                if (onCopyText) {
                    data = onCopyText(data, fileBase);
                }
                sysFs.writeFileSync(dstFileName, data);
            }
            else if (stats.isDirectory()) {
                copyTree(srcFileName, dstFileName, onCopyText, allowCopy);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               Serve
    // ------------------------------------------------------------------------
    function commandServe() {
        var hasMarked = sysFs.existsSync(sysPath.posix.join(__dirname, '../node_modules/marked/bin/marked'));
        var hasHighlightJs = sysFs.existsSync(sysPath.posix.join(__dirname, '../node_modules/highlight.js/lib/index.js'));
        var port = argOpts['port'].value || DEFAULT_PORT;
        var allowDirListing = argOpts['listDir'].hasOption;
        new http_server_ex_js_1.HttpServerEx.ServerEx(port, isVerbose, 'EXIT_SERVER', allowDirListing, hasMarked, hasHighlightJs).start();
        if (logLevel >= consts_js_1.Consts.LL_SILENT) {
            if (hasMarked) {
                console.log("Using markdown compiler");
            }
            console.log("Serving on http://localhost:" + port + "/");
            if (allowDirListing) {
                console.log("Directory listing on http://localhost:" + port + "/?dir");
            }
        }
    }
    // ------------------------------------------------------------------------
    //                                Command: Render
    // ------------------------------------------------------------------------
    function commandRender() {
        var serverName = (opts_parser_js_1.OptsParser.argOpts.server.value
            || rel_consts_js_1.RelConsts.DEFAULT_SERVER).toLowerCase();
        if (rel_consts_js_1.RelConsts.SUPPORTED_SERVERS.indexOf(serverName) === -1) {
            throw "Unknown " + serverName;
        }
        // if use hasn't provided the folder name nor config file
        if (!cmdParam && !argOpts.config.value) {
            outArgs.push('.');
        }
        outArgs.splice(0, 0, fsix_js_1.fsix.toPosixSlash(__dirname) + "/../server/server-agent-" + serverName + ".js");
        var cmdLine = rel_consts_js_1.RelConsts.NODE_SERVERS.indexOf(serverName) === -1
            ? serverName : 'node';
        runSpawn(cmdLine, outArgs, function () {
            if (logLevel > consts_js_1.Consts.LL_SILENT) {
                console.log("Server finished");
            }
        });
    }
    function getReport() {
        var reportFileName = fsix_js_1.fsix.toPosixSlash(cmdParam || '.');
        var realReportFileName = sysPath.posix.join(reportFileName, 'story-frames/frame-report.json');
        // in case the user param is the project folder
        if (sysFs.existsSync(realReportFileName)) {
            reportFileName = realReportFileName;
        }
        if (isVerbose) {
            console.log("reportFileName: " + reportFileName);
            console.log("realReportFileName: " + realReportFileName);
        }
        if (!sysFs.existsSync(reportFileName)) {
            throw "Report file " + reportFileName + " doesn't exist";
        }
        var report = fsix_js_1.fsix.loadJsonSync(reportFileName);
        report.dirname = sysPath.dirname(reportFileName);
        if (isVerbose) {
            console.log("report path: " + report.dirname);
        }
        // handle relative paths
        if (report.framespattern.substr(0, 2) === './') {
            report.framespattern = report.dirname + '/' + report.framespattern.substr(2);
        }
        return report;
    }
    // ------------------------------------------------------------------------
    //                                Command: Gif
    // ------------------------------------------------------------------------
    function commandGif() {
        var report = getReport();
        var gifFileName = argOpts['gif'].value
            || report.dirname + "/" + DEFAULT_GIF_NAME;
        var toOptimize = true;
        var cmdLine = 'convert';
        var args = ['-delay', "1x" + report.fps];
        var loop = argOpts['loop'].value || '0';
        args.push('-loop', loop);
        if (toOptimize) {
            args.push('-strip', '-layers', 'optimize', '-alpha', 'deactivate');
        }
        args.push(report.framespattern.replace(/\%\d*d/, '*'), gifFileName);
        if (isVerbose) {
            console.log("\n" + cmdLine + " " + args.join(' ') + "\n");
        }
        runSpawn(cmdLine, args, function () {
            if (logLevel > consts_js_1.Consts.LL_SILENT) {
                console.log("Created gif " + gifFileName);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                                Command: Movie
    // ------------------------------------------------------------------------
    function commandMovie() {
        var report = getReport();
        var movieFileName = argOpts['movie'].value
            || report.dirname + "/" + DEFAULT_MOVIE_NAME;
        var bkgMovieFileName = argOpts['bkgMovie'].value;
        var cmdLine = 'ffmpeg';
        var args = ['-r', report.fps.toString(), '-f', 'image2',
            '-s', report.width + "x" + report.height,
            '-i', report.framespattern,
            '-y',
        ];
        /* spell-checker: disable */
        if (bkgMovieFileName) {
            args.push('-vf', "movie=" + bkgMovieFileName + ",hue=s=1[bg];[in]setpts=PTS,scale=-1:-1"
                + ",pad=iw:ih:0:0:color=yellow[m]; [bg][m]overlay=shortest=1:x=0:y=0");
        }
        var ext = sysPath.extname(movieFileName);
        var codec = '';
        switch (ext) {
            case '.mp4':
                codec = 'libx264';
                break;
            case '.webm':
                codec = 'libvpx-vp9';
                break;
        }
        if (codec) {
            args.push('-vcodec', codec);
        }
        args.push(movieFileName);
        if (isVerbose) {
            console.log("\next: " + ext + "\n");
            console.log("cmdLine:[" + cmdLine + " " + args.join(' ') + "]\n\n");
        }
        runSpawn(cmdLine, args, function () {
            if (logLevel > consts_js_1.Consts.LL_SILENT) {
                console.log("Created movie " + movieFileName);
            }
        });
    }
    // ------------------------------------------------------------------------
    //                               Main Body
    // ------------------------------------------------------------------------
    function main() {
        switch (parseArguments()) {
            case DO_PRINT_USAGE:
                printUsage();
                break;
            case DO_RUN_COMMAND:
                if (isVerbose) {
                    console.log("Run Command: " + cmdName);
                }
                switch (cmdName) {
                    case CMD_CREATE:
                        commandCreate();
                        break;
                    case CMD_SERVE:
                        commandServe();
                        break;
                    case CMD_RENDER:
                        commandRender();
                        break;
                    case CMD_GIF:
                        commandGif();
                        break;
                    case CMD_MOVIE:
                        commandMovie();
                        break;
                    default:
                        throw "Unknown command " + cmdName;
                }
                break;
        }
    }
    try {
        main();
    }
    catch (err) {
        console.log(err);
    }
})(Cli || (Cli = {}));
//# sourceMappingURL=abeamer-cli.js.map