"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * This module provides validations functions to check if input values
 * are within the expected space.
 * Mostly to be used by plugin creators or developers.
 */
var ABeamer;
(function (ABeamer) {
    function throwErr(msg) {
        throw msg;
    }
    ABeamer.throwErr = throwErr;
    function throwI8n(msg, params) {
        throwErr(ABeamer.i8nMsg(msg, params));
    }
    ABeamer.throwI8n = throwI8n;
    function throwIf(isTrue, msg) {
        if (isTrue) {
            throwErr(msg);
        }
    }
    ABeamer.throwIf = throwIf;
    function throwIfI8n(isTrue, msg, params) {
        if (isTrue) {
            throwErr(ABeamer.i8nMsg(msg, params));
        }
    }
    ABeamer.throwIfI8n = throwIfI8n;
    ABeamer.isPositiveNatural = (value) => (typeof value === 'number') && value > 0 &&
        (Math.abs(Math.floor(value) - value) < 0.0000001);
    ABeamer.isNotNegativeNatural = (value) => (typeof value === 'number') && value >= 0 &&
        (Math.abs(Math.floor(value) - value) < 0.0000001);
    ABeamer.isPositive = (value) => (typeof value === 'number') && value > 0;
    ABeamer.isNotNegative = (value) => (typeof value === 'number') && value >= 0;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=validators.js.map