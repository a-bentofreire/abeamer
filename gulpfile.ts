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
const { series, parallel } = require('gulp');
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

// const __dirname = sysPath.resolve(sysPath.dirname((__filename)));
sysProcess.chdir(__dirname);

/** List of files and folders to typical preserve on `rm -rf` */
// const PRESERVE_FILES = ['README.md', 'README-dev.md', '.git', '.gitignore'];
const COPYRIGHTS = `
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
`;

const gulpMinify = require('gulp-minify');
const gulpReplace = require('gulp-replace');
const gulpPreserveTime = require('gulp-preservetime');
const gulpRename = require('gulp-rename');
const gulpConcat = require('gulp-concat');
// const gulpZip = require('gulp-zip');

const cfg = DevCfg.getConfig(__dirname);
const modulesList = fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE) as Shared.ModulesList;
const libModules = modulesList.libModules;
const pluginModules = modulesList.pluginModules;
const exampleNames = sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH)
    .filter(file => file.startsWith('animate'));
const exampleArray = [...Array(exampleNames.length)];

// ------------------------------------------------------------------------
//                               Print Usage
// ------------------------------------------------------------------------

exports.default = function (cb) {
    console.log(`gulp [task]
  Where task is
    bump_version - builds version files from package.json
      when: before publishing a new version

    clean - executes clean-gallery-src

    build_release_latest - builds the release files where all the files are compiled and minify
      when: before publishing a new **stable** version and after testing

    build_shared_lib - builds files from the client library to be used by server, tests and cli
      when: every time a module tagged with @module shared or
            constants that are useful for server and cli are modified

    build_docs_latest - builds both the end-user and developer documentation
      when: before publishing a new **stable** version and after testing

    post_build_docs_latest - changes links for offline testing and adds other improvements

    build_definition_files - builds definition files for end-user and developer
      when: after any public or shared member of a class is modified

    build_gallery_src_gifs - builds all the animated gifs for each example in the gallery
      when: before build-gallery-latest
      warn: this can be a long operation

    build_gallery_latest - builds release version of the gallery
      --local builds using local links
      when: before publishing a new gallery, after build-gallery-src-gifs

    clean_gallery_src - deletes all the ${cfg.paths.GALLERY_SRC_PATH}/story-frames files and folder
      when: cleaning day!

    clean_gallery_src_png - deletes all the ${cfg.paths.GALLERY_SRC_PATH}/story-frames/*.png

    update_gallery_src_scripts - builds a new version of `
        + `${cfg.paths.GALLERY_SRC_PATH}/*/index.html with script list updated
      when: every time there is a new module on the library or a module change its name
            first must update on the ${cfg.paths.CLIENT_PATH}/lib/js/modules.json

    update_test_list - updates test-list.json and package.json with the full list of tests
      when: every time there is a new test or a test change its name

    list_docs_files_as_links - outputs the console the list of document files in markdown link format

    list_paths_macros - lists paths & macros

    README_to_online - converts all online README.md local links to online links

    README_to_local - converts all online README.md online links to local links

    `);
    cb();
}


exports.list_paths_macros = function (cb) {
    console.log(`cfg.paths: ${JSON.stringify(cfg.paths, undefined, 2)}`);
    console.log(`cfg.macros: ${JSON.stringify(cfg.macros, undefined, 2)}`);
    cb();
}

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

exports.clean = exports.clean_gallery_src;

// ------------------------------------------------------------------------
//                               Bump Version
// ------------------------------------------------------------------------

exports.bump_version = function (cb) {
    const SRC_FILENAME = './package.json';
    const WARN_MSG = `
  // This file was generated via npx gulp bump_version
  // @WARN: Don't edit this file. See the ${SRC_FILENAME}
\n`;
    const [_, version] = fsix.readUtf8Sync(SRC_FILENAME).match(/"version": "([\d\.]+)"/) || ['', ''];
    if (!version) {
        throw `Unable to find the ${SRC_FILENAME} version`;
    }
    const VERSION_OUT = `export const VERSION = "${version}";`;
    console.log(`${SRC_FILENAME} version is ${version}`);
    sysFs.writeFileSync('./shared/version.ts', WARN_MSG + VERSION_OUT + '\n');
    sysFs.writeFileSync(`./${cfg.paths.JS_PATH}/version.ts`,
        WARN_MSG + `namespace ABeamer {\n  ${VERSION_OUT}\n}\n`);

    fsix.runExternal('npx gulp build_shared_lib', () => {
        fsix.runExternal('npm run compile', () => {
            console.log('Version bumped');
            cb();
        });
    });
}

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

const bs_clean = function (cb) {
    rimrafExcept(cfg.paths.SINGLE_LIB_PATH, []);
    cb();
}

const bs_copy = function (mode) {
    return function copy() {
        return gulp.src([
            './tsconfig.json',
            './client/lib/typings/**',
            '!./client/lib/typings/release/**',
        ], { base: '.' }).pipe(gulp.dest(mode.path))
    }
}

const bs_build_single_ts = function (mode) {
    return function build_single_ts(cb) {
        BuildSingleLibFile.build(libModules, cfg.paths.JS_PATH,
            `${mode.path}`, `${mode.path}/abeamer${mode.suffix}.ts`,
            'npx gulp build_release_latest', [
            exports.Story, // story must always be exported
        ], mode.isDebug);
        cb();
    }
}

const bs_compile_single_ts = function (mode) {
    return function compile_single_ts(cb) {
        sysExec('tsc -p ./', { cwd: mode.path }, () => { cb() });
        // sysExec(`npx esbuild --format=cjs --sourcemap --outdir=${mode.path} ${mode.path}/**/*.ts`, {}, () => { cb() });
    }
}


const build_single_lib_internal = series(
    bs_clean,
    parallel(...SINGLE_LIB_MODES.map(mode => series(bs_copy(mode), bs_build_single_ts(mode),
        bs_compile_single_ts(mode))))
);

// ------------------------------------------------------------------------
//                               Build Release
// ------------------------------------------------------------------------

const rel_clean = function (cb) {
    rimrafExcept(cfg.paths.RELEASE_LATEST_PATH, ['.git']);
    cb();
}

const rel_client = function () {
    return gulp.src(DevCfg.expandArray(cfg.release.client))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/client`))
        .pipe(gulpPreserveTime());
}

// jquery_typings is over 300k. no longer being deployed 
const rel_jquery_typings = function () {
    return gulp.src(`node_modules/@types/jquery/**`)
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.TYPINGS_PATH}/vendor/jquery`))
        .pipe(gulpPreserveTime());
}

const rel_client_js_join = function () {
    return gulp.src(`${cfg.paths.SINGLE_LIB_PATH}/*/abeamer*.js`)
        .pipe(gulpMinify({ noSource: true, ext: { min: '.min.js' } }))
        .pipe(gulpRename({ dirname: '' }))
        .pipe(gulpReplace(/^(.)/, COPYRIGHTS + '$1'))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.JS_PATH}`));
}

const rel_gallery = function () {
    return gulp.src([
        `${cfg.paths.GALLERY_SRC_PATH}/${cfg.release.demosStr}/**`,
        `!${cfg.paths.GALLERY_SRC_PATH}/*/story-frames/*`,
    ], { base: cfg.paths.GALLERY_SRC_PATH })
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery`))
        .pipe(gulpPreserveTime());
}

const rel_root = function () {
    return gulp.src(DevCfg.expandArray(cfg.release.root))
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
}

const rel_README = function () {
    return gulp.src(['README.md'])
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
}

const rel_minify = function () {
    // not required to preserve timestamp since `rel_add_copyrights` does the job
    return gulp.src(DevCfg.expandArray(cfg.jsFiles), { base: '.' })
        .pipe(gulpMinify({
            noSource: true, ext: { min: '.js' },
            ignoreFiles: ['abeamer-cli.js']
        }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`));
}

const rel_minify_cli = function () {
    // there is a bug on recent version of gulp-minify that has issues with mangle the cli file
    return gulp.src(DevCfg.expandArray(['cli/*.js']), { base: '.' })
        .pipe(gulpMinify({ noSource: true, mangle: false, ext: { min: '.js' } }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`));
}

const rel_add_copyrights = function (cb) {
    globule.find(DevCfg.expandArray(cfg.jsFiles)).forEach(file => {
        const dstFileName = `${cfg.paths.RELEASE_LATEST_PATH}/${file}`;
        if (sysFs.existsSync(file) && sysFs.existsSync(dstFileName)) {
            let content = fsix.readUtf8Sync(dstFileName);
            content = content.replace(/("use strict";)/, (all) => `${all}\n` + COPYRIGHTS);
            sysFs.writeFileSync(dstFileName, content);
            const stat = sysFs.statSync(file);
            sysFs.utimesSync(dstFileName, stat.atime, stat.mtime);
        }
    });
    cb();
}

// copies package.json cleaning the unnecessary config
const rel_build_package_json = function (cb) {
    return gulp.src('./package.json')
        .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
            const pkg = JSON.parse(p);

            // removes all dependencies
            pkg.devDependencies = {};

            // removes unnecessary scripts
            const scripts = {};
            [exports.compile, exports.watch, exports.abeamer, exports.serve].forEach(key => {
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
}

// copies tsconfig.ts to each demo cleaning the unnecessary config
const rel_build_tsconfig_ts = function (demo) {
    return function build_tsconfig_ts(cb) {
        return gulp.src('./tsconfig.json')
            .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
                const tsconfig = JSON.parse(p);
                tsconfig.exclude = [];
                tsconfig["tslint.exclude"] = undefined;
                return JSON.stringify(tsconfig, undefined, 2);
            }))
            .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery/${demo}`))
            .pipe(gulpPreserveTime());
    }
}

// creates a plugin list from modules-list.json
// don't use gulp-file in order to preserve the time-date
const rel_build_plugins_list_json = function (cb) {
    return gulp.src(cfg.paths.MODULES_LIST_FILE)
        .pipe(gulpReplace(/^((?:.|\n)+)$/, () => {
            return JSON.stringify(pluginModules, undefined, 2);
        }))
        .pipe(gulpRename('plugins-list.json'))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.PLUGINS_PATH}`))
        .pipe(gulpPreserveTime());
    cb();
}

// joins abeamer.d.ts and abeamer-release.d.ts in a single file
const rel_build_abeamer_d_ts = function (cb) {
    return gulp.src(`${cfg.paths.TYPINGS_PATH}/abeamer.d.ts`)
        .pipe(gulpReplace(/declare namespace ABeamer \{/, (all) => {
            const releaseDTs = fsix.readUtf8Sync(`${cfg.paths.TYPINGS_PATH}/release/abeamer-release.d.ts`);
            return all + releaseDTs
                .replace(/^(?:.|\n)*declare namespace ABeamer \{/, '').replace(/}(?:\s|\n)*$/, '');
        }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.TYPINGS_PATH}`))
        .pipe(gulpPreserveTime());
    cb();
}

const rel_gen_bundle_en = function () {
    const JS_PATH = `${cfg.paths.RELEASE_LATEST_PATH}/client/lib/js`;
    return gulp.src([`${JS_PATH}/vendor/jquery-easing/jquery.easing.min.js`,
    `${JS_PATH}/../messages/messages-en.js`, `${JS_PATH}/abeamer.min.js`])
        .pipe(gulpConcat('abeamer-bundle-en.min.js'))
        .pipe(gulp.dest(JS_PATH));
}

exports.build_release_latest = series(
    build_single_lib_internal,
    rel_clean,
    rel_client,
    rel_gallery,
    rel_client_js_join,
    rel_root,
    rel_README,
    rel_minify,
    rel_minify_cli,
    rel_add_copyrights,
    rel_build_package_json,
    series(...cfg.release.demos.map(demo => rel_build_tsconfig_ts(demo))),
    rel_build_abeamer_d_ts,
    rel_build_plugins_list_json,
    rel_gen_bundle_en
);

// ------------------------------------------------------------------------
//                               Builds Shared Modules from Client
// ------------------------------------------------------------------------

exports.build_shared_lib = function (cb) {
    BuildShared.build(libModules, cfg.paths.JS_PATH, cfg.paths.SHARED_LIB_PATH, 'npx gulp build_shared_lib');
    cb();
}

// ------------------------------------------------------------------------
//                               Builds Definition Files
// ------------------------------------------------------------------------

exports.build_definition_files = function (cb) {
    BuildDTsFilesABeamer.build(libModules, pluginModules, '', COPYRIGHTS, cfg);
    cb();
}

// ------------------------------------------------------------------------
//                               Builds the documentation
// ------------------------------------------------------------------------

exports.build_docs_latest = function (cb) {
    BuildDocsLatest.build(libModules, pluginModules, cfg);
    cb();
}

exports.post_build_docs_latest = function (cb) {

    const wordMap: DevCfg.DevDocsWordMap = {};
    cfg.docs.keywords.forEach(word => { wordMap[word] = { wordClass: exports.keyword }; });
    cfg.docs.jsTypes.forEach(word => { wordMap[word] = { wordClass: exports.type }; });
    cfg.docs.customTypes.forEach(wordPair => {
        wordMap[wordPair[0]] = {
            wordClass: exports.type,
            title: wordPair[1],
        };
    });

    BuildDocsLatest.postBuild([
        `{ ${cfg.paths.DOCS_LATEST_END_USER_PATH}, ${cfg.paths.DOCS_LATEST_DEVELOPER_PATH}} / en / site{/,/ */}*.html`],
        cfg.docs.replacePaths, wordMap);
    cb();
}

// ------------------------------------------------------------------------
//                               Builds Release Version Of The Gallery
// ------------------------------------------------------------------------

function gal_rel_clear(cb) {
    rimrafExcept(cfg.paths.GALLERY_LATEST_PATH, ['.git']);
    cb();
}

function gal_rel_get_examples(cb) {
    BuildGalRel.populateReleaseExamples(cfg);
    cb();
}

function gal_rel_copy_files(index) {
    return function rel_copy_files(cb) {
        const ex = BuildGalRel.releaseExamples[index];
        const srcList = [`${ex.srcFullPath}/**`,
        `!${ex.srcFullPath}/{*.html,story.json,story-frames/*.png}`];
        if (ex.srcFullPath.includes('remote-server')) {
            srcList.push(`!${ex.srcFullPath}/assets{/**,}`);
        }
        return gulp.src(srcList, { dot: true })
            .pipe(gulp.dest(ex.dstFullPath));
    }
}

function gal_rel_update_html_files(index) {
    return function rel_update_html_files(cb) {
        const ex = BuildGalRel.releaseExamples[index];
        return updateHtmlPages(`${ex.srcFullPath}/*.html`, ex.dstFullPath,
            [`../../${cfg.paths.JS_PATH}/abeamer.min`], true);
    }
}

function gal_rel_online_html_files(index) {
    const onlineLink = `${cfg.webLinks.webDomain}/${cfg.paths.RELEASE_LATEST_PATH}/client/lib`;
    return function rel_online_html_files(cb) {
        const ex = BuildGalRel.releaseExamples[index];
        return gulp.src([`${ex.dstFullPath}/index.html`])
            .pipe(gulpReplace(/^(?:.|\n)+$/, (all: string) =>
                all
                    .replace(/"abeamer\//g, `"${onlineLink}/`)
                    .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1'),
            ))
            .pipe(gulpRename('index-online.html'))
            .pipe(gulp.dest(ex.dstFullPath))
            .pipe(gulpPreserveTime());
    }
}


function gal_rel_create_zip(index) {
    return function rel_create_zip(cb) {
        const ex = BuildGalRel.releaseExamples[index];
        cb();
        // return gulp.src([
        //     `${ex.dstFullPath}/**`,
        //     `${ex.dstFullPath}/.allowed-plugins.json`,
        //     `!${ex.dstFullPath}/index-online.html`,
        //     `!${ex.dstFullPath}/*.zip`,
        //     `!${ex.dstFullPath}/story-frames/*.{json,gif,mp4}`,
        // ])
        //     .pipe(gulpZip(BuildGalRel.EXAMPLE_ZIP_FILE))
        //     .pipe(gulp.dest(ex.dstFullPath));
    }
}


exports.build_gallery_latest = series(
    gal_rel_clear,
    gal_rel_get_examples,
    parallel(...exampleArray.map((_, index) => series(gal_rel_copy_files(index),
        gal_rel_update_html_files(index), gal_rel_online_html_files(index), gal_rel_create_zip(index))),
        function gal_rel_process_readme(cb) {
            BuildGalRel.buildReadMe(cfg);
            cb();
        },
    ));

// ------------------------------------------------------------------------
//                               Deletes gallery story-frames folder
// ------------------------------------------------------------------------

exports.clean_gallery_src = function (cb) {
    rimraf.sync(`${cfg.paths.GALLERY_SRC_PATH}/*/story - frames`);
    cb();
}

exports.clean_gallery_src_png = function (cb) {
    rimraf.sync(`${cfg.paths.GALLERY_SRC_PATH}/*/story-frames/*.png`);
    cb();
}

// ------------------------------------------------------------------------
//                               Creates gallery examples gif image
// ------------------------------------------------------------------------

exports.build_gallery_src_gifs = series(exports.clean_gallery_src_png, function (cb) {
    BuildGalRel.buildGifs(cfg);
    cb();
});

// ------------------------------------------------------------------------
//                               Update Gallery Scripts
// ------------------------------------------------------------------------

exports.update_gallery_src_scripts = function () {
    const DST_PATH = `${cfg.paths.GALLERY_SRC_PATH}-updated`;
    rimraf.sync(`${DST_PATH}/**`);
    const newScriptFiles = libModules.map(srcFile => `../../${cfg.paths.JS_PATH}/${srcFile}`);
    return updateHtmlPages(`${cfg.paths.GALLERY_SRC_PATH}/*/*.html`, DST_PATH, newScriptFiles, false);
}

// ------------------------------------------------------------------------
//                               Updates Test List
// ------------------------------------------------------------------------

exports.update_test_list = function (cb) {
    const tests = [];

    sysFs.readdirSync(`./ test / tests`).forEach(file => {
        file.replace(/(test-.*)\.ts/, (_all, testName) => {
            tests.push(testName);
            return '';
        });
    });


    interface TestListFile {
        disabled: string[];
        active: string[];
    }

    const TEST_LIST_FILE = `./ test / test - list.json`;
    const curTestList: TestListFile = fsix.loadJsonSync(TEST_LIST_FILE);

    tests.forEach(test => {
        if (curTestList.active.indexOf(test) === -1 &&
            curTestList.disabled.indexOf(test) === -1) {
            console.log(`Adding test ${test} to ${TEST_LIST_FILE} `);
            curTestList.active.push(test);
        }
    });
    fsix.writeJsonSync(TEST_LIST_FILE, curTestList);
    console.log(`Updated ${TEST_LIST_FILE} `);

    const PACKAGE_FILE = `./ package.json`;
    const pkg: { scripts: { [script: string]: string } } = fsix.loadJsonSync(PACKAGE_FILE);
    const scripts = pkg.scripts;

    tests.forEach(test => {
        if (scripts[test] === undefined) {
            console.log(`Adding test ${test} to ${PACKAGE_FILE} `);
            scripts[test] = `mocha test / tests / ${test}.js`;
        }
    });

    fsix.writeJsonSync(PACKAGE_FILE, pkg);
    console.log(`Updated ${PACKAGE_FILE} `);
    cb();
}

// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------

exports.list_docs_files_as_links = function (cb) {
    sysFs.readdirSync(`./ docs`).forEach(fileBase => {
        if (sysPath.extname(fileBase) !== '.md') { return; }
        const title = sysPath.parse(fileBase).name.replace(/-/g, ' ')
            .replace(/\b(\w)/, (_all, firstChar: string) => firstChar.toUpperCase());
        console.log(`- [${title}](${fileBase})`);
    });
    cb();
}

// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------

function changeReadmeLinks(toLocal: boolean, cb): void {
    const IN_FILE = './README.md';
    const BAK_FILE = IN_FILE + '.bak.md';
    const srcRegEx = new RegExp('\\]\\(' + (toLocal ? cfg.webLinks.webDomain : '') + '/', exports.g);
    const dstLink = '](' + (toLocal ? '' : cfg.webLinks.webDomain) + '/';

    let content = fsix.readUtf8Sync(IN_FILE);
    sysFs.writeFileSync(BAK_FILE, content);
    content = content.replace(srcRegEx, dstLink);
    sysFs.writeFileSync(IN_FILE, content);
    cb();
}

exports.README_to_online = function (cb) { changeReadmeLinks(false, cb); };
exports.README_to_local = function (cb) { changeReadmeLinks(true, cb); };
