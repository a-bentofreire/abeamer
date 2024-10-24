"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    const elSeconds = 2;
    const min = 10;
    const max = 120;
    const minFps = 4;
    const maxFps = 10;
    function getAnimationProps(test) {
        return [{
                prop: 'left',
                duration: test.duration,
                value: max,
            }];
    }
    function getTestAnimation(test, index) {
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
        ];
        const tests = [
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
                : exact_js_1.Exact.calcFrameCount(test.duration, fps, elSeconds);
        });
        const func = (rd, done, index) => {
            const test = tests[index];
            rd.actions.isIdPropActions(`t${index}`, 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, max, test.frameCount)));
            done();
        };
        const testParams = {};
        tests.forEach((test, index) => {
            testParams[`t${index} left goes in ${test.duration} in ${test.frameCount} frames `
                + `with ${fps}fps from ${min} to ${max}`] = func;
        });
        exact_js_1.Exact.runTestSuite(__filename.replace(/\.js/, `-${fps}fps.js`), {
            fps,
            css: tests.map((_test, index) => `#t${index} {position: absolute; left: ${min}px}`).join('\n'),
            animes: tests.map((test, index) => getTestAnimation(test, index)),
            html: exact_js_1.Exact.genTestHtml(tests.length),
        }, {
            jsMacros,
            tests: testParams,
        });
    }
})(Tests || (Tests = {}));
//# sourceMappingURL=test-duration.js.map