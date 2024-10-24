"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    const fps = 10;
    const seconds = 4;
    const cycle = exact_js_1.Exact.interpolateMinMax(0, 1, seconds * fps);
    const colors = [
        '#9400D3',
        '#4B0082',
        '#0000FF',
        '#00FF00',
        '#FFFF00',
        '#FF7F00',
        '#FF0000',
        // @HINT: Required due the fact chrome returns rgb values instead of #hhhhhh
    ].map(color => exact_js_1.Exact.hexToRgb(color));
    const namedColors = ['red', 'green', 'blue', 'yellow', 'black'];
    const func1Name = '__Func_colorList';
    const jsMacros = [
        [`"${func1Name}"`,
            `function (t) {
        var c = ${JSON.stringify(namedColors)};
      return c[Math.floor(c.length * Math.min(Math.max(0, t), 0.999))];
    }`,
        ],
    ];
    const transfMin = 2.2;
    const transfMax = 34.2;
    const transfMacroName = '_VALUE_';
    const transformStr = `rotateY(30deg) rotateX(${transfMacroName}deg)`;
    const transfCycle = exact_js_1.Exact.interpolateMinMax(transfMin, transfMax, seconds * fps).
        map(t => transformStr.replace(transfMacroName, exact_js_1.Exact.roundTestDigit(t).toString()));
    // console.log(transfCycle);
    const tests = [
        {
            name: 'valueText:string',
            prop: 'color',
            css: `color: ${colors[0]}`,
            valueText: colors,
            expected: exact_js_1.Exact.interpolateList(colors, cycle),
        },
        {
            name: 'valueText:function',
            prop: 'color',
            css: `color: ${colors[0]}`,
            valueText: func1Name,
            expected: exact_js_1.Exact.interpolateList(namedColors, cycle),
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
            valueStart: transfMin,
            valueFormat: transformStr.replace(transfMacroName, '%f'),
            expected: transfCycle,
        },
    ];
    const func = (rd, done, index) => {
        const test = tests[index];
        rd.actions.isIdPropActions(`t${index}`, test.prop, test.expected);
        done();
    };
    const testParams = {};
    tests.forEach((test, index) => {
        testParams[`t${index} ${test.prop} uses ${test.name}`] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps,
        css: tests.map((test, index) => `#t${index} {${test.css}}`).join('\n'),
        animes: tests.map((test, index) => {
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
        html: exact_js_1.Exact.genTestHtml(tests.length),
    }, {
        jsMacros,
        tests: testParams, /* ,
        toLogStdOut: true,
        toLogActions: true */
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-props.js.map