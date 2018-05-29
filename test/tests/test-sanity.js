"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 16fee46f-994d-4ddd-b7e2-333a3ff5c389
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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