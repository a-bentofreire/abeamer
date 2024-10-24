"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var opts_parser_exports = {};
__export(opts_parser_exports, {
  OptsParser: () => OptsParser
});
module.exports = __toCommonJS(opts_parser_exports);
var import_rel_consts = require("../shared/rel-consts.js");
var OptsParser;
((OptsParser2) => {
  OptsParser2.DEFAULT_OUT_PATTERN = "__PROJDIR__/story-frames/frame%05d.png";
  OptsParser2.DEFAULT_OUT_REPORT = "__FRAMES_DIR__/frame-report.json";
  OptsParser2.ON_ERROR_EXIT_VALUE = -1;
  OptsParser2.DEFAULT_MAX_WIDTH = 3840;
  OptsParser2.DEFAULT_MAX_HEIGHT = 2160;
  OptsParser2.DEFAULT_MAX_FPS = 50;
  OptsParser2.DEFAULT_MAX_FRAME_COUNT = 20 * 60 * 60 * 1;
  OptsParser2.DEFAULT_PROGRESS = 25;
  OptsParser2.argOpts = {
    ll: { param: "int", desc: `log level. 0 has no verbosity` },
    version: { desc: `version` },
    url: {
      param: "string",
      desc: `url of the page containing the animation
              e.g. http://abeamer.devtoix.com/
              e.g. file:///home/abeamer/Documents/test/`
    },
    file: {
      param: "string",
      desc: `for running local files with relative paths
           if --out isn't defined it sets to ${OptsParser2.DEFAULT_OUT_PATTERN}
              e.g --file gallery/hello-world/`
    },
    out: {
      param: "string",
      desc: `output file pattern. use %(0<n>)d for sequence,
           creates the destination folder if doesn't exists
           if it's defined after --file, the macro  will be file value
             e.g. --out ${OptsParser2.DEFAULT_OUT_PATTERN}`
    },
    report: {
      param: "string",
      desc: `output report filename providing information about dimensions and fps
           default is ${OptsParser2.DEFAULT_OUT_REPORT}`
    },
    allowedPlugins: {
      param: "string",
      desc: `filename of the the list of the allowed plugins`
    },
    injectPage: {
      param: "string",
      desc: `filename of the index.html that will receive the injection`
    },
    width: {
      param: "int",
      desc: `frame output width. default is ${import_rel_consts.RelConsts.DEFAULT_WIDTH}`
    },
    maxWidth: {
      param: "int",
      desc: `maximum frame output width. default is ${OptsParser2.DEFAULT_MAX_WIDTH}`
    },
    height: {
      param: "int",
      desc: `frame output height. default is ${import_rel_consts.RelConsts.DEFAULT_HEIGHT}`
    },
    maxHeight: {
      param: "int",
      desc: `maximum frame output height. default is ${OptsParser2.DEFAULT_MAX_HEIGHT}`
    },
    scale: {
      param: "string",
      desc: `scales to gif or movie movie generators.
          e.g.
             --scale 25%
             --scale 200,400
             --scale 40%,30%
          `
    },
    noframes: {
      desc: `doesn't render the frames to file nor generates the report.
           use it only for debugging`
    },
    server: {
      param: "string",
      desc: `name of the server. default is ${import_rel_consts.RelConsts.DEFAULT_SERVER}`
    },
    serverExec: {
      param: "string",
      desc: `name of the server executable. default puppeteer=node. slimerjs=slimerjs`
    },
    fps: {
      param: "int",
      desc: `overrides frames per second defined on project`
    },
    maxFps: {
      param: "int",
      desc: `maximum frame per second. default is ${OptsParser2.DEFAULT_MAX_FPS}`
    },
    maxFrameCount: {
      param: "int",
      desc: `maximum number of frames. default is ${OptsParser2.DEFAULT_MAX_FRAME_COUNT}`
    },
    progress: {
      param: "int",
      desc: `number of frames it displays a progress info. if 0 doesn't shows progress. default is ${OptsParser2.DEFAULT_PROGRESS}`
    },
    timeout: {
      param: "int",
      desc: `server timeout. default is 0`
    },
    teleport: { desc: `makes the web browser run on teleport mode, and generates the story on the exit` },
    dp: { desc: `deletes previous frames` },
    config: {
      param: "string",
      desc: `loads the config from a ini or json file
           see https://abeamer.devtoix.com/docs/latest/end-user/en/site/config-file/`
    },
    var: {
      param: "object",
      desc: `allows to pass multiple variables to client web library.
         accessible as story.args.vars or in expressions.
         if the variable name has dashes, it will be converted to camelCase
           e.g --var name=end-user --var value=1.2.3`
    }
  };
  OptsParser2.isOption = (arg) => arg.indexOf("--") === 0;
  function iterateArgOpts(toParseValue, getNext, callback) {
    do {
      const name = (getNext() || "").trim();
      if (!name) {
        break;
      }
      if ((0, OptsParser2.isOption)(name)) {
        const optName = name.substr(2).replace(/-(\w)/g, (_all, firstLetter) => firstLetter.toUpperCase()).replace(/__\d+$/, "");
        const opt = OptsParser2.argOpts[optName];
        if (opt === void 0) {
          throw `Unknown option ${optName}`;
        }
        opt.hasOption = true;
        if (opt.param) {
          opt.value = getNext();
          if (!opt.value || (0, OptsParser2.isOption)(opt.value) && !opt.allowOption) {
            throw `Missing value for ${name}`;
          }
          if (toParseValue) {
            switch (opt.param) {
              case "int":
                if (opt.value.match(/[^\d]/)) {
                  throw `${name} ${opt.value} isn't a integer value`;
                }
                opt.value = parseInt(opt.value);
                break;
              case "boolean":
                opt.value = opt.value === "true" || opt.value === "1";
                break;
              case "object":
                opt.multipleValue = opt.multipleValue || {};
                const [, key, value] = opt.value.match(/^([^=]+)=(.*)$/) || ["", "", ""];
                if (!key) {
                  throw `${name} requires the key field`;
                }
                opt.multipleValue[key] = value;
                break;
              case "array":
                opt.multipleValue = opt.multipleValue || [];
                opt.multipleValue.push(opt.value);
                break;
            }
          }
        }
        const res = callback(optName, opt.value, opt.multipleValue);
        if (res !== void 0) {
          return res;
        }
      } else {
        callback("@param", name);
      }
    } while (true);
  }
  OptsParser2.iterateArgOpts = iterateArgOpts;
  function computeScale(width, height) {
    function computeScaleItem(item, dim) {
      let scale = 1;
      if (item.endsWith("%")) {
        scale = dim / 100;
        item = item.substr(0, item.length - 1);
      }
      const value = parseInt(item, 10) * scale;
      return Math.round(value).toString();
    }
    const sScale = (OptsParser2.argOpts.scale.value || "").trim();
    if (!sScale) {
      return void 0;
    }
    const scaleItems = sScale.split(/\s*,\s*/);
    return [
      computeScaleItem(scaleItems[0], width),
      computeScaleItem(scaleItems[1] || scaleItems[0], height)
    ];
  }
  OptsParser2.computeScale = computeScale;
  function _getDashKey(key) {
    return key.replace(/([A-Z])/g, (_all, p) => "-" + p.toLowerCase());
  }
  function printUsage() {
    const names = Object.keys(OptsParser2.argOpts);
    let max = 0;
    names.forEach((key) => {
      max = Math.max(_getDashKey(key).length, max);
    });
    const fromKeyToDesc = max + 3;
    const descPos = 5 + fromKeyToDesc + 2;
    console.log(`
 The options are:
 ` + names.map((key) => {
      const dashKey = _getDashKey(key);
      return `   --${dashKey}${Array(fromKeyToDesc - dashKey.length).join(" ")}${OptsParser2.argOpts[key].desc.split("\n").map(
        (line, lineIndex) => Array(lineIndex ? descPos : 0).join(" ") + line.trim()
      ).join("\n")}

`;
    }).join("\n"));
  }
  OptsParser2.printUsage = printUsage;
})(OptsParser || (OptsParser = {}));
//# sourceMappingURL=opts-parser.js.map
