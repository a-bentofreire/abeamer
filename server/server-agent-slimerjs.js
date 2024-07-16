"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    var slimerSystem = require('system') /* as System */;
    var slimerFs = require('fs');
    var slimerWebPage = require('webpage');
    var baseServerAgent /* : ABeamerServer.BaseServer */;
    // @HINT: Must surround with try/catch otherwise it will block in case of error
    try {
        baseServerAgent = require('./server-agent.js').ServerAgent;
    }
    catch (error) {
        console.error(error);
        phantom.exit(-1);
    }
    var SlimerjsServerAgent = /** @class */ (function (_super) {
        __extends(SlimerjsServerAgent, _super);
        function SlimerjsServerAgent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SlimerjsServerAgent.prototype.exitServer = function (retValue) {
            if (retValue === void 0) { retValue = 0; }
            _super.prototype.exitServer.call(this);
            phantom.exit(retValue);
        };
        SlimerjsServerAgent.prototype.runServer = function () {
            var _this = this;
            this.prepareServer();
            var page = slimerWebPage.create();
            /** Sends Messages to the client */
            function sendClientMsg(cmd, value) {
                if (value === void 0) { value = ''; }
                var script = "_abeamer._internalGetServerMsg.call(_abeamer, '".concat(cmd, "', '").concat(value, "'); ");
                page.evaluateJavaScript(script);
            }
            /** Receives Client Messages */
            page.onConsoleMessage = function (msg) {
                _this.handleMessage(msg, sendClientMsg, function (outFileName, onDone) {
                    page.render(outFileName, { onlyViewport: true });
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
            page.open(this.getPageUrl())
                .then(function (status) {
                console.log("open: ".concat(status));
                if (_this.logLevel) {
                    console.log("Page Loaded: ".concat(status));
                }
                if (status !== 'success') {
                    _this.exitServer();
                }
            });
        };
        return SlimerjsServerAgent;
    }(baseServerAgent.BaseServer));
    var server = new SlimerjsServerAgent('slimerjs', slimerSystem.args.slice(), slimerSystem.os.name, slimerFs.workingDirectory, slimerFs.exists, slimerFs.isDirectory, slimerFs.remove, slimerFs.makeTree, function (fileName) {
        var fileHandle = slimerFs.open(fileName, { mode: 'r', charset: 'utf-8' });
        var data = fileHandle.read();
        fileHandle.close();
        return data;
    }, function (fileName, data) {
        var fileHandle = slimerFs.open(fileName, { mode: 'w', charset: 'utf-8' });
        fileHandle.write(data);
        fileHandle.close();
    }, function (path1, path2) {
        path1 = path1.replace(/\/$/, '');
        return path1 + '/' + path2;
    });
    server.start();
})(Server || (Server = {}));
//# sourceMappingURL=server-agent-slimerjs.js.map