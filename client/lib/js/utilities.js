"use strict";
// uuid: 81ec129f-b642-498a-8b8b-f719c1d3bf21
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * This module provides utility functions, mostly to be used by plugin creators
 * or developers.
 */
var ABeamer;
(function (ABeamer) {
    var HandlerType;
    (function (HandlerType) {
        HandlerType[HandlerType["FuncMapper"] = 0] = "FuncMapper";
        HandlerType[HandlerType["FuncOrValue"] = 1] = "FuncOrValue";
    })(HandlerType = ABeamer.HandlerType || (ABeamer.HandlerType = {}));
    function parseRoundFunc(handler) {
        if (handler === undefined) {
            return undefined;
        }
        if (typeof handler === 'string') {
            handler = ABeamer.RoundFuncName[handler];
        }
        else if (typeof handler === 'function') {
            return handler;
        }
        switch (handler) {
            case ABeamer.RoundFuncName.round: return Math.round;
            case ABeamer.RoundFuncName.downRound: return ABeamer.downRound;
            case ABeamer.RoundFuncName.ceil: return Math.ceil;
            case ABeamer.RoundFuncName.floor: return Math.floor;
        }
        return undefined;
    }
    ABeamer.parseRoundFunc = parseRoundFunc;
    function _applyRoundFunc(values, f) {
        return f ? values.map(function (value) { return f(value); }) : values;
    }
    ABeamer._applyRoundFunc = _applyRoundFunc;
    function parseHandler(handler, defaultHandler, mapper, handlerType, args) {
        if (handler === undefined) {
            if (!defaultHandler) {
                return undefined;
            }
            handler = defaultHandler;
        }
        if (typeof handler === 'string') {
            var exprValue = ABeamer._computeIfExpression(handler, args);
            if (exprValue !== undefined) {
                switch (handlerType) {
                    case HandlerType.FuncMapper:
                        handler = exprValue.toString();
                        break;
                    default:
                        handler = exprValue;
                }
            }
        }
        var handlerTypeOf = typeof handler;
        switch (handlerType) {
            case HandlerType.FuncMapper:
                var func = handlerTypeOf === 'string' ? mapper[handler] : handler;
                if (!func) {
                    ABeamer.throwI8n("Unknown: " + handler);
                }
                return func;
            case HandlerType.FuncOrValue:
                if (handlerTypeOf === 'function') {
                    return handler(args);
                }
                else {
                    return handler;
                }
        }
    }
    ABeamer.parseHandler = parseHandler;
    function parseHandler1(handler, defaultHandler, mapper, handlerType, args) {
        if (handler === undefined) {
            if (!defaultHandler) {
                return undefined;
            }
            handler = defaultHandler;
        }
        if (typeof handler === 'string') {
            var exprValue = ABeamer._computeIfExpression(handler, args);
            if (exprValue !== undefined) {
                switch (handlerType) {
                    case HandlerType.FuncMapper:
                        handler = exprValue.toString();
                        break;
                    default:
                        handler = exprValue;
                }
            }
        }
        var handlerTypeOf = typeof handler;
        switch (handlerType) {
            case HandlerType.FuncMapper:
                var func = handlerTypeOf === 'string' ? mapper[handler] : handler;
                if (!func) {
                    ABeamer.throwI8n("Unknown: " + handler);
                }
                return func;
            case HandlerType.FuncOrValue:
                if (handlerTypeOf === 'function') {
                    return handler(args);
                }
                else {
                    return handler;
                }
        }
    }
    ABeamer.parseHandler1 = parseHandler1;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=utilities.js.map