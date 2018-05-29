"use strict";
// uuid: 243e2595-e191-4656-af45-79f43e4b709e

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
    element: int,
    scene: int,
    duration?: string | int;
    max?: int;
    frameCount?: int;
    startFrame?: int;
    isStill?: boolean;
  }[] =
    [
      {
        scene: 1, element: 0,
        duration: '2s', max: 100,
        frameCount: 2000 / divider,
      },
      {
        scene: 2, element: 2,
        duration: '3s', max: 150,
        frameCount: 3000 / divider,
      }];

  const func = (rd: Exact.ExactResult, done, index) => {

    const test = tests[index];
    rd.actions.isIdPropActions(`t${test.element}`, 'left',
      Exact.simulatePixelAction(
        Exact.interpolateMinMax(min, test.max, test.frameCount)));
    // @TODO: test if went to a different scene 
    done();
  };

  const testParams = {};
  tests.forEach((test, index) => {
    testParams[
      `$t${test.element} on scene${test.scene} moves for ${test.duration}`
    ] = func;
  });


  const animes = tests.map((test, index) => {
    return [`@@scene:${test.scene}`, {
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
    },
  );
}
