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
var sprintf_exports = {};
__export(sprintf_exports, {
  Sprintf: () => Sprintf
});
module.exports = __toCommonJS(sprintf_exports);
var Sprintf;
((Sprintf2) => {
  function downRound(v) {
    return Math.round(v - 1e-4);
  }
  Sprintf2.downRound = downRound;
  function sprintf(format, ...values) {
    let valueIndex = 0;
    return format.replace(
      /%(0*)((?:[1-9])?)([dfx])(?:\^([rfcd]))?/g,
      (_all, hasZeros, strNumDigits, specifier, roundFunc) => {
        let out;
        let strNumber;
        let value = values[valueIndex++];
        if (roundFunc) {
          switch (roundFunc) {
            case "r":
              value = Math.round(value);
              break;
            case "d":
              value = downRound(value);
              break;
            case "c":
              value = Math.ceil(value);
              break;
            case "f":
              value = Math.floor(value);
              break;
          }
        }
        switch (specifier) {
          case "d":
            strNumber = (roundFunc ? value : Math.floor(value)).toString();
            break;
          case "f":
            strNumber = value.toString();
            break;
          case "x":
            strNumber = value.toString(16);
            break;
        }
        out = strNumber;
        if (strNumDigits) {
          const numDigits = parseInt(strNumDigits);
          if (numDigits > strNumber.length) {
            out = new Array(numDigits - strNumber.length + 1).join(
              hasZeros ? "0" : " "
            ) + out;
          }
        }
        return out;
      }
    );
  }
  Sprintf2.sprintf = sprintf;
})(Sprintf || (Sprintf = {}));
//# sourceMappingURL=sprintf.js.map
