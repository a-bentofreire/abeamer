"use strict";
// uuid: b7d8fdeb-a71e-4bf8-923a-747011b52862

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Common filesystem functions implemented by nodejs
// Use IRel.Fs to have an abstract filesystem

import * as sysFs from "fs";
import * as sysPath from "path";
import { exec as sysExec } from "child_process";

export namespace fsix {

  export const loadJsonSync = (fileName: string) => JSON.parse(readUtf8Sync(fileName));

  export const writeJsonSync = (fileName: string, data) => {
    sysFs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  };

  /**
   * Converts any path to unix style path
   * Backslashes in unix paths aren't supported
   *
   * @param path unix or windows style path
   */
  export const toPosixSlash = (path: string): string => path.replace(/\\/g, '/');

  export const readUtf8Sync = (fileName: string, encoding?): string =>
    sysFs.readFileSync(fileName, { encoding: encoding || 'utf-8' }) as any;

  /**
   * Creates a directory if doesn't exists, including parent folders
   *
   * @param path unix-style path
   */
  export function mkdirpSync(path: string): void {
    while (path && !sysFs.existsSync(path)) {
      mkdirpSync(sysPath.dirname(path));
      sysFs.mkdirSync(path);
    }
  }

  export function runExternal(cmd: string, callback: (error, stdout, stderr) => void): void {
    sysExec(cmd, (error, stdout, stderr) => {
      if (callback) { callback(error, stdout, stderr); }
    });
  }
}
