"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";

namespace Tests {

    const tests = [
        { prop: 'left', min: 20, max: 100 },
        { prop: 'top', min: 40, max: 150 },
        { prop: 'right', min: 15, max: 120 },
        { prop: 'bottom', min: 13, max: 140 },
    ];

    const builder = new Exact.TestBuilder();
    builder.cssClassesForHtml = { cssClass: '' };
    builder.addTests(tests);

    Exact.runTestSuite(__filename, builder.getInMacros(),
        {
            tests: builder.runTestParams,
        },
    );
}
