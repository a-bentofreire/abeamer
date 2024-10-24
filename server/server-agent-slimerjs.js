"use strict";
var Server;
((Server2) => {
  const slimerSystem = require("system");
  const slimerFs = require("fs");
  const slimerWebPage = require("webpage");
  let baseServerAgent;
  try {
    baseServerAgent = require("./server-agent.js").ServerAgent;
  } catch (error) {
    console.error(error);
    phantom.exit(-1);
  }
  class SlimerjsServerAgent extends baseServerAgent.BaseServer {
    exitServer(retValue = 0) {
      super.exitServer();
      phantom.exit(retValue);
    }
    runServer() {
      this.prepareServer();
      const page = slimerWebPage.create();
      function sendClientMsg(cmd, value = "") {
        const script = `_abeamer._internalGetServerMsg.call(_abeamer, '${cmd}', '${value}'); `;
        page.evaluateJavaScript(script);
      }
      page.onConsoleMessage = (msg) => {
        this.handleMessage(
          msg,
          sendClientMsg,
          (outFileName, onDone) => {
            page.render(outFileName, { onlyViewport: true });
            onDone();
          }
        );
      };
      page.onError = (msg) => {
        server.handleError(msg);
      };
      page.viewportSize = this.getViewport();
      page.open(this.getPageUrl()).then((status) => {
        console.log(`open: ${status}`);
        if (this.logLevel) {
          console.log(`Page Loaded: ${status}`);
        }
        if (status !== "success") {
          this.exitServer();
        }
      });
    }
  }
  const server = new SlimerjsServerAgent(
    "slimerjs",
    slimerSystem.args.slice(),
    slimerSystem.os.name,
    slimerFs.workingDirectory,
    slimerFs.exists,
    slimerFs.isDirectory,
    slimerFs.remove,
    slimerFs.makeTree,
    (fileName) => {
      const fileHandle = slimerFs.open(fileName, { mode: "r", charset: "utf-8" });
      const data = fileHandle.read();
      fileHandle.close();
      return data;
    },
    (fileName, data) => {
      const fileHandle = slimerFs.open(fileName, { mode: "w", charset: "utf-8" });
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
//# sourceMappingURL=server-agent-slimerjs.js.map
