"use strict";
// uuid: ff759cf5-29fb-4cb9-a460-8b70e6bec95a

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module developer | This module won't be part of release version */

import { assert } from "chai";

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysProcess from "process";

import { Consts } from "../shared/lib/consts.js";
import { RelConsts } from "../shared/rel-consts.js";
import { DevConsts } from "../shared/lib/dev-consts.js";
import { fsix } from "../shared/vendor/fsix.js";
import { DevCfg } from "../shared/dev-config.js";


/**
 * ## Description
 *
 * **Exact** is a test framework created to test ABeamer functionality.
 * It makes a copy of the template, modifying its data.
 * It executes abeamer under headless browser and captures its output.
 *
 */
export namespace Exact {

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

  export let _TEST_DIGIT_LIMIT: int = 1000; // same as interpolator.js

  // ------------------------------------------------------------------------
  //                               Types & Interfaces
  // ------------------------------------------------------------------------

  type StringOrCommand = string
    | '@@no-wrap-add-animation'
    // sets the scene number. @default 1
    | '@@scene';


  export type AnimeArrayType = (object | string | [StringOrCommand, string | object])[];
  export type AnimesType = string | AnimeArrayType;
  export type TestFunc = (rd: ExactResult, done, index?: int) => void;
  export interface Tests { [name: string]: TestFunc; }


  interface ExactInMacros {
    width?: int;
    height?: int;
    fps?: int;
    css?: string;
    js?: string;
    /** To run animations in parallel enclose on brackets and set parallelAnimes. */
    animes?: AnimesType;
    html?: string;
  }


  interface ExactParams {
    jsMacros?: [string, string][];

    plugins?: string[];

    // render params
    exitRenderOnFinished?: boolean;
    renderFrameOptions?: ABeamer.RenderFrameOptions;
    extraRenderCalls?: ABeamer.RenderFrameOptions[];


    /** Name of the headless server.
     * @default DEFAULT_SERVER
     */
    server?: string;


    /**
     * Sets the log level
     * @default LL_VERBOSE
     */
    logLevel?: uint;


    /**
     * Set the timeout per test case.
     * @default DEFAULT_TIMEOUT
     */
    timeout?: uint;

    /** If true, it creates the story-frames files */
    toGenFrames?: boolean;


    // @TODO: Implement expectedFolder
    /**
     * If toGenFrames is true, it uses this folder to compare with actual images
     * and report with the expected images
     */
    expectedFolder?: string;


    /** If true, runs the test against the release version instead of the
     * development version
     */
    toUseReleaseVersion?: boolean;


    /** If it's true, after receiving the execution results, it doesn't sets the ResData.actions  */
    toNotParseActions?: boolean;


    /**
     * Deletes previous created frames.
     * @default True
     */
    toDelPreviousFrames?: boolean;


    /** Sends to console stdout */
    toLogStdOut?: boolean;


    /**
     * Sends to console stderr.
     * @default true
     */
    toNotLogStdErr?: boolean;


    /** Sends to console the list of actions */
    toLogActions?: boolean;


    /** Boolean list of animations indexes that run in parallel. */
    parallelAnimes?: boolean[];


    /**
     * Sends to console the execution time.
     * @default True
     */
    toNotTimeExecution?: boolean;


    /** Set to true, if an exception in a test case should stop all test cases */
    casesAreDependent?: boolean;


    /** Allows to modify the command line */
    onCmdLine?: (cmdLine: string) => string;


    /** Allows to process each line of the resulting output */
    onParseOutputLine?: (line: string) => void;

    /** Lists of errors that are expected to occur */
    expectedErrors?: string[];


    tests?: Tests;
  }


  export interface ExactResult {
    suiteName: string;
    params: ExactParams;
    inMacros: ExactInMacros;
    fps: int;

    startTime?: Date;
    executionTime?: number;

    root?: string;
    inFolder?: string;
    runPath?: string;
    outFolder?: string;

    cmdLine?: string;

    error?: any;
    out?: string;
    err?: string;
    hasError?: boolean;
    hasCriticalError?: boolean;
    outLines?: string[];
    errLines?: string[];
    filteredErrLines?: string[];
    actions?: Actions;
    exceptions: { [id: number]: string };
  }

  // ------------------------------------------------------------------------
  //                               Test Builder
  // ------------------------------------------------------------------------

  export interface TestParams {
    preLabel?: string;
    postLabel?: string;

    duration?: string | int;
    /**
     * This is the test duration or element duration
     * Used to calculate the frame count
     */
    realDuration?: string | int;
    frameCount?: int;
    easingFunc?: (t) => number;
    easingName?: string;

    min?: int;
    max?: int;

    elDuration?: string | int;
    elIndex?: int;
    elName?: string;

    prop?: string;

    sceneIndex?: int;

    builder?: TestBuilder;
    isPosAbsolute?: boolean;
  }


  export class TestBuilder {

    // default input params
    elDuration: string | int = '1s';
    elIndex: int;

    prop = 'left';
    fps = 4;
    min = 20;
    max = 40;

    cssClassesForHtml: HtmlOptions;
    isPosAbsolute: boolean = true;

    // generated properties
    tests?: TestParams[];
    runTestParams: Tests = {};
    testCountForHtml?: int;

    testFunc?: TestFunc = defaultTestFunc;


    getTestLabel(test: TestParams) {
      return `${test.preLabel || ''}${test.elName} `
        + `${test.prop} goes from ${test.min} to ${test.max}${test.postLabel || ''}`;
    }


    getTestAnime(test: TestParams): ABeamer.Animation {
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


    buildRunTest(test: TestParams) {
      this.runTestParams[this.getTestLabel(test)] = defaultTestFunc;
    }


    runTest(rd: Exact.ExactResult, test: TestParams) {
      rd.actions.isIdPropActions(test.elName, test.prop,
        Exact.simulatePixelAction(
          Exact.interpolateMinMax(test.min, test.max, test.frameCount,
            test.easingFunc)));
    }


    addTests(tests: TestParams[]) {
      builder = this;
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
        css: this.tests.map((test) =>
          `#${test.elName} {${test.isPosAbsolute ? 'position: absolute; ' : ''}`
          + `${test.prop}: ${test.min}px}`).join('\n'),
        animes:
          this.tests.map((test) => {
            return this.getTestAnime(test);
          }),
        html: Exact.genTestHtml(this.testCountForHtml, this.cssClassesForHtml),
      };
    }
  }


  export let builder: TestBuilder;


  export function defaultTestFunc(rd: Exact.ExactResult, done, index): void {
    builder.runTest(rd, builder.tests[index]);
    done();
  }

  // ------------------------------------------------------------------------
  //                               Tools
  // ------------------------------------------------------------------------

  export const obj2String = (obj: any) => JSON.stringify(obj, undefined, 2);


  export function hexToRgb(hex: string): string {
    const _hh2Int = (delta) => parseInt(hex.substr(delta, 2), 16);
    return `rgb(${_hh2Int(1)}, ${_hh2Int(3)}, ${_hh2Int(5)})`;
  }


  export const roundTestDigit = (v: number) =>
    Math.round(v * _TEST_DIGIT_LIMIT) / _TEST_DIGIT_LIMIT;


  export function calcFrameCount(duration: string | int, fps: int,
    defaultDuration?: int): int {

    if (!duration) {
      return Math.round(defaultDuration * fps - 0.0001);
    }

    if (typeof duration === 'number') {
      return duration as int;
    }

    const [all, sValue, unit] = duration.match(/^([\d\.]+)(s|ms|f|%)$/) || ['', '', ''];
    if (!all) { throw `Unknown duration ${duration}`; }
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

  // ------------------------------------------------------------------------
  //                               Generators
  // ------------------------------------------------------------------------

  export interface HtmlOptions {
    cssClass?: string;
    htmlTag?: string;
    idPrefix?: string;
    textPrefix?: string;
    sceneMarkers?: int[];
  }


  export function genTestHtml(count: int, opts?: HtmlOptions): string {
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
    return getTestSquare + res.join('\n');
  }


  /**
   * Returns the Html for Test Square
   * A Test square is a red square at the left top designed
   * to be easier for a human to visualize a frame.png file in a image viewer
   *
   */
  export const getTestSquare = '<div id="test-square"></div>\n';

  // ------------------------------------------------------------------------
  //                               Simulators
  // ------------------------------------------------------------------------

  export function interpolateMinMax(min, max: int, frameCount: number,
    interpolator?: (t) => number) {
    // @TIP: JS doesn't differentiate between int and float but this code
    // for a future differentiation
    const framesInt = Math.round(frameCount);
    const res: number[] = [];
    const delta = (max - min);
    for (let i = 0; i < framesInt; i++) {
      const t = framesInt > 1 ? i / (framesInt - 1) : 1;
      const v = interpolator ? interpolator(t) : t;
      res.push(v * delta + min);
    }
    return res;
  }


  export function interpolateList(list: any[], cycle: number[]): any[] {
    const res = [];
    const listLen = list.length;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cycle.length; i++) {
      const listIndex = Math.floor(listLen * Math.min(Math.max(0, cycle[i]), 0.999));
      res.push(list[listIndex]);
    }
    return res;
  }


  export function roundToTestDigits(values: number[]): void {
    values.forEach((v, i) => {
      values[i] = Math.round(v * _TEST_DIGIT_LIMIT) /
        _TEST_DIGIT_LIMIT;
    });
  }

  export let simulatePixelAction = (values: number[]): string[] =>
    values.map(value => Math.round(value) + 'px');


  export let simulateNumAction = (values: number[]): string[] =>
    values.map(value => value.toString());


  export function simulateAction(values: any[], propType: uint): string[] {
    switch (propType) {
      case DevConsts.PT_PIXEL:
        return Exact.simulatePixelAction(values);

      case DevConsts.PT_NUMBER:
        return Exact.simulateNumAction(values);
    }
  }

  // ------------------------------------------------------------------------
  //                               Assertion
  // ------------------------------------------------------------------------

  export function AssertHasLine(rd: ExactResult, line: string,
    isError: boolean = false) {
    assert.isTrue((!isError ? rd.out : rd.errLines).indexOf(line) !== -1,
      `missing: [${line}]`);
  }

  // ------------------------------------------------------------------------
  //                               Actions
  // ------------------------------------------------------------------------

  export class Actions {

    constructor(public actions: [string, string, string][],
      public ranges: [string, string, int, int][]) { }

    // ------------------------------------------------------------------------
    //                               Filter
    // ------------------------------------------------------------------------

    filterByElement = (elementId: string) =>
      this.actions.filter(action => action[0] === elementId).
        map(action => [action[1], action[2]])


    filterByElementProp = (elementId: string, propName: string) =>
      this.actions.filter(action => action[0] === elementId && action[1] === propName).
        map(action => action[2])


    filterRangeByElementProp = (elementId: string, propName: string) =>
      this.ranges.filter(range => range[0] === elementId && range[1] === propName).
        map(range => [range[2], range[3]] as [int, int])

    // ------------------------------------------------------------------------
    //                               Log
    // ------------------------------------------------------------------------

    log(): void {
      console.log(this.actions);
    }


    logByElement(elementId: string): void {
      console.log(this.filterByElement(elementId));
    }


    logByElementProp(elementId: string, propName: string): void {
      console.log(this.filterByElementProp(elementId, propName));
    }

    // ------------------------------------------------------------------------
    //                               Assertion
    // ------------------------------------------------------------------------

    isIdPropActions(
      elementId: string,
      propName: string,
      expected: string[],
      toAssert: boolean = true,
      toLogIfFails: boolean = true,
      actualStartIndex: int = 0,
      actualLength?: int) {

      function failTestAndLog(): void {
        if (toLogIfFails) {
          console.log('Actual:');
          console.log(actual);
          console.log('Expected:');
          console.log(expected);
        }
      }

      let actual = this.filterByElementProp(elementId, propName);

      actual = actual.slice(actualStartIndex,
        actualLength === undefined ? actual.length :
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
        } else {
          return false;
        }
      });
    }


    isActions(
      _expected: [string, string, string][],
      toAssert: boolean = true,
      _toLogIfFails: boolean = true) {

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


    isIdPropRanges(
      elementId: string,
      propName: string,
      expected: [int, int][],
      toAssert: boolean = true,
      toLogIfFails: boolean = true,
      actualStartIndex: int = 0,
      actualLength?: int): number {

      function failTestAndLog(): void {
        if (toLogIfFails) {
          console.log('Actual:');
          console.log(actual);
          console.log('Expected:');
          console.log(expected);
        }
      }


      let actual = this.filterRangeByElementProp(elementId, propName);

      actual = actual.slice(actualStartIndex,
        actualLength === undefined ? actual.length :
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
        } else {
          return false;
        }
      });
    }
  }

  // ------------------------------------------------------------------------
  //                               Assertion Manager
  // ------------------------------------------------------------------------

  interface ResultHolder {
    rd?: Exact.ExactResult;
  }


  function assertionManager(suiteName: string,
    params: ExactParams,
    holder: ResultHolder,
    callback: (resolve) => void): void {

    before(() => {
      return new Promise((resolve) => {
        callback(resolve);
      });
    });


    const tests = params.tests || {};
    const testNames = Object.keys(tests);

    // tslint:disable-next-line:only-arrow-functions space-before-function-paren
    describe(suiteName, function (): void {

      testNames.forEach((name, index) => {
        const func = tests[name];
        // tslint:disable-next-line:only-arrow-functions space-before-function-paren
        it(name, function (done): void {
          this.timeout(/* holder.rd.params.timeout || DEFAULT_TIMEOUT */0);
          if (!holder.rd.hasCriticalError) {
            func(holder.rd, done, index);
          } else {
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
  export function runTestSuite(suiteName: string,
    inMacros: ExactInMacros,
    params: ExactParams,
    callback?: (rd: ExactResult) => void): void {

    // converts __filename to the suiteName
    suiteName = fsix.toPosixSlash(suiteName).replace(/^.*\/([^\/]+)\.js$/, '$1');

    params.toNotTimeExecution = params.toNotTimeExecution !== false ? true : false;

    const rd: ExactResult = {
      suiteName,
      params,
      inMacros,
      fps: inMacros.fps,
      exceptions: {},
    };
    rd.root = fsix.toPosixSlash(__dirname);
    rd.inFolder = rd.root + '/' + TEMPLATE_PATH;
    rd.runPath = rd.root + '/' + RUN_PATH;
    rd.outFolder = rd.runPath + '/' + suiteName;

    fsix.mkdirpSync(rd.runPath);
    fsix.mkdirpSync(rd.outFolder);

    initInMacros(inMacros, params);

    const macros = initReplaceMacros(inMacros, params);

    const files = sysFs.readdirSync(rd.inFolder);
    files.forEach((fileName) => {
      let text = fsix.readUtf8Sync(sysPath.join(rd.inFolder, fileName));
      macros.forEach(item => {
        text = text.replace(item[0], item[1]);
      });
      sysFs.writeFileSync(sysPath.join(rd.outFolder, fileName), text);
    });

    buildCmdLine(rd);

    createShellFile(rd);

    const holder: ResultHolder = {};

    assertionManager(suiteName, params, holder, (resolve) => {

      if (params.toNotTimeExecution) {
        console.log(`${suiteName} started`);
        rd.startTime = new Date();
      }

      runExternal(rd, callback, holder, resolve);
    });
  }

  // ------------------------------------------------------------------------
  //                               parseAnimes
  // ------------------------------------------------------------------------

  function parseAnimes(jsAnimes: AnimesType, parallelAnimes: boolean[]): string {
    const PRE_ADD_TRY_CATCH = `try {`;
    const POST_ADD_TRY_CATCH = `
} catch (error) {
  story.logFrmt('EXCEPTION', [['index', __INDEX__], ['error', error]]);
  if (!independentCases) story.exit();
}
`;
    jsAnimes = (typeof jsAnimes === 'object') ? jsAnimes : [jsAnimes];
    const addedScenes = ['1'];

    return (jsAnimes as AnimeArrayType).map((jsAnime, animeIndex) => {

      let toWrapAddAnimations = true;
      let sceneNr = '1';
      let preAdd = '';

      if (typeof jsAnime === 'object' &&
        (jsAnime as object[]).length === 2 &&
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
          ? obj2String(jsAnime) : '[' + obj2String(jsAnime) + ']';
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

  function initInMacros(inMacros: ExactInMacros,
    params: ExactParams): void {

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
  function initReplaceMacros(inMacros: ExactInMacros,
    params: ExactParams): [RegExp, string][] {

    const cfg = DevCfg.getConfig(sysPath.dirname(__dirname));

    const macros = Object.keys(inMacros).map(key =>
      [new RegExp(`__${key.toUpperCase()}__`, 'g'),
      inMacros[key] || ''] as [RegExp, string]);


    macros.push([/__LIB_FILES__/,
      (fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE) as Shared.ModulesList)
        .libModules.map(file =>
          `    <script src="../../../client/lib/js/${file}.js"></script>\n`,
        ).join('')],
    );

    macros.push([/__PLUGINS__/,
      params.plugins ?
        params.plugins.map(plugin =>
          `    <script src="../../../client/lib/plugins/${plugin}/${plugin}.js"></script>\n`,
        ).join('') : ''],
    );


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
        params.extraRenderCalls.map(frameOptions =>
          `        story.render(story.bestPlaySpeed(),` +
          JSON.stringify(frameOptions, undefined, 2) + ');\n',
        ).join('\n') : '']);

    return macros;
  }

  // ------------------------------------------------------------------------
  //                               createShellFile
  // ------------------------------------------------------------------------

  /**
   * Creates a shell file.
   * Usage: manually execute a test.
   */
  function createShellFile(rd: ExactResult): void {
    const isWin = sysProcess.platform === 'win32';
    const scriptName = rd.outFolder + '/run' + (isWin ? '.bat' : '.sh');
    const shell = '#/usr/bin/env sh\n';
    sysFs.writeFileSync(scriptName, (isWin ? '' : shell) + rd.cmdLine + '\n');
    if (!isWin) { sysFs.chmodSync(scriptName, '0775'); }
  }

  // ------------------------------------------------------------------------
  //                               buildCmdLine
  // ------------------------------------------------------------------------

  /**
   * Creates the command line.
   * Usage: execute the render server agent.
   */
  function buildCmdLine(rd: ExactResult): void {
    const params = rd.params;
    const serverName = (params.server || RelConsts.DEFAULT_SERVER);
    let cmdLine =
      (RelConsts.NODE_SERVERS.indexOf(serverName) !== -1 ? 'node' : serverName)
      // use double quotes for files to support space files and windows
      + ` "${rd.root}/../cli/../server/server-agent-${serverName}.js"`
      + ` --ll ${params.logLevel !== undefined ? params.logLevel : Consts.LL_VERBOSE}`
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

  function runExternal(
    rd: ExactResult,
    callback: (rd: ExactResult) => void,
    holder: ResultHolder,
    resolve): void {


    fsix.runExternal(rd.cmdLine, (error, stdout, stderr) => {

      if (rd.params.toNotTimeExecution) {
        rd.executionTime = new Date() as any - (rd.startTime as any);
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
        } else {
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

      if (callback) { callback(rd); }
      holder.rd = rd;
      resolve();
    });
  }

  // ------------------------------------------------------------------------
  //                               parseActions
  // ------------------------------------------------------------------------

  export function getResTagParams(line: string, tag: string,
    callback?: (res: string[]) => void): string[] | undefined {

    if (line.substr(0, tag.length + 1) === tag + ':') {
      const res = [];
      line.replace(/_\[([^\]]*)\]_/g, (match, p) => {
        res.push(p);
        return match;
      });
      if (callback) { callback(res); }
      return res;
    }
    return undefined;
  }

  function parseActions(rd: ExactResult): void {
    const actions: [string, string, string][] = [];
    const ranges: [string, string, int, int][] = [];

    if (rd.params.toLogStdOut) {
      rd.outLines.forEach((line, index) => {
        console.log(`${index}:[${line}]`);
      });
    }

    rd.outLines.forEach(line => {

      getResTagParams(line, 'action', (action) => {
        actions.push(action as any);
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
    if (rd.params.toLogActions) { console.log(rd.actions); }
  }
}
