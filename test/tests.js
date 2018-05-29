"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 02e48400-60fd-42db-a955-09a1ff4cb386
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var fsix_js_1 = require("../shared/vendor/fsix.js");
var Tests;
(function (Tests) {
    var tests = JSON.parse(fsix_js_1.fsix.readUtf8Sync(__dirname + "/test-list.json"));
    console.log(tests);
    tests.active.forEach(function (test) {
        require("./tests/" + test + ".js");
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=tests.js.map