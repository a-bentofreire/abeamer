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
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: d17cc3db-5794-4430-9e1b-6e70988c9ae4
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
var sysFs = require("fs");
var http_server_js_1 = require("./http-server.js");
/**
 * ## Description
 *
 * 1. exitFile
 * 2. markdownToHtml (supported only during developer mode)
 * 3. Default files
 * 4. Limited the maximum length (security reasons)
 * 5. Block '..' after normalization (security reasons)
 * 6. Blocks access to files '\.[\w+\-]+\.(json|txt|ini)$' (security reasons)
 * 7. Directory listing
 * 8. // @TODO: Implement blacklist urls
 */
var HttpServerEx;
(function (HttpServerEx) {
    var MAX_URL_LEN = 1024;
    var ServerEx = /** @class */ (function (_super) {
        __extends(ServerEx, _super);
        function ServerEx(port, isVerbose, exitFile, allowDirListing, useMarkdown, useHighlightJs) {
            if (isVerbose === void 0) { isVerbose = false; }
            if (exitFile === void 0) { exitFile = ''; }
            if (allowDirListing === void 0) { allowDirListing = false; }
            if (useMarkdown === void 0) { useMarkdown = false; }
            if (useHighlightJs === void 0) { useHighlightJs = false; }
            var _this = _super.call(this, port) || this;
            _this.isVerbose = isVerbose;
            _this.exitFile = exitFile;
            _this.allowDirListing = allowDirListing;
            _this.markdownCompiler = useMarkdown ? require('marked') : undefined;
            _this.highlightJs = useHighlightJs ? require('highlight.js') : undefined;
            return _this;
        }
        ServerEx.prototype.markdownToHtml = function (sourceMarkdown) {
            var _this = this;
            this.markdownCompiler.setOptions({
                renderer: new this.markdownCompiler.Renderer(),
                highlight: function (code) { return _this.highlightJs
                    ? _this.highlightJs.highlightAuto(code).value : code; },
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false,
            });
            /* spell-checker: disable */
            var html = '<html>\n<head>\n'
                // this sytle used in html output of the markdown is designed to be similar
                // to the github markdown rendered in order to have a good simulation of
                // how the user will see the documentation.
                + (this.highlightJs ? "\n    <link rel=\"stylesheet\" href=\"/node_modules/highlight.js/styles/github.css\">\n    <link rel=\"stylesheet\" href=\"/node_modules/font-awesome/css/font-awesome.css\">\n    <style>\n    body {\n      font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,\n        sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        color: #24292e;\n        background-color: white;\n    }\n    pre {\n      background-color: #1b1f230d;\n      padding: 0.2em 0.4em;\n    }\n    #__page {\n       max-width: 980px;\n       padding: 45px;\n       border: 1px solid #ddd;\n       border-bottom-right-radius: 3px;\n       border-bottom-left-radius: 3px;\n       margin-left: 20px;\n    }\n    code {\n      background-color: #1b1f230d;\n      padding: 0.2em 0.4em;\n    }\n    pre code {\n      background-color: transparent;\n      padding: 0;\n    }\n\n    </style>\n    <script src=\"/node_modules/highlight.js/lib/highlight.js\"></script>\n    <script>hljs.initHighlightingOnLoad();</script>\n" : '')
                + '</head>\n<body>\n<div id=__page>'
                + this.markdownCompiler(sourceMarkdown)
                + '</div></body>\n</html>';
            return html;
        };
        ServerEx.prototype.onBeforeServe = function (req, res) {
            if (req.url.length > MAX_URL_LEN
                || req.url.indexOf('..') !== -1
                || req.url.match(/\.[\w+\-]+\.(json|txt|ini)$/)) {
                res.statusCode = 403;
                res.end('forbidden url');
                return false;
            }
            if (this.isVerbose) {
                console.log(req.method + " " + req.url);
            }
            if (this.exitFile && req.url.indexOf(this.exitFile) !== -1) {
                if (this.isVerbose) {
                    console.log('Closing the server');
                }
                this.httpServer.close();
                return false;
            }
            return true;
        };
        ServerEx.prototype.onAfterServe = function (rp) {
            if (this.markdownCompiler && rp.ext === '.md') {
                var sourceMarkdown = sysFs.readFileSync(rp.path, { encoding: 'utf-8' });
                rp.res.setHeader('Content-type', 'text/html');
                rp.res.end(this.markdownToHtml(sourceMarkdown));
                return false;
            }
            return true;
        };
        ServerEx.prototype.handleDirectory = function (rp) {
            var DIR_PREFIX = '?dir';
            if (this.allowDirListing && rp.search === DIR_PREFIX) {
                sysFs.readdir(rp.path, function (err, files) {
                    var slashedPath = rp.path + (rp.path.endsWith('/') ? '' : '/');
                    var filesInfo = files.map(function (file) {
                        var fileName = "" + slashedPath + file;
                        var url = fileName.substr(1);
                        var isDir = sysFs.statSync(fileName).isDirectory();
                        return {
                            file: file,
                            fileName: fileName,
                            url: url,
                            isDir: isDir,
                        };
                    });
                    filesInfo.sort(function (fa, fb) {
                        return fa.isDir === fb.isDir ? fa.file.localeCompare(fb.file) :
                            (fa.isDir ? -1 : 1);
                    });
                    if (slashedPath !== './') {
                        filesInfo.unshift({
                            file: '..',
                            fileName: slashedPath + "..",
                            url: slashedPath.substr(1) + "../",
                            isDir: true,
                        });
                    }
                    var html = "<html>\n<head>\n<style>\nbody {\n    font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,\n      sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n      color: #24292e;\n      background-color: white;\n}\n</style>\n          </head><body>\n"
                        + filesInfo.map(function (fileInf) {
                            var isDir = fileInf.isDir;
                            var defaultLinks = [];
                            if (isDir) {
                                http_server_js_1.HttpServer.DEFAULT_FILES.forEach(function (defFile) {
                                    var defFileName = fileInf.fileName + "/" + defFile;
                                    if (sysFs.existsSync(defFileName)) {
                                        defaultLinks.push("&nbsp;(<a href=\"" + fileInf.url + "/" + defFile + "\">" + defFile + "</a>)");
                                    }
                                });
                            }
                            return !isDir ? "<div><a href=\"" + fileInf.url + "\">" + fileInf.file + "</a></div>" :
                                "<div>[<a href=\"" + fileInf.url + DIR_PREFIX + "\">" + fileInf.file + "</a>]" + defaultLinks.join('') + "</div>";
                        }).join('\n')
                        + '\n</body>\n</html>';
                    rp.res.setHeader('Content-type', 'text/html');
                    rp.res.end(html);
                });
                return false;
            }
            else {
                return _super.prototype.handleDirectory.call(this, rp);
            }
        };
        return ServerEx;
    }(http_server_js_1.HttpServer.Server));
    HttpServerEx.ServerEx = ServerEx;
})(HttpServerEx = exports.HttpServerEx || (exports.HttpServerEx = {}));
//# sourceMappingURL=http-server-ex.js.map