"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: da361f3a-5280-4386-9ffa-2753fb2be3f8
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
var sysFs = require("fs");
var sysPath = require("path");
var fsix_js_1 = require("../vendor/fsix.js");
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
var BuildDTsFiles;
(function (BuildDTsFiles) {
    // ------------------------------------------------------------------------
    //                               LinesParser
    // ------------------------------------------------------------------------
    var IdTypes;
    (function (IdTypes) {
        IdTypes[IdTypes["ClassName"] = 0] = "ClassName";
        IdTypes[IdTypes["MethodName"] = 1] = "MethodName";
        IdTypes[IdTypes["FunctionName"] = 2] = "FunctionName";
        IdTypes[IdTypes["VarName"] = 3] = "VarName";
        IdTypes[IdTypes["ExtendsWords"] = 4] = "ExtendsWords";
        IdTypes[IdTypes["JsDocs"] = 5] = "JsDocs";
    })(IdTypes = BuildDTsFiles.IdTypes || (BuildDTsFiles.IdTypes = {}));
    var LinesParser = /** @class */ (function () {
        function LinesParser(inpLines, acceptId, tag, fileName) {
            var _this = this;
            this.inpLines = inpLines;
            this.acceptId = acceptId;
            this.tag = tag;
            this.fileName = fileName;
            this.outLines = [];
            this.queueLines = [];
            this.lineI = 0;
            // private queueJsDoc = [];
            this.rules = {};
            // input
            this.finished = function () { return _this.lineI >= _this.inpLineCount; };
            this.peek = function (delta) {
                if (delta === void 0) { delta = 0; }
                return _this.inpLines[_this.lineI + delta] || '';
            };
            this.get = function () { return _this.inpLines[_this.lineI++] || ''; };
            this.set = function (line) { return _this.inpLines[_this.lineI] = line; };
            this.inpLineCount = inpLines.length;
        }
        // output
        LinesParser.prototype.addOutLine = function (line) {
            if (this.queueLines.length) {
                this.outLines.push(this.queueLines.join('\n'));
                this.queueLines = [];
            }
            this.outLines.push(line);
        };
        LinesParser.prototype.addWithJsDocs = function (line, newLines) {
            if (newLines === void 0) { newLines = ''; }
            var jsDocsLine = this.peek(-1);
            var hasJsDocs = jsDocsLine.search(/^\s*\*\//) !== -1;
            if (hasJsDocs) {
                var index = -2;
                while (this.peek(index).search(/^\s*\/\*\*/) === -1) {
                    index--;
                }
                var jsDocsLines = [];
                while (index < 0) {
                    jsDocsLines.push(this.peek(index));
                    index++;
                }
                var jsDocs = jsDocsLines.join('\n');
                // process jsDocs macros
                jsDocs = jsDocs.replace(/(.*)#end-user (.*)\b\s*\n/g, function (text, pre, macro) {
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
        };
        LinesParser.prototype.parseProperties = function (dataSpaces) {
            var line = this.peek();
            var matches = line.match(new RegExp("^" + dataSpaces + "(readonly )?(\\w+)(\\?)?\\s*:(.*)$"));
            if (matches) {
                var all = matches[0], readonly = matches[1], varName = matches[2], optional = matches[3], typeInfo = matches[4];
                var outVarName = this.acceptId(varName, IdTypes.VarName);
                if (!outVarName) {
                    return;
                }
                var outTypeInfo = typeInfo.replace(/ = .*/, ';');
                var outLine = "" + dataSpaces + (readonly || '') + varName + (optional || '') + ":" + outTypeInfo;
                this.addWithJsDocs(outLine, '\n');
            }
        };
        LinesParser.prototype.parseFunctions = function () {
            var line = this.peek();
            var spaces = '  ';
            var matches = line.match(new RegExp("^" + spaces + "export function\\s*(\\w+)(.*)\\s*$"));
            if (matches) {
                var all = matches[0], functionName = matches[1], paramsData = matches[2];
                this.get();
                var outFunctionName = this.acceptId(functionName, IdTypes.FunctionName);
                if (!outFunctionName) {
                    return;
                }
                var params = paramsData;
                while (!params.endsWith('{')) {
                    var nextLine = this.get().trimRight();
                    params += '\n' + nextLine;
                }
                params = params.replace(/\s*\{$/, ';\n');
                var outLine = spaces + "export function " + outFunctionName + params;
                this.addWithJsDocs(outLine, '\n');
            }
        };
        LinesParser.prototype.parseMethods = function (dataSpaces) {
            var line = this.peek();
            var matches = line.match(new RegExp("^" + dataSpaces + "(abstract )?(get )?(\\w+)\\("));
            if (matches) {
                var abstractKeyWord = matches[1], getterKeyword = matches[2], functionName = matches[3];
                var isGetter = getterKeyword !== undefined;
                var isAbstract = abstractKeyWord !== undefined;
                var outFunctionName = this.acceptId(functionName, IdTypes.MethodName);
                if (!outFunctionName) {
                    return;
                }
                // this.docParser.addId(outFunctionName, DocIdType.MethodName);
                var funcCodeEndRegEx = /\}\s*$/;
                // @WARN: The starting \s* is required
                var funcCodeStartRegEx = /\s*\{\s*$/;
                if (isAbstract) {
                    line = line.replace(/abstract /, '');
                    this.set(line);
                    funcCodeEndRegEx = /\;\s*$/;
                    funcCodeStartRegEx = funcCodeEndRegEx;
                }
                var outFuncLines = [];
                var outFuncText = '';
                var index = 0;
                if (line.search(funcCodeEndRegEx) === -1) {
                    // multi-line function
                    while (this.peek(index).search(funcCodeStartRegEx) === -1) {
                        outFuncLines.push(this.peek(index));
                        index++;
                    }
                    outFuncLines.push(this.peek(index));
                    outFuncText = outFuncLines.join('\n');
                    if (!isAbstract) {
                        outFuncText = outFuncText.replace(/\s*\{\s*$/, ';');
                    }
                }
                else {
                    // single line function
                    outFuncText = line;
                    if (!isAbstract) {
                        outFuncText = outFuncText.replace(/\s*\{.*$/, ';');
                    }
                }
                if (isGetter) {
                    outFuncText = outFuncText.replace(/^(\s*)get (\w+)\(\)/, '$1$2');
                }
                this.addWithJsDocs(outFuncText, '\n');
                this.lineI += index;
            }
        };
        LinesParser.prototype.parseClassWithImplements = function () {
            var line = this.peek();
            var matches = line.match(/^(\s*)export (?:abstract )?class (\w+)\s+(?:\extends\s+(\w+))?\s*implements\s+(\w+)\s*\{/);
            if (matches) {
                var spaces = matches[1], className = matches[2], parentClass = matches[3];
                var outClassName = this.acceptId(className, IdTypes.ClassName);
                if (!outClassName) {
                    return;
                }
                console.log("Adding Class \"" + outClassName + "\"");
                var outParentWords = parentClass ? this.acceptId("extends " + parentClass + " ", IdTypes.ExtendsWords) : '';
                var outLine = spaces + "export interface " + outClassName + " " + outParentWords + "{";
                // this.docParser.addId(outClassName.replace(/\s+extends.*$/, ''), DocIdType.InterfaceName);
                this.addWithJsDocs(outLine, '');
                this.get();
                var dataSpaces = spaces + spaces;
                var endReg = new RegExp('^' + spaces + '}');
                while (this.peek().search(endReg) === -1) {
                    this.parseProperties(dataSpaces);
                    this.parseMethods(dataSpaces);
                    this.get();
                }
                this.addOutLine(spaces + '}\n');
            }
        };
        // @HINT: This code is not used at the moment but it can have future uses
        LinesParser.prototype.parseRules = function () {
            var line = this.peek();
            var matches = line.match(/^\s*\/\/\s*#generator-rule:\s*(\w+)\s+(.*)\s*$/);
            if (matches) {
                this.rules[matches[1]] = matches[2];
            }
        };
        LinesParser.prototype.parseGroupSection = function () {
            var line = this.peek();
            var matches = line.match(/^\s*\/\/\s*#generate-group-section\s*$/);
            if (matches) {
                this.get();
                while (this.peek().trim()) {
                    this.queueLines.push(this.get());
                }
                this.queueLines.push('');
            }
        };
        LinesParser.prototype.parseExportSection = function () {
            var line = this.peek();
            var matches = line.match(/^\s*\/\/\s*#export-section-start\s*:\s*([\w\-]+)\s*$/);
            if (matches && matches[1] === this.tag) {
                console.log("Exporting section " + this.tag + " from \"" + this.fileName + "\"");
                this.get();
                while (this.peek().indexOf('#export-section-end') === -1) {
                    this.addOutLine(this.get());
                }
                this.addOutLine('');
            }
        };
        LinesParser.prototype.parseLine = function () {
            this.parseRules();
            this.parseGroupSection();
            this.parseFunctions();
            if (!this.tag) {
                this.parseClassWithImplements();
            }
            else {
                this.parseExportSection();
            }
        };
        return LinesParser;
    }());
    function build(fileList, outputFileName, preText, postText, acceptId, tag, docsPath) {
        var outLines = [];
        fileList.forEach(function (fileName) {
            console.log("Parsing " + fileName);
            var parser = new LinesParser(fsix_js_1.fsix.readUtf8Sync(fileName).split('\n'), acceptId, tag, fileName);
            while (!parser.finished()) {
                parser.parseLine();
                parser.get();
            }
            if (docsPath !== undefined && parser.outLines.length) {
                var docFileTitle = sysPath.posix.basename(fileName).replace(/\.\w+$/, '');
                sysFs.writeFileSync(docsPath + "/" + docFileTitle + ".txt", parser.outLines.join('\n'));
            }
            outLines = outLines.concat(parser.outLines);
        });
        sysFs.writeFileSync(outputFileName, (preText || '') + outLines.join('\n') + (postText || ''));
    }
    BuildDTsFiles.build = build;
})(BuildDTsFiles = exports.BuildDTsFiles || (exports.BuildDTsFiles = {}));
//# sourceMappingURL=build-d-ts.js.map