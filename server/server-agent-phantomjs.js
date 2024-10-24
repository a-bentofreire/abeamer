"use strict";
var Server;
((Server2) => {
  const phantomSystem = require("system");
  const phantomFs = require("fs");
  const phantomWebPage = require("webpage");
  let baseServerAgent;
  try {
    baseServerAgent = require("./server-agent.js").ServerAgent;
  } catch (error) {
    console.error(error);
    phantom.exit(-1);
  }
  class PhantomjsServerAgent extends baseServerAgent.BaseServer {
    exitServer(retValue = 0) {
      super.exitServer();
      phantom.exit(retValue);
    }
    runServer() {
      this.prepareServer();
      const page = phantomWebPage.create();
      function sendClientMsg(cmd, value = "") {
        const script = `function(){_abeamer._internalGetServerMsg.call(_abeamer, '${cmd}', '${value}'); }`;
        page.evaluateJavaScript(script);
      }
      page.onConsoleMessage = (msg) => {
        this.handleMessage(
          msg,
          sendClientMsg,
          (outFileName, onDone) => {
            page.render(outFileName);
            onDone();
          }
        );
      };
      page.onError = (msg) => {
        server.handleError(msg);
      };
      page.viewportSize = this.getViewport();
      page.open(
        this.getPageUrl(),
        (status) => {
          if (this.logLevel) {
            console.log(`Page Loaded: ${status}`);
          }
          if (status.indexOf("fail") !== -1) {
            this.exitServer();
          }
        }
      );
    }
  }
  const server = new PhantomjsServerAgent(
    "phantomjs",
    phantomSystem.args.slice(),
    phantomSystem.os.name,
    phantomFs.workingDirectory,
    phantomFs.exists,
    phantomFs.isDirectory,
    phantomFs.remove,
    phantomFs.makeTree,
    (fileName) => {
      const fileHandle = phantomFs.open(fileName, { mode: "r", charset: "utf-8" });
      const data = fileHandle.read();
      fileHandle.close();
      return data;
    },
    (fileName, data) => {
      const fileHandle = phantomFs.open(fileName, { mode: "w", charset: "utf-8" });
      fileHandle.write(data);
      fileHandle.close();
    },
    (path1, path2) => {
      path1 = path1.replace(/\/$/, "");
      return path1 + "/" + path2;
    }
  );
  server.start();
})(Server || (Server = {}));
//# sourceMappingURL=server-agent-phantomjs.js.map
