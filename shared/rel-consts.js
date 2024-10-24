"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var rel_consts_exports = {};
__export(rel_consts_exports, {
  RelConsts: () => RelConsts
});
module.exports = __toCommonJS(rel_consts_exports);
var RelConsts;
((RelConsts2) => {
  RelConsts2.DEFAULT_WIDTH = 640;
  RelConsts2.DEFAULT_HEIGHT = 480;
  RelConsts2.DEFAULT_FPS = 25;
  RelConsts2.DEFAULT_SERVER = "puppeteer";
  RelConsts2.NODE_SERVERS = ["puppeteer"];
  RelConsts2.SUPPORTED_SERVERS = ["phantomjs", "slimerjs", "puppeteer"];
})(RelConsts || (RelConsts = {}));
//# sourceMappingURL=rel-consts.js.map
