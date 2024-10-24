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
var import_fsix = require("../shared/vendor/fsix.js");
var sysProcess = __toESM(require("process"));
var Tests;
((Tests2) => {
  const toRunInSerial = sysProcess.argv.join(" ").search(/--serial/) !== -1;
  const tests = JSON.parse(import_fsix.fsix.readUtf8Sync(`${__dirname}/test-list.json`));
  console.log(tests);
  if (!toRunInSerial) {
    tests.active.forEach((test) => {
      require(`./tests/${test}.js`);
    });
  } else {
    const activeTestFiles = tests.active.map((test) => `${__dirname}/tests/${test}.js`);
    const sm = require("happner-serial-mocha");
    const logFolder = `${__dirname}/log`;
    sm.runTasks(activeTestFiles, null, logFolder).then((_results) => {
      console.log(`The log report files are on ${logFolder}`);
    }).catch((err) => console.log(err));
  }
})(Tests || (Tests = {}));
