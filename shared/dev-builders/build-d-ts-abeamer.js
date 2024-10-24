"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var build_d_ts_abeamer_exports = {};
__export(build_d_ts_abeamer_exports, {
  BuildDTsFilesABeamer: () => BuildDTsFilesABeamer
});
module.exports = __toCommonJS(build_d_ts_abeamer_exports);
var import_fsix = require("../vendor/fsix.js");
var import_build_d_ts = require("./build-d-ts.js");
var import_build_docs_latest = require("./build-docs-latest.js");
var BuildDTsFilesABeamer;
((BuildDTsFilesABeamer2) => {
  function build(libModules, pluginModules, CLIENT_UUID, COPYRIGHTS, cfg) {
    const WARN_MSG = `
  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  `;
    const libSourceFileNames = [
      ...libModules.map((fileTitle) => `${cfg.paths.JS_PATH}/${fileTitle}.ts`),
      ...pluginModules.map((fileTitle) => `${cfg.paths.PLUGINS_PATH}/${fileTitle}/${fileTitle}.ts`)
    ];
    [
      {
        uuid: "bb85cc57-f5e3-4ae9-b498-7d13c07c8516",
        srcFiles: libSourceFileNames,
        docTarget: import_build_docs_latest.BuildDocsLatest.getTargets(cfg).find((target) => target.id === "end-user"),
        namespace: "ABeamer",
        outFile: `${cfg.paths.TYPINGS_PATH}/abeamer.d.ts`,
        description: `
  //
  // These are the class interfaces for the end-user and plugin creators
  // Any modification on these interfaces will require an increment in the high number version
  //`,
        acceptId: (id, idType) => {
          switch (idType) {
            case import_build_d_ts.BuildDTsFiles.IdTypes.JsDocs:
              return id.replace(/@(memberof|extends) _/g, "@$1 ");
            case import_build_d_ts.BuildDTsFiles.IdTypes.ExtendsWords:
              return id.replace(/\s_/, " ");
            case import_build_d_ts.BuildDTsFiles.IdTypes.ClassName:
              return id.replace(/^_/, "");
            case import_build_d_ts.BuildDTsFiles.IdTypes.FunctionName:
              return "";
            case import_build_d_ts.BuildDTsFiles.IdTypes.MethodName:
            case import_build_d_ts.BuildDTsFiles.IdTypes.VarName:
              return id[0] === "_" || id === "constructor" ? "" : id;
          }
          return id;
        }
      },
      {
        uuid: "a7d9ab44-f9b0-4108-b768-730d7afb20a4",
        srcFiles: libSourceFileNames,
        namespace: "ABeamer",
        docTarget: import_build_docs_latest.BuildDocsLatest.getTargets(cfg).find((target) => target.id === "dev"),
        outFile: `${cfg.paths.TYPINGS_PATH}/abeamer-dev.d.ts`,
        description: `
  //
  // These are the class interfaces for internal usage only
  // It won't be deployed on the release version
  // and it shouldn't be accessed by plugin creators
  // In theory, all of these class members should be have protected access
  // but due a lack of 'friend class' mechanism in TypeScript, they have
  // public access but both the interfaces as well as the members but all
  // must start with underscore
  //`,
        acceptId: (id, idType) => {
          switch (idType) {
            case import_build_d_ts.BuildDTsFiles.IdTypes.ExtendsWords:
              return "";
            case import_build_d_ts.BuildDTsFiles.IdTypes.ClassName:
              return id + "Impl extends " + id.replace(/^_/, "");
            case import_build_d_ts.BuildDTsFiles.IdTypes.FunctionName:
              return "";
            case import_build_d_ts.BuildDTsFiles.IdTypes.MethodName:
            case import_build_d_ts.BuildDTsFiles.IdTypes.VarName:
              return id[0] !== "_" ? "" : id;
          }
          return id;
        }
      },
      {
        uuid: "61a25ccf-dbe2-49cc-bb39-bc58b68ccbae",
        srcFiles: libSourceFileNames,
        tag: "release",
        namespace: "ABeamer",
        outFile: `${cfg.paths.TYPINGS_PATH}/release/abeamer-release.d.ts`,
        description: `
  //
  // This file contains about the compilation of all the exported types
  // targeted for the end-user
  // The source data is all information in each source code file defined between
  //      #export-section-start: release
  // and  #export-section-end: release
  //
  // This way the user will have access to all the public information in one file
  // It won't be used during the development phase.
  // And it's excluded in tsconfig
  //`,
        acceptId: (id, idType) => {
          return idType === import_build_d_ts.BuildDTsFiles.IdTypes.FunctionName && id[0] === "_" ? "" : id;
        }
      }
    ].forEach((target) => {
      const outFile = target.outFile;
      let apiPath;
      if (target.docTarget) {
        apiPath = `${target.docTarget.dstPath}/${import_build_docs_latest.BuildDocsLatest.EN_LAST_VERSION_PATH}/${import_build_docs_latest.BuildDocsLatest.API_FOLDER}`;
        import_fsix.fsix.mkdirpSync(apiPath);
      }
      import_build_d_ts.BuildDTsFiles.build(
        target.srcFiles,
        outFile,
        COPYRIGHTS + WARN_MSG + target.description + `

declare namespace ${target.namespace} {

`,
        "\n}\n",
        target.acceptId,
        target.tag,
        apiPath
      );
      console.log(`Build ${outFile}`);
    });
  }
  BuildDTsFilesABeamer2.build = build;
})(BuildDTsFilesABeamer || (BuildDTsFilesABeamer = {}));
//# sourceMappingURL=build-d-ts-abeamer.js.map
