"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fsix_exports = {};
__export(fsix_exports, {
  fsix: () => fsix
});
module.exports = __toCommonJS(fsix_exports);
var sysFs = __toESM(require("fs"));
var sysPath = __toESM(require("path"));
var import_child_process = require("child_process");
var fsix;
((fsix2) => {
  fsix2.loadJsonSync = (fileName) => JSON.parse((0, fsix2.readUtf8Sync)(fileName));
  fsix2.writeJsonSync = (fileName, data) => {
    sysFs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  };
  fsix2.toPosixSlash = (path) => path.replace(/\\/g, "/");
  fsix2.readUtf8Sync = (fileName, encoding) => sysFs.readFileSync(fileName, { encoding: encoding || "utf-8" });
  function mkdirpSync(path) {
    while (path && !sysFs.existsSync(path)) {
      mkdirpSync(sysPath.dirname(path));
      sysFs.mkdirSync(path);
    }
  }
  fsix2.mkdirpSync = mkdirpSync;
  function runExternal(cmd, callback) {
    (0, import_child_process.exec)(cmd, (error, stdout, stderr) => {
      if (callback) {
        callback(error, stdout, stderr);
      }
    });
  }
  fsix2.runExternal = runExternal;
})(fsix || (fsix = {}));
//# sourceMappingURL=fsix.js.map
