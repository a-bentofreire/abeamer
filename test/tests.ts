"use strict";
// uuid: 02e48400-60fd-42db-a955-09a1ff4cb386

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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
      .then((results) => {
        // Do what you want with data
        console.log(`The log report files are on ${logFolder}`);
      })
      .catch((err) => console.log(err));
  }
}
