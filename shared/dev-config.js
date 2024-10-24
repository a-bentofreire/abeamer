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
var dev_config_exports = {};
__export(dev_config_exports, {
  DevCfg: () => DevCfg
});
module.exports = __toCommonJS(dev_config_exports);
var yaml = __toESM(require("js-yaml"));
var import_fsix = require("./vendor/fsix.js");
var DevCfg;
((DevCfg2) => {
  let cfg;
  function getConfig(projPath) {
    if (!cfg) {
      cfg = yaml.load(import_fsix.fsix.readUtf8Sync("./config.yaml"), yaml.DEFAULT_FULL_SCHEMA);
      cfg.paths.PROJ_PATH = import_fsix.fsix.toPosixSlash(projPath);
      cfg.release.demosStr = cfg.release.demos.length > 1 ? `{${cfg.release.demos.join(",")}}` : cfg.release.demos[0];
      expandMap(cfg.webLinks);
      expandMap(cfg.paths);
    }
    return cfg;
  }
  DevCfg2.getConfig = getConfig;
  function expandMacro(value) {
    let changed = false;
    do {
      changed = false;
      value = value.replace(/\${(\w+)}/g, (_all, key) => {
        changed = true;
        return cfg.macros[key] || cfg.paths[key];
      });
    } while (changed);
    return value;
  }
  DevCfg2.expandMacro = expandMacro;
  function expandMap(map) {
    Object.keys(map).forEach((key) => {
      map[key] = expandMacro(map[key]);
    });
    return map;
  }
  DevCfg2.expandMap = expandMap;
  function expandArray(arr) {
    arr.forEach((value, index) => {
      arr[index] = expandMacro(value);
    });
    return arr;
  }
  DevCfg2.expandArray = expandArray;
})(DevCfg || (DevCfg = {}));
//# sourceMappingURL=dev-config.js.map
