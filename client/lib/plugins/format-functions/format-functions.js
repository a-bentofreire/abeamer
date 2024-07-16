"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
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
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
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
    function _formatCommon(params, req, maxParam, f) {
        req.checkParams(req, Math.min(Math.max(1, params.length), maxParam), [1 /* ExFuncParamType.Number */, 2 /* ExFuncParamType.String */, 2 /* ExFuncParamType.String */]
            .slice(0, params.length));
        var v = params[0].numValue;
        var locale = params.length > 1 ? params[1].sValue : undefined;
        var currency = params.length > 2 ? params[2].sValue : 'USD';
        req.res.paType = 2 /* ExFuncParamType.String */;
        req.res.sValue = f(v, locale, currency);
    }
    function _numToStr(params, req) {
        _formatCommon(params, req, 2, function (v, locale) {
            return new Intl.NumberFormat(locale, { useGrouping: true }).format(v);
        });
    }
    function _nogrpToStr(params, req) {
        _formatCommon(params, req, 2, function (v, locale) {
            return new Intl.NumberFormat(locale, { useGrouping: false }).format(v);
        });
    }
    function _currToStr(params, req) {
        _formatCommon(params, req, 3, function (v, locale, currency) {
            return new Intl.NumberFormat(locale, {
                useGrouping: true,
                style: 'currency',
                currency: currency,
            }).format(v);
        });
    }
    ABeamer.pluginManager.addFunctions([
        ['numToStr', _numToStr], ['nogrpToStr', _nogrpToStr], ['currToStr', _currToStr],
    ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=format-functions.js.map