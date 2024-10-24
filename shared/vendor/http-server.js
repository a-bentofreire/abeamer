"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var http_server_exports = {};
__export(http_server_exports, {
  HttpServer: () => HttpServer
});
module.exports = __toCommonJS(http_server_exports);
var sysFs = __toESM(require("fs"));
var sysPath = __toESM(require("path"));
var sysHttp = __toESM(require("http"));
var sysUrl = __toESM(require("url"));
var HttpServer;
((HttpServer2) => {
  HttpServer2.DEFAULT_FILES = ["index.html", "README.md"];
  HttpServer2.contentTypes = {
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".md": "text/markdown",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mpeg",
    ".svg": "image/svg+xml",
    ".zip": "application/zip"
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
        } else {
          rp.res.setHeader("Content-type", HttpServer2.contentTypes[rp.ext] || "text/plain");
          rp.res.end(data);
        }
      });
    }
    handleDirectory(rp) {
      const foundFile = HttpServer2.DEFAULT_FILES.find(
        (file) => sysFs.existsSync(sysPath.join(rp.path, file))
      );
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
        res
      };
      sysFs.exists(rp.path, (exist) => {
        if (!exist) {
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
  HttpServer2.Server = Server;
})(HttpServer || (HttpServer = {}));
//# sourceMappingURL=http-server.js.map
