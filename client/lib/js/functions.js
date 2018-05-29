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
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Functions
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    ABeamer._exFunctions = {};
    // ------------------------------------------------------------------------
    //                               Built-in functions
    // ------------------------------------------------------------------------
    /**
     * Generic handler for math functions that have 1 numerical input
     * and 1 numerical output.
     */
    function _math1ParamFunc(params, req, f) {
        req.checkParams(req, 1, [1 /* Number */]);
        req.res.paType = 1 /* Number */;
        req.res.numValue = f(params[0].numValue);
    }
    /**
     * Generic handler for string functions that have 1 textual input
     * and 1 textual output.
     */
    function _str1ParamFunc(params, req, f) {
        req.checkParams(req, 1, [2 /* String */]);
        req.res.paType = 2 /* String */;
        req.res.sValue = f(params[0].sValue);
    }
    ABeamer._exFunctions['sin'] = function (params, req) {
        _math1ParamFunc(params, req, Math.sin);
    };
    ABeamer._exFunctions['cos'] = function (params, req) {
        _math1ParamFunc(params, req, Math.cos);
    };
    ABeamer._exFunctions['tan'] = function (params, req) {
        _math1ParamFunc(params, req, Math.tan);
    };
    ABeamer._exFunctions['round'] = function (params, req) {
        _math1ParamFunc(params, req, Math.round);
    };
    ABeamer._exFunctions['downRound'] = function (params, req) {
        _math1ParamFunc(params, req, ABeamer.downRound);
    };
    ABeamer._exFunctions['ceil'] = function (params, req) {
        _math1ParamFunc(params, req, Math.ceil);
    };
    ABeamer._exFunctions['floor'] = function (params, req) {
        _math1ParamFunc(params, req, Math.floor);
    };
    ABeamer._exFunctions['sqrt'] = function (params, req) {
        _math1ParamFunc(params, req, Math.sqrt);
    };
    ABeamer._exFunctions['random'] = function (params, req) {
        req.checkParams(req, 0);
        req.res.paType = 1 /* Number */;
        req.res.numValue = Math.random();
    };
    ABeamer._exFunctions['toNumber'] = function (params, req) {
        req.checkParams(req, 1, [2 /* String */]);
        req.res.paType = 1 /* Number */;
        req.res.numValue = parseFloat(params[0].sValue);
    };
    // @ts-ignore   TypeScript bug :-(
    ABeamer._exFunctions['toString'] = function (params, req) {
        req.checkParams(req, 1, [1 /* Number */]);
        req.res.paType = 2 /* String */;
        req.res.sValue = params[0].numValue.toString();
    };
    ABeamer._exFunctions['uppercase'] = function (params, req) {
        _str1ParamFunc(params, req, function (s) { return s.toUpperCase(); });
    };
    ABeamer._exFunctions['lowercase'] = function (params, req) {
        _str1ParamFunc(params, req, function (s) { return s.toUpperCase(); });
    };
    ABeamer._exFunctions['capitalize'] = function (params, req) {
        _str1ParamFunc(params, req, function (s) { return s.replace(/\b(\w)/, function (all, p) { return p.toUpperCase(); }); });
    };
    ABeamer._exFunctions['substr'] = function (params, req) {
        req.checkParams(req, 3, [2 /* String */, 1 /* Number */, 1 /* Number */]);
        req.res.paType = 2 /* String */;
        req.res.sValue = params[0].sValue.substr(params[1].numValue, params[2].numValue < 0 ? undefined : params[2].numValue);
    };
    ABeamer._exFunctions['rgb'] = function (params, req) {
        req.checkParams(req, 3, [1 /* Number */, 1 /* Number */, 1 /* Number */]);
        req.res.paType = 2 /* String */;
        req.res.sValue =
            params.map(function (pa) {
                var v = pa.numValue.toString(16);
                return v.length < 2 ? '0' + v : v;
            }).join('');
    };
    ABeamer._exFunctions['iff'] = function (params, req) {
        req.checkParams(req, 3, [1 /* Number */, 0 /* Any */, 0 /* Any */]);
        var res = params[params[0].numValue ? 1 : 2];
        req.res.paType = res.paType;
        req.res.sValue = res.sValue;
        req.res.numValue = res.numValue;
    };
    ABeamer._exFunctions['case'] = function (params, req) {
        // @TODO: check params
        var res = params[Math.round(params[0].numValue) + 1];
        req.res.paType = res.paType;
        req.res.sValue = res.sValue;
        req.res.numValue = res.numValue;
    };
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=functions.js.map