"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const chai_1 = require("chai");
const exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    const fps = 4;
    const seconds = 1;
    const totalD = fps * seconds;
    const animes = [[
            {
                selector: '#t0,#t1,#t2',
                duration: '1s',
                advance: true,
                props: [
                    {
                        prop: 'left',
                        value: 100,
                        duration: '=case(elIndex, 4, 3, 5)',
                        advance: true,
                    },
                    {
                        prop: 'top',
                        value: 100,
                        advance: true,
                    },
                    {
                        prop: 'opacity',
                        position: '+0.5s',
                        value: 0.8,
                    },
                ],
            }, {
                selector: '#t3,#t4',
                duration: '1s',
                advance: true,
                props: [
                    {
                        prop: 'left',
                        value: 100,
                    },
                ],
            },
            {
                selector: '#t5,#t6',
                position: '+0.5s',
                duration: '1s',
                advance: false,
                props: [
                    {
                        prop: 'left',
                        value: 100,
                    },
                ],
            },
        ]];
    const tests = [
        { elIndex: 0, prop: 'top', startFrame: 4, label: 'simple prop advance' },
        { elIndex: 1, prop: 'top', startFrame: 3, label: 'simple prop advance' },
        { elIndex: 2, prop: 'top', startFrame: 5, label: 'simple prop advance' },
        { elIndex: 0, prop: 'opacity', startFrame: 10, label: 'prop advance+position' },
        { elIndex: 1, prop: 'opacity', startFrame: 9, label: 'prop advance+position' },
        { elIndex: 2, prop: 'opacity', startFrame: 11, label: 'prop advance+position' },
        { elIndex: 3, prop: 'left', startFrame: 15, label: 'simple animation advance' },
        { elIndex: 4, prop: 'left', startFrame: 15, label: 'simple animation advance' },
        { elIndex: 5, prop: 'left', startFrame: 21, label: 'animation advance+position' },
        { elIndex: 6, prop: 'left', startFrame: 21, label: 'animation advance+position' },
    ];
    const func = (rd, done, index) => {
        const test = tests[index];
        rd.actions.isIdPropRanges(`t${test.elIndex}`, test.prop, [[test.startFrame, test.duration || totalD]]);
        done();
    };
    const testParams = {};
    tests.forEach((test) => {
        testParams[`${test.label} t${test.elIndex} ${test.prop}`
            + ` starting on frame from ${test.startFrame}`] = func;
    });
    testParams[`no-advance-in-the-end`] = (rd, done) => {
        chai_1.assert.isTrue(rd.outLines.indexOf('no-advance-in-end:') !== -1);
        done();
    };
    exact_js_1.Exact.runTestSuite(__filename, {
        fps,
        css: `#t0,#t1,#t3,#t4,#t5,#t6 {left: 5px; top: 5px; opacity: 0.2;}`,
        animes,
        html: exact_js_1.Exact.genTestHtml(7),
    }, {
        tests: testParams,
        parallelAnimes: [true],
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-advance.js.map