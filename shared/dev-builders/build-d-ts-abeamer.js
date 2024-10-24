"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDTsFilesABeamer = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const fsix_js_1 = require("../vendor/fsix.js");
const build_d_ts_js_1 = require("./build-d-ts.js");
const build_docs_latest_js_1 = require("./build-docs-latest.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * Contains the configurations for dev-build-d-ts module
 *
 * This module is separated to keep dev-build-d-ts as generic as possible
 *
 */
var BuildDTsFilesABeamer;
(function (BuildDTsFilesABeamer) {
    function build(libModules, pluginModules, CLIENT_UUID, COPYRIGHTS, cfg) {
        const WARN_MSG = `
  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  `;
        const libSourceFileNames = [...libModules
                .map(fileTitle => `${cfg.paths.JS_PATH}/${fileTitle}.ts`),
            ...pluginModules
                .map(fileTitle => `${cfg.paths.PLUGINS_PATH}/${fileTitle}/${fileTitle}.ts`)];
        [{
                uuid: 'bb85cc57-f5e3-4ae9-b498-7d13c07c8516',
                srcFiles: libSourceFileNames,
                docTarget: build_docs_latest_js_1.BuildDocsLatest.getTargets(cfg).find(target => target.id === 'end-user'),
                namespace: 'ABeamer',
                outFile: `${cfg.paths.TYPINGS_PATH}/abeamer.d.ts`,
                description: `
  //
  // These are the class interfaces for the end-user and plugin creators
  // Any modification on these interfaces will require an increment in the high number version
  //`,
                acceptId: (id, idType) => {
                    switch (idType) {
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.JsDocs:
                            return id.replace(/@(memberof|extends) _/g, '@$1 ');
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.ExtendsWords:
                            return id.replace(/\s_/, ' ');
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.ClassName:
                            return id.replace(/^_/, '');
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName:
                            return '';
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.MethodName:
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.VarName:
                            return id[0] === '_' || id === 'constructor' ? '' : id;
                    }
                    return id;
                },
            },
            {
                uuid: 'a7d9ab44-f9b0-4108-b768-730d7afb20a4',
                srcFiles: libSourceFileNames,
                namespace: 'ABeamer',
                docTarget: build_docs_latest_js_1.BuildDocsLatest.getTargets(cfg).find(target => target.id === 'dev'),
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
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.ExtendsWords:
                            return '';
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.ClassName:
                            return id + 'Impl extends ' + id.replace(/^_/, '');
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName:
                            return '';
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.MethodName:
                        case build_d_ts_js_1.BuildDTsFiles.IdTypes.VarName: return id[0] !== '_' ? '' : id;
                    }
                    return id;
                },
            },
            {
                uuid: '61a25ccf-dbe2-49cc-bb39-bc58b68ccbae',
                srcFiles: libSourceFileNames,
                tag: 'release',
                namespace: 'ABeamer',
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
                    return (idType === build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName && id[0] === '_') ? '' : id;
                },
            },
        ].forEach(target => {
            const outFile = target.outFile;
            let apiPath;
            if (target.docTarget) {
                apiPath = `${target.docTarget.dstPath}/${build_docs_latest_js_1.BuildDocsLatest.EN_LAST_VERSION_PATH}`
                    + `/${build_docs_latest_js_1.BuildDocsLatest.API_FOLDER}`;
                fsix_js_1.fsix.mkdirpSync(apiPath);
            }
            build_d_ts_js_1.BuildDTsFiles.build(target.srcFiles, outFile, CLIENT_UUID + COPYRIGHTS + WARN_MSG + target.description
                + `\n\ndeclare namespace ${target.namespace} {\n\n`, '\n}\n', target.acceptId, target.tag, apiPath);
            console.log(`Build ${outFile}`);
        });
    }
    BuildDTsFilesABeamer.build = build;
})(BuildDTsFilesABeamer || (exports.BuildDTsFilesABeamer = BuildDTsFilesABeamer = {}));
//# sourceMappingURL=build-d-ts-abeamer.js.map