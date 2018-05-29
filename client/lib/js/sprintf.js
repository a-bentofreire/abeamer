"use strict";
// uuid: c59478ce-5f42-4538-8599-0e275fbc494f
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// This module will generate a node module,
// therefore it can't contain external references.
/** @module shared   | This module will generate a shared/lib file */
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * **sprintf** is minimalist string formatter utility.
 * Supports only `%[flag][width]specifier[^round-func]`.
 *
 * Where 'flag' is:
 * - `0` - to left pad with zeros.
 *
 * Where 'width' is the total number of characters.
 *
 * Where 'specifier' is:
 * - `d` - decimal integer value. (use a round-func to remove the floating part.)
 * - `f` - represents the number as a floating point number.
 * - `x` - converts to hexadecimal number.
 * - `s` - String of characters.
 *
 * Where 'round-func' is:
 *
 * - `r` - rounds to the nearest decimal value.
 * - `d` - rounds to the nearest decimal value but for 0.5 is always rounded down.
 * - `f` - rounds to the lowermost decimal value.
 * - `c` - rounds to the uppermost decimal value.
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Round Functions
    // ------------------------------------------------------------------------
    var RoundFuncName;
    (function (RoundFuncName) {
        RoundFuncName[RoundFuncName["none"] = 0] = "none";
        RoundFuncName[RoundFuncName["round"] = 1] = "round";
        RoundFuncName[RoundFuncName["ceil"] = 2] = "ceil";
        RoundFuncName[RoundFuncName["floor"] = 3] = "floor";
        RoundFuncName[RoundFuncName["downRound"] = 4] = "downRound";
    })(RoundFuncName = ABeamer.RoundFuncName || (ABeamer.RoundFuncName = {}));
    /**
     * Performs a math round where the 0.5 is always rounded down.
     */
    function downRound(v) {
        return Math.round(v - 0.0001);
    }
    ABeamer.downRound = downRound;
    // ------------------------------------------------------------------------
    //                               Mini SPrintf
    // ------------------------------------------------------------------------
    /**
     * Minimalist string formatter.
     */
    function sprintf(
    // pattern containing %d formatters
    format) {
        // value to replace
        var values = [];
        for (
        // value to replace
        var _i = 1; 
        // value to replace
        _i < arguments.length; 
        // value to replace
        _i++) {
            // value to replace
            values[_i - 1] = arguments[_i];
        }
        var valueIndex = 0;
        return format.replace(/%(0*)((?:[1-9])?)([dfx])(?:\^([rfcd]))?/g, function (match, hasZeros, strNumDigits, specifier, roundFunc) {
            var out;
            var strNumber;
            var value = values[valueIndex++];
            if (roundFunc) {
                switch (roundFunc) {
                    case 'r':
                        value = Math.round(value);
                        break;
                    case 'd':
                        value = downRound(value);
                        break;
                    case 'c':
                        value = Math.ceil(value);
                        break;
                    case 'f':
                        value = Math.floor(value);
                        break;
                }
            }
            switch (specifier) {
                case 'd':
                    strNumber = (roundFunc ? value : Math.floor(value)).toString();
                    break;
                case 'f':
                    strNumber = value.toString();
                    break;
                case 'x':
                    strNumber = value.toString(16);
                    break;
            }
            out = strNumber;
            if (strNumDigits) {
                var numDigits = parseInt(strNumDigits);
                if (numDigits > strNumber.length) {
                    out = new Array(numDigits - strNumber.length + 1).join(hasZeros ? '0' : ' ') + out;
                }
            }
            return out;
        });
    }
    ABeamer.sprintf = sprintf;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=sprintf.js.map