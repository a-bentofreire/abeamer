"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDocsLatest = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
const globule = require("globule");
const yaml = require("js-yaml");
const sysFs = require("fs");
const sysPath = require("path");
const fsix_js_1 = require("../vendor/fsix.js");
const versionLib = require("../version.js");
/** @module developer | This module won't be part of release version */
/**
 * ## Description
 *
 * Builds documentation files from the code.
 *
 * usage: `gulp build-docs-latest`
 *
 * Uses the following grammar:
 *
 * ```
 * // @module <type> | <description text>
 * <empty line>
 * /**
 *  * <documentation-line-1>
 *  * ...
 *  * <documentation-line-n>
 *  *<end slash>
 * ```
 *
 * If a line ends with any of the following signs `\.\`":` and is followed by another line starting with a character,
 * it automatically adds 2 spaces at the line ending.
 *
 */
var BuildDocsLatest;
(function (BuildDocsLatest) {
    const EMPTY = ['', '', '', '', '', '', '', '', '', ''];
    const MARKDOWN_FOLDER = 'docs';
    BuildDocsLatest.API_FOLDER = 'api';
    BuildDocsLatest.EN_LAST_VERSION_PATH = 'en';
    let badgeLine = '';
    BuildDocsLatest.getTargets = (cfg) => [
        {
            id: 'end-user',
            name: 'End User',
            dstPath: cfg.paths.DOCS_LATEST_END_USER_PATH,
            sourcePaths: [cfg.paths.DOCS_SOURCE_PATH],
            moduleTypes: ['end-user'],
            indexFile: './README.md',
            isEndUser: true,
            logFile: './build-docs-latest-end-user.log',
            processIndexPage: (data) => {
                return data
                    .replace(/^(.*)developer-badge\.gif(.*)$/m, (all, p1, p2) => {
                    badgeLine = all;
                    return p1 + 'end-user-badge.gif' + p2;
                })
                    .replace(new RegExp(`${cfg.webLinks.webDomain}/`, 'g'), '/');
            },
        },
        {
            id: 'dev',
            name: 'Developer',
            dstPath: cfg.paths.DOCS_LATEST_DEVELOPER_PATH,
            sourcePaths: [cfg.paths.DOCS_SOURCE_PATH, cfg.paths.DOCS_SOURCE_DEV_PATH],
            moduleTypes: ['end-user', 'developer', 'internal'],
            indexFile: `${cfg.paths.DOCS_SOURCE_PATH}-dev/README.md`,
            isEndUser: false,
            logFile: './build-docs-latest-dev.log',
            processIndexPage: (data) => {
                return data.replace(/^(# Description.*)$/m, (all) => {
                    if (!badgeLine) {
                        throw `end-user should had been processed already.`;
                    }
                    return all + '\n' + badgeLine + '  \n';
                });
            },
        },
    ];
    // ------------------------------------------------------------------------
    //                               ReferenceBuilder
    // ------------------------------------------------------------------------
    /** Converts a text to a Markdown reference */
    function textToRef(text) {
        return text.toLowerCase().replace(/ /g, '-').replace(/[^_a-z\-]/g, '');
    }
    /**
     * Processes all output Markdown files, by scanning all the local links and
     * filling the missing details.
     */
    class ReferenceBuilder {
        constructor(log) {
            this.log = log;
            this.refs = {};
        }
        /** Stage 0. Generate references from the filename and headers */
        buildRefs(fileBase, content) {
            this.refs[textToRef(fileBase)] = `${fileBase}.md`;
            content.replace(/^#+\s*(.+)\s*$/mg, (all, text) => {
                const ref = textToRef(text);
                const fullRef = `${fileBase}.md#${ref}`;
                this.refs[ref] = fullRef;
                this.refs[fullRef] = fullRef;
                this.refs[`${fileBase}#${ref}`] = fullRef;
                return all;
            });
        }
        /** Processes the links from Markdown content, updating its content */
        updateLinks(fileBase, content) {
            return content.replace(/\[([^\]]*)\]\(([\w\-\s]*)(?:#([\w\-\s]*))?\)/g, (_app, info, link, bookmark) => {
                bookmark = bookmark || '';
                link = link || '';
                if (!info) {
                    info = bookmark || link;
                }
                const refBookmark = textToRef(bookmark || '');
                const refLink = textToRef(link || fileBase);
                let tracedLink;
                if (refBookmark) {
                    tracedLink = this.refs[refLink + '#' + refBookmark] ||
                        this.refs[refBookmark];
                }
                else {
                    tracedLink = this.refs[refLink];
                }
                if (!tracedLink) {
                    this.log.notFound.push(`${link}#${bookmark} in ${fileBase}`);
                }
                else {
                    this.log.found.push(`${link}#${bookmark} in ${fileBase} = ${tracedLink}`);
                    [link, bookmark] = tracedLink.split('#');
                }
                return `[${info}](${link}${bookmark ? '#' + bookmark : ''})`;
            });
        }
        /** Main entry point. Reads the files and calls appropriate action. */
        build(path) {
            const fileBases = sysFs.readdirSync(path)
                .filter(file => file.endsWith('.md')).map(file => file.replace(/\.md$/, ''));
            [0, 1].forEach(stage => {
                fileBases.forEach(fileBase => {
                    const fileName = `${path}/${fileBase}.md`;
                    const content = fsix_js_1.fsix.readUtf8Sync(fileName);
                    if (stage === 0) {
                        this.buildRefs(fileBase, content);
                    }
                    else {
                        sysFs.writeFileSync(fileName, this.updateLinks(fileBase, content));
                    }
                });
            });
            this.log.refs = this.refs;
        }
    }
    /* enum ModuleType {
      unknown,
      developer,
      internal,
      shared,
      'end-user',
    } */
    const BadgeNameOfDocIdType = [
        "enum",
        "type",
        "const",
        "function",
        "interface",
        "class",
        "method",
        "property",
        "getter",
        "setter",
        "constructor",
    ];
    const IdTypeAreFunctions = [3 /* DocIdType.FunctionName */, 6 /* DocIdType.MethodName */];
    const IdTypeAreSections = [
        0 /* DocIdType.EnumName */, 2 /* DocIdType.ConstName */, 1 /* DocIdType.TypeName */,
        4 /* DocIdType.InterfaceName */,
        5 /* DocIdType.ClassName */, 3 /* DocIdType.FunctionName */,
    ];
    class DocParser {
        constructor(localWebLinks, isEndUser) {
            this.localWebLinks = localWebLinks;
            this.isEndUser = isEndUser;
            this.outLines = [];
            this.inpLines = [];
            this.jsDocs = [];
            // private isReadOnly: boolean = false;
            this.isInsideClassOrInterface = false;
            this.classOrInterfaceName = '';
            this.disabledClassOrInterface = false;
            this.isInterface = false;
            this.links = [];
            this.lastJsDocsLineNr = 0;
            this.lastPeekLineNr = 0;
            this.isFinished = () => this.inpLineNr >= this.inpLineCount;
        }
        getLine(peekOnly = false) {
            const res = this.inpLines[this.inpLineNr] || '';
            if (!peekOnly) {
                this.inpLineNr++;
            }
            else {
                this.lastPeekLineNr = this.inpLineNr;
            }
            return res;
        }
        _processDefContent(line, scanForComma) {
            line = line.trim();
            const line1 = line;
            let securityLineCount = 0;
            do {
                if (securityLineCount > 150) {
                    console.log(`too many lines ${scanForComma ? 'YES' : 'NO'}:\n${line1}\n${line}`);
                    return 'ERROR';
                }
                const matches = line.match(scanForComma ?
                    /((?:.|\n)+\S)\s*;\s*$/ :
                    /^([^{]*\S)\s*\{/);
                if (matches) {
                    return matches[1] + ';';
                }
                line = line + '\n' + this.getLine();
                securityLineCount++;
            } while (true);
        }
        _allowId(id, _idType, accessTag, exportTag) {
            return (!this.isEndUser)
                || (id[0] !== '_' && accessTag === 'public'
                    && (this.isInsideClassOrInterface || exportTag !== undefined));
        }
        _processAccessTag(accessTag) {
            return accessTag ? accessTag.trim() : 'public';
        }
        _prepareBadges(id, idType, badges, accessTag, exportTag) {
            badges.push(accessTag);
            if (exportTag) {
                badges.push(exportTag);
            }
            if (!this.isEndUser && id.startsWith('_')) {
                badges.push('internal');
            }
            badges = (badges || [])
                .filter(badge => badge !== undefined)
                .map(badge => badge.trim());
            badges.push(BadgeNameOfDocIdType[idType]);
            return badges;
        }
        addId(id, idType, line, badges, accessTag, exportTag) {
            const svJsDocs = this.jsDocs;
            this.jsDocs = [];
            // this.isReadOnly = false;
            accessTag = this._processAccessTag(accessTag);
            badges = this._prepareBadges(id, idType, badges, accessTag, exportTag);
            if (!this._allowId(id, idType, accessTag, exportTag)) {
                return false;
            }
            this.outLines.push(`##${IdTypeAreSections.indexOf(idType) !== -1 ? '' : '#'} `
                + `${this.classOrInterfaceName ? this.classOrInterfaceName + '.' : ''}`
                + `${id}${IdTypeAreFunctions.indexOf(idType) !== -1 ? '()' : ''}\n`);
            if (this.classOrInterfaceName) {
                this.links.push(this.classOrInterfaceName);
            }
            this.outLines.push(badges
                .map(badge => `<span class="code-badge badge-${badge}">${badge}</span>`)
                .join(' ')
                + '  ' + this.links.map(link => `[[${link}](${link})]`).join(' ')
                + '  ');
            this.links = [];
            this.outLines.push('```js\n' + line.trimLeft() + '\n```\n');
            if (svJsDocs.length && this.lastJsDocsLineNr === this.lastPeekLineNr) {
                const formattedJsDocs = formatJsDocsMarkdown(svJsDocs.join('\n'), this.localWebLinks);
                this.outLines.push(formattedJsDocs);
            }
            else {
            }
            return true;
        }
        parseJsDocs() {
            this.lastJsDocsLineNr = -1;
            if (this.getLine(true).match(/^\s*\/\*\*/)) {
                this.jsDocs = [];
                let done;
                do {
                    let line = this.getLine();
                    done = line.length === 0;
                    line = line.replace(/\s*\*\/\s*$/, () => {
                        done = true;
                        return '';
                    });
                    // removes the @readonly line
                    line = line.replace(/\s*\*\s*#end-user\s+@readonly\s*/, () => {
                        // this.isReadOnly = true;
                        return '';
                    });
                    // removes the start comment marker
                    line = line.replace(/^\s*\/?\*{1,2}\s?/, '');
                    this.jsDocs.push(line);
                } while (!done);
                this.lastJsDocsLineNr = this.inpLineNr;
            }
        }
        parseMethodsAndProperties() {
            if (this.disabledClassOrInterface) {
                return;
            }
            const [, spaces, accessTag, abstractTag, readonlyTag, getterTag, setterTag, id, parenthesisTag] = this.getLine(true)
                .match(/^(\s*)(protected\s+|private\s+|public\s+)?(abstract\s+)?(readonly\s+)?(get\s+)?(set\s+)?(\w+)(\s*\()?/) || EMPTY;
            if (spaces === this.innerSpaces) {
                let idType = 7 /* DocIdType.PropertyName */;
                if (parenthesisTag) {
                    if (getterTag) {
                        idType = 8 /* DocIdType.GetterName */;
                    }
                    else if (setterTag) {
                        idType = 9 /* DocIdType.SetterName */;
                    }
                    else if (id === 'constructor') {
                        idType = 10 /* DocIdType.ConstructorName */;
                    }
                    else {
                        idType = 6 /* DocIdType.MethodName */;
                    }
                }
                this.addId(id, idType, this._processDefContent(this.getLine(), idType === 7 /* DocIdType.PropertyName */ || this.isInterface
                    || abstractTag !== undefined), [abstractTag, readonlyTag], accessTag);
            }
        }
        parseInterfaceOrClass() {
            const [, spaces, exportTag, abstractTag, idTypeTag, id] = this.getLine(true)
                .match(/^(\s*)(?:(export)\s+)?(abstract\s+)?(interface\s+|class\s+)(\w+)/)
                || EMPTY;
            if (spaces === this.outerSpaces) {
                let line = this.getLine();
                line = line.replace(/\s*\{?\s*\}?\s*$/, '{ }');
                const idType = idTypeTag[0] === 'i'
                    ? 4 /* DocIdType.InterfaceName */ : 5 /* DocIdType.ClassName */;
                this.disabledClassOrInterface = this.isEndUser
                    && (!exportTag || !this._allowId(id, idType, 'public', exportTag));
                if (!this.disabledClassOrInterface) {
                    this.outLines.push('<div class=class-interface-header>&nbsp;</div>');
                    this.addId(id, idType, line, [abstractTag], undefined, exportTag);
                }
                this.isInsideClassOrInterface = true;
                this.classOrInterfaceName = id;
                this.isInterface = idTypeTag.startsWith('interface');
                return true;
            }
            return false;
        }
        parseEndOfClassOrInterface() {
            const [, spaces] = this.getLine(true)
                .match(/^(\s*)}/) || EMPTY;
            if (spaces === this.outerSpaces) {
                this.isInsideClassOrInterface = false;
                this.classOrInterfaceName = '';
            }
        }
        parseFunction() {
            const [, spaces, exportTag, id] = this.getLine(true)
                .match(/^(\s*)(export\s+)?function\s+(\w+)\b/) || EMPTY;
            if (spaces === this.outerSpaces) {
                let line = this.getLine();
                this.addId(id, 3 /* DocIdType.FunctionName */, this._processDefContent(line, false), [], undefined, exportTag);
                while (true) {
                    line = this.getLine();
                    const [, endSpaces] = line.match(/^(\s*)\}\s*$/) || EMPTY;
                    if (endSpaces === this.outerSpaces) {
                        break;
                    }
                }
            }
        }
        parseType() {
            const [, spaces, exportTag, id] = this.getLine(true)
                .match(/^(\s*)(export\s+)?type\s+(\w+)\b/) || EMPTY;
            if (spaces === this.outerSpaces) {
                this.addId(id, 1 /* DocIdType.TypeName */, this._processDefContent(this.getLine(), true), [], undefined, exportTag);
            }
        }
        parseEnum() {
            const [, spaces, constTag, exportTag, id] = this.getLine(true)
                .match(/^(\s*)(export\s+)?(const\s+)?enum\s+(\w+)\b/) || EMPTY;
            if (spaces === this.outerSpaces) {
                this.addId(id, 0 /* DocIdType.EnumName */, this._processDefContent(this.getLine(), false), [constTag], undefined, exportTag);
            }
        }
        parseConst() {
            const [, spaces, exportTag, id] = this.getLine(true)
                .match(/^(\s*)(export\s+)?const\s+(\w+)\b/) || EMPTY;
            if (spaces === this.outerSpaces) {
                this.addId(id, 2 /* DocIdType.ConstName */, this._processDefContent(this.getLine(), true), [exportTag]);
            }
        }
        parseFileData(text) {
            this.outerSpaces = '  ';
            this.innerSpaces = this.outerSpaces + this.outerSpaces;
            this.inpLines = text.split('\n');
            this.inpLineNr = 0;
            this.inpLineCount = this.inpLines.length;
            while (!this.isFinished()) {
                // if (this.getLine(false).includes('@stop-processing')) {
                //   console.log(`this.inpLineNr: ${this.inpLineNr}`);
                //   console.log(this.inpLines);
                //   break;
                // }
                const curLineNr = this.inpLineNr;
                this.parseJsDocs();
                if (this.isInsideClassOrInterface) {
                    this.parseMethodsAndProperties();
                }
                {
                    if (!this.parseInterfaceOrClass()) {
                        this.parseEnum();
                        this.parseConst();
                        this.parseType();
                        this.parseFunction();
                        this.parseEndOfClassOrInterface();
                    }
                }
                if (curLineNr === this.inpLineNr) {
                    this.getLine();
                }
            }
        }
    }
    /**
     * Loads a mkdocs.yml template file, adds and organizes pages,
     * and generates the output.
     */
    class MkDocsYml {
        constructor(templateFileName, targetName) {
            this.folderMap = {};
            this.yamlDoc = yaml.load(fsix_js_1.fsix.readUtf8Sync(templateFileName));
            this.yamlDoc.site_name = this.yamlDoc.site_name
                .replace(/%target%/, targetName)
                .replace(/%version%/, versionLib.VERSION);
        }
        save(dstFileName) {
            sysFs.writeFileSync(dstFileName, yaml.dump(this.yamlDoc));
        }
        addSourceFile(opts, fileName, content) {
            const pageName = sysPath.posix.basename(fileName);
            // gets document name from the source/markdown file
            if (!opts.name) {
                content = content.replace(/^\s*[\/\*]*\s*@doc-name\s+\b([\w ]+)\s*\n/m, (_all, docName) => {
                    opts.name = docName;
                    return '';
                });
            }
            // make a more double uppercase document index title
            if (!opts.name && pageName.includes('-')) {
                opts.name = pageName[0].toUpperCase() + pageName.substr(1)
                    .replace(/\.md$/, '')
                    .replace(/-(\w)/g, (_all, p) => ' ' + p.toUpperCase());
            }
            // gets the folder name from the source/markdown file
            content.replace(/^\s*[\/\*]+\s*@doc-folder\s+\b([\w ]+)\s*\n/m, (_all, folder) => {
                opts.folder = folder;
                return '';
            });
            let folderContainer = opts.folder ? this.folderMap[opts.folder] : this.yamlDoc.nav;
            if (!folderContainer) {
                folderContainer = this.folderMap[opts.folder] = [];
                const subFolder = {};
                subFolder[opts.folder] = folderContainer;
                this.yamlDoc.nav.push(subFolder);
            }
            if (opts.name) {
                const formattedPageName = {};
                formattedPageName[opts.name] = pageName;
                folderContainer.push(formattedPageName);
            }
            else {
                folderContainer.push(pageName);
            }
            return content;
        }
    }
    // ------------------------------------------------------------------------
    //                               formatMarkdown
    // ------------------------------------------------------------------------
    /**
     * Modifies the markdown generate from the JsDocs to be more readable
     * and processes links.
     */
    function formatJsDocsMarkdown(text, localWebLinks) {
        // ensures that lines that end a paragraph generate a paragraph in markdown
        text = text.replace(/([\.`":])\n(.|\n)/g, '$1  \n$2');
        text = text.replace(/^\s*@(example|default)\b\s*`?(.*)`?\s*$/mg, '_$1_: `$2`  ');
        text = text.replace(/^\s*@(param)\s+(\w+)\s*/mg, '**$1**: `$2` ');
        text = text.replace(/^\s*@(returns)\b\s*/mg, '**$1**: ');
        text = text.replace(/^\s*@(type|memberof|readonly)\b(.*)$/mg, '');
        text = text.replace(/@see\b\s*((https?:\/\/)?(\w+\/)?([^#\s]*)?(#\S*)?\b)/g, (_all, link, http, folder, title, bookmark) => {
            if (http) {
                title = link;
            }
            else {
                if (folder) {
                    const key = folder.substr(0, folder.length - 1);
                    return `_see_: ${localWebLinks(key, title)}.  `;
                }
                else {
                    link = (folder || '')
                        + (title || '') + (title ? '.md' : '')
                        + (!folder && bookmark
                            ? bookmark.toLowerCase() // mkdocs lowercase the local bookmarks
                            : (bookmark || ''));
                    title = title || bookmark.substr(1);
                }
            }
            return `_see_: [${title || link}](${link}).  `;
        });
        return text;
    }
    // ------------------------------------------------------------------------
    //                               buildMarkdownFromSourceFile
    // ------------------------------------------------------------------------
    /**
     * Loads a TypeScript source file, scans for @module <type>,
     * and if the `type` matches it generates the associated markdown
     * and adds the file to mkdocs.
     * If exists the api file, generated by build-d-ts, it concats at the end of the file.
     *
     */
    function buildMarkdownFromSourceFile(inpFileName, outFileName, apiFileName, moduleTypes, mkDocsYml, mkDocsOpts, localWebLinks, isEndUser, log) {
        // if (isEndUser || inpFileName.indexOf('story') === -1) { return; }
        const inpText = fsix_js_1.fsix.readUtf8Sync(inpFileName);
        const matches = inpText.match(/\/\*\*\s*@module ([\w+\-]+)(?:\s*\|.*)\n(?:(?:.|\n)*?)\/\*\*((?:.|\n)*?)\*\//) || EMPTY;
        const moduleType = matches[1] || '';
        if (moduleType && moduleTypes.indexOf(moduleType) !== -1) {
            let outText = formatJsDocsMarkdown(matches[2].trim().split('\n').map(line => {
                return line.replace(/^\s*\*\s/, '').trimRight()
                    .replace(/^\s*\*$/, '  '); // removes the end delimiter of JSDocs
            }).join('\n'), localWebLinks);
            let preDocText = '';
            if (isEndUser && sysFs.existsSync(apiFileName)) {
                preDocText = fsix_js_1.fsix.readUtf8Sync(apiFileName) + '\n';
                // inpText = inpText.replace(/(namespace)/, '// @stop-processing\n$1');
            }
            if ((!isEndUser) || moduleType === 'end-user') {
                const docParser = new DocParser(localWebLinks, isEndUser);
                docParser.parseFileData(preDocText + inpText);
                if (docParser.outLines.length) {
                    outText += '  \n  \n<div class=api-header>&nbsp;</div>\n#API\n'
                        + docParser.outLines.join('\n');
                }
            }
            mkDocsYml.addSourceFile(mkDocsOpts, outFileName, inpText);
            sysFs.writeFileSync(outFileName, outText);
            log.generated.push(outFileName);
        }
    }
    /**
     * Copies a markdown file from to the destination
     * and adds the file to mkdocs.
     */
    function copyMarkdownFile(srcFileName, dstFileName, mkDocs, mkDocsOpts, _cfg, processPage) {
        let data = fsix_js_1.fsix.readUtf8Sync(srcFileName);
        data = mkDocs.addSourceFile(mkDocsOpts, dstFileName, data);
        if (processPage) {
            data = processPage(data);
        }
        sysFs.writeFileSync(dstFileName, data);
        return dstFileName;
    }
    /**
     * This is the main entry point.
     * Read the module information for details.
     */
    function build(libModules, pluginModules, cfg) {
        const localWebLinks = (key, title) => {
            if (key === 'gallery') {
                return `[${title}](/${cfg.paths.GALLERY_LATEST_PATH}/#${title})`;
            }
            else {
                return '';
            }
        };
        // ------------------------------------------------------------------------
        //                               buildWebLinks
        // ------------------------------------------------------------------------
        // in case of documentation, it's better to visualize the more specific at the top.
        libModules.reverse();
        BuildDocsLatest.getTargets(cfg).forEach(target => {
            const baseDstPath = `${target.dstPath}/${BuildDocsLatest.EN_LAST_VERSION_PATH}`;
            const markdownDstPath = `${baseDstPath}/${MARKDOWN_FOLDER}`;
            fsix_js_1.fsix.mkdirpSync(markdownDstPath);
            const mkDocsYml = new MkDocsYml(`${cfg.paths.DOCS_SOURCE_PATH}/.mkdocs-template.yml`, target.name);
            const log = {
                notFound: [],
                found: [],
                generated: [],
                refs: {},
            };
            // index.html
            copyMarkdownFile(target.indexFile, `${markdownDstPath}/index.md`, mkDocsYml, {}, cfg, target.processIndexPage);
            // copy sources
            target.sourcePaths.forEach(sourcesPathName => {
                sysFs.readdirSync(sourcesPathName).forEach(file => {
                    if (file.endsWith('.md') && !file.match(/-dev|README/)) {
                        copyMarkdownFile(`${sourcesPathName}/${file}`, `${markdownDstPath}/${file}`, mkDocsYml, {}, cfg);
                    }
                    if (file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.ico')) {
                        sysFs.writeFileSync(`${markdownDstPath}/${file}`, sysFs.readFileSync(`${sourcesPathName}/${file}`));
                    }
                });
            });
            // builds markdown files
            [['abeamer-cli', 'cli/abeamer-cli.ts', ''],
                ['server-agent', 'server/server-agent.ts', 'Server'],
                ['exact', 'test/exact.ts', 'Testing'],
                ...libModules
                    .map(fileTitle => [fileTitle, `${cfg.paths.JS_PATH}/${fileTitle}.ts`, 'Library']),
                ...pluginModules
                    .map(fileTitle => [fileTitle, `${cfg.paths.PLUGINS_PATH}/${fileTitle}/${fileTitle}.ts`, 'Plugins']),
            ]
                .forEach(item => {
                const [fileTitle, srcFileName, folder] = item;
                const dstFileName = `${markdownDstPath}/${fileTitle}.md`;
                buildMarkdownFromSourceFile(srcFileName, dstFileName, `${baseDstPath}/${BuildDocsLatest.API_FOLDER}/${fileTitle}.txt`, target.moduleTypes, mkDocsYml, { folder }, localWebLinks, target.isEndUser, log);
            });
            // writes mkdocs to be used by mkdocs command-line program
            mkDocsYml.save(`${baseDstPath}/mkdocs.yml`);
            // process all the links
            new ReferenceBuilder(log).build(markdownDstPath);
            // save log
            fsix_js_1.fsix.writeJsonSync(target.logFile, log);
            console.log(`
Generated: ${log.generated.length} files.
Not Found references: ${log.notFound.length}
`);
        });
    }
    BuildDocsLatest.build = build;
    // ------------------------------------------------------------------------
    //                               buildWebLinks
    // ------------------------------------------------------------------------
    function postBuild(filePatterns, replacePaths, wordMap) {
        const highlightRegEx = new RegExp(`\\b(${Object.keys(wordMap).join('|')})\\b`, 'g');
        globule.find(filePatterns).forEach(file => {
            let content = fsix_js_1.fsix.readUtf8Sync(file);
            replacePaths.forEach((pathSrcDst) => {
                content = content.replace(new RegExp(pathSrcDst[0], "g"), pathSrcDst[1]);
            });
            content = content.replace(/(<code class="js">)((?:.|\n)+?)(<\/code>)/g, (_all, preTag, code, postTag) => {
                code = code.replace(highlightRegEx, (_all2, word) => {
                    const wordInf = wordMap[word];
                    return `<span class="hljs-${wordInf.wordClass}"`
                        + `${wordInf.title ? ` title="${wordInf.title}"` : ''}>${word}</span>`;
                });
                return preTag + code + postTag;
            });
            sysFs.writeFileSync(file, content);
        });
    }
    BuildDocsLatest.postBuild = postBuild;
})(BuildDocsLatest || (exports.BuildDocsLatest = BuildDocsLatest = {}));
//# sourceMappingURL=build-docs-latest.js.map