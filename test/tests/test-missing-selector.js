"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var ERR_EMPTY_SEL = 'Selector #t1 is empty';
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: 8,
        css: "#t0 {left:20px}",
        animes: [{
                selector: '#t1',
                props: [{
                        prop: 'left',
                        duration: '1s',
                        value: 40,
                    }],
            },
            {
                selector: '#t0',
                props: [{
                        prop: 'left',
                        duration: '1s',
                        value: 140,
                    }],
            }],
        html: exact_js_1.Exact.genTestHtml(1),
    }, {
        expectedErrors: [ERR_EMPTY_SEL],
        tests: {
            'missing t1 is bypass gracefully': function (rd, done) {
                // @TODO: convert to proper tagging
                exact_js_1.Exact.AssertHasLine(rd, ERR_EMPTY_SEL, true);
                done();
            },
            't0 moves as normal': function (rd, done) {
                rd.actions.isIdPropActions('t0', 'left', exact_js_1.Exact.simulatePixelAction(exact_js_1.Exact.interpolateMinMax(20, 140, rd.fps)));
                done();
            },
        },
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-missing-selector.js.map