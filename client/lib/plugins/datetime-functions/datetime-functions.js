"use strict";
var ABeamer;
((ABeamer2) => {
  pluginManager.addPlugin({
    id: "abeamer.datetime-functions",
    uuid: "782cbaf4-1f1e-426c-bfbd-89c2f6ab4bbb",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/datetime-functions/datetime-functions.js"],
    teleportable: true
  });
  function _timeCommon(params, req, f) {
    req.checkParams(req, 1, [ExFuncParamType.Number]);
    req.res.paType = ExFuncParamType.Number;
    f(req.res, new Date(params[0].numValue));
  }
  function _now(_params, req) {
    req.checkParams(req, 0);
    req.res.paType = ExFuncParamType.Number;
    req.res.numValue = (/* @__PURE__ */ new Date()).valueOf();
  }
  function _date(params, req) {
    const paramCount = params.length;
    let dt;
    if (paramCount === 1 && params[0].paType === ExFuncParamType.String) {
      dt = new Date(params[0].sValue);
    } else if (paramCount === 3) {
      req.checkParams(req, 3, [ExFuncParamType.Number, ExFuncParamType.Number, ExFuncParamType.Number]);
      dt = new Date(params[0].numValue, params[1].numValue - 1, params[2].numValue);
    } else if (paramCount === 6) {
      req.checkParams(req, 6, [
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number
      ]);
      dt = new Date(
        params[0].numValue,
        params[1].numValue - 1,
        params[2].numValue,
        params[3].numValue,
        params[4].numValue,
        params[5].numValue
      );
    } else {
      req.checkParams(req, 1, [ExFuncParamType.String]);
    }
    req.res.paType = ExFuncParamType.Number;
    req.res.numValue = dt.valueOf();
  }
  function _formatDateTime(params, req) {
    const hasLocale = params.length === 3;
    req.checkParams(
      req,
      hasLocale ? 3 : 2,
      hasLocale ? [ExFuncParamType.String, ExFuncParamType.Number, ExFuncParamType.String] : [ExFuncParamType.String, ExFuncParamType.Number]
    );
    const frmt = params[0].sValue;
    const dt = new Date(params[1].numValue);
    const locale = hasLocale ? params[2].sValue : "en-us";
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = frmt.replace(/(\w)(\1*)/g, (p) => {
      function pad(v) {
        let s = v.toString();
        s = p.length === 2 && s.length < 2 ? "0" + s : s;
        return s;
      }
      function dayTime() {
        const hPM = dt.toLocaleString(locale, { hour: "2-digit", hour12: true });
        return hPM.substr(hPM.length - 2, 2);
      }
      switch (p) {
        case "YY":
          return (dt.getFullYear() % 100).toString();
        case "YYYY":
          return dt.getFullYear().toString();
        case "M":
        case "MM":
          return pad(dt.getMonth() + 1);
        case "MMM":
          return dt.toLocaleString(locale, { month: "short" });
        case "MMMM":
          return dt.toLocaleString(locale, { month: "long" });
        case "d":
          return dt.getDay().toString();
        case "ddd":
          return dt.toLocaleString(locale, { weekday: "short" });
        case "dddd":
          return dt.toLocaleString(locale, { weekday: "long" });
        case "D":
        case "DD":
          return pad(dt.getDate());
        case "H":
        case "HH":
          return pad(dt.getHours());
        case "h":
        case "hh":
          return pad(dt.getHours() % 12 || 12);
        case "m":
        case "mm":
          return pad(dt.getMinutes());
        case "s":
        case "ss":
          return pad(dt.getSeconds());
        case "A":
          return dayTime().toUpperCase();
        case "a":
          return dayTime().toLowerCase();
      }
      return p;
    });
  }
  function _year(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getFullYear();
    });
  }
  function _shortYear(params, req) {
    _year(params, req);
    req.res.numValue = req.res.numValue % 100;
  }
  function _month(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getMonth() + 1;
    });
  }
  function _day(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getDate();
    });
  }
  function _hour(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getHours();
    });
  }
  function _minute(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getMinutes();
    });
  }
  function _second(params, req) {
    _timeCommon(params, req, (res, dt) => {
      res.numValue = dt.getSeconds();
    });
  }
  pluginManager.addFunctions([
    ["now", _now],
    ["date", _date],
    ["formatDateTime", _formatDateTime],
    ["year", _year],
    ["shortYear", _shortYear],
    ["month", _month],
    ["day", _day],
    ["hour", _hour],
    ["minute", _minute],
    ["second", _second]
  ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=datetime-functions.js.map
