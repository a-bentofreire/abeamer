"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: c59478ce-5f42-4538-8599-0e275fbc494f
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// This file was generated via gulp build-shared-lib
// It shares the uuid
//
// @WARN: Don't edit this file.
/** @see client/lib/js/sprintf.ts */
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * **sprintf** is minimalist string formatter utility.
 * Supports only %[dfx], %<n>[dfx], and %0<n>[dfx]
 *
 * This module will generate a node module,
 * therefore it can't contain external references.
 *
 */
var Sprintf;
(function (Sprintf) {
    // ------------------------------------------------------------------------
    //                               Mini SPrintf
    // ------------------------------------------------------------------------
    /**
     * Minimalist string formatter
     *
     * @param format  pattern containing %d formatters
     * @param value  value to replace
     * @returns pattern with value replaced
     */
    function sprintf(format, value) {
        return format.replace(/%(0*)((?:[1-9])?)([dfx])/g, function (match, hasZeros, strNumDigits, specifier) {
            var out;
            var strNumber;
            switch (specifier) {
                case 'd':
                    strNumber = Math.round(value).toString();
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
    Sprintf.sprintf = sprintf;
})(Sprintf = exports.Sprintf || (exports.Sprintf = {}));
//# sourceMappingURL=sprintf.js.map