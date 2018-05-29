"use strict";
// uuid: 16fee46f-994d-4ddd-b7e2-333a3ff5c389

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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
