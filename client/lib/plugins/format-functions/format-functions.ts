"use strict";
// uuid: 1e34096b-c7ae-4205-b08f-629497d2c4e7

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Implements a list of format functions

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * This plugin has the following format functions:
 *
 * `numToStr` - converts a number (with grouping) to string. the input is value, optional locale.
 * `nogrpToStr` - converts a number (no grouping) to string. the input is value, optional locale.
 * `currToStr` - converts a number to currency string. the input is value, optional locale, optional currency name.
 *
 *  If no locale is defined the default locale is used.
 *  For `currToStr`, the default currency is `USD`,
 *  to change this value it must define the locale.
 *
 * ## Examples
 * ```
 * =numToStr(4000.45)
 * // returns "4,000.45"
 * =nogrpToStr(4000.45)
 * // returns "4000.45"
 * =currToStr(4000.45, 'pt-PT', 'EUR')
 * // returns "1 500,50 €"
 * ```
 *
 */
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'abeamer.format-functions',
    uuid: 'c386e3e7-9dec-48a3-996d-ab55e591cd5d',
    author: 'Alexandre Bento Freire',
    email: 'abeamer@a-bentofreire.com',
    jsUrls: ['plugins/format-functions/format-functions.js'],
    teleportable: true,
  });

  // ------------------------------------------------------------------------
  //                               format functions
  // ------------------------------------------------------------------------

  function _formatCommon(params: ExprFuncParams, req: ExFuncReq, maxParam: int,
    f: (v: number, locale: string, currency?: string) => string): void {

    req.checkParams(req, Math.min(Math.max(1, params.length), maxParam),
      [ExFuncParamType.Number, ExFuncParamType.String, ExFuncParamType.String]
        .slice(0, params.length));

    const v = params[0].numValue;
    const locale = params.length > 1 ? params[1].sValue : undefined;
    const currency = params.length > 2 ? params[2].sValue : 'USD';
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = f(v, locale, currency);
  }


  function _numToStr(params: ExprFuncParams, req?: ExFuncReq): void {
    _formatCommon(params, req, 2, (v: number, locale: string) =>
      new Intl.NumberFormat(locale, { useGrouping: true } as any).format(v));
  }


  function _nogrpToStr(params: ExprFuncParams, req?: ExFuncReq): void {
    _formatCommon(params, req, 2, (v: number, locale: string) =>
      new Intl.NumberFormat(locale, { useGrouping: false } as any).format(v));
  }


  function _currToStr(params: ExprFuncParams, req?: ExFuncReq): void {
    _formatCommon(params, req, 3, (v: number, locale: string, currency: string) =>
      new Intl.NumberFormat(locale, {
        useGrouping: true,
        style: 'currency', currency,
      } as any).format(v));
  }


  pluginManager.addFunctions([
    ['numToStr', _numToStr], ['nogrpToStr', _nogrpToStr], ['currToStr', _currToStr],
  ]);
}
