"use strict";
var ABeamer;
((ABeamer2) => {
  pluginManager.addPlugin({
    id: "abeamer.statistic-functions",
    uuid: "65d49e17-e471-4f91-9643-8c6f13ec8d79",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/statistic-functions/statistic-functions.js"],
    teleportable: true
  });
  function _statCommon(params, req, f) {
    arrayInputHelper(params, req, void 0, void 0, f);
  }
  function _meanFunc(arr) {
    return arr.reduce((sum, v) => sum + v, 0) / arr.length;
  }
  function _varianceFunc(arr) {
    const mean = _meanFunc(arr);
    const totalDev = arr.reduce((dev, v) => dev + Math.abs(v - mean) ** 2, 0);
    return totalDev / (arr.length - 1);
  }
  function _min(params, req) {
    _statCommon(params, req, (arr) => Math.min(...arr));
  }
  function _max(params, req) {
    _statCommon(params, req, (arr) => Math.max(...arr));
  }
  function _mean(params, req) {
    _statCommon(params, req, _meanFunc);
  }
  function _median(params, req) {
    _statCommon(params, req, (arr) => {
      arr.sort((a, b) => b < a);
      const center = Math.floor(arr.length / 2);
      return arr.length % 2 ? arr[center] : (arr[center - 1] + arr[center]) / 2;
    });
  }
  function _std(params, req) {
    _statCommon(params, req, (arr) => Math.sqrt(_varianceFunc(arr)));
  }
  function _var(params, req) {
    _statCommon(params, req, _varianceFunc);
  }
  function _sort(params, req) {
    _statCommon(
      params,
      req,
      (arr) => arr.sort((a, b) => b < a)
    );
  }
  function _sortDesc(params, req) {
    _statCommon(
      params,
      req,
      (arr) => arr.sort((a, b) => b > a)
    );
  }
  pluginManager.addFunctions([
    ["min", _min],
    ["max", _max],
    ["mean", _mean],
    ["median", _median],
    ["std", _std],
    ["var", _var],
    ["sort", _sort],
    ["sortDesc", _sortDesc]
  ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=statistic-functions.js.map
