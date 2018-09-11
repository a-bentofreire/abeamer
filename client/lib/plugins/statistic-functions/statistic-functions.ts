"use strict";
// uuid: 4042dd08-a6a5-433a-91d0-686f97081e8a

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
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
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
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

  function _statCommon(params: ExprFuncParams, req: ExFuncReq,
    f: (arr: number[]) => number | number[]): void {

    arrayInputHelper(params, req, undefined, undefined, f);
  }


  function _meanFunc(arr: number[]): number {
    return (arr.reduce((sum, v) => sum + v, 0) / arr.length);
  }


  function _varianceFunc(arr: number[]): number {
    const mean = _meanFunc(arr);
    const totalDev = arr.reduce((dev, v) => dev + ((Math.abs(v - mean)) ** 2), 0);
    return totalDev / (arr.length - 1);
  }

  // ------------------------------------------------------------------------
  //                               statistic functions
  // ------------------------------------------------------------------------

  function _min(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, (arr: number[]) => Math.min(...arr));
  }


  function _max(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, (arr: number[]) => Math.max(...arr));
  }


  function _mean(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, _meanFunc);
  }


  function _median(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, (arr: number[]) => {
      arr.sort((a, b) => (b < a) as any);
      const center = Math.floor(arr.length / 2);
      return (arr.length % 2) ? arr[center] : (arr[center - 1] + arr[center]) / 2.0;
    });
  }


  function _std(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, (arr: number[]) => Math.sqrt(_varianceFunc(arr)));
  }


  function _var(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req, _varianceFunc);
  }


  function _sort(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req,
      (arr: number[]) => arr.sort((a, b) => (b < a) as any));
  }


  function _sortDesc(params: ExprFuncParams, req?: ExFuncReq): void {
    _statCommon(params, req,
      (arr: number[]) => arr.sort((a, b) => (b > a) as any));
  }


  pluginManager.addFunctions([
    ['min', _min], ['max', _max],
    ['mean', _mean], ['median', _median], ['std', _std], ['var', _var],
    ['sort', _sort], ['sortDesc', _sortDesc],
  ]);
}
