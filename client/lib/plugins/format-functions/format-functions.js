"use strict";
var ABeamer;
((ABeamer2) => {
  pluginManager.addPlugin({
    id: "abeamer.format-functions",
    uuid: "c386e3e7-9dec-48a3-996d-ab55e591cd5d",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/format-functions/format-functions.js"],
    teleportable: true
  });
  function _formatCommon(params, req, maxParam, f) {
    req.checkParams(
      req,
      Math.min(Math.max(1, params.length), maxParam),
      [ExFuncParamType.Number, ExFuncParamType.String, ExFuncParamType.String].slice(0, params.length)
    );
    const v = params[0].numValue;
    const locale = params.length > 1 ? params[1].sValue : void 0;
    const currency = params.length > 2 ? params[2].sValue : "USD";
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = f(v, locale, currency);
  }
  function _numToStr(params, req) {
    _formatCommon(params, req, 2, (v, locale) => new Intl.NumberFormat(locale, { useGrouping: true }).format(v));
  }
  function _nogrpToStr(params, req) {
    _formatCommon(params, req, 2, (v, locale) => new Intl.NumberFormat(locale, { useGrouping: false }).format(v));
  }
  function _currToStr(params, req) {
    _formatCommon(params, req, 3, (v, locale, currency) => new Intl.NumberFormat(locale, {
      useGrouping: true,
      style: "currency",
      currency
    }).format(v));
  }
  pluginManager.addFunctions([
    ["numToStr", _numToStr],
    ["nogrpToStr", _nogrpToStr],
    ["currToStr", _currToStr]
  ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=format-functions.js.map
