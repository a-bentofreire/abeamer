"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var jquery_easing_node_js_1 = require("./vendor/jquery.easing.node.js");
var Tests;
(function (Tests) {
    var builder = new exact_js_1.Exact.TestBuilder();
    builder.min = 50;
    builder.max = 200;
    builder.elDuration = '2s';
    builder.addTests(Object.keys(jquery_easing_node_js_1.Easings.EasingFunctions).map(function (easingName) { return ({
        preLabel: "easing " + easingName + ": ",
        easingName: easingName,
        easingFunc: function (t) { return (jquery_easing_node_js_1.Easings.EasingFunctions[easingName])(0, t, 0, 1, 1); },
    }); }));
    exact_js_1.Exact.runTestSuite(__filename, builder.getInMacros(), {
        tests: builder.runTestParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-easings.js.map