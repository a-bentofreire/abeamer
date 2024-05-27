"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import { assert } from "chai";
import { Exact } from "../exact.js";
import { fsix } from "../../shared/vendor/fsix.js";
import { Sprintf } from "../../shared/lib/sprintf.js";

namespace Tests {

    const builder = new Exact.TestBuilder();
    builder.fps = 4;
    builder.addTests([{
        min: 0,
        max: 10,
        elDuration: '3s',
    }]);

    const inMacros = builder.getInMacros();
    inMacros.css = '';

    builder.runTestParams = {
        'generates the story-frames':
            (rd: Exact.ExactResult, done) => {

                const total = builder.tests[0].frameCount;
                for (let i = 0; i < total; i++) {
                    const file = Sprintf.sprintf(
                        `${rd.outFolder}/story-frames/frame%05d.png`, i);
                    assert.isTrue(sysFs.existsSync(file));
                }
                done();
            },

        'generates the report':
            (rd: Exact.ExactResult, done) => {

                const reportFile = `${rd.outFolder}/story-frames/frame-report.json`;
                assert.isTrue(sysFs.existsSync(reportFile));
                const report = fsix.loadJsonSync(reportFile);
                assert.equal(report.width, 100, `width must be 100`);
                assert.equal(report.height, 100, `height must be 100`);
                done();
            },
    };


    Exact.runTestSuite(__filename, inMacros,
        {
            toGenFrames: true,
            toDelPreviousFrames: true,
            tests: builder.runTestParams,
        },
    );
}
