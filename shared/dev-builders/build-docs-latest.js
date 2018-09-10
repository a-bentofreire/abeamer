"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 4293b25a-0b5f-4af9-8dd7-a351ff686908
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var globule = require("globule");
var yaml = require("js-yaml");
var sysFs = require("fs");
var sysPath = require("path");
var fsix_js_1 = require("../vendor/fsix.js");
var versionLib = require("../version.js");
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
    var EMPTY = ['', '', '', '', '', '', '', '', '', ''];
    var MARKDOWN_FOLDER = 'docs';
    BuildDocsLatest.API_FOLDER = 'api';
    BuildDocsLatest.EN_LAST_VERSION_PATH = 'en';
    var badgeLine = '';
    BuildDocsLatest.getTargets = function (cfg) { return [
        {
            id: 'end-user',
            name: 'End User',
            dstPath: cfg.paths.DOCS_LATEST_END_USER_PATH,
            sourcePaths: [cfg.paths.DOCS_SOURCE_PATH],
            moduleTypes: ['end-user'],
            indexFile: './README.md',
            isEndUser: true,
            logFile: './build-docs-latest-end-user.log',
            processIndexPage: function (data) {
                return data
                    .replace(/^(.*)developer-badge\.gif(.*)$/m, function (all, p1, p2) {
                    badgeLine = all;
                    return p1 + 'end-user-badge.gif' + p2;
                })
                    .replace(new RegExp(cfg.webLinks.webDomain + "/", 'g'), '/');
            },
        },
        {
            id: 'dev',
            name: 'Developer',
            dstPath: cfg.paths.DOCS_LATEST_DEVELOPER_PATH,
            sourcePaths: [cfg.paths.DOCS_SOURCE_PATH, cfg.paths.DOCS_SOURCE_DEV_PATH],
            moduleTypes: ['end-user', 'developer', 'internal'],
            indexFile: cfg.paths.DOCS_SOURCE_PATH + "-dev/README.md",
            isEndUser: false,
            logFile: './build-docs-latest-dev.log',
            processIndexPage: function (data) {
                return data.replace(/^(# Description.*)$/m, function (all) {
                    if (!badgeLine) {
                        throw "end-user should had been processed already.";
                    }
                    return all + '\n' + badgeLine + '  \n';
                });
            },
        },
    ]; };
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
    var ReferenceBuilder = /** @class */ (function () {
        function ReferenceBuilder(log) {
            this.log = log;
            this.refs = {};
        }
        /** Stage 0. Generate references from the filename and headers */
        ReferenceBuilder.prototype.buildRefs = function (fileBase, content) {
            var _this = this;
            this.refs[textToRef(fileBase)] = fileBase + ".md";
            content.replace(/^#+\s*(.+)\s*$/mg, function (all, text) {
                var ref = textToRef(text);
                var fullRef = fileBase + ".md#" + ref;
                _this.refs[ref] = fullRef;
                _this.refs[fullRef] = fullRef;
                _this.refs[fileBase + "#" + ref] = fullRef;
                return all;
            });
        };
        /** Processes the links from Markdown content, updating its content */
        ReferenceBuilder.prototype.updateLinks = function (fileBase, content) {
            var _this = this;
            return content.replace(/\[([^\]]*)\]\(([\w\-\s]*)(?:#([\w\-\s]*))?\)/g, function (_app, info, link, bookmark) {
                var _a;
                bookmark = bookmark || '';
                link = link || '';
                if (!info) {
                    info = bookmark || link;
                }
                var refBookmark = textToRef(bookmark || '');
                var refLink = textToRef(link || fileBase);
                var tracedLink;
                if (refBookmark) {
                    tracedLink = _this.refs[refLink + '#' + refBookmark] ||
                        _this.refs[refBookmark];
                }
                else {
                    tracedLink = _this.refs[refLink];
                }
                if (!tracedLink) {
                    _this.log.notFound.push(link + "#" + bookmark + " in " + fileBase);
                }
                else {
                    _this.log.found.push(link + "#" + bookmark + " in " + fileBase + " = " + tracedLink);
                    _a = tracedLink.split('#'), link = _a[0], bookmark = _a[1];
                }
                return "[" + info + "](" + link + (bookmark ? '#' + bookmark : '') + ")";
            });
        };
        /** Main entry point. Reads the files and calls appropriate action. */
        ReferenceBuilder.prototype.build = function (path) {
            var _this = this;
            var fileBases = sysFs.readdirSync(path)
                .filter(function (file) { return file.endsWith('.md'); }).map(function (file) { return file.replace(/\.md$/, ''); });
            [0, 1].forEach(function (stage) {
                fileBases.forEach(function (fileBase) {
                    var fileName = path + "/" + fileBase + ".md";
                    var content = fsix_js_1.fsix.readUtf8Sync(fileName);
                    if (stage === 0) {
                        _this.buildRefs(fileBase, content);
                    }
                    else {
                        sysFs.writeFileSync(fileName, _this.updateLinks(fileBase, content));
                    }
                });
            });
            this.log.refs = this.refs;
        };
        return ReferenceBuilder;
    }());
    /* enum ModuleType {
      unknown,
      developer,
      internal,
      shared,
      'end-user',
    } */
    var BadgeNameOfDocIdType = [
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
    var IdTypeAreFunctions = [3 /* FunctionName */, 6 /* MethodName */];
    var IdTypeAreSections = [
        0 /* EnumName */, 2 /* ConstName */, 1 /* TypeName */,
        4 /* InterfaceName */,
        5 /* ClassName */, 3 /* FunctionName */,
    ];
    var DocParser = /** @class */ (function () {
        function DocParser(localWebLinks, isEndUser) {
            var _this = this;
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
            this.isFinished = function () { return _this.inpLineNr >= _this.inpLineCount; };
        }
        DocParser.prototype.getLine = function (peekOnly) {
            if (peekOnly === void 0) { peekOnly = false; }
            var res = this.inpLines[this.inpLineNr] || '';
            if (!peekOnly) {
                this.inpLineNr++;
            }
            else {
                this.lastPeekLineNr = this.inpLineNr;
            }
            return res;
        };
        DocParser.prototype._processDefContent = function (line, scanForComma) {
            line = line.trim();
            var line1 = line;
            var securityLineCount = 0;
            do {
                if (securityLineCount > 150) {
                    console.log("too many lines " + (scanForComma ? 'YES' : 'NO') + ":\n" + line1 + "\n" + line);
                    return 'ERROR';
                }
                var matches = line.match(scanForComma ?
                    /((?:.|\n)+\S)\s*;\s*$/ :
                    /^([^{]*\S)\s*\{/);
                if (matches) {
                    return matches[1] + ';';
                }
                line = line + '\n' + this.getLine();
                securityLineCount++;
            } while (true);
        };
        DocParser.prototype._allowId = function (id, _idType, accessTag, exportTag) {
            return (!this.isEndUser)
                || (id[0] !== '_' && accessTag === 'public'
                    && (this.isInsideClassOrInterface || exportTag !== undefined));
        };
        DocParser.prototype._processAccessTag = function (accessTag) {
            return accessTag ? accessTag.trim() : 'public';
        };
        DocParser.prototype._prepareBadges = function (id, idType, badges, accessTag, exportTag) {
            badges.push(accessTag);
            if (exportTag) {
                badges.push(exportTag);
            }
            if (!this.isEndUser && id.startsWith('_')) {
                badges.push('internal');
            }
            badges = (badges || [])
                .filter(function (badge) { return badge !== undefined; })
                .map(function (badge) { return badge.trim(); });
            badges.push(BadgeNameOfDocIdType[idType]);
            return badges;
        };
        DocParser.prototype.addId = function (id, idType, line, badges, accessTag, exportTag) {
            var svJsDocs = this.jsDocs;
            this.jsDocs = [];
            // this.isReadOnly = false;
            accessTag = this._processAccessTag(accessTag);
            badges = this._prepareBadges(id, idType, badges, accessTag, exportTag);
            if (!this._allowId(id, idType, accessTag, exportTag)) {
                return false;
            }
            this.outLines.push("##" + (IdTypeAreSections.indexOf(idType) !== -1 ? '' : '#') + " "
                + ("" + (this.classOrInterfaceName ? this.classOrInterfaceName + '.' : ''))
                + ("" + id + (IdTypeAreFunctions.indexOf(idType) !== -1 ? '()' : '') + "\n"));
            if (this.classOrInterfaceName) {
                this.links.push(this.classOrInterfaceName);
            }
            this.outLines.push(badges
                .map(function (badge) { return "<span class=\"code-badge badge-" + badge + "\">" + badge + "</span>"; })
                .join(' ')
                + '  ' + this.links.map(function (link) { return "[[" + link + "](" + link + ")]"; }).join(' ')
                + '  ');
            this.links = [];
            this.outLines.push('```js\n' + line.trimLeft() + '\n```\n');
            if (svJsDocs.length && this.lastJsDocsLineNr === this.lastPeekLineNr) {
                var formattedJsDocs = formatJsDocsMarkdown(svJsDocs.join('\n'), this.localWebLinks);
                this.outLines.push(formattedJsDocs);
            }
            else {
            }
            return true;
        };
        DocParser.prototype.parseJsDocs = function () {
            this.lastJsDocsLineNr = -1;
            if (this.getLine(true).match(/^\s*\/\*\*/)) {
                this.jsDocs = [];
                var done_1;
                do {
                    var line = this.getLine();
                    done_1 = line.length === 0;
                    line = line.replace(/\s*\*\/\s*$/, function () {
                        done_1 = true;
                        return '';
                    });
                    // removes the @readonly line
                    line = line.replace(/\s*\*\s*#end-user\s+@readonly\s*/, function () {
                        // this.isReadOnly = true;
                        return '';
                    });
                    // removes the start comment marker
                    line = line.replace(/^\s*\/?\*{1,2}\s?/, '');
                    this.jsDocs.push(line);
                } while (!done_1);
                this.lastJsDocsLineNr = this.inpLineNr;
            }
        };
        DocParser.prototype.parseMethodsAndProperties = function () {
            if (this.disabledClassOrInterface) {
                return;
            }
            var _a = this.getLine(true)
                .match(/^(\s*)(protected\s+|private\s+|public\s+)?(abstract\s+)?(readonly\s+)?(get\s+)?(set\s+)?(\w+)(\s*\()?/) || EMPTY, spaces = _a[1], accessTag = _a[2], abstractTag = _a[3], readonlyTag = _a[4], getterTag = _a[5], setterTag = _a[6], id = _a[7], parenthesisTag = _a[8];
            if (spaces === this.innerSpaces) {
                var idType = 7 /* PropertyName */;
                if (parenthesisTag) {
                    if (getterTag) {
                        idType = 8 /* GetterName */;
                    }
                    else if (setterTag) {
                        idType = 9 /* SetterName */;
                    }
                    else if (id === 'constructor') {
                        idType = 10 /* ConstructorName */;
                    }
                    else {
                        idType = 6 /* MethodName */;
                    }
                }
                this.addId(id, idType, this._processDefContent(this.getLine(), idType === 7 /* PropertyName */ || this.isInterface
                    || abstractTag !== undefined), [abstractTag, readonlyTag], accessTag);
            }
        };
        DocParser.prototype.parseInterfaceOrClass = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)(?:(export)\s+)?(abstract\s+)?(interface\s+|class\s+)(\w+)/)
                || EMPTY, spaces = _a[1], exportTag = _a[2], abstractTag = _a[3], idTypeTag = _a[4], id = _a[5];
            if (spaces === this.outerSpaces) {
                var line = this.getLine();
                line = line.replace(/\s*\{?\s*\}?\s*$/, '{ }');
                var idType = idTypeTag[0] === 'i'
                    ? 4 /* InterfaceName */ : 5 /* ClassName */;
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
        };
        DocParser.prototype.parseEndOfClassOrInterface = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)}/) || EMPTY, spaces = _a[1];
            if (spaces === this.outerSpaces) {
                this.isInsideClassOrInterface = false;
                this.classOrInterfaceName = '';
            }
        };
        DocParser.prototype.parseFunction = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)(export\s+)?function\s+(\w+)\b/) || EMPTY, spaces = _a[1], exportTag = _a[2], id = _a[3];
            if (spaces === this.outerSpaces) {
                var line = this.getLine();
                this.addId(id, 3 /* FunctionName */, this._processDefContent(line, false), [], undefined, exportTag);
                while (true) {
                    line = this.getLine();
                    var _b = line.match(/^(\s*)\}\s*$/) || EMPTY, endSpaces = _b[1];
                    if (endSpaces === this.outerSpaces) {
                        break;
                    }
                }
            }
        };
        DocParser.prototype.parseType = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)(export\s+)?type\s+(\w+)\b/) || EMPTY, spaces = _a[1], exportTag = _a[2], id = _a[3];
            if (spaces === this.outerSpaces) {
                this.addId(id, 1 /* TypeName */, this._processDefContent(this.getLine(), true), [], undefined, exportTag);
            }
        };
        DocParser.prototype.parseEnum = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)(export\s+)?(const\s+)?enum\s+(\w+)\b/) || EMPTY, spaces = _a[1], constTag = _a[2], exportTag = _a[3], id = _a[4];
            if (spaces === this.outerSpaces) {
                this.addId(id, 0 /* EnumName */, this._processDefContent(this.getLine(), false), [constTag], undefined, exportTag);
            }
        };
        DocParser.prototype.parseConst = function () {
            var _a = this.getLine(true)
                .match(/^(\s*)(export\s+)?const\s+(\w+)\b/) || EMPTY, spaces = _a[1], exportTag = _a[2], id = _a[3];
            if (spaces === this.outerSpaces) {
                this.addId(id, 2 /* ConstName */, this._processDefContent(this.getLine(), true), [exportTag]);
            }
        };
        DocParser.prototype.parseFileData = function (text) {
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
                var curLineNr = this.inpLineNr;
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
        };
        return DocParser;
    }());
    /**
     * Loads a mkdocs.yml template file, adds and organizes pages,
     * and generates the output.
     */
    var MkDocsYml = /** @class */ (function () {
        function MkDocsYml(templateFileName, targetName) {
            this.folderMap = {};
            this.yamlDoc = yaml.safeLoad(fsix_js_1.fsix.readUtf8Sync(templateFileName));
            this.yamlDoc.site_name = this.yamlDoc.site_name
                .replace(/%target%/, targetName)
                .replace(/%version%/, versionLib.VERSION);
        }
        MkDocsYml.prototype.save = function (dstFileName) {
            sysFs.writeFileSync(dstFileName, yaml.safeDump(this.yamlDoc));
        };
        MkDocsYml.prototype.addSourceFile = function (opts, fileName, content) {
            var pageName = sysPath.posix.basename(fileName);
            // gets document name from the source/markdown file
            if (!opts.name) {
                content = content.replace(/^\s*[\/\*]*\s*@doc-name\s+\b([\w ]+)\s*\n/m, function (_all, docName) {
                    opts.name = docName;
                    return '';
                });
            }
            // make a more double uppercase document index title
            if (!opts.name && pageName.includes('-')) {
                opts.name = pageName[0].toUpperCase() + pageName.substr(1)
                    .replace(/\.md$/, '')
                    .replace(/-(\w)/g, function (_all, p) { return ' ' + p.toUpperCase(); });
            }
            // gets the folder name from the source/markdown file
            content.replace(/^\s*[\/\*]+\s*@doc-folder\s+\b([\w ]+)\s*\n/m, function (_all, folder) {
                opts.folder = folder;
                return '';
            });
            var folderContainer = opts.folder ? this.folderMap[opts.folder] : this.yamlDoc.nav;
            if (!folderContainer) {
                folderContainer = this.folderMap[opts.folder] = [];
                var subFolder = {};
                subFolder[opts.folder] = folderContainer;
                this.yamlDoc.nav.push(subFolder);
            }
            if (opts.name) {
                var formattedPageName = {};
                formattedPageName[opts.name] = pageName;
                folderContainer.push(formattedPageName);
            }
            else {
                folderContainer.push(pageName);
            }
            return content;
        };
        return MkDocsYml;
    }());
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
        text = text.replace(/@see\b\s*((https?:\/\/)?(\w+\/)?([^#\s]*)?(#\S*)?\b)/g, function (_all, link, http, folder, title, bookmark) {
            if (http) {
                title = link;
            }
            else {
                if (folder) {
                    var key = folder.substr(0, folder.length - 1);
                    return "_see_: " + localWebLinks(key, title) + ".  ";
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
            return "_see_: [" + (title || link) + "](" + link + ").  ";
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
        var inpText = fsix_js_1.fsix.readUtf8Sync(inpFileName);
        var matches = inpText.match(/\/\*\*\s*@module ([\w+\-]+)(?:\s*\|.*)\n(?:(?:.|\n)*?)\/\*\*((?:.|\n)*?)\*\//) || EMPTY;
        var moduleType = matches[1] || '';
        if (moduleType && moduleTypes.indexOf(moduleType) !== -1) {
            var outText = formatJsDocsMarkdown(matches[2].trim().split('\n').map(function (line) {
                return line.replace(/^\s*\*\s/, '').trimRight()
                    .replace(/^\s*\*$/, '  '); // removes the end delimiter of JSDocs
            }).join('\n'), localWebLinks);
            var preDocText = '';
            if (isEndUser && sysFs.existsSync(apiFileName)) {
                preDocText = fsix_js_1.fsix.readUtf8Sync(apiFileName) + '\n';
                // inpText = inpText.replace(/(namespace)/, '// @stop-processing\n$1');
            }
            if ((!isEndUser) || moduleType === 'end-user') {
                var docParser = new DocParser(localWebLinks, isEndUser);
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
        var data = fsix_js_1.fsix.readUtf8Sync(srcFileName);
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
        var localWebLinks = function (key, title) {
            if (key === 'gallery') {
                return "[" + title + "](/" + cfg.paths.GALLERY_LATEST_PATH + "/#" + title + ")";
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
        BuildDocsLatest.getTargets(cfg).forEach(function (target) {
            var baseDstPath = target.dstPath + "/" + BuildDocsLatest.EN_LAST_VERSION_PATH;
            var markdownDstPath = baseDstPath + "/" + MARKDOWN_FOLDER;
            fsix_js_1.fsix.mkdirpSync(markdownDstPath);
            var mkDocsYml = new MkDocsYml(cfg.paths.DOCS_SOURCE_PATH + "/.mkdocs-template.yml", target.name);
            var log = {
                notFound: [],
                found: [],
                generated: [],
                refs: {},
            };
            // index.html
            copyMarkdownFile(target.indexFile, markdownDstPath + "/index.md", mkDocsYml, {}, cfg, target.processIndexPage);
            // copy sources
            target.sourcePaths.forEach(function (sourcesPathName) {
                sysFs.readdirSync(sourcesPathName).forEach(function (file) {
                    if (file.endsWith('.md') && !file.match(/-dev|README/)) {
                        copyMarkdownFile(sourcesPathName + "/" + file, markdownDstPath + "/" + file, mkDocsYml, {}, cfg);
                    }
                    if (file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.ico')) {
                        sysFs.writeFileSync(markdownDstPath + "/" + file, sysFs.readFileSync(sourcesPathName + "/" + file));
                    }
                });
            });
            // builds markdown files
            [['abeamer-cli', 'cli/abeamer-cli.ts', ''],
                ['server-agent', 'server/server-agent.ts', 'Server'],
                ['exact', 'test/exact.ts', 'Testing']].concat(libModules
                .map(function (fileTitle) { return [fileTitle, cfg.paths.JS_PATH + "/" + fileTitle + ".ts", 'Library']; }), pluginModules
                .map(function (fileTitle) { return [fileTitle, cfg.paths.PLUGINS_PATH + "/" + fileTitle + "/" + fileTitle + ".ts", 'Plugins']; })).forEach(function (item) {
                var fileTitle = item[0], srcFileName = item[1], folder = item[2];
                var dstFileName = markdownDstPath + "/" + fileTitle + ".md";
                buildMarkdownFromSourceFile(srcFileName, dstFileName, baseDstPath + "/" + BuildDocsLatest.API_FOLDER + "/" + fileTitle + ".txt", target.moduleTypes, mkDocsYml, { folder: folder }, localWebLinks, target.isEndUser, log);
            });
            // writes mkdocs to be used by mkdocs command-line program
            mkDocsYml.save(baseDstPath + "/mkdocs.yml");
            // process all the links
            new ReferenceBuilder(log).build(markdownDstPath);
            // save log
            fsix_js_1.fsix.writeJsonSync(target.logFile, log);
            console.log("\nGenerated: " + log.generated.length + " files.\nNot Found references: " + log.notFound.length + "\n");
        });
    }
    BuildDocsLatest.build = build;
    // ------------------------------------------------------------------------
    //                               buildWebLinks
    // ------------------------------------------------------------------------
    function postBuild(filePatterns, replacePaths, wordMap) {
        var highlightRegEx = new RegExp("\\b(" + Object.keys(wordMap).join('|') + ")\\b", 'g');
        globule.find(filePatterns).forEach(function (file) {
            var content = fsix_js_1.fsix.readUtf8Sync(file);
            replacePaths.forEach(function (pathSrcDst) {
                content = content.replace(pathSrcDst[0], pathSrcDst[1]);
            });
            content = content.replace(/(<code class="js">)((?:.|\n)+?)(<\/code>)/g, function (_all, preTag, code, postTag) {
                code = code.replace(highlightRegEx, function (_all2, word) {
                    var wordInf = wordMap[word];
                    return "<span class=\"hljs-" + wordInf.wordClass + "\""
                        + ((wordInf.title ? " title=\"" + wordInf.title + "\"" : '') + ">" + word + "</span>");
                });
                return preTag + code + postTag;
            });
            sysFs.writeFileSync(file, content);
        });
    }
    BuildDocsLatest.postBuild = postBuild;
})(BuildDocsLatest = exports.BuildDocsLatest || (exports.BuildDocsLatest = {}));
//# sourceMappingURL=build-docs-latest.js.map