"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file was generated gulp build-shared-lib
// It has no uuid
//
// @WARN: Don't edit this file.
var DevConsts;
(function (DevConsts) {
    // -------------
    // version
    // -------------
    DevConsts.VERSION = "0.2.7";
    // -------------
    // consts
    // -------------
    DevConsts.LT_MSG = 0;
    DevConsts.LT_WARN = 1;
    DevConsts.LT_ERROR = 2;
    DevConsts.LL_SILENT = 0;
    DevConsts.LL_ERROR = 1;
    DevConsts.LL_WARN = 2;
    DevConsts.LL_VERBOSE = 3;
    DevConsts.AS_UNKNOWN = 0;
    DevConsts.AS_ADD_ANIMATION = 1;
    DevConsts.AS_RENDERING = 2;
    DevConsts.AS_STORY = 3;
    // -------------
    // i18n
    // -------------
    var Msgs;
    (function (Msgs) {
        Msgs["MustNatPositive"] = "The value of %p% must be a natural positive";
        Msgs["MustNatNotNegative"] = "The value of %p% must be a natural non-negative";
        Msgs["MustBeANumber"] = "The value of %p% must be a number";
        Msgs["MustBeANumberOrExpr"] = "The value of %p% must be a number or an expression";
        Msgs["Unknown"] = "Unknown %p%";
        Msgs["UnknownOf"] = "Unknown \"%type%\" %p%";
        Msgs["UnknownType"] = "Unknown type of %p%";
        Msgs["NoEmptyField"] = "Field %p% can not be empty";
        Msgs["NoEmptySelector"] = "Selector %p% can not be empty";
        Msgs["NoCode"] = "Code Handler is not allowed";
        Msgs["OutOfScope"] = "%p% out of scope";
        Msgs["ExpHasErrors"] = "Expression %e% has errors: %err%";
        Msgs["WrongNrParams"] = "Function %p% has the wrong number of input parameters";
        Msgs["WrongParamType"] = "Function %p% has the wrong type in parameter: %i%";
        Msgs["ValueTypeError"] = "Value %p% must be a number or an expression";
        Msgs["UnaryErr"] = "Unary operators only support numerical values";
        Msgs["flyover"] = "flyover";
        Msgs["task"] = "task";
        Msgs["pos"] = "position";
        Msgs["startScene"] = "startScene";
        Msgs["endScene"] = "endScene";
    })(Msgs = DevConsts.Msgs || (DevConsts.Msgs = {}));
    // -------------
    // utilities
    // -------------
    var RoundFuncName;
    (function (RoundFuncName) {
        RoundFuncName[RoundFuncName["none"] = 0] = "none";
        RoundFuncName[RoundFuncName["round"] = 1] = "round";
        RoundFuncName[RoundFuncName["ceil"] = 2] = "ceil";
        RoundFuncName[RoundFuncName["floor"] = 3] = "floor";
        RoundFuncName[RoundFuncName["downRound"] = 4] = "downRound";
    })(RoundFuncName = DevConsts.RoundFuncName || (DevConsts.RoundFuncName = {}));
    // -------------
    // time
    // -------------
    var TimeUnit;
    (function (TimeUnit) {
        TimeUnit[TimeUnit["f"] = 0] = "f";
        TimeUnit[TimeUnit["ms"] = 1] = "ms";
        TimeUnit[TimeUnit["s"] = 2] = "s";
        TimeUnit[TimeUnit["m"] = 3] = "m";
        TimeUnit[TimeUnit["%"] = 4] = "%";
    })(TimeUnit = DevConsts.TimeUnit || (DevConsts.TimeUnit = {}));
    // -------------
    // expressions
    // -------------
    DevConsts.CharRanges = [
        ['A'.charCodeAt(0), 'Z'.charCodeAt(0)],
        ['a'.charCodeAt(0), 'z'.charCodeAt(0)],
    ];
    // -------------
    // easings
    // -------------
    var EasingName;
    (function (EasingName) {
        EasingName[EasingName["linear"] = 0] = "linear";
        EasingName[EasingName["easeInQuad"] = 1] = "easeInQuad";
        EasingName[EasingName["easeOutQuad"] = 2] = "easeOutQuad";
        EasingName[EasingName["easeInOutQuad"] = 3] = "easeInOutQuad";
        EasingName[EasingName["easeInCubic"] = 4] = "easeInCubic";
        EasingName[EasingName["easeOutCubic"] = 5] = "easeOutCubic";
        EasingName[EasingName["easeInOutCubic"] = 6] = "easeInOutCubic";
        EasingName[EasingName["easeInQuart"] = 7] = "easeInQuart";
        EasingName[EasingName["easeOutQuart"] = 8] = "easeOutQuart";
        EasingName[EasingName["easeInOutQuart"] = 9] = "easeInOutQuart";
        EasingName[EasingName["easeInQuint"] = 10] = "easeInQuint";
        EasingName[EasingName["easeOutQuint"] = 11] = "easeOutQuint";
        EasingName[EasingName["easeInOutQuint"] = 12] = "easeInOutQuint";
        EasingName[EasingName["easeInSine"] = 13] = "easeInSine";
        EasingName[EasingName["easeOutSine"] = 14] = "easeOutSine";
        EasingName[EasingName["easeInOutSine"] = 15] = "easeInOutSine";
        EasingName[EasingName["easeInExpo"] = 16] = "easeInExpo";
        EasingName[EasingName["easeOutExpo"] = 17] = "easeOutExpo";
        EasingName[EasingName["easeInOutExpo"] = 18] = "easeInOutExpo";
        EasingName[EasingName["easeInCirc"] = 19] = "easeInCirc";
        EasingName[EasingName["easeOutCirc"] = 20] = "easeOutCirc";
        EasingName[EasingName["easeInOutCirc"] = 21] = "easeInOutCirc";
        EasingName[EasingName["easeInElastic"] = 22] = "easeInElastic";
        EasingName[EasingName["easeOutElastic"] = 23] = "easeOutElastic";
        EasingName[EasingName["easeInOutElastic"] = 24] = "easeInOutElastic";
        EasingName[EasingName["easeInBack"] = 25] = "easeInBack";
        EasingName[EasingName["easeOutBack"] = 26] = "easeOutBack";
        EasingName[EasingName["easeInOutBack"] = 27] = "easeInOutBack";
        EasingName[EasingName["easeInBounce"] = 28] = "easeInBounce";
        EasingName[EasingName["easeOutBounce"] = 29] = "easeOutBounce";
        EasingName[EasingName["easeInOutBounce"] = 30] = "easeInOutBounce";
    })(EasingName = DevConsts.EasingName || (DevConsts.EasingName = {}));
    // -------------
    // oscillators
    // -------------
    var OscillatorName;
    (function (OscillatorName) {
        OscillatorName[OscillatorName["harmonic"] = 1000] = "harmonic";
        OscillatorName[OscillatorName["damped"] = 1001] = "damped";
        OscillatorName[OscillatorName["pulsar"] = 1002] = "pulsar";
    })(OscillatorName = DevConsts.OscillatorName || (DevConsts.OscillatorName = {}));
    var NegativeBuiltInFuncs;
    (function (NegativeBuiltInFuncs) {
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["none"] = 0] = "none";
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["clip"] = 1] = "clip";
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["abs"] = 2] = "abs";
    })(NegativeBuiltInFuncs = DevConsts.NegativeBuiltInFuncs || (DevConsts.NegativeBuiltInFuncs = {}));
    var PulsarType;
    (function (PulsarType) {
        PulsarType[PulsarType["normal"] = 0] = "normal";
        PulsarType[PulsarType["sine"] = 1] = "sine";
        PulsarType[PulsarType["random"] = 2] = "random";
        PulsarType[PulsarType["positiveRandom"] = 3] = "positiveRandom";
    })(PulsarType = DevConsts.PulsarType || (DevConsts.PulsarType = {}));
    // -------------
    // paths
    // -------------
    var PathName;
    (function (PathName) {
        PathName[PathName["line"] = 0] = "line";
        PathName[PathName["rect"] = 1] = "rect";
        PathName[PathName["circle"] = 2] = "circle";
        PathName[PathName["ellipse"] = 3] = "ellipse";
    })(PathName = DevConsts.PathName || (DevConsts.PathName = {}));
    // -------------
    // tasks
    // -------------
    DevConsts.TR_EXIT = 0;
    DevConsts.TR_DONE = 1;
    DevConsts.TR_INTERACTIVE = 2;
    DevConsts.TS_INIT = 0;
    DevConsts.TS_ANIME_LOOP = 1;
    DevConsts.TS_TELEPORT = 2;
    // -------------
    // adapters
    // -------------
    var WaitForWhat;
    (function (WaitForWhat) {
        WaitForWhat[WaitForWhat["Custom"] = 0] = "Custom";
        WaitForWhat[WaitForWhat["ImageLoad"] = 1] = "ImageLoad";
        WaitForWhat[WaitForWhat["MediaSync"] = 2] = "MediaSync";
    })(WaitForWhat = DevConsts.WaitForWhat || (DevConsts.WaitForWhat = {}));
    DevConsts.DPT_ID = 0;
    DevConsts.DPT_VISIBLE = 1;
    DevConsts.DPT_ATTR = 2;
    DevConsts.DPT_ATTR_FUNC = 3;
    DevConsts.DPT_STYLE = 4;
    DevConsts.DPT_PIXEL = 5;
    DevConsts.DPT_DUAL_PIXELS = 6;
    DevConsts.DPT_CLASS = 7;
    DevConsts.DPT_MEDIA_TIME = 8;
    DevConsts.DPT_SRC = 9;
    // -------------
    // transitions
    // -------------
    DevConsts.TRS_SETUP = 0;
    DevConsts.TRS_AT_OUT = 1;
    DevConsts.TRS_AT_IN = 2;
    DevConsts.DEFAULT_TRANSITION_DURATION = '1s';
    var StdTransitions;
    (function (StdTransitions) {
        StdTransitions[StdTransitions["slideLeft"] = 0] = "slideLeft";
        StdTransitions[StdTransitions["slideRight"] = 1] = "slideRight";
        StdTransitions[StdTransitions["slideTop"] = 2] = "slideTop";
        StdTransitions[StdTransitions["slideBottom"] = 3] = "slideBottom";
        StdTransitions[StdTransitions["dissolve"] = 4] = "dissolve";
    })(StdTransitions = DevConsts.StdTransitions || (DevConsts.StdTransitions = {}));
    // -------------
    // plugin-manager
    // -------------
    var Functionalities;
    (function (Functionalities) {
        Functionalities[Functionalities["easings"] = 0] = "easings";
        Functionalities[Functionalities["oscillators"] = 1] = "oscillators";
        Functionalities[Functionalities["paths"] = 2] = "paths";
        Functionalities[Functionalities["transitions"] = 3] = "transitions";
        Functionalities[Functionalities["tasks"] = 4] = "tasks";
        Functionalities[Functionalities["flyovers"] = 5] = "flyovers";
        Functionalities[Functionalities["functions"] = 6] = "functions";
    })(Functionalities = DevConsts.Functionalities || (DevConsts.Functionalities = {}));
    // -------------
    // animation-direction
    // -------------
    var Directions;
    (function (Directions) {
        Directions[Directions["normal"] = 0] = "normal";
        Directions[Directions["reverse"] = 1] = "reverse";
        Directions[Directions["alternate"] = 2] = "alternate";
        Directions[Directions["alternate-reverse"] = 3] = "alternate-reverse";
    })(Directions = DevConsts.Directions || (DevConsts.Directions = {}));
    // -------------
    // animations
    // -------------
    DevConsts.BP_FIRST_INSIDE = 0;
    DevConsts.BP_INSIDE = 1;
    DevConsts.BP_ALL = 2;
    DevConsts.FS_PREPARE = 0;
    DevConsts.FS_TELEPORT = 1;
    DevConsts.FS_RUN = 2;
    DevConsts.DEFAULT_DURATION = '1f';
    DevConsts.DEFAULT_FADE_DURATION = '400ms';
    // -------------
    // interpolator
    // -------------
    DevConsts.PT_BOOLEAN = 0;
    DevConsts.PT_NUMBER = 1;
    DevConsts.PT_PIXEL = 2;
    DevConsts.PT_STR = 3;
    DevConsts.PT_VALUE_TEXT_LIST = 4;
    DevConsts.PT_VALUE_TEXT_FUNC = 5;
    DevConsts.PT_VALUE_TEXT_EXPR = 6;
})(DevConsts = exports.DevConsts || (exports.DevConsts = {}));
//# sourceMappingURL=dev-consts.js.map