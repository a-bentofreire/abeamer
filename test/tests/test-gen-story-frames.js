"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var sysFs = require("fs");
var chai_1 = require("chai");
var exact_js_1 = require("../exact.js");
var fsix_js_1 = require("../../shared/vendor/fsix.js");
var sprintf_js_1 = require("../../shared/lib/sprintf.js");
var Tests;
(function (Tests) {
    var builder = new exact_js_1.Exact.TestBuilder();
    builder.fps = 4;
    builder.addTests([{
            min: 0,
            max: 10,
            elDuration: '3s',
        }]);
    var inMacros = builder.getInMacros();
    inMacros.css = '';
    builder.runTestParams = {
        'generates the story-frames': function (rd, done) {
            var total = builder.tests[0].frameCount;
            for (var i = 0; i < total; i++) {
                var file = sprintf_js_1.Sprintf.sprintf(rd.outFolder + "/story-frames/frame%05d.png", i);
                chai_1.assert.isTrue(sysFs.existsSync(file));
            }
            done();
        },
        'generates the report': function (rd, done) {
            var reportFile = rd.outFolder + "/story-frames/frame-report.json";
            chai_1.assert.isTrue(sysFs.existsSync(reportFile));
            var report = fsix_js_1.fsix.loadJsonSync(reportFile);
            chai_1.assert.equal(report.width, 100, "width must be 100");
            chai_1.assert.equal(report.height, 100, "height must be 100");
            done();
        },
    };
    exact_js_1.Exact.runTestSuite(__filename, inMacros, {
        toGenFrames: true,
        toDelPreviousFrames: true,
        tests: builder.runTestParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-gen-story-frames.js.map