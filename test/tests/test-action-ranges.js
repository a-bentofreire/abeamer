"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 76702574-6fb7-4578-89f0-a1db09747996
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var dev_consts_js_1 = require("../../shared/lib/dev-consts.js");
var Tests;
(function (Tests) {
    var fps = 4;
    var seconds = 2;
    var absMin = 50;
    var elProps = [
        { elIndex: 0, prop: 'left', relMin: absMin, startFrame: 0, propType: dev_consts_js_1.DevConsts.PT_PIXEL },
        { elIndex: 0, prop: 'top', relMin: absMin, startFrame: 0, propType: dev_consts_js_1.DevConsts.PT_PIXEL },
        { elIndex: 1, prop: 'left', relMin: absMin, startFrame: 0, propType: dev_consts_js_1.DevConsts.PT_PIXEL },
        { elIndex: 1, prop: 'opacity', relMin: 1, startFrame: 0, propType: dev_consts_js_1.DevConsts.PT_NUMBER },
    ];
    var tests = [
        { elProp: 0, max: 100 },
        { elProp: 0, max: 200, label: 'links to previous' },
        { elProp: 1, max: 100, label: 'disrupts with a different prop' },
        { elProp: 0, max: 250, label: 'resumes first prop' },
        { elProp: 2, max: 150, label: 'disrupts with a different element' },
        { elProp: 0, max: 400, label: 'resumes first prop' },
        { elProp: 0, max: 10, label: 'reverses movement' },
        { elProp: 1, max: 150, label: 'resumes 2nd prop' },
        { elProp: 3, max: 0.5, label: 'tests num value' },
    ].map(function (test) {
        var elProp = elProps[test.elProp];
        var v = {
            elIndex: elProp.elIndex,
            propName: elProp.prop,
            propType: elProp.propType,
            name: test.toString(),
            min: elProp.relMin,
            max: test.max,
            label: test.label ? "(" + test.label + ") - " : '',
            startFrame: elProp.startFrame,
            frameCount: fps * seconds,
        };
        elProp.startFrame += v.frameCount;
        elProp.relMin = test.max;
        return v;
    });
    var func = function (rd, done, index) {
        var test = tests[index];
        var expected = exact_js_1.Exact.interpolateMinMax(test.min, test.max, 2 * rd.fps);
        var expectedPA = exact_js_1.Exact.simulateAction(expected, test.propType);
        rd.actions.isIdPropActions("t" + test.elIndex, test.propName, expectedPA, true, true, test.startFrame, test.frameCount);
        done();
    };
    var testParams = {};
    tests.forEach(function (test, index) {
        testParams[test.label + "t" + test.elIndex + " " + test.propName
            + (" goes from " + test.min + " to " + test.max)] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: "#t0,#t1 {left: " + absMin + "px; top: " + absMin + "px;}",
        animes: tests.map(function (test, index) {
            return {
                selector: "#t" + test.elIndex,
                duration: seconds + "s",
                props: [{
                        prop: test.propName,
                        value: test.max,
                    }],
            };
        }),
        html: exact_js_1.Exact.genTestHtml(2),
    }, {
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-action-ranges.js.map