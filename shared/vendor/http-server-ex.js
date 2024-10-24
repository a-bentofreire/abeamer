"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServerEx = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
const sysFs = require("fs");
const http_server_js_1 = require("./http-server.js");
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
    const MAX_URL_LEN = 1024;
    class ServerEx extends http_server_js_1.HttpServer.Server {
        constructor(port, isVerbose = false, exitFile = '', allowDirListing = false, useMarkdown = false, useHighlightJs = false) {
            super(port);
            this.isVerbose = isVerbose;
            this.exitFile = exitFile;
            this.allowDirListing = allowDirListing;
            this.markdownCompiler = useMarkdown ? require('marked') : undefined;
            this.highlightJs = useHighlightJs ? require('highlight.js') : undefined;
        }
        markdownToHtml(sourceMarkdown) {
            this.markdownCompiler.setOptions({
                renderer: new this.markdownCompiler.Renderer(),
                highlight: (code) => this.highlightJs
                    ? this.highlightJs.highlightAuto(code).value : code,
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
            const html = '<html>\n<head>\n'
                // this sytle used in html output of the markdown is designed to be similar
                // to the github markdown rendered in order to have a good simulation of
                // how the user will see the documentation.
                + (this.highlightJs ? `
    <link rel="stylesheet" href="/node_modules/highlight.js/styles/github.css">
    <link rel="stylesheet" href="/node_modules/font-awesome/css/font-awesome.css">
    <style>
    body {
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,
        sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        color: #24292e;
        background-color: white;
    }
    pre {
      background-color: #1b1f230d;
      padding: 0.2em 0.4em;
    }
    #__page {
       max-width: 980px;
       padding: 45px;
       border: 1px solid #ddd;
       border-bottom-right-radius: 3px;
       border-bottom-left-radius: 3px;
       margin-left: 20px;
    }
    code {
      background-color: #1b1f230d;
      padding: 0.2em 0.4em;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }

    </style>
    <script src="/node_modules/highlight.js/lib/highlight.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>\n` : '')
                + '</head>\n<body>\n<div id=__page>'
                + this.markdownCompiler(sourceMarkdown)
                + '</div></body>\n</html>';
            return html;
        }
        onBeforeServe(req, res) {
            if (req.url.length > MAX_URL_LEN
                || req.url.indexOf('..') !== -1
                || req.url.match(/\.[\w+\-]+\.(json|txt|ini)$/)) {
                res.statusCode = 403;
                res.end('forbidden url');
                return false;
            }
            if (this.isVerbose) {
                console.log(`${req.method} ${req.url}`);
            }
            if (this.exitFile && req.url.indexOf(this.exitFile) !== -1) {
                if (this.isVerbose) {
                    console.log('Closing the server');
                }
                this.httpServer.close();
                return false;
            }
            return true;
        }
        onAfterServe(rp) {
            if (this.markdownCompiler && rp.ext === '.md') {
                const sourceMarkdown = sysFs.readFileSync(rp.path, { encoding: 'utf-8' });
                rp.res.setHeader('Content-type', 'text/html');
                rp.res.end(this.markdownToHtml(sourceMarkdown));
                return false;
            }
            return true;
        }
        handleDirectory(rp) {
            const DIR_PREFIX = '?dir';
            if (this.allowDirListing && rp.search === DIR_PREFIX) {
                sysFs.readdir(rp.path, (_err, files) => {
                    const slashedPath = rp.path + (rp.path.endsWith('/') ? '' : '/');
                    const filesInfo = files.map(file => {
                        const fileName = `${slashedPath}${file}`;
                        const url = fileName.substr(1);
                        const isDir = sysFs.statSync(fileName).isDirectory();
                        return {
                            file,
                            fileName,
                            url,
                            isDir,
                        };
                    });
                    filesInfo.sort((fa, fb) => {
                        return fa.isDir === fb.isDir ? fa.file.localeCompare(fb.file) :
                            (fa.isDir ? -1 : 1);
                    });
                    if (slashedPath !== './') {
                        filesInfo.unshift({
                            file: '..',
                            fileName: `${slashedPath}..`,
                            url: `${slashedPath.substr(1)}../`,
                            isDir: true,
                        });
                    }
                    const html = `<html>\n<head>
<style>
body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,
      sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      color: #24292e;
      background-color: white;
}
</style>
          </head><body>\n`
                        + filesInfo.map(fileInf => {
                            const isDir = fileInf.isDir;
                            const defaultLinks = [];
                            if (isDir) {
                                http_server_js_1.HttpServer.DEFAULT_FILES.forEach(defFile => {
                                    const defFileName = `${fileInf.fileName}/${defFile}`;
                                    if (sysFs.existsSync(defFileName)) {
                                        defaultLinks.push(`&nbsp;(<a href="${fileInf.url}/${defFile}">${defFile}</a>)`);
                                    }
                                });
                            }
                            return !isDir ? `<div><a href="${fileInf.url}">${fileInf.file}</a></div>` :
                                `<div>[<a href="${fileInf.url}${DIR_PREFIX}">${fileInf.file}</a>]${defaultLinks.join('')}</div>`;
                        }).join('\n')
                        + '\n</body>\n</html>';
                    rp.res.setHeader('Content-type', 'text/html');
                    rp.res.end(html);
                });
                return false;
            }
            else {
                return super.handleDirectory(rp);
            }
        }
    }
    HttpServerEx.ServerEx = ServerEx;
})(HttpServerEx || (exports.HttpServerEx = HttpServerEx = {}));
//# sourceMappingURL=http-server-ex.js.map