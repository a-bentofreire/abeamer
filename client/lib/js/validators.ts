"use strict";
// uuid: 911fb938-09aa-44e1-91cc-e7669b1cfd7e

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * This module provides validations functions to check if input values
 * are within the expected space.
 * Mostly to be used by plugin creators or developers.
 */
namespace ABeamer {

  export function throwErr(msg: string): void {
    throw msg;
  }


  export function throwI8n(msg: string, params?: I8nParams): void {
    throwErr(i8nMsg(msg, params));
  }


  export function throwIf(isTrue: boolean, msg: string): void {
    if (isTrue) { throwErr(msg); }
  }


  export function throwIfI8n(isTrue: boolean, msg: string,
    params?: I8nParams): void {

    if (isTrue) { throwErr(i8nMsg(msg, params)); }
  }


  export const isPositiveNatural = (value: any): boolean =>
    (typeof value === 'number') && value > 0 &&
    (Math.abs(Math.floor(value) - value) < 0.0000001);


  export const isNotNegativeNatural = (value: any): boolean =>
    (typeof value === 'number') && value >= 0 &&
    (Math.abs(Math.floor(value) - value) < 0.0000001);


  export const isPositive = (value: any): boolean =>
    (typeof value === 'number') && value > 0;


  export const isNotNegative = (value: any): boolean =>
    (typeof value === 'number') && value >= 0;
}
