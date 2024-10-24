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
var exact_exports = {};
__export(exact_exports, {
  Exact: () => Exact
});
module.exports = __toCommonJS(exact_exports);
var import_chai = require("chai");
var sysFs = __toESM(require("fs"));
var sysPath = __toESM(require("path"));
var sysProcess = __toESM(require("process"));
var import_consts = require("../shared/lib/consts.js");
var import_rel_consts = require("../shared/rel-consts.js");
var import_dev_consts = require("../shared/lib/dev-consts.js");
var import_fsix = require("../shared/vendor/fsix.js");
var import_dev_config = require("../shared/dev-config.js");
var Exact;
((Exact2) => {
  const TEMPLATE_PATH = "template";
  const RUN_PATH = "tests.run";
  const ASSETS_PATH = "assets";
  const DEFAULT_TEST_WIDTH = 640;
  const DEFAULT_TEST_HEIGHT = 480;
  const _DEFAULT_TIMEOUT = 20 * 1e3;
  const DEFAULT_TEST_GEN_FRAMES_WIDTH = 100;
  const DEFAULT_TEST_GEN_FRAMES_HEIGHT = 100;
  const _DEFAULT_EXPECTED_PATH = "./expected/frames";
  Exact2._TEST_DIGIT_LIMIT = 1e3;
  class TestBuilder {
    constructor() {
      // default input params
      this.elDuration = "1s";
      this.prop = "left";
      this.fps = 4;
      this.min = 20;
      this.max = 40;
      this.isPosAbsolute = true;
      this.runTestParams = {};
      this.testFunc = defaultTestFunc;
    }
    getTestLabel(test) {
      return `${test.preLabel || ""}${test.elName} ${test.prop} goes from ${test.min} to ${test.max}${test.postLabel || ""}`;
    }
    getTestAnime(test) {
      return {
        selector: `#${test.elName}`,
        duration: test.elDuration,
        props: [{
          duration: test.duration,
          easing: test.easingName,
          prop: test.prop,
          value: test.max
        }]
      };
    }
    buildRunTest(test) {
      this.runTestParams[this.getTestLabel(test)] = defaultTestFunc;
    }
    runTest(rd, test) {
      rd.actions.isIdPropActions(
        test.elName,
        test.prop,
        Exact2.simulatePixelAction(
          Exact2.interpolateMinMax(
            test.min,
            test.max,
            test.frameCount,
            test.easingFunc
          )
        )
      );
    }
    addTests(tests) {
      Exact2.builder = this;
      this.tests = tests;
      this.testCountForHtml = tests.length;
      tests.forEach((test, index) => {
        test.builder = this;
        test.elIndex = test.elIndex || this.elIndex;
        if (test.elIndex === void 0) {
          test.elIndex = index;
        }
        if (test.isPosAbsolute === void 0) {
          test.isPosAbsolute = this.isPosAbsolute;
        }
        test.elName = `t${test.elIndex}`;
        test.min = test.min || this.min;
        test.max = test.max || this.max;
        test.prop = test.prop || this.prop;
        test.elDuration = test.elDuration || this.elDuration;
        test.realDuration = test.duration || test.elDuration;
        if (test.frameCount === void 0) {
          test.frameCount = calcFrameCount(test.realDuration, this.fps);
        }
        this.buildRunTest(test);
      });
    }
    getInMacros() {
      return {
        fps: this.fps,
        css: this.tests.map((test) => `#${test.elName} {${test.isPosAbsolute ? "position: absolute; " : ""}${test.prop}: ${test.min}px}`).join("\n"),
        animes: this.tests.map((test) => {
          return this.getTestAnime(test);
        }),
        html: Exact2.genTestHtml(this.testCountForHtml, this.cssClassesForHtml)
      };
    }
  }
  Exact2.TestBuilder = TestBuilder;
  function defaultTestFunc(rd, done, index) {
    Exact2.builder.runTest(rd, Exact2.builder.tests[index]);
    done();
  }
  Exact2.defaultTestFunc = defaultTestFunc;
  Exact2.obj2String = (obj) => JSON.stringify(obj, void 0, 2);
  function hexToRgb(hex) {
    const _hh2Int = (delta) => parseInt(hex.substr(delta, 2), 16);
    return `rgb(${_hh2Int(1)}, ${_hh2Int(3)}, ${_hh2Int(5)})`;
  }
  Exact2.hexToRgb = hexToRgb;
  Exact2.roundTestDigit = (v) => Math.round(v * Exact2._TEST_DIGIT_LIMIT) / Exact2._TEST_DIGIT_LIMIT;
  function calcFrameCount(duration, fps, defaultDuration) {
    if (!duration) {
      return Math.round(defaultDuration * fps - 1e-4);
    }
    if (typeof duration === "number") {
      return duration;
    }
    const [all, sValue, unit] = duration.match(/^([\d\.]+)(s|ms|f|%)$/) || ["", "", ""];
    if (!all) {
      throw `Unknown duration ${duration}`;
    }
    let value = parseFloat(sValue);
    switch (unit) {
      case "%":
        value = value / 100 * fps * defaultDuration;
        break;
      case "s":
        value = value * fps;
        break;
      case "ms":
        value = value / 1e3 * fps;
        break;
    }
    return Math.round(value - 1e-4);
  }
  Exact2.calcFrameCount = calcFrameCount;
  function genTestHtml(count, opts) {
    const res = [];
    opts = opts || {};
    opts.cssClass = opts.cssClass === void 0 ? "abslf" : opts.cssClass;
    opts.htmlTag = opts.htmlTag || "div";
    opts.idPrefix = opts.idPrefix || "t";
    opts.textPrefix = opts.textPrefix || "t";
    let sceneIndex = 0;
    for (let i = 0; i < count; i++) {
      if (opts.sceneMarkers && opts.sceneMarkers.length > sceneIndex && opts.sceneMarkers[sceneIndex] === i) {
        sceneIndex++;
        res.push("    </div>");
        res.push(`    <div class="abeamer-scene" id=scene${sceneIndex + 1}>`);
      }
      res.push(`        <${opts.htmlTag} class='${opts.cssClass}' id='${opts.idPrefix}${i}'>${opts.textPrefix}${i}</${opts.htmlTag}>`);
    }
    return Exact2.getTestSquare + res.join("\n");
  }
  Exact2.genTestHtml = genTestHtml;
  Exact2.getTestSquare = '<div id="test-square"></div>\n';
  function interpolateMinMax(min, max, frameCount, interpolator) {
    const framesInt = Math.round(frameCount);
    const res = [];
    const delta = max - min;
    for (let i = 0; i < framesInt; i++) {
      const t = framesInt > 1 ? i / (framesInt - 1) : 1;
      const v = interpolator ? interpolator(t) : t;
      res.push(v * delta + min);
    }
    return res;
  }
  Exact2.interpolateMinMax = interpolateMinMax;
  function interpolateList(list, cycle) {
    const res = [];
    const listLen = list.length;
    for (let i = 0; i < cycle.length; i++) {
      const listIndex = Math.floor(listLen * Math.min(Math.max(0, cycle[i]), 0.999));
      res.push(list[listIndex]);
    }
    return res;
  }
  Exact2.interpolateList = interpolateList;
  function roundToTestDigits(values) {
    values.forEach((v, i) => {
      values[i] = Math.round(v * Exact2._TEST_DIGIT_LIMIT) / Exact2._TEST_DIGIT_LIMIT;
    });
  }
  Exact2.roundToTestDigits = roundToTestDigits;
  Exact2.simulatePixelAction = (values) => values.map((value) => Math.round(value) + "px");
  Exact2.simulateNumAction = (values) => values.map((value) => value.toString());
  function simulateAction(values, propType) {
    switch (propType) {
      case import_dev_consts.DevConsts.PT_PIXEL:
        return Exact2.simulatePixelAction(values);
      case import_dev_consts.DevConsts.PT_NUMBER:
        return Exact2.simulateNumAction(values);
    }
  }
  Exact2.simulateAction = simulateAction;
  function AssertHasLine(rd, line, isError = false) {
    import_chai.assert.isTrue(
      (!isError ? rd.out : rd.errLines).indexOf(line) !== -1,
      `missing: [${line}]`
    );
  }
  Exact2.AssertHasLine = AssertHasLine;
  class Actions {
    constructor(actions, ranges) {
      this.actions = actions;
      this.ranges = ranges;
      // ------------------------------------------------------------------------
      //                               Filter
      // ------------------------------------------------------------------------
      this.filterByElement = (elementId) => this.actions.filter((action) => action[0] === elementId).map((action) => [action[1], action[2]]);
      this.filterByElementProp = (elementId, propName) => this.actions.filter((action) => action[0] === elementId && action[1] === propName).map((action) => action[2]);
      this.filterRangeByElementProp = (elementId, propName) => this.ranges.filter((range) => range[0] === elementId && range[1] === propName).map((range) => [range[2], range[3]]);
    }
    // ------------------------------------------------------------------------
    //                               Log
    // ------------------------------------------------------------------------
    log() {
      console.log(this.actions);
    }
    logByElement(elementId) {
      console.log(this.filterByElement(elementId));
    }
    logByElementProp(elementId, propName) {
      console.log(this.filterByElementProp(elementId, propName));
    }
    // ------------------------------------------------------------------------
    //                               Assertion
    // ------------------------------------------------------------------------
    isIdPropActions(elementId, propName, expected, toAssert = true, toLogIfFails = true, actualStartIndex = 0, actualLength) {
      function failTestAndLog() {
        if (toLogIfFails) {
          console.log("Actual:");
          console.log(actual);
          console.log("Expected:");
          console.log(expected);
        }
      }
      let actual = this.filterByElementProp(elementId, propName);
      actual = actual.slice(
        actualStartIndex,
        actualLength === void 0 ? actual.length : actualStartIndex + actualLength
      );
      if (expected.length !== actual.length) {
        if (toAssert) {
          failTestAndLog();
          throw `id: ${elementId} prop: ${propName} actions expected ${expected.length} length, but actual is ${actual.length}`;
        }
        return -2;
      }
      return actual.findIndex((value, index) => {
        if (value !== expected[index]) {
          failTestAndLog();
          if (toAssert) {
            throw `id: ${elementId} prop: ${propName} index: ${index} expected ${value} length, but actual is ${expected[index]}`;
          }
          return true;
        } else {
          return false;
        }
      });
    }
    isActions(_expected, toAssert = true, _toLogIfFails = true) {
      return this.actions.findIndex((action, index) => {
        const expectedIt = action[index];
        const res = action[0] === expectedIt[0] && action[1] === expectedIt[1] && action[2] === expectedIt[2];
        if (!res && toAssert) {
        }
        return !res;
      });
    }
    isIdPropRanges(elementId, propName, expected, toAssert = true, toLogIfFails = true, actualStartIndex = 0, actualLength) {
      function failTestAndLog() {
        if (toLogIfFails) {
          console.log("Actual:");
          console.log(actual);
          console.log("Expected:");
          console.log(expected);
        }
      }
      let actual = this.filterRangeByElementProp(elementId, propName);
      actual = actual.slice(
        actualStartIndex,
        actualLength === void 0 ? actual.length : actualStartIndex + actualLength
      );
      if (expected.length !== actual.length) {
        if (toAssert) {
          failTestAndLog();
          throw `id: ${elementId} prop: ${propName} actions expected ${expected.length} length, but actual is ${actual.length}`;
        }
        return -2;
      }
      return actual.findIndex((value, index) => {
        if (value[0] !== expected[index][0] || value[1] !== expected[index][1]) {
          failTestAndLog();
          if (toAssert) {
            throw `id: ${elementId} prop: ${propName} index: ${index} expected ${value} length, but actual is ${expected[index]}`;
          }
          return true;
        } else {
          return false;
        }
      });
    }
  }
  Exact2.Actions = Actions;
  function assertionManager(suiteName, params, holder, callback) {
    before(() => {
      return new Promise((resolve) => {
        callback(resolve);
      });
    });
    const tests = params.tests || {};
    const testNames = Object.keys(tests);
    describe(suiteName, function() {
      testNames.forEach((name, index) => {
        const func = tests[name];
        it(name, function(done) {
          this.timeout(
            /* holder.rd.params.timeout || DEFAULT_TIMEOUT */
            0
          );
          if (!holder.rd.hasCriticalError) {
            func(holder.rd, done, index);
          } else {
            done("Critical Error, Test Aborted");
          }
        });
      });
    });
  }
  function runTestSuite(suiteName, inMacros, params, callback) {
    suiteName = import_fsix.fsix.toPosixSlash(suiteName).replace(/^.*\/([^\/]+)\.js$/, "$1");
    params.toNotTimeExecution = params.toNotTimeExecution !== false ? true : false;
    const rd = {
      suiteName,
      params,
      inMacros,
      fps: inMacros.fps,
      exceptions: {}
    };
    rd.root = import_fsix.fsix.toPosixSlash(__dirname);
    rd.inFolder = rd.root + "/" + TEMPLATE_PATH;
    rd.runPath = rd.root + "/" + RUN_PATH;
    rd.outFolder = rd.runPath + "/" + suiteName;
    import_fsix.fsix.mkdirpSync(rd.runPath);
    import_fsix.fsix.mkdirpSync(rd.outFolder);
    initInMacros(inMacros, params);
    const macros = initReplaceMacros(inMacros, params);
    const files = sysFs.readdirSync(rd.inFolder);
    files.forEach((fileName) => {
      let text = import_fsix.fsix.readUtf8Sync(sysPath.join(rd.inFolder, fileName));
      macros.forEach((item) => {
        text = text.replace(item[0], item[1]);
      });
      sysFs.writeFileSync(sysPath.join(rd.outFolder, fileName), text);
    });
    buildCmdLine(rd);
    createShellFile(rd);
    const holder = {};
    assertionManager(suiteName, params, holder, (resolve) => {
      if (params.toNotTimeExecution) {
        console.log(`${suiteName} started`);
        rd.startTime = /* @__PURE__ */ new Date();
      }
      runExternal(rd, callback, holder, resolve);
    });
  }
  Exact2.runTestSuite = runTestSuite;
  function parseAnimes(jsAnimes, parallelAnimes) {
    const PRE_ADD_TRY_CATCH = `try {`;
    const POST_ADD_TRY_CATCH = `
} catch (error) {
  story.logFrmt('EXCEPTION', [['index', __INDEX__], ['error', error]]);
  if (!independentCases) story.exit();
}
`;
    jsAnimes = typeof jsAnimes === "object" ? jsAnimes : [jsAnimes];
    const addedScenes = ["1"];
    return jsAnimes.map((jsAnime, animeIndex) => {
      let toWrapAddAnimations = true;
      let sceneNr = "1";
      let preAdd = "";
      if (typeof jsAnime === "object" && jsAnime.length === 2 && typeof jsAnime[0] === "string" && jsAnime[0][0] === "@") {
        const [command, value] = jsAnime[0].split(":");
        jsAnime = jsAnime[1];
        switch (command) {
          case "@@scene":
            sceneNr = value;
            if (addedScenes.indexOf(sceneNr) === -1) {
              preAdd += `var scene${sceneNr} = story.scenes[${parseInt(sceneNr) - 1}];
`;
            }
            break;
          case "@@no-wrap-add-animation":
            toWrapAddAnimations = false;
            break;
        }
      }
      if (typeof jsAnime === "object") {
        jsAnime = Array.isArray(jsAnime) && parallelAnimes && parallelAnimes[animeIndex] ? (0, Exact2.obj2String)(jsAnime) : "[" + (0, Exact2.obj2String)(jsAnime) + "]";
      }
      if (toWrapAddAnimations) {
        jsAnime = `
scene${sceneNr}.addAnimations(` + jsAnime + `);
`;
      }
      return preAdd + PRE_ADD_TRY_CATCH + jsAnime + POST_ADD_TRY_CATCH.replace(/__INDEX__/, animeIndex.toString());
    }).join("");
  }
  function initInMacros(inMacros, params) {
    if (inMacros.animes) {
      inMacros.js = parseAnimes(inMacros.animes, params.parallelAnimes);
      inMacros.animes = void 0;
    }
    if (params.jsMacros) {
      params.jsMacros.forEach((macro) => {
        inMacros.js = inMacros.js.replace(macro[0], macro[1]);
      });
    }
    inMacros.width = inMacros.width || (!params.toGenFrames ? DEFAULT_TEST_WIDTH : DEFAULT_TEST_GEN_FRAMES_WIDTH);
    inMacros.height = inMacros.height || (!params.toGenFrames ? DEFAULT_TEST_HEIGHT : DEFAULT_TEST_GEN_FRAMES_HEIGHT);
  }
  function initReplaceMacros(inMacros, params) {
    const cfg = import_dev_config.DevCfg.getConfig(sysPath.dirname(__dirname));
    const macros = Object.keys(inMacros).map((key) => [
      new RegExp(`__${key.toUpperCase()}__`, "g"),
      inMacros[key] || ""
    ]);
    macros.push(
      [
        /__LIB_FILES__/,
        import_fsix.fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE).libModules.map(
          (file) => `    <script src="../../../client/lib/js/${file}.js"><\/script>
`
        ).join("")
      ]
    );
    macros.push(
      [
        /__PLUGINS__/,
        params.plugins ? params.plugins.map(
          (plugin) => `    <script src="../../../client/lib/plugins/${plugin}/${plugin}.js"><\/script>
`
        ).join("") : ""
      ]
    );
    macros.push([/__ASSETS_PATH__/g, `../../${ASSETS_PATH}`]);
    macros.push([
      /__IND_CASES__/,
      params.casesAreDependent !== true ? "true" : "false"
    ]);
    macros.push([
      /__EXIT_RENDER_ON_FINISHED__/,
      params.exitRenderOnFinished !== false ? "true" : "false"
    ]);
    macros.push([
      /__RENDER_FRAME_OPTIONS__/,
      params.renderFrameOptions ? JSON.stringify(params.renderFrameOptions, void 0, 2) : "undefined"
    ]);
    macros.push([
      /__EXTRA_RENDER_CALLS__/,
      params.extraRenderCalls && params.extraRenderCalls.length ? params.extraRenderCalls.map(
        (frameOptions) => `        story.render(story.bestPlaySpeed(),` + JSON.stringify(frameOptions, void 0, 2) + ");\n"
      ).join("\n") : ""
    ]);
    return macros;
  }
  function createShellFile(rd) {
    const isWin = sysProcess.platform === "win32";
    const scriptName = rd.outFolder + "/run" + (isWin ? ".bat" : ".sh");
    const shell = "#/usr/bin/env sh\n";
    sysFs.writeFileSync(scriptName, (isWin ? "" : shell) + rd.cmdLine + "\n");
    if (!isWin) {
      sysFs.chmodSync(scriptName, "0775");
    }
  }
  function buildCmdLine(rd) {
    const params = rd.params;
    const serverName = params.server || import_rel_consts.RelConsts.DEFAULT_SERVER;
    let cmdLine = (import_rel_consts.RelConsts.NODE_SERVERS.indexOf(serverName) !== -1 ? "node" : serverName) + ` "${rd.root}/../cli/../server/server-agent-${serverName}.js" --ll ${params.logLevel !== void 0 ? params.logLevel : import_consts.Consts.LL_VERBOSE}` + (params.toDelPreviousFrames !== false ? " --dp" : "") + (params.toGenFrames ? "" : " --noframes") + ` --config "${rd.outFolder}/abeamer.ini"`;
    if (params.onCmdLine) {
      cmdLine = params.onCmdLine(cmdLine);
    }
    rd.cmdLine = cmdLine;
  }
  function runExternal(rd, callback, holder, resolve) {
    import_fsix.fsix.runExternal(rd.cmdLine, (error, stdout, stderr) => {
      if (rd.params.toNotTimeExecution) {
        rd.executionTime = /* @__PURE__ */ new Date() - rd.startTime;
        console.log(`${rd.suiteName} finished ${rd.executionTime} (ms)
`);
      }
      rd.error = error;
      rd.out = (stdout || "").trim();
      rd.err = (stderr || "").trim();
      rd.outLines = rd.out.split("\n");
      rd.errLines = rd.err.split("\n");
      rd.outLines.forEach((line) => {
        if (line.search(/\[(CRITICAL|ERROR|EXCEPTION)\]/) !== -1) {
          rd.errLines.push(line);
        }
      });
      rd.hasError = error || rd.err.length > 0;
      if (rd.hasError) {
        if (rd.errLines && rd.params.expectedErrors) {
          rd.filteredErrLines = rd.errLines.filter((item) => rd.params.expectedErrors.indexOf(item) === -1);
          rd.hasError = rd.filteredErrLines.length > 0;
        } else {
          rd.filteredErrLines = rd.errLines;
        }
        if (rd.hasError) {
          console.log(`rd.hasError: ${rd.hasError}`);
        }
        if (rd.hasError && rd.params.toNotLogStdErr !== false) {
          console.error("Error:", rd.error);
          console.log("StdErr:[", rd.filteredErrLines);
        }
        rd.hasCriticalError = rd.hasError;
      }
      if (!rd.params.toNotParseActions) {
        parseActions(rd);
      }
      if (callback) {
        callback(rd);
      }
      holder.rd = rd;
      resolve();
    });
  }
  function getResTagParams(line, tag, callback) {
    if (line.substr(0, tag.length + 1) === tag + ":") {
      const res = [];
      line.replace(/_\[([^\]]*)\]_/g, (match, p) => {
        res.push(p);
        return match;
      });
      if (callback) {
        callback(res);
      }
      return res;
    }
    return void 0;
  }
  Exact2.getResTagParams = getResTagParams;
  function parseActions(rd) {
    const actions = [];
    const ranges = [];
    if (rd.params.toLogStdOut) {
      rd.outLines.forEach((line, index) => {
        console.log(`${index}:[${line}]`);
      });
    }
    rd.outLines.forEach((line) => {
      getResTagParams(line, "action", (action) => {
        actions.push(action);
      });
      getResTagParams(line, "action-range", (range) => {
        ranges.push([
          range[0],
          range[1],
          parseInt(range[2]),
          parseInt(range[3])
        ]);
      });
      Exact2.getResTagParams(line, "EXCEPTION", (exprData) => {
        rd.exceptions[parseInt(exprData[0])] = exprData[1];
      });
      if (rd.params.onParseOutputLine) {
        rd.params.onParseOutputLine(line);
      }
    });
    rd.actions = new Actions(actions, ranges);
    if (rd.params.toLogActions) {
      console.log(rd.actions);
    }
  }
})(Exact || (Exact = {}));
