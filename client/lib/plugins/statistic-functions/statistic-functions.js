"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of statistical functions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * This plugin has the following statistical functions:
 *
 * - `min` - minimum of an array.
 * - `max` - maximum of an array.
 * - `mean` - Arithmetic mean.
 * - `median` - statistical median.
 * - `std` - standard deviation.
 * - `var` - variance.
 * - `sort` - sort ascending.
 * - `sortDesc` - sort descending.
 *
 * It supports the input both as a list of numerical arguments and single array.
 *
 * ## Examples
 *
 * `=min(4, 60, 2, 8)`
 * `=max([4, 60, 2, 8])`
 * `=std([4, 60]+[12, 4])`
 *
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.statistic-functions',
        uuid: '65d49e17-e471-4f91-9643-8c6f13ec8d79',
        author: 'Alexandre Bento Freire',
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/statistic-functions/statistic-functions.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               shared functions
    // ------------------------------------------------------------------------
    function _statCommon(params, req, f) {
        ABeamer.arrayInputHelper(params, req, undefined, undefined, f);
    }
    function _meanFunc(arr) {
        return (arr.reduce(function (sum, v) { return sum + v; }, 0) / arr.length);
    }
    function _varianceFunc(arr) {
        var mean = _meanFunc(arr);
        var totalDev = arr.reduce(function (dev, v) { return dev + (Math.pow((Math.abs(v - mean)), 2)); }, 0);
        return totalDev / (arr.length - 1);
    }
    // ------------------------------------------------------------------------
    //                               statistic functions
    // ------------------------------------------------------------------------
    function _min(params, req) {
        _statCommon(params, req, function (arr) { return Math.min.apply(Math, arr); });
    }
    function _max(params, req) {
        _statCommon(params, req, function (arr) { return Math.max.apply(Math, arr); });
    }
    function _mean(params, req) {
        _statCommon(params, req, _meanFunc);
    }
    function _median(params, req) {
        _statCommon(params, req, function (arr) {
            arr.sort(function (a, b) { return (b < a); });
            var center = Math.floor(arr.length / 2);
            return (arr.length % 2) ? arr[center] : (arr[center - 1] + arr[center]) / 2.0;
        });
    }
    function _std(params, req) {
        _statCommon(params, req, function (arr) { return Math.sqrt(_varianceFunc(arr)); });
    }
    function _var(params, req) {
        _statCommon(params, req, _varianceFunc);
    }
    function _sort(params, req) {
        _statCommon(params, req, function (arr) { return arr.sort(function (a, b) { return (b < a); }); });
    }
    function _sortDesc(params, req) {
        _statCommon(params, req, function (arr) { return arr.sort(function (a, b) { return (b > a); }); });
    }
    ABeamer.pluginManager.addFunctions([
        ['min', _min], ['max', _max],
        ['mean', _mean], ['median', _median], ['std', _std], ['var', _var],
        ['sort', _sort], ['sortDesc', _sortDesc],
    ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=statistic-functions.js.map