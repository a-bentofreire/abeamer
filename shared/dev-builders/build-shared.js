"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildShared = void 0;
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
 * Builds files from the client library to be used by server, tests and cli.
 *
 * This module is called by gulp, and it scans all the client library source files,
 * and for 'shared' modules it generates a node version of that file.
 *
 * Also, generates one single file with all the constants and enums to be used
 * by tests.
 *
 */
var BuildShared;
(function (BuildShared) {
    function build(libSourceFileTitles, srcPath, dstPath, generateMsg) {
        var WARN_MSG = "\n// This file was generated via ".concat(generateMsg, "\n// It shares the uuid\n//\n// @WARN: Don't edit this file.\n/** @see ");
        var sharedConsts = [];
        function parseSharedConsts(fileTitle, content) {
            var found = false;
            var lastIdPart = '';
            function addConst(line) {
                if (!found) {
                    sharedConsts.push("\n  // -------------\n  // ".concat(fileTitle, "\n  // -------------\n"));
                    found = true;
                }
                // adds extra line if a different constant group
                var _a = line.match(/^(\w+)\s+(\w+)/) || ['', '', ''], id = _a[2];
                var idParts = id.split('_');
                if (lastIdPart && lastIdPart !== idParts[0]) {
                    sharedConsts.push('');
                }
                lastIdPart = idParts[0];
                sharedConsts.push('  export ' + line);
            }
            // scans for consts and enums
            content.replace(/export\s+(const\s+[A-Z]\w+\s*=\s*[^;]+;|enum\s+\w+\s*{[^}]+})/g, function (all, p) {
                addConst(p.replace(/ as.*;/, ';'));
                return all;
            });
        }
        libSourceFileTitles.forEach(function (fileTitle) {
            var srcFileName = "".concat(srcPath, "/").concat(fileTitle, ".ts");
            var content = fsix_js_1.fsix.readUtf8Sync(srcFileName);
            parseSharedConsts(fileTitle, content);
            if (content.match(/@module shared/)) {
                var outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1)
                    .replace(/-(\w)/g, function (all, p1) { return p1.toUpperCase(); });
                content = content.replace(/namespace \w+/, "export namespace ".concat(outNameSpace));
                content = content.replace(/[^\n]+@module shared[^\n]+/, "\n".concat(WARN_MSG).concat(srcFileName, " */\n"));
                var dstFileName = "".concat(dstPath, "/").concat(fileTitle, ".ts");
                console.log("writing ".concat(dstFileName));
                sysFs.writeFileSync(dstFileName, content);
            }
        });
        // generates the dev consts file
        sysFs.writeFileSync("".concat(dstPath, "/dev-consts.ts"), "\"use strict\";\n// This file was generated ".concat(generateMsg, "\n// It has no uuid\n//\n// @WARN: Don't edit this file.\n\nexport namespace DevConsts {\n").concat(sharedConsts.join('\n'), "\n}\n"));
    }
    BuildShared.build = build;
})(BuildShared || (exports.BuildShared = BuildShared = {}));
//# sourceMappingURL=build-shared.js.map