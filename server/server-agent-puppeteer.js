"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Server executed within the context of puppeteer (chrome-headless)
const sysFs = require("fs");
const sysProcess = require("process");
const sysOs = require("os");
const sysPath = require("path");
const puppeteer = require("puppeteer");
const fsix_js_1 = require("../shared/vendor/fsix.js");
const opts_parser_js_1 = require("../shared/opts-parser.js");
const server_agent_js_1 = require("./server-agent.js");
var ServerAgent;
(function (ServerAgent) {
    // ------------------------------------------------------------------------
    //                               Global Vars
    // ------------------------------------------------------------------------
    let browser;
    class PuppeteerServerAgent extends server_agent_js_1.ServerAgent.BaseServer {
        exitServer(_retValue = 0) {
            super.exitServer();
            if (browser) {
                browser.close();
            }
        }
        runServer() {
            _runServer();
        }
    }
    const args = sysProcess.argv.slice();
    args.splice(0, 1);
    const server = new PuppeteerServerAgent('puppeteer', args, sysOs.platform(), sysProcess.cwd(), sysFs.existsSync, (fileName) => sysFs.statSync(fileName).isDirectory(), sysFs.unlinkSync, fsix_js_1.fsix.mkdirpSync, fsix_js_1.fsix.readUtf8Sync, sysFs.writeFileSync, sysPath.posix.join);
    server.start();
    // ------------------------------------------------------------------------
    //                               Run Server
    // ------------------------------------------------------------------------
    function _runServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const chromeBin = sysProcess.env['CHROME_BIN'];
            if (chromeBin && server.isVerbose) {
                console.log(`chromeBin: ${chromeBin}`);
            }
            browser = yield puppeteer.launch(chromeBin ? {
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
                : undefined);
            const page = yield browser.newPage();
            /** Sends Messages to the client */
            function sendClientMsg(cmd_1) {
                return __awaiter(this, arguments, void 0, function* (cmd, value = '') {
                    yield page.evaluate((_cmd, _value) => {
                        _abeamer._internalGetServerMsg.call(_abeamer, _cmd, _value);
                    }, cmd, value);
                });
            }
            /** Receives Client Messages */
            page
                .on('console', (e) => {
                server
                    .handleMessage(e.text(), sendClientMsg, (outFileName, onDone) => {
                    page.screenshot({
                        path: outFileName,
                        omitBackground: true,
                    })
                        .then(() => {
                        onDone();
                    });
                });
            })
                .on('pageerror', (errMsg) => {
                server.handleError(errMsg);
            })
                .on('error', (e) => {
                server.handleError(e.message);
            });
            // ------------------------------------------------------------------------
            //                               Page Loader
            // ------------------------------------------------------------------------
            page.setViewport(server.getViewport());
            yield page.goto(server.getPageUrl(), { timeout: server.timeout })
                .then((value) => {
                const status = value.status();
                if (server.isVerbose) {
                    console.log(`Page Loaded: ${status}`);
                }
                if (status !== 200 && status !== 0) {
                    server.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
                }
            })
                .catch((reason) => {
                console.error(`Page Loaded Error`);
                console.error(reason);
                server.exitServer(opts_parser_js_1.OptsParser.ON_ERROR_EXIT_VALUE);
            });
        });
    }
    sysProcess.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
})(ServerAgent || (ServerAgent = {}));
//# sourceMappingURL=server-agent-puppeteer.js.map