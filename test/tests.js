"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const fsix_js_1 = require("../shared/vendor/fsix.js");
const sysProcess = require("process");
var Tests;
(function (Tests) {
    const toRunInSerial = sysProcess.argv.join(' ').search(/--serial/) !== -1;
    const tests = JSON.parse(fsix_js_1.fsix.readUtf8Sync(`${__dirname}/test-list.json`));
    console.log(tests);
    if (!toRunInSerial) {
        // At the moment, this is not used since
        tests.active.forEach(test => {
            require(`./tests/${test}.js`);
        });
    }
    else {
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
})(Tests || (Tests = {}));
//# sourceMappingURL=tests.js.map