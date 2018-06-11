"use strict";
// uuid: cff5fa1a-6742-47d3-81ac-bfe45a97d764

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";

namespace Tests {

  const min = 50;
  const fps = 4;
  const divider = 1000 / fps;

  const tests: {
    name?: string;
    duration?: string | int;
    min?: int;
    max?: int;
    frameCount?: int;
    position?: string | int;
    startFrame?: int;
    isStill?: boolean;
    shift: int;
  }[] =
    [
      {
        name: 'before-still', duration: '2s', max: 100,
        frameCount: 2000 / divider, shift: 0,
      },
      {
        name: 'still', duration: '1s', isStill: true,
        shift: 1000 / divider,
      },
      {
        name: 'after-still', duration: '3s', max: 150,
        position: '-0.5s', frameCount: 3000 / divider,
        shift: -500 / divider,
      }];

  const ranges: [int, int][] = [];
  let minAcc = min;
  let startFrameAcc = 0;
  let absStartFrameAcc = 0;

  tests.forEach(test => {
    absStartFrameAcc += test.shift;
    if (!test.isStill) {
      test.min = minAcc;
      minAcc = test.max;
      test.startFrame = startFrameAcc;
      startFrameAcc += test.frameCount;
      ranges.push([absStartFrameAcc, test.frameCount]);
      absStartFrameAcc += test.frameCount;
    }
  });


  const func = (rd: Exact.ExactResult, done, index) => {

    const test = tests[index];
    if (!test.isStill) {
      rd.actions.isIdPropActions('t0', 'left',
        Exact.simulatePixelAction(
          Exact.interpolateMinMax(test.min, test.max, test.frameCount)),
        true, true,
        test.startFrame, test.frameCount);

    } else {
      rd.actions.isIdPropRanges('t0', 'left', ranges);
    }
    done();
  };

  const testParams: Exact.Tests = {};
  tests.forEach((test, index) => {
    testParams[!test.isStill
      ? `${test.name} - t0 moves for ${test.duration} at ${test.position || ''}`
      : `${test.name} - t0 DOESN'T moves for ${test.duration}`
    ] = func;
  });


  const animes = tests.map((test, index) => {
    return !test.isStill ?
      {
        selector: `#t0`,
        duration: test.duration,
        position: test.position,
        props: [{
          prop: 'left',
          value: test.max,
        }],
      }
      : ['@@no-wrap-add-animation', `scene1.addStills("${test.duration}");`] as [string, string];
  });

  Exact.runTestSuite(__filename, {
    fps,
    css: `#t0 {left: ${min}px}`,

    animes,
    html: Exact.genTestHtml(1),
  },
    {
      tests: testParams,
    },
  );
}
