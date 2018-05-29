"use strict";
// uuid: e27ba4bb-dcde-4cb8-8b9e-f67a989ed33a

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Implements a list of built-in functions

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * A **function** transforms zero or more textual or numerical parameters
 * into another value.
 * Functions are used inside an expression, and support remote rendering.
 * The user can create its own custom functions but only built-in functions
 * and official plugins can create functions that support [](remote-rendering).
 *
 * ## Built-in Functions
 *
 * ABeamer has the following built-in functions:
 *
 * - `sin` - 'sine' trigonometric function.
 * - `cos` - 'cosine' trigonometric function.
 * - `tan` - 'tangent' trigonometric function.
 *
 * - `round`.
 * - `ceil`- always rounds up.
 * - `floor`- always rounds down.
 * - `sqrt` - square root.
 * - `random` - random number between [0, 1].
 * - `rgb` - returns the 6 characters lowercase hexadecimal of R, G, B.
 *  Each input goes from [0, 255]
 *
 * - `toNumber` - converts a textual parameter into a numerical parameter.
 * - `toString` - converts a numerical parameter into a textual parameter.
 *
 * - `uppercase` - returns the uppercase of the textual parameter.
 * - `lowercase` - returns the lowercase of the textual parameter.
 * - `capitalize` -returns the uppercase of the first letter of each word
 * - `substr` - returns the a section of the 1st parameter.
 *  The 2nd parameter is the start value and the 3rd parameter is the length.
 *  If the 3rd parameter is less than 0, than is considered until the end.
 *
 * - `downRound` - similar to round, but it guaranties that if fractional
 * part is 0.5, it will always round down.
 *
 * - `iff` - if the 1st numerical parameter is different from 0,
 * it returns the 2nd parameter, otherwise it returns the 3rd paramter.
 * This function doesn't supports 'lazy calculation'.
 *
 * - `case` - the 1st numerical parameter is a zero index to select which 
 * parameters to return.
 * This function doesn't supports 'lazy calculation'.
 *
 * ## Examples
 *
 * @example = substr('ABeamer', 4, 4)
 * @example = round(12.4)
 *
 */
namespace ABeamer {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Functions
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  export const enum ExFuncParamType {
    Any,
    Number,
    String,
  }


  export interface ExFuncParam {
    paType?: ExFuncParamType;
    sValue?: string;
    numValue?: number;
  }


  export type _CheckParamFunc = (req: ExFuncReq, paramCount: uint,
    paramTypes?: ExFuncParamType[]) => void;


  export interface ExFuncReq {
    args: ABeamerArgs;
    req?: ExFuncReq;
    res?: ExFuncParam;

    checkParams: _CheckParamFunc;
  }


  export type ExprFuncParams = ExFuncParam[];

  export type ExFunction = (params: ExprFuncParams, req?: ExFuncReq) => void;

  // #export-section-end: release
  // -------------------------------

  export const _exFunctions: { [name: string]: ExFunction } = {};

  // ------------------------------------------------------------------------
  //                               Built-in functions
  // ------------------------------------------------------------------------

  /**
   * Generic handler for math functions that have 1 numerical input
   * and 1 numerical output.
   */
  function _math1ParamFunc(params: ExprFuncParams, req: ExFuncReq,
    f: (param1: number) => number) {

    req.checkParams(req, 1, [ExFuncParamType.Number]);
    req.res.paType = ExFuncParamType.Number;
    req.res.numValue = f(params[0].numValue);
  }


  /**
   * Generic handler for string functions that have 1 textual input
   * and 1 textual output.
   */
  function _str1ParamFunc(params: ExprFuncParams, req: ExFuncReq,
    f: (param1: string) => string) {

    req.checkParams(req, 1, [ExFuncParamType.String]);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = f(params[0].sValue);
  }


  _exFunctions['sin'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.sin);
  };


  _exFunctions['cos'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.cos);
  };


  _exFunctions['tan'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.tan);
  };


  _exFunctions['round'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.round);
  };


  _exFunctions['downRound'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, downRound);
  };


  _exFunctions['ceil'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.ceil);
  };


  _exFunctions['floor'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.floor);
  };


  _exFunctions['sqrt'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _math1ParamFunc(params, req, Math.sqrt);
  };


  _exFunctions['random'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 0);
    req.res.paType = ExFuncParamType.Number;
    req.res.numValue = Math.random();
  };


  _exFunctions['toNumber'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 1, [ExFuncParamType.String]);
    req.res.paType = ExFuncParamType.Number;
    req.res.numValue = parseFloat(params[0].sValue);
  };


  // @ts-ignore   TypeScript bug :-(
  _exFunctions['toString'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 1, [ExFuncParamType.Number]);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = params[0].numValue.toString();
  };


  _exFunctions['uppercase'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _str1ParamFunc(params, req, (s) => s.toUpperCase());
  };


  _exFunctions['lowercase'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _str1ParamFunc(params, req, (s) => s.toUpperCase());
  };


  _exFunctions['capitalize'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    _str1ParamFunc(params, req, (s) => s.replace(/\b(\w)/, (all, p) => p.toUpperCase()));
  };


  _exFunctions['substr'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 3, [ExFuncParamType.String, ExFuncParamType.Number, ExFuncParamType.Number]);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = params[0].sValue.substr(params[1].numValue,
      params[2].numValue < 0 ? undefined : params[2].numValue);
  };


  _exFunctions['rgb'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 3, [ExFuncParamType.Number, ExFuncParamType.Number, ExFuncParamType.Number]);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue =
      params.map(pa => {
        const v = pa.numValue.toString(16);
        return v.length < 2 ? '0' + v : v;
      }).join('');
  };


  _exFunctions['iff'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    req.checkParams(req, 3, [ExFuncParamType.Number, ExFuncParamType.Any, ExFuncParamType.Any]);
    const res = params[params[0].numValue ? 1 : 2];
    req.res.paType = res.paType;
    req.res.sValue = res.sValue;
    req.res.numValue = res.numValue;
  };

  _exFunctions['case'] = (params: ExprFuncParams, req?: ExFuncReq) => {
    // @TODO: check params
    const res = params[Math.round(params[0].numValue) + 1];
    req.res.paType = res.paType;
    req.res.sValue = res.sValue;
    req.res.numValue = res.numValue;
  };
}
