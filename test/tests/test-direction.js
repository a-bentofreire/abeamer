"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var dev_consts_js_1 = require("../../shared/lib/dev-consts.js");
var Tests;
(function (Tests) {
    var directions = [
        dev_consts_js_1.DevConsts.Directions.normal,
        dev_consts_js_1.DevConsts.Directions.reverse,
        dev_consts_js_1.DevConsts.Directions.alternate,
        dev_consts_js_1.DevConsts.Directions['alternate-reverse'],
    ].map(function (v) { return dev_consts_js_1.DevConsts.Directions[v]; });
    var min = 10;
    var max = 40;
    var minIterCount = 1;
    var maxIterCount = 6;
    var fps = 4;
    var seconds = 1;
    var cycle = exact_js_1.Exact.interpolateMinMax(min, max, seconds * fps);
    var revCycle = cycle.slice();
    revCycle.reverse();
    var tests = [];
    var _loop_1 = function (j) {
        tests = tests.concat(directions.map(function (name) { return ({ name: name, iterCount: j }); }));
    };
    for (var j = minIterCount; j < maxIterCount; j++) {
        _loop_1(j);
    }
    var func = function (rd, done, index) {
        var test = tests[index];
        var fullCycle = [];
        var dirIndex = index % 4;
        for (var i = 0; i < test.iterCount; i++) {
            var isOdd = i % 2 === 0;
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
        rd.actions.isIdPropActions("t" + index, 'left', exact_js_1.Exact.simulatePixelAction(fullCycle));
        done();
    };
    var testParams = {};
    tests.forEach(function (test, index) {
        testParams["t" + index + " left uses direction " + test.name + " " + test.iterCount + " "
            + ("cycles goes from " + min + " to " + max)] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: tests.map(function (_test, index) {
            return "#t" + index + " {left: " + min + "px}";
        }).join('\n'),
        animes: tests.map(function (test, index) {
            return {
                selector: "#t" + index,
                duration: seconds + "s",
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