"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 76702574-6fb7-4578-89f0-a1db09747996
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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