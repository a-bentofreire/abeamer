"use strict";
// uuid: edfbcfb5-a4a1-443c-905a-3cf73352fa0e

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------



import { Exact } from "../exact.js";

namespace Tests {

  const fps = 10;
  const seconds = 4;

  const cycle = Exact.interpolateMinMax(0, 1, seconds * fps);

  const colors = [
    '#9400D3',
    '#4B0082',
    '#0000FF',
    '#00FF00',
    '#FFFF00',
    '#FF7F00',
    '#FF0000',
    // @HINT: Required due the fact chrome returns rgb values instead of #hhhhhh
  ].map(color => Exact.hexToRgb(color));

  const namedColors = ['red', 'green', 'blue', 'yellow', 'black'];

  const func1Name = '__Func_colorList';
  const jsMacros = [
    [`"${func1Name}"`,
    `function (t) {
        var c = ${JSON.stringify(namedColors)};
      return c[Math.min(Math.round(c.length * t), c.length - 1)];
    }`,
    ],
  ] as [string, string][];

  const transfMin = 2.2;
  const transfMax = 34.2;
  const transfMacroName = '_VALUE_';
  const transformStr = `rotateY(30deg) rotateX(${transfMacroName}deg)`;

  const transfCycle = Exact.interpolateMinMax(transfMin, transfMax, seconds * fps).
    map(t => transformStr.replace(transfMacroName, Exact.roundTestDigit(t).toString()));
  // console.log(transfCycle);

  const tests: {
    name: string,
    prop: string,
    css?: string,
    value?: number,
    valueStart?: number | string,
    valueText?: string[] | string,
    valueFormat?: string,
    expected: string[],
  }[] = [
      {
        name: 'valueList:string',
        prop: 'color',
        css: `color: ${colors[0]}`,
        valueText: colors,
        expected: Exact.interpolateList(colors, cycle),
      },
      {
        name: 'valueList:function',
        prop: 'color',
        css: `color: ${colors[0]}`,
        valueText: func1Name,
        expected: Exact.interpolateList(namedColors, cycle),
      },
      {
        name: 'valueFormat',
        prop: 'transform',
        css: `
          transform-origin: bottom;
          perspective: 20px;
          position: absolute;
        `,
        value: transfMax,
        valueFormat: transformStr.replace(transfMacroName, '%f'),
        expected: transfCycle,
      },
    ];

  const func = (rd: Exact.ExactResult, done, index) => {

    const test = tests[index];
    rd.actions.isIdPropActions(`t${index}`, test.prop, test.expected);

    done();
  };

  const testParams = {};
  tests.forEach((test, index) => {
    testParams[`t${index} ${test.prop} uses ${test.name}`] = func;
  });


  Exact.runTestSuite(__filename, {
    fps,
    css: tests.map((test, index) =>
      `#t${index} {${test.css}}`).join('\n'),

    animes:
      tests.map((test, index) => {
        return {
          selector: `#t${index}`,
          duration: `${seconds}s`,
          props: [{
            prop: test.prop,
            value: test.value,
            valueStart: test.valueStart,
            valueText: test.valueText,
            valueFormat: test.valueFormat,
          }],
        };
      }),
    html: Exact.genTestHtml(tests.length),
  },
    {
      jsMacros,
      tests: testParams, /* ,
      toLogStdOut: true,
      toLogActions: true */
    },
  );
}
