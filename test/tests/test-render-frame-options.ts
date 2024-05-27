"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// @WARN: This test should be review if ABeamer is capable of linking
// the end of a property animation with the next and bypass the end frame of
// the first animation

import { Exact } from "../exact.js";

namespace Tests {

  const min = 50;
  const fps = 4;

  export interface TimeTest {
    duration?: string | int;
    frameCount?: int;
  }

  export interface Test extends TimeTest {
    element?: int;
    sceneNr?: int;
    max?: int;
    startFrame?: int;
    isStill?: boolean;
  }

  const tests: Test[] =
    ([
      { // it goes from 50 to 100 in 2s
        sceneNr: 1, element: 0,
        duration: '2s', max: 100,
      },
      { // then from 100 to 200 in 2s
        sceneNr: 1, element: 0,
        duration: '2s', max: 200,
      },
      {
        sceneNr: 2, element: 3,
        duration: '1s', max: 150,
      },
      {
        sceneNr: 2, element: 3,
        duration: '2s', max: 300,
      }] as Test[]).map(test => {
        test.frameCount = Exact.calcFrameCount(test.duration, fps);
        return test;
      });


  const t0_inter = [].concat(Exact.simulatePixelAction(
    Exact.interpolateMinMax(min, tests[0].max, tests[0].frameCount)),
    Exact.simulatePixelAction(Exact.interpolateMinMax(tests[0].max, tests[1].max,
      tests[1].frameCount)));

  const t3_inter = [].concat(Exact.simulatePixelAction(
    Exact.interpolateMinMax(min, tests[2].max, tests[2].frameCount)),
    Exact.simulatePixelAction(Exact.interpolateMinMax(tests[2].max, tests[3].max,
      tests[3].frameCount)));


  function testBypass(rd: Exact.ExactResult,
    element: string, fromFrame: int, count: int, dir: int) {

    while (count > 0) {
      const s = `bypass:id=_[${element}]_ prop=_[left]_ frame=_[${fromFrame}]_`;
      Exact.AssertHasLine(rd, s);
      fromFrame += dir;
      count--;
    }
  }

  function testAction(rd: Exact.ExactResult,
    element: string, inter: string[], fromFrame: int, count: int, dir: int) {

    while (count > 0) {
      const s = `action:id=_[${element}]_ prop=_[left]_ value=_[${inter[fromFrame]}]_`;
      Exact.AssertHasLine(rd, s);
      fromFrame += dir;
      count--;
    }
  }

  const renders = [
    {
      test: {
        name: 'Test bypass 1s, and then renders t0 for 2s',
      },
      runTest: (rd: Exact.ExactResult, _render, opts) => {
        const startFrame = Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = Exact.calcFrameCount(opts.renderCount, fps);
        // read the warning on the top of the file
        testBypass(rd, 't0', 0, startFrame, 1);
        testAction(rd, 't0', t0_inter, startFrame, renderFrameCount, 1);
      },

      frameOptions: {
        renderPos: '1s',
        renderCount: '2s',
      },
    },
    {
      test: {
        name: 'Test render 2nd scene, skipping 2frames. moves t2',
      },
      runTest: (rd: Exact.ExactResult, _render, opts) => {
        const startFrame = Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = t3_inter.length - startFrame;
        testBypass(rd, 't3', 0, 3, 1);
        testBypass(rd, 't3', 4, startFrame - 4, 1);
        testAction(rd, 't3', t3_inter, startFrame, renderFrameCount, 1);
      },

      frameOptions: {
        renderPos: '1.5s',
        startScene: 1,
        endScene: 1,
      },
    },
    {
      test: {
        name: 'Test go back to scene 1, rewind 1s, and render 2s',
      },

      runTest: (rd: Exact.ExactResult, _render, opts) => {
        // tests rewind.
        testBypass(rd, 't0', 12, 4, -1);
        const startFrame = Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = Exact.calcFrameCount(opts.renderCount, fps);
        testAction(rd, 't0', t0_inter, startFrame, renderFrameCount, 1);
      },

      frameOptions: {
        renderPos: '2s',
        renderCount: '2s',
      },
    },
  ];


  const func = (rd: Exact.ExactResult, done, index) => {

    const render = renders[index];
    render.runTest(rd, render, render.frameOptions);
    done();
  };

  const testParams: Exact.Tests = {};
  renders.forEach((render) => {
    testParams[render.test.name] = func;
  });


  const animes = tests.map((test) => {
    return [`@@scene:${test.sceneNr}`, {
      selector: `#t${test.element}`,
      duration: test.duration,
      props: [{
        prop: 'left',
        value: test.max,
      }],
    }] as [string, object];
  });

  Exact.runTestSuite(__filename, {
    fps,
    css: `.abslf {left: ${min}px}`,

    animes,
    html: Exact.genTestHtml(7, { sceneMarkers: [2, 4, 6] }),
  },
    {
      tests: testParams,
      renderFrameOptions: renders[0].frameOptions,
      extraRenderCalls: renders.slice(1).map(render => render.frameOptions),
    },
  );
}
