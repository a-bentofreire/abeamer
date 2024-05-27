"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// @TODO: Determine why the test execution never ends, failing this test
// @TODO: Determine how to pass options '--' to phantomjs
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var min = 20;
    var max = 40;
    var tests = [
        {},
    ];
    var func = function (rd, done) {
        rd.actions.isIdPropActions('t0', 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, max, rd.fps)));
        done();
    };
    var testParams = {};
    tests.forEach(function (_test, index) {
        testParams["t" + index + " left goes from " + min + " to " + max] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: 4,
        css: tests.map(function (_test, index) {
            return "#t" + index + " {position: absolute; left: " + min + "px}";
        }).join('\n'),
        animes: tests.map(function (_test, index) {
            return {
                selector: "#t" + index,
                duration: '1s',
                props: [{
                        prop: 'left',
                        value: max,
                    }],
            };
        }),
        html: exact_js_1.Exact.genTestHtml(tests.length),
    }, {
        toGenFrames: true,
        server: 'phantomjs',
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-phantomjs.js.map