"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysProcess from "process";
import * as gulp from "gulp";
import * as rimraf from "rimraf";
import * as globule from "globule";
import { exec as sysExec } from "child_process";

import { fsix } from "./shared/vendor/fsix.js";
import { BuildDTsFilesABeamer } from "./shared/dev-builders/build-d-ts-abeamer.js";
import { BuildShared } from "./shared/dev-builders/build-shared.js";
import { BuildSingleLibFile } from "./shared/dev-builders/build-single-lib-file.js";
import { BuildDocsLatest } from "./shared/dev-builders/build-docs-latest.js";
import { BuildGalleryLatest as BuildGalRel } from "./shared/dev-builders/build-gallery-latest.js";
import { DevCfg } from "./shared/dev-config.js";

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
  // const PRESERVE_FILES = ['README.md', 'README-dev.md', '.git', '.gitignore'];
  const CLIENT_UUID = '// \n\n';
  const COPYRIGHTS = '' +

    '// ------------------------------------------------------------------------\n' +
    '// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.\n' +
    '// Licensed under the MIT License.\n' +
    '// ------------------------------------------------------------------------\n\n';

  const gulpMinify = require('gulp-minify');
  const gulpReplace = require('gulp-replace');
  // const preprocess = require('gulp-preprocess');
  const gulpPreserveTime = require('gulp-preservetime');
  // const autoprefixer = require('gulp-autoprefixer');
  const gulpRename = require('gulp-rename');
  const gulpZip = require('gulp-zip');
  const gulpSequence = require('gulp-sequence');
  const mergeStream = require('merge-stream');

  const cfg = DevCfg.getConfig(__dirname);
  const modulesList = fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE) as Shared.ModulesList;
  const libModules = modulesList.libModules;
  const pluginModules = modulesList.pluginModules;

  // ------------------------------------------------------------------------
  //                               Print Usage
  // ------------------------------------------------------------------------

  gulp.task('default', () => {
    console.log(`gulp [task]
  Where task is
    bump-version - builds version files from package.json
      when: before publishing a new version

    clean - executes clean-gallery-src

    build-release-latest - builds the release files where all the files are compiled and minify
      when: before publishing a new **stable** version and after testing

    build-shared-lib - builds files from the client library to be used by server, tests and cli
      when: every time a module tagged with @module shared or
            constants that are useful for server and cli are modified

    build-docs-latest - builds both the end-user and developer documentation
      when: before publishing a new **stable** version and after testing

    post-build-docs-latest - changes links for offline testing and adds other improvements

    build-definition-files - builds definition files for end-user and developer
      when: after any public or shared member of a class is modified

    build-gallery-src-gifs - builds all the animated gifs for each example in the gallery
      when: before build-gallery-latest
      warn: this can be a long operation

    build-gallery-latest - builds release version of the gallery
      --local builds using local links
      when: before publishing a new gallery, after build-gallery-src-gifs

    clean-gallery-src - deletes all the ${cfg.paths.GALLERY_SRC_PATH}/story-frames files and folder
      when: cleaning day!

    clean-gallery-src-png - deletes all the ${cfg.paths.GALLERY_SRC_PATH}/story-frames/*.png

    update-gallery-src-scripts - builds a new version of `
      + `${cfg.paths.GALLERY_SRC_PATH}/*/index.html with script list updated
      when: every time there is a new module on the library or a module change its name
            first must update on the ${cfg.paths.CLIENT_PATH}/lib/js/modules.json

    update-test-list - updates test-list.json and package.json with the full list of tests
      when: every time there is a new test or a test change its name

    list-docs-files-as-links - outputs the console the list of document files in markdown link format

    list-paths-macros - lists paths & macros

    README-to-online - converts all online README.md local links to online links

    README-to-local - converts all online README.md online links to local links

    `);
  });


  gulp.task('list-paths-macros', (cb) => {
    console.log(`cfg.paths: ${JSON.stringify(cfg.paths, undefined, 2)}`);
    console.log(`cfg.macros: ${JSON.stringify(cfg.macros, undefined, 2)}`);
    cb();
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
    newScriptFiles: string[], setReleaseLinks: boolean,
    srcOptions?: any): NodeJS.ReadWriteStream {

    return gulp.src(srcPath, srcOptions)
      .pipe(gulpReplace(/<body>((?:.|\n)+)<\/body>/, (_all, p: string) => {
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
                outLines.push(`   <script src="${srcFile}.js"></script>`);
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

  (gulp as any).task('clean', ['clean-gallery-src']);

  // ------------------------------------------------------------------------
  //                               Bump Version
  // ------------------------------------------------------------------------

  gulp.task('bump-version', (cb) => {
    const SRC_FILENAME = './package.json';
    const BADGES_FOLDER = `./${cfg.paths.BADGES_PATH}/`;
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

    sysFs.writeFileSync(`./${cfg.paths.JS_PATH}/version.ts`,
      WARN_MSG + `namespace ABeamer {\n  ${VERSION_OUT}\n}\n`);

    const outBadgeFileBase = `v-${version}.gif`;
    const outBadgeFileName = `${BADGES_FOLDER}${outBadgeFileBase}`;
    if (!sysFs.existsSync(outBadgeFileName)) {
      const path = `${cfg.paths.GALLERY_SRC_PATH}/animate-badges`;
      const url = `http://localhost:9000/${path}/?var=name%3Dversion&`
        + `var=value%3D${version}&var=wait%3D2s`;
      const config = `./${path}/abeamer.ini`;

      // build animated badges
      const renderCmdLine = `node ./cli/abeamer-cli.js render --dp --url '${url}' --config ${config}`;
      console.log(renderCmdLine);
      fsix.runExternal(renderCmdLine, (_error, _stdout, stderr) => {
        if (stderr) {
          console.error(stderr);
          console.error('Animated Gif Badge Creation Failed');
          console.log('Check out if the live server is running');
        } else {
          const gifCmdLine = `node ./cli/abeamer-cli.js gif ./${path}/ --loop 8 --gif ${outBadgeFileName}`;
          console.log(gifCmdLine);
          fsix.runExternal(gifCmdLine, (_error2, stdout2, stderr2) => {
            if (stderr2) {
              console.error(stderr2);
              console.error('Animated Gif Badge Creation Failed');
            } else {
              console.log(stdout2);
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
  //                               Build Single Lib
  // ------------------------------------------------------------------------

  const SINGLE_LIB_MODES = [
    { folder: 'min', suffix: '', isDebug: false, path: '' },
    { folder: 'debug.min', suffix: '-debug', isDebug: true, path: '' },
  ].map(mode => {
    mode.path = `${cfg.paths.SINGLE_LIB_PATH}/${mode.folder}`;
    return mode;
  });


  gulp.task('bs:clean', (cb) => {
    rimrafExcept(cfg.paths.SINGLE_LIB_PATH, []);
    cb();
  });


  gulp.task('bs:copy', () => {
    return mergeStream(SINGLE_LIB_MODES.map(mode =>
      gulp.src([
        './tsconfig.json',
        './client/lib/typings/**',
        '!./client/lib/typings/release/**',
      ], { base: '.' })
        .pipe(gulp.dest(mode.path)),
    ));
  });


  gulp.task('bs:build-single-ts', () => {

    SINGLE_LIB_MODES.forEach(mode => {
      const singleLibFile = `${mode.path}/abeamer${mode.suffix}.ts`;
      BuildSingleLibFile.build(libModules, cfg.paths.JS_PATH,
        `${mode.path}`, singleLibFile,
        'gulp `build-release-latest`', [
          'Story', // story must always be exported
        ], mode.isDebug);
    });
  });



  gulp.task('bs:compile-single-ts', (cb) => {
    let finishCount = SINGLE_LIB_MODES.length;

    SINGLE_LIB_MODES.forEach(mode => {
      sysExec('tsc -p ./', { cwd: mode.path }, () => {
        finishCount--;
        if (!finishCount) {
          cb();
        }
      });
    });
  });


  gulp.task('build-single-lib-internal', gulpSequence(
    'bs:clean',
    'bs:copy',
    'bs:build-single-ts',
    'bs:compile-single-ts',
  ));

  // ------------------------------------------------------------------------
  //                               Build Release
  // ------------------------------------------------------------------------

  gulp.task('rel:clean', (cb) => {
    rimrafExcept(cfg.paths.RELEASE_LATEST_PATH, ['.git']);
    cb();
  });


  gulp.task('rel:client', () => {
    return gulp.src(DevCfg.expandArray(cfg.release.client))
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/client`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:jquery-typings', () => {
    return gulp.src(`node_modules/@types/jquery/**`)
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.TYPINGS_PATH}/vendor/jquery`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:client-js-join', () => {

    return gulp
      .src(`${cfg.paths.SINGLE_LIB_PATH}/*/abeamer*.js`)
      .pipe(gulpMinify({
        noSource: true,
        ext: {
          min: '.min.js',
        },
      }))
      .pipe(gulpRename({ dirname: '' }))
      .pipe(gulpReplace(/^(.)/,
        CLIENT_UUID + COPYRIGHTS + '$1'))
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.JS_PATH}`));
  });


  gulp.task('rel:gallery', () => {
    return gulp.src([
      `${cfg.paths.GALLERY_SRC_PATH}/${cfg.release.demosStr}/**`,
      `!${cfg.paths.GALLERY_SRC_PATH}/**/*.html`,
      `!${cfg.paths.GALLERY_SRC_PATH}/*/story-frames/*`,
    ], { base: cfg.paths.GALLERY_SRC_PATH })
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:root', () => {
    return gulp.src(DevCfg.expandArray(cfg.release.root))
      .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:README', () => {
    return gulp.src([
      'README.md',
    ])
      .pipe(gulpReplace(/developer-badge\.gif/, 'end-user-badge.gif'))
      .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
      .pipe(gulpPreserveTime());
  });


  gulp.task('rel:gallery-html', () => {
    return mergeStream(
      updateHtmlPages(`${cfg.paths.GALLERY_SRC_PATH}/${cfg.release.demosStr}/*.html`,
        `${cfg.paths.RELEASE_LATEST_PATH}/gallery`,
        [`../../${cfg.paths.JS_PATH}/abeamer.min`],
        true, { base: cfg.paths.GALLERY_SRC_PATH })
        .pipe(gulpPreserveTime()));
  });


  gulp.task('rel:minify', () => {
    // not required to preserve timestamp since `rel:add-copyrights` does the job
    return gulp.src(DevCfg.expandArray(cfg.jsFiles), { base: '.' })
      .pipe(gulpMinify({
        noSource: true,
        ext: {
          min: '.js',
        },
      }))
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`));
  });


  gulp.task('rel:add-copyrights', (cb) => {
    globule.find(DevCfg.expandArray(cfg.jsFiles)).forEach(file => {
      const srcFileContent = fsix.readUtf8Sync(file);
      const uuidMatches = srcFileContent.match(/uuid:\s*([\w\-]+)/);
      if (uuidMatches) {
        const dstFileName = `${cfg.paths.RELEASE_LATEST_PATH}/${file}`;
        let content = fsix.readUtf8Sync(dstFileName);
        content = content.replace(/("use strict";)/, (all) =>
          `${all}\n// uuid: ${uuidMatches[1]}\n` + COPYRIGHTS,
        );
        sysFs.writeFileSync(dstFileName, content);
        const stat = sysFs.statSync(file);
        sysFs.utimesSync(dstFileName, stat.atime, stat.mtime);
      }
    });
    cb();
  });


  // copies package.json cleaning the unnecessary config
  gulp.task('rel:build-package.json', () => {
    return gulp.src('./package.json')
      .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
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
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`))
      .pipe(gulpPreserveTime());
  });


  // copies tsconfig.ts to each demo cleaning the unnecessary config
  gulp.task('rel:build-tsconfig.ts', () => {
    return mergeStream(
      cfg.release.demos.map(demo => {
        return gulp.src('./tsconfig.json')
          .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
            const tsconfig = JSON.parse(p);
            tsconfig.exclude = [];
            tsconfig["tslint.exclude"] = undefined;
            return JSON.stringify(tsconfig, undefined, 2);
          }))
          .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery/${demo}`))
          .pipe(gulpPreserveTime());
      }));
  });


  // creates a plugin list from modules-list.json
  // don't use gulp-file in order to preserve the time-date
  gulp.task('rel:build-plugins-list.json', () => {
    return gulp.src(cfg.paths.MODULES_LIST_FILE)
      .pipe(gulpReplace(/^((?:.|\n)+)$/, () => {
        return JSON.stringify(pluginModules, undefined, 2);
      }))
      .pipe(gulpRename('plugins-list.json'))
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.PLUGINS_PATH}`))
      .pipe(gulpPreserveTime());
  });


  // joins abeamer.d.ts and abeamer-release.d.ts in a single file
  gulp.task('rel:build-abeamer.d.ts', () => {
    return gulp.src(`${cfg.paths.TYPINGS_PATH}/abeamer.d.ts`)
      .pipe(gulpReplace(/declare namespace ABeamer \{/, (all) => {
        const releaseDTs = fsix.readUtf8Sync(`${cfg.paths.TYPINGS_PATH}/release/abeamer-release.d.ts`);
        return all
          + releaseDTs
            .replace(/^(?:.|\n)*declare namespace ABeamer \{/, '')
            .replace(/}(?:\s|\n)*$/, '');
      }))
      .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.TYPINGS_PATH}`))
      .pipe(gulpPreserveTime());
  });


  gulp.task('build-release-latest-internal', gulpSequence(
    'build-single-lib-internal',
    'rel:clean',
    'rel:client',
    'rel:gallery',
    'rel:gallery-html',
    'rel:client-js-join',
    'rel:root',
    'rel:README',
    'rel:minify',
    'rel:add-copyrights',
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
    BuildShared.build(libModules, cfg.paths.JS_PATH,
      cfg.paths.SHARED_LIB_PATH, 'gulp build-shared-lib');
  });

  // ------------------------------------------------------------------------
  //                               Builds Definition Files
  // ------------------------------------------------------------------------

  gulp.task('build-definition-files', () => {
    BuildDTsFilesABeamer.build(libModules, pluginModules,
      CLIENT_UUID, COPYRIGHTS, cfg);
  });

  // ------------------------------------------------------------------------
  //                               Builds the documentation
  // ------------------------------------------------------------------------

  gulp.task('build-docs-latest', () => {
    BuildDocsLatest.build(libModules, pluginModules, cfg);
  });


  gulp.task('post-build-docs-latest', () => {

    const wordMap: DevCfg.DevDocsWordMap = {};
    cfg.docs.keywords.forEach(word => { wordMap[word] = { wordClass: 'keyword' }; });
    cfg.docs.jsTypes.forEach(word => { wordMap[word] = { wordClass: 'type' }; });
    cfg.docs.customTypes.forEach(wordPair => {
      wordMap[wordPair[0]] = {
        wordClass: 'type',
        title: wordPair[1],
      };
    });

    BuildDocsLatest.postBuild([
      `{${cfg.paths.DOCS_LATEST_END_USER_PATH},${cfg.paths.DOCS_LATEST_DEVELOPER_PATH}}/en/site{/,/*/}*.html`],
      cfg.docs.replacePaths, wordMap);
  });

  // ------------------------------------------------------------------------
  //                               Builds Release Version Of The Gallery
  // ------------------------------------------------------------------------

  gulp.task('gal-rel:clear', (cb) => {
    rimrafExcept(cfg.paths.GALLERY_LATEST_PATH, ['.git']);
    cb();
  });


  gulp.task('gal-rel:get-examples', (cb) => {
    BuildGalRel.populateReleaseExamples(cfg);
    cb();
  });


  gulp.task('gal-rel:copy-files', () => {
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      const srcList = [`${ex.srcFullPath}/**`,
      `!${ex.srcFullPath}/{*.html,story.json,story-frames/*.png}`];
      if (ex.srcFullPath.includes('remote-server')) {
        srcList.push(`!${ex.srcFullPath}/assets{/**,}`);
      }
      return gulp.src(srcList, { dot: true })
        .pipe(gulp.dest(ex.dstFullPath));
    }));
  });


  gulp.task('gal-rel:update-html-files', () => {
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      return updateHtmlPages(`${ex.srcFullPath}/*.html`, ex.dstFullPath,
        [`../../${cfg.paths.JS_PATH}/abeamer.min`], true);
    }));
  });


  gulp.task('gal-rel:online-html-files', () => {
    const onlineLink = `${cfg.webLinks.webDomain}/${cfg.paths.RELEASE_LATEST_PATH}/client/lib`;
    return mergeStream(BuildGalRel.releaseExamples.map(ex => {
      return gulp.src([`${ex.dstFullPath}/index.html`])
        .pipe(gulpReplace(/^(?:.|\n)+$/, (all: string) =>
          all
            .replace(/"abeamer\//g, `"${onlineLink}/`)
            .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1'),
        ))
        .pipe(gulpRename('index-online.html'))
        .pipe(gulp.dest(ex.dstFullPath))
        .pipe(gulpPreserveTime());
    }));
  });


  gulp.task('gal-rel:create-zip', () => {
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


  gulp.task('gal-rel:process-readme', (cb) => {
    BuildGalRel.buildReadMe(cfg);
    cb();
  });


  (gulp as any).task('build-gallery-latest', gulpSequence(
    'gal-rel:clear',
    'gal-rel:get-examples',
    'gal-rel:copy-files',
    'gal-rel:update-html-files',
    'gal-rel:online-html-files',
    'gal-rel:create-zip',
    'gal-rel:process-readme',
  ));

  // ------------------------------------------------------------------------
  //                               Deletes gallery story-frames folder
  // ------------------------------------------------------------------------

  gulp.task('clean-gallery-src', (cb) => {
    rimraf.sync(`${cfg.paths.GALLERY_SRC_PATH}/*/story-frames`);
    cb();
  });

  gulp.task('clean-gallery-src-png', (cb) => {
    rimraf.sync(`${cfg.paths.GALLERY_SRC_PATH}/*/story-frames/*.png`);
    cb();
  });

  // ------------------------------------------------------------------------
  //                               Creates gallery examples gif image
  // ------------------------------------------------------------------------

  (gulp as any).task('build-gallery-src-gifs', ['clean-gallery-src-png'], (cb) => {
    BuildGalRel.buildGifs(cfg);
    cb();
  });

  // ------------------------------------------------------------------------
  //                               Update Gallery Scripts
  // ------------------------------------------------------------------------

  gulp.task('update-gallery-src-scripts', () => {
    const DST_PATH = `${cfg.paths.GALLERY_SRC_PATH}-updated`;
    rimraf.sync(`${DST_PATH}/**`);
    const newScriptFiles = libModules.map(srcFile =>
      `../../${cfg.paths.JS_PATH}/${srcFile}`);
    return mergeStream(updateHtmlPages(`${cfg.paths.GALLERY_SRC_PATH}/*/*.html`, DST_PATH, newScriptFiles, false));
  });

  // ------------------------------------------------------------------------
  //                               Updates Test List
  // ------------------------------------------------------------------------

  gulp.task('update-test-list', () => {
    const tests = [];

    sysFs.readdirSync(`./test/tests`).forEach(file => {
      file.replace(/(test-.*)\.ts/, (_all, testName) => {
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

  gulp.task('list-docs-files-as-links', (cb) => {
    sysFs.readdirSync(`./docs`).forEach(fileBase => {
      if (sysPath.extname(fileBase) !== '.md') { return; }
      const fileTitle = sysPath.parse(fileBase).name;
      const title = fileTitle.replace(/-/g, ' ')
        .replace(/\b(\w)/, (_all, firstChar: string) => firstChar.toUpperCase());
      console.log(`- [${title}](${fileBase})`);
    });
    cb();
  });

  // ------------------------------------------------------------------------
  //                               Lists ./docs Files As Links
  // ------------------------------------------------------------------------

  function changeReadmeLinks(toLocal: boolean): void {
    const IN_FILE = './README.md';
    const BAK_FILE = IN_FILE + '.bak.md';
    const srcRegEx = new RegExp('\\]\\(' + (toLocal ? cfg.webLinks.webDomain : '') + '/', 'g');
    const dstLink = '](' + (toLocal ? '' : cfg.webLinks.webDomain) + '/';

    let content = fsix.readUtf8Sync(IN_FILE);
    sysFs.writeFileSync(BAK_FILE, content);
    content = content.replace(srcRegEx, dstLink);
    sysFs.writeFileSync(IN_FILE, content);
  }


  gulp.task('README-to-online', () => {
    changeReadmeLinks(false);
  });

  gulp.task('README-to-local', () => {
    changeReadmeLinks(true);
  });
}
