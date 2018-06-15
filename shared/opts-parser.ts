"use strict";
// uuid: 2460e386-36d9-49ec-afd6-30963ab2e387

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// The code shared by the server and cli

import { RelConsts } from "../shared/rel-consts.js";

export namespace OptsParser {

  export const DEFAULT_OUT_PATTERN = '/story-frames/frame%05d.png';
  export const DEFAULT_OUT_REPORT = '__FRAMES_DIR__/frame-report.json';
  export const ON_ERROR_EXIT_VALUE = -1;
  /** For security reasons, the user can't access this constant  */
  export const DEFAULT_MAX_WIDTH = 3840;
  /** For security reasons, the user can't access this constant  */
  export const DEFAULT_MAX_HEIGHT = 2160;
  /** For security reasons, the user can't access this constant  */
  export const DEFAULT_MAX_FPS = 50;
  /** For security reasons, the user can't access this constant  */
  export const DEFAULT_MAX_FRAME_COUNT = 20 * 60 * 60 * 1;  // limits to 1h at 20fps

  export const DEFAULT_PROGRESS = 25;


  /**
   * Map of all the common options to both the cli and the render server agent.
   * Each key represents an option in both camelCase and Dash format.
   */
  export let argOpts = {

    ll: { param: 'int', desc: `log level. 0 has no verbosity` },

    version: { desc: `version` },

    url: {
      param: 'string', desc:
        `url of the page containing the animation
              e.g. http://www.abeamer.com/
              e.g. file:///home/abeamer/Documents/test/`},

    file: {
      param: 'string', desc:
        `for running local files with relative paths
           if --out isn't defined it sets to __PROJDIR__${DEFAULT_OUT_PATTERN}
              e.g --file gallery/hello-world/`},

    out: {
      param: 'string', desc:
        `output file pattern. use %(0<n>)d for sequence,
           creates the destination folder if doesn't exists
           if it's defined after --file, the macro __PROJDIR__ will be file value
             e.g. --out __PROJDIR__${DEFAULT_OUT_PATTERN}`,
    },

    report: {
      param: 'string', desc:
        `output report filename providing information about dimensions and fps
           default is ${DEFAULT_OUT_REPORT}`,
    },

    allowedPlugins: {
      param: 'string', desc:
        `filename of the the list of the allowed plugins`,
    },

    injectPage: {
      param: 'string', desc:
        `filename of the index.html that will receive the injection`,
    },

    width: {
      param: 'int', desc:
        `frame output width. default is ${RelConsts.DEFAULT_WIDTH}`,
    },

    maxWidth: {
      param: 'int', desc:
        `maximum frame output width. default is ${DEFAULT_MAX_WIDTH}`,
    },

    height: {
      param: 'int', desc:
        `frame output height. default is ${RelConsts.DEFAULT_HEIGHT}`,
    },

    maxHeight: {
      param: 'int', desc:
        `maximum frame output height. default is ${DEFAULT_MAX_HEIGHT}`,
    },

    noframes: {
      desc:
        `doesn't render the frames to file nor generates the report.
           use it only for debugging`},

    server: {
      param: 'string', desc:
        `name of the server. default is ${RelConsts.DEFAULT_SERVER}`,
    },

    fps: {
      param: 'int', desc:
        `overrides frames per second defined on project`,
    },

    maxFps: {
      param: 'int', desc:
        `maximum frame per second. default is ${DEFAULT_MAX_FPS}`,
    },

    maxFrameCount: {
      param: 'int', desc:
        `maximum number of frames. default is ${DEFAULT_MAX_FRAME_COUNT}`,
    },

    progress: {
      param: 'int', desc:
        `number of frames it displays a progress info. if 0 doesn't shows progress. default is ${DEFAULT_PROGRESS}`,
    },

    timeout: {
      param: 'int', desc:
        `server timeout. default is 0`,
    },

    teleport: { desc: `makes the web browser run on teleport mode, and generates the story on the exit` },

    dp: { desc: `deletes previous frames` },

    config: {
      param: 'string', desc:
        `loads the config from a ini or json file
           see https://github.com/a-bentofreire/abeamer/docs/config-file.md`,
    },
  } as {
      [name: string]: {
        param?: string,
        value?: string | number | boolean,
        hasOption?: boolean,
        desc: string,
      },
    };

  // ------------------------------------------------------------------------
  //                               Iterate Arg Options
  // ------------------------------------------------------------------------

  /** Returns true, if the argument is an option */
  export const isOption = (arg: string) => arg.indexOf('--') === 0;


  export function iterateArgOpts(toParseValue: boolean,
    getNext: () => string,
    callback: (option: string | 'param',
      value: string | number | boolean) => int | undefined,
  ): int | undefined {
    do {
      const name = (getNext() || '').trim();
      if (!name) {
        break;
      }
      if (isOption(name)) {
        const optName = name.substr(2)
          // converts part1-part2-part3 => part1Part2Part3
          .replace(/-(\w)/g, (all, firstLetter: string) => firstLetter.toUpperCase());

        const opt = argOpts[optName];
        if (opt === undefined) {
          throw `Unknown option ${optName}`;
        }
        opt.hasOption = true;
        if (opt.param) {
          opt.value = getNext();
          if (!opt.value || isOption(opt.value)) {
            throw `Missing value for ${name}`;
          }
          if (toParseValue) {
            switch (opt.param) {
              case 'int':
                if (opt.value.match(/[^\d]/)) {
                  throw `${name} ${opt.value} isn't a integer value`;
                }
                opt.value = parseInt(opt.value);
                break;
              case 'boolean':
                opt.value = opt.value === 'true'
                  || opt.value === '1';
                break;
            }
          }
        }

        const res = callback(optName, opt.value);
        if (res !== undefined) {
          return res;
        }

      } else {
        callback('@param', name);
      }
    } while (true);
  }

  // ------------------------------------------------------------------------
  //                               Print Usage
  // ------------------------------------------------------------------------

  /**
   * Converts Options key to dash format, by replacing the uppercase to
   * dash + lowercase.
   */
  function _getDashKey(key: string): string {
    return key.replace(/([A-Z])/g, (all, p: string) =>
      '-' + p.toLowerCase());
  }


  /** Outputs to the console the program usage */
  export function printUsage(): void {

    const names = Object.keys(argOpts);
    let max = 0;
    names.forEach(key => { max = Math.max(_getDashKey(key).length, max); });
    const fromKeyToDesc = max + 3;
    const descPos = 5 + fromKeyToDesc + 2;
    console.log(`
 The options are:
 ` + names.map(key => {
        const dashKey = _getDashKey(key);
        return `   --${dashKey}${Array(fromKeyToDesc - dashKey.length).join(' ')}`
          + `${argOpts[key].desc.split('\n').map((line, lineIndex) =>
            Array(lineIndex ? descPos : 0).join(' ') + line.trim(),
          ).join('\n')}\n\n`;
      }).join('\n'));
  }
}
