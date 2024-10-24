"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const exact_js_1 = require("../exact.js");
const dev_consts_js_1 = require("../../shared/lib/dev-consts.js");
var Tests;
(function (Tests) {
    const directions = [
        dev_consts_js_1.DevConsts.Directions.normal,
        dev_consts_js_1.DevConsts.Directions.reverse,
        dev_consts_js_1.DevConsts.Directions.alternate,
        dev_consts_js_1.DevConsts.Directions['alternate-reverse'],
    ].map(v => dev_consts_js_1.DevConsts.Directions[v]);
    const min = 10;
    const max = 40;
    const minIterCount = 1;
    const maxIterCount = 6;
    const fps = 4;
    const seconds = 1;
    const cycle = exact_js_1.Exact.interpolateMinMax(min, max, seconds * fps);
    const revCycle = cycle.slice();
    revCycle.reverse();
    let tests = [];
    for (let j = minIterCount; j < maxIterCount; j++) {
        tests = tests.concat(directions.map(name => ({ name, iterCount: j })));
    }
    const func = (rd, done, index) => {
        const test = tests[index];
        let fullCycle = [];
        const dirIndex = index % 4;
        for (let i = 0; i < test.iterCount; i++) {
            const isOdd = i % 2 === 0;
            switch (dirIndex) {
                case 0:
                    fullCycle = fullCycle.concat(cycle);
                    break;
                case 1:
                    fullCycle = fullCycle.concat(revCycle);
                    break;
                case 2:
                    fullCycle = fullCycle.concat(isOdd ? cycle : revCycle);
                    break;
                case 3:
                    fullCycle = fullCycle.concat(!isOdd ? cycle : revCycle);
                    break;
            }
        }
        rd.actions.isIdPropActions(`t${index}`, 'left', exact_js_1.Exact.simulatePixelAction(fullCycle));
        done();
    };
    const testParams = {};
    tests.forEach((test, index) => {
        testParams[`t${index} left uses direction ${test.name} ${test.iterCount} `
            + `cycles goes from ${min} to ${max}`] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps,
        css: tests.map((_test, index) => `#t${index} {left: ${min}px}`).join('\n'),
        animes: tests.map((test, index) => {
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
        html: exact_js_1.Exact.genTestHtml(tests.length),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-direction.js.map