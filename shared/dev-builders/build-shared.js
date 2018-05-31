"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 53d3fa61-626c-465a-a903-99878ed240d8
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
        var WARN_MSG = "\n// This file was generated via " + generateMsg + "\n// It shares the uuid\n//\n// @WARN: Don't edit this file.\n/** @see ";
        var sharedConsts = [];
        function parseSharedConsts(fileTitle, content) {
            var found = false;
            var lastIdPart = '';
            function addConst(line) {
                if (!found) {
                    sharedConsts.push("\n  // -------------\n  // " + fileTitle + "\n  // -------------\n");
                    found = true;
                }
                // adds extra line if a different constant group
                var _a = line.match(/^(\w+)\s+(\w+)/) || ['', '', ''], all = _a[0], keyword = _a[1], id = _a[2];
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
            var srcFileName = srcPath + "/" + fileTitle + ".ts";
            var content = fsix_js_1.fsix.readUtf8Sync(srcFileName);
            parseSharedConsts(fileTitle, content);
            if (content.match(/@module shared/)) {
                var outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1)
                    .replace(/-(\w)/g, function (all, p1) { return p1.toUpperCase(); });
                content = content.replace(/namespace \w+/, "export namespace " + outNameSpace);
                content = content.replace(/[^\n]+@module shared[^\n]+/, "\n" + WARN_MSG + srcFileName + " */\n");
                var dstFileName = dstPath + "/" + fileTitle + ".ts";
                console.log("writing " + dstFileName);
                sysFs.writeFileSync(dstFileName, content);
            }
        });
        // generates the dev consts file
        sysFs.writeFileSync(dstPath + "/dev-consts.ts", "\"use strict\";\n// This file was generated " + generateMsg + "\n// It has no uuid\n//\n// @WARN: Don't edit this file.\n\nexport namespace DevConsts {\n" + sharedConsts.join('\n') + "\n}\n");
    }
    BuildShared.build = build;
})(BuildShared = exports.BuildShared || (exports.BuildShared = {}));
//# sourceMappingURL=build-shared.js.map