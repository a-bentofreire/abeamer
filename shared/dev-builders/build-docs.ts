"use strict";
// uuid: 4293b25a-0b5f-4af9-8dd7-a351ff686908

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import * as sysPath from "path";
import { fsix } from "../vendor/fsix.js";
import { DevPaths } from "../dev-paths.js";
import { DevWebLinks as webLinks, DevWebLinks } from "../dev-web-links.js";
import * as versionLib from '../version.js';

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * Builds documentation files from the code.
 *
 * usage: `gulp build-docs`
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
export namespace BuildDocs {

  const yaml = require('js-yaml');

  const EMPTY = ['', '', '', '', '', '', '', '', '', ''];

  const MARKDOWN_FOLDER = 'docs';
  export const API_FOLDER = 'api';
  export const EN_LAST_VERSION_PATH = 'en';

  type LocalWebLinks = (key: string, title: string) => string;

  let badgeLine = '';

  export const targets = [
    {
      id: 'end-user',
      name: 'End User',
      dstPath: DevPaths.END_USER_DOCS_PATH,
      sourcePaths: [DevPaths.SOURCE_DOCS_PATH],
      moduleTypes: ['end-user'],
      indexFile: './README.md',
      isEndUser: true,
      logFile: './build-docs-end-user.log',
      processIndexPage: (data: string) => {
        return data
          .replace(/^(.*)developer-badge\.gif(.*)$/m, (all, p1, p2) => {
            badgeLine = all;
            return p1 + 'end-user-badge.gif' + p2;
          })
          .replace(new RegExp(`${DevWebLinks.webDomain}/`, 'g'), '/');
      },
    },
    {
      id: 'dev',
      name: 'Developer',
      dstPath: DevPaths.DEV_DOCS_PATH,
      sourcePaths: [DevPaths.SOURCE_DOCS_PATH, DevPaths.SOURCE_DEV_DOCS_PATH],
      moduleTypes: ['end-user', 'developer', 'internal'],
      indexFile: `${DevPaths.SOURCE_DOCS_PATH}-dev/README.md`,
      isEndUser: false,
      logFile: './build-docs-dev.log',
      processIndexPage: (data: string) => {
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
  //                               LogData
  // ------------------------------------------------------------------------

  interface Log {
    notFound: string[];
    found: string[];
    generated: string[];
    refs: {};
  }

  // ------------------------------------------------------------------------
  //                               ReferenceBuilder
  // ------------------------------------------------------------------------

  /** Converts a text to a Markdown reference */
  function textToRef(text: string): string {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^_a-z\-]/g, '');
  }


  /**
   * Processes all output Markdown files, by scanning all the local links and
   * filling the missing details.
   */
  class ReferenceBuilder {

    refs: { [ref: string]: string } = {};

    constructor(public log: Log) { }

    /** Stage 0. Generate references from the filename and headers */
    private buildRefs(fileBase: string, content: string): void {
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
    private updateLinks(fileBase: string, content: string): string {
      return content.replace(/\[([^\]]*)\]\(([\w\-\s]*)(?:#([\w\-\s]*))?\)/g,
        (app, info, link, bookmark) => {
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
          } else {
            tracedLink = this.refs[refLink];
          }

          if (!tracedLink) {
            this.log.notFound.push(`${link}#${bookmark} in ${fileBase}`);
          } else {
            this.log.found.push(`${link}#${bookmark} in ${fileBase} = ${tracedLink}`);
            [link, bookmark] = tracedLink.split('#');
          }
          return `[${info}](${link}${bookmark ? '#' + bookmark : ''})`;
        });
    }


    /** Main entry point. Reads the files and calls appropriate action. */
    build(path: string): void {

      const fileBases = sysFs.readdirSync(path)
        .filter(file => file.endsWith('.md')).map(file => file.replace(/\.md$/, ''));

      [0, 1].forEach(stage => {
        fileBases.forEach(fileBase => {
          const fileName = `${path}/${fileBase}.md`;
          const content = fsix.readUtf8Sync(fileName);
          if (stage === 0) {
            this.buildRefs(fileBase, content);
          } else {
            sysFs.writeFileSync(fileName, this.updateLinks(fileBase, content));
          }
        });
      });
      this.log.refs = this.refs;
    }
  }

  // ------------------------------------------------------------------------
  //                               DocParser
  // ------------------------------------------------------------------------

  const enum DocIdType {
    EnumName,
    TypeName,
    ConstName,
    FunctionName,
    InterfaceName,
    ClassName,
    MethodName,
    PropertyName,
    GetterName,
    SetterName,
    ConstructorName,
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


  const IdTypeAreFunctions = [DocIdType.FunctionName, DocIdType.MethodName];


  const IdTypeAreSections = [
    DocIdType.EnumName, DocIdType.ConstName, DocIdType.TypeName,
    DocIdType.InterfaceName,
    DocIdType.ClassName, DocIdType.FunctionName,
  ];

  class DocParser {

    outLines: string[] = [];

    private inpLineNr: uint;
    private inpLineCount: uint;
    private inpLines: string[] = [];
    private jsDocs: string[] = [];
    private outerSpaces: string;
    private innerSpaces: string;
    // private isReadOnly: boolean = false;
    private isInsideClassOrInterface = false;
    private classOrInterfaceName = '';
    private disabledClassOrInterface = false;
    private isInterface = false;
    private links: string[] = [];

    private lastJsDocsLineNr = 0;
    private lastPeekLineNr = 0;

    constructor(private localWebLinks: LocalWebLinks,
      private isEndUser: boolean) { }


    private getLine(peekOnly: boolean = false): string {
      const res = this.inpLines[this.inpLineNr] || '';
      if (!peekOnly) {
        this.inpLineNr++;
      } else {
        this.lastPeekLineNr = this.inpLineNr;
      }
      return res;
    }


    private isFinished = () => this.inpLineNr >= this.inpLineCount;

    private _processDefContent(line: string, scanForComma: boolean): string {

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


    private _allowId(id: string, idType: DocIdType,
      accessTag: string, exportTag: string | undefined): boolean {
      return (!this.isEndUser)
        || (id[0] !== '_' && accessTag === 'public'
          && (this.isInsideClassOrInterface || exportTag !== undefined));
    }


    private _processAccessTag(accessTag?): string {
      return accessTag ? accessTag.trim() : 'public';
    }


    private _prepareBadges(id: string, idType: DocIdType, badges: string[],
      accessTag: string, exportTag: string | undefined): string[] {

      badges.push(accessTag);
      if (exportTag) { badges.push(exportTag); }
      if (!this.isEndUser && id.startsWith('_')) { badges.push('internal'); }
      badges = (badges || [])
        .filter(badge => badge !== undefined)
        .map(badge => badge.trim());
      badges.push(BadgeNameOfDocIdType[idType]);
      return badges;
    }


    private addId(id: string, idType: DocIdType,
      line: string, badges: string[],
      accessTag?: string, exportTag?: string): boolean {

      const svJsDocs = this.jsDocs;
      this.jsDocs = [];
      // this.isReadOnly = false;
      accessTag = this._processAccessTag(accessTag);
      badges = this._prepareBadges(id, idType, badges, accessTag, exportTag);

      if (!this._allowId(id, idType, accessTag, exportTag)) {
        return false;
      }

      this.outLines.push(
        `##${IdTypeAreSections.indexOf(idType) !== -1 ? '' : '#'} `
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
      } else {
      }

      return true;
    }


    private parseJsDocs(): void {
      this.lastJsDocsLineNr = -1;
      if (this.getLine(true).match(/^\s*\/\*\*/)) {
        this.jsDocs = [];
        let done: boolean;
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


    private parseMethodsAndProperties(): void {
      if (this.disabledClassOrInterface) {
        return;
      }

      const [, spaces, accessTag, abstractTag, readonlyTag, getterTag, setterTag,
        id, parenthesisTag] = this.getLine(true)
          .match(
            /^(\s*)(protected\s+|private\s+|public\s+)?(abstract\s+)?(readonly\s+)?(get\s+)?(set\s+)?(\w+)(\s*\()?/,
          ) || EMPTY;


      if (spaces === this.innerSpaces) {
        let idType: DocIdType = DocIdType.PropertyName;
        if (parenthesisTag) {
          if (getterTag) {
            idType = DocIdType.GetterName;
          } else if (setterTag) {
            idType = DocIdType.SetterName;
          } else if (id === 'constructor') {
            idType = DocIdType.ConstructorName;
          } else {
            idType = DocIdType.MethodName;
          }
        }

        this.addId(id, idType,
          this._processDefContent(this.getLine(),
            idType === DocIdType.PropertyName || this.isInterface
            || abstractTag !== undefined),
          [abstractTag, readonlyTag], accessTag);
      }
    }


    private parseInterfaceOrClass(): boolean {
      const [, spaces, exportTag, abstractTag, idTypeTag, id] = this.getLine(true)
        .match(/^(\s*)(?:(export)\s+)?(abstract\s+)?(interface\s+|class\s+)(\w+)/)
        || EMPTY;
      if (spaces === this.outerSpaces) {
        let line = this.getLine();

        line = line.replace(/\s*\{?\s*\}?\s*$/, '{ }');

        const idType = idTypeTag[0] === 'i'
          ? DocIdType.InterfaceName : DocIdType.ClassName;
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


    private parseEndOfClassOrInterface(): void {
      const [, spaces] = this.getLine(true)
        .match(/^(\s*)}/) || EMPTY;
      if (spaces === this.outerSpaces) {
        this.isInsideClassOrInterface = false;
        this.classOrInterfaceName = '';
      }
    }


    private parseFunction(): void {
      const [, spaces, exportTag, id] = this.getLine(true)
        .match(/^(\s*)(export\s+)?function\s+(\w+)\b/) || EMPTY;
      if (spaces === this.outerSpaces) {
        let line = this.getLine();
        this.addId(id, DocIdType.FunctionName,
          this._processDefContent(line, false), [], undefined, exportTag);

        while (true) {
          line = this.getLine();
          const [, endSpaces] = line.match(/^(\s*)\}\s*$/) || EMPTY;
          if (endSpaces === this.outerSpaces) {
            break;
          }
        }
      }
    }


    private parseType(): void {
      const [, spaces, exportTag, id] = this.getLine(true)
        .match(/^(\s*)(export\s+)?type\s+(\w+)\b/) || EMPTY;
      if (spaces === this.outerSpaces) {
        this.addId(id, DocIdType.TypeName,
          this._processDefContent(this.getLine(), true),
          [], undefined, exportTag);
      }
    }


    private parseEnum(): void {
      const [, spaces, constTag, exportTag, id] = this.getLine(true)
        .match(/^(\s*)(export\s+)?(const\s+)?enum\s+(\w+)\b/) || EMPTY;
      if (spaces === this.outerSpaces) {
        this.addId(id, DocIdType.EnumName,
          this._processDefContent(this.getLine(), false),
          [constTag], undefined, exportTag);
      }
    }


    private parseConst(): void {
      const [, spaces, exportTag, id] = this.getLine(true)
        .match(/^(\s*)(export\s+)?const\s+(\w+)\b/) || EMPTY;
      if (spaces === this.outerSpaces) {
        this.addId(id, DocIdType.ConstName,
          this._processDefContent(this.getLine(), true), [exportTag]);
      }
    }


    parseFileData(text: string): void {
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
        } {
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

  // ------------------------------------------------------------------------
  //                               MkDocs
  // ------------------------------------------------------------------------

  interface Opts {
    name?: string;
    folder?: string;
  }


  /**
   * Loads a mkdocs.yml template file, adds and organizes pages,
   * and generates the output.
   */
  class MkDocsYml {

    yamlDoc: {
      site_name: string;
      nav: (string | any)[];
      production: any;
    };

    folderMap: { [name: string]: (string | any)[] } = {};

    constructor(templateFileName: string, targetName: string) {
      this.yamlDoc = yaml.safeLoad(fsix.readUtf8Sync(
        templateFileName));
      this.yamlDoc.site_name = this.yamlDoc.site_name
        .replace(/%target%/, targetName)
        .replace(/%version%/, versionLib.VERSION);
    }


    save(dstFileName: string): void {
      sysFs.writeFileSync(dstFileName, yaml.safeDump(this.yamlDoc));
    }

    addSourceFile(opts: Opts, fileName: string, content: string): string {
      const pageName = sysPath.posix.basename(fileName);

      // gets document name from the source/markdown file
      if (!opts.name) {
        content = content.replace(/^\s*[\/\*]*\s*@doc-name\s+\b([\w ]+)\s*\n/m,
          (all, docName) => {
            opts.name = docName;
            return '';
          });
      }

      // make a more double uppercase document index title
      if (!opts.name && pageName.includes('-')) {
        opts.name = pageName[0].toUpperCase() + pageName.substr(1)
          .replace(/\.md$/, '')
          .replace(/-(\w)/g, (all, p) => ' ' + p.toUpperCase());
      }

      // gets the folder name from the source/markdown file
      content.replace(/^\s*[\/\*]+\s*@doc-folder\s+\b([\w ]+)\s*\n/m,
        (all, folder) => {
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
      } else {
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
  function formatJsDocsMarkdown(text: string,
    localWebLinks: LocalWebLinks): string {

    // ensures that lines that end a paragraph generate a paragraph in markdown
    text = text.replace(/([\.`":])\n(.|\n)/g, '$1  \n$2');

    text = text.replace(/^\s*@(example|default)\b\s*`?(.*)`?\s*$/mg, '_$1_: `$2`  ');
    text = text.replace(/^\s*@(param)\s+(\w+)\s*/mg, '**$1**: `$2` ');
    text = text.replace(/^\s*@(returns)\b\s*/mg, '**$1**: ');
    text = text.replace(/^\s*@(type|memberof|readonly)\b(.*)$/mg, '');

    text = text.replace(/@see\b\s*((https?:\/\/)?(\w+\/)?([^#\s]*)?(#\S*)?\b)/g, (
      all, link: string,
      http: string, folder: string, title: string, bookmark: string) => {

      if (http) {
        title = link;
      } else {
        if (folder) {
          const key = folder.substr(0, folder.length - 1);
          return `_see_: ${localWebLinks(key, title)}.  `;
        } else {
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
  function buildMarkdownFromSourceFile(
    inpFileName: string, outFileName: string, apiFileName: string,
    moduleTypes: string[], mkDocsYml: MkDocsYml, mkDocsOpts: Opts,
    localWebLinks: LocalWebLinks,
    isEndUser: boolean, log: Log): void {


    // if (isEndUser || inpFileName.indexOf('story') === -1) { return; }


    const inpText = fsix.readUtf8Sync(inpFileName);
    const matches = inpText.match(
      /\/\*\*\s*@module ([\w+\-]+)(?:\s*\|.*)\n(?:(?:.|\n)*?)\/\*\*((?:.|\n)*?)\*\//) || EMPTY;
    const moduleType = matches[1] || '';
    if (moduleType && moduleTypes.indexOf(moduleType) !== -1) {
      let outText = formatJsDocsMarkdown(matches[2].trim().split('\n').map(line => {
        return line.replace(/^\s*\*\s/, '').trimRight()
          .replace(/^\s*\*$/, '  '); // removes the end delimiter of JSDocs
      }).join('\n'), localWebLinks);


      let preDocText = '';
      if (isEndUser && sysFs.existsSync(apiFileName)) {
        preDocText = fsix.readUtf8Sync(apiFileName) + '\n';
        // inpText = inpText.replace(/(namespace)/, '// @stop-processing\n$1');
      }


      if ((!isEndUser) || moduleType === 'end-user') {
        const docParser = new DocParser(localWebLinks, isEndUser);

        docParser.parseFileData(preDocText + inpText);
        if (docParser.outLines.length) {
          outText += '  \n  \n<div class=api-header>&nbsp;</div>\n#API\n' + docParser.outLines.join('\n');
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
  function copyMarkdownFile(srcFileName: string, dstFileName: string,
    mkDocs: MkDocsYml, mkDocsOpts: Opts,
    processPage?: (data: string) => string): string {

    let data = fsix.readUtf8Sync(srcFileName);
    data = mkDocs.addSourceFile(mkDocsOpts, dstFileName, data);
    if (processPage) { data = processPage(data); }
    sysFs.writeFileSync(dstFileName, data);
    return dstFileName;
  }


  /**
   * This is the main entry point.
   * Read the module information for details.
   */
  export function build(libModules: string[], pluginModules: string[]): void {

    const localWebLinks = (key: string, title: string) => {
      if (key === 'gallery') {
        return `[${title}](/${DevPaths.GALLERY_RELEASE_PATH}/#${title})`;
      } else {
        return '';
      }
    };

    // ------------------------------------------------------------------------
    //                               buildWebLinks
    // ------------------------------------------------------------------------

    // in case of documentation, it's better to visualize the more specific at the top.
    libModules.reverse();

    targets.forEach(target => {

      const baseDstPath = `${target.dstPath}/${EN_LAST_VERSION_PATH}`;
      const markdownDstPath = `${baseDstPath}/${MARKDOWN_FOLDER}`;
      fsix.mkdirpSync(markdownDstPath);
      const mkDocsYml = new MkDocsYml(`${DevPaths.SOURCE_DOCS_PATH}/.mkdocs-template.yml`,
        target.name);

      const log: Log = {
        notFound: [],
        found: [],
        generated: [],
        refs: {},
      };

      // index.html
      copyMarkdownFile(target.indexFile,
        `${markdownDstPath}/index.md`, mkDocsYml, {}, target.processIndexPage);

      // copy sources
      target.sourcePaths.forEach(sourcesPathName => {
        sysFs.readdirSync(sourcesPathName).forEach(file => {
          if (file.endsWith('.md') && !file.match(/-dev|README/)) {
            copyMarkdownFile(`${sourcesPathName}/${file}`,
              `${markdownDstPath}/${file}`, mkDocsYml, {});
          }

          if (file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.ico')) {
            sysFs.writeFileSync(`${markdownDstPath}/${file}`,
              sysFs.readFileSync(`${sourcesPathName}/${file}`));
          }
        });
      });

      // builds markdown files
      [['abeamer-cli', 'cli/abeamer-cli.ts', ''],
      ['server-agent', 'server/server-agent.ts', 'Server'],
      ['exact', 'test/exact.ts', 'Testing'],
      ...libModules
        .map(fileTitle => [fileTitle, `${DevPaths.JS_PATH}/${fileTitle}.ts`, 'Library']),
      ...pluginModules
        .map(fileTitle => [fileTitle, `${DevPaths.PLUGINS_PATH}/${fileTitle}/${fileTitle}.ts`, 'Plugins']),
      ]
        .forEach(item => {
          const [fileTitle, srcFileName, folder] = item;
          const dstFileName = `${markdownDstPath}/${fileTitle}.md`;
          buildMarkdownFromSourceFile(srcFileName, dstFileName,
            `${baseDstPath}/${API_FOLDER}/${fileTitle}.txt`,
            target.moduleTypes,
            mkDocsYml, { folder }, localWebLinks, target.isEndUser, log);
        });

      // writes mkdocs to be used by mkdocs command-line program
      mkDocsYml.save(`${baseDstPath}/mkdocs.yml`);

      // process all the links
      new ReferenceBuilder(log).build(markdownDstPath);

      // save log
      fsix.writeJsonSync(target.logFile, log);
      console.log(`
Generated: ${log.generated.length} files.
Not Found references: ${log.notFound.length}
`);
    });
  }
}


/*
  converting markdown to html was deprecated , since now
  is done via `mkdocs`
  this code is kept since it can be useful in the future


const SOURCES_FOLDER = 'sources';
const HTML_PATH = 'versions/latest/en';
targets.forEach(docsRec => {
  [MARKDOWN_FOLDER, SOURCES_FOLDER].forEach(inpFolder => {
    sysFs.readdirSync(`${docsRec.dstPath}/${inpFolder}`).forEach(file => {
      if (file.endsWith('.md')) {
        BuildDocs.markdownToHtml(`${docsRec.dstPath}/${inpFolder}/${file}`,
          `${docsRec.dstPath}/${HTML_PATH}/${file.replace(/\.md$/, '.html')}`);
      }
    });
  });
});

const markdownCompiler = require('marked');
const highlightJs = require('highlight.js');

markdownCompiler.setOptions({
  renderer: new markdownCompiler.Renderer(),
  highlight: (code) => highlightJs.highlightAuto(code).value,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

export function markdownToHtml(inpFileName: string, outputFileName: string): void {

  const inpData = fsix.readUtf8Sync(inpFileName);
  const STYLING_PATH = '../../../../styling';
  const html = '<html>\n<head>\n'
    + `
  <link rel="stylesheet" href="${STYLING_PATH}/highlight.js/styles/github.css">
  <link rel="stylesheet" href="${STYLING_PATH}/style.css">
  <script src="${STYLING_PATH}/highlight.js/lib/highlight.js"></script>
  <script>hljs.initHighlightingOnLoad();</script>\n`
    + '</head>\n<body>\n'
    + markdownCompiler(inpData)
    + '</body>\n</html>';

  sysFs.writeFileSync(outputFileName, html);
  console.log(`Generated ${outputFileName}`);
}
*/
