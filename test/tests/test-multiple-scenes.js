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
            scene: 1, element: 0,
            duration: '2s', max: 100,
            frameCount: 2000 / divider,
        },
        {
            scene: 2, element: 2,
            duration: '3s', max: 150,
            frameCount: 3000 / divider,
        }
    ];
    const func = (rd, done, index) => {
        const test = tests[index];
        rd.actions.isIdPropActions(`t${test.element}`, 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, test.max, test.frameCount)));
        // @TODO: test if went to a different scene
        done();
    };
    const testParams = {};
    tests.forEach((test) => {
        testParams[`$t${test.element} on scene${test.scene} moves for ${test.duration}`] = func;
    });
    const animes = tests.map((test) => {
        return [`@@scene:${test.scene}`, {
                selector: `#t${test.element}`,
                duration: test.duration,
                props: [{
                        prop: 'left',
                        value: test.max,
                    }],
            }];
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps,
        css: `.abslf {left: ${min}px}`,
        animes,
        html: exact_js_1.Exact.genTestHtml(7, { sceneMarkers: [2, 4, 6] }),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-multiple-scenes.js.map