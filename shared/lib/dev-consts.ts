"use strict";
// This file was generated gulp build-shared-lib
// It has no uuid
//
// @WARN: Don't edit this file.

export namespace DevConsts {

  // -------------
  // version
  // -------------

  export const VERSION = "1.3.0";

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
  // i18n
  // -------------

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

  // -------------
  // utilities
  // -------------

  export enum RoundFuncName {
    none,
    round,
    ceil,
    floor,
    downRound,
  }

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
  // expressions
  // -------------

  export const CharRanges = [
    ['A'.charCodeAt(0), 'Z'.charCodeAt(0)],
    ['a'.charCodeAt(0), 'z'.charCodeAt(0)],
  ];

  // -------------
  // easings
  // -------------

  export enum EasingName {
    linear,

    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInCirc,
    easeOutCirc,
    easeInOutCirc,
    easeInElastic,
    easeOutElastic,
    easeInOutElastic,
    easeInBack,
    easeOutBack,
    easeInOutBack,
    easeInBounce,
    easeOutBounce,
    easeInOutBounce,
  }

  // -------------
  // oscillators
  // -------------

  export enum OscillatorName {
    harmonic = 1000,  // lower ids are for easings.
    damped,
    pulsar,
  }

  export enum NegativeBuiltInFuncs {
    none,
    clip,
    abs,
  }

  export enum PulsarType {
    normal,
    sine,
    random,
    positiveRandom,
  }

  // -------------
  // paths
  // -------------

  export enum PathName {
    line,
    rect,
    circle,
    ellipse,
  }

  // -------------
  // tasks
  // -------------

  export const TR_EXIT = 0;
  export const TR_DONE = 1;
  export const TR_INTERACTIVE = 2;

  export const TS_INIT = 0;
  export const TS_ANIME_LOOP = 1;
  export const TS_TELEPORT = 2;

  // -------------
  // adapters
  // -------------

  export enum WaitForWhat {
    Custom,
    ImageLoad,
    MediaSync,
  }

  export const DPT_ID = 0;
  export const DPT_VISIBLE = 1;
  export const DPT_ATTR = 2;
  export const DPT_ATTR_FUNC = 3;
  export const DPT_STYLE = 4;
  export const DPT_PIXEL = 5;
  export const DPT_DUAL_PIXELS = 6;
  export const DPT_CLASS = 7;
  export const DPT_MEDIA_TIME = 8;
  export const DPT_SRC = 9;
  export const DPT_ELEMENT = 10;

  // -------------
  // transitions
  // -------------

  export const TRS_SETUP = 0;
  export const TRS_AT_OUT = 1;
  export const TRS_AT_IN = 2;

  export const DEFAULT_TRANSITION_DURATION = '1s';

  export enum StdTransitions {
    slideLeft,
    slideRight,
    slideTop,
    slideBottom,
    dissolve,
  }

  // -------------
  // plugin-manager
  // -------------

  export enum Functionalities {
    easings,
    oscillators,
    paths,
    transitions,
    tasks,
    flyovers,
    functions,
  }

  // -------------
  // animation-direction
  // -------------

  export enum Directions {
    normal,
    reverse,
    alternate,
    'alternate-reverse',
  }

  // -------------
  // animations
  // -------------

  export const BP_FIRST_INSIDE = 0;
  export const BP_INSIDE = 1;
  export const BP_ALL = 2;

  export const FS_PREPARE = 0;
  export const FS_TELEPORT = 1;
  export const FS_RUN = 2;

  export const DEFAULT_DURATION = '1f';
  export const DEFAULT_FADE_DURATION = '400ms';

  // -------------
  // interpolator
  // -------------

  export const PT_BOOLEAN = 0;
  export const PT_NUMBER = 1;
  export const PT_PIXEL = 2;
  export const PT_STR = 3;
  export const PT_VALUE_TEXT_LIST = 4;
  export const PT_VALUE_TEXT_FUNC = 5;
  export const PT_VALUE_TEXT_EXPR = 6;
}
