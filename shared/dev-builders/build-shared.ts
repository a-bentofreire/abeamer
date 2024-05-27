"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import { fsix } from "../vendor/fsix.js";

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
export namespace BuildShared {

  export function build(libSourceFileTitles: string[],
    srcPath: string, dstPath: string,
    generateMsg: string) {

    const WARN_MSG = `
// This file was generated via ${generateMsg}
// It shares the uuid
//
// @WARN: Don't edit this file.
/** @see `;

    const sharedConsts = [];

    function parseSharedConsts(fileTitle: string, content: string): void {
      let found = false;
      let lastIdPart = '';

      function addConst(line: string): void {
        if (!found) {
          sharedConsts.push(`
  // -------------
  // ${fileTitle}
  // -------------
`);
          found = true;
        }

        // adds extra line if a different constant group
        const [, , id] = line.match(/^(\w+)\s+(\w+)/) || ['', '', ''];
        const idParts = id.split('_');
        if (lastIdPart && lastIdPart !== idParts[0]) {
          sharedConsts.push('');
        }
        lastIdPart = idParts[0];

        sharedConsts.push('  export ' + line);
      }

      // scans for consts and enums
      content.replace(/export\s+(const\s+[A-Z]\w+\s*=\s*[^;]+;|enum\s+\w+\s*{[^}]+})/g, (all, p) => {
        addConst(p.replace(/ as.*;/, ';'));
        return all;
      });
    }


    libSourceFileTitles.forEach(fileTitle => {
      const srcFileName = `${srcPath}/${fileTitle}.ts`;
      let content = fsix.readUtf8Sync(srcFileName);
      parseSharedConsts(fileTitle, content);
      if (content.match(/@module shared/)) {

        const outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1)
          .replace(/-(\w)/g, (all, p1) => p1.toUpperCase());
        content = content.replace(/namespace \w+/, `export namespace ${outNameSpace}`);
        content = content.replace(/[^\n]+@module shared[^\n]+/, `\n${WARN_MSG}${srcFileName} */\n`);

        const dstFileName = `${dstPath}/${fileTitle}.ts`;
        console.log(`writing ${dstFileName}`);
        sysFs.writeFileSync(dstFileName, content);
      }
    });


    // generates the dev consts file
    sysFs.writeFileSync(`${dstPath}/dev-consts.ts`,
      `"use strict";
// This file was generated ${generateMsg}
// It has no uuid
//
// @WARN: Don't edit this file.

export namespace DevConsts {
${sharedConsts.join('\n')}
}
`);
  }
}
