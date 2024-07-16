"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// The code shared by the server and cli

import { RelConsts } from "../shared/rel-consts.js";

export namespace OptsParser {

  export const DEFAULT_OUT_PATTERN = '__PROJDIR__/story-frames/frame%05d.png';
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

  export type MultipleValue = { [index: string]: string } | string[];

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
              e.g. http://abeamer.devtoix.com/
              e.g. file:///home/abeamer/Documents/test/`},

    file: {
      param: 'string', desc:
        `for running local files with relative paths
           if --out isn't defined it sets to ${DEFAULT_OUT_PATTERN}
              e.g --file gallery/hello-world/`},

    out: {
      param: 'string', desc:
        `output file pattern. use %(0<n>)d for sequence,
           creates the destination folder if doesn't exists
           if it's defined after --file, the macro  will be file value
             e.g. --out ${DEFAULT_OUT_PATTERN}`,
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

    scale: {
      param: 'string', desc: `scales to gif or movie movie generators.
          e.g.
             --scale 25%
             --scale 200,400
             --scale 40%,30%
          `,
    },

    noframes: {
      desc:
        `doesn't render the frames to file nor generates the report.
           use it only for debugging`},

    server: {
      param: 'string', desc:
        `name of the server. default is ${RelConsts.DEFAULT_SERVER}`,
    },

    serverExec: {
      param: 'string', desc:
        `name of the server executable. default puppeteer=node. slimerjs=slimerjs`,
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
           see https://abeamer.devtoix.com/docs/latest/end-user/en/site/config-file/`,
    },

    var: {
      param: 'object', desc:
        `allows to pass multiple variables to client web library.
         accessible as story.args.vars or in expressions.
         if the variable name has dashes, it will be converted to camelCase
           e.g --var name=end-user --var value=1.2.3`,
    },
  } as {
      [name: string]: {
        param?: string,
        value?: string | number | boolean,
        multipleValue?: MultipleValue,
        hasOption?: boolean,
        allowOption?: boolean,
        desc: string,
      },
    };

  // ------------------------------------------------------------------------
  //                               Iterate Arg Options
  // ------------------------------------------------------------------------

  /** Returns true, if the argument is an option */
  export const isOption = (arg: string) => arg.indexOf('--') === 0;


  /**
   * Iterates the command line arguments.
   * For each option, it calls callback.
   * If callback returns different from `undefined`, it exists immediately with
   * the return value of the callback.
   * Otherwise it iterates until all arguments are consumed and returns undefined.
   */
  export function iterateArgOpts(toParseValue: boolean,
    getNext: () => string,
    callback: (option: string | 'param',
      value: string | number | boolean, multipleValue?: MultipleValue) => int | undefined,
  ): int | undefined {
    do {
      const name = (getNext() || '').trim();
      if (!name) {
        break;
      }
      if (isOption(name)) {
        const optName = name.substr(2)
          // converts part1-part2-part3 => part1Part2Part3
          .replace(/-(\w)/g, (_all, firstLetter: string) => firstLetter.toUpperCase())
          // removes the suffix to solve the `--config` option conflict on slimerjs
          .replace(/__\d+$/, '');

        const opt = argOpts[optName];
        if (opt === undefined) {
          throw `Unknown option ${optName}`;
        }

        opt.hasOption = true;
        if (opt.param) {
          opt.value = getNext();
          if (!opt.value || (isOption(opt.value) && !opt.allowOption)) {
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

              case 'object':
                opt.multipleValue = opt.multipleValue || {};
                const [, key, value] = opt.value.match(/^([^=]+)=(.*)$/) || ['', '', ''];
                if (!key) {
                  throw `${name} requires the key field`;
                }
                opt.multipleValue[key] = value;
                break;

              case 'array':
                opt.multipleValue = opt.multipleValue || [];
                (opt.multipleValue as string[]).push(opt.value);
                break;
            }
          }
        }

        const res = callback(optName, opt.value, opt.multipleValue);
        if (res !== undefined) {
          return res;
        }

      } else {
        callback('@param', name);
      }
    } while (true);
  }

  // ------------------------------------------------------------------------
  //                               Compute Scale
  // ------------------------------------------------------------------------

  export function computeScale(width: int, height: int): string[] {

    function computeScaleItem(item: string, dim: int): string {
      let scale = 1;
      if (item.endsWith('%')) {
        scale = dim / 100;
        item = item.substr(0, item.length - 1);
      }
      const value = parseInt(item, 10) * scale;
      return Math.round(value).toString();
    }

    const sScale = (argOpts.scale.value as string || '').trim();
    if (!sScale) {
      return undefined;
    }
    const scaleItems = sScale.split(/\s*,\s*/);
    return [
      computeScaleItem(scaleItems[0], width),
      computeScaleItem(scaleItems[1] || scaleItems[0], height)];
  }

  // ------------------------------------------------------------------------
  //                               Print Usage
  // ------------------------------------------------------------------------

  /**
   * Converts Options key to dash format, by replacing the uppercase to
   * dash + lowercase.
   */
  function _getDashKey(key: string): string {
    return key.replace(/([A-Z])/g, (_all, p: string) =>
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
