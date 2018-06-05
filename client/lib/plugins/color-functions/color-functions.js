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
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.color-functions',
        uuid: 'ce739c9f-13ba-4742-b1c3-dec56624be7d',
        author: 'Alexandre Bento Freire',
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/color-functions/color-functions.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Functions
    // ------------------------------------------------------------------------
    function _rgbaCommon(params, req, nrParams, paramTypes) {
        req.checkParams(req, nrParams, paramTypes);
        req.res.paType = 2 /* String */;
        req.res.sValue =
            params.map(function (pa, index) {
                var numValue = pa.numValue;
                if (index === 3) {
                    numValue = numValue * 255;
                }
                numValue = Math.round(Math.max(Math.min(numValue, 255), 0));
                var v = numValue.toString(16);
                return v.length < 2 ? '0' + v : v;
            }).join('');
    }
    function _rgb(params, req) {
        _rgbaCommon(params, req, 3, [1 /* Number */,
            1 /* Number */, 1 /* Number */]);
    }
    function _rgba(params, req) {
        _rgbaCommon(params, req, 4, [1 /* Number */,
            1 /* Number */, 1 /* Number */, 1 /* Number */]);
    }
    ABeamer.pluginManager.addFunctions([['rgb', _rgb], ['rgba', _rgba]]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=color-functions.js.map