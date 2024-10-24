"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// This file is executed within the context of phantomjs/slimerjs
// @WARN: Don't use TypeScript modules due the fact this file is
// executed on the context of phantomjs
var Server;
(function (Server) {
    const phantomSystem = require('system');
    const phantomFs = require('fs');
    const phantomWebPage = require('webpage');
    let baseServerAgent /* : ABeamerServer.BaseServer */;
    // @HINT: Must surround with try/catch otherwise it will block in case of error
    try {
        baseServerAgent = require('./server-agent.js').ServerAgent;
    }
    catch (error) {
        console.error(error);
        phantom.exit(-1);
    }
    class PhantomjsServerAgent extends baseServerAgent.BaseServer {
        exitServer(retValue = 0) {
            super.exitServer();
            phantom.exit(retValue);
        }
        runServer() {
            this.prepareServer();
            const page = phantomWebPage.create();
            /** Sends Messages to the client */
            function sendClientMsg(cmd, value = '') {
                const script = `function(){_abeamer._internalGetServerMsg.call(_abeamer, '${cmd}', '${value}'); }`;
                page.evaluateJavaScript(script);
            }
            /** Receives Client Messages */
            page.onConsoleMessage = (msg) => {
                this.handleMessage(msg, sendClientMsg, (outFileName, onDone) => {
                    page.render(outFileName);
                    onDone();
                });
            };
            /** Handles browser errors */
            page.onError = (msg /* , trace: string[] */) => {
                server.handleError(msg);
            };
            // ------------------------------------------------------------------------
            //                               Page Loader
            // ------------------------------------------------------------------------
            page.viewportSize = this.getViewport();
            page.open(this.getPageUrl(), (status) => {
                if (this.logLevel) {
                    console.log(`Page Loaded: ${status}`);
                }
                if (status.indexOf('fail') !== -1) {
                    this.exitServer();
                }
            });
        }
    }
    const server = new PhantomjsServerAgent('phantomjs', phantomSystem.args.slice(), phantomSystem.os.name, phantomFs.workingDirectory, phantomFs.exists, phantomFs.isDirectory, phantomFs.remove, phantomFs.makeTree, (fileName) => {
        const fileHandle = phantomFs.open(fileName, { mode: 'r', charset: 'utf-8' });
        const data = fileHandle.read();
        fileHandle.close();
        return data;
    }, (fileName, data) => {
        const fileHandle = phantomFs.open(fileName, { mode: 'w', charset: 'utf-8' });
        fileHandle.write(data);
        fileHandle.close();
    }, (path1, path2) => {
        path1 = path1.replace(/\/$/, '');
        return path1 + '/' + path2;
    });
    server.start();
})(Server || (Server = {}));
//# sourceMappingURL=server-agent-phantomjs.js.map