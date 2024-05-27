"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import { fsix } from "../shared/vendor/fsix.js";
import * as sysProcess from "process";


namespace Tests {

  const toRunInSerial = sysProcess.argv.join(' ').search(/--serial/) !== -1;

  interface TestListFile {
    disabled: string[];
    active: string[];
  }

  const tests: TestListFile =
    JSON.parse(fsix.readUtf8Sync(`${__dirname}/test-list.json`));
  console.log(tests);


  if (!toRunInSerial) {
    // At the moment, this is not used since
    tests.active.forEach(test => {
      require(`./tests/${test}.js`);
    });

  } else {
    const activeTestFiles = tests.active.map(test => `${__dirname}/tests/${test}.js`);

    const sm = require('happner-serial-mocha');
    const logFolder = `${__dirname}/log`;
    sm.runTasks(activeTestFiles, null, logFolder)
      .then((_results) => {
        // Do what you want with data
        console.log(`The log report files are on ${logFolder}`);
      })
      .catch((err) => console.log(err));
  }
}
