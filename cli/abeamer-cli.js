#!/usr/bin/env node
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
var sysPath = __toESM(require("path"));
var sysProcess = __toESM(require("process"));
var import_child_process = require("child_process");
var import_opts_parser = require("../shared/opts-parser.js");
var import_fsix = require("../shared/vendor/fsix.js");
var import_version = require("../shared/version.js");
var import_consts = require("../shared/lib/consts.js");
var import_rel_consts = require("../shared/rel-consts.js");
var import_http_server_ex = require("../shared/vendor/http-server-ex.js");
var Cli;
((Cli2) => {
  const DO_PRINT_USAGE = 0;
  const DO_RUN_COMMAND = 1;
  const DO_EXIT = 2;
  const DEFAULT_PORT = 9e3;
  const CMD_CHECK = "check";
  const CMD_CREATE = "create";
  const CMD_SERVE = "serve";
  const CMD_RENDER = "render";
  const CMD_GIF = "gif";
  const CMD_MOVIE = "movie";
  const DEFAULT_GIF_NAME = "story.gif";
  const DEFAULT_MOVIE_NAME = "story.mp4";
  const DEFAULT_BACKGROUND = "white";
  const MANUAL_BACKGROUND = "manual";
  let logLevel = import_consts.Consts.LL_ERROR;
  let isVerbose = false;
  let cmdName = "";
  let cmdParam = "";
  const outArgs = [];
  const isWin = sysProcess.platform === "win32";
  const argOpts = import_opts_parser.OptsParser.argOpts;
  argOpts["port"] = {
    param: "int",
    desc: `port for serve command. default is ${DEFAULT_PORT}`
  };
  argOpts["gif"] = {
    param: "string",
    desc: `output gif filename. default is ${DEFAULT_GIF_NAME}`
  };
  argOpts["movie"] = {
    param: "string",
    desc: `output movie filename. default is ${DEFAULT_MOVIE_NAME}`
  };
  argOpts["bkgMovie"] = {
    param: "string",
    desc: `movie filename to be used as background to blend with transparent images`
  };
  argOpts["noPlugins"] = {
    desc: `creates a project without plugins`
  };
  argOpts["noTypescript"] = {
    desc: `creates a project without TypeScript files`
  };
  argOpts["listDir"] = {
    desc: `serve command lists the directory contents if url has the querystring '?dir'`
  };
  argOpts["loop"] = {
    param: "string",
    desc: `defines how many times a gif will loop. set to -1 if you don't won't it to loop`
  };
  argOpts["moviePre"] = {
    param: "array",
    allowOption: true,
    desc: `arguments to be passed to ffmpeg before the arguments passed by abeamer`
  };
  argOpts["moviePost"] = {
    param: "array",
    allowOption: true,
    desc: `arguments to be passed to ffmpeg after the arguments passed by abeamer`
  };
  argOpts["gifPre"] = {
    param: "array",
    allowOption: true,
    desc: `arguments to be passed to gif generator(convert) before the arguments passed by abeamer`
  };
  argOpts["gifPost"] = {
    param: "array",
    allowOption: true,
    desc: `arguments to be passed to gif generator(convert) after the arguments passed by abeamer`
  };
  argOpts["gifBackground"] = {
    param: "string",
    desc: `background color used to replace the alpha channel in gif generation.
if this is value is set to "${MANUAL_BACKGROUND}" , no parameters relating are passed to the gif generator.
default is ${MANUAL_BACKGROUND}`
  };
  function printUsage() {
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
      https://abeamer.devtoix.com/docs/latest/end-user/en/site/abeamer-cli/

`);
    import_opts_parser.OptsParser.printUsage();
  }
  function parseArguments() {
    const args = sysProcess.argv;
    let argI = 1;
    while (args[argI - 1].search(/abeamer/) === -1) {
      argI++;
    }
    cmdName = args[argI++];
    if (!cmdName) {
      return DO_PRINT_USAGE;
    } else if (cmdName === "--version") {
      console.log(import_version.VERSION);
      return DO_EXIT;
    }
    return import_opts_parser.OptsParser.iterateArgOpts(
      true,
      () => args[argI++],
      (option, value) => {
        switch (option) {
          case "@param":
            cmdParam = value;
            outArgs.push(cmdParam);
            return;
          case "version":
            console.log(import_version.VERSION);
            return DO_EXIT;
          case "ll":
            logLevel = value;
            isVerbose = logLevel >= import_consts.Consts.LL_VERBOSE;
            if (isVerbose) {
              console.log(`Args: [${args.join("],[")}]`);
              console.log(`Current Path: ${sysProcess.cwd()}`);
            }
            break;
        }
        switch (cmdName) {
          case CMD_RENDER:
            outArgs.push("--" + option);
            if (value) {
              outArgs.push(value);
            }
            break;
        }
      }
    ) || DO_RUN_COMMAND;
  }
  function runSpawn(cmdLine, args, callback) {
    if (isVerbose) {
      console.log(`spawn cmdLine: ${cmdLine}`);
      console.log(`args: ${args.join(" ")}`);
    }
    const ls = (0, import_child_process.spawn)(cmdLine, args);
    ls.stdout.on("data", (data) => {
      if (logLevel >= import_consts.Consts.LL_SILENT) {
        console.log(data.toString());
      }
    });
    ls.stderr.on("data", (data) => {
      if (logLevel >= import_consts.Consts.LL_SILENT) {
        console.error(data.toString());
      }
    });
    ls.on("close", (_code) => {
      callback();
    });
  }
  function commandCheck() {
    let checkCount = 0;
    const TOTAL_CHECK_COUNT = 5;
    function displayCheck(what, passed, failedMsg) {
      checkCount++;
      console.log(`${checkCount}. Check: ${what} --> ${passed ? "OK" : "Failed"}`);
      if (!passed) {
        console.log("  TODO:" + failedMsg + "\n");
      }
      if (checkCount === TOTAL_CHECK_COUNT) {
        console.log("\n");
      }
    }
    function addToStartUp(passed, key, value, failedMsg) {
      displayCheck(`${key}=${value}`, passed, `
    ${failedMsg}
    Add to the shell startup script:
${isWin ? "SET" : "export"} ${key}=${value}`);
    }
    function checkProgramIsValid(envKey, appName, versionParam, matchRegEx, requireMsg) {
      function displayResult(passed) {
        displayCheck(appName, passed, `
    ABeamer requires ${requireMsg}
    Either add the executable to the system path, or add to the shell startup script:
${isWin ? "set" : "export"} ${envKey}=<absolute-path-to-${appName}>`);
      }
      const envValue = sysProcess.env[envKey];
      if (!envValue) {
        import_fsix.fsix.runExternal(
          `${appName} ${versionParam}`,
          (_error, stdout, stderr) => {
            displayResult(stderr === "" && stdout.match(matchRegEx));
          }
        );
      } else {
        displayResult(sysFs.existsSync(envValue));
      }
    }
    console.log(`
Checking:
`);
    addToStartUp(
      (sysProcess.env["PUPPETEER_SKIP_CHROMIUM_DOWNLOAD"] || "").toLowerCase() === "true",
      "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD",
      "TRUE",
      "by default puppeteer downloads Chromium which is doesn't support many features"
    );
    const chromeBin = sysProcess.env["CHROME_BIN"];
    if (!chromeBin) {
      addToStartUp(
        false,
        "CHROME_BIN",
        "<chrome-path>",
        "puppeteer uses by default Chromium, set CHROME_BIN with the absolute path to chrome web browser executable"
      );
    } else {
      addToStartUp(
        sysFs.existsSync(chromeBin),
        "CHROME_BIN",
        "<chrome-path>",
        "CHROME_BIN points to a missing chrome executable"
      );
    }
    checkProgramIsValid(
      "FFMPEG_BIN",
      "ffmpeg",
      "-version",
      /ffmpeg version/,
      "ffmpeg to generate movies"
    );
    checkProgramIsValid(
      "IM_CONVERT_BIN",
      "convert",
      "--version",
      /Version: ImageMagick/,
      "ImageMagick convert program to generate gifs"
    );
    let puppeteer;
    try {
      puppeteer = require("puppeteer");
    } catch (error) {
    }
    displayCheck("puppeteer", puppeteer, `
   ABeamer requires puppeteer. Install using the following command
npm i puppeteer`);
  }
  function commandCreate() {
    const projName = import_fsix.fsix.toPosixSlash(cmdParam);
    if (!projName) {
      throw `Missing project name`;
    }
    if (projName[0] === "-" || projName.search(/[\"\'\?\*\+]/) !== -1 || projName.search(/^[\.\/]+$/) !== -1) {
      throw `Error: ${projName} is not valid project name`;
    }
    if (sysFs.existsSync(projName)) {
      throw `Error: Project ${projName} already exists`;
    }
    if (projName.includes("/")) {
      const dirname = sysPath.posix.dirname(projName);
      import_fsix.fsix.mkdirpSync(dirname);
    }
    const ROOT_PATH = import_fsix.fsix.toPosixSlash(__dirname) + "/..";
    const TEMPLATE_PATH = ROOT_PATH + "/gallery/hello-world";
    const LIB_PATH = ROOT_PATH + "/client/lib";
    const width = argOpts.width.value || import_rel_consts.RelConsts.DEFAULT_WIDTH;
    const height = argOpts.height.value || import_rel_consts.RelConsts.DEFAULT_HEIGHT;
    const fps = argOpts.fps.value || import_rel_consts.RelConsts.DEFAULT_FPS;
    const noPlugins = argOpts["noPlugins"].hasOption;
    const noTypescript = argOpts["noTypescript"].hasOption;
    copyTree(
      TEMPLATE_PATH,
      projName,
      (text, fileName) => {
        const fileBase = sysPath.basename(fileName);
        switch (fileBase) {
          case "main.js":
          case "main.ts":
            if (noTypescript) {
              text = text.replace(/^.*sourceMappingURL=.*$/m, "");
            }
            text = text.replace(/createStory\([^)]*\)/, `createStory(/*FPS:*/${fps})`);
            break;
          case "abeamer.ini":
            text = text.replace(/width:\s*\d+/, `width: ${width}`).replace(/height:\s*\d+/, `height: ${height}`);
            break;
          case "main.min.css":
            text = text.replace(
              /.abeamer-scene{width:\d+px;height:\d+px}/,
              `.abeamer-scene{width:${width}px;height:${height}px}`
            );
            break;
          case "index.html":
            if (!noPlugins) {
              const plugins = import_fsix.fsix.loadJsonSync(`${ROOT_PATH}/client/lib/plugins/plugins-list.json`);
              let pre = "";
              let post = "";
              text.replace(/^(.*)js\/abeamer\.min\.js(.*)$/m, (_app, _pre, _post) => {
                pre = _pre;
                post = _post;
                return "";
              });
              text = text.replace(/^(.*js\/main\.js.*)$/m, (all) => {
                return `
          <!-- remove the unnecessary plugins -->
` + plugins.map((plugin) => `${pre}plugins/${plugin}/${plugin}.js${post}`).join("\n") + "\n\n" + all;
              });
            }
            break;
        }
        return text;
      },
      (fileBase) => {
        if (noTypescript && fileBase.match(/(?:js\.map|\.ts|tsconfig\.json)$/)) {
          return false;
        }
        return true;
      }
    );
    copyTree(
      LIB_PATH,
      `${projName}/abeamer`,
      void 0,
      (fileBase) => {
        if (noTypescript && fileBase.match(/(?:typings|\.ts)$/)) {
          return false;
        }
        if (noPlugins && fileBase.match(/plugins$/)) {
          return false;
        }
        return !fileBase.match(/plugins-list\.json$/);
      }
    );
    if (logLevel > import_consts.Consts.LL_SILENT) {
      console.log(`Project ${projName} created.
- frame-width: ${width}px
- frame-height: ${height}px
- fps: ${fps}
To modify the the frame dimensions, edit [abeamer.ini] and recompile the [css/main.scss] file.
To modify the fps, edit the [js/main.ts] file.
`);
    }
  }
  function copyTree(srcPath, dstPath, onCopyText, allowCopy) {
    if (isVerbose) {
      console.log(`Copying Directory ${srcPath} to ${dstPath}`);
    }
    import_fsix.fsix.mkdirpSync(dstPath);
    sysFs.readdirSync(srcPath).forEach((fileBase) => {
      if (allowCopy && !allowCopy(fileBase)) {
        return;
      }
      const srcFileName = `${srcPath}/${fileBase}`;
      const dstFileName = `${dstPath}/${fileBase}`;
      const stats = sysFs.statSync(srcFileName);
      if (stats.isFile()) {
        if (isVerbose) {
          console.log(`Copying ${srcFileName} to ${dstFileName}`);
        }
        let data = import_fsix.fsix.readUtf8Sync(srcFileName);
        if (onCopyText) {
          data = onCopyText(data, fileBase);
        }
        sysFs.writeFileSync(dstFileName, data);
      } else if (stats.isDirectory()) {
        copyTree(srcFileName, dstFileName, onCopyText, allowCopy);
      }
    });
  }
  function commandServe() {
    const hasMarked = sysFs.existsSync(sysPath.posix.join(
      __dirname,
      "../node_modules/marked/bin/marked"
    ));
    const hasHighlightJs = sysFs.existsSync(sysPath.posix.join(
      __dirname,
      "../node_modules/highlight.js/lib/index.js"
    ));
    const port = argOpts["port"].value || DEFAULT_PORT;
    const allowDirListing = argOpts["listDir"].hasOption;
    new import_http_server_ex.HttpServerEx.ServerEx(
      port,
      isVerbose,
      "EXIT_SERVER",
      allowDirListing,
      hasMarked,
      hasHighlightJs
    ).start();
    if (logLevel >= import_consts.Consts.LL_SILENT) {
      if (hasMarked) {
        console.log(`Using markdown compiler`);
      }
      console.log(`Serving on http://localhost:${port}/`);
      if (allowDirListing) {
        console.log(`Directory listing on http://localhost:${port}/?dir`);
      }
    }
  }
  function commandRender() {
    const serverName = (import_opts_parser.OptsParser.argOpts.server.value || import_rel_consts.RelConsts.DEFAULT_SERVER).toLowerCase();
    if (import_rel_consts.RelConsts.SUPPORTED_SERVERS.indexOf(serverName) === -1) {
      throw `Unknown ${serverName}`;
    }
    if (!cmdParam && !argOpts.config.value && !argOpts.url.value) {
      outArgs.push(".");
    }
    const configArgIndex = outArgs.indexOf("--config");
    if (configArgIndex !== -1) {
      outArgs[configArgIndex] = outArgs[configArgIndex] + "__2";
    }
    outArgs.splice(0, 0, `${import_fsix.fsix.toPosixSlash(__dirname)}/../server/server-agent-${serverName}.js`);
    const cmdLine = argOpts.serverExec.value || (import_rel_consts.RelConsts.NODE_SERVERS.indexOf(serverName) === -1 ? serverName : "node");
    runSpawn(cmdLine, outArgs, () => {
      if (logLevel > import_consts.Consts.LL_SILENT) {
        console.log(`Server finished`);
      }
    });
  }
  function getReport() {
    let reportFileName = import_fsix.fsix.toPosixSlash(cmdParam || ".");
    const realReportFileName = sysPath.posix.join(reportFileName, "story-frames/frame-report.json");
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
    const report = import_fsix.fsix.loadJsonSync(reportFileName);
    report.dirname = sysPath.dirname(reportFileName);
    if (isVerbose) {
      console.log(`report path: ${report.dirname}`);
    }
    if (report.framespattern.substr(0, 2) === "./") {
      report.framespattern = report.dirname + "/" + report.framespattern.substr(2);
    }
    return report;
  }
  function commandGif() {
    const report = getReport();
    const gifFileName = argOpts["gif"].value || `${report.dirname}/${DEFAULT_GIF_NAME}`;
    const toOptimize = true;
    const cmdLine = sysProcess.env["IM_CONVERT_BIN"] || "convert";
    let args = ["-delay", `1x${report.fps}`];
    const scale = import_opts_parser.OptsParser.computeScale(report.width, report.height);
    if (scale) {
      args.push("-scale", scale.join("x"));
    }
    const loop = argOpts["loop"].value || "0";
    args.push("-loop", loop);
    if (toOptimize) {
      args.push("-strip", "-layers", "optimize");
      const gifBackground = argOpts["gifBackground"].value || DEFAULT_BACKGROUND;
      if (gifBackground !== MANUAL_BACKGROUND) {
        args.push("-background", gifBackground, "-alpha", "remove");
      }
    }
    args.push(report.framespattern.replace(/\%\d*d/, "*"), gifFileName);
    if (argOpts["gifPre"].multipleValue) {
      args = [...argOpts["gifPre"].multipleValue, ...args];
    }
    if (argOpts["gifPost"].multipleValue) {
      args = [...args, ...argOpts["gifPost"].multipleValue];
    }
    if (isVerbose) {
      console.log(`
${cmdLine} ${args.join(" ")}
`);
    }
    runSpawn(cmdLine, args, () => {
      if (logLevel > import_consts.Consts.LL_SILENT) {
        console.log(`Created gif ${gifFileName}`);
      }
    });
  }
  function commandMovie() {
    const report = getReport();
    const movieFileName = argOpts["movie"].value || `${report.dirname}/${DEFAULT_MOVIE_NAME}`;
    const bkgMovieFileName = argOpts["bkgMovie"].value;
    const cmdLine = sysProcess.env["FFMPEG_BIN"] || "ffmpeg";
    const scale = import_opts_parser.OptsParser.computeScale(report.width, report.height);
    let args = [
      "-r",
      report.fps.toString(),
      "-f",
      "image2"
    ];
    if (!scale) {
      args.push("-s", `${report.width}x${report.height}`);
    }
    args.push(
      "-i",
      report.framespattern,
      "-y"
      // overwrites automatically
    );
    if (scale) {
      args.push("-vf", `scale=${scale.join("x")}`);
    }
    if (bkgMovieFileName) {
      args.push("-vf", `movie=${bkgMovieFileName},hue=s=1[bg];[in]setpts=PTS,scale=-1:-1,pad=iw:ih:0:0:color=yellow[m]; [bg][m]overlay=shortest=1:x=0:y=0`);
    }
    const ext = sysPath.extname(movieFileName);
    let codec = "";
    switch (ext) {
      case ".mp4":
        codec = "libx264";
        break;
      case ".webm":
        codec = "libvpx-vp9";
        break;
    }
    if (codec) {
      args.push("-vcodec", codec);
    }
    args.push(movieFileName);
    if (argOpts["moviePre"].multipleValue) {
      args = [...argOpts["moviePre"].multipleValue, ...args];
    }
    if (argOpts["moviePost"].multipleValue) {
      args = [...args, ...argOpts["moviePost"].multipleValue];
    }
    if (isVerbose) {
      console.log(`
ext: ${ext}
`);
      console.log(`cmdLine:[${cmdLine} ${args.join(" ")}]

`);
    }
    runSpawn(cmdLine, args, () => {
      if (logLevel > import_consts.Consts.LL_SILENT) {
        console.log(`Created movie ${movieFileName}`);
      }
    });
  }
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
})(Cli || (Cli = {}));
//# sourceMappingURL=abeamer-cli.js.map
