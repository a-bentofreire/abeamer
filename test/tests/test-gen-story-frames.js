"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var sysFs = __toESM(require("fs"));
var import_chai = require("chai");
var import_exact = require("../exact.js");
var import_fsix = require("../../shared/vendor/fsix.js");
var import_sprintf = require("../../shared/lib/sprintf.js");
var Tests;
((Tests2) => {
  const builder = new import_exact.Exact.TestBuilder();
  builder.fps = 4;
  builder.addTests([{
    min: 0,
    max: 10,
    elDuration: "3s"
  }]);
  const inMacros = builder.getInMacros();
  inMacros.css = "";
  builder.runTestParams = {
    "generates the story-frames": (rd, done) => {
      const total = builder.tests[0].frameCount;
      for (let i = 0; i < total; i++) {
        const file = import_sprintf.Sprintf.sprintf(
          `${rd.outFolder}/story-frames/frame%05d.png`,
          i
        );
        import_chai.assert.isTrue(sysFs.existsSync(file));
      }
      done();
    },
    "generates the report": (rd, done) => {
      const reportFile = `${rd.outFolder}/story-frames/frame-report.json`;
      import_chai.assert.isTrue(sysFs.existsSync(reportFile));
      const report = import_fsix.fsix.loadJsonSync(reportFile);
      import_chai.assert.equal(report.width, 100, `width must be 100`);
      import_chai.assert.equal(report.height, 100, `height must be 100`);
      done();
    }
  };
  import_exact.Exact.runTestSuite(
    __filename,
    inMacros,
    {
      toGenFrames: true,
      toDelPreviousFrames: true,
      tests: builder.runTestParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-gen-story-frames.js.map
