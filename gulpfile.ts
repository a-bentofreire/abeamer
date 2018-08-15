"use strict";
// uuid: 95a216ec-8c6f-4254-9a44-fe8795b3ee4f

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysProcess from "process";
import * as gulp from "gulp";
import * as rimraf from "rimraf";

import { fsix } from "./shared/vendor/fsix.js";
import { DevPaths } from "./shared/dev-paths.js";
import { DevWebLinks as webLinks } from "./shared/dev-web-links.js";
import { BuildDTsFilesABeamer } from "./shared/dev-builders/build-d-ts-abeamer.js";
import { BuildDocs } from "./shared/dev-builders/build-docs.js";
import { BuildShared } from "./shared/dev-builders/build-shared.js";
import { BuildSingleLibFile } from "./shared/dev-builders/build-single-lib-file.js";
import { BuildGalleryRelease as BuildGalRel } from "./shared/dev-builders/build-gallery-release.js";

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * This gulp file builds the release files, definition files, cleans and
 * updates data.
 *
 * To see all the usages run `gulp`
 *
 * @HINT: It's advisable to execute these gulp tasks via `npm run task`
 *
 */
namespace Gulp {

  sysProcess.chdir(__dirname);

  /** List of files and folders to typical preserve on `rm -rf` */
  const PRESERVE_FILES = ['README.md', 'README-dev.md', '.git', '.gitignore'];
  const CLIENT_UUID = '// uuid: 3b50413d-12c3-4a6c-9877-e6ead77f58c5\n\n';
  const CLI_UUID = '// uuid: b88b17e7-5918-44f7-82f7-f0e80c242a82\n\n';
  const SERVER_UUID = '// uuid: 2460e386-36d9-49ec-afd6-30963ab2e387\n\n';
  const COPYRIGHTS = '' +

    '// ------------------------------------------------------------------------\n' +
    '// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.\n' +
    '// Licensed under the MIT License+uuid License. See License.txt for details\n' +
    '// ------------------------------------------------------------------------\n\n';


  // const htmlmin = require('gulp-htmlmin');
  const gulpMinify = require('gulp-minify');
  const gulpReplace = require('gulp-replace');
  // const preprocess = require('gulp-preprocess');
  const gulpPreserveTime = require('gulp-preservetime');
  // const autoprefixer = require('gulp-autoprefixer');
  const gulpRename = require('gulp-rename');
  const gulpZip = require('gulp-zip');
  const gulpSequence = require('gulp-sequence');
  const mergeStream = require('merge-stream');

  // @TODO: Discover why if I remove `abeamer-logo`, it doesn't creates `hello-world` correctly.
  const RELEASE_DEMOS = ['hello-world', 'abeamer-logo'];
  // this line is not solving the problem above.
  const releaseDemosRegEx = RELEASE_DEMOS.length > 1 ?
    `{${RELEASE_DEMOS.join(',')}}` : RELEASE_DEMOS[0];

  const modulesList = fsix.loadJsonSync(DevPaths.MODULES_LIST_FILE) as Shared.ModulesList;
  const libModules = modulesList.libModules;
  const pluginModules = modulesList.pluginModules;

  // ------------------------------------------------------------------------
  //                               Setup Command Line Options WebLinks
  // ------------------------------------------------------------------------

  const joinedArgs = sysProcess.argv.join(' ');
  const isLocal = joinedArgs.indexOf('--local') !== -1;
  const isProduction = joinedArgs.indexOf('--production') !== -1;
  const isWin = sysProcess.platform === 'win32';
  webLinks.setup(isLocal);


  function printOptions(): void {
    console.log(`Options:
    local: ${isLocal}
    production: ${isProduction}
`);

  }
  // ------------------------------------------------------------------------
  //                               Print Usage
  // ------------------------------------------------------------------------

  gulp.task('default', () => {
    console.log(`gulp [task]
  Where task is
    bump-version - builds version files from package.json
      when: before publishing a new version

    clean - executes clean-gallery

    build-release - builds the release files where all the files are compiled and minify
      when: before publishing a new **stable** version and after testing

    build-shared-lib - builds files from the client library to be used by server, tests and cli
      when: every time a module tagged with @module shared or
            constants that are useful for server and cli are modified

    build-docs - builds both the end-user and developer documentation
      when: before publishing a new **stable** version and after testing

    build-docs --local - same as build-docs but uses local links

    build-docs --production - same as build-docs but adds production fields from .mkdocs-template.yml

    build-definition-files - builds definition files for end-user and developer
      when: after any public or shared member of a class is modified

    build-gallery-gifs - builds all the animated gifs for each example in the gallery
      when: before build-gallery-release
      warn: this can be a long operation

    build-gallery-release - builds release version of the gallery
      --local builds using local links
      when: before publishing a new gallery, after build-gallery-gifs

    build-gallery-release --local - same as build-gallery-release but uses local links

    clean-gallery - deletes all the gallery story-frames files and folder
      when: cleaning day!

    clean-gallery-png - deletes all the gallery/story-frames/*.png

    update-gallery-scripts - builds a new version of ${DevPaths.GALLERY_PATH}/*/index.html with script list updated
      when: every time there is a new module on the library or a module change its name
            first must update on the ${DevPaths.CLIENT_PATH}/lib/js/modules.json

    update-test-list - updates test-list.json and package.json with the full list of tests
      when: every time there is a new test or a test change its name

    list-docs-files-as-links - outputs the console the list of document files in markdown link format

    README-to-online - converts all online README.md local links to online links

    README-to-local - converts all online README.md online links to local links

    `);
  });

  // ------------------------------------------------------------------------
  //                               rimrafExcept
  // ------------------------------------------------------------------------

  /**
   * Recursive deletes files and folders except the ones defined in the except list
   * Only the direct children files and folders from the root are allowed
   * to be in except list
   * @param root Root folder
   * @param except list of file
   */
  function rimrafExcept(root: string, except: string[]): void {
    if (!sysFs.existsSync(root)) { return; }

    sysFs.readdirSync(root).forEach(fileBase => {
      if (except.indexOf(fileBase) === -1) {
        const fileName = `${root}/${fileBase}`;
        rimraf.sync(`${fileName}`);
      }
    });
  }

  // ------------------------------------------------------------------------
  //                               updateHtmlPages
  // ------------------------------------------------------------------------

  /**
   * Updates the html links.
   * For release and release-gallery it removes the individual links,
   * and replaces with the compiled version.
   * In other cases, just updates links.
   */
  function updateHtmlPages(srcPath: string, destPath: string,
    newScriptFiles: string[], setReleaseLinks: boolean): NodeJS.ReadWriteStream {

    return gulp.src(srcPath)
      .pipe(gulpReplace(/<body>((?:.|\n)+)<\/body>/, (all, p: string) => {
        const lines = p.split('\n');
        const outLines = [];
        let state = 0;
        lines.forEach(line => {
          if (state < 2) {
            if (line.match(/lib\/js\/[\w\-]+.js"/)) {
              state = 1;
              return;
            } else if (state === 1 && line.trim()) {
              newScriptFiles.forEach(srcFile => {
                outLines.push(`  <script src="${srcFile}.js"></script>`);
              });
              state = 2;
            }
          }
          outLines.push(line);
        });
        return '<body>' + outLines.join('\n') + '</body>';
      }))

      .pipe(gulpReplace(/^(?:.|\n)+$/, (all: string) =>
        setReleaseLinks ? all.replace(/\.\.\/\.\.\/client\/lib/g, 'abeamer') : all,
      ))

      .pipe(gulp.dest(destPath));
  }

  // ------------------------------------------------------------------------
  //                               Clean
  // ------------------------------------------------------------------------

  (gulp as any).task('clean', ['clean-gallery']);

  // ------------------------------------------------------------------------
  //                               Bump Version
  // ------------------------------------------------------------------------

  gulp.task('bump-version', (cb) => {
    const SRC_FILENAME = './package.json';
    const BADGES_FOLDER = './docs/badges/';
    const WARN_MSG = `
  // This file was generated via gulp bump-version
  // It has no uuid
  //
  // @WARN: Don't edit this file. See the ${SRC_FILENAME}
\n`;

    const matches = fsix.readUtf8Sync(SRC_FILENAME).match(/"version": "([\d\.]+)"/);
    if (!matches) {
      throw `Unable to find the ${SRC_FILENAME} version`;
    }

    const version = matches[1];
    const VERSION_OUT = `export const VERSION = "${version}";`;
    console.log(`${SRC_FILENAME} version is ${version}`);

    sysFs.writeFileSync('./shared/version.ts',
      WARN_MSG + VERSION_OUT + '\n');

    sysFs.writeFileSync(`./${DevPaths.JS_PATH}/version.ts`,
      WARN_MSG + `namespace ABeamer {\n  ${VERSION_OUT}\n}\n`);

    const outBadgeFileBase = `v-${version}.gif`;
    const outBadgeFileName = `${BADGES_FOLDER}${outBadgeFileBase}`;
    if (!sysFs.existsSync(outBadgeFileName)) {
      const path = `gallery/animate-badges`;
      const url = `http://localhost:9000/${path}/?var=name%3Dversion&`
        + `var=value%3D${version}&var=wait%3D2s`;
      const config = `./${path}/abeamer.ini`;

      // build animated badges
      const renderCmdLine = `node ./cli/abeamer-cli.js render --dp --url '${url}' --config ${config}`;
      console.log(renderCmdLine);
      fsix.runExternal(renderCmdLine, (error, stdout, stderr) => {
        if (stderr) {
          console.error(stderr);
          console.error('Animated Gif Badge Creation Failed');
          console.log('Check out if the live server is running');
        } else {
          const gifCmdLine = `node ./cli/abeamer-cli.js gif ./${path}/ --loop 8 --gif ${outBadgeFileName}`;
          console.log(gifCmdLine);
          fsix.runExternal(gifCmdLine, (_error, _stdout, _stderr) => {
            if (stderr) {
              console.error(stderr);
              console.error('Animated Gif Badge Creation Failed');
            } else {
              console.log(stdout);
              console.error('Animated Gif Badge Created!');
            }
          });
        }
      });
    }

    let vREADMEData = fsix.readUtf8Sync(`./README.md`);
    vREADMEData = vREADMEData.replace(/v-[\d\.]+\.gif/, outBadgeFileBase);
    sysFs.writeFileSync(`./README.md`, vREADMEData);


    fsix.runExternal('gulp build-shared-lib', () => {
      fsix.runExternal('tsc -p ./', () => {
        console.log('Version bumped');
        cb();
      });
    });
  });

  // ------------------------------------------------------------------------
  //                               Build Release
  // ------------------------------------------------------------------------

  const RELEASE_PATH = 'release/latest';

  gulp.task('rel:clean', (cb) => {
    rimrafExcept(RELEASE_PATH, ['.git']);
    cb();
  });


  gulp.task('rel:client', () => {
    return gulp.src([
      `${DevPaths.CLIENT_PATH}/**`,
      `!${DevPaths.CLIENT_PATH}/**/*.map`,
      `!${DevPaths.JS_PATH}/*`,
      `!${DevPaths.TYPINGS_PATH}/release{,/**}`,
      `!${DevPaths.TYPINGS_PATH}/README.*`,
      `!${DevPaths.TYPINGS_PATH}/vendor/phantomjs{,/**}`,
      `!${DevPaths.TYPINGS_PATH}/vendor/README.*`,
      `!${DevPaths.TYPINGS_PATH}/*-dev.d.ts`,  // dev typings aren't included
      `!${DevPaths.TYPINGS_PATH}/abeamer.d.ts`, // this typing will be processed in other task
      `!${DevPaths.CLIENT_PATH}/**/*[a-z][a-z].ts`,
      `!${DevPaths.CLIENT_PATH}/**/*.scss`,
      `!${DevPaths.MODULES_LIST_FILE}`,
    ])
      .pipe(gulp.dest(`${RELEASE_PATH}/client`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:jquery-typings', () => {
    return gulp.src(`node_modules/@types/jquery/**`)
      .pipe(gulp.dest(`${RELEASE_PATH}/${DevPaths.TYPINGS_PATH}/vendor/jquery`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:client-js-join', () => {

    const singleLibPath = `${DevPaths.SHARED_PATH}/dev-builders/output`;
    const singleLibFile = `${singleLibPath}/abeamer-single.js`;
    BuildSingleLibFile.build(libModules, DevPaths.JS_PATH,
      singleLibPath, singleLibFile, 'gulp `build-release`');

    return gulp
      .src(singleLibFile)
      .pipe(gulpMinify({
        noSource: true,
        ext: {
          min: '.min.js',
        },
      }))
      .pipe(gulpReplace(/^(.)/,
        CLIENT_UUID + COPYRIGHTS + '$1'))
      .pipe(gulpRename('abeamer.min.js'))
      .pipe(gulp.dest(`${RELEASE_PATH}/${DevPaths.JS_PATH}`));
  });


  gulp.task('rel:gallery', () => {
    return gulp.src([
      `${DevPaths.GALLERY_PATH}/${releaseDemosRegEx}/**`,
      `!${DevPaths.GALLERY_PATH}/**/*.html`,
      `!${DevPaths.GALLERY_PATH}/*/out/*`,
    ])
      .pipe(gulp.dest(`${RELEASE_PATH}/gallery`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:root', () => {
    return gulp.src([
      'CHANGELOG.md',
      'LICENSE.txt',
      '.npmignore',
    ])
      .pipe(gulp.dest(RELEASE_PATH))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:README', () => {
    return gulp.src([
      'README.md',
    ])
      .pipe(gulpReplace(/developer-badge\.gif/, 'end-user-badge.gif'))
      .pipe(gulp.dest(RELEASE_PATH))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:gallery-html', () => {
    return mergeStream(
      updateHtmlPages(`${DevPaths.GALLERY_PATH}/${releaseDemosRegEx}/*.html`,
        `${RELEASE_PATH}/gallery`,
        [`../../${DevPaths.JS_PATH}/abeamer.min`],
        true)
        .pipe(gulpPreserveTime()));
  });


  gulp.task('rel:cli-minify', () => {
    return gulp.src('cli/abeamer-cli.js')
      .pipe(gulpMinify({
        noSource: true,
        ext: {
          min: '.js',
        },
      }))
      .pipe(gulpReplace(/("use strict";)/,
        CLI_UUID + COPYRIGHTS + '$1\n'))
      .pipe(gulp.dest(`${RELEASE_PATH}/cli`));
  });


  (gulp as any).task('rel:cli-chmod', ['rel:cli-minify'], (cb) => {
    // this task is done only for testing purposes since
    // `npm publish` doesn't uses the `chmod u+x`.
    const RELEASE_CLI_FILE = `${RELEASE_PATH}/cli/abeamer-cli.js`;
    sysFs.chmodSync(RELEASE_CLI_FILE, 0o744);
    cb();
  });


  gulp.task('rel:shared', () => {
    return mergeStream(['', '/vendor', '/lib'].map((subPath) => {
      return gulp.src([
        `shared${subPath}/*.js`,
        `!shared${subPath}/dev*.js`,
      ])
        .pipe(gulp.dest(`${RELEASE_PATH}/shared${subPath}`));
    }));
  });


  gulp.task('rel:server-minify', () => {
    let res = gulp.src('server/*.js')
      .pipe(gulpMinify({
        noSource: true,
        ext: {
          min: '.js',
        },
      }))
      .pipe(gulpReplace(/("use strict";)/,
        SERVER_UUID + COPYRIGHTS + '$1\n'))
      .pipe(gulp.dest(`${RELEASE_PATH}/server`));
    if (!isWin) {
      res = res.pipe(gulpPreserveTime());
    }
    return res;
  });



  // copies package.json cleaning the unnecessary config
  gulp.task('rel:build-package.json', () => {
    return gulp.src('./package.json')
      .pipe(gulpReplace(/^((?:.|\n)+)$/, (all, p) => {
        const pkg = JSON.parse(p);

        // removes all dependencies
        pkg.devDependencies = {};

        // removes unnecessary scripts
        const scripts = {};
        ['compile', 'watch', 'abeamer', 'serve'].forEach(key => {
          scripts[key] = pkg.scripts[key];
        });
        pkg.scripts = scripts;

        // sets only the repo for the release version.
        // homepage and issue will remain intact
        // pkg.repository.url = pkg.repository.url + '-release';

        return JSON.stringify(pkg, undefined, 2);
      }))
      .pipe(gulp.dest(`${RELEASE_PATH}`))
      .pipe(gulpPreserveTime());
  });


  // copies tsconfig.ts to each demo cleaning the unnecessary config
  gulp.task('rel:build-tsconfig.ts', () => {
    return mergeStream(
      RELEASE_DEMOS.map(demo => {
        return gulp.src('./tsconfig.json')
          .pipe(gulpReplace(/^((?:.|\n)+)$/, (all, p) => {
            const tsconfig = JSON.parse(p);
            tsconfig.exclude = [];
            tsconfig["tslint.exclude"] = undefined;
            return JSON.stringify(tsconfig, undefined, 2);
          }))
          .pipe(gulp.dest(`${RELEASE_PATH}/${DevPaths.GALLERY_PATH}/${demo}`))
          .pipe(gulpPreserveTime());
      }));
  });


  // creates a plugin list from modules-list.json
  // don't use gulp-file in order to preserve the time-date
  gulp.task('rel:build-plugins-list.json', () => {
    return gulp.src(DevPaths.MODULES_LIST_FILE)
      .pipe(gulpReplace(/^((?:.|\n)+)$/, (all, p) => {
        return JSON.stringify(pluginModules, undefined, 2);
      }))
      .pipe(gulpRename('plugins-list.json'))
      .pipe(gulp.dest(`${RELEASE_PATH}/${DevPaths.PLUGINS_PATH}`))
      .pipe(gulpPreserveTime());
  });


  // joins abeamer.d.ts and abeamer-release.d.ts in a single file
  gulp.task('rel:build-abeamer.d.ts', () => {
    return gulp.src(`${DevPaths.TYPINGS_PATH}/abeamer.d.ts`)
      .pipe(gulpReplace(/declare namespace ABeamer \{/, (all) => {
        const releaseDTs = fsix.readUtf8Sync(`${DevPaths.TYPINGS_PATH}/release/abeamer-release.d.ts`);
        return all
          + releaseDTs
            .replace(/^(?:.|\n)*declare namespace ABeamer \{/, '')
            .replace(/}(?:\s|\n)*$/, '');
      }))
      .pipe(gulp.dest(`${RELEASE_PATH}/${DevPaths.TYPINGS_PATH}`))
      .pipe(gulpPreserveTime());
  });


  (gulp as any).task('build-release', ['rel:clean'], gulpSequence(
    'rel:client',
    'rel:gallery',
    'rel:gallery-html',
    'rel:client-js-join',
    'rel:root',
    'rel:README',
    'rel:cli-chmod',
    'rel:shared',
    'rel:server-minify',
    'rel:jquery-typings',
    'rel:build-package.json',
    'rel:build-tsconfig.ts',
    'rel:build-abeamer.d.ts',
    'rel:build-plugins-list.json',
  ));

  // ------------------------------------------------------------------------
  //                               Builds Shared Modules from Client
  // ------------------------------------------------------------------------

  gulp.task('build-shared-lib', () => {
    BuildShared.build(libModules, DevPaths.JS_PATH,
      DevPaths.SHARED_LIB_PATH, 'gulp build-shared-lib');
  });

  // ------------------------------------------------------------------------
  //                               Builds Definition Files
  // ------------------------------------------------------------------------

  gulp.task('build-definition-files', () => {
    BuildDTsFilesABeamer.build(libModules, pluginModules, CLIENT_UUID, COPYRIGHTS);
  });

  // ------------------------------------------------------------------------
  //                               Builds the documentation
  // ------------------------------------------------------------------------

  gulp.task('build-docs', () => {
    printOptions();
    BuildDocs.build(libModules, pluginModules);
  });

  // ------------------------------------------------------------------------
  //                               Builds Release Version Of The Gallery
  // ------------------------------------------------------------------------

  gulp.task('gal-rel:clear', (cb) => {
    rimrafExcept(BuildGalRel.DST_GALLERY_RELEASE_PATH, ['.git']);
    cb();
  });


  (gulp as any).task('gal-rel:get-examples', ['gal-rel:clear'], (cb) => {
    BuildGalRel.populateReleaseExamples();
    cb();
  });


  (gulp as any).task('gal-rel:copy-files', ['gal-rel:get-examples'], () => {
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      const srcList = [`${ex.srcFullPath}/**`,
      `!${ex.srcFullPath}/*.html`,
      `!${ex.srcFullPath}/story.json`,
      `!${ex.srcFullPath}/story-frames/*.png`];
      if (ex.srcFullPath.includes('remote-server')) {
        srcList.push(`!${ex.srcFullPath}/assets{/**,}`);
      }
      return gulp.src(srcList, { dot: true })
        .pipe(gulp.dest(ex.dstFullPath));
    }));
  });


  (gulp as any).task('gal-rel:update-html-files', ['gal-rel:copy-files'], () => {
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      return updateHtmlPages(`${ex.srcFullPath}/*.html`, ex.dstFullPath,
        [`../../${DevPaths.JS_PATH}/abeamer.min`], true);
    }));
  });


  (gulp as any).task('gal-rel:online-html-files', ['gal-rel:update-html-files'], () => {
    const onlineLink = `${webLinks.repos.releaseStatic}client/lib`;
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      return gulp.src([`${ex.dstFullPath}/index.html`])
        .pipe(gulpReplace(/^(?:.|\n)+$/, (all: string) =>
          all
            .replace(/"abeamer\//g, `"${onlineLink}/`)
            .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1')
        ))
        .pipe(gulpRename('index-online.html'))
        .pipe(gulp.dest(ex.dstFullPath))
        .pipe(gulpPreserveTime());
    }));
  });

  (gulp as any).task('gal-rel:create-zip', ['gal-rel:online-html-files'], () => {
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      return gulp.src([
        `${ex.dstFullPath}/**`,
        `${ex.dstFullPath}/.allowed-plugins.json`,
        `!${ex.dstFullPath}/index-online.html`,
        `!${ex.dstFullPath}/*.zip`,
        `!${ex.dstFullPath}/story-frames/*.{json,gif,mp4}`,
      ])
        .pipe(gulpZip(BuildGalRel.EXAMPLE_ZIP_FILE))
        .pipe(gulp.dest(ex.dstFullPath));
    }));
  });


  (gulp as any).task('gal-rel:process-readme', ['gal-rel:create-zip'],
    (cb) => {
      printOptions();
      BuildGalRel.buildReadMe();
      cb();
    });


  (gulp as any).task('build-gallery-release', ['gal-rel:process-readme']);

  // ------------------------------------------------------------------------
  //                               Deletes gallery story-frames folder
  // ------------------------------------------------------------------------

  gulp.task('clean-gallery', (cb) => {
    rimraf.sync(`${DevPaths.GALLERY_PATH}/*/story-frames`);
    cb();
  });

  gulp.task('clean-gallery-png', (cb) => {
    rimraf.sync(`${DevPaths.GALLERY_PATH}/*/story-frames/*.png`);
    cb();
  });

  // ------------------------------------------------------------------------
  //                               Creates gallery examples gif image
  // ------------------------------------------------------------------------

  (gulp as any).task('build-gallery-gifs', ['clean-gallery-png'], (cb) => {
    webLinks.setup(true);
    BuildGalRel.buildGifs();
    cb();
  });

  // ------------------------------------------------------------------------
  //                               Update Gallery Scripts
  // ------------------------------------------------------------------------

  gulp.task('update-gallery-scripts', () => {
    const DEST_PATH = 'gallery-updated';
    rimraf.sync(`${DEST_PATH}/**`);
    const newScriptFiles = libModules.map(srcFile =>
      `../../${DevPaths.JS_PATH}/${srcFile}`);
    return mergeStream(updateHtmlPages(`${DevPaths.GALLERY_PATH}/*/*.html`, DEST_PATH, newScriptFiles, false));
  });

  // ------------------------------------------------------------------------
  //                               Updates Test List
  // ------------------------------------------------------------------------

  gulp.task('update-test-list', () => {
    const tests = [];

    sysFs.readdirSync(`./test/tests`).forEach(file => {
      file.replace(/(test-.*)\.ts/, (m, testName) => {
        tests.push(testName);
        return '';
      });
    });


    interface TestListFile {
      disabled: string[];
      active: string[];
    }

    const TEST_LIST_FILE = `./test/test-list.json`;
    const curTestList: TestListFile = fsix.loadJsonSync(TEST_LIST_FILE);

    tests.forEach(test => {
      if (curTestList.active.indexOf(test) === -1 &&
        curTestList.disabled.indexOf(test) === -1) {
        console.log(`Adding test ${test} to ${TEST_LIST_FILE}`);
        curTestList.active.push(test);
      }
    });
    fsix.writeJsonSync(TEST_LIST_FILE, curTestList);
    console.log(`Updated ${TEST_LIST_FILE}`);

    const PACKAGE_FILE = `./package.json`;
    const pkg: { scripts: { [script: string]: string } } =
      fsix.loadJsonSync(PACKAGE_FILE);
    const scripts = pkg.scripts;

    tests.forEach(test => {
      if (scripts[test] === undefined) {
        console.log(`Adding test ${test} to ${PACKAGE_FILE}`);
        scripts[test] = `mocha test/tests/${test}.js`;
      }
    });

    fsix.writeJsonSync(PACKAGE_FILE, pkg);
    console.log(`Updated ${PACKAGE_FILE}`);
  });

  // ------------------------------------------------------------------------
  //                               Lists ./docs Files As Links
  // ------------------------------------------------------------------------

  gulp.task('list-docs-files-as-links', () => {
    sysFs.readdirSync(`./docs`).forEach(fileBase => {
      if (sysPath.extname(fileBase) !== '.md') { return; }
      const fileTitle = sysPath.parse(fileBase).name;
      const title = fileTitle.replace(/-/g, ' ')
        .replace(/\b(\w)/, (all, firstChar: string) => firstChar.toUpperCase());
      console.log(`- [${title}](${fileBase})`);
    });
  });

  // ------------------------------------------------------------------------
  //                               Lists ./docs Files As Links
  // ------------------------------------------------------------------------

  function changeReadmeLinks(isTargetLocal: boolean): void {
    const IN_FILE = './README.md';
    const BAK_FILE = IN_FILE + '.bak.md';

    let content = fsix.readUtf8Sync(IN_FILE);
    sysFs.writeFileSync(BAK_FILE, content);

    content = content.replace(/http([^ \)]+)/g, (all, p) =>
      webLinks.convertLink(all, isTargetLocal));

    sysFs.writeFileSync(IN_FILE, content);
  }


  gulp.task('README-to-online', () => {
    changeReadmeLinks(false);
  });

  gulp.task('README-to-local', () => {
    changeReadmeLinks(true);
  });
}
