"use strict";
// uuid: 02e48400-60fd-42db-a955-09a1ff4cb386

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { fsix } from "../shared/vendor/fsix.js";

namespace Tests {

  interface TestListFile {
    disabled: string[];
    active: string[];
  }

  const tests: TestListFile =
    JSON.parse(fsix.readUtf8Sync(`${__dirname}/test-list.json`));
  console.log(tests);

  tests.active.forEach(test => {
    require(`./tests/${test}.js`);
  });
}
