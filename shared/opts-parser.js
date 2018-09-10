"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 2460e386-36d9-49ec-afd6-30963ab2e387
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// The code shared by the server and cli
var rel_consts_js_1 = require("../shared/rel-consts.js");
var OptsParser;
(function (OptsParser) {
    OptsParser.DEFAULT_OUT_PATTERN = '__PROJDIR__/story-frames/frame%05d.png';
    OptsParser.DEFAULT_OUT_REPORT = '__FRAMES_DIR__/frame-report.json';
    OptsParser.ON_ERROR_EXIT_VALUE = -1;
    /** For security reasons, the user can't access this constant  */
    OptsParser.DEFAULT_MAX_WIDTH = 3840;
    /** For security reasons, the user can't access this constant  */
    OptsParser.DEFAULT_MAX_HEIGHT = 2160;
    /** For security reasons, the user can't access this constant  */
    OptsParser.DEFAULT_MAX_FPS = 50;
    /** For security reasons, the user can't access this constant  */
    OptsParser.DEFAULT_MAX_FRAME_COUNT = 20 * 60 * 60 * 1; // limits to 1h at 20fps
    OptsParser.DEFAULT_PROGRESS = 25;
    /**
     * Map of all the common options to both the cli and the render server agent.
     * Each key represents an option in both camelCase and Dash format.
     */
    OptsParser.argOpts = {
        ll: { param: 'int', desc: "log level. 0 has no verbosity" },
        version: { desc: "version" },
        url: {
            param: 'string', desc: "url of the page containing the animation\n              e.g. http://www.abeamer.com/\n              e.g. file:///home/abeamer/Documents/test/"
        },
        file: {
            param: 'string', desc: "for running local files with relative paths\n           if --out isn't defined it sets to " + OptsParser.DEFAULT_OUT_PATTERN + "\n              e.g --file gallery/hello-world/"
        },
        out: {
            param: 'string', desc: "output file pattern. use %(0<n>)d for sequence,\n           creates the destination folder if doesn't exists\n           if it's defined after --file, the macro  will be file value\n             e.g. --out " + OptsParser.DEFAULT_OUT_PATTERN,
        },
        report: {
            param: 'string', desc: "output report filename providing information about dimensions and fps\n           default is " + OptsParser.DEFAULT_OUT_REPORT,
        },
        allowedPlugins: {
            param: 'string', desc: "filename of the the list of the allowed plugins",
        },
        injectPage: {
            param: 'string', desc: "filename of the index.html that will receive the injection",
        },
        width: {
            param: 'int', desc: "frame output width. default is " + rel_consts_js_1.RelConsts.DEFAULT_WIDTH,
        },
        maxWidth: {
            param: 'int', desc: "maximum frame output width. default is " + OptsParser.DEFAULT_MAX_WIDTH,
        },
        height: {
            param: 'int', desc: "frame output height. default is " + rel_consts_js_1.RelConsts.DEFAULT_HEIGHT,
        },
        maxHeight: {
            param: 'int', desc: "maximum frame output height. default is " + OptsParser.DEFAULT_MAX_HEIGHT,
        },
        noframes: {
            desc: "doesn't render the frames to file nor generates the report.\n           use it only for debugging"
        },
        server: {
            param: 'string', desc: "name of the server. default is " + rel_consts_js_1.RelConsts.DEFAULT_SERVER,
        },
        fps: {
            param: 'int', desc: "overrides frames per second defined on project",
        },
        maxFps: {
            param: 'int', desc: "maximum frame per second. default is " + OptsParser.DEFAULT_MAX_FPS,
        },
        maxFrameCount: {
            param: 'int', desc: "maximum number of frames. default is " + OptsParser.DEFAULT_MAX_FRAME_COUNT,
        },
        progress: {
            param: 'int', desc: "number of frames it displays a progress info. if 0 doesn't shows progress. default is " + OptsParser.DEFAULT_PROGRESS,
        },
        timeout: {
            param: 'int', desc: "server timeout. default is 0",
        },
        teleport: { desc: "makes the web browser run on teleport mode, and generates the story on the exit" },
        dp: { desc: "deletes previous frames" },
        config: {
            param: 'string', desc: "loads the config from a ini or json file\n           see https://github.com/a-bentofreire/abeamer/docs/config-file.md",
        },
        var: {
            param: 'object', desc: "allows to pass multiple variables to client web library.\n         accessible as story.args.vars or in expressions.\n         if the variable name has dashes, it will be converted to camelCase\n           e.g --var name=end-user --var value=1.2.3",
        },
    };
    // ------------------------------------------------------------------------
    //                               Iterate Arg Options
    // ------------------------------------------------------------------------
    /** Returns true, if the argument is an option */
    OptsParser.isOption = function (arg) { return arg.indexOf('--') === 0; };
    /**
     * Iterates the command line arguments.
     * For each option, it calls callback.
     * If callback returns different from `undefined`, it exists immediately with
     * the return value of the callback.
     * Otherwise it iterates until all arguments are consumed and returns undefined.
     */
    function iterateArgOpts(toParseValue, getNext, callback) {
        do {
            var name_1 = (getNext() || '').trim();
            if (!name_1) {
                break;
            }
            if (OptsParser.isOption(name_1)) {
                var optName = name_1.substr(2)
                    // converts part1-part2-part3 => part1Part2Part3
                    .replace(/-(\w)/g, function (_all, firstLetter) { return firstLetter.toUpperCase(); });
                var opt = OptsParser.argOpts[optName];
                if (opt === undefined) {
                    throw "Unknown option " + optName;
                }
                opt.hasOption = true;
                if (opt.param) {
                    opt.value = getNext();
                    if (!opt.value || (OptsParser.isOption(opt.value) && !opt.allowOption)) {
                        throw "Missing value for " + name_1;
                    }
                    if (toParseValue) {
                        switch (opt.param) {
                            case 'int':
                                if (opt.value.match(/[^\d]/)) {
                                    throw name_1 + " " + opt.value + " isn't a integer value";
                                }
                                opt.value = parseInt(opt.value);
                                break;
                            case 'boolean':
                                opt.value = opt.value === 'true'
                                    || opt.value === '1';
                                break;
                            case 'object':
                                opt.multipleValue = opt.multipleValue || {};
                                var _a = opt.value.match(/^([^=]+)=(.*)$/) || ['', '', ''], key = _a[1], value = _a[2];
                                if (!key) {
                                    throw name_1 + " requires the key field";
                                }
                                opt.multipleValue[key] = value;
                                break;
                            case 'array':
                                opt.multipleValue = opt.multipleValue || [];
                                opt.multipleValue.push(opt.value);
                                break;
                        }
                    }
                }
                var res = callback(optName, opt.value, opt.multipleValue);
                if (res !== undefined) {
                    return res;
                }
            }
            else {
                callback('@param', name_1);
            }
        } while (true);
    }
    OptsParser.iterateArgOpts = iterateArgOpts;
    // ------------------------------------------------------------------------
    //                               Print Usage
    // ------------------------------------------------------------------------
    /**
     * Converts Options key to dash format, by replacing the uppercase to
     * dash + lowercase.
     */
    function _getDashKey(key) {
        return key.replace(/([A-Z])/g, function (_all, p) {
            return '-' + p.toLowerCase();
        });
    }
    /** Outputs to the console the program usage */
    function printUsage() {
        var names = Object.keys(OptsParser.argOpts);
        var max = 0;
        names.forEach(function (key) { max = Math.max(_getDashKey(key).length, max); });
        var fromKeyToDesc = max + 3;
        var descPos = 5 + fromKeyToDesc + 2;
        console.log("\n The options are:\n " + names.map(function (key) {
            var dashKey = _getDashKey(key);
            return "   --" + dashKey + Array(fromKeyToDesc - dashKey.length).join(' ')
                + (OptsParser.argOpts[key].desc.split('\n').map(function (line, lineIndex) {
                    return Array(lineIndex ? descPos : 0).join(' ') + line.trim();
                }).join('\n') + "\n\n");
        }).join('\n'));
    }
    OptsParser.printUsage = printUsage;
})(OptsParser = exports.OptsParser || (exports.OptsParser = {}));
//# sourceMappingURL=opts-parser.js.map