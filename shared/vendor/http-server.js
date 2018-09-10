"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: ea6075d6-b468-4ed0-babe-8de4785b37e5
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
var sysFs = require("fs");
var sysPath = require("path");
var sysHttp = require("http");
var sysUrl = require("url");
var HttpServer;
(function (HttpServer) {
    HttpServer.DEFAULT_FILES = ['index.html', 'README.md'];
    HttpServer.contentTypes = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.md': 'text/markdown',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mpeg',
        '.svg': 'image/svg+xml',
        '.zip': 'application/zip',
    };
    var Server = /** @class */ (function () {
        function Server(port) {
            this.port = port;
        }
        Server.prototype.onBeforeServe = function (_req, _res) {
            return true;
        };
        Server.prototype.onAfterServe = function (_rp) {
            return true;
        };
        Server.prototype.sendFile = function (rp) {
            sysFs.readFile(rp.path, function (err, data) {
                if (err) {
                    rp.res.statusCode = 500;
                    rp.res.end("Error getting the file: " + err + ".");
                }
                else {
                    // if the file is found, set Content-type and send data
                    rp.res.setHeader('Content-type', HttpServer.contentTypes[rp.ext] || 'text/plain');
                    rp.res.end(data);
                }
            });
        };
        Server.prototype.handleDirectory = function (rp) {
            var foundFile = HttpServer.DEFAULT_FILES.find(function (file) {
                return sysFs.existsSync(sysPath.join(rp.path, file));
            });
            if (!foundFile) {
                rp.res.statusCode = 404;
                rp.res.end("File " + rp.path + " not found!");
                return false;
            }
            rp.path = sysPath.join(rp.path, foundFile);
            return true;
        };
        Server.prototype.serve = function (req, res) {
            var _this = this;
            if (!this.onBeforeServe(req, res)) {
                return;
            }
            var parsedUrl = sysUrl.parse(req.url);
            var rp = {
                path: "." + decodeURI(parsedUrl.pathname),
                search: parsedUrl.search,
                res: res,
            };
            // @TODO: Fix when there is a missing path
            sysFs.exists(rp.path, function (exist) {
                if (!exist) {
                    // if the file is not found, return 404
                    res.statusCode = 404;
                    res.end("File " + rp.path + " not found!");
                    return;
                }
                if (sysFs.statSync(rp.path).isDirectory() && !_this.handleDirectory(rp)) {
                    return;
                }
                rp.ext = sysPath.parse(rp.path).ext;
                if (_this.onAfterServe(rp)) {
                    _this.sendFile(rp);
                }
            });
        };
        Server.prototype.start = function () {
            var _this = this;
            this.httpServer = sysHttp.createServer(function (req, res) {
                _this.serve(req, res);
            }).listen(this.port);
        };
        return Server;
    }());
    HttpServer.Server = Server;
})(HttpServer = exports.HttpServer || (exports.HttpServer = {}));
//# sourceMappingURL=http-server.js.map