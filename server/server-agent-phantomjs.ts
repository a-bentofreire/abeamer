"use strict";
// uuid: 2460e386-36d9-49ec-afd6-30963ab2e387

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// This file is executed within the context of phantomjs/slimerjs

// @WARN: Don't use TypeScript modules due the fact this file is
// executed on the context of phantomjs


namespace Server {

  const phantomSystem = require('system') as System;
  const phantomFs = require('fs') as FileSystem;
  const phantomWebPage = require('webpage');

  let baseServerAgent/* : ABeamerServer.BaseServer */;

  // @HINT: Must surround with try/catch otherwise it will block in case of error
  try {
    baseServerAgent = require('./server-agent.js').Server;

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

      const page = phantomWebPage.create() as WebPage;

      /** Sends Messages to the client */
      function sendClientMsg(cmd: string, value: string = '') {
        const script = `function(){_abeamer._internalGetServerMsg.call(_abeamer, '${cmd}', '${value}'); }`;
        page.evaluateJavaScript(script);
      }


      /** Receives Client Messages */
      page.onConsoleMessage = (msg: string) => {

        this.handleMessage(msg, sendClientMsg,
          (outFileName: string, onDone: () => void) => {
            page.render(outFileName);
            onDone();
          });
      };


      /** Handles browser errors */
      page.onError = (msg: string, trace: string[]): any => {
        server.handleError(msg);
      };

      // ------------------------------------------------------------------------
      //                               Page Loader
      // ------------------------------------------------------------------------

      page.viewportSize = this.getViewport();

      page.open(this.getPageUrl(),
        (status) => {
          if (this.logLevel) { console.log(`Page Loaded: ${status}`); }
          if (status.indexOf('fail') !== -1) { this.exitServer(); }
        });
    }
  }


  const server = new (PhantomjsServerAgent as any)('phantomjs',
    phantomSystem.args.slice(),
    phantomSystem.os.name, phantomFs.workingDirectory, phantomFs.exists,
    phantomFs.remove,
    phantomFs.makeTree,

    (fileName: string) => {
      const fileHandle = phantomFs.open(fileName, { mode: 'r', charset: 'utf-8' });
      const data = fileHandle.read();
      fileHandle.close();
      return data;
    },

    (fileName: string, data) => {
      const fileHandle = phantomFs.open(fileName, { mode: 'w', charset: 'utf-8' });
      fileHandle.write(data);
      fileHandle.close();
    },

    (path1: string, path2: string) => {
      path1 = path1.replace(/\/$/, '');
      return path1 + path2;
    }) as PhantomjsServerAgent;
  server.start();
}
