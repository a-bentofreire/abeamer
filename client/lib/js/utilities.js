"use strict";
var ABeamer;
((ABeamer2) => {
  let RoundFuncName;
  ((RoundFuncName2) => {
    RoundFuncName2[RoundFuncName2["none"] = 0] = "none";
    RoundFuncName2[RoundFuncName2["round"] = 1] = "round";
    RoundFuncName2[RoundFuncName2["ceil"] = 2] = "ceil";
    RoundFuncName2[RoundFuncName2["floor"] = 3] = "floor";
    RoundFuncName2[RoundFuncName2["downRound"] = 4] = "downRound";
  })(RoundFuncName = ABeamer2.RoundFuncName || (ABeamer2.RoundFuncName = {}));
  function parseRoundFunc(handler) {
    if (handler === void 0) {
      return void 0;
    }
    if (typeof handler === "string") {
      handler = RoundFuncName[handler];
    } else if (typeof handler === "function") {
      return handler;
    }
    switch (handler) {
      case 1 /* round */:
        return Math.round;
      case 4 /* downRound */:
        return downRound;
      case 2 /* ceil */:
        return Math.ceil;
      case 3 /* floor */:
        return Math.floor;
    }
    return void 0;
  }
  ABeamer2.parseRoundFunc = parseRoundFunc;
  function _applyRoundFunc(values, f) {
    return f ? values.map((value) => f(value)) : values;
  }
  ABeamer2._applyRoundFunc = _applyRoundFunc;
  function parseHandler(handler, defaultHandler, _mapper, args) {
    if (handler === void 0) {
      if (!defaultHandler) {
        return void 0;
      }
      handler = defaultHandler;
    }
    if (typeof handler === "string") {
      const exprValue = ifExprCalc(handler, args);
      if (exprValue !== void 0) {
        handler = exprValue;
      }
    }
    if (typeof handler === "function") {
      return handler(args);
    } else {
      return handler;
    }
  }
  ABeamer2.parseHandler = parseHandler;
  function parseEnum(value, mapper, defValue) {
    if (value === void 0) {
      value = defValue;
    }
    return value === void 0 ? defValue : typeof value === "string" ? mapper[value] : value;
  }
  ABeamer2.parseEnum = parseEnum;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=utilities.js.map
