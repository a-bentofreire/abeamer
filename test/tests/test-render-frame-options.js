"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 7d689445-8980-4852-88ae-7b54b75960e4
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// @WARN: This test should be review if ABeamer is capable of linking
// the end of a property animation with the next and bypass the end frame of
// the first animation
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var min = 50;
    var fps = 4;
    var tests = [
        {
            sceneNr: 1, element: 0,
            duration: '2s', max: 100,
        },
        {
            sceneNr: 1, element: 0,
            duration: '2s', max: 200,
        },
        {
            sceneNr: 2, element: 3,
            duration: '1s', max: 150,
        },
        {
            sceneNr: 2, element: 3,
            duration: '2s', max: 300,
        }
    ].map(function (test) {
        test.frameCount = exact_js_1.Exact.calcFrameCount(test.duration, fps);
        return test;
    });
    var t0_inter = [].concat(exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, tests[0].max, tests[0].frameCount)), exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(tests[0].max, tests[1].max, tests[1].frameCount)));
    var t3_inter = [].concat(exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(min, tests[2].max, tests[2].frameCount)), exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(tests[2].max, tests[3].max, tests[3].frameCount)));
    function testBypass(rd, element, fromFrame, count, dir) {
        while (count > 0) {
            var s = "bypass:id=_[" + element + "]_ prop=_[left]_ frame=_[" + fromFrame + "]_";
            exact_js_1.Exact.AssertHasLine(rd, s);
            fromFrame += dir;
            count--;
        }
    }
    function testAction(rd, element, inter, fromFrame, count, dir) {
        while (count > 0) {
            var s = "action:id=_[" + element + "]_ prop=_[left]_ value=_[" + inter[fromFrame] + "]_";
            exact_js_1.Exact.AssertHasLine(rd, s);
            fromFrame += dir;
            count--;
        }
    }
    var renders = [
        {
            test: {
                name: 'Test bypass 1s, and then renders t0 for 2s',
            },
            runTest: function (rd, _render, opts) {
                var startFrame = exact_js_1.Exact.calcFrameCount(opts.renderPos, fps);
                var renderFrameCount = exact_js_1.Exact.calcFrameCount(opts.renderCount, fps);
                // read the warning on the top of the file
                testBypass(rd, 't0', 0, startFrame, 1);
                testAction(rd, 't0', t0_inter, startFrame, renderFrameCount, 1);
            },
            frameOptions: {
                renderPos: '1s',
                renderCount: '2s',
            },
        },
        {
            test: {
                name: 'Test render 2nd scene, skipping 2frames. moves t2',
            },
            runTest: function (rd, _render, opts) {
                var startFrame = exact_js_1.Exact.calcFrameCount(opts.renderPos, fps);
                var renderFrameCount = t3_inter.length - startFrame;
                testBypass(rd, 't3', 0, 3, 1);
                testBypass(rd, 't3', 4, startFrame - 4, 1);
                testAction(rd, 't3', t3_inter, startFrame, renderFrameCount, 1);
            },
            frameOptions: {
                renderPos: '1.5s',
                startScene: 1,
                endScene: 1,
            },
        },
        {
            test: {
                name: 'Test go back to scene 1, rewind 1s, and render 2s',
            },
            runTest: function (rd, _render, opts) {
                // tests rewind.
                testBypass(rd, 't0', 12, 4, -1);
                var startFrame = exact_js_1.Exact.calcFrameCount(opts.renderPos, fps);
                var renderFrameCount = exact_js_1.Exact.calcFrameCount(opts.renderCount, fps);
                testAction(rd, 't0', t0_inter, startFrame, renderFrameCount, 1);
            },
            frameOptions: {
                renderPos: '2s',
                renderCount: '2s',
            },
        },
    ];
    var func = function (rd, done, index) {
        var render = renders[index];
        render.runTest(rd, render, render.frameOptions);
        done();
    };
    var testParams = {};
    renders.forEach(function (render) {
        testParams[render.test.name] = func;
    });
    var animes = tests.map(function (test) {
        return ["@@scene:" + test.sceneNr, {
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
        renderFrameOptions: renders[0].frameOptions,
        extraRenderCalls: renders.slice(1).map(function (render) { return render.frameOptions; }),
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-render-frame-options.js.map