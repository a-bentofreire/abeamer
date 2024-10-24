"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsix = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Common filesystem functions implemented by nodejs
// Use IRel.Fs to have an abstract filesystem
const sysFs = require("fs");
const sysPath = require("path");
const child_process_1 = require("child_process");
var fsix;
(function (fsix) {
    fsix.loadJsonSync = (fileName) => JSON.parse(fsix.readUtf8Sync(fileName));
    fsix.writeJsonSync = (fileName, data) => {
        sysFs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    };
    /**
     * Converts any path to unix style path
     * Backslashes in unix paths aren't supported
     *
     * @param path unix or windows style path
     */
    fsix.toPosixSlash = (path) => path.replace(/\\/g, '/');
    fsix.readUtf8Sync = (fileName, encoding) => sysFs.readFileSync(fileName, { encoding: encoding || 'utf-8' });
    /**
     * Creates a directory if doesn't exists, including parent folders
     *
     * @param path unix-style path
     */
    function mkdirpSync(path) {
        while (path && !sysFs.existsSync(path)) {
            mkdirpSync(sysPath.dirname(path));
            sysFs.mkdirSync(path);
        }
    }
    fsix.mkdirpSync = mkdirpSync;
    function runExternal(cmd, callback) {
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (callback) {
                callback(error, stdout, stderr);
            }
        });
    }
    fsix.runExternal = runExternal;
})(fsix || (exports.fsix = fsix = {}));
//# sourceMappingURL=fsix.js.map