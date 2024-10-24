"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSingleLibFile = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const sysFs = require("fs");
const fsix_js_1 = require("../vendor/fsix.js");
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
        const WARN_MSG = `
// This file was generated via ${generateMsg}
//
// @WARN: Don't edit this file.
`;
        const outputList = [];
        libModules.forEach(fileTitle => {
            const srcFileName = `${srcPath}/${fileTitle}.ts`;
            outputList.push(fsix_js_1.fsix.readUtf8Sync(srcFileName));
        });
        let output = WARN_MSG + '\nnamespace ABeamer {'
            + outputList.join('\n')
                .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
                .replace(/namespace ABeamer\s*{/g, '')
                .replace(/export\s+(\w+)\s+_(\w+)/g, (all, tokType, id) => excludeIdList.indexOf(id) === -1 ? `${tokType} _${id}` : all);
        if (!isDebug) {
            output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g, () => '');
        }
        fsix_js_1.fsix.mkdirpSync(dstPath);
        sysFs.writeFileSync(dstFile, output);
    }
    BuildSingleLibFile.build = build;
})(BuildSingleLibFile || (exports.BuildSingleLibFile = BuildSingleLibFile = {}));
//# sourceMappingURL=build-single-lib-file.js.map