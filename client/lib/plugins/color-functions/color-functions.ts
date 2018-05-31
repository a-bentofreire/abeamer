"use strict";
// uuid: 57f31321-69a9-4170-96a1-6baac731403b

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Implements a list of built-in text Tasks

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 *
 * This plugin has the following color functions:
 *
 * - `rgb` - returns the 6 characters lowercase hexadecimal of R, G, B.
 *  Each input goes from [0, 255].
 *
 * - `rgba` - returns the 8 characters lowercase hexadecimal of R, G, B, A.
 *  R,G,B goes from [0, 255], and A goes from 0 to 1.
 */
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'abeamer.color-functions',
    uuid: 'ce739c9f-13ba-4742-b1c3-dec56624be7d',
    author: 'Alexandre Bento Freire',
    email: 'dev@a-bentofreire.com',
    jsUrls: ['plugins/color-functions/color-functions.js'],
    teleportable: true,
  });

  // ------------------------------------------------------------------------
  //                               Functions
  // ------------------------------------------------------------------------

  function _rgbaCommon(params: ExprFuncParams, req: ExFuncReq,
    nrParams: uint, paramTypes: ExFuncParamType[]): void {

    req.checkParams(req, nrParams, paramTypes);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue =
      params.map((pa, index) => {
        let numValue = pa.numValue;
        if (index === 3) {
          numValue = numValue * 255;
        }
        numValue = Math.round(Math.max(Math.min(numValue, 255), 0));
        const v = numValue.toString(16);
        return v.length < 2 ? '0' + v : v;
      }).join('');
  }


  function _rgb(params: ExprFuncParams, req?: ExFuncReq): void {
    _rgbaCommon(params, req, 3, [ExFuncParamType.Number,
    ExFuncParamType.Number, ExFuncParamType.Number]);
  }


  function _rgba(params: ExprFuncParams, req?: ExFuncReq): void {
    _rgbaCommon(params, req, 4, [ExFuncParamType.Number,
    ExFuncParamType.Number, ExFuncParamType.Number, ExFuncParamType.Number]);
  }


  pluginManager.addFunctions([['rgb', _rgb], ['rgba', _rgba]]);
}
