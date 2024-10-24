"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exact = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module developer | This module won't be part of release version */
const chai_1 = require("chai");
const sysFs = require("fs");
const sysPath = require("path");
const sysProcess = require("process");
const consts_js_1 = require("../shared/lib/consts.js");
const rel_consts_js_1 = require("../shared/rel-consts.js");
const dev_consts_js_1 = require("../shared/lib/dev-consts.js");
const fsix_js_1 = require("../shared/vendor/fsix.js");
const dev_config_js_1 = require("../shared/dev-config.js");
/**
 * ## Description
 *
 * **Exact** is a test framework created to test ABeamer functionality.
 * It makes a copy of the template, modifying its data.
 * It executes abeamer under headless browser and captures its output.
 *
 */
var Exact;
(function (Exact) {
    // @TODO: Implement Image compare
    // const mic = require('mocha-image-compare')({
    //   report: './report',
    //   threshold: 0.002,
    //   highlight: 'yellow',
    // });
    // ------------------------------------------------------------------------
    //                               Consts
    // ------------------------------------------------------------------------
    const TEMPLATE_PATH = 'template';
    const RUN_PATH = 'tests.run';
    const ASSETS_PATH = 'assets';
    const DEFAULT_TEST_WIDTH = 640;
    const DEFAULT_TEST_HEIGHT = 480;
    const _DEFAULT_TIMEOUT = 20 * 1000;
    const DEFAULT_TEST_GEN_FRAMES_WIDTH = 100;
    const DEFAULT_TEST_GEN_FRAMES_HEIGHT = 100;
    const _DEFAULT_EXPECTED_PATH = './expected/frames';
    Exact._TEST_DIGIT_LIMIT = 1000; // same as interpolator.js
    class TestBuilder {
        constructor() {
            // default input params
            this.elDuration = '1s';
            this.prop = 'left';
            this.fps = 4;
            this.min = 20;
            this.max = 40;
            this.isPosAbsolute = true;
            this.runTestParams = {};
            this.testFunc = defaultTestFunc;
        }
        getTestLabel(test) {
            return `${test.preLabel || ''}${test.elName} `
                + `${test.prop} goes from ${test.min} to ${test.max}${test.postLabel || ''}`;
        }
        getTestAnime(test) {
            return {
                selector: `#${test.elName}`,
                duration: test.elDuration,
                props: [{
                        duration: test.duration,
                        easing: test.easingName,
                        prop: test.prop,
                        value: test.max,
                    }],
            };
        }
        buildRunTest(test) {
            this.runTestParams[this.getTestLabel(test)] = defaultTestFunc;
        }
        runTest(rd, test) {
            rd.actions.isIdPropActions(test.elName, test.prop, Exact.simulatePixelAction(Exact.interpolateMinMax(test.min, test.max, test.frameCount, test.easingFunc)));
        }
        addTests(tests) {
            Exact.builder = this;
            this.tests = tests;
            this.testCountForHtml = tests.length;
            tests.forEach((test, index) => {
                test.builder = this;
                test.elIndex = test.elIndex || this.elIndex;
                if (test.elIndex === undefined) {
                    test.elIndex = index;
                }
                if (test.isPosAbsolute === undefined) {
                    test.isPosAbsolute = this.isPosAbsolute;
                }
                test.elName = `t${test.elIndex}`;
                test.min = test.min || this.min;
                test.max = test.max || this.max;
                test.prop = test.prop || this.prop;
                test.elDuration = test.elDuration || this.elDuration;
                test.realDuration = test.duration || test.elDuration;
                if (test.frameCount === undefined) {
                    test.frameCount = calcFrameCount(test.realDuration, this.fps);
                }
                this.buildRunTest(test);
            });
        }
        getInMacros() {
            return {
                fps: this.fps,
                css: this.tests.map((test) => `#${test.elName} {${test.isPosAbsolute ? 'position: absolute; ' : ''}`
                    + `${test.prop}: ${test.min}px}`).join('\n'),
                animes: this.tests.map((test) => {
                    return this.getTestAnime(test);
                }),
                html: Exact.genTestHtml(this.testCountForHtml, this.cssClassesForHtml),
            };
        }
    }
    Exact.TestBuilder = TestBuilder;
    function defaultTestFunc(rd, done, index) {
        Exact.builder.runTest(rd, Exact.builder.tests[index]);
        done();
    }
    Exact.defaultTestFunc = defaultTestFunc;
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    Exact.obj2String = (obj) => JSON.stringify(obj, undefined, 2);
    function hexToRgb(hex) {
        const _hh2Int = (delta) => parseInt(hex.substr(delta, 2), 16);
        return `rgb(${_hh2Int(1)}, ${_hh2Int(3)}, ${_hh2Int(5)})`;
    }
    Exact.hexToRgb = hexToRgb;
    Exact.roundTestDigit = (v) => Math.round(v * Exact._TEST_DIGIT_LIMIT) / Exact._TEST_DIGIT_LIMIT;
    function calcFrameCount(duration, fps, defaultDuration) {
        if (!duration) {
            return Math.round(defaultDuration * fps - 0.0001);
        }
        if (typeof duration === 'number') {
            return duration;
        }
        const [all, sValue, unit] = duration.match(/^([\d\.]+)(s|ms|f|%)$/) || ['', '', ''];
        if (!all) {
            throw `Unknown duration ${duration}`;
        }
        let value = parseFloat(sValue);
        switch (unit) {
            case '%':
                value = (value / 100) * fps * defaultDuration;
                break;
            case 's':
                value = value * fps;
                break;
            case 'ms':
                value = (value / 1000) * fps;
                break;
        }
        return Math.round(value - 0.0001);
    }
    Exact.calcFrameCount = calcFrameCount;
    function genTestHtml(count, opts) {
        const res = [];
        opts = opts || {};
        opts.cssClass = opts.cssClass === undefined ? 'abslf' : opts.cssClass;
        opts.htmlTag = opts.htmlTag || 'div';
        opts.idPrefix = opts.idPrefix || 't';
        opts.textPrefix = opts.textPrefix || 't';
        let sceneIndex = 0;
        for (let i = 0; i < count; i++) {
            if (opts.sceneMarkers && opts.sceneMarkers.length > sceneIndex &&
                opts.sceneMarkers[sceneIndex] === i) {
                sceneIndex++;
                res.push('    </div>');
                res.push(`    <div class="abeamer-scene" id=scene${sceneIndex + 1}>`);
            }
            res.push(`        <${opts.htmlTag} class='${opts.cssClass}' `
                + `id='${opts.idPrefix}${i}'>${opts.textPrefix}${i}</${opts.htmlTag}>`);
        }
        return Exact.getTestSquare + res.join('\n');
    }
    Exact.genTestHtml = genTestHtml;
    /**
     * Returns the Html for Test Square
     * A Test square is a red square at the left top designed
     * to be easier for a human to visualize a frame.png file in a image viewer
     *
     */
    Exact.getTestSquare = '<div id="test-square"></div>\n';
    // ------------------------------------------------------------------------
    //                               Simulators
    // ------------------------------------------------------------------------
    function interpolateMinMax(min, max, frameCount, interpolator) {
        // @TIP: JS doesn't differentiate between int and float but this code
        // for a future differentiation
        const framesInt = Math.round(frameCount);
        const res = [];
        const delta = (max - min);
        for (let i = 0; i < framesInt; i++) {
            const t = framesInt > 1 ? i / (framesInt - 1) : 1;
            const v = interpolator ? interpolator(t) : t;
            res.push(v * delta + min);
        }
        return res;
    }
    Exact.interpolateMinMax = interpolateMinMax;
    function interpolateList(list, cycle) {
        const res = [];
        const listLen = list.length;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < cycle.length; i++) {
            const listIndex = Math.floor(listLen * Math.min(Math.max(0, cycle[i]), 0.999));
            res.push(list[listIndex]);
        }
        return res;
    }
    Exact.interpolateList = interpolateList;
    function roundToTestDigits(values) {
        values.forEach((v, i) => {
            values[i] = Math.round(v * Exact._TEST_DIGIT_LIMIT) /
                Exact._TEST_DIGIT_LIMIT;
        });
    }
    Exact.roundToTestDigits = roundToTestDigits;
    Exact.simulatePixelAction = (values) => values.map(value => Math.round(value) + 'px');
    Exact.simulateNumAction = (values) => values.map(value => value.toString());
    function simulateAction(values, propType) {
        switch (propType) {
            case dev_consts_js_1.DevConsts.PT_PIXEL:
                return Exact.simulatePixelAction(values);
            case dev_consts_js_1.DevConsts.PT_NUMBER:
                return Exact.simulateNumAction(values);
        }
    }
    Exact.simulateAction = simulateAction;
    // ------------------------------------------------------------------------
    //                               Assertion
    // ------------------------------------------------------------------------
    function AssertHasLine(rd, line, isError = false) {
        chai_1.assert.isTrue((!isError ? rd.out : rd.errLines).indexOf(line) !== -1, `missing: [${line}]`);
    }
    Exact.AssertHasLine = AssertHasLine;
    // ------------------------------------------------------------------------
    //                               Actions
    // ------------------------------------------------------------------------
    class Actions {
        constructor(actions, ranges) {
            this.actions = actions;
            this.ranges = ranges;
            // ------------------------------------------------------------------------
            //                               Filter
            // ------------------------------------------------------------------------
            this.filterByElement = (elementId) => this.actions.filter(action => action[0] === elementId).
                map(action => [action[1], action[2]]);
            this.filterByElementProp = (elementId, propName) => this.actions.filter(action => action[0] === elementId && action[1] === propName).
                map(action => action[2]);
            this.filterRangeByElementProp = (elementId, propName) => this.ranges.filter(range => range[0] === elementId && range[1] === propName).
                map(range => [range[2], range[3]]);
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
                    console.log('Actual:');
                    console.log(actual);
                    console.log('Expected:');
                    console.log(expected);
                }
            }
            let actual = this.filterByElementProp(elementId, propName);
            actual = actual.slice(actualStartIndex, actualLength === undefined ? actual.length :
                actualStartIndex + actualLength);
            if (expected.length !== actual.length) {
                if (toAssert) {
                    failTestAndLog();
                    throw `id: ${elementId} prop: ${propName} actions `
                        + `expected ${expected.length} length, but actual is ${actual.length}`;
                }
                return -2;
            }
            return actual.findIndex((value, index) => {
                if (value !== expected[index]) {
                    failTestAndLog();
                    if (toAssert) {
                        throw `id: ${elementId} prop: ${propName} index: ${index} `
                            + `expected ${value} length, but actual is ${expected[index]}`;
                    }
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        isActions(_expected, toAssert = true, _toLogIfFails = true) {
            return this.actions.findIndex((action, index) => {
                const expectedIt = action[index];
                const res = action[0] === expectedIt[0]
                    && (action[1] === expectedIt[1])
                    && (action[2] === expectedIt[2]);
                if (!res && toAssert) {
                }
                return !res;
            });
        }
        isIdPropRanges(elementId, propName, expected, toAssert = true, toLogIfFails = true, actualStartIndex = 0, actualLength) {
            function failTestAndLog() {
                if (toLogIfFails) {
                    console.log('Actual:');
                    console.log(actual);
                    console.log('Expected:');
                    console.log(expected);
                }
            }
            let actual = this.filterRangeByElementProp(elementId, propName);
            actual = actual.slice(actualStartIndex, actualLength === undefined ? actual.length :
                actualStartIndex + actualLength);
            if (expected.length !== actual.length) {
                if (toAssert) {
                    failTestAndLog();
                    throw `id: ${elementId} prop: ${propName} actions `
                        + `expected ${expected.length} length, but actual is ${actual.length}`;
                }
                return -2;
            }
            return actual.findIndex((value, index) => {
                if (value[0] !== expected[index][0] || value[1] !== expected[index][1]) {
                    failTestAndLog();
                    if (toAssert) {
                        throw `id: ${elementId} prop: ${propName} index: ${index} `
                            + `expected ${value} length, but actual is ${expected[index]}`;
                    }
                    return true;
                }
                else {
                    return false;
                }
            });
        }
    }
    Exact.Actions = Actions;
    function assertionManager(suiteName, params, holder, callback) {
        before(() => {
            return new Promise((resolve) => {
                callback(resolve);
            });
        });
        const tests = params.tests || {};
        const testNames = Object.keys(tests);
        // tslint:disable-next-line:only-arrow-functions space-before-function-paren
        describe(suiteName, function () {
            testNames.forEach((name, index) => {
                const func = tests[name];
                // tslint:disable-next-line:only-arrow-functions space-before-function-paren
                it(name, function (done) {
                    this.timeout(/* holder.rd.params.timeout || DEFAULT_TIMEOUT */ 0);
                    if (!holder.rd.hasCriticalError) {
                        func(holder.rd, done, index);
                    }
                    else {
                        done('Critical Error, Test Aborted');
                    }
                });
            });
        });
    }
    // ------------------------------------------------------------------------
    //                               Runs Test Suite
    // ------------------------------------------------------------------------
    /**
     * Creates the folder tests.run/<name>, copies and transforms the test template
     * Executes the test under server
     *
     * @param suiteName Test Suite name or filename containing the Test Suite
     */
    function runTestSuite(suiteName, inMacros, params, callback) {
        // converts __filename to the suiteName
        suiteName = fsix_js_1.fsix.toPosixSlash(suiteName).replace(/^.*\/([^\/]+)\.js$/, '$1');
        params.toNotTimeExecution = params.toNotTimeExecution !== false ? true : false;
        const rd = {
            suiteName,
            params,
            inMacros,
            fps: inMacros.fps,
            exceptions: {},
        };
        rd.root = fsix_js_1.fsix.toPosixSlash(__dirname);
        rd.inFolder = rd.root + '/' + TEMPLATE_PATH;
        rd.runPath = rd.root + '/' + RUN_PATH;
        rd.outFolder = rd.runPath + '/' + suiteName;
        fsix_js_1.fsix.mkdirpSync(rd.runPath);
        fsix_js_1.fsix.mkdirpSync(rd.outFolder);
        initInMacros(inMacros, params);
        const macros = initReplaceMacros(inMacros, params);
        const files = sysFs.readdirSync(rd.inFolder);
        files.forEach((fileName) => {
            let text = fsix_js_1.fsix.readUtf8Sync(sysPath.join(rd.inFolder, fileName));
            macros.forEach(item => {
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
                rd.startTime = new Date();
            }
            runExternal(rd, callback, holder, resolve);
        });
    }
    Exact.runTestSuite = runTestSuite;
    // ------------------------------------------------------------------------
    //                               parseAnimes
    // ------------------------------------------------------------------------
    function parseAnimes(jsAnimes, parallelAnimes) {
        const PRE_ADD_TRY_CATCH = `try {`;
        const POST_ADD_TRY_CATCH = `
} catch (error) {
  story.logFrmt('EXCEPTION', [['index', __INDEX__], ['error', error]]);
  if (!independentCases) story.exit();
}
`;
        jsAnimes = (typeof jsAnimes === 'object') ? jsAnimes : [jsAnimes];
        const addedScenes = ['1'];
        return jsAnimes.map((jsAnime, animeIndex) => {
            let toWrapAddAnimations = true;
            let sceneNr = '1';
            let preAdd = '';
            if (typeof jsAnime === 'object' &&
                jsAnime.length === 2 &&
                typeof (jsAnime[0]) === 'string' && jsAnime[0][0] === '@') {
                const [command, value] = jsAnime[0].split(':');
                jsAnime = jsAnime[1];
                switch (command) {
                    case '@@scene':
                        sceneNr = value;
                        if (addedScenes.indexOf(sceneNr) === -1) {
                            preAdd += `var scene${sceneNr} = `
                                + `story.scenes[${parseInt(sceneNr) - 1}];\n`;
                        }
                        break;
                    case '@@no-wrap-add-animation':
                        toWrapAddAnimations = false;
                        break;
                }
            }
            if (typeof jsAnime === 'object') {
                jsAnime = Array.isArray(jsAnime) && parallelAnimes && parallelAnimes[animeIndex]
                    ? Exact.obj2String(jsAnime) : '[' + Exact.obj2String(jsAnime) + ']';
            }
            if (toWrapAddAnimations) {
                jsAnime = `\nscene${sceneNr}.addAnimations(`
                    + jsAnime
                    + `);\n`;
            }
            return preAdd
                + PRE_ADD_TRY_CATCH
                + jsAnime
                + POST_ADD_TRY_CATCH.replace(/__INDEX__/, animeIndex.toString());
        }).join('');
    }
    // ------------------------------------------------------------------------
    //                               initInMacros
    // ------------------------------------------------------------------------
    function initInMacros(inMacros, params) {
        if (inMacros.animes) {
            inMacros.js = parseAnimes(inMacros.animes, params.parallelAnimes);
            inMacros.animes = undefined;
        }
        if (params.jsMacros) {
            params.jsMacros.forEach(macro => {
                inMacros.js = inMacros.js.replace(macro[0], macro[1]);
            });
        }
        inMacros.width = inMacros.width ||
            (!params.toGenFrames ? DEFAULT_TEST_WIDTH : DEFAULT_TEST_GEN_FRAMES_WIDTH);
        inMacros.height = inMacros.height ||
            (!params.toGenFrames ? DEFAULT_TEST_HEIGHT : DEFAULT_TEST_GEN_FRAMES_HEIGHT);
    }
    /**
     * Initializes the `Macros`.
     * Usage: replace text on `.js/.html/.css` files.
     */
    function initReplaceMacros(inMacros, params) {
        const cfg = dev_config_js_1.DevCfg.getConfig(sysPath.dirname(__dirname));
        const macros = Object.keys(inMacros).map(key => [new RegExp(`__${key.toUpperCase()}__`, 'g'),
            inMacros[key] || '']);
        macros.push([/__LIB_FILES__/,
            fsix_js_1.fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE)
                .libModules.map(file => `    <script src="../../../client/lib/js/${file}.js"></script>\n`).join('')]);
        macros.push([/__PLUGINS__/,
            params.plugins ?
                params.plugins.map(plugin => `    <script src="../../../client/lib/plugins/${plugin}/${plugin}.js"></script>\n`).join('') : '']);
        macros.push([/__ASSETS_PATH__/g, `../../${ASSETS_PATH}`]);
        macros.push([/__IND_CASES__/,
            params.casesAreDependent !== true ? 'true' : 'false']);
        macros.push([/__EXIT_RENDER_ON_FINISHED__/,
            params.exitRenderOnFinished !== false ? 'true' : 'false']);
        macros.push([/__RENDER_FRAME_OPTIONS__/,
            params.renderFrameOptions ?
                JSON.stringify(params.renderFrameOptions, undefined, 2)
                : 'undefined']);
        macros.push([/__EXTRA_RENDER_CALLS__/,
            params.extraRenderCalls && params.extraRenderCalls.length ?
                params.extraRenderCalls.map(frameOptions => `        story.render(story.bestPlaySpeed(),` +
                    JSON.stringify(frameOptions, undefined, 2) + ');\n').join('\n') : '']);
        return macros;
    }
    // ------------------------------------------------------------------------
    //                               createShellFile
    // ------------------------------------------------------------------------
    /**
     * Creates a shell file.
     * Usage: manually execute a test.
     */
    function createShellFile(rd) {
        const isWin = sysProcess.platform === 'win32';
        const scriptName = rd.outFolder + '/run' + (isWin ? '.bat' : '.sh');
        const shell = '#/usr/bin/env sh\n';
        sysFs.writeFileSync(scriptName, (isWin ? '' : shell) + rd.cmdLine + '\n');
        if (!isWin) {
            sysFs.chmodSync(scriptName, '0775');
        }
    }
    // ------------------------------------------------------------------------
    //                               buildCmdLine
    // ------------------------------------------------------------------------
    /**
     * Creates the command line.
     * Usage: execute the render server agent.
     */
    function buildCmdLine(rd) {
        const params = rd.params;
        const serverName = (params.server || rel_consts_js_1.RelConsts.DEFAULT_SERVER);
        let cmdLine = (rel_consts_js_1.RelConsts.NODE_SERVERS.indexOf(serverName) !== -1 ? 'node' : serverName)
            // use double quotes for files to support space files and windows
            + ` "${rd.root}/../cli/../server/server-agent-${serverName}.js"`
            + ` --ll ${params.logLevel !== undefined ? params.logLevel : consts_js_1.Consts.LL_VERBOSE}`
            + (params.toDelPreviousFrames !== false ? ' --dp' : '')
            + (params.toGenFrames ? '' : ' --noframes')
            + ` --config "${rd.outFolder}/abeamer.ini"`;
        if (params.onCmdLine) {
            cmdLine = params.onCmdLine(cmdLine);
        }
        rd.cmdLine = cmdLine;
    }
    // ------------------------------------------------------------------------
    //                               runExternal
    // ------------------------------------------------------------------------
    function runExternal(rd, callback, holder, resolve) {
        fsix_js_1.fsix.runExternal(rd.cmdLine, (error, stdout, stderr) => {
            if (rd.params.toNotTimeExecution) {
                rd.executionTime = new Date() - rd.startTime;
                console.log(`${rd.suiteName} finished ${rd.executionTime} (ms)\n`);
            }
            rd.error = error;
            rd.out = (stdout || '').trim();
            rd.err = (stderr || '').trim();
            rd.outLines = rd.out.split('\n');
            rd.errLines = rd.err.split('\n');
            // browser can send error but the server doesn't log as an error
            rd.outLines.forEach(line => {
                if (line.search(/\[(CRITICAL|ERROR|EXCEPTION)\]/) !== -1) {
                    rd.errLines.push(line);
                }
            });
            rd.hasError = error || rd.err.length > 0;
            if (rd.hasError) {
                if (rd.errLines && rd.params.expectedErrors) {
                    rd.filteredErrLines = rd.errLines
                        .filter(item => rd.params.expectedErrors.indexOf(item) === -1);
                    rd.hasError = rd.filteredErrLines.length > 0;
                }
                else {
                    rd.filteredErrLines = rd.errLines;
                }
                if (rd.hasError) {
                    console.log(`rd.hasError: ${rd.hasError}`);
                }
                if (rd.hasError && rd.params.toNotLogStdErr !== false) {
                    console.error('Error:', rd.error);
                    console.log('StdErr:[', rd.filteredErrLines);
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
    // ------------------------------------------------------------------------
    //                               parseActions
    // ------------------------------------------------------------------------
    function getResTagParams(line, tag, callback) {
        if (line.substr(0, tag.length + 1) === tag + ':') {
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
        return undefined;
    }
    Exact.getResTagParams = getResTagParams;
    function parseActions(rd) {
        const actions = [];
        const ranges = [];
        if (rd.params.toLogStdOut) {
            rd.outLines.forEach((line, index) => {
                console.log(`${index}:[${line}]`);
            });
        }
        rd.outLines.forEach(line => {
            getResTagParams(line, 'action', (action) => {
                actions.push(action);
            });
            getResTagParams(line, 'action-range', (range) => {
                ranges.push([range[0], range[1],
                    parseInt(range[2]), parseInt(range[3])]);
            });
            Exact.getResTagParams(line, 'EXCEPTION', (exprData) => {
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
})(Exact || (exports.Exact = Exact = {}));
//# sourceMappingURL=exact.js.map