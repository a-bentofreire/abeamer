"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var tests = [
        { prop: 'left', min: 20, max: 100 },
        { prop: 'top', min: 40, max: 150 },
        { prop: 'right', min: 15, max: 120 },
        { prop: 'bottom', min: 13, max: 140 },
    ];
    var builder = new exact_js_1.Exact.TestBuilder();
    builder.cssClassesForHtml = { cssClass: '' };
    builder.addTests(tests);
    exact_js_1.Exact.runTestSuite(__filename, builder.getInMacros(), {
        tests: builder.runTestParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-move-pixels.js.map