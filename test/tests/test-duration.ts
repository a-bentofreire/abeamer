"use strict";
// uuid: 76702574-6fb7-4578-89f0-a1db09747996

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";

namespace Tests {

  const elSeconds = 2;
  const min = 10;
  const max = 120;
  const minFps = 4;
  const maxFps = 10;


  interface Test extends Exact.TestParams {
  }


  function getAnimationProps(test: Test): ABeamer.AnimationProp[] {
    return [{
      prop: 'left',
      duration: test.duration,
      value: max,
    }];
  }


  function getTestAnimation(test: Test, index: uint): ABeamer.Animation {
    return {
      selector: `#t${index}`,
      duration: elSeconds + 's',
      props: getAnimationProps(test),
    };
  }


  for (let fps = minFps; fps <= maxFps; fps++) {
    const divider = 1000 / fps;
    const jsMacros = [
      ['"__Func_6s"', 'function () {return "6s"}'],
      ['"__Func_12f"', 'function () {return 12}'],
    ] as [string, string][];

    const tests: Test[] =
      [
        { duration: undefined },
        { duration: '4s' },
        { duration: '4.2s' },
        { duration: '12.333s' },
        { duration: '500ms' },
        { duration: '8f' },
        { duration: '50%' },
        { duration: '12%' },
        { duration: 10 },
        { duration: '__Func_6s', frameCount: 6000 / divider },
        { duration: '__Func_12f', frameCount: 12 },
        { duration: '=round(fps/2)', frameCount: Math.round(fps / 2) },
        { duration: "='1' + '.5s'", frameCount: (1000 + 500) / divider },
      ];

    tests.forEach(test => {
      test.frameCount = test.frameCount ?
        Math.round(test.frameCount - 0.0001)
        : Exact.calcFrameCount(test.duration, fps, elSeconds);
    });

    const func = (rd: Exact.ExactResult, done, index) => {

      const test = tests[index];
      rd.actions.isIdPropActions(`t${index}`, 'left',
        Exact.simulatePixelAction(
          Exact.interpolateMinMax(min, max, test.frameCount)));

      done();
    };

    const testParams = {};
    tests.forEach((test, index) => {
      testParams[`t${index} left goes in ${test.duration} in ${test.frameCount} frames `
        + `with ${fps}fps from ${min} to ${max}`] = func;
    });

    Exact.runTestSuite(__filename.replace(/\.js/, `-${fps}fps.js`), {
      fps,
      css: tests.map((test, index) =>
        `#t${index} {position: absolute; left: ${min}px}`).join('\n'),
      animes: tests.map((test, index) => getTestAnimation(test, index)),
      html: Exact.genTestHtml(tests.length),
    },
      {
        jsMacros,
        tests: testParams,
      },
    );
  }
}
