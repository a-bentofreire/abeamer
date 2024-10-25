#!/usr/bin/env node
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
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
 * - create projects:
 * ```shell
 * abeamer create
 * ```
 * - launch a live server:
 * ```shell
 * abeamer serve
 * ```
 * - render the project to disk:
 * ```shell
 * abeamer render
 * ```
 * - create gifs:
 * ```shell
 * abeamer gif
 * ```
 * - create movies:
 * ```shell
 * abeamer movie
 * ```
 * ---------------------
 * ## Examples
 *
 * - Create a TypeScript/JavaScript project.
 * ```shell
 * abeamer create foo --width 720 --height 480 --fps 20
 * ```
 * ---------------------
 * - Create a JavaScript project without TypeScript.
 * ```shell
 * abeamer create foo-js --width 384 --height 288 --fps 30 --no-typescript
 * ```
 * ---------------------
 * - Start the live server on port 9000. The url is `http://localhost:9000/`.
 * ```shell
 * abeamer serve
 * ```
 * ---------------------
 * - Start the live server with list directory option if search part of url is `?dir`.
 * The url is `http://localhost:9000/?dir`.
 * ```shell
 * abeamer serve --list-dir
 * ```
 * ---------------------
 * - Start the live server on port 8000. The url is `http://localhost:8000/`.
 * ```shell
 * abeamer serve --port 8000
 * ```
 * ---------------------
 * - Generate the animations in file image sequences from the project in the current directory.
 * ```shell
 * abeamer render
 * ```
 * ---------------------
 * - Same as above, but deletes the previous images and the project is on directory `foo`.
 * ```shell
 * abeamer render --dp foo
 * ```
 * ---------------------
 * - Same as the first render, but it renders from a live server.
 * Required if it's loading `.json` files or is teleporting.
 * ```shell
 * abeamer render --url http://localhost:9000/foo/index.html
 * ```
 * ---------------------
 * - Generate only the `story.json` file, it doesn't generates the file image sequence.
 * This should be used only for testing. Teleporting should be done from the web browser library,
 * and the teleported story via Ajax to the cloud.
 * ```shell
 * abeamer render --url http://localhost:9000/foo/index.html --teleport
 * ```
 * ---------------------
 * - Same as the first render command, but with verbose logging.
 * ```shell
 * abeamer render --ll 3 --dp foo
 * ```
 * ---------------------
 * - Same as the first render command, but uses slimerjs as the server.
 * NOTE: slimerjs is on alpha version!
 * ```shell
 * abeamer render --server slimerjs foo
 * ```
 * ---------------------
 * - Same as the previous render command, but sets the server executable.
 * ```shell
 * abeamer render --server slimerjs --server-exec ./slimerjs-path/src/slimerjs-node foo
 * ```
 * ---------------------
 * - Create an animated gif from the previous generated image sequence on `foo/story-frames/story.gif`.
 *  Requires that imagemagick `convert` to be on the search path, or set `IM_CONVERT_BIN=<absolute-path-to-executable>`.
 * ```shell
 * abeamer gif foo
 * ```
 * ---------------------
 * - Create an animated gif from the previous generated image sequence on `hello.gif`.
 * ```shell
 * abeamer gif foo --gif hello.gif
 * ```
 * ---------------------
 * - Create an animated gif without looping.
 * ```shell
 * abeamer gif foo --loop 1
 * ```
 * ---------------------
 * - Create an animated gif with a 25% scale frame size of the PNG sequence frame size.
 * ```shell
 * abeamer gif --gif-pre --scale 25% foo
 * ```
 * ---------------------
 * - Create a movie from the previous generated image sequence on `foo/story-frames/movie.mp4`.
 * Requires that `ffmpeg` to be on the search path, or set `FFMPEG_BIN=<absolute-path-to-executable>`.
 * ```shell
 * abeamer movie foo
 * ```
 * ---------------------
 * - Create the movie `foo/story.webm`.
 * ```shell
 * abeamer movie foo --movie foo/story.webm
 * ```
 * ---------------------
 * - Create a movie from the previous generated image sequence using `foo/bkg-movie.mp4` as a background.
 * ```shell
 * abeamer movie foo/ --bkg-movie foo/bkg-movie.mp4
 * ```
 * ---------------------
 * - Create the movie a 50% scale frame size of the PNG sequence frame size.
 * ```shell
 * abeamer movie foo --scale 50%
 * ```
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
    var CMD_CHECK = 'check';
    var CMD_CREATE = 'create';
    var CMD_SERVE = 'serve';
    var CMD_RENDER = 'render';
    var CMD_GIF = 'gif';
    var CMD_MOVIE = 'movie';
    var DEFAULT_GIF_NAME = 'story.gif';
    var DEFAULT_MOVIE_NAME = 'story.mp4';
    var DEFAULT_BACKGROUND = 'white';
    var MANUAL_BACKGROUND = 'manual';
    var logLevel = consts_js_1.Consts.LL_ERROR;
    var isVerbose = false;
    var cmdName = '';
    var cmdParam = '';
    var outArgs = [];
    var isWin = sysProcess.platform === 'win32';
    var argOpts = opts_parser_js_1.OptsParser.argOpts;
    argOpts['port'] = {
        param: 'int', desc: "port for serve command. default is ".concat(DEFAULT_PORT),
    };
    argOpts['gif'] = {
        param: 'string', desc: "output gif filename. default is ".concat(DEFAULT_GIF_NAME),
    };
    argOpts['movie'] = {
        param: 'string', desc: "output movie filename. default is ".concat(DEFAULT_MOVIE_NAME),
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
    argOpts['moviePre'] = {
        param: 'array', allowOption: true, desc: "arguments to be passed to ffmpeg before the arguments passed by abeamer",
    };
    argOpts['moviePost'] = {
        param: 'array', allowOption: true, desc: "arguments to be passed to ffmpeg after the arguments passed by abeamer",
    };
    argOpts['gifPre'] = {
        param: 'array', allowOption: true, desc: "arguments to be passed to gif generator(convert) before the arguments passed by abeamer",
    };
    argOpts['gifPost'] = {
        param: 'array', allowOption: true, desc: "arguments to be passed to gif generator(convert) after the arguments passed by abeamer",
    };
    argOpts['gifBackground'] = {
        param: 'string', desc: "background color used to replace the alpha channel in gif generation.\nif this is value is set to \"".concat(MANUAL_BACKGROUND, "\" , no parameters relating are passed to the gif generator.\ndefault is ").concat(MANUAL_BACKGROUND),
    };
    // ------------------------------------------------------------------------
    //                               Print Usage
    // ------------------------------------------------------------------------
    function printUsage() {
        console.log("abeamer [command] [options] [project-name|report-name]\nThe commands are:\n    ".concat(CMD_CHECK, " checks if the all requirements are installed and configured\n    ").concat(CMD_CREATE, " creates a project with project-name\n    ").concat(CMD_SERVE, "  starts a live server. Use it in case you need to load the config from JSON file\n    ").concat(CMD_RENDER, " runs your project in the context of the headless browser.\n    ").concat(CMD_GIF, "    creates an animated gif from the project-name or report-name\n    ").concat(CMD_MOVIE, "  creates a movie from the project-name or report-name\n\n    e.g.\n      echo \"checks if chrome, puppeteer, imagemagick, ffmpeg are installed and configured\"\n      abeamer ").concat(CMD_CHECK, "\n\n      echo \"create folder foo and copy necessary files\"\n      abeamer ").concat(CMD_CREATE, " --width 640 --height 480 --fps 25 foo\n\n      cd foo\n\n      echo \"start a live server\"\n      echo \"only required if you need to load your configuration from json file\"\n      abeamer ").concat(CMD_SERVE, "\n\n      echo \"generates the png files and a report on story-frames folder\"\n      abeamer ").concat(CMD_RENDER, "\n\n      echo \"creates story.gif file on story-frames folder\"\n      abeamer ").concat(CMD_GIF, "\n\n      echo \"creates story.mp4 file on story-frames folder\"\n      abeamer ").concat(CMD_MOVIE, "\n\n      For more information, read:\n      https://abeamer.devtoix.com/docs/latest/end-user/en/site/abeamer-cli/\n\n"));
        opts_parser_js_1.OptsParser.printUsage();
    }
    // ------------------------------------------------------------------------
    //                               Fix Folder Name
    // ------------------------------------------------------------------------
    // function fixFolderName(folderName: string): string {
    //   folderName = fsix.toPosixSlash(folderName);
    //   if (folderName.search(/^.\/?$/) !== -1) {
    //     sysProcess.cwd()
    //   }
    //   return folderName;
    // }
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
                        console.log("Args: [".concat(args.join('],['), "]"));
                        console.log("Current Path: ".concat(sysProcess.cwd()));
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
            console.log("spawn cmdLine: ".concat(cmdLine));
            console.log("args: ".concat(args.join(' ')));
        }
        var ls = (0, child_process_1.spawn)(cmdLine, args);
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
        ls.on('close', function (_code) {
            callback();
        });
    }
    // ------------------------------------------------------------------------
    //                                Command: Check
    // ------------------------------------------------------------------------
    function commandCheck() {
        var checkCount = 0;
        var TOTAL_CHECK_COUNT = 5;
        function displayCheck(what, passed, failedMsg) {
            checkCount++;
            console.log("".concat(checkCount, ". Check: ").concat(what, " --> ").concat(passed ? 'OK' : 'Failed'));
            if (!passed) {
                console.log('  TODO:' + failedMsg + '\n');
            }
            if (checkCount === TOTAL_CHECK_COUNT) {
                console.log('\n');
            }
        }
        function addToStartUp(passed, key, value, failedMsg) {
            displayCheck("".concat(key, "=").concat(value), passed, "\n    ".concat(failedMsg, "\n    Add to the shell startup script:\n").concat(isWin ? 'SET' : 'export', " ").concat(key, "=").concat(value));
        }
        function checkProgramIsValid(envKey, appName, versionParam, matchRegEx, requireMsg) {
            function displayResult(passed) {
                displayCheck(appName, passed, "\n    ABeamer requires ".concat(requireMsg, "\n    Either add the executable to the system path, or add to the shell startup script:\n").concat(isWin ? 'set' : 'export', " ").concat(envKey, "=<absolute-path-to-").concat(appName, ">"));
            }
            var envValue = sysProcess.env[envKey];
            if (!envValue) {
                fsix_js_1.fsix.runExternal("".concat(appName, " ").concat(versionParam), function (_error, stdout, stderr) {
                    displayResult(stderr === '' && stdout.match(matchRegEx));
                });
            }
            else {
                displayResult(sysFs.existsSync(envValue));
            }
        }
        console.log("\nChecking:\n");
        addToStartUp((sysProcess.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] || '').toLowerCase() === 'true', 'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD', 'TRUE', 'by default puppeteer downloads Chromium which is doesn\'t support many features');
        var chromeBin = sysProcess.env['CHROME_BIN'];
        if (!chromeBin) {
            addToStartUp(false, 'CHROME_BIN', '<chrome-path>', 'puppeteer uses by default Chromium, set CHROME_BIN with the absolute path to chrome web browser executable');
        }
        else {
            addToStartUp(sysFs.existsSync(chromeBin), 'CHROME_BIN', '<chrome-path>', 'CHROME_BIN points to a missing chrome executable');
        }
        checkProgramIsValid('FFMPEG_BIN', 'ffmpeg', '-version', /ffmpeg version/, 'ffmpeg to generate movies');
        checkProgramIsValid('IM_CONVERT_BIN', 'convert', '--version', /Version: ImageMagick/, 'ImageMagick convert program to generate gifs');
        var puppeteer;
        try {
            puppeteer = require('puppeteer');
        }
        catch (error) {
        }
        displayCheck('puppeteer', puppeteer, "\n   ABeamer requires puppeteer. Install using the following command\nnpm i puppeteer");
    }
    // ------------------------------------------------------------------------
    //                                Command: Create
    // ------------------------------------------------------------------------
    function commandCreate() {
        var projName = fsix_js_1.fsix.toPosixSlash(cmdParam);
        if (!projName) {
            throw "Missing project name";
        }
        if (projName[0] === '-' || projName.search(/[\"\'\?\*\+]/) !== -1
            || projName.search(/^[\.\/]+$/) !== -1) {
            throw "Error: ".concat(projName, " is not valid project name");
        }
        if (sysFs.existsSync(projName)) {
            throw "Error: Project ".concat(projName, " already exists");
        }
        if (projName.includes('/')) {
            var dirname = sysPath.posix.dirname(projName);
            fsix_js_1.fsix.mkdirpSync(dirname);
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
                    text = text.replace(/createStory\([^)]*\)/, "createStory(/*FPS:*/".concat(fps, ")"));
                    break;
                case 'abeamer.ini':
                    text = text.replace(/width:\s*\d+/, "width: ".concat(width))
                        .replace(/height:\s*\d+/, "height: ".concat(height));
                    break;
                case 'main.min.css':
                    text = text.replace(/.abeamer-scene{width:\d+px;height:\d+px}/, ".abeamer-scene{width:".concat(width, "px;height:").concat(height, "px}"));
                    break;
                case 'index.html':
                    // inserts the plugins.
                    if (!noPlugins) {
                        var plugins_1 = fsix_js_1.fsix.loadJsonSync("".concat(ROOT_PATH, "/client/lib/plugins/plugins-list.json"));
                        var pre_1 = '';
                        var post_1 = '';
                        text.replace(/^(.*)js\/abeamer\.min\.js(.*)$/m, function (_app, _pre, _post) {
                            pre_1 = _pre;
                            post_1 = _post;
                            return '';
                        });
                        text = text.replace(/^(.*js\/main\.js.*)$/m, function (all) {
                            return "\n          <!-- remove the unnecessary plugins -->\n"
                                + plugins_1.map(function (plugin) { return "".concat(pre_1, "plugins/").concat(plugin, "/").concat(plugin, ".js").concat(post_1); }).join('\n')
                                + '\n\n' + all;
                        });
                    }
                    break;
            }
            return text;
        }, function (fileBase) {
            if (noTypescript && fileBase.match(/(?:js\.map|\.ts|tsconfig\.json)$/)) {
                return false;
            }
            return true;
        });
        copyTree(LIB_PATH, "".concat(projName, "/abeamer"), undefined, function (fileBase) {
            if (noTypescript && fileBase.match(/(?:typings|\.ts)$/)) {
                return false;
            }
            if (noPlugins && fileBase.match(/plugins$/)) {
                return false;
            }
            return !fileBase.match(/plugins-list\.json$/);
        });
        if (logLevel > consts_js_1.Consts.LL_SILENT) {
            console.log("Project ".concat(projName, " created.\n- frame-width: ").concat(width, "px\n- frame-height: ").concat(height, "px\n- fps: ").concat(fps, "\nTo modify the the frame dimensions, edit [abeamer.ini] and recompile the [css/main.scss] file.\nTo modify the fps, edit the [js/main.ts] file.\n"));
        }
    }
    /**
     * Copies a tree structure from the `src` to `dst`,
     * allowing to modify the content via `onCopyText` callback,
     * and determine if copying a certain file or folder is allowed via `allowCopy`.
     */
    function copyTree(srcPath, dstPath, onCopyText, allowCopy) {
        if (isVerbose) {
            console.log("Copying Directory ".concat(srcPath, " to ").concat(dstPath));
        }
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.readdirSync(srcPath).forEach(function (fileBase) {
            if (allowCopy && !allowCopy(fileBase)) {
                return;
            }
            var srcFileName = "".concat(srcPath, "/").concat(fileBase);
            var dstFileName = "".concat(dstPath, "/").concat(fileBase);
            var stats = sysFs.statSync(srcFileName);
            if (stats.isFile()) {
                if (isVerbose) {
                    console.log("Copying ".concat(srcFileName, " to ").concat(dstFileName));
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
            console.log("Serving on http://localhost:".concat(port, "/"));
            if (allowDirListing) {
                console.log("Directory listing on http://localhost:".concat(port, "/?dir"));
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
            throw "Unknown ".concat(serverName);
        }
        // if use hasn't provided the folder name nor config file
        if (!cmdParam && !argOpts.config.value && !argOpts.url.value) {
            outArgs.push('.');
        }
        // adding this suffix, it solves the conflict of slimerjs `--config`.
        // the `opt-parser.ts` will remove this extra suffix during parsing the name
        var configArgIndex = outArgs.indexOf('--config');
        if (configArgIndex !== -1) {
            outArgs[configArgIndex] = outArgs[configArgIndex] + '__2';
        }
        outArgs.splice(0, 0, "".concat(fsix_js_1.fsix.toPosixSlash(__dirname), "/../server/server-agent-").concat(serverName, ".js"));
        var cmdLine = argOpts.serverExec.value ||
            (rel_consts_js_1.RelConsts.NODE_SERVERS.indexOf(serverName) === -1 ? serverName : 'node');
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
            console.log("reportFileName: ".concat(reportFileName));
            console.log("realReportFileName: ".concat(realReportFileName));
        }
        if (!sysFs.existsSync(reportFileName)) {
            throw "Report file ".concat(reportFileName, " doesn't exist");
        }
        var report = fsix_js_1.fsix.loadJsonSync(reportFileName);
        report.dirname = sysPath.dirname(reportFileName);
        if (isVerbose) {
            console.log("report path: ".concat(report.dirname));
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
            || "".concat(report.dirname, "/").concat(DEFAULT_GIF_NAME);
        var toOptimize = true;
        var cmdLine = sysProcess.env['IM_CONVERT_BIN'] || 'convert';
        var args = ['-delay', "1x".concat(report.fps)];
        var scale = opts_parser_js_1.OptsParser.computeScale(report.width, report.height);
        if (scale) {
            args.push('-scale', scale.join('x'));
        }
        var loop = argOpts['loop'].value || '0';
        args.push('-loop', loop);
        if (toOptimize) {
            args.push('-strip', '-layers', 'optimize');
            var gifBackground = argOpts['gifBackground'].value || DEFAULT_BACKGROUND;
            if (gifBackground !== MANUAL_BACKGROUND) {
                args.push('-background', gifBackground, '-alpha', 'remove');
            }
        }
        args.push(report.framespattern.replace(/\%\d*d/, '*'), gifFileName);
        if (argOpts['gifPre'].multipleValue) {
            args = __spreadArray(__spreadArray([], argOpts['gifPre'].multipleValue, true), args, true);
        }
        if (argOpts['gifPost'].multipleValue) {
            args = __spreadArray(__spreadArray([], args, true), argOpts['gifPost'].multipleValue, true);
        }
        if (isVerbose) {
            console.log("\n".concat(cmdLine, " ").concat(args.join(' '), "\n"));
        }
        runSpawn(cmdLine, args, function () {
            if (logLevel > consts_js_1.Consts.LL_SILENT) {
                console.log("Created gif ".concat(gifFileName));
            }
        });
    }
    // ------------------------------------------------------------------------
    //                                Command: Movie
    // ------------------------------------------------------------------------
    function commandMovie() {
        var report = getReport();
        var movieFileName = argOpts['movie'].value
            || "".concat(report.dirname, "/").concat(DEFAULT_MOVIE_NAME);
        var bkgMovieFileName = argOpts['bkgMovie'].value;
        var cmdLine = sysProcess.env['FFMPEG_BIN'] || 'ffmpeg';
        var scale = opts_parser_js_1.OptsParser.computeScale(report.width, report.height);
        var args = [
            '-r', report.fps.toString(),
            '-f', 'image2',
        ];
        if (!scale) {
            args.push('-s', "".concat(report.width, "x").concat(report.height));
        }
        args.push('-i', report.framespattern, '-y');
        if (scale) {
            args.push('-vf', "scale=".concat(scale.join('x')));
        }
        /* spell-checker: disable */
        if (bkgMovieFileName) {
            args.push('-vf', "movie=".concat(bkgMovieFileName, ",hue=s=1[bg];[in]setpts=PTS,scale=-1:-1")
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
        if (argOpts['moviePre'].multipleValue) {
            args = __spreadArray(__spreadArray([], argOpts['moviePre'].multipleValue, true), args, true);
        }
        if (argOpts['moviePost'].multipleValue) {
            args = __spreadArray(__spreadArray([], args, true), argOpts['moviePost'].multipleValue, true);
        }
        if (isVerbose) {
            console.log("\next: ".concat(ext, "\n"));
            console.log("cmdLine:[".concat(cmdLine, " ").concat(args.join(' '), "]\n\n"));
        }
        runSpawn(cmdLine, args, function () {
            if (logLevel > consts_js_1.Consts.LL_SILENT) {
                console.log("Created movie ".concat(movieFileName));
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
                    console.log("Run Command: ".concat(cmdName));
                }
                switch (cmdName) {
                    case CMD_CHECK:
                        commandCheck();
                        break;
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
                        throw "Unknown command ".concat(cmdName);
                }
                break;
        }
    }
    try {
        main();
    }
    catch (err) {
        console.error(err.message || err.toString());
    }
})(Cli || (Cli = {}));
//# sourceMappingURL=abeamer-cli.js.map