"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var build_d_ts_exports = {};
__export(build_d_ts_exports, {
  BuildDTsFiles: () => BuildDTsFiles
});
module.exports = __toCommonJS(build_d_ts_exports);
var sysFs = __toESM(require("fs"));
var sysPath = __toESM(require("path"));
var import_fsix = require("../vendor/fsix.js");
var BuildDTsFiles;
((BuildDTsFiles2) => {
  let IdTypes;
  ((IdTypes2) => {
    IdTypes2[IdTypes2["ClassName"] = 0] = "ClassName";
    IdTypes2[IdTypes2["MethodName"] = 1] = "MethodName";
    IdTypes2[IdTypes2["FunctionName"] = 2] = "FunctionName";
    IdTypes2[IdTypes2["VarName"] = 3] = "VarName";
    IdTypes2[IdTypes2["ExtendsWords"] = 4] = "ExtendsWords";
    IdTypes2[IdTypes2["JsDocs"] = 5] = "JsDocs";
  })(IdTypes = BuildDTsFiles2.IdTypes || (BuildDTsFiles2.IdTypes = {}));
  class LinesParser {
    constructor(inpLines, acceptId, tag, fileName) {
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
      this.finished = () => this.lineI >= this.inpLineCount;
      this.peek = (delta = 0) => this.inpLines[this.lineI + delta] || "";
      this.get = () => this.inpLines[this.lineI++] || "";
      this.set = (line) => this.inpLines[this.lineI] = line;
      this.inpLineCount = inpLines.length;
    }
    // output
    addOutLine(line) {
      if (this.queueLines.length) {
        this.outLines.push(this.queueLines.join("\n"));
        this.queueLines = [];
      }
      this.outLines.push(line);
    }
    addWithJsDocs(line, newLines = "") {
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
        let jsDocs = jsDocsLines.join("\n");
        jsDocs = jsDocs.replace(/(.*)#end-user (.*)\b\s*\n/g, (_all, pre, macro) => {
          if (macro === "@readonly") {
            line = line.replace(/^(\s*)(\w)/, "$1readonly $2");
          }
          return pre + macro + "\n";
        });
        jsDocs = this.acceptId(jsDocs, 5 /* JsDocs */);
        if (jsDocs) {
          this.addOutLine(jsDocs);
        }
        hasJsDocs = jsDocs !== "";
      }
      this.addOutLine(line);
      if (hasJsDocs) {
        this.addOutLine(newLines);
      }
    }
    parseProperties(dataSpaces) {
      const line = this.peek();
      const matches = line.match(new RegExp(`^${dataSpaces}(readonly )?(\\w+)(\\?)?\\s*:(.*)$`));
      if (matches) {
        const [, readonly, varName, optional, typeInfo] = matches;
        const outVarName = this.acceptId(varName, 3 /* VarName */);
        if (!outVarName) {
          return;
        }
        const outTypeInfo = typeInfo.replace(/ = .*/, ";");
        const outLine = `${dataSpaces}${readonly || ""}${varName}${optional || ""}:${outTypeInfo}`;
        this.addWithJsDocs(outLine, "\n");
      }
    }
    parseFunctions() {
      const line = this.peek();
      const spaces = "  ";
      const matches = line.match(new RegExp(`^${spaces}export function\\s*(\\w+)(.*)\\s*$`));
      if (matches) {
        const [, functionName, paramsData] = matches;
        this.get();
        const outFunctionName = this.acceptId(functionName, 2 /* FunctionName */);
        if (!outFunctionName) {
          return;
        }
        let params = paramsData;
        while (!params.endsWith("{")) {
          const nextLine = this.get().trimRight();
          params += "\n" + nextLine;
        }
        params = params.replace(/\s*\{$/, ";\n");
        const outLine = `${spaces}export function ${outFunctionName}${params}`;
        this.addWithJsDocs(outLine, "\n");
      }
    }
    parseMethods(dataSpaces) {
      let line = this.peek();
      const matches = line.match(new RegExp(`^${dataSpaces}(abstract )?(get )?(\\w+)\\(`));
      if (matches) {
        const [, abstractKeyWord, getterKeyword, functionName] = matches;
        const isGetter = getterKeyword !== void 0;
        const isAbstract = abstractKeyWord !== void 0;
        const outFunctionName = this.acceptId(functionName, 1 /* MethodName */);
        if (!outFunctionName) {
          return;
        }
        let funcCodeEndRegEx = /\}\s*$/;
        let funcCodeStartRegEx = /\s*\{\s*$/;
        if (isAbstract) {
          line = line.replace(/abstract /, "");
          this.set(line);
          funcCodeEndRegEx = /\;\s*$/;
          funcCodeStartRegEx = funcCodeEndRegEx;
        }
        const outFuncLines = [];
        let outFuncText = "";
        let index = 0;
        if (line.search(funcCodeEndRegEx) === -1) {
          while (this.peek(index).search(funcCodeStartRegEx) === -1) {
            outFuncLines.push(this.peek(index));
            index++;
          }
          outFuncLines.push(this.peek(index));
          outFuncText = outFuncLines.join("\n");
          if (!isAbstract) {
            outFuncText = outFuncText.replace(/\s*\{\s*$/, ";");
          }
        } else {
          outFuncText = line;
          if (!isAbstract) {
            outFuncText = outFuncText.replace(/\s*\{.*$/, ";");
          }
        }
        if (isGetter) {
          outFuncText = outFuncText.replace(
            /^(\s*)get (\w+)\(\)/,
            "$1$2"
          );
        }
        this.addWithJsDocs(outFuncText, "\n");
        this.lineI += index;
      }
    }
    parseClassWithImplements() {
      const line = this.peek();
      const matches = line.match(
        /^(\s*)export (?:abstract )?class (\w+)\s+(?:\extends\s+(\w+))?\s*implements\s+(\w+)\s*\{/
      );
      if (matches) {
        const [, spaces, className, parentClass] = matches;
        const outClassName = this.acceptId(className, 0 /* ClassName */);
        if (!outClassName) {
          return;
        }
        console.log(`Adding Class "${outClassName}"`);
        const outParentWords = parentClass ? this.acceptId(`extends ${parentClass} `, 4 /* ExtendsWords */) : "";
        const outLine = `${spaces}export interface ${outClassName} ${outParentWords}{`;
        this.addWithJsDocs(outLine, "");
        this.get();
        const dataSpaces = spaces + spaces;
        const endReg = new RegExp("^" + spaces + "}");
        while (this.peek().search(endReg) === -1) {
          this.parseProperties(dataSpaces);
          this.parseMethods(dataSpaces);
          this.get();
        }
        this.addOutLine(spaces + "}\n");
      }
    }
    // @HINT: This code is not used at the moment but it can have future uses
    parseRules() {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#generator-rule:\s*(\w+)\s+(.*)\s*$/);
      if (matches) {
        this.rules[matches[1]] = matches[2];
      }
    }
    parseGroupSection() {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#generate-group-section\s*$/);
      if (matches) {
        this.get();
        while (this.peek().trim()) {
          this.queueLines.push(this.get());
        }
        this.queueLines.push("");
      }
    }
    parseExportSection() {
      const line = this.peek();
      const matches = line.match(/^\s*\/\/\s*#export-section-start\s*:\s*([\w\-]+)\s*$/);
      if (matches && matches[1] === this.tag) {
        console.log(`Exporting section ${this.tag} from "${this.fileName}"`);
        this.get();
        while (this.peek().indexOf("#export-section-end") === -1) {
          this.addOutLine(this.get());
        }
        this.addOutLine("");
      }
    }
    parseLine() {
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
  function build(fileList, outputFileName, preText, postText, acceptId, tag, docsPath) {
    let outLines = [];
    fileList.forEach((fileName) => {
      console.log(`Parsing ${fileName}`);
      const parser = new LinesParser(
        import_fsix.fsix.readUtf8Sync(fileName).split("\n"),
        acceptId,
        tag,
        fileName
      );
      while (!parser.finished()) {
        parser.parseLine();
        parser.get();
      }
      if (docsPath !== void 0 && parser.outLines.length) {
        const docFileTitle = sysPath.posix.basename(fileName).replace(/\.\w+$/, "");
        sysFs.writeFileSync(`${docsPath}/${docFileTitle}.txt`, parser.outLines.join("\n"));
      }
      outLines = outLines.concat(parser.outLines);
    });
    sysFs.writeFileSync(
      outputFileName,
      (preText || "") + outLines.join("\n") + (postText || "")
    );
  }
  BuildDTsFiles2.build = build;
})(BuildDTsFiles || (BuildDTsFiles = {}));
//# sourceMappingURL=build-d-ts.js.map
