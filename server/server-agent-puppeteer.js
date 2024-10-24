"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var sysFs = __toESM(require("fs"));
var sysProcess = __toESM(require("process"));
var sysOs = __toESM(require("os"));
var sysPath = __toESM(require("path"));
var puppeteer = __toESM(require("puppeteer"));
var import_fsix = require("../shared/vendor/fsix.js");
var import_opts_parser = require("../shared/opts-parser.js");
var import_server_agent = require("./server-agent.js");
var ServerAgent;
((ServerAgent2) => {
  let browser;
  class PuppeteerServerAgent extends import_server_agent.ServerAgent.BaseServer {
    exitServer(_retValue = 0) {
      super.exitServer();
      if (browser) {
        browser.close();
      }
    }
    runServer() {
      _runServer();
    }
  }
  const args = sysProcess.argv.slice();
  args.splice(0, 1);
  const server = new PuppeteerServerAgent(
    "puppeteer",
    args,
    sysOs.platform(),
    sysProcess.cwd(),
    sysFs.existsSync,
    (fileName) => sysFs.statSync(fileName).isDirectory(),
    sysFs.unlinkSync,
    import_fsix.fsix.mkdirpSync,
    import_fsix.fsix.readUtf8Sync,
    sysFs.writeFileSync,
    sysPath.posix.join
  );
  server.start();
  async function _runServer() {
    const chromeBin = sysProcess.env["CHROME_BIN"];
    if (chromeBin && server.isVerbose) {
      console.log(`chromeBin: ${chromeBin}`);
    }
    browser = await puppeteer.launch(chromeBin ? {
      executablePath: chromeBin,
      // @TODO: Find more options to make chrome faster and more stable.
      /* spell-checker: disable */
      args: [
        "--disable-extensions",
        "--disable-default-apps",
        "--disable-popup-blocking",
        "--disable-sync",
        "--disable-translate",
        "--enable-fast-unload",
        "--disable-cloud-import",
        "--safebrowsing-disable-auto-update",
        "--no-user-gesture-required",
        "--enable-font-antialiasing",
        "--ignore-autoplay-restrictions",
        "--autoplay-policy=no-user-gesture-required",
        "--safebrowsing-disable-auto-update",
        "--no-default-browser-check"
      ]
    } : void 0);
    const page = await browser.newPage();
    async function sendClientMsg(cmd, value = "") {
      await page.evaluate((_cmd, _value) => {
        _abeamer._internalGetServerMsg.call(_abeamer, _cmd, _value);
      }, cmd, value);
    }
    page.on("console", (e) => {
      server.handleMessage(
        e.text(),
        sendClientMsg,
        (outFileName, onDone) => {
          page.screenshot({
            path: outFileName,
            omitBackground: true
          }).then(() => {
            onDone();
          });
        }
      );
    }).on("pageerror", (errMsg) => {
      server.handleError(errMsg);
    }).on("error", (e) => {
      server.handleError(e.message);
    });
    page.setViewport(server.getViewport());
    await page.goto(
      server.getPageUrl(),
      { timeout: server.timeout }
    ).then((value) => {
      const status = value.status();
      if (server.isVerbose) {
        console.log(`Page Loaded: ${status}`);
      }
      if (status !== 200 && status !== 0) {
        server.exitServer(import_opts_parser.OptsParser.ON_ERROR_EXIT_VALUE);
      }
    }).catch((reason) => {
      console.error(`Page Loaded Error`);
      console.error(reason);
      server.exitServer(import_opts_parser.OptsParser.ON_ERROR_EXIT_VALUE);
    });
  }
  sysProcess.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error.message);
  });
})(ServerAgent || (ServerAgent = {}));
//# sourceMappingURL=server-agent-puppeteer.js.map
