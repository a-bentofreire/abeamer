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
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// This file is executed within the context of phantomjs/slimerjs
// @WARN: Don't use TypeScript modules due the fact this file is
// executed on the context of phantomjs
var Server;
(function (Server) {
    var phantomSystem = require('system');
    var phantomFs = require('fs');
    var phantomWebPage = require('webpage');
    var baseServerAgent /* : ABeamerServer.BaseServer */;
    // @HINT: Must surround with try/catch otherwise it will block in case of error
    try {
        baseServerAgent = require('./server-agent.js').ServerAgent;
    }
    catch (error) {
        console.error(error);
        phantom.exit(-1);
    }
    var PhantomjsServerAgent = /** @class */ (function (_super) {
        __extends(PhantomjsServerAgent, _super);
        function PhantomjsServerAgent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PhantomjsServerAgent.prototype.exitServer = function (retValue) {
            if (retValue === void 0) { retValue = 0; }
            _super.prototype.exitServer.call(this);
            phantom.exit(retValue);
        };
        PhantomjsServerAgent.prototype.runServer = function () {
            var _this = this;
            this.prepareServer();
            var page = phantomWebPage.create();
            /** Sends Messages to the client */
            function sendClientMsg(cmd, value) {
                if (value === void 0) { value = ''; }
                var script = "function(){_abeamer._internalGetServerMsg.call(_abeamer, '" + cmd + "', '" + value + "'); }";
                page.evaluateJavaScript(script);
            }
            /** Receives Client Messages */
            page.onConsoleMessage = function (msg) {
                _this.handleMessage(msg, sendClientMsg, function (outFileName, onDone) {
                    page.render(outFileName);
                    onDone();
                });
            };
            /** Handles browser errors */
            page.onError = function (msg /* , trace: string[] */) {
                server.handleError(msg);
            };
            // ------------------------------------------------------------------------
            //                               Page Loader
            // ------------------------------------------------------------------------
            page.viewportSize = this.getViewport();
            page.open(this.getPageUrl(), function (status) {
                if (_this.logLevel) {
                    console.log("Page Loaded: " + status);
                }
                if (status.indexOf('fail') !== -1) {
                    _this.exitServer();
                }
            });
        };
        return PhantomjsServerAgent;
    }(baseServerAgent.BaseServer));
    var server = new PhantomjsServerAgent('phantomjs', phantomSystem.args.slice(), phantomSystem.os.name, phantomFs.workingDirectory, phantomFs.exists, phantomFs.isDirectory, phantomFs.remove, phantomFs.makeTree, function (fileName) {
        var fileHandle = phantomFs.open(fileName, { mode: 'r', charset: 'utf-8' });
        var data = fileHandle.read();
        fileHandle.close();
        return data;
    }, function (fileName, data) {
        var fileHandle = phantomFs.open(fileName, { mode: 'w', charset: 'utf-8' });
        fileHandle.write(data);
        fileHandle.close();
    }, function (path1, path2) {
        path1 = path1.replace(/\/$/, '');
        return path1 + '/' + path2;
    });
    server.start();
})(Server || (Server = {}));
//# sourceMappingURL=server-agent-phantomjs.js.map