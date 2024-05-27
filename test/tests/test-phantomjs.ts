"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// @TODO: Determine why the test execution never ends, failing this test
// @TODO: Determine how to pass options '--' to phantomjs

import { Exact } from "../exact.js";

namespace Tests {

    const min = 20;
    const max = 40;

    const tests = [
        {},
    ];

    const func = (rd: Exact.ExactResult, done) => {

        rd.actions.isIdPropActions('t0', 'left',
            Exact.simulatePixelAction(
                Exact.interpolateMinMax(min, max, rd.fps)));

        done();
    };

    const testParams: Exact.Tests = {};
    tests.forEach((_test, index) => {
        testParams[`t${index} left goes from ${min} to ${max}`] = func;
    });


    Exact.runTestSuite(__filename, {
        fps: 4,
        css: tests.map((_test, index) =>
            `#t${index} {position: absolute; left: ${min}px}`).join('\n'),
        animes:
            tests.map((_test, index) => {
                return {
                    selector: `#t${index}`,
                    duration: '1s',
                    props: [{
                        prop: 'left',
                        value: max,
                    }],
                };
            }),
        html: Exact.genTestHtml(tests.length),
    },
        {
            toGenFrames: true,
            server: 'phantomjs',
            tests: testParams,
        },
    );
}
