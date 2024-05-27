"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var elSeconds = 2;
    var min = 10;
    var max = 120;
    var minFps = 4;
    var maxFps = 10;
    function getAnimationProps(test) {
        return [{
                prop: 'left',
                duration: test.duration,
                value: max,
            }];
    }
    function getTestAnimation(test, index) {
        return {
            selector: "#t" + index,
            duration: elSeconds + 's',
            props: getAnimationProps(test),
        };
    }
    var _loop_1 = function (fps) {
        var divider = 1000 / fps;
        var jsMacros = [
            ['"__Func_6s"', 'function () {return "6s"}'],
            ['"__Func_12f"', 'function () {return 12}'],
        ];
        var tests = [
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
        tests.forEach(function (test) {
            test.frameCount = test.frameCount ?
                Math.round(test.frameCount - 0.0001)
                : exact_js_1.Exact.calcFrameCount(test.duration, fps, elSeconds);
        });
        var func = function (rd, done, index) {
            var test = tests[index];
            rd.actions.isIdPropActions("t" + index, 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, max, test.frameCount)));
            done();
        };
        var testParams = {};
        tests.forEach(function (test, index) {
            testParams["t" + index + " left goes in " + test.duration + " in " + test.frameCount + " frames "
                + ("with " + fps + "fps from " + min + " to " + max)] = func;
        });
        exact_js_1.Exact.runTestSuite(__filename.replace(/\.js/, "-" + fps + "fps.js"), {
            fps: fps,
            css: tests.map(function (_test, index) {
                return "#t" + index + " {position: absolute; left: " + min + "px}";
            }).join('\n'),
            animes: tests.map(function (test, index) { return getTestAnimation(test, index); }),
            html: exact_js_1.Exact.genTestHtml(tests.length),
        }, {
            jsMacros: jsMacros,
            tests: testParams,
        });
    };
    for (var fps = minFps; fps <= maxFps; fps++) {
        _loop_1(fps);
    }
})(Tests || (Tests = {}));
//# sourceMappingURL=test-duration.js.map