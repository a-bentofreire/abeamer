"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Server executed within the context of puppeteer (chrome-headless)
var sysFs = require("fs");
var sysProcess = require("process");
var sysOs = require("os");
var sysPath = require("path");
var puppeteer = require("puppeteer");
var fsix_js_1 = require("../shared/vendor/fsix.js");
var opts_parser_js_1 = require("../shared/opts-parser.js");
var server_agent_js_1 = require("./server-agent.js");
var ServerAgent;
(function (ServerAgent) {
    // ------------------------------------------------------------------------
    //                               Global Vars
    // ------------------------------------------------------------------------
    var browser;
    var PuppeteerServerAgent = /** @class */ (function (_super) {
        __extends(PuppeteerServerAgent, _super);
        function PuppeteerServerAgent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PuppeteerServerAgent.prototype.exitServer = function (_retValue) {
            if (_retValue === void 0) { _retValue = 0; }
            _super.prototype.exitServer.call(this);
            if (browser) {
                browser.close();
            }
        };
        PuppeteerServerAgent.prototype.runServer = function () {
            _runServer();
        };
        return PuppeteerServerAgent;
    }(server_agent_js_1.ServerAgent.BaseServer));
    var args = sysProcess.argv.slice();
    args.splice(0, 1);
    var server = new PuppeteerServerAgent('puppeteer', args, sysOs.platform(), sysProcess.cwd(), sysFs.existsSync, function (fileName) { return sysFs.statSync(fileName).isDirectory(); }, sysFs.unlinkSync, fsix_js_1.fsix.mkdirpSync, fsix_js_1.fsix.readUtf8Sync, sysFs.writeFileSync, sysPath.posix.join);
    server.start();
    // ------------------------------------------------------------------------
    //                               Run Server
    // ------------------------------------------------------------------------
    function _runServer() {
        return __awaiter(this, void 0, void 0, function () {
            /** Sends Messages to the client */
            function sendClientMsg(cmd, value) {
                if (value === void 0) { value = ''; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, page.evaluate(function (_cmd, _value) {
                                    _abeamer._internalGetServerMsg.call(_abeamer, _cmd, _value);
                                }, cmd, value)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var chromeBin, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chromeBin = sysProcess.env['CHROME_BIN'];
                        if (chromeBin && server.isVerbose) {
                            console.log("chromeBin: " + chromeBin);
                        }
                        return [4 /*yield*/, puppeteer.launch(chromeBin ? {
                                executablePath: chromeBin,
                                // @TODO: Find more options to make chrome faster and more stable.
                                /* spell-checker: disable */
                                args: [
                                    '--disable-extensions',
                                    '--disable-default-apps',
                                    '--disable-popup-blocking',
                                    '--disable-sync',
                                    '--disable-translate',
                                    '--enable-fast-unload',
                                    '--disable-cloud-import',
                                    '--safebrowsing-disable-auto-update',
                                    '--no-user-gesture-required',
                                    '--enable-font-antialiasing',
                                    '--ignore-autoplay-restrictions',
                                    '--autoplay-policy=no-user-gesture-required',
                                    '--safebrowsing-disable-auto-update',
                                    '--no-default-browser-check',
                                ],
                            }
                                : undefined)];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        /** Receives Client Messages */
                        page
                            .on('console', function (e) {
                            server
                                .handleMessage(e.text(), sendClientMsg, function (outFileName, onDone) {
                                page.screenshot({
                                    path: outFileName,
                                    omitBackground: true,
                                })
                                    .then(function () {
                                    onDone();
                                });
                            });
                        })
                            .on('pageerror', function (errMsg) {
                            server.handleError(errMsg);
                        })
                            .on('error', function (e) {
                            server.handleError(e.message);
                        });
                        // ------------------------------------------------------------------------
                        //                               Page Loader
                        // ------------------------------------------------------------------------
                        page.setViewport(server.getViewport());
                        return [4 /*yield*/, page.goto(server.getPageUrl(), { timeout: server.timeout })
                                .then(function (value) {
                                var status = value.status();
                                if (server.isVerbose) {
                                    console.log("Page Loaded: " + status);
                                }
                                if (status !== 200 && status !== 0) {
                                    server.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
                                }
                            })
                                .catch(function (reason) {
                                console.error("Page Loaded Error");
                                console.error(reason);
                                server.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    sysProcess.on('unhandledRejection', function (error) {
        console.log('unhandledRejection', error.message);
    });
})(ServerAgent || (ServerAgent = {}));
//# sourceMappingURL=server-agent-puppeteer.js.map