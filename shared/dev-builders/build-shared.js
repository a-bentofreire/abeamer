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
var build_shared_exports = {};
__export(build_shared_exports, {
  BuildShared: () => BuildShared
});
module.exports = __toCommonJS(build_shared_exports);
var sysFs = __toESM(require("fs"));
var import_fsix = require("../vendor/fsix.js");
var BuildShared;
((BuildShared2) => {
  function build(libSourceFileTitles, srcPath, dstPath, generateMsg) {
    const WARN_MSG = `
// This file was generated via ${generateMsg}
//
// @WARN: Don't edit this file.
/** @see `;
    const sharedConsts = [];
    function parseSharedConsts(fileTitle, content) {
      let found = false;
      let lastIdPart = "";
      function addConst(line) {
        if (!found) {
          sharedConsts.push(`
  // -------------
  // ${fileTitle}
  // -------------
`);
          found = true;
        }
        const [, , id] = line.match(/^(\w+)\s+(\w+)/) || ["", "", ""];
        const idParts = id.split("_");
        if (lastIdPart && lastIdPart !== idParts[0]) {
          sharedConsts.push("");
        }
        lastIdPart = idParts[0];
        sharedConsts.push("  export " + line);
      }
      content.replace(/export\s+(const\s+[A-Z]\w+\s*=\s*[^;]+;|enum\s+\w+\s*{[^}]+})/g, (all, p) => {
        addConst(p.replace(/ as.*;/, ";"));
        return all;
      });
    }
    libSourceFileTitles.forEach((fileTitle) => {
      const srcFileName = `${srcPath}/${fileTitle}.ts`;
      let content = import_fsix.fsix.readUtf8Sync(srcFileName);
      parseSharedConsts(fileTitle, content);
      if (content.match(/@module shared/)) {
        const outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1).replace(/-(\w)/g, (all, p1) => p1.toUpperCase());
        content = content.replace(/namespace \w+/, `export namespace ${outNameSpace}`);
        content = content.replace(/[^\n]+@module shared[^\n]+/, `
${WARN_MSG}${srcFileName} */
`);
        const dstFileName = `${dstPath}/${fileTitle}.ts`;
        console.log(`writing ${dstFileName}`);
        sysFs.writeFileSync(dstFileName, content);
      }
    });
    sysFs.writeFileSync(
      `${dstPath}/dev-consts.ts`,
      `"use strict";
// This file was generated ${generateMsg}
//
// @WARN: Don't edit this file.

export namespace DevConsts {
${sharedConsts.join("\n")}
}
`
    );
  }
  BuildShared2.build = build;
})(BuildShared || (BuildShared = {}));
//# sourceMappingURL=build-shared.js.map
