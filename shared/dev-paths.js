"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 4fa2cbfb-aecc-4b28-be0e-7d107b8ba1a7
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var fsix_js_1 = require("./vendor/fsix.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * This module contains posix file paths for building and testing.
 *
 */
var DevPaths;
(function (DevPaths) {
    DevPaths.CLIENT_PATH = 'client';
    DevPaths.LIB_PATH = DevPaths.CLIENT_PATH + "/lib";
    DevPaths.JS_PATH = DevPaths.LIB_PATH + "/js";
    DevPaths.PLUGINS_PATH = DevPaths.LIB_PATH + "/plugins";
    DevPaths.TYPINGS_PATH = DevPaths.LIB_PATH + "/typings";
    DevPaths.SHARED_PATH = 'shared';
    DevPaths.SHARED_LIB_PATH = DevPaths.SHARED_PATH + "/lib";
    DevPaths.GALLERY_PATH = 'gallery';
    DevPaths.DOCS_PATH = 'docs';
    DevPaths.END_USER_DOCS_PATH = DevPaths.DOCS_PATH + "/build/end-user";
    DevPaths.DEV_DOCS_PATH = DevPaths.DOCS_PATH + "/build/developer";
    DevPaths.SOURCE_DOCS_PATH = DevPaths.DOCS_PATH + "/sources";
    DevPaths.SOURCE_DEV_DOCS_PATH = DevPaths.DOCS_PATH + "/sources-dev";
    DevPaths.MODULES_LIST_FILE = "" + fsix_js_1.fsix.toPosixSlash(__dirname)
        + ("/../" + DevPaths.LIB_PATH + "/modules-list.json");
})(DevPaths = exports.DevPaths || (exports.DevPaths = {}));
//# sourceMappingURL=dev-paths.js.map