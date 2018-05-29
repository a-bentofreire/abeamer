"use strict";
// uuid: da361f3a-5280-4386-9ffa-2753fb2be3f8

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import * as sysPath from "path";
import { fsix } from "../vendor/fsix.js";

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * Builds TypeScript definition files from the code
 *
 * usage: `gulp build-definition-files`
 *
 * **This developer only module**
 *
 * In order to be able to generate the definition files,
 * the code must have a strict format:
 *
 * - Properties or methods with access protection (protected, private) don't generate output
 *
 * - The following grammar:
 * `export [abstract] class _<name> implements <name> {`
 * will generate:
 *  in <filename>.d.ts: `export interface <name>`
 *  in <filename>-dev.d.ts: `export interface _<name>Impl extends <name>`
 *
 * - Constructors don't generate output
 *
 * - To set a property to readonly include on the JSDocs:
 * `* #end-user @readonly`
 * The output wil removed this line and set the property to readonly
 *
 *
 */
export namespace BuildDTsFiles {



  // ------------------------------------------------------------------------
  //                               LinesParser
  // ------------------------------------------------------------------------

  export enum IdTypes {
    ClassName,
    MethodName,
    FunctionName,
    VarName,
    ExtendsWords,
    JsDocs,
  }

  export type AcceptId = (keyword: string, keyType: IdTypes) => string;

  class LinesParser {

    outLines: string[] = [];
    queueLines: string[] = [];

    private inpLineCount: uint;
    private lineI: uint = 0;
    // private queueJsDoc = [];
    private rules: { [id: string]: string } = {};

    constructor(public inpLines: string[], public acceptId: AcceptId,
      public tag: string, public fileName: string) {

      this.inpLineCount = inpLines.length;
    }


    // input
    finished = () => this.lineI >= this.inpLineCount;
    peek = (delta: int = 0) => this.inpLines[this.lineI + delta] || '';
    get = () => this.inpLines[this.lineI++] || '';
    set = (line: string) => this.inpLines[this.lineI] = line;


    // output
    private addOutLine(line) {
      if (this.queueLines.length) {
        this.outLines.push(this.queueLines.join('\n'));
        this.queueLines = [];
      }
      this.outLines.push(line);
    }


    private addWithJsDocs(line: string, newLines: string = ''): void {
      const jsDocsLine = this.peek(-1);
      let hasJsDocs = jsDocsLine.search(/^\s*\*\//) !== -1;
      if (hasJsDocs) {
        let index = -2;
        while (this.peek(index).search(/^\s*\/\*\*/) === -1) {
          index--;
        }
        const jsDocsLines = [];
        while (index < 0) {
          jsDocsLines.push(this.peek(index));
          index++;
        }
        let jsDocs = jsDocsLines.join('\n');

        // process jsDocs macros
        jsDocs = jsDocs.replace(/(.*)#end-user (.*)\b\s*\n/g, (text, pre, macro) => {
          if (macro === '@readonly') {
            line = line.replace(/^(\s*)(\w)/, '$1readonly $2');
          }
          return pre + macro + '\n';
        });

        jsDocs = this.acceptId(jsDocs, IdTypes.JsDocs);
        if (jsDocs) {
          this.addOutLine(jsDocs);
        }
        hasJsDocs = jsDocs !== '';
      }

      this.addOutLine(line);
      if (hasJsDocs) {
        this.addOutLine(newLines);
      }
    }


    private parseProperties(dataSpaces: string): void {
      const line = this.peek();
      const matches = line.match(new RegExp(`^${dataSpaces}(readonly )?(\\w+)(\\?)?\\s*:(.*)$`));
      if (matches) {
        const [all, readonly, varName, optional, typeInfo] = matches;

        const outVarName = this.acceptId(varName, IdTypes.VarName);
        if (!outVarName) { return; }
        const outTypeInfo = typeInfo.replace(/ = .*/, ';');
        const outLine = `${dataSpaces}${readonly || ''}${varName}${optional || ''}:${outTypeInfo}`;
        this.addWithJsDocs(outLine, '\n');
      }
    }


    private parseFunctions(): void {
      const line = this.peek();
      const spaces = '  ';
      const matches = line.match(new RegExp(`^${spaces}export function\\s*(\\w+)(.*)\\s*$`));
      if (matches) {
        const [all, functionName, paramsData] = matches;
        this.get();
        const outFunctionName = this.acceptId(functionName, IdTypes.FunctionName);
        if (!outFunctionName) { return; }
        let params = paramsData;
        while (!params.endsWith('{')) {
          const nextLine = this.get().trimRight();
          params += '\n' + nextLine;
        }
        params = params.replace(/\s*\{$/, ';\n');
        const outLine = `${spaces}export function ${outFunctionName}${params}`;
        this.addWithJsDocs(outLine, '\n');
      }
    }


    private parseMethods(dataSpaces: string): void {

      let line = this.peek();
      const matches = line.match(new RegExp(`^${dataSpaces}(abstract )?(get )?(\\w+)\\(`));
      if (matches) {
        const [, abstractKeyWord, getterKeyword, functionName] = matches;

        const isGetter = getterKeyword !== undefined;
        const isAbstract = abstractKeyWord !== undefined;
        const outFunctionName = this.acceptId(functionName, IdTypes.MethodName);
        if (!outFunctionName) { return; }

        // this.docParser.addId(outFunctionName, DocIdType.MethodName);

        let funcCodeEndRegEx = /\}\s*$/;
        // @WARN: The starting \s* is required
        let funcCodeStartRegEx = /\s*\{\s*$/;

        if (isAbstract) {
          line = line.replace(/abstract /, '');
          this.set(line);
          funcCodeEndRegEx = /\;\s*$/;
          funcCodeStartRegEx = funcCodeEndRegEx;
        }

        const outFuncLines = [];
        let outFuncText = '';
        let index = 0;

        if (line.search(funcCodeEndRegEx) === -1) {
          // multi-line function
          while (this.peek(index).search(funcCodeStartRegEx) === -1) {
            outFuncLines.push(this.peek(index));
            index++;
          }
          outFuncLines.push(this.peek(index));
          outFuncText = outFuncLines.join('\n');
          if (!isAbstract) { outFuncText = outFuncText.replace(/\s*\{\s*$/, ';'); }

        } else {
          // single line function
          outFuncText = line;
          if (!isAbstract) { outFuncText = outFuncText.replace(/\s*\{.*$/, ';'); }
        }


        if (isGetter) {
          outFuncText = outFuncText.replace(/^(\s*)get (\w+)\(\)/,
            '$1$2');
        }


        this.addWithJsDocs(outFuncText, '\n');
        this.lineI += index;
      }
    }


    private parseClassWithImplements(): void {
      const line = this.peek();
      const matches = line.match(
        /^(\s*)export (?:abstract )?class (\w+)\s+(?:\extends\s+(\w+))?\s*implements\s+(\w+)\s*\{/);
      if (matches) {
        const [, spaces, className, parentClass] = matches;

        const outClassName = this.acceptId(className, IdTypes.ClassName);
        if (!outClassName) { return; }
        console.log(`Adding Class "${outClassName}"`);

        const outParentWords =
          parentClass ? this.acceptId(`extends ${parentClass} `, IdTypes.ExtendsWords) : '';

        const outLine = `${spaces}export interface ${outClassName} ${outParentWords}{`;
        // this.docParser.addId(outClassName.replace(/\s+extends.*$/, ''), DocIdType.InterfaceName);
        this.addWithJsDocs(outLine, '');
        this.get();
        const dataSpaces = spaces + spaces;
        const endReg = new RegExp('^' + spaces + '}');
        while (this.peek().search(endReg) === -1) {
          this.parseProperties(dataSpaces);
          this.parseMethods(dataSpaces);
          this.get();
        }
        this.addOutLine(spaces + '}\n');
      }
    }


    // @HINT: This code is not used at the moment but it can have future uses
    private parseRules(): void {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#generator-rule:\s*(\w+)\s+(.*)\s*$/);
      if (matches) {
        this.rules[matches[1]] = matches[2];
      }
    }


    private parseGroupSection(): void {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#generate-group-section\s*$/);
      if (matches) {
        this.get();
        while (this.peek().trim()) {
          this.queueLines.push(this.get());
        }
        this.queueLines.push('');
      }
    }


    private parseExportSection(): void {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#export-section-start\s*:\s*([\w\-]+)\s*$/);
      if (matches && matches[1] === this.tag) {
        console.log(`Exporting section ${this.tag} from "${this.fileName}"`);
        this.get();
        while (this.peek().indexOf('#export-section-end') === -1) {
          this.addOutLine(this.get());
        }
        this.addOutLine('');
      }
    }


    public parseLine() {
      this.parseRules();
      this.parseGroupSection();
      this.parseFunctions();
      if (!this.tag) {
        this.parseClassWithImplements();
      } else {
        this.parseExportSection();
      }
    }
  }


  export function build(fileList: string[],
    outputFileName: string,
    preText: string, postText: string,
    acceptId: AcceptId, tag: string,
    docsPath: string,
  ): void {

    let outLines = [];

    fileList.forEach(fileName => {

      console.log(`Parsing ${fileName}`);
      const parser = new LinesParser(fsix.readUtf8Sync(fileName).split('\n'),
        acceptId, tag, fileName);

      while (!parser.finished()) {

        parser.parseLine();
        parser.get();
      }

      if (docsPath !== undefined && parser.outLines.length) {
        const docFileTitle = sysPath.posix.basename(fileName).replace(/\.\w+$/, '');
        sysFs.writeFileSync(`${docsPath}/${docFileTitle}.txt`, parser.outLines.join('\n'));
      }

      outLines = outLines.concat(parser.outLines);
    });

    sysFs.writeFileSync(outputFileName,
      (preText || '') + outLines.join('\n') + (postText || ''),
    );
  }
}
