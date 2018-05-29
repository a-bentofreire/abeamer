"use strict";
// This file was generated gulp build-shared-lib
// It has no uuid
//
// @WARN: Don't edit this file.

export namespace DevConsts {

  // -------------
  // version
  // -------------

  export const VERSION = "0.1.0";

  // -------------
  // consts
  // -------------

  export const LT_MSG = 0;
  export const LT_WARN = 1;
  export const LT_ERROR = 2;

  export const LL_SILENT = 0;
  export const LL_ERROR = 1;
  export const LL_WARN = 2;
  export const LL_VERBOSE = 3;

  export const AS_UNKNOWN = 0;
  export const AS_ADD_ANIMATION = 1;
  export const AS_RENDERING = 2;
  export const AS_STORY = 3;

  // -------------
  // time
  // -------------

  export enum TimeUnit {
    f,
    ms,
    s,
    m,
    '%',
  }

  // -------------
  // easings
  // -------------

  export const DEFAULT_EASING = 'linear';

  // -------------
  // oscillators
  // -------------

  export enum PulsarType {
    normal,
    sine,
    random,
    positiveRandom,
  }

  // -------------
  // tasks
  // -------------

  export const TR_EXIT = 0;
  export const TR_DONE = 1;
  export const TR_INTERACTIVE = 2;

  export const TS_INIT = 0;
  export const TS_ANIME_LOOP = 1;

  // -------------
  // shape-tasks
  // -------------

  export enum Shapes {
    rectangle,
    line,
    circle,
    arrow,
    speech,
  }

  export const DEFAULT_ARROW_LENGTH = 10;
  export const DEFAULT_ARROW_WIDTH = 10;
  export const DEFAULT_SPEECH_START = 10;
  export const DEFAULT_SPEECH_WIDTH = 10;
  export const DEFAULT_SPEECH_HEIGHT = 10;
  export const DEFAULT_SPEECH_SHIFT = 0;

  export enum SpeechPosition {
    left,
    right,
  }

  // -------------
  // transitions
  // -------------

  export const TRS_SETUP = 0;
  export const TRS_AT_OUT = 1;
  export const TRS_AT_IN = 2;

  export const DEFAULT_TRANSITION_DURATION = '1s';

  export enum StdTransition {
    slideLeft,
    slideRight,
    dissolve,
  }

  // -------------
  // adapters
  // -------------

  export const PT_ID = 0;
  export const PT_VISIBLE = 1;
  export const PT_ATTR = 2;
  export const PT_ATTR_FUNC = 3;
  export const PT_STYLE = 4;

  // -------------
  // animation-direction
  // -------------

  export enum Directions {
    normal,
    reverse,
    alternate,
    'alternate-reverse',
  }

  export const DIRECTION_TO_DIR_PAIR = [[1, 1], [-1, -1], [1, -1],
  [-1, 1]];

  // -------------
  // animations
  // -------------

  export const BP_FIRST_INSIDE = 0;
  export const BP_INSIDE = 1;
  export const BP_ALL = 2;

  export const DEFAULT_DURATION = '400ms';

  // -------------
  // interpolator
  // -------------

  export const VALUE_MACRO = '__VALUE__';

  export const PT_PIXEL = 0;
  export const PT_NUMBER = 1;
  export const PT_STR_MAP = 2;
  export const PT_STYLE_IN_STR_VALUE = 3;
  export const PT_STR = 4;
  export const PT_BOOLEAN = 5;
}
