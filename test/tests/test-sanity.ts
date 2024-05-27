"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";

namespace Tests {

    const builder = new Exact.TestBuilder();
    builder.addTests([{}]);

    Exact.runTestSuite(__filename, builder.getInMacros(),
        {
            toGenFrames: true,
            tests: builder.runTestParams,
        },
    );
}
