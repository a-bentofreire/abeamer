"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
const sysFs = require("fs");
const sysPath = require("path");
const sysHttp = require("http");
const sysUrl = require("url");
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
    class Server {
        constructor(port) {
            this.port = port;
        }
        onBeforeServe(_req, _res) {
            return true;
        }
        onAfterServe(_rp) {
            return true;
        }
        sendFile(rp) {
            sysFs.readFile(rp.path, (err, data) => {
                if (err) {
                    rp.res.statusCode = 500;
                    rp.res.end(`Error getting the file: ${err}.`);
                }
                else {
                    // if the file is found, set Content-type and send data
                    rp.res.setHeader('Content-type', HttpServer.contentTypes[rp.ext] || 'text/plain');
                    rp.res.end(data);
                }
            });
        }
        handleDirectory(rp) {
            const foundFile = HttpServer.DEFAULT_FILES.find(file => sysFs.existsSync(sysPath.join(rp.path, file)));
            if (!foundFile) {
                rp.res.statusCode = 404;
                rp.res.end(`File ${rp.path} not found!`);
                return false;
            }
            rp.path = sysPath.join(rp.path, foundFile);
            return true;
        }
        serve(req, res) {
            if (!this.onBeforeServe(req, res)) {
                return;
            }
            const parsedUrl = sysUrl.parse(req.url);
            const rp = {
                path: `.${decodeURI(parsedUrl.pathname)}`,
                search: parsedUrl.search,
                res,
            };
            // @TODO: Fix when there is a missing path
            sysFs.exists(rp.path, (exist) => {
                if (!exist) {
                    // if the file is not found, return 404
                    res.statusCode = 404;
                    res.end(`File ${rp.path} not found!`);
                    return;
                }
                if (sysFs.statSync(rp.path).isDirectory() && !this.handleDirectory(rp)) {
                    return;
                }
                rp.ext = sysPath.parse(rp.path).ext;
                if (this.onAfterServe(rp)) {
                    this.sendFile(rp);
                }
            });
        }
        start() {
            this.httpServer = sysHttp.createServer((req, res) => {
                this.serve(req, res);
            }).listen(this.port);
        }
    }
    HttpServer.Server = Server;
})(HttpServer || (exports.HttpServer = HttpServer = {}));
//# sourceMappingURL=http-server.js.map