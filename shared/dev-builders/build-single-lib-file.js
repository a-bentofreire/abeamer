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
var build_single_lib_file_exports = {};
__export(build_single_lib_file_exports, {
  BuildSingleLibFile: () => BuildSingleLibFile
});
module.exports = __toCommonJS(build_single_lib_file_exports);
var sysFs = __toESM(require("fs"));
var import_fsix = require("../vendor/fsix.js");
var BuildSingleLibFile;
((BuildSingleLibFile2) => {
  function build(libModules, srcPath, dstPath, dstFile, generateMsg, excludeIdList, isDebug) {
    const WARN_MSG = `
// This file was generated via ${generateMsg}
//
// @WARN: Don't edit this file.
`;
    const outputList = [];
    libModules.forEach((fileTitle) => {
      const srcFileName = `${srcPath}/${fileTitle}.ts`;
      outputList.push(import_fsix.fsix.readUtf8Sync(srcFileName));
    });
    let output = WARN_MSG + "\nnamespace ABeamer {" + outputList.join("\n").replace(/}\s*\n+\s*"use strict";/g, "").replace(/namespace ABeamer\s*{/g, "").replace(
      /export\s+(\w+)\s+_(\w+)/g,
      (all, tokType, id) => excludeIdList.indexOf(id) === -1 ? `${tokType} _${id}` : all
    );
    if (!isDebug) {
      output = output.replace(
        /\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g,
        () => ""
      );
    }
    import_fsix.fsix.mkdirpSync(dstPath);
    sysFs.writeFileSync(dstFile, output);
  }
  BuildSingleLibFile2.build = build;
})(BuildSingleLibFile || (BuildSingleLibFile = {}));
//# sourceMappingURL=build-single-lib-file.js.map
