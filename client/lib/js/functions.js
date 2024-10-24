"use strict";
var ABeamer;
((ABeamer2) => {
  let ExFuncParamType;
  ((ExFuncParamType2) => {
    ExFuncParamType2[ExFuncParamType2["Any"] = 0] = "Any";
    ExFuncParamType2[ExFuncParamType2["Number"] = 1] = "Number";
    ExFuncParamType2[ExFuncParamType2["String"] = 2] = "String";
    ExFuncParamType2[ExFuncParamType2["Array"] = 3] = "Array";
  })(ExFuncParamType = ABeamer2.ExFuncParamType || (ABeamer2.ExFuncParamType = {}));
  ABeamer2._exFunctions = {};
  function _math1ParamFunc(params, req, f) {
    arrayInputHelper(params, req, 1, void 0, f);
  }
  function _str1ParamFunc(params, req, f) {
    req.checkParams(req, 1, [2 /* String */]);
    req.res.paType = 2 /* String */;
    req.res.sValue = f(params[0].sValue);
  }
  ABeamer2._exFunctions["sin"] = (params, req) => {
    _math1ParamFunc(params, req, Math.sin);
  };
  ABeamer2._exFunctions["cos"] = (params, req) => {
    _math1ParamFunc(params, req, Math.cos);
  };
  ABeamer2._exFunctions["tan"] = (params, req) => {
    _math1ParamFunc(params, req, Math.tan);
  };
  ABeamer2._exFunctions["round"] = (params, req) => {
    _math1ParamFunc(params, req, Math.round);
  };
  ABeamer2._exFunctions["downRound"] = (params, req) => {
    _math1ParamFunc(params, req, downRound);
  };
  ABeamer2._exFunctions["ceil"] = (params, req) => {
    _math1ParamFunc(params, req, Math.ceil);
  };
  ABeamer2._exFunctions["floor"] = (params, req) => {
    _math1ParamFunc(params, req, Math.floor);
  };
  ABeamer2._exFunctions["sqrt"] = (params, req) => {
    _math1ParamFunc(params, req, Math.sqrt);
  };
  ABeamer2._exFunctions["exp"] = (params, req) => {
    _math1ParamFunc(params, req, Math.exp);
  };
  ABeamer2._exFunctions["log"] = (params, req) => {
    _math1ParamFunc(params, req, Math.log);
  };
  ABeamer2._exFunctions["log10"] = (params, req) => {
    _math1ParamFunc(params, req, Math.log10);
  };
  ABeamer2._exFunctions["abs"] = (params, req) => {
    _math1ParamFunc(params, req, Math.abs);
  };
  ABeamer2._exFunctions["sign"] = (params, req) => {
    _math1ParamFunc(params, req, (v) => v < 0 ? -1 : v > 0 ? 1 : 0);
  };
  ABeamer2._exFunctions["random"] = (_params, req) => {
    req.checkParams(req, 0);
    req.res.paType = 1 /* Number */;
    req.res.numValue = Math.random();
  };
  ABeamer2._exFunctions["toNumber"] = (params, req) => {
    req.checkParams(req, 1, [2 /* String */]);
    req.res.paType = 1 /* Number */;
    req.res.numValue = parseFloat(params[0].sValue);
  };
  ABeamer2._exFunctions["toString"] = (params, req) => {
    req.checkParams(req, 1, [1 /* Number */]);
    req.res.paType = 2 /* String */;
    req.res.sValue = params[0].numValue.toString();
  };
  ABeamer2._exFunctions["uppercase"] = (params, req) => {
    _str1ParamFunc(params, req, (s) => s.toUpperCase());
  };
  ABeamer2._exFunctions["lowercase"] = (params, req) => {
    _str1ParamFunc(params, req, (s) => s.toUpperCase());
  };
  ABeamer2._exFunctions["capitalize"] = (params, req) => {
    _str1ParamFunc(params, req, (s) => s.replace(/\b(\w)/, (_all, p) => p.toUpperCase()));
  };
  ABeamer2._exFunctions["substr"] = (params, req) => {
    req.checkParams(req, 3, [2 /* String */, 1 /* Number */, 1 /* Number */]);
    req.res.paType = 2 /* String */;
    req.res.sValue = params[0].sValue.substr(
      params[1].numValue,
      params[2].numValue < 0 ? void 0 : params[2].numValue
    );
  };
  ABeamer2._exFunctions["iff"] = (params, req) => {
    req.checkParams(req, 3, [1 /* Number */, 0 /* Any */, 0 /* Any */]);
    const res = params[params[0].numValue ? 1 : 2];
    req.res.paType = res.paType;
    req.res.sValue = res.sValue;
    req.res.numValue = res.numValue;
  };
  ABeamer2._exFunctions["case"] = (params, req) => {
    const res = params[Math.round(params[0].numValue) + 1];
    req.res.paType = res.paType;
    req.res.sValue = res.sValue;
    req.res.numValue = res.numValue;
  };
  ABeamer2._exFunctions["get"] = (params, req) => {
    req.checkParams(req, 2, [3 /* Array */, 1 /* Number */]);
    const index = Math.round(params[1].numValue);
    const arr = params[0].arrayValue;
    if (index < 0 || index >= arr.length) {
      throwErr("Invalid indexing");
    }
    req.res.paType = 1 /* Number */;
    req.res.numValue = arr[index];
  };
  ABeamer2._exFunctions["slice"] = (params, req) => {
    req.checkParams(req, 3, [3 /* Array */, 1 /* Number */, 1 /* Number */]);
    const start = Math.round(params[1].numValue);
    const end = Math.round(params[2].numValue);
    const arr = params[0].arrayValue;
    if (start < 0 || start >= arr.length || end < 0 || end >= arr.length) {
      throwErr("Invalid indexing");
    }
    req.res.paType = 3 /* Array */;
    req.res.arrayValue = arr.slice(start, end);
  };
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=functions.js.map
