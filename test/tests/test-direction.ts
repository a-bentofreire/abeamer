"use strict";
// uuid: 95763d7e-2066-423d-b64f-787450ec7e0d

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";
import { DevConsts } from "../../shared/lib/dev-consts.js";

namespace Tests {

  const directions = [
    DevConsts.Directions.normal,
    DevConsts.Directions.reverse,
    DevConsts.Directions.alternate,
    DevConsts.Directions['alternate-reverse'],
  ].map(v => DevConsts.Directions[v]);

  const min = 10;
  const max = 40;
  const minIterCount = 1;
  const maxIterCount = 6;
  const fps = 4;
  const seconds = 1;

  const cycle = Exact.interpolateMinMax(min, max, seconds * fps);
  const revCycle = cycle.slice();
  revCycle.reverse();


  let tests: { name: string, iterCount: int }[] = [];
  for (let j = minIterCount; j < maxIterCount; j++) {
    tests = tests.concat(directions.map(name => ({ name, iterCount: j })));
  }


  const func = (rd: Exact.ExactResult, done, index) => {

    const test = tests[index];
    let fullCycle: number[] = [];
    const dirIndex = index % 4;
    for (let i = 0; i < test.iterCount; i++) {
      const isOdd = i % 2 === 0;
      switch (dirIndex) {
        case 0: fullCycle = fullCycle.concat(cycle); break;
        case 1: fullCycle = fullCycle.concat(revCycle); break;
        case 2: fullCycle = fullCycle.concat(isOdd ? cycle : revCycle); break;
        case 3: fullCycle = fullCycle.concat(!isOdd ? cycle : revCycle); break;
      }
    }

    rd.actions.isIdPropActions(`t${index}`, 'left',
      Exact.simulatePixelAction(fullCycle));

    done();
  };

  const testParams: Exact.Tests = {};
  tests.forEach((test, index) => {
    testParams[`t${index} left uses direction ${test.name} ${test.iterCount} `
      + `cycles goes from ${min} to ${max}`] = func;
  });


  Exact.runTestSuite(__filename, {
    fps,
    css: tests.map((_test, index) =>
      `#t${index} {left: ${min}px}`).join('\n'),

    animes:
      tests.map((test, index) => {
        return {
          selector: `#t${index}`,
          duration: `${seconds}s`,
          props: [{
            prop: 'left',
            iterationCount: test.iterCount,
            direction: test.name,
            value: max,
          }],
        };
      }),
    html: Exact.genTestHtml(tests.length),
  },
    {
      tests: testParams,
    },
  );
}
