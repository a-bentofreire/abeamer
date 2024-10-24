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
var http_server_ex_exports = {};
__export(http_server_ex_exports, {
  HttpServerEx: () => HttpServerEx
});
module.exports = __toCommonJS(http_server_ex_exports);
var sysFs = __toESM(require("fs"));
var import_http_server = require("./http-server.js");
var HttpServerEx;
((HttpServerEx2) => {
  const MAX_URL_LEN = 1024;
  class ServerEx extends import_http_server.HttpServer.Server {
    constructor(port, isVerbose = false, exitFile = "", allowDirListing = false, useMarkdown = false, useHighlightJs = false) {
      super(port);
      this.isVerbose = isVerbose;
      this.exitFile = exitFile;
      this.allowDirListing = allowDirListing;
      this.markdownCompiler = useMarkdown ? require("marked") : void 0;
      this.highlightJs = useHighlightJs ? require("highlight.js") : void 0;
    }
    markdownToHtml(sourceMarkdown) {
      this.markdownCompiler.setOptions({
        renderer: new this.markdownCompiler.Renderer(),
        highlight: (code) => this.highlightJs ? this.highlightJs.highlightAuto(code).value : code,
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });
      const html = "<html>\n<head>\n" + (this.highlightJs ? `
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
    <script src="/node_modules/highlight.js/lib/highlight.js"><\/script>
    <script>hljs.initHighlightingOnLoad();<\/script>
` : "") + "</head>\n<body>\n<div id=__page>" + this.markdownCompiler(sourceMarkdown) + "</div></body>\n</html>";
      return html;
    }
    onBeforeServe(req, res) {
      if (req.url.length > MAX_URL_LEN || req.url.indexOf("..") !== -1 || req.url.match(/\.[\w+\-]+\.(json|txt|ini)$/)) {
        res.statusCode = 403;
        res.end("forbidden url");
        return false;
      }
      if (this.isVerbose) {
        console.log(`${req.method} ${req.url}`);
      }
      if (this.exitFile && req.url.indexOf(this.exitFile) !== -1) {
        if (this.isVerbose) {
          console.log("Closing the server");
        }
        this.httpServer.close();
        return false;
      }
      return true;
    }
    onAfterServe(rp) {
      if (this.markdownCompiler && rp.ext === ".md") {
        const sourceMarkdown = sysFs.readFileSync(rp.path, { encoding: "utf-8" });
        rp.res.setHeader("Content-type", "text/html");
        rp.res.end(this.markdownToHtml(sourceMarkdown));
        return false;
      }
      return true;
    }
    handleDirectory(rp) {
      const DIR_PREFIX = "?dir";
      if (this.allowDirListing && rp.search === DIR_PREFIX) {
        sysFs.readdir(rp.path, (_err, files) => {
          const slashedPath = rp.path + (rp.path.endsWith("/") ? "" : "/");
          const filesInfo = files.map((file) => {
            const fileName = `${slashedPath}${file}`;
            const url = fileName.substr(1);
            const isDir = sysFs.statSync(fileName).isDirectory();
            return {
              file,
              fileName,
              url,
              isDir
            };
          });
          filesInfo.sort((fa, fb) => {
            return fa.isDir === fb.isDir ? fa.file.localeCompare(fb.file) : fa.isDir ? -1 : 1;
          });
          if (slashedPath !== "./") {
            filesInfo.unshift({
              file: "..",
              fileName: `${slashedPath}..`,
              url: `${slashedPath.substr(1)}../`,
              isDir: true
            });
          }
          const html = `<html>
<head>
<style>
body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,
      sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      color: #24292e;
      background-color: white;
}
</style>
          </head><body>
` + filesInfo.map((fileInf) => {
            const isDir = fileInf.isDir;
            const defaultLinks = [];
            if (isDir) {
              import_http_server.HttpServer.DEFAULT_FILES.forEach((defFile) => {
                const defFileName = `${fileInf.fileName}/${defFile}`;
                if (sysFs.existsSync(defFileName)) {
                  defaultLinks.push(`&nbsp;(<a href="${fileInf.url}/${defFile}">${defFile}</a>)`);
                }
              });
            }
            return !isDir ? `<div><a href="${fileInf.url}">${fileInf.file}</a></div>` : `<div>[<a href="${fileInf.url}${DIR_PREFIX}">${fileInf.file}</a>]${defaultLinks.join("")}</div>`;
          }).join("\n") + "\n</body>\n</html>";
          rp.res.setHeader("Content-type", "text/html");
          rp.res.end(html);
        });
        return false;
      } else {
        return super.handleDirectory(rp);
      }
    }
  }
  HttpServerEx2.ServerEx = ServerEx;
})(HttpServerEx || (HttpServerEx = {}));
//# sourceMappingURL=http-server-ex.js.map
