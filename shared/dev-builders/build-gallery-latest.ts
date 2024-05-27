"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import { spawn as sysSpawn } from "child_process";

import { fsix } from "../vendor/fsix.js";
import { DevCfg } from "../dev-config.js";

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * Builds gallery-release files.
 * Read the [](#config-file.md) for more information.
 */
export namespace BuildGalleryLatest {

  export const EXAMPLE_ZIP_FILE = 'code.zip';

  export interface Example {
    width: uint;
    height: uint;
    folder: string;
    srcFullPath: string;
    dstFullPath: string;
    iniFileName: string;
    description: string[];
    /** if true, it requires a live server. */
    usesLive: boolean;
    /** if true, it doesn't generates an animated gif image. */
    noGifImage: boolean;
    /** if true, it generates movies instead of gifs. */
    genMovie: boolean;
    /** if false, it doesn't supports teleportation. */
    teleportable: boolean;
    /** snapshot built to overcome github removing video tag. */
    movieSnapshot: string;
    movieViewPage: string;
  }


  export const releaseExamples: Example[] = [];


  /**
   * Fills the `releaseExamples` list with every gallery example that
   * is prepared to be released.
   */
  export function populateReleaseExamples(cfg: DevCfg.DevConfig): void {

    const exclusions = fsix
      .loadJsonSync(`${cfg.paths.GALLERY_SRC_PATH}/exclude-from-release.json`) as string[];

    sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH).forEach(folder => {

      if (exclusions.indexOf(folder) !== -1) { return; }

      const srcFullPath = `${cfg.paths.GALLERY_SRC_PATH}/${folder}`;
      const dstFullPath = `${cfg.paths.GALLERY_LATEST_PATH}/${folder}`;
      const iniFileName = `${srcFullPath}/abeamer.ini`;

      if (sysFs.existsSync(iniFileName)) {

        const ex = {
          width: 0,
          height: 0,
          folder,
          srcFullPath,
          dstFullPath,
          iniFileName,
          description: [],
          usesLive: false,
          noGifImage: false,
          genMovie: false,
          teleportable: true,
          movieSnapshot: '',
          movieViewPage: '',
        } as Example;

        let prevNr = 0;
        let lastDescLine = '';
        fsix.readUtf8Sync(iniFileName).replace(/[\$@]abeamer-([a-z\-]+)(\d*)\s*:\s*"?([^";]+)"?/g,
          (_all, id, nr, value: string) => {
            switch (id) {
              case 'description':
                nr = parseInt(nr || '1');
                if (nr !== prevNr + 1) {
                  console.warn(`Incorrect description numbering in ${iniFileName}`);
                }
                prevNr = nr;
                if (lastDescLine && !lastDescLine.match(/[:\.]$/)) {
                  lastDescLine += ' ' + value;
                  ex.description[ex.description.length - 1] = lastDescLine;
                } else {
                  ex.description.push(value);
                  lastDescLine = value;
                }
                break;

              case 'width':
                ex.width = parseInt(value);
                break;

              case 'height':
                ex.height = parseInt(value);
                break;

              case 'uses-live':
                ex.usesLive = value.toLowerCase() === 'true';
                break;

              case 'no-gif-image':
                ex.noGifImage = value.toLowerCase() === 'true';
                break;

              case 'gen-movie':
                ex.genMovie = value.toLowerCase() === 'true';
                ex.noGifImage = ex.noGifImage || ex.genMovie;
                break;

              case 'teleportable':
                ex.teleportable = value.toLowerCase() === 'true';
                break;

              case 'movie-snapshot':
                ex.movieSnapshot = value;
                break;

              case 'movie-view-page':
                ex.movieViewPage = value;
                break;
            }
            return '';
          });

        if (!ex.description.length) { ex.description.push(folder); }

        releaseExamples.push(ex);
      }
    });
  }

  // ------------------------------------------------------------------------
  //                               buildReadMe
  // ------------------------------------------------------------------------

  /**
   * Builds the gallery-release ReadMe file
   */
  export function buildReadMe(cfg: DevCfg.DevConfig): void {
    const galleryLinks: string[] = [];
    const missingFiles: string[] = [];
    const rnd = Math.round(Math.random() * 100000000);

    function checkFile(fileName: string) {
      if (!sysFs.existsSync(fileName)) {
        missingFiles.push(fileName);
      }
      return fileName;
    }

    releaseExamples.forEach(ex => {
      galleryLinks.push(`\n--------------------------`
        + `\n### ${ex.folder}\n`
        + `${ex.description.join('  \n')}${'  '}`);

      const storyFramesFolder = `${ex.folder}/story-frames`;

      if (!ex.noGifImage) {
        checkFile(`./${cfg.paths.GALLERY_SRC_PATH}/${ex.folder}/story-frames/story.gif`);
        galleryLinks.push(`\n  `
          + `\n![Image](${storyFramesFolder}/story.gif?${rnd})${'  '}\n  `);
      }

      if (ex.genMovie) {
        galleryLinks.push(`\n  `
          + `\n[![Image](${storyFramesFolder}/../${ex.movieSnapshot})]`
          + `(${storyFramesFolder}/../${ex.movieViewPage})${'  '}\n  `);
      }

      galleryLinks.push(`
Download code: [zip](${ex.folder}/${EXAMPLE_ZIP_FILE}).${'  '}
Try it <a href="${ex.folder}/index-online.html">online</a>.${'  '}
${ex.usesLive ? '**WARNING** This example requires a live server.  \n' : '  \n'}
${!ex.teleportable ? '**WARNING** This example doesn\'t supports teleportation.  \n' : '  \n'}
    `);
    });

    const outREADME = fsix.readUtf8Sync(`${cfg.paths.GALLERY_SRC_PATH}/README-rel.md`)
      + galleryLinks.join('');
    sysFs.writeFileSync(`${cfg.paths.GALLERY_LATEST_PATH}/README.md`, outREADME);
    if (missingFiles.length) {
      throw `Missing files:\n` + missingFiles.join('\n');
    }
  }

  // ------------------------------------------------------------------------
  //                               Runs External Commands
  // ------------------------------------------------------------------------

  function runSpawn(cmdLine: string, args: string[], callback?): void {

    console.log(`spawn cmdLine: ${cmdLine}`);
    console.log(`args: ${args}`);

    const ls = sysSpawn(cmdLine, args);

    ls.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    ls.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    ls.on('close', () => {
      callback();
    });
  }

  // ------------------------------------------------------------------------
  //                               buildGifs
  // ------------------------------------------------------------------------

  export function buildGifs(cfg: DevCfg.DevConfig): void {
    populateReleaseExamples(cfg);
    releaseExamples.forEach((example/* , index */) => {
      if (example.noGifImage) { return; }
      // if (example.folder === 'animate-attack-task') { // use to test one example only

      runSpawn('npm', ['run', '--', 'render', '--dp', '--url',
        `${cfg.webLinks.localServer}/${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/`,
        '--config', `./${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/abeamer.ini`,
      ], () => {
        runSpawn('npm', ['run', '--', 'gif', `${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/`],
          () => {
            console.log(`Done example: ${example.folder}`);
          });
      });
      // }
      console.log(`example.folder: ${example.folder}`);
    });
  }
}
