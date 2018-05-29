"use strict";
// uuid: d17cc3db-5794-4430-9e1b-6e70988c9ae4

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module internal | This module is to be read only by developers */

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysHttp from "http";

import { HttpServer } from "./http-server.js";

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

export namespace HttpServerEx {

  const MAX_URL_LEN = 1024;

  export class ServerEx extends HttpServer.Server {

    markdownCompiler;
    highlightJs;

    constructor(port: uint,
      public isVerbose: boolean = false,
      public exitFile: string = '',
      public allowDirListing: boolean = false,
      useMarkdown: boolean = false,
      useHighlightJs: boolean = false) {

      super(port);
      this.markdownCompiler = useMarkdown ? require('marked') : undefined;
      this.highlightJs = useHighlightJs ? require('highlight.js') : undefined;
    }


    markdownToHtml(sourceMarkdown: string): string {

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
        + (this.highlightJs ? `
    <link rel="stylesheet" href="/node_modules/highlight.js/styles/github.css">
    <link rel="stylesheet" href="/node_modules/font-awesome/css/font-awesome.css">
    <style>
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


    protected onBeforeServe(req: sysHttp.IncomingMessage,
      res: sysHttp.ServerResponse): boolean {
      if (req.url.length > MAX_URL_LEN
        || req.url.indexOf('..') !== -1
        || req.url.match(/\.[\w+\-]+\.(json|txt|ini)$/)) {
        res.statusCode = 403;
        res.end('forbidden url');
        return false;
      }


      if (this.isVerbose) { console.log(`${req.method} ${req.url}`); }


      if (this.exitFile && req.url.indexOf(this.exitFile) !== -1) {
        if (this.isVerbose) { console.log('Closing the server'); }
        this.httpServer.close();
        return false;
      }
      return true;
    }


    protected onAfterServe(rp: HttpServer.Response): boolean {
      if (this.markdownCompiler && rp.ext === '.md') {
        const sourceMarkdown = sysFs.readFileSync(rp.path, { encoding: 'utf-8' });
        rp.res.setHeader('Content-type', 'text/html');
        rp.res.end(this.markdownToHtml(sourceMarkdown));
        return false;
      }
      return true;
    }


    protected handleDirectory(rp: HttpServer.Response): boolean {
      const DIR_PREFIX = '?dir';
      if (this.allowDirListing && rp.search === DIR_PREFIX) {

        sysFs.readdir(rp.path, (err, files: string[]) => {
          const html = '<html>\n<head>\n</head><body>\n'
            + files.map(file => {
              const filename = `${rp.path}${rp.path.endsWith('/') ? '' : '/'}${file}`;
              const url = filename.substr(1);
              const isDir = sysFs.statSync(filename).isDirectory();
              return !isDir ? `<div><a href="${url}">${file}</a></div>` :
                `<div>[<a href="${url}${DIR_PREFIX}">${file}</a>]</div>`;
            }).join('\n')
            + '\n</body>\n</html>';

          rp.res.setHeader('Content-type', 'text/html');
          rp.res.end(html);
        });
        return false;
      } else {
        return super.handleDirectory(rp);
      }
    }
  }
}
