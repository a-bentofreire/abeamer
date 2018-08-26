"use strict";
// uuid: 574e70bb-6cab-43a7-82d8-1556d97b6d77

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import { fsix } from "../vendor/fsix.js";

/** @module internal | This module is to be read only by developers */

/**
 * ## Description
 *
 * Concats all whole the lib modules javascript files into a single file
 *
 * This module is called by `gulp build-release-latest`
 *
 */
export namespace BuildSingleLibFile {

  export function build(libModules: string[],
    srcPath: string, dstPath: string, dstFile: string,
    generateMsg: string, excludeIdList: string[], isDebug: boolean): void {

    const WARN_MSG = `
// This file was generated via ${generateMsg}
// It shares the uuid
//
// @WARN: Don't edit this file.
`;

    const outputList = [];

    libModules.forEach(fileTitle => {
      const srcFileName = `${srcPath}/${fileTitle}.ts`;
      outputList.push(fsix.readUtf8Sync(srcFileName));
    });

    let output = WARN_MSG + '\nnamespace ABeamer {'
      + outputList.join('\n')
        .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
        .replace(/namespace ABeamer\s*{/g, '')
        .replace(/export\s+(\w+)\s+_(\w+)/g, (all, tokType, id) =>
          excludeIdList.indexOf(id) !== -1 ? `${tokType} _${id}` : all,
        );

    if (!isDebug) {
      output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g,
        (all) => '');
    }

    fsix.mkdirpSync(dstPath);
    sysFs.writeFileSync(dstFile, output);
  }
}
