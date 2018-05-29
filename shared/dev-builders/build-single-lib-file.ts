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
 * This module is called by `gulp build-release`
 *
 */
export namespace BuildSingleLibFile {

  export function build(libModules: string[],
    srcPath: string, dstPath: string, dstFile: string,
    generateMsg: string) {

    const WARN_MSG = `
// This file was generated via ${generateMsg}
// It shares the uuid
//
// @WARN: Don't edit this file.
`;

    const outputList = [];
    const extRefs = [];

    libModules.forEach(fileTitle => {
      const srcFileName = `${srcPath}/${fileTitle}.js`;
      const content = fsix.readUtf8Sync(srcFileName);
      outputList.push(content);

        // removes the namespace initial part including all the previous comments
        // @TODO: Make it work!!!
        // .replace(/(?:.|\n)*function\s*\(ABeamer.*\n/, '')

        // removes the end part
        // @TODO: Make it work!!!
        // .replace(/^\s*\}\)\(ABeamer.*$/m, '')
        // .replace(/^\s*var _abeamer;\n/m, '')

        // stores the list of external ids
        // it must be before transform all external references
        // @TODO: Make it work!!!
        // .replace(/^\s*ABeamer\.(\w+)\s*=\s*(\w+);\s*/mg,
        //   (all, extRef: string, intRef) => {
        //   if (extRef !== intRef) { return all; }
        //   if (/* extRef[0] !== '_' */true) { extRefs.push(extRef); }
        //   return '';
        // })

        // transforms all external references into internal references
        // @TODO: Make it work!!!
        // .replace(/\bABeamer\./g, ''),
    });

    const output = ''
      // 'var ABeamer;\n'
      // + '(function (ABeamer) {\n'
      + outputList.join('\n') + '\n'
      // + extRefs.map(ref => `ABeamer.${ref}=${ref};`).join('\n') + '\n'
      // + '})(ABeamer || (ABeamer = {}));\n'
      // + 'var _abeamer;\n'
      ;

    fsix.mkdirpSync(dstPath);
    sysFs.writeFileSync(dstFile, output);
  }
}
