"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var builder = new exact_js_1.Exact.TestBuilder();
    builder.addTests([{}]);
    exact_js_1.Exact.runTestSuite(__filename, builder.getInMacros(), {
        toGenFrames: true,
        tests: builder.runTestParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-sanity.js.map