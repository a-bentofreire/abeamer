"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: cff5fa1a-6742-47d3-81ac-bfe45a97d764
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
    var ranges = [];
    var minAcc = min;
    var startFrameAcc = 0;
    var absStartFrameAcc = 0;
    tests.forEach(function (test) {
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
    var func = function (rd, done, index) {
        var test = tests[index];
        if (!test.isStill) {
            rd.actions.isIdPropActions('t0', 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(test.min, test.max, test.frameCount)), true, true, test.startFrame, test.frameCount);
        }
        else {
            rd.actions.isIdPropRanges('t0', 'left', ranges);
        }
        done();
    };
    var testParams = {};
    tests.forEach(function (test) {
        testParams[!test.isStill
            ? test.name + " - t0 moves for " + test.duration + " at " + (test.position || '')
            : test.name + " - t0 DOESN'T moves for " + test.duration] = func;
    });
    var animes = tests.map(function (test) {
        return !test.isStill ?
            {
                selector: "#t0",
                duration: test.duration,
                position: test.position,
                props: [{
                        prop: 'left',
                        value: test.max,
                    }],
            }
            : ['@@no-wrap-add-animation', "scene1.addStills(\"" + test.duration + "\");"];
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: "#t0 {left: " + min + "px}",
        animes: animes,
        html: exact_js_1.Exact.genTestHtml(1),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-stills.js.map