"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerAgent = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Base server class for other servers agents
/** @module internal | This module is to be read only by developers */
// @WARN: Don't import any nodejs modules nor
// any other modules depending on node modules since it can be called by phantomjs
var version_js_1 = require("../shared/version.js");
var rel_consts_js_1 = require("../shared/rel-consts.js");
var consts_js_1 = require("../shared/lib/consts.js");
var opts_parser_js_1 = require("../shared/opts-parser.js");
var server_consts_js_1 = require("../shared/lib/server-consts.js");
var sprintf_js_1 = require("../shared/lib/sprintf.js");
var plugin_injector_js_1 = require("./plugin-injector.js");
/**
 * ## Description
 *
 * A **Render Server Agent** executes a server render, usually a headless web browser,
 * sends order to start rendering, captures the render and saves it into a file.
 *
 */
var ServerAgent;
(function (ServerAgent) {
    var sc = server_consts_js_1.ServerConsts._SRV_CNT;
    var sprintf = sprintf_js_1.Sprintf.sprintf;
    // ------------------------------------------------------------------------
    //                               Consts
    // ------------------------------------------------------------------------
    var DO_PRINT_USAGE = 0;
    var DO_RUN_SERVER = 1;
    var DO_EXIT = 2;
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    function toPosixSlash(path) {
        return path.replace(/\\/g, '/');
    }
    ServerAgent.toPosixSlash = toPosixSlash;
    /** Simple implementation of path.dirname()
     *  PhantomJs/SlimerJS don't support nodejs filesystem
     */
    function dirName(filename) {
        var lastSlash = filename.lastIndexOf('/');
        return lastSlash === -1 ? '.' : filename.substr(0, lastSlash);
    }
    // this function is credited to @Flygenring
    // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    function getLocalISOTimeDate() {
        var tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
        return (new Date(Date.now() - tzOffset)).toISOString().substr(0, 19).replace('T', ' ');
    }
    // ------------------------------------------------------------------------
    //                               Server
    // ------------------------------------------------------------------------
    var toExitOnError = true;
    var isFirstFrame = true;
    var BaseServer = /** @class */ (function () {
        function BaseServer(serverName, args, platform, cwd, existsSync, isDirectory, unlinkSync, mkdirpSync, readUtf8Sync, writeFileSync, posixPathJoin) {
            var _this = this;
            this.serverName = serverName;
            this.args = args;
            this.platform = platform;
            this.cwd = cwd;
            this.existsSync = existsSync;
            this.isDirectory = isDirectory;
            this.unlinkSync = unlinkSync;
            this.mkdirpSync = mkdirpSync;
            this.readUtf8Sync = readUtf8Sync;
            this.writeFileSync = writeFileSync;
            this.posixPathJoin = posixPathJoin;
            this.reportFileName = opts_parser_js_1.OptsParser.DEFAULT_OUT_REPORT;
            this.width = rel_consts_js_1.RelConsts.DEFAULT_WIDTH;
            this.hasArgWidth = false;
            this.height = rel_consts_js_1.RelConsts.DEFAULT_HEIGHT;
            this.hasArgHeight = false;
            this.timeout = 0;
            this.maxWidth = opts_parser_js_1.OptsParser.DEFAULT_MAX_WIDTH;
            this.maxHeight = opts_parser_js_1.OptsParser.DEFAULT_MAX_HEIGHT;
            this.maxFps = opts_parser_js_1.OptsParser.DEFAULT_MAX_FPS;
            this.maxFrameCount = opts_parser_js_1.OptsParser.DEFAULT_MAX_FRAME_COUNT;
            this.progress = opts_parser_js_1.OptsParser.DEFAULT_PROGRESS;
            this.url = '';
            this.framesPattern = '';
            this.projDir = '';
            this.fps = 1;
            this.logLevel = consts_js_1.Consts.LL_WARN;
            this.isVerbose = false;
            this.toDeletePreviousVersion = false;
            this.toGenFrames = true;
            this.toTeleport = false;
            this.rootPath = '';
            this.configPath = '';
            this.frameNr = 0;
            this.frameCount = 0;
            this.configFileMode = false;
            this.getViewport = function () {
                var viewport = {
                    width: _this.width,
                    height: _this.height,
                };
                if (_this.isVerbose) {
                    console.log("width: ".concat(viewport.width, ", height: ").concat(viewport.height));
                }
                return viewport;
            };
        }
        BaseServer.prototype.exitServer = function (_retValue) {
            if (_retValue === void 0) { _retValue = 0; }
            if (this.logLevel) {
                console.log("Terminating Server");
            }
        };
        BaseServer.prototype.getSetupVars = function () {
            var _this = this;
            return this.argsVars ?
                (Object.keys(this.argsVars).map(function (key) {
                    return sc.RENDER_VAR_SUFFIX + encodeURIComponent("".concat(key, "=").concat(_this.argsVars[key]));
                }).join('&') + '&') : '';
        };
        BaseServer.prototype.getPageUrl = function () {
            var pageUrl = this.url
                + (this.url.indexOf('?') === -1 ? '?' : '&')
                + sc.LOG_LEVEL_SUFFIX + this.logLevel + '&'
                + (this.hasArgWidth ? "".concat(sc.WIDTH_SUFFIX).concat(this.width, "&") : '')
                + (this.hasArgHeight ? "".concat(sc.HEIGHT_SUFFIX).concat(this.height, "&") : '')
                + this.getSetupVars()
                + sc.TELEPORT_SUFFIX + this.toTeleport.toString();
            // since this is an fundamental information it should always display
            // even not on verbose mode.
            if (this.logLevel !== 0) {
                console.log("serverless pageUrl: [".concat(pageUrl, "]"));
            }
            // adds the server in separated so it can have a serverless link
            pageUrl += '&' + sc.SERVER_SUFFIX + this.serverName;
            // since this is an fundamental information it should always display
            // even not on verbose mode.
            if (this.logLevel !== 0) {
                console.log("pageUrl: [".concat(pageUrl, "]"));
            }
            return pageUrl;
        };
        /** .json configuration parser */
        BaseServer.prototype.parseJsonConfig = function (args, cfg, configFileName, argI) {
            var _this = this;
            var cfgConfigData = cfg['config'];
            if (cfgConfigData) {
                var pCfg_1 = cfgConfigData['abeamer'];
                if (pCfg_1) {
                    args.splice(0, argI + 1);
                    argI = 0;
                    this.projDir = this.projDir || dirName(configFileName);
                    Object.keys(pCfg_1).forEach(function (key) {
                        switch (key) {
                            case 'plugins':
                                plugin_injector_js_1.PluginInjector.plugins = pCfg_1[key] || [];
                                break;
                            case 'file':
                            case 'report':
                            case 'fps':
                            case 'out':
                            // @WARN: Due security reasons:
                            //  config can't not contain max-width, max-height, max-frame-count, max-fps,
                            // since these values can be part of a story teleported from the user.
                            case 'height':
                            case 'width':
                                args.push('--' + key, pCfg_1[key].toString().
                                    replace('__PROJDIR__', _this.projDir));
                                break;
                        }
                    });
                }
            }
            return argI;
        };
        /** .ini configuration parser */
        BaseServer.prototype.parseIniCfgContent = function (cfgText) {
            var _this = this;
            var cfg = {};
            // very basic .ini variables parser
            // @TODO: place this code in a external module so it can be used by the library and the cli
            cfgText.split(/\n/).forEach(function (line) {
                return line.replace(/^\s*[\$@]abeamer-([\w+-]+)\s*:\s*"?([^\n"]+)"?\s*;\s*$/, function (_all, p1, p2) {
                    if (_this.isVerbose) {
                        console.log("config: ".concat(p1, "=[").concat(p2, "]"));
                    }
                    cfg[p1] = p2;
                    return '';
                });
            });
            return cfg;
        };
        /** Parses config */
        BaseServer.prototype.parseConfig = function (args, cfgText, configFileName, argI) {
            return this.parseJsonConfig(args, configFileName.match(/\.json$/)
                ? JSON.parse(cfgText)
                : { config: { abeamer: this.parseIniCfgContent(cfgText) } }, configFileName, argI);
        };
        // ------------------------------------------------------------------------
        //                               Parse Arguments
        // ------------------------------------------------------------------------
        BaseServer.prototype.parseArguments = function (args) {
            var argI = 1;
            var self = this;
            function getConfigFileName(value) {
                var configFileName = toPosixSlash(value);
                if (!configFileName) {
                    return '';
                }
                if (self.existsSync(configFileName) && self.isDirectory(configFileName)) {
                    configFileName = self.posixPathJoin(configFileName, 'abeamer.ini');
                }
                if (!self.existsSync(configFileName)) {
                    throw "Config file ".concat(configFileName, " doesn't exists");
                }
                return configFileName;
            }
            function setFramesPattern(framesPattern) {
                self.framesPattern = toPosixSlash(framesPattern || opts_parser_js_1.OptsParser.DEFAULT_OUT_PATTERN)
                    .replace('__PROJDIR__', self.projDir);
                if (self.isVerbose && self.toGenFrames) {
                    console.log("framesPattern: ".concat(self.framesPattern));
                }
            }
            function parseOption(option, value, multipleValue) {
                switch (option) {
                    case '@param':
                        parseOption('config', getConfigFileName(toPosixSlash(value)));
                        break;
                    case 'version':
                        console.log(version_js_1.VERSION);
                        return DO_EXIT;
                    case 'll':
                        self.logLevel = value;
                        self.isVerbose = self.logLevel >= consts_js_1.Consts.LL_VERBOSE;
                        if (self.isVerbose) {
                            console.log("Args: [".concat(args.join('],['), "]"));
                        }
                        break;
                    case 'url':
                        self.url = value;
                        if (self.isVerbose) {
                            console.log("url: ".concat(self.url));
                        }
                        break;
                    case 'var':
                        self.argsVars = multipleValue;
                        if (self.isVerbose) {
                            console.log("var: ".concat(multipleValue));
                        }
                        break;
                    case 'file':
                        var filename = toPosixSlash(value);
                        // rootPath is added at the beginning to able to generate report
                        // without self information due security reasons and provide a sharable report
                        var needsRootPath = false;
                        var isWin = self.platform.indexOf('win') !== -1;
                        if (isWin) {
                            needsRootPath = filename[1] !== ':' && filename[2] !== '/';
                        }
                        else {
                            needsRootPath = filename[0] !== '/';
                        }
                        if (needsRootPath) {
                            self.rootPath = toPosixSlash(self.cwd) + '/';
                        }
                        self.projDir = dirName(filename);
                        if (!self.framesPattern) {
                            setFramesPattern();
                        }
                        if (!self.existsSync(filename)) {
                            throw "Page File ".concat(filename, " doesn't exists");
                        }
                        if (!self.url) {
                            self.url = 'file://' + (isWin ? '/' : '') +
                                encodeURI(self.rootPath + filename);
                            if (self.isVerbose) {
                                console.log("final url: ".concat(self.url));
                            }
                        }
                        break;
                    case 'out':
                        setFramesPattern(value);
                        break;
                    case 'width':
                        if (!self.hasArgWidth) {
                            self.width = value;
                            self.hasArgWidth = !self.configFileMode;
                            if (self.isVerbose) {
                                console.log("width: ".concat(self.width));
                            }
                        }
                        break;
                    case 'maxWidth':
                        self.maxWidth = value;
                        if (self.isVerbose) {
                            console.log("maxWidth: ".concat(self.maxWidth));
                        }
                        break;
                    case 'height':
                        if (!self.hasArgHeight) {
                            self.height = value;
                            self.hasArgHeight = !self.configFileMode;
                            if (self.isVerbose) {
                                console.log("height: ".concat(self.height));
                            }
                        }
                        break;
                    case 'maxHeight':
                        self.maxHeight = value;
                        if (self.isVerbose) {
                            console.log("maxHeight: ".concat(self.maxHeight));
                        }
                        break;
                    case 'fps':
                        self.fps = value;
                        if (self.isVerbose) {
                            console.log("fps: ".concat(self.fps));
                        }
                        break;
                    case 'maxFps':
                        self.maxFps = value;
                        if (self.isVerbose) {
                            console.log("maxFps: ".concat(self.maxFps));
                        }
                        break;
                    case 'maxFrameCount':
                        self.maxFrameCount = value;
                        if (self.isVerbose) {
                            console.log("maxFrameCount: ".concat(self.maxFrameCount));
                        }
                        break;
                    case 'timeout':
                        self.timeout = value;
                        if (self.isVerbose) {
                            console.log("timeout: ".concat(self.timeout));
                        }
                        break;
                    case 'progress':
                        self.progress = value;
                        if (self.isVerbose) {
                            console.log("progress: ".concat(self.progress));
                        }
                        break;
                    case 'allowedPlugins':
                        plugin_injector_js_1.PluginInjector.loadAllowedPlugins(value, self.existsSync, self.readUtf8Sync);
                        break;
                    case 'injectPage':
                        plugin_injector_js_1.PluginInjector.injectPage = value;
                        if (self.isVerbose) {
                            console.log("injectPage: ".concat(value));
                        }
                        break;
                    case 'teleport':
                        self.toTeleport = true;
                        break;
                    case 'dp':
                        self.toDeletePreviousVersion = true;
                        break;
                    case 'noframes':
                        self.toGenFrames = false;
                        break;
                    case 'report':
                        self.reportFileName = value;
                        break;
                    case 'server':
                        self.serverName = value;
                        break;
                    case 'config':
                        var configFileName = getConfigFileName(value);
                        if (!configFileName) {
                            return 0;
                        }
                        if (self.isVerbose) {
                            console.log("Loading Config ".concat(configFileName));
                        }
                        if (!self.existsSync(configFileName)) {
                            throw "Config ".concat(configFileName, " doesn't exists");
                        }
                        self.configPath = dirName(configFileName) + '/';
                        // @TODO: Investigate how to make an async version of load the config
                        var configFile = self.readUtf8Sync(configFileName);
                        var injectArgs_1 = [];
                        var injectArgI_1 = 0;
                        self.parseConfig(injectArgs_1, configFile, configFileName, argI);
                        // injects the config as args to the main loop
                        self.configFileMode = true;
                        try {
                            opts_parser_js_1.OptsParser.iterateArgOpts(true, function () { return injectArgs_1[injectArgI_1++]; }, parseOption);
                        }
                        finally {
                            self.configFileMode = false;
                        }
                        break;
                }
            }
            var res = opts_parser_js_1.OptsParser.iterateArgOpts(true, function () { return args[argI++]; }, parseOption);
            if (res) {
                return res;
            }
            if (this.url) {
                if (!this.projDir) {
                    this.projDir = '.';
                }
                if (!this.framesPattern) {
                    setFramesPattern();
                }
                return (this.framesPattern ? DO_RUN_SERVER : DO_PRINT_USAGE);
            }
            return DO_PRINT_USAGE;
        };
        /**
         * Parse Arguments is async to later provide async config loading
         * @param callback
         */
        BaseServer.prototype.parseArgumentsAsync = function (callback) {
            callback(this.parseArguments(this.args));
        };
        // ------------------------------------------------------------------------
        //                               Message Handler
        // ------------------------------------------------------------------------
        BaseServer.prototype.handleMessage = function (msg, sendClientMsg, takeScreenshot) {
            var _this = this;
            var self = this;
            function renderDone() {
                self.frameNr++;
                if (self.frameNr >= self.frameCount) {
                    self.frameCount = self.frameNr + 1;
                }
                sendClientMsg(sc.MSG_RENDER_DONE);
            }
            if (msg.indexOf(sc.MESSAGE_PREFIX) === 0) {
                try {
                    msg = msg.substr(sc.MESSAGE_PREFIX.length);
                    var parts = msg.split(sc.CMD_VALUE_SEP);
                    var cmd = parts[0];
                    var value = parts.length === 2 ? parts[1] : '';
                    if (this.isVerbose) {
                        console.log("Cmd: ".concat(cmd, ", Value: ").concat(value));
                    }
                    switch (cmd) {
                        case sc.MSG_READY:
                            sendClientMsg(sc.MSG_SERVER_READY);
                            break;
                        case sc.MSG_RENDER:
                            var frameFileName_1 = sprintf(this.framesPattern, this.frameNr);
                            if (this.toGenFrames) {
                                // creates output tree if doesn't exists
                                if (isFirstFrame) {
                                    isFirstFrame = false;
                                    var matches = frameFileName_1.match(/^(.+)\/([^/]+)$/);
                                    if (matches) {
                                        var framesFolder = matches[1];
                                        if (!this.existsSync(framesFolder)) {
                                            if (this.isVerbose) {
                                                console.log("Creating Folder: ".concat(framesFolder));
                                            }
                                            else if (this.logLevel > consts_js_1.Consts.LL_SILENT) {
                                                console.log("Creating Story frames on: ".concat(framesFolder));
                                            }
                                            this.mkdirpSync(framesFolder);
                                        }
                                    }
                                }
                                takeScreenshot(this.rootPath + frameFileName_1, function () {
                                    if (_this.isVerbose) {
                                        console.log("Saved: ".concat(frameFileName_1));
                                    }
                                    if (_this.progress > 0 && _this.frameNr % _this.progress === 0) {
                                        console.log(new Array(2 + (_this.frameNr / _this.progress))
                                            .join('▒') + " ".concat(_this.frameNr, " frames"));
                                    }
                                    renderDone();
                                });
                            }
                            else {
                                renderDone();
                            }
                            break;
                        case sc.MSG_RENDER_FINISHED:
                            this.generateReport();
                            break;
                        case sc.MSG_SET_FRAME_NR:
                            this.frameNr = parseInt(value);
                            if (this.isVerbose) {
                                console.log("frame-nr: ".concat(this.frameNr));
                            }
                            this.checkForValidFrame(this.frameNr, true, "Invalid number frame nr");
                            break;
                        case sc.MSG_SET_FRAME_COUNT:
                            this.frameCount = parseInt(value);
                            if (this.isVerbose) {
                                console.log("frame-count: ".concat(this.frameCount));
                            }
                            this.checkForValidFrame(this.frameCount, false, "Invalid number of frames count");
                            break;
                        case sc.MSG_SET_FPS:
                            this.fps = parseInt(value);
                            if (this.isVerbose) {
                                console.log("fps: ".concat(this.fps));
                            }
                            this.checkForValidFps();
                            break;
                        case sc.MSG_LOG_MSG:
                            console.log(value);
                            break;
                        case sc.MSG_LOG_WARN:
                            console.warn(value);
                            break;
                        case sc.MSG_LOG_ERROR:
                            console.error(value);
                            break;
                        case sc.MSG_TELEPORT:
                            var storyFileName = (this.configPath ? this.configPath :
                                this.rootPath) + 'story.json';
                            console.log("Created ".concat(storyFileName));
                            this.writeFileSync(storyFileName, value);
                            this.exitServer();
                            break;
                        case sc.MSG_EXIT:
                            this.exitServer();
                            break;
                    }
                }
                catch (error) {
                    self.handleError(error.message);
                }
            }
        };
        // ------------------------------------------------------------------------
        //                               Handle Errors
        // ------------------------------------------------------------------------
        BaseServer.prototype.handleError = function (msg) {
            console.error(msg);
            if (toExitOnError) {
                this.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
            }
        };
        // ------------------------------------------------------------------------
        //                               Prepare Server
        // ------------------------------------------------------------------------
        // security checks
        BaseServer.prototype.checkForValidFps = function () {
            if (this.fps <= 0 || this.fps > this.maxFps) {
                throw "Invalid number of frames per second";
            }
        };
        // security checks
        BaseServer.prototype.checkForValidFrame = function (frameNr, allowZero, errorMsg) {
            if ((allowZero || !frameNr) || frameNr < 0 || frameNr > this.maxFrameCount) {
                throw errorMsg;
            }
        };
        BaseServer.prototype.prepareServer = function () {
            plugin_injector_js_1.PluginInjector.inject(this.existsSync, this.readUtf8Sync, this.writeFileSync);
            if (this.width <= 0 || this.width > this.maxWidth
                || this.height <= 0 || this.height > this.maxHeight) {
                throw "Invalid frame output size";
            }
            this.checkForValidFps();
            if (this.toDeletePreviousVersion) {
                if (this.isVerbose) {
                    console.log("Deleting previous frames");
                }
                var frameI = this.frameNr;
                while (true) {
                    var frameFileName = sprintf(this.framesPattern, frameI);
                    if (this.isVerbose) {
                        console.log("frameFileName: ".concat(frameFileName));
                    }
                    if (this.existsSync(frameFileName)) {
                        this.unlinkSync(frameFileName);
                    }
                    else {
                        break;
                    }
                    frameI++;
                }
            }
        };
        // ------------------------------------------------------------------------
        //                               Generate Report
        // ------------------------------------------------------------------------
        BaseServer.prototype.generateReport = function () {
            if (this.reportFileName && this.toGenFrames) {
                var framesDir = dirName(this.framesPattern);
                this.reportFileName = this.reportFileName.
                    replace('__FRAMES_DIR__', framesDir);
                var framesPattern = this.framesPattern;
                // removes the absolute path due security issues
                if (framesDir === framesPattern.substr(0, framesDir.length)) {
                    framesPattern = './' + framesPattern.substr(framesDir.length + 1);
                }
                var report = {
                    width: this.width,
                    height: this.height,
                    fps: this.fps,
                    framecount: this.frameCount,
                    // @HINT: Doesn't include the absolute path for security reasons
                    framespattern: framesPattern,
                    timestamp: getLocalISOTimeDate(),
                };
                this.mkdirpSync(dirName(this.reportFileName));
                this.writeFileSync(this.reportFileName, JSON.stringify(report, null, 2));
                if (this.isVerbose) {
                    console.log("Generated Report ".concat(this.reportFileName));
                }
                console.log("Generated ".concat(this.frameCount, " frames"));
            }
        };
        // ------------------------------------------------------------------------
        //                               Start
        // ------------------------------------------------------------------------
        BaseServer.prototype.start = function () {
            var _this = this;
            try {
                this.parseArgumentsAsync(function (res) {
                    switch (res) {
                        case DO_PRINT_USAGE:
                            opts_parser_js_1.OptsParser.printUsage();
                            break;
                        case DO_RUN_SERVER:
                            _this.prepareServer();
                            _this.runServer();
                            break;
                        case DO_EXIT:
                            break;
                    }
                });
            }
            catch (error) {
                console.log("Server Error: ".concat(error.message || error.toString()));
                this.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
                // throw error;
            }
        };
        return BaseServer;
    }());
    ServerAgent.BaseServer = BaseServer;
})(ServerAgent || (exports.ServerAgent = ServerAgent = {}));
//# sourceMappingURL=server-agent.js.map