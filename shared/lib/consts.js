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
var consts_exports = {};
__export(consts_exports, {
  Consts: () => Consts
});
module.exports = __toCommonJS(consts_exports);
var Consts;
((Consts2) => {
  Consts2.LT_MSG = 0;
  Consts2.LT_WARN = 1;
  Consts2.LT_ERROR = 2;
  Consts2.LL_SILENT = 0;
  Consts2.LL_ERROR = 1;
  Consts2.LL_WARN = 2;
  Consts2.LL_VERBOSE = 3;
  Consts2.AS_UNKNOWN = 0;
  Consts2.AS_ADD_ANIMATION = 1;
  Consts2.AS_RENDERING = 2;
  Consts2.AS_STORY = 3;
})(Consts || (Consts = {}));
//# sourceMappingURL=consts.js.map
