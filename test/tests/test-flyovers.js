"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var min = 50;
    var fps = 4;
    var divider = 1000 / fps;
    var tests = [
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
    var func = function (rd, done, index) {
        var test = tests[index];
        rd.actions.isIdPropActions("t".concat(test.element), 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, test.max, test.frameCount)));
        // @TODO: test if went to a different scene
        done();
    };
    var testParams = {};
    tests.forEach(function (test) {
        testParams["$t".concat(test.element, " on scene").concat(test.scene, " moves for ").concat(test.duration)] = func;
    });
    var animes = tests.map(function (test) {
        return ["@@scene:".concat(test.scene), {
                selector: "#t".concat(test.element),
                duration: test.duration,
                props: [{
                        prop: 'left',
                        value: test.max,
                    }],
            }];
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: ".abslf {left: ".concat(min, "px}"),
        animes: animes,
        html: exact_js_1.Exact.genTestHtml(7, { sceneMarkers: [2, 4, 6] }),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-flyovers.js.map