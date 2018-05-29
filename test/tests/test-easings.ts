"use strict";
// uuid: 76702574-6fb7-4578-89f0-a1db09747996

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";
import { Easings } from "./vendor/jquery.easing.node.js";

namespace Tests {

  const builder = new Exact.TestBuilder();
  builder.min = 50;
  builder.max = 200;
  builder.elDuration = '2s';
  builder.addTests(Object.keys(Easings.EasingFunctions).map(easingName => (
    {
      preLabel: `easing ${easingName}: `,
      easingName,
      easingFunc: (t) => (Easings.EasingFunctions[easingName])(0, t, 0, 1, 1),
    })));

  Exact.runTestSuite(__filename, builder.getInMacros(),
    {
      tests: builder.runTestParams,
    },
  );
}
