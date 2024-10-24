"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    const min = 50;
    const fps = 4;
    const divider = 1000 / fps;
    const tests = [
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
        }
    ];
    const ranges = [];
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
    const func = (rd, done, index) => {
        const test = tests[index];
        if (!test.isStill) {
            rd.actions.isIdPropActions('t0', 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(test.min, test.max, test.frameCount)), true, true, test.startFrame, test.frameCount);
        }
        else {
            rd.actions.isIdPropRanges('t0', 'left', ranges);
        }
        done();
    };
    const testParams = {};
    tests.forEach((test) => {
        testParams[!test.isStill
            ? `${test.name} - t0 moves for ${test.duration} at ${test.position || ''}`
            : `${test.name} - t0 DOESN'T moves for ${test.duration}`] = func;
    });
    const animes = tests.map((test) => {
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
            : ['@@no-wrap-add-animation', `scene1.addStills("${test.duration}");`];
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps,
        css: `#t0 {left: ${min}px}`,
        animes,
        html: exact_js_1.Exact.genTestHtml(1),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-stills.js.map