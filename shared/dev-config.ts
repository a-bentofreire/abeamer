"use strict";
// uuid: 216f8fa2-007f-4e48-a1cb-b256dda0096b

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import * as yaml from "js-yaml";
import { fsix } from "./vendor/fsix.js";

export namespace DevCfg {

  interface StrMap { [key: string]: string; }

  export interface DevDocsWordMap {
    [word: string]: {
      wordClass: string,
      title?: string,
    };
  }


  export interface DevConfig {
    macros: StrMap;

    paths: {
      PROJ_PATH: string; // computed project path

      CLIENT_PATH: string;
      LIB_PATH: string;
      JS_PATH: string;
      PLUGINS_PATH: string;
      MESSAGES_PATH: string;
      TYPINGS_PATH: string;
      SHARED_PATH: string;
      SHARED_LIB_PATH: string;
      GALLERY_SRC_PATH: string;
      GALLERY_LATEST_PATH: string;
      BADGES_PATH: string;
      ICONS_PATH: string;

      RELEASE_LATEST_PATH: string;

      DOCS_PATH: string;

      DOCS_LATEST_END_USER_PATH: string;
      DOCS_LATEST_DEVELOPER_PATH: string;
      DOCS_SOURCE_PATH: string;
      DOCS_SOURCE_DEV_PATH: string;

      MODULES_LIST_FILE: string;

      [key: string]: string;
    };

    jsFiles: string[];


    release: {
      demos: string[];
      demosStr: string;
      root: string[];
      client: string[];
    };

    webLinks: {
      localServer: string;
      webDomain: string;
    };

    docs: {
      replacePaths: any[][];
      keywords: string[];
      jsTypes: string[];
      customTypes: string[][];
    };
  }

  // ------------------------------------------------------------------------
  //                               Get Config
  // ------------------------------------------------------------------------

  let cfg: DevConfig;

  export function getConfig(projPath: string): DevCfg.DevConfig {
    if (!cfg) {
      cfg = yaml.load(fsix.readUtf8Sync('./config.yaml'), yaml.DEFAULT_FULL_SCHEMA);
      cfg.paths.PROJ_PATH = fsix.toPosixSlash(projPath);
      cfg.release.demosStr = cfg.release.demos.length > 1 ?
        `{${cfg.release.demos.join(',')}}` : cfg.release.demos[0];

      expandMap(cfg.webLinks);
      expandMap(cfg.paths);
    }
    return cfg;
  }


  export function expandMacro(value: string): string {
    let changed = false;
    do {
      changed = false;
      value = value.replace(/\${(\w+)}/g, (_all, key) => {
        changed = true;
        return cfg.macros[key] || cfg.paths[key];
      });
    } while (changed);
    return value;
  }


  export function expandMap(map: StrMap): StrMap {
    Object.keys(map).forEach(key => {
      map[key] = expandMacro(map[key]);
    });
    return map;
  }


  export function expandArray(arr: string[]): string[] {
    arr.forEach((value, index) => {
      arr[index] = expandMacro(value);
    });
    return arr;
  }
}
