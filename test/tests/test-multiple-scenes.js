"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 243e2595-e191-4656-af45-79f43e4b709e
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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
        rd.actions.isIdPropActions("t" + test.element, 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, test.max, test.frameCount)));
        // @TODO: test if went to a different scene
        done();
    };
    var testParams = {};
    tests.forEach(function (test) {
        testParams["$t" + test.element + " on scene" + test.scene + " moves for " + test.duration] = func;
    });
    var animes = tests.map(function (test) {
        return ["@@scene:" + test.scene, {
                selector: "#t" + test.element,
                duration: test.duration,
                props: [{
                        prop: 'left',
                        value: test.max,
                    }],
            }];
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: ".abslf {left: " + min + "px}",
        animes: animes,
        html: exact_js_1.Exact.genTestHtml(7, { sceneMarkers: [2, 4, 6] }),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-multiple-scenes.js.map