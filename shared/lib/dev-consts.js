"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var dev_consts_exports = {};
__export(dev_consts_exports, {
  DevConsts: () => DevConsts
});
module.exports = __toCommonJS(dev_consts_exports);
var DevConsts;
((DevConsts2) => {
  DevConsts2.VERSION = "1.7.0";
  DevConsts2.LT_MSG = 0;
  DevConsts2.LT_WARN = 1;
  DevConsts2.LT_ERROR = 2;
  DevConsts2.LL_SILENT = 0;
  DevConsts2.LL_ERROR = 1;
  DevConsts2.LL_WARN = 2;
  DevConsts2.LL_VERBOSE = 3;
  DevConsts2.AS_UNKNOWN = 0;
  DevConsts2.AS_ADD_ANIMATION = 1;
  DevConsts2.AS_RENDERING = 2;
  DevConsts2.AS_STORY = 3;
  let Msgs;
  ((Msgs2) => {
    Msgs2["MustNatPositive"] = "The value of %p% must be a natural positive";
    Msgs2["MustNatNotNegative"] = "The value of %p% must be a natural non-negative";
    Msgs2["MustBeANumber"] = "The value of %p% must be a number";
    Msgs2["MustBeAString"] = "The value of %p% must be textual";
    Msgs2["MustBeANumberOrExpr"] = "The value of %p% must be a number or an expression";
    Msgs2["MustBeAStringOrExpr"] = "The value of %p% must be textual or an expression";
    Msgs2["Unknown"] = "Unknown %p%";
    Msgs2["UnknownOf"] = 'Unknown "%type%" %p%';
    Msgs2["UnknownType"] = "Unknown type of %p%";
    Msgs2["NoEmptyField"] = "Field %p% can not be empty";
    Msgs2["NoEmptySelector"] = "Selector %p% can not be empty";
    Msgs2["NoCode"] = "Code Handler is not allowed";
    Msgs2["OutOfScope"] = "%p% out of scope";
    Msgs2["ExpHasErrors"] = "Expression %e% has errors: %err%";
    Msgs2["WrongNrParams"] = "Function %p% has the wrong number of input parameters";
    Msgs2["WrongParamType"] = "Function %p% has the wrong type in parameter: %i%";
    Msgs2["ValueTypeError"] = "Value %p% must be a number or an expression";
    Msgs2["UnaryErr"] = "Unary operators only support numerical values";
    Msgs2["flyover"] = "flyover";
    Msgs2["task"] = "task";
    Msgs2["pos"] = "position";
    Msgs2["startScene"] = "startScene";
    Msgs2["endScene"] = "endScene";
  })(Msgs = DevConsts2.Msgs || (DevConsts2.Msgs = {}));
  let RoundFuncName;
  ((RoundFuncName2) => {
    RoundFuncName2[RoundFuncName2["none"] = 0] = "none";
    RoundFuncName2[RoundFuncName2["round"] = 1] = "round";
    RoundFuncName2[RoundFuncName2["ceil"] = 2] = "ceil";
    RoundFuncName2[RoundFuncName2["floor"] = 3] = "floor";
    RoundFuncName2[RoundFuncName2["downRound"] = 4] = "downRound";
  })(RoundFuncName = DevConsts2.RoundFuncName || (DevConsts2.RoundFuncName = {}));
  let TimeUnit;
  ((TimeUnit2) => {
    TimeUnit2[TimeUnit2["f"] = 0] = "f";
    TimeUnit2[TimeUnit2["ms"] = 1] = "ms";
    TimeUnit2[TimeUnit2["s"] = 2] = "s";
    TimeUnit2[TimeUnit2["m"] = 3] = "m";
    TimeUnit2[TimeUnit2["%"] = 4] = "%";
  })(TimeUnit = DevConsts2.TimeUnit || (DevConsts2.TimeUnit = {}));
  DevConsts2.CharRanges = [
    ["A".charCodeAt(0), "Z".charCodeAt(0)],
    ["a".charCodeAt(0), "z".charCodeAt(0)]
  ];
  let EasingName;
  ((EasingName2) => {
    EasingName2[EasingName2["linear"] = 0] = "linear";
    EasingName2[EasingName2["easeInQuad"] = 1] = "easeInQuad";
    EasingName2[EasingName2["easeOutQuad"] = 2] = "easeOutQuad";
    EasingName2[EasingName2["easeInOutQuad"] = 3] = "easeInOutQuad";
    EasingName2[EasingName2["easeInCubic"] = 4] = "easeInCubic";
    EasingName2[EasingName2["easeOutCubic"] = 5] = "easeOutCubic";
    EasingName2[EasingName2["easeInOutCubic"] = 6] = "easeInOutCubic";
    EasingName2[EasingName2["easeInQuart"] = 7] = "easeInQuart";
    EasingName2[EasingName2["easeOutQuart"] = 8] = "easeOutQuart";
    EasingName2[EasingName2["easeInOutQuart"] = 9] = "easeInOutQuart";
    EasingName2[EasingName2["easeInQuint"] = 10] = "easeInQuint";
    EasingName2[EasingName2["easeOutQuint"] = 11] = "easeOutQuint";
    EasingName2[EasingName2["easeInOutQuint"] = 12] = "easeInOutQuint";
    EasingName2[EasingName2["easeInSine"] = 13] = "easeInSine";
    EasingName2[EasingName2["easeOutSine"] = 14] = "easeOutSine";
    EasingName2[EasingName2["easeInOutSine"] = 15] = "easeInOutSine";
    EasingName2[EasingName2["easeInExpo"] = 16] = "easeInExpo";
    EasingName2[EasingName2["easeOutExpo"] = 17] = "easeOutExpo";
    EasingName2[EasingName2["easeInOutExpo"] = 18] = "easeInOutExpo";
    EasingName2[EasingName2["easeInCirc"] = 19] = "easeInCirc";
    EasingName2[EasingName2["easeOutCirc"] = 20] = "easeOutCirc";
    EasingName2[EasingName2["easeInOutCirc"] = 21] = "easeInOutCirc";
    EasingName2[EasingName2["easeInElastic"] = 22] = "easeInElastic";
    EasingName2[EasingName2["easeOutElastic"] = 23] = "easeOutElastic";
    EasingName2[EasingName2["easeInOutElastic"] = 24] = "easeInOutElastic";
    EasingName2[EasingName2["easeInBack"] = 25] = "easeInBack";
    EasingName2[EasingName2["easeOutBack"] = 26] = "easeOutBack";
    EasingName2[EasingName2["easeInOutBack"] = 27] = "easeInOutBack";
    EasingName2[EasingName2["easeInBounce"] = 28] = "easeInBounce";
    EasingName2[EasingName2["easeOutBounce"] = 29] = "easeOutBounce";
    EasingName2[EasingName2["easeInOutBounce"] = 30] = "easeInOutBounce";
  })(EasingName = DevConsts2.EasingName || (DevConsts2.EasingName = {}));
  let OscillatorName;
  ((OscillatorName2) => {
    OscillatorName2[OscillatorName2["harmonic"] = 1e3] = "harmonic";
    OscillatorName2[OscillatorName2["damped"] = 1001] = "damped";
    OscillatorName2[OscillatorName2["pulsar"] = 1002] = "pulsar";
  })(OscillatorName = DevConsts2.OscillatorName || (DevConsts2.OscillatorName = {}));
  let NegativeBuiltInFuncs;
  ((NegativeBuiltInFuncs2) => {
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["none"] = 0] = "none";
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["clip"] = 1] = "clip";
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["abs"] = 2] = "abs";
  })(NegativeBuiltInFuncs = DevConsts2.NegativeBuiltInFuncs || (DevConsts2.NegativeBuiltInFuncs = {}));
  let PulsarType;
  ((PulsarType2) => {
    PulsarType2[PulsarType2["normal"] = 0] = "normal";
    PulsarType2[PulsarType2["sine"] = 1] = "sine";
    PulsarType2[PulsarType2["random"] = 2] = "random";
    PulsarType2[PulsarType2["positiveRandom"] = 3] = "positiveRandom";
  })(PulsarType = DevConsts2.PulsarType || (DevConsts2.PulsarType = {}));
  let PathName;
  ((PathName2) => {
    PathName2[PathName2["line"] = 0] = "line";
    PathName2[PathName2["rect"] = 1] = "rect";
    PathName2[PathName2["circle"] = 2] = "circle";
    PathName2[PathName2["ellipse"] = 3] = "ellipse";
  })(PathName = DevConsts2.PathName || (DevConsts2.PathName = {}));
  DevConsts2.TR_EXIT = 0;
  DevConsts2.TR_DONE = 1;
  DevConsts2.TR_INTERACTIVE = 2;
  DevConsts2.TS_INIT = 0;
  DevConsts2.TS_ANIME_LOOP = 1;
  DevConsts2.TS_TELEPORT = 2;
  let WaitForWhat;
  ((WaitForWhat2) => {
    WaitForWhat2[WaitForWhat2["Custom"] = 0] = "Custom";
    WaitForWhat2[WaitForWhat2["ImageLoad"] = 1] = "ImageLoad";
    WaitForWhat2[WaitForWhat2["MediaSync"] = 2] = "MediaSync";
  })(WaitForWhat = DevConsts2.WaitForWhat || (DevConsts2.WaitForWhat = {}));
  DevConsts2.DPT_ID = 0;
  DevConsts2.DPT_VISIBLE = 1;
  DevConsts2.DPT_ATTR = 2;
  DevConsts2.DPT_ATTR_FUNC = 3;
  DevConsts2.DPT_STYLE = 4;
  DevConsts2.DPT_PIXEL = 5;
  DevConsts2.DPT_DUAL_PIXELS = 6;
  DevConsts2.DPT_CLASS = 7;
  DevConsts2.DPT_MEDIA_TIME = 8;
  DevConsts2.DPT_SRC = 9;
  DevConsts2.DPT_ELEMENT = 10;
  DevConsts2.TRS_SETUP = 0;
  DevConsts2.TRS_AT_OUT = 1;
  DevConsts2.TRS_AT_IN = 2;
  DevConsts2.DEFAULT_TRANSITION_DURATION = "1s";
  let StdTransitions;
  ((StdTransitions2) => {
    StdTransitions2[StdTransitions2["slideLeft"] = 0] = "slideLeft";
    StdTransitions2[StdTransitions2["slideRight"] = 1] = "slideRight";
    StdTransitions2[StdTransitions2["slideTop"] = 2] = "slideTop";
    StdTransitions2[StdTransitions2["slideBottom"] = 3] = "slideBottom";
    StdTransitions2[StdTransitions2["dissolve"] = 4] = "dissolve";
  })(StdTransitions = DevConsts2.StdTransitions || (DevConsts2.StdTransitions = {}));
  let Functionalities;
  ((Functionalities2) => {
    Functionalities2[Functionalities2["easings"] = 0] = "easings";
    Functionalities2[Functionalities2["oscillators"] = 1] = "oscillators";
    Functionalities2[Functionalities2["paths"] = 2] = "paths";
    Functionalities2[Functionalities2["transitions"] = 3] = "transitions";
    Functionalities2[Functionalities2["tasks"] = 4] = "tasks";
    Functionalities2[Functionalities2["flyovers"] = 5] = "flyovers";
    Functionalities2[Functionalities2["functions"] = 6] = "functions";
  })(Functionalities = DevConsts2.Functionalities || (DevConsts2.Functionalities = {}));
  let Directions;
  ((Directions2) => {
    Directions2[Directions2["normal"] = 0] = "normal";
    Directions2[Directions2["reverse"] = 1] = "reverse";
    Directions2[Directions2["alternate"] = 2] = "alternate";
    Directions2[Directions2["alternate-reverse"] = 3] = "alternate-reverse";
  })(Directions = DevConsts2.Directions || (DevConsts2.Directions = {}));
  DevConsts2.BP_FIRST_INSIDE = 0;
  DevConsts2.BP_INSIDE = 1;
  DevConsts2.BP_ALL = 2;
  DevConsts2.FS_PREPARE = 0;
  DevConsts2.FS_TELEPORT = 1;
  DevConsts2.FS_RUN = 2;
  DevConsts2.DEFAULT_DURATION = "1f";
  DevConsts2.DEFAULT_FADE_DURATION = "400ms";
  DevConsts2.PT_BOOLEAN = 0;
  DevConsts2.PT_NUMBER = 1;
  DevConsts2.PT_PIXEL = 2;
  DevConsts2.PT_STR = 3;
  DevConsts2.PT_VALUE_TEXT_LIST = 4;
  DevConsts2.PT_VALUE_TEXT_FUNC = 5;
  DevConsts2.PT_VALUE_TEXT_EXPR = 6;
})(DevConsts || (DevConsts = {}));
//# sourceMappingURL=dev-consts.js.map
