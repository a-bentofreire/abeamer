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
    function build(libModules, srcPath, dstPath, dstFile, generateMsg) {
        var WARN_MSG = "\n// This file was generated via " + generateMsg + "\n// It shares the uuid\n//\n// @WARN: Don't edit this file.\n";
        var outputList = [];
        var extRefs = [];
        libModules.forEach(function (fileTitle) {
            var srcFileName = srcPath + "/" + fileTitle + ".js";
            var content = fsix_js_1.fsix.readUtf8Sync(srcFileName);
            outputList.push(content);
            // removes the namespace initial part including all the previous comments
            // @TODO: Make it work!!!
            // .replace(/(?:.|\n)*function\s*\(ABeamer.*\n/, '')
            // removes the end part
            // @TODO: Make it work!!!
            // .replace(/^\s*\}\)\(ABeamer.*$/m, '')
            // .replace(/^\s*var _abeamer;\n/m, '')
            // stores the list of external ids
            // it must be before transform all external references
            // @TODO: Make it work!!!
            // .replace(/^\s*ABeamer\.(\w+)\s*=\s*(\w+);\s*/mg,
            //   (all, extRef: string, intRef) => {
            //   if (extRef !== intRef) { return all; }
            //   if (/* extRef[0] !== '_' */true) { extRefs.push(extRef); }
            //   return '';
            // })
            // transforms all external references into internal references
            // @TODO: Make it work!!!
            // .replace(/\bABeamer\./g, ''),
        });
        var output = ''
            // 'var ABeamer;\n'
            // + '(function (ABeamer): void {\n'
            + outputList.join('\n') + '\n';
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.writeFileSync(dstFile, output);
    }
    BuildSingleLibFile.build = build;
})(BuildSingleLibFile = exports.BuildSingleLibFile || (exports.BuildSingleLibFile = {}));
//# sourceMappingURL=build-single-lib-file.js.map