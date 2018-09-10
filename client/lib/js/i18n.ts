"use strict";
// uuid: 4e1951ce-4437-4155-a860-7c8a5b2a36f3

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module end-user | The lines bellow convey information for the end-user */

/**
 *
 * ## Description
 *
 * **WARNING:** The messages in this file will be moved to messages/messages-en.ts file on version 2.x.
 * Users are encouraged to include the messages/messages-en.js on their index.html
 * even though for now it's an empty file to prevent breaking changes.
 *
 * ABeamer allows to localize the name of functions and other functionalities
 * such the names of tasks, flyovers and scene transitions.
 * The names can include non-latin characters.
 *
 * Fill Localization with the localize data, and add it
 * via `ABeamer.pluginManager.addLocalization`.
 */
namespace ABeamer {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Messages
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  export interface Localization {
    locale: string;
    charRanges?: [number, number][];
    messages?: { [srcMsg: string]: string };
    functionalities?: [Functionalities | string, { src: string, dst: string }[]][];
  }

  /**
   * These messages will be moved messages/messages-en.ts on version 2.x
   */
  export enum Msgs {
    MustNatPositive = 'The value of %p% must be a natural positive',
    MustNatNotNegative = 'The value of %p% must be a natural non-negative',
    MustBeANumber = 'The value of %p% must be a number',
    MustBeAString = 'The value of %p% must be textual',
    MustBeANumberOrExpr = 'The value of %p% must be a number or an expression',
    MustBeAStringOrExpr = 'The value of %p% must be textual or an expression',
    Unknown = 'Unknown %p%',
    UnknownOf = 'Unknown "%type%" %p%',
    UnknownType = 'Unknown type of %p%',
    NoEmptyField = 'Field %p% can not be empty',
    NoEmptySelector = 'Selector %p% can not be empty',
    NoCode = 'Code Handler is not allowed',
    OutOfScope = '%p% out of scope',
    ExpHasErrors = 'Expression %e% has errors: %err%',
    WrongNrParams = 'Function %p% has the wrong number of input parameters',
    WrongParamType = 'Function %p% has the wrong type in parameter: %i%',
    ValueTypeError = 'Value %p% must be a number or an expression',
    UnaryErr = 'Unary operators only support numerical values',

    flyover = 'flyover',
    task = 'task',
    pos = 'position',
    startScene = 'startScene',
    endScene = 'endScene',
  }


  export interface I8nParams {
    [name: string]: (number | string);
  }

  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  export function i8nMsg(msg: string, params?: I8nParams): string {
    if (params) {
      msg = msg.replace(/%(\w+)%/g, (_all, p) => params[p].toString());
    }
    return msg;
  }
}
