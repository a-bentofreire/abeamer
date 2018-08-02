#!/usr/bin/env node
"use strict";
// uuid: b88b17e7-5918-44f7-82f7-f0e80c242a82

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// @TODO: implement inject plugins

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysProcess from "process";
import { spawn as sysSpawn } from "child_process";

import { OptsParser } from "../shared/opts-parser.js";
import { fsix } from "../shared/vendor/fsix.js";
import { VERSION } from "../shared/version.js";
import { Consts } from "../shared/lib/consts.js";
import { RelConsts } from "../shared/rel-consts.js";
import { HttpServerEx } from "../shared/vendor/http-server-ex.js";

// @doc-name Command Line
/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * **ABeamer** command line utility is used to:
 *
 * 1. create projects: `abeamer create`.
 * 2. launch a live server: `abeamer serve`.
 * 3. render the project to disk: `abeamer render`.
 * 4. create gifs: `abeamer gif`.
 * 5. create movies: `abeamer movie`.
 *
 * ## Examples
 *
 *  Creates a TypeScript/JavaScript project.
 *  `abeamer create foo --width 720 --height 480 --fps 20`.
 *
 *  Creates a JavaScript project without TypeScript.
 *  `abeamer create foo-js --width 384 --height 288 --fps 30 --no-typescript`.
 *
 *  Starts the live server on port 9000. The url is `http://localhost:9000/`.
 * `abeamer serve`.
 *
 *  Starts the live server with list directory option if search part of url is `?dir`.
 *  The url is `http://localhost:9000/?dir`
 * `abeamer serve --list-dir`.
 *
 *  Starts the live server on port 8000. The url is `http://localhost:8000/`.
 * `abeamer serve --port 8000`.
 *
 *  Generate the animations in file image sequences from the project in the current directory.
 * `abeamer render`.
 *
 *  Same as above, but deletes the previous images and the project is on directory `foo`.
 * `abeamer render --dp foo`.
 *
 *  Same as the first render, but it renders from a live server.
 *  Required if it's loading `.json` files or is teleporting.
 * `abeamer render --url http://localhost:9000/foo/index.html`
 *
 *  Generates only the `story.json` file, it doesn't generates the file image sequence.
 *  This should be used only for testing. Teleporting should be done from the web browser library,
 *  and the teleported story via Ajax to the cloud.
 * `abeamer render --url http://localhost:9000/foo/index.html --teleport`
 *
 *  Same as the first render, but with verbose logging.
 * `abeamer render --ll 3 --dp foo`.
 *
 *  Creates an animated gif from the previous generated image sequence on `foo/story-frames/story.gif`.
 * `abeamer gif foo/`.
 *  Requires that imagemagick `convert` to be on the search path, or set `IM_CONVERT_BIN=<absolute-path-to-executable>`
 *
 *  Creates an animated gif from the previous generated image sequence on `hello.gif`.
 * `abeamer gif foo/ --gif hello.gif`.
 *
 *  Creates an animated gif without looping.
 * `abeamer gif foo/ --loop 1`.
 *
 *  Creates a movie from the previous generated image sequence on `foo/story-frames/movie.mp4`.
 * `abeamer movie foo/`.
 *  Requires that `ffmpeg` to be on the search path, or set `FFMPEG_BIN=<absolute-path-to-executable>`
 *
 *  Creates the movie `foo/story.webm`.
 * `abeamer movie foo/ --movie foo/story.webm`.
 *
 *  Creates a movie from the previous generated image sequence using `foo/bkg-movie.mp4` as a background.
 * `abeamer movie foo/ --bkg-movie foo/bkg-movie.mp4`.
 */
namespace Cli {
  // ------------------------------------------------------------------------
  //                               Global Vars
  // ------------------------------------------------------------------------

  const DO_PRINT_USAGE = 0;
  const DO_RUN_COMMAND = 1;
  const DO_EXIT = 2;
  const DEFAULT_PORT = 9000;

  const CMD_CHECK = 'check';
  const CMD_CREATE = 'create';
  const CMD_SERVE = 'serve';
  const CMD_RENDER = 'render';
  const CMD_GIF = 'gif';
  const CMD_MOVIE = 'movie';

  const DEFAULT_GIF_NAME = 'story.gif';
  const DEFAULT_MOVIE_NAME = 'story.mp4';
  const DEFAULT_BACKGROUND = 'white';
  const MANUAL_BACKGROUND = 'manual';

  let logLevel = Consts.LL_ERROR;
  let isVerbose = false;
  let cmdName = '';
  let cmdParam = '';
  const outArgs: string[] = [];
  const isWin = sysProcess.platform === 'win32';

  const argOpts = OptsParser.argOpts;

  argOpts['port'] = {
    param: 'int', desc:
      `port for serve command. default is ${DEFAULT_PORT}`,
  };

  argOpts['gif'] = {
    param: 'string', desc:
      `output gif filename. default is ${DEFAULT_GIF_NAME}`,
  };

  argOpts['movie'] = {
    param: 'string', desc:
      `output movie filename. default is ${DEFAULT_MOVIE_NAME}`,
  };

  argOpts['bkgMovie'] = {
    param: 'string', desc:
      `movie filename to be used as background to blend with transparent images`,
  };

  argOpts['noPlugins'] = {
    desc:
      `creates a project without plugins`,
  };

  argOpts['noTypescript'] = {
    desc:
      `creates a project without TypeScript files`,
  };

  argOpts['listDir'] = {
    desc:
      `serve command lists the directory contents if url has the querystring '?dir'`,
  };

  argOpts['loop'] = {
    param: 'string', desc:
      `defines how many times a gif will loop. set to -1 if you don't won't it to loop`,
  };

  argOpts['moviePre'] = {
    param: 'array', allowOption: true, desc:
      `arguments to be passed to ffmpeg before the arguments passed by abeamer`,
  };

  argOpts['moviePost'] = {
    param: 'array', allowOption: true, desc:
      `arguments to be passed to ffmpeg after the arguments passed by abeamer`,
  };

  argOpts['gifPre'] = {
    param: 'array', allowOption: true, desc:
      `arguments to be passed to gif generator(convert) before the arguments passed by abeamer`,
  };

  argOpts['gifPost'] = {
    param: 'array', allowOption: true, desc:
      `arguments to be passed to gif generator(convert) after the arguments passed by abeamer`,
  };

  argOpts['gifBackground'] = {
    param: 'string', desc:
      `background color used to replace the alpha channel in gif generation.
if this is value is set to "${MANUAL_BACKGROUND}" , no parameters relating are passed to the gif generator.
default is ${MANUAL_BACKGROUND}`,
  };

  // ------------------------------------------------------------------------
  //                               Print Usage
  // ------------------------------------------------------------------------

  function printUsage(): void {
    console.log(`abeamer [command] [options] [project-name|report-name]
The commands are:
    ${CMD_CHECK} checks if the all requirements are installed and configured
    ${CMD_CREATE} creates a project with project-name
    ${CMD_SERVE}  starts a live server. Use it in case you need to load the config from JSON file
    ${CMD_RENDER} runs your project in the context of the headless browser.
    ${CMD_GIF}    creates an animated gif from the project-name or report-name
    ${CMD_MOVIE}  creates a movie from the project-name or report-name

    e.g.
      echo "checks if chrome, puppeteer, imagemagick, ffmpeg are installed and configured"
      abeamer ${CMD_CHECK}

      echo "create folder foo and copy necessary files"
      abeamer ${CMD_CREATE} --width 640 --height 480 --fps 25 foo

      cd foo

      echo "start a live server"
      echo "only required if you need to load your configuration from json file"
      abeamer ${CMD_SERVE}

      echo "generates the png files and a report on story-frames folder"
      abeamer ${CMD_RENDER}

      echo "creates story.gif file on story-frames folder"
      abeamer ${CMD_GIF}

      echo "creates story.mp4 file on story-frames folder"
      abeamer ${CMD_MOVIE}

      For more information, read:
      https://www.abeamer.com/docs/end-user/versions/latest/en/site/abeamer-cli/

`);
    OptsParser.printUsage();
  }

  // ------------------------------------------------------------------------
  //                               Fix Folder Name
  // ------------------------------------------------------------------------

  // function fixFolderName(folderName: string): string {
  //   folderName = fsix.toPosixSlash(folderName);
  //   if (folderName.search(/^.\/?$/) !== -1) {
  //     sysProcess.cwd()
  //   }
  //   return folderName;
  // }

  // ------------------------------------------------------------------------
  //                               Parse Arguments
  // ------------------------------------------------------------------------

  function parseArguments(): uint {
    const args: string[] = sysProcess.argv;
    let argI = 1;
    // @TODO: Improve this code
    while (args[argI - 1].search(/abeamer/) === -1) { argI++; }

    cmdName = args[argI++];
    if (!cmdName) {
      return DO_PRINT_USAGE;
    } else if (cmdName === '--version') {
      console.log(VERSION);
      return DO_EXIT;
    }

    return OptsParser.iterateArgOpts(true, () => args[argI++],
      (option, value) => {

        switch (option) {
          case '@param':
            cmdParam = value as string;
            outArgs.push(cmdParam);
            return;

          case 'version':
            console.log(VERSION);
            return DO_EXIT;

          case 'll':
            logLevel = value as int;
            isVerbose = logLevel >= Consts.LL_VERBOSE;
            if (isVerbose) {
              console.log(`Args: [${args.join('],[')}]`);
              console.log(`Current Path: ${sysProcess.cwd()}`);
            }
            break;
        }

        switch (cmdName) {
          case CMD_RENDER:
            outArgs.push('--' + option);
            if (value) {
              /* if (OptsParser.argOpts[option].param === 'string') {
                value = `"${value}"`;
              } */
              outArgs.push(value as string);
            }
            break;
        }

      },
    ) || DO_RUN_COMMAND;
  }

  // ------------------------------------------------------------------------
  //                               Runs External Commands
  // ------------------------------------------------------------------------

  function runSpawn(cmdLine: string, args: string[], callback?): void {

    if (isVerbose) {
      console.log(`spawn cmdLine: ${cmdLine}`);
      console.log(`args: ${args.join(' ')}`);
    }

    const ls = sysSpawn(cmdLine, args);

    ls.stdout.on('data', (data) => {
      if (logLevel >= Consts.LL_SILENT) { console.log(data.toString()); }
    });

    ls.stderr.on('data', (data) => {
      if (logLevel >= Consts.LL_SILENT) { console.error(data.toString()); }
    });

    ls.on('close', (code) => {
      callback();
    });
  }

  // ------------------------------------------------------------------------
  //                                Command: Check
  // ------------------------------------------------------------------------

  function commandCheck(): void {

    let checkCount = 0;
    const TOTAL_CHECK_COUNT = 5;

    function displayCheck(what: string, passed: boolean, failedMsg: string): void {
      checkCount++;
      console.log(`${checkCount}. Check: ${what} --> ${passed ? 'OK' : 'Failed'}`);
      if (!passed) {
        console.log('  TODO:' + failedMsg + '\n');
      }
      if (checkCount === TOTAL_CHECK_COUNT) {
        console.log('\n');
      }
    }

    function addToStartUp(passed: boolean, key: string, value: string,
      failedMsg: string): void {

      displayCheck(`${key}=${value}`, passed, `
    ${failedMsg}
    Add to the shell startup script:
${isWin ? 'SET' : 'export'} ${key}=${value}`);
    }

    function checkProgramIsValid(envKey: string, appName: string,
      versionParam: string, matchRegEx: RegExp, requireMsg: string): void {

      function displayResult(passed: boolean): void {
        displayCheck(appName, passed, `
    ABeamer requires ${requireMsg}
    Either add the executable to the system path, or add to the shell startup script:
${isWin ? 'set' : 'export'} ${envKey}=<absolute-path-to-${appName}>`);
      }

      const envValue = sysProcess.env[envKey];

      if (!envValue) {
        fsix.runExternal(`${appName} ${versionParam}`,
          (error, stdout, stderr) => {
            displayResult(stderr === '' && stdout.match(matchRegEx));
          });
      } else {
        displayResult(sysFs.existsSync(envValue));
      }
    }


    console.log(`\nChecking:\n`);
    addToStartUp((sysProcess.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] || '').toLowerCase() === 'true',
      'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD', 'TRUE',
      'by default puppeteer downloads Chromium which is doesn\'t support many features');

    const chromeBin = sysProcess.env['CHROME_BIN'];
    if (!chromeBin) {
      addToStartUp(false, 'CHROME_BIN', '<chrome-path>',
        'puppeteer uses by default Chromium, set CHROME_BIN with the absolute path to chrome web browser executable');
    } else {
      addToStartUp(sysFs.existsSync(chromeBin), 'CHROME_BIN', '<chrome-path>',
        'CHROME_BIN points to a missing chrome executable');
    }
    checkProgramIsValid('FFMPEG_BIN', 'ffmpeg', '-version', /ffmpeg version/,
      'ffmpeg to generate movies');
    checkProgramIsValid('IM_CONVERT_BIN', 'convert', '--version', /Version: ImageMagick/,
      'ImageMagick convert program to generate gifs');

    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (error) {
    }
    displayCheck('puppeteer', puppeteer, `
   ABeamer requires puppeteer. Install using the following command
npm i puppeteer`);
  }

  // ------------------------------------------------------------------------
  //                                Command: Create
  // ------------------------------------------------------------------------

  function commandCreate(): void {

    const projName = fsix.toPosixSlash(cmdParam);

    if (!projName) {
      throw `Missing project name`;
    }

    if (projName[0] === '-' || projName.search(/[\"\'\?\*\+]/) !== -1
      || projName.search(/^[\.\/]+$/) !== -1) {
      throw `Error: ${projName} is not valid project name`;
    }

    if (sysFs.existsSync(projName)) {
      throw `Error: Project ${projName} already exists`;
    }

    if (projName.includes('/')) {
      const dirname = sysPath.posix.dirname(projName);
      fsix.mkdirpSync(dirname);
    }

    const ROOT_PATH = fsix.toPosixSlash(__dirname) + '/..';
    const TEMPLATE_PATH = ROOT_PATH + '/gallery/hello-world';
    const LIB_PATH = ROOT_PATH + '/client/lib';
    const width = argOpts.width.value || RelConsts.DEFAULT_WIDTH;
    const height = argOpts.height.value || RelConsts.DEFAULT_HEIGHT;
    const fps = argOpts.fps.value || RelConsts.DEFAULT_FPS;
    const noPlugins = argOpts['noPlugins'].hasOption;
    const noTypescript = argOpts['noTypescript'].hasOption;

    copyTree(TEMPLATE_PATH, projName, (text, fileName) => {

      const fileBase = sysPath.basename(fileName);
      switch (fileBase) {
        case 'main.js':
        case 'main.ts':
          if (noTypescript) {
            text = text.replace(/^.*sourceMappingURL=.*$/m, '');
          }

          text = text.replace(/createStory\([^)]*\)/, `createStory(/*FPS:*/${fps})`);
          break;

        case 'abeamer.ini':
          text = text.replace(/width:\s*\d+/, `width: ${width}`)
            .replace(/height:\s*\d+/, `height: ${height}`);
          break;

        case 'main.min.css':
          text = text.replace(/.abeamer-scene{width:\d+px;height:\d+px}/,
            `.abeamer-scene{width:${width}px;height:${height}px}`);

          break;
        case 'index.html':

          // inserts the plugins.
          if (!noPlugins) {
            const plugins = fsix.loadJsonSync(`${ROOT_PATH}/client/lib/plugins/plugins-list.json`);
            let pre = '';
            let post = '';
            text.replace(/^(.*)js\/abeamer\.min\.js(.*)$/m, (app, _pre, _post) => {
              pre = _pre;
              post = _post;
              return '';
            });

            text = text.replace(/^(.*js\/main\.js.*)$/m, (all) => {
              return `\n          <!-- remove the unnecessary plugins -->\n`
                + plugins.map(plugin => `${pre}plugins/${plugin}/${plugin}.js${post}`).join('\n')
                + '\n\n' + all;
            });
          }
          break;
      }

      return text;
    },
      (fileBase: string) => {
        if (noTypescript && fileBase.match(/(?:js\.map|\.ts|tsconfig\.json)$/)) { return false; }
        return true;
      });

    copyTree(LIB_PATH, `${projName}/abeamer`, undefined,
      (fileBase: string) => {
        if (noTypescript && fileBase.match(/(?:typings|\.ts)$/)) { return false; }
        if (noPlugins && fileBase.match(/plugins$/)) { return false; }
        return !fileBase.match(/plugins-list\.json$/);
      });

    if (logLevel > Consts.LL_SILENT) {
      console.log(`Project ${projName} created.
- frame-width: ${width}px
- frame-height: ${height}px
- fps: ${fps}
To modify the the frame dimensions, edit [abeamer.ini] and recompile the [css/main.scss] file.
To modify the fps, edit the [js/main.ts] file.
`);
    }
  }


  /**
   * Copies a tree structure from the `src` to `dst`,
   * allowing to modify the content via `onCopyText` callback,
   * and determine if copying a certain file or folder is allowed via `allowCopy`.
   */
  function copyTree(srcPath: string, dstPath: string,
    onCopyText?: (text: string, fileBase: string) => string,
    allowCopy?: (fileBase: string) => boolean) {
    if (isVerbose) {
      console.log(`Copying Directory ${srcPath} to ${dstPath}`);
    }
    fsix.mkdirpSync(dstPath);
    sysFs.readdirSync(srcPath).forEach(fileBase => {
      if (allowCopy && !allowCopy(fileBase)) { return; }

      const srcFileName = `${srcPath}/${fileBase}`;
      const dstFileName = `${dstPath}/${fileBase}`;
      const stats = sysFs.statSync(srcFileName);
      if (stats.isFile()) {
        if (isVerbose) {
          console.log(`Copying ${srcFileName} to ${dstFileName}`);
        }
        let data = fsix.readUtf8Sync(srcFileName);
        if (onCopyText) {
          data = onCopyText(data, fileBase);
        }
        sysFs.writeFileSync(dstFileName, data);
      } else if (stats.isDirectory()) {
        copyTree(srcFileName, dstFileName, onCopyText, allowCopy);
      }
    });
  }

  // ------------------------------------------------------------------------
  //                               Serve
  // ------------------------------------------------------------------------

  function commandServe(): void {
    const hasMarked = sysFs.existsSync(sysPath.posix.join(__dirname,
      '../node_modules/marked/bin/marked'));
    const hasHighlightJs = sysFs.existsSync(sysPath.posix.join(__dirname,
      '../node_modules/highlight.js/lib/index.js'));

    const port = argOpts['port'].value as int || DEFAULT_PORT;
    const allowDirListing = argOpts['listDir'].hasOption;

    new HttpServerEx.ServerEx(port, isVerbose, 'EXIT_SERVER',
      allowDirListing, hasMarked, hasHighlightJs).start();

    if (logLevel >= Consts.LL_SILENT) {
      if (hasMarked) {
        console.log(`Using markdown compiler`);
      }
      console.log(`Serving on http://localhost:${port}/`);
      if (allowDirListing) {
        console.log(`Directory listing on http://localhost:${port}/?dir`);
      }
    }
  }

  // ------------------------------------------------------------------------
  //                               Utilities
  // ------------------------------------------------------------------------

  function fileMustExists(fileName: string): string {
    if (!sysFs.existsSync(fileName)) {
      throw `${fileName} must exist`;
    }
    return fileName;
  }

  // ------------------------------------------------------------------------
  //                                Command: Render
  // ------------------------------------------------------------------------

  function commandRender(): void {

    const serverName = (OptsParser.argOpts.server.value as string
      || RelConsts.DEFAULT_SERVER).toLowerCase();

    if (RelConsts.SUPPORTED_SERVERS.indexOf(serverName) === -1) {
      throw `Unknown ${serverName}`;
    }

    // if use hasn't provided the folder name nor config file
    if (!cmdParam && !argOpts.config.value && !argOpts.url.value) { outArgs.push('.'); }

    outArgs.splice(0, 0, `${fsix.toPosixSlash(__dirname)}/../server/server-agent-${serverName}.js`);

    const cmdLine = RelConsts.NODE_SERVERS.indexOf(serverName) === -1
      ? serverName : 'node';

    runSpawn(cmdLine, outArgs, () => {
      if (logLevel > Consts.LL_SILENT) { console.log(`Server finished`); }
    });
  }

  // ------------------------------------------------------------------------
  //                               getReport
  // ------------------------------------------------------------------------

  interface Report {
    fps: uint;
    width: uint;
    height: uint;
    dirname: string;
    framespattern: string;
  }

  function getReport(): Report {
    let reportFileName = fsix.toPosixSlash(cmdParam || '.');
    const realReportFileName =
      sysPath.posix.join(reportFileName, 'story-frames/frame-report.json');
    // in case the user param is the project folder
    if (sysFs.existsSync(realReportFileName)) {
      reportFileName = realReportFileName;
    }

    if (isVerbose) {
      console.log(`reportFileName: ${reportFileName}`);
      console.log(`realReportFileName: ${realReportFileName}`);
    }

    if (!sysFs.existsSync(reportFileName)) {
      throw `Report file ${reportFileName} doesn't exist`;
    }

    const report: Report = fsix.loadJsonSync(reportFileName);
    report.dirname = sysPath.dirname(reportFileName);

    if (isVerbose) { console.log(`report path: ${report.dirname}`); }

    // handle relative paths
    if (report.framespattern.substr(0, 2) === './') {
      report.framespattern = report.dirname + '/' + report.framespattern.substr(2);
    }
    return report;
  }

  // ------------------------------------------------------------------------
  //                                Command: Gif
  // ------------------------------------------------------------------------

  function commandGif(): void {
    const report = getReport();
    const gifFileName = argOpts['gif'].value as string
      || `${report.dirname}/${DEFAULT_GIF_NAME}`;
    const toOptimize = true;

    const cmdLine = sysProcess.env['IM_CONVERT_BIN'] || 'convert';

    let args = ['-delay', `1x${report.fps}`];
    const loop = argOpts['loop'].value as string || '0';
    args.push('-loop', loop);
    if (toOptimize) {
      args.push('-strip', '-layers', 'optimize');
      const gifBackground = argOpts['gifBackground'].value || DEFAULT_BACKGROUND;
      if (gifBackground !== MANUAL_BACKGROUND) {
        args.push('-background', gifBackground as string, '-alpha', 'remove');
      }
    }

    args.push(report.framespattern.replace(/\%\d*d/, '*'), gifFileName);

    if (argOpts['gifPre'].multipleValue) {
      args = [...argOpts['gifPre'].multipleValue as string[], ...args];
    }

    if (argOpts['gifPost'].multipleValue) {
      args = [...args, ...argOpts['gifPost'].multipleValue as string[]];
    }

    if (isVerbose) {
      console.log(`\n${cmdLine} ${args.join(' ')}\n`);
    }

    runSpawn(cmdLine, args, () => {
      if (logLevel > Consts.LL_SILENT) { console.log(`Created gif ${gifFileName}`); }
    });
  }

  // ------------------------------------------------------------------------
  //                                Command: Movie
  // ------------------------------------------------------------------------

  function commandMovie(): void {
    const report = getReport();
    const movieFileName = argOpts['movie'].value as string
      || `${report.dirname}/${DEFAULT_MOVIE_NAME}`;
    const bkgMovieFileName = argOpts['bkgMovie'].value as string;
    const cmdLine = sysProcess.env['FFMPEG_BIN'] || 'ffmpeg';

    let args = ['-r', report.fps.toString(), '-f', 'image2',
      '-s', `${report.width}x${report.height}`,
      '-i', report.framespattern,
      '-y', // overwrites automatically
    ];

    /* spell-checker: disable */
    if (bkgMovieFileName) {
      args.push('-vf', `movie=${bkgMovieFileName},hue=s=1[bg];[in]setpts=PTS,scale=-1:-1`
        + `,pad=iw:ih:0:0:color=yellow[m]; [bg][m]overlay=shortest=1:x=0:y=0`);
    }

    const ext = sysPath.extname(movieFileName);
    let codec = '';
    switch (ext) {
      case '.mp4': codec = 'libx264'; break;
      case '.webm': codec = 'libvpx-vp9'; break;
    }

    if (codec) {
      args.push('-vcodec', codec);
    }
    args.push(movieFileName);

    if (argOpts['moviePre'].multipleValue) {
      args = [...argOpts['moviePre'].multipleValue as string[], ...args];
    }

    if (argOpts['moviePost'].multipleValue) {
      args = [...args, ...argOpts['moviePost'].multipleValue as string[]];
    }

    if (isVerbose) {
      console.log(`\next: ${ext}\n`);
      console.log(`cmdLine:[${cmdLine} ${args.join(' ')}]\n\n`);
    }

    runSpawn(cmdLine, args, () => {
      if (logLevel > Consts.LL_SILENT) { console.log(`Created movie ${movieFileName}`); }
    });
  }

  // ------------------------------------------------------------------------
  //                               Main Body
  // ------------------------------------------------------------------------

  function main() {
    switch (parseArguments()) {

      case DO_PRINT_USAGE:
        printUsage();
        break;

      case DO_RUN_COMMAND:

        if (isVerbose) {
          console.log(`Run Command: ${cmdName}`);
        }

        switch (cmdName) {
          case CMD_CHECK:
            commandCheck();
            break;

          case CMD_CREATE:
            commandCreate();
            break;

          case CMD_SERVE:
            commandServe();
            break;

          case CMD_RENDER:
            commandRender();
            break;

          case CMD_GIF:
            commandGif();
            break;

          case CMD_MOVIE:
            commandMovie();
            break;

          default:
            throw `Unknown command ${cmdName}`;
        }
        break;
    }
  }


  try {
    main();
  } catch (err) {
    console.error(err.message || err.toString());
  }
}
