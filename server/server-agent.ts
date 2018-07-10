"use strict";
// uuid: 39a65561-5c80-4732-a181-ced25c411e52

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Base server class for other servers agents

/** @module internal | This module is to be read only by developers */

// @WARN: Don't import any nodejs modules nor
// any other modules depending on node modules since it can be called by phantomjs

import { VERSION } from "../shared/version.js";
import { RelConsts } from "../shared/rel-consts.js";
import { Consts as consts } from '../shared/lib/consts.js';
import { OptsParser } from '../shared/opts-parser.js';
import { ServerConsts } from '../shared/lib/server-consts.js';
import { Sprintf } from '../shared/lib/sprintf.js';
import { PluginInjector } from './plugin-injector.js';

/**
 * ## Description
 *
 * A **Render Server Agent** executes a server render, usually a headless web browser,
 * sends order to start rendering, captures the render and saves it into a file.
 *
 */
export namespace ServerAgent {

  const sc = ServerConsts._SRV_CNT;
  const sprintf = Sprintf.sprintf;

  // ------------------------------------------------------------------------
  //                               Consts
  // ------------------------------------------------------------------------

  const DO_PRINT_USAGE = 0;
  const DO_RUN_SERVER = 1;
  const DO_EXIT = 2;

  // ------------------------------------------------------------------------
  //                               Tools
  // ------------------------------------------------------------------------

  export function toPosixSlash(path: string): string {
    return path.replace(/\\/g, '/');
  }

  /** Simple implementation of path.dirname()
   *  PhantomJs/SlimerJS don't support nodejs filesystem
   */

  function dirName(filename: string): string {
    const lastSlash = filename.lastIndexOf('/');
    return lastSlash === -1 ? '.' : filename.substr(0, lastSlash);
  }


  // this function is credited to @Flygenring
  // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
  function getLocalISOTimeDate(): string {
    const tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    return (new Date(Date.now() - tzOffset)).toISOString().substr(0, 19).replace('T', ' ');
  }

  // ------------------------------------------------------------------------
  //                               Server
  // ------------------------------------------------------------------------

  const toExitOnError = true;
  let isFirstFrame = true;


  export abstract class BaseServer {

    reportFileName: string = OptsParser.DEFAULT_OUT_REPORT;
    width: uint = RelConsts.DEFAULT_WIDTH;
    hasArgWidth: boolean = false;
    height: uint = RelConsts.DEFAULT_HEIGHT;
    hasArgHeight: boolean = false;
    timeout: uint = 0;

    maxWidth: uint = OptsParser.DEFAULT_MAX_WIDTH;
    maxHeight: uint = OptsParser.DEFAULT_MAX_HEIGHT;
    maxFps: uint = OptsParser.DEFAULT_MAX_FPS;
    maxFrameCount: uint = OptsParser.DEFAULT_MAX_FRAME_COUNT;
    progress: uint = OptsParser.DEFAULT_PROGRESS;

    url: string = '';
    framesPattern: string = '';
    projDir = '';
    fps = 1;
    logLevel = consts.LL_WARN;
    isVerbose = false;
    toDeletePreviousVersion = false;
    toGenFrames = true;
    toTeleport = false;
    rootPath = '';
    configPath: string = '';
    frameNr = 0;
    frameCount = 0;
    argsVars;
    configFileMode = false;


    constructor(public serverName: string,
      public args: string[],
      public platform: string, public cwd: string,
      public existsSync: (fileName: string) => boolean,
      public isDirectory: (fileName: string) => boolean,
      public unlinkSync: (fileName: string) => void,
      public mkdirpSync: (path: string) => void,
      public readUtf8Sync: (fileName: string) => any,
      public writeFileSync: (fileName: string, data) => void,
      public posixPathJoin: (path1: string, path2: string) => string) {
    }


    exitServer(retValue = 0) {
      if (this.logLevel) { console.log(`Terminating Server`); }
    }


    abstract runServer();


    getSetupVars(): string {
      return this.argsVars ?
        (Object.keys(this.argsVars).map(key =>
          sc.RENDER_VAR_SUFFIX + encodeURIComponent(`${key}=${this.argsVars[key]}`),
        ).join('&') + '&') : '';
    }


    getPageUrl() {
      let pageUrl = this.url
        + (this.url.indexOf('?') === -1 ? '?' : '&')
        + sc.LOG_LEVEL_SUFFIX + this.logLevel + '&'
        + (this.hasArgWidth ? `${sc.WIDTH_SUFFIX}${this.width}&` : '')
        + (this.hasArgHeight ? `${sc.HEIGHT_SUFFIX}${this.height}&` : '')
        + this.getSetupVars()
        + sc.TELEPORT_SUFFIX + this.toTeleport.toString();

      // since this is an fundamental information it should always display
      // even not on verbose mode.
      if (this.logLevel !== 0) {
        console.log(`serverless pageUrl: [${pageUrl}]`);
      }

      // adds the server in separated so it can have a serverless link
      pageUrl += '&' + sc.SERVER_SUFFIX + this.serverName;

      // since this is an fundamental information it should always display
      // even not on verbose mode.
      if (this.logLevel !== 0) {
        console.log(`pageUrl: [${pageUrl}]`);
      }
      return pageUrl;
    }


    getViewport = () => {
      const viewport = {
        width: this.width,
        height: this.height,
      };

      if (this.isVerbose) {
        console.log(`width: ${viewport.width}, height: ${viewport.height}`);
      }
      return viewport;
    }


    /** .json configuration parser */
    private parseJsonConfig(args: string[], cfg: any,
      configFileName: string, argI: int): int {

      const cfgConfigData = cfg['config'];
      if (cfgConfigData) {
        const pCfg = cfgConfigData['abeamer'];
        if (pCfg) {
          args.splice(0, argI + 1);
          argI = 0;
          this.projDir = this.projDir || dirName(configFileName);
          Object.keys(pCfg).forEach(key => {
            switch (key) {
              case 'plugins':
                PluginInjector.plugins = pCfg[key] || [];
                break;
              case 'file':
              case 'report':
              case 'fps':
              case 'out':
              // @WARN: Due security reasons:
              //  config can't not contain max-width, max-height, max-frame-count, max-fps,
              // since these values can be part of a story teleported from the user.
              case 'height':
              case 'width':
                args.push('--' + key, pCfg[key].toString().
                  replace('__PROJDIR__', this.projDir));
                break;
            }
          });
        }
      }
      return argI;
    }


    /** .ini configuration parser */
    private parseIniCfgContent(cfgText: string): { [key: string]: any } {

      const cfg = {};
      // very basic .ini variables parser
      // @TODO: place this code in a external module so it can be used by the library and the cli
      cfgText.split(/\n/).forEach(line =>
        line.replace(/^\s*[\$@]abeamer-([\w+-]+)\s*:\s*"?([^\n"]+)"?\s*;\s*$/,
          (m, p1, p2) => {
            if (this.isVerbose) { console.log(`config: ${p1}=[${p2}]`); }
            cfg[p1] = p2;
            return '';
          }));
      return cfg;
    }


    /** Parses config */
    private parseConfig(args: string[], cfgText: string,
      configFileName: string, argI: int) {

      return this.parseJsonConfig(args, configFileName.match(/\.json$/)
        ? JSON.parse(cfgText)
        : { config: { abeamer: this.parseIniCfgContent(cfgText) } },
        configFileName, argI);
    }

    // ------------------------------------------------------------------------
    //                               Parse Arguments
    // ------------------------------------------------------------------------

    private parseArguments(args: string[]): int {
      let argI = 1;

      const self = this;

      function getConfigFileName(value: string): string {
        let configFileName = toPosixSlash(value);
        if (!configFileName) { return ''; }

        if (self.existsSync(configFileName) && self.isDirectory(configFileName)) {
          configFileName = self.posixPathJoin(configFileName, 'abeamer.ini');
        }

        if (!self.existsSync(configFileName)) {
          throw `Config file ${configFileName} doesn't exists`;
        }
        return configFileName;
      }

      function setFramesPattern(framesPattern?: string): void {
        self.framesPattern = toPosixSlash(framesPattern || OptsParser.DEFAULT_OUT_PATTERN)
          .replace('__PROJDIR__', self.projDir);
        if (self.isVerbose && self.toGenFrames) {
          console.log(`framesPattern: ${self.framesPattern}`);
        }
      }

      function parseOption(option: string, value, multipleValue?): uint {

        switch (option) {

          case '@param':
            parseOption('config', getConfigFileName(toPosixSlash(value)));
            break;

          case 'version':
            console.log(VERSION);
            return DO_EXIT;

          case 'll':
            self.logLevel = value as int;
            self.isVerbose = self.logLevel >= consts.LL_VERBOSE;
            if (self.isVerbose) { console.log(`Args: [${args.join('],[')}]`); }
            break;

          case 'url':
            self.url = value;
            if (self.isVerbose) { console.log(`url: ${self.url}`); }
            break;

          case 'var':
            self.argsVars = multipleValue;
            if (self.isVerbose) { console.log(`var: ${multipleValue}`); }
            break;

          case 'file':
            const filename = toPosixSlash(value);

            // rootPath is added at the beginning to able to generate report
            // without self information due security reasons and provide a sharable report
            let needsRootPath = false;

            const isWin = self.platform.indexOf('win') !== -1;
            if (isWin) {
              needsRootPath = filename[1] !== ':' && filename[2] !== '/';

            } else {
              needsRootPath = filename[0] !== '/';
            }
            if (needsRootPath) { self.rootPath = toPosixSlash(self.cwd) + '/'; }

            self.projDir = dirName(filename);
            if (!self.framesPattern) {
              setFramesPattern();
            }

            if (!self.existsSync(filename)) {
              throw `Page File ${filename} doesn't exists`;
            }

            if (!self.url) {
              self.url = 'file://' + (isWin ? '/' : '') +
                encodeURI(self.rootPath + filename);

              if (self.isVerbose) { console.log(`final url: ${self.url}`); }
            }
            break;

          case 'out':
            setFramesPattern(value);
            break;

          case 'width':
            if (!self.hasArgWidth) {
              self.width = value as int;
              self.hasArgWidth = !self.configFileMode;
              if (self.isVerbose) { console.log(`width: ${self.width}`); }
            }
            break;

          case 'maxWidth':
            self.maxWidth = value as int;
            if (self.isVerbose) { console.log(`maxWidth: ${self.maxWidth}`); }
            break;

          case 'height':
            if (!self.hasArgHeight) {
              self.height = value as int;
              self.hasArgHeight = !self.configFileMode;
              if (self.isVerbose) { console.log(`height: ${self.height}`); }
            }
            break;

          case 'maxHeight':
            self.maxHeight = value as int;
            if (self.isVerbose) { console.log(`maxHeight: ${self.maxHeight}`); }
            break;

          case 'fps':
            self.fps = value as int;
            if (self.isVerbose) { console.log(`fps: ${self.fps}`); }
            break;

          case 'maxFps':
            self.maxFps = value as int;
            if (self.isVerbose) { console.log(`maxFps: ${self.maxFps}`); }
            break;

          case 'maxFrameCount':
            self.maxFrameCount = value as int;
            if (self.isVerbose) { console.log(`maxFrameCount: ${self.maxFrameCount}`); }
            break;

          case 'timeout':
            self.timeout = value as int;
            if (self.isVerbose) { console.log(`timeout: ${self.timeout}`); }
            break;

          case 'progress':
            self.progress = value as int;
            if (self.isVerbose) { console.log(`progress: ${self.progress}`); }
            break;

          case 'allowedPlugins':
            PluginInjector.loadAllowedPlugins(value,
              self.existsSync, self.readUtf8Sync);
            break;

          case 'injectPage':
            PluginInjector.injectPage = value;
            if (self.isVerbose) { console.log(`injectPage: ${value}`); }
            break;

          case 'teleport':
            self.toTeleport = true;
            break;

          case 'dp':
            self.toDeletePreviousVersion = true;
            break;

          case 'noframes':
            self.toGenFrames = false;
            break;

          case 'report':
            self.reportFileName = value;
            break;

          case 'server':
            self.serverName = value;
            break;

          case 'config':
            const configFileName = getConfigFileName(value);
            if (!configFileName) { return 0; }

            if (self.isVerbose) { console.log(`Loading Config ${configFileName}`); }
            if (!self.existsSync(configFileName)) {
              throw `Config ${configFileName} doesn't exists`;
            }
            self.configPath = dirName(configFileName) + '/';

            // @TODO: Investigate how to make an async version of load the config
            const configFile = self.readUtf8Sync(configFileName);

            const injectArgs = [];
            let injectArgI = 0;
            self.parseConfig(injectArgs, configFile, configFileName, argI);

            // injects the config as args to the main loop
            self.configFileMode = true;
            try {
              OptsParser.iterateArgOpts(true, () => injectArgs[injectArgI++],
                parseOption,
              );
            } finally {
              self.configFileMode = false;
            }
            break;
        }
      }

      const res = OptsParser.iterateArgOpts(true, () => args[argI++], parseOption);
      if (res) { return res; }
      if (this.url) {
        if (this.projDir && !this.framesPattern) { setFramesPattern(); }
        return (this.framesPattern ? DO_RUN_SERVER : DO_PRINT_USAGE);
      }
      return DO_PRINT_USAGE;
    }


    /**
     * Parse Arguments is async to later provide async config loading
     * @param callback
     */
    parseArgumentsAsync(callback: (res: int) => void) {
      callback(this.parseArguments(this.args));
    }

    // ------------------------------------------------------------------------
    //                               Message Handler
    // ------------------------------------------------------------------------

    handleMessage(msg: string,
      sendClientMsg: (cmd: string, value?: string) => void,
      takeScreenshot: (outFileName: string, onDone: () => void) => void) {

      const self = this;

      function renderDone(): void {
        self.frameNr++;
        if (self.frameNr >= self.frameCount) { self.frameCount = self.frameNr + 1; }
        sendClientMsg(sc.MSG_RENDER_DONE);
      }

      if (msg.indexOf(sc.MESSAGE_PREFIX) === 0) {

        try {
          msg = msg.substr(sc.MESSAGE_PREFIX.length);
          const parts = msg.split(sc.CMD_VALUE_SEP);
          const cmd = parts[0];
          const value = parts.length === 2 ? parts[1] : '';

          if (this.isVerbose) { console.log(`Cmd: ${cmd}, Value: ${value}`); }

          switch (cmd) {

            case sc.MSG_READY:
              sendClientMsg(sc.MSG_SERVER_READY);
              break;

            case sc.MSG_RENDER:
              const frameFileName = sprintf(this.framesPattern, this.frameNr);

              if (this.toGenFrames) {
                // creates output tree if doesn't exists
                if (isFirstFrame) {
                  isFirstFrame = false;

                  const matches = frameFileName.match(/^(.+)\/([^/]+)$/);
                  if (matches) {
                    const framesFolder = matches[1];
                    if (!this.existsSync(framesFolder)) {
                      if (this.isVerbose) {
                        console.log(`Creating Folder: ${framesFolder}`);
                      } else if (this.logLevel > consts.LL_SILENT) {
                        console.log(`Creating Story frames on: ${framesFolder}`);
                      }
                      this.mkdirpSync(framesFolder);
                    }
                  }
                }

                takeScreenshot(this.rootPath + frameFileName, () => {
                  if (this.isVerbose) { console.log(`Saved: ${frameFileName}`); }
                  if (this.progress > 0 && this.frameNr % this.progress === 0) {
                    console.log(new Array(2 + (this.frameNr / this.progress))
                      .join('▒') + ` ${this.frameNr} frames`);
                  }
                  renderDone();
                });

              } else {
                renderDone();
              }
              break;

            case sc.MSG_RENDER_FINISHED:
              this.generateReport();
              break;

            case sc.MSG_SET_FRAME_NR:
              this.frameNr = parseInt(value);
              if (this.isVerbose) { console.log(`frame-nr: ${this.frameNr}`); }
              this.checkForValidFrame(this.frameNr, true, `Invalid number frame nr`);
              break;

            case sc.MSG_SET_FRAME_COUNT:
              this.frameCount = parseInt(value);
              if (this.isVerbose) { console.log(`frame-count: ${this.frameCount}`); }
              this.checkForValidFrame(this.frameCount, false, `Invalid number of frames count`);
              break;

            case sc.MSG_SET_FPS:
              this.fps = parseInt(value);
              if (this.isVerbose) { console.log(`fps: ${this.fps}`); }
              this.checkForValidFps();
              break;

            case sc.MSG_LOG_MSG:
              console.log(value);
              break;

            case sc.MSG_LOG_WARN:
              console.warn(value);
              break;

            case sc.MSG_LOG_ERROR:
              console.error(value);
              break;

            case sc.MSG_TELEPORT:
              const storyFileName = (this.configPath ? this.configPath :
                this.rootPath) + 'story.json';
              console.log(`Created ${storyFileName}`);
              this.writeFileSync(storyFileName, value);
              this.exitServer();
              break;

            case sc.MSG_EXIT:
              this.exitServer();
              break;
          }
        } catch (error) {
          self.handleError(error.message);
        }
      }
    }

    // ------------------------------------------------------------------------
    //                               Handle Errors
    // ------------------------------------------------------------------------

    handleError(msg: string) {
      console.error(msg);
      if (toExitOnError) { this.exitServer(OptsParser.ON_ERROR_EXIT_VALUE); }
    }

    // ------------------------------------------------------------------------
    //                               Prepare Server
    // ------------------------------------------------------------------------

    // security checks
    checkForValidFps() {
      if (this.fps <= 0 || this.fps > this.maxFps) {
        throw `Invalid number of frames per second`;
      }
    }


    // security checks
    checkForValidFrame(frameNr: uint, allowZero: boolean, errorMsg: string) {
      if ((allowZero || !frameNr) || frameNr < 0 || frameNr > this.maxFrameCount) {
        throw errorMsg;
      }
    }


    prepareServer() {

      PluginInjector.inject(this.existsSync, this.readUtf8Sync, this.writeFileSync);

      if (this.width <= 0 || this.width > this.maxWidth
        || this.height <= 0 || this.height > this.maxHeight) {
        throw `Invalid frame output size`;
      }

      this.checkForValidFps();

      if (this.toDeletePreviousVersion) {
        if (this.isVerbose) { console.log(`Deleting previous frames`); }
        let frameI = this.frameNr;
        while (true) {
          const frameFileName = sprintf(this.framesPattern, frameI);
          if (this.isVerbose) { console.log(`frameFileName: ${frameFileName}`); }
          if (this.existsSync(frameFileName)) {
            this.unlinkSync(frameFileName);
          } else {
            break;
          }
          frameI++;
        }
      }
    }

    // ------------------------------------------------------------------------
    //                               Generate Report
    // ------------------------------------------------------------------------

    generateReport() {
      if (this.reportFileName && this.toGenFrames) {
        const framesDir = dirName(this.framesPattern);
        this.reportFileName = this.reportFileName.
          replace('__FRAMES_DIR__', framesDir);

        let framesPattern = this.framesPattern;
        // removes the absolute path due security issues
        if (framesDir === framesPattern.substr(0, framesDir.length)) {
          framesPattern = './' + framesPattern.substr(framesDir.length + 1);
        }

        const report = {
          width: this.width,
          height: this.height,
          fps: this.fps,
          framecount: this.frameCount,
          // @HINT: Doesn't include the absolute path for security reasons
          framespattern: framesPattern,
          timestamp: getLocalISOTimeDate(),
        };
        this.mkdirpSync(dirName(this.reportFileName));
        this.writeFileSync(this.reportFileName, JSON.stringify(report, null, 2));
        if (this.isVerbose) { console.log(`Generated Report ${this.reportFileName}`); }
        console.log(`Generated ${this.frameCount} frames`);
      }
    }

    // ------------------------------------------------------------------------
    //                               Start
    // ------------------------------------------------------------------------

    start() {
      try {
        this.parseArgumentsAsync((res) => {
          switch (res) {
            case DO_PRINT_USAGE:
              OptsParser.printUsage();
              break;
            case DO_RUN_SERVER:
              this.prepareServer();
              this.runServer();
              break;
            case DO_EXIT:
              break;
          }
        });
      } catch (error) {
        console.log(`Server Error: ${error.message || error.toString()}`);
        this.exitServer(OptsParser.ON_ERROR_EXIT_VALUE);
        // throw error;
      }
    }
  }
}
