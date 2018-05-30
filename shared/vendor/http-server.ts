"use strict";
// uuid: ea6075d6-b468-4ed0-babe-8de4785b37e5

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module internal | This module is to be read only by developers */

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysHttp from "http";
import * as sysUrl from "url";

export namespace HttpServer {

  export const DEFAULT_FILES = ['index.html', 'README.md'];

  export const contentTypes = {
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


  export interface Response {
    path: string;
    search: string;
    ext?: string;
    res: sysHttp.ServerResponse;
  }


  export class Server {

    httpServer: sysHttp.Server;

    constructor(public port: uint) {}

    protected onBeforeServe(req: sysHttp.IncomingMessage,
      res: sysHttp.ServerResponse): boolean {
      return true;
    }


    protected onAfterServe(rp: Response): boolean {
      return true;
    }


    protected sendFile(rp: Response): void {

      sysFs.readFile(rp.path, (err, data) => {
        if (err) {
          rp.res.statusCode = 500;
          rp.res.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          rp.res.setHeader('Content-type', contentTypes[rp.ext] || 'text/plain');
          rp.res.end(data);
        }
      });
    }


    protected handleDirectory(rp: Response): boolean {
      const foundFile = DEFAULT_FILES.find(file =>
        sysFs.existsSync(sysPath.join(rp.path, file)),
      );
      if (!foundFile) {
        rp.res.statusCode = 404;
        rp.res.end(`File ${rp.path} not found!`);
        return false;
      }
      rp.path = sysPath.join(rp.path, foundFile);
      return true;
    }


    private serve(req: sysHttp.IncomingMessage, res: sysHttp.ServerResponse): void {

      if (!this.onBeforeServe(req, res)) { return; }

      const parsedUrl = sysUrl.parse(req.url);
      const rp: Response = {
        path: `.${parsedUrl.pathname}`,
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
        if (this.onAfterServe(rp)) { this.sendFile(rp); }
      });
    }


    public start() {
      this.httpServer = sysHttp.createServer((req, res) => {
        this.serve(req, res);
      }).listen(this.port);
    }
  }
}
