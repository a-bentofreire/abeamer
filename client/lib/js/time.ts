"use strict";
// uuid: 587bcd0e-64f3-4c96-8cdd-a122cbc95461

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 */
namespace ABeamer {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Time
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  export enum TimeUnit {
    f,
    ms,
    s,
    m,
    '%',
  }


  /** Real-type time function  */
  export type TimeFunc = (args?: ABeamerArgs) => TimeUnit | string
    | ExprString | number;


  /** Time used by the user to provide Duration and Position */
  export type TimeHandler = TimeUnit | string | ExprString | number | TimeFunc;

  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               frame2Time
  // ------------------------------------------------------------------------

  /**
   * Converts frames into time defined by the `unit`.
   */
  export function frame2Time(frame: uint, fps: uint, unit: TimeUnit,
    maxPrecision?: uint): string {

    switch (unit) {
      case TimeUnit.f:
        return frame.toString();
      case TimeUnit.ms:
        frame = frame * 1000;
        break;
      case TimeUnit.m:
        frame = frame / 60;
        break;
    }
    const unitTime = frame / fps;
    const divider = 10 ** (maxPrecision || 4);
    return (downRound(unitTime * divider) / divider).toString() + TimeUnit[unit];
  }

  // ------------------------------------------------------------------------
  //                               _parseInTime
  // ------------------------------------------------------------------------

  /**
   *  Parses positions or durations in f/ms/s/m in number of value.
   *  Also supports adding or subtracting from the reference.
   *  Floating point frames can be used together with toInt=false for `item-delay`.
   *
   * @param toInt rounds the nearest int. if the float part is 0.5, it rounds to the lower
   */
  export function parseTimeHandler(
    timeOrFrame: TimeHandler | undefined,
    args: ABeamerArgs,
    defaultTimeOrFrame: string | int,
    referenceFrame: int,
    toInt: boolean = true): int | number {


    if (timeOrFrame === undefined || timeOrFrame === '') {
      timeOrFrame = defaultTimeOrFrame;
    }

    let shift = '';
    const story = args.story as _StoryImpl;


    if (typeof timeOrFrame === 'function') {
      timeOrFrame = (timeOrFrame as TimeFunc)(args);
    }

    let defaultUnit = story.defaultUnit;

    let isStringTime = typeof timeOrFrame === 'string';

    if (isStringTime) {
      const exprTime = _computeIfExpression(timeOrFrame as string, args);
      if (exprTime !== undefined) {
        timeOrFrame = exprTime;
        isStringTime = typeof timeOrFrame === 'string';
      }
    }

    if (isStringTime) {

      const [, sShift, sValue, suffix] = (timeOrFrame as string)
        .match(/^([+\-])?([\d\.]+)([\w%]+)$/) || ['', '', '', ''];

      defaultUnit = TimeUnit[suffix];
      if (defaultUnit === undefined) {
        throw `Unknown time of ${timeOrFrame}`;
      }
      timeOrFrame = parseFloat(sValue);
      shift = sShift;
    }

    let res = timeOrFrame as number;
    switch (defaultUnit) {

      case TimeUnit.ms:
        res = res * story.fps / 1000.0;
        break;

      case TimeUnit.s:
        res = res * story.fps;
        break;

      case TimeUnit.m:
        res = res * story.fps * 60;
        break;

      case TimeUnit['%']:
        res = (defaultTimeOrFrame as number) * res / 100;
        break;

    }

    switch (shift) {
      case '+':
        res = referenceFrame + res;
        break;
      case '-':
        res = referenceFrame - res;
        break;
    }

    // this is delta is used to minimize the problems of using integer frames
    // which happens when there is a 0.5 and can overlap with the next animation

    return toInt ? downRound(res) : res;
  }
}
