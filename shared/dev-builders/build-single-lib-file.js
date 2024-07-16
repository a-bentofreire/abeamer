"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSingleLibFile = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var sysFs = require("fs");
var fsix_js_1 = require("../vendor/fsix.js");
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Concats all whole the lib modules javascript files into a single file
 *
 * This module is called by `gulp build-release-latest`
 *
 */
var BuildSingleLibFile;
(function (BuildSingleLibFile) {
    function build(libModules, srcPath, dstPath, dstFile, generateMsg, excludeIdList, isDebug) {
        var WARN_MSG = "\n// This file was generated via ".concat(generateMsg, "\n// It shares the uuid\n//\n// @WARN: Don't edit this file.\n");
        var outputList = [];
        libModules.forEach(function (fileTitle) {
            var srcFileName = "".concat(srcPath, "/").concat(fileTitle, ".ts");
            outputList.push(fsix_js_1.fsix.readUtf8Sync(srcFileName));
        });
        var output = WARN_MSG + '\nnamespace ABeamer {'
            + outputList.join('\n')
                .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
                .replace(/namespace ABeamer\s*{/g, '')
                .replace(/export\s+(\w+)\s+_(\w+)/g, function (all, tokType, id) {
                return excludeIdList.indexOf(id) === -1 ? "".concat(tokType, " _").concat(id) : all;
            });
        if (!isDebug) {
            output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g, function () { return ''; });
        }
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.writeFileSync(dstFile, output);
    }
    BuildSingleLibFile.build = build;
})(BuildSingleLibFile || (exports.BuildSingleLibFile = BuildSingleLibFile = {}));
//# sourceMappingURL=build-single-lib-file.js.map