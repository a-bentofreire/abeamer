"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Server executed within the context of puppeteer (chrome-headless)

import * as sysFs from "fs";
import * as sysProcess from "process";
import * as sysOs from "os";
import * as sysPath from "path";
import * as puppeteer from "puppeteer";

import { fsix } from "../shared/vendor/fsix.js";
import { OptsParser } from "../shared/opts-parser.js";
import { ServerAgent as baseServerAgent } from './server-agent.js';

namespace ServerAgent {

  // ------------------------------------------------------------------------
  //                               Global Vars
  // ------------------------------------------------------------------------

  let browser: puppeteer.Browser;

  class PuppeteerServerAgent extends baseServerAgent.BaseServer {

    exitServer(_retValue = 0) {
      super.exitServer();
      if (browser) { browser.close(); }
    }


    runServer() {
      _runServer();
    }
  }


  const args = sysProcess.argv.slice();
  args.splice(0, 1);
  const server = new PuppeteerServerAgent('puppeteer',
    args,
    sysOs.platform(), sysProcess.cwd(),
    sysFs.existsSync,
    (fileName: string) => sysFs.statSync(fileName).isDirectory(),
    sysFs.unlinkSync,
    fsix.mkdirpSync,
    fsix.readUtf8Sync,
    sysFs.writeFileSync,
    sysPath.posix.join);
  server.start();

  // ------------------------------------------------------------------------
  //                               Run Server
  // ------------------------------------------------------------------------

  async function _runServer(): Promise<void> {

    const chromeBin = sysProcess.env['CHROME_BIN'];

    if (chromeBin && server.isVerbose) {
      console.log(`chromeBin: ${chromeBin}`);
    }

    browser = await puppeteer.launch(chromeBin ? {
      executablePath: chromeBin,

      // @TODO: Find more options to make chrome faster and more stable.
      /* spell-checker: disable */
      args: [
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-sync',
        '--disable-translate',
        '--enable-fast-unload',
        '--disable-cloud-import',
        '--safebrowsing-disable-auto-update',
        '--no-user-gesture-required',
        '--enable-font-antialiasing',
        '--ignore-autoplay-restrictions',
        '--autoplay-policy=no-user-gesture-required',
        '--safebrowsing-disable-auto-update',
        '--no-default-browser-check',
      ],
    }
      : undefined);
    const page = await browser.newPage();

    /** Sends Messages to the client */
    async function sendClientMsg(cmd: string, value: string = ''): Promise<void> {
      await page.evaluate((_cmd, _value) => {
        _abeamer._internalGetServerMsg.call(_abeamer, _cmd, _value);
      }, cmd, value);
    }

    /** Receives Client Messages */
    page
      .on('console', (e: puppeteer.ConsoleMessage) => {

        server
          .handleMessage(e.text(), sendClientMsg,
            (outFileName: string, onDone: () => void) => {
              page.screenshot({
                path: outFileName,
                omitBackground: true,
              })
                .then(() => {
                  onDone();
                });
            });
      })

      .on('pageerror', (errMsg: string) => {
        server.handleError(errMsg);
      })

      .on('error', (e: Error) => {
        server.handleError(e.message);
      });

    // ------------------------------------------------------------------------
    //                               Page Loader
    // ------------------------------------------------------------------------

    page.setViewport(server.getViewport());

    await page.goto(server.getPageUrl(),
      { timeout: server.timeout })

      .then((value: puppeteer.Response) => {
        const status = value.status();
        if (server.isVerbose) { console.log(`Page Loaded: ${status}`); }
        if (status !== 200 && status !== 0) {
          server.exitServer(OptsParser.ON_ERROR_EXIT_VALUE);
        }
      })
      .catch((reason) => {
        console.error(`Page Loaded Error`);
        console.error(reason);
        server.exitServer(OptsParser.ON_ERROR_EXIT_VALUE);
      });
  }

  sysProcess.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });

}
