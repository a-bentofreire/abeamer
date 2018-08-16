"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 574e70bb-6cab-43a7-82d8-1556d97b6d77
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var sysFs = require("fs");
var fsix_js_1 = require("../vendor/fsix.js");
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Concats all whole the lib modules javascript files into a single file
 *
 * This module is called by `gulp build-release`
 *
 */
var BuildSingleLibFile;
(function (BuildSingleLibFile) {
    function build(libModules, srcPath, dstPath, dstFile, generateMsg, excludeIdList, isDebug) {
        var WARN_MSG = "\n// This file was generated via " + generateMsg + "\n// It shares the uuid\n//\n// @WARN: Don't edit this file.\n";
        var outputList = [];
        libModules.forEach(function (fileTitle) {
            var srcFileName = srcPath + "/" + fileTitle + ".ts";
            outputList.push(fsix_js_1.fsix.readUtf8Sync(srcFileName));
        });
        var output = WARN_MSG + '\nnamespace ABeamer {'
            + outputList.join('\n')
                .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
                .replace(/namespace ABeamer\s*{/g, '')
                .replace(/export\s+(\w+)\s+_(\w+)/g, function (all, tokType, id) {
                return excludeIdList.indexOf(id) !== -1 ? tokType + " _" + id : all;
            });
        if (!isDebug) {
            output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g, function (all) { return ''; });
        }
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.writeFileSync(dstFile, output);
    }
    BuildSingleLibFile.build = build;
})(BuildSingleLibFile = exports.BuildSingleLibFile || (exports.BuildSingleLibFile = {}));
//# sourceMappingURL=build-single-lib-file.js.map