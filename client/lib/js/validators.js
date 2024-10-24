"use strict";
var ABeamer;
((ABeamer2) => {
  function throwErr(msg) {
    throw msg;
  }
  ABeamer2.throwErr = throwErr;
  function throwI8n(msg, params) {
    throwErr(i8nMsg(msg, params));
  }
  ABeamer2.throwI8n = throwI8n;
  function throwIf(isTrue, msg) {
    if (isTrue) {
      throwErr(msg);
    }
  }
  ABeamer2.throwIf = throwIf;
  function throwIfI8n(isTrue, msg, params) {
    if (isTrue) {
      throwErr(i8nMsg(msg, params));
    }
  }
  ABeamer2.throwIfI8n = throwIfI8n;
  ABeamer2.isPositiveNatural = (value) => typeof value === "number" && value > 0 && Math.abs(Math.floor(value) - value) < 1e-7;
  ABeamer2.isNotNegativeNatural = (value) => typeof value === "number" && value >= 0 && Math.abs(Math.floor(value) - value) < 1e-7;
  ABeamer2.isPositive = (value) => typeof value === "number" && value > 0;
  ABeamer2.isNotNegative = (value) => typeof value === "number" && value >= 0;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=validators.js.map
