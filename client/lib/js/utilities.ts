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
namespace ABeamer {

  export enum HandlerType {
    FuncMapper,
    FuncOrValue,
  }

  export type RoundFunc = (v: number) => number;

  export type RoundHandlerFunc = string | RoundFuncName | RoundFunc;


  export function parseRoundFunc(handler: RoundHandlerFunc): RoundFunc {

    if (handler === undefined) { return undefined; }

    if (typeof handler === 'string') {
      handler = RoundFuncName[handler];
    } else if (typeof handler === 'function') {
      return handler;
    }

    switch (handler) {
      case RoundFuncName.round: return Math.round;
      case RoundFuncName.downRound: return downRound;
      case RoundFuncName.ceil: return Math.ceil;
      case RoundFuncName.floor: return Math.floor;
    }
    return undefined;
  }

  export function _applyRoundFunc(values: number[], f: RoundFunc): number[] {
    return f ? values.map(value => f(value)) : values;
  }


  export function parseHandler<T, TO>(handler: T, defaultHandler: T, mapper: any,
    handlerType: HandlerType,
    args: ABeamerArgs): TO {

    if (handler === undefined) {
      if (!defaultHandler) { return undefined; }
      handler = defaultHandler;
    }

    if (typeof handler === 'string') {
      const exprValue = _computeIfExpression(handler, args);
      if (exprValue !== undefined) {

        switch (handlerType) {
          case HandlerType.FuncMapper:
            handler = exprValue.toString() as any;
            break;
          default:
            handler = exprValue as any;
        }
      }
    }

    const handlerTypeOf = typeof handler;
    switch (handlerType) {

      case HandlerType.FuncMapper:
        const func = handlerTypeOf === 'string' ? mapper[handler] : handler;
        if (!func) { throwI8n(`Unknown: ${handler}`); }
        return func;

      case HandlerType.FuncOrValue:
        if (handlerTypeOf === 'function') {
          return (handler as any)(args) as TO;
        } else {
          return handler as any;
        }
    }
  }

  export function parseHandler1<T, TO>(handler: T, defaultHandler: T, mapper: any,
    handlerType: HandlerType,
    args: ABeamerArgs): TO {

    if (handler === undefined) {
      if (!defaultHandler) { return undefined; }
      handler = defaultHandler;
    }

    if (typeof handler === 'string') {
      const exprValue = _computeIfExpression(handler, args);
      if (exprValue !== undefined) {

        switch (handlerType) {
          case HandlerType.FuncMapper:
            handler = exprValue.toString() as any;
            break;
          default:
            handler = exprValue as any;
        }
      }
    }

    const handlerTypeOf = typeof handler;
    switch (handlerType) {

      case HandlerType.FuncMapper:
        const func = handlerTypeOf === 'string' ? mapper[handler] : handler;
        if (!func) { throwI8n(`Unknown: ${handler}`); }
        return func;

      case HandlerType.FuncOrValue:
        if (handlerTypeOf === 'function') {
          return (handler as any)(args) as TO;
        } else {
          return handler as any;
        }
    }
  }

}
