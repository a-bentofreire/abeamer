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
    DevConsts.VERSION = "0.1.0";
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
    // easings
    // -------------
    DevConsts.DEFAULT_EASING = 'linear';
    // -------------
    // oscillators
    // -------------
    var PulsarType;
    (function (PulsarType) {
        PulsarType[PulsarType["normal"] = 0] = "normal";
        PulsarType[PulsarType["sine"] = 1] = "sine";
        PulsarType[PulsarType["random"] = 2] = "random";
        PulsarType[PulsarType["positiveRandom"] = 3] = "positiveRandom";
    })(PulsarType = DevConsts.PulsarType || (DevConsts.PulsarType = {}));
    // -------------
    // tasks
    // -------------
    DevConsts.TR_EXIT = 0;
    DevConsts.TR_DONE = 1;
    DevConsts.TR_INTERACTIVE = 2;
    DevConsts.TS_INIT = 0;
    DevConsts.TS_ANIME_LOOP = 1;
    // -------------
    // shape-tasks
    // -------------
    var Shapes;
    (function (Shapes) {
        Shapes[Shapes["rectangle"] = 0] = "rectangle";
        Shapes[Shapes["line"] = 1] = "line";
        Shapes[Shapes["circle"] = 2] = "circle";
        Shapes[Shapes["arrow"] = 3] = "arrow";
        Shapes[Shapes["speech"] = 4] = "speech";
    })(Shapes = DevConsts.Shapes || (DevConsts.Shapes = {}));
    DevConsts.DEFAULT_ARROW_LENGTH = 10;
    DevConsts.DEFAULT_ARROW_WIDTH = 10;
    DevConsts.DEFAULT_SPEECH_START = 10;
    DevConsts.DEFAULT_SPEECH_WIDTH = 10;
    DevConsts.DEFAULT_SPEECH_HEIGHT = 10;
    DevConsts.DEFAULT_SPEECH_SHIFT = 0;
    var SpeechPosition;
    (function (SpeechPosition) {
        SpeechPosition[SpeechPosition["left"] = 0] = "left";
        SpeechPosition[SpeechPosition["right"] = 1] = "right";
    })(SpeechPosition = DevConsts.SpeechPosition || (DevConsts.SpeechPosition = {}));
    // -------------
    // transitions
    // -------------
    DevConsts.TRS_SETUP = 0;
    DevConsts.TRS_AT_OUT = 1;
    DevConsts.TRS_AT_IN = 2;
    DevConsts.DEFAULT_TRANSITION_DURATION = '1s';
    var StdTransition;
    (function (StdTransition) {
        StdTransition[StdTransition["slideLeft"] = 0] = "slideLeft";
        StdTransition[StdTransition["slideRight"] = 1] = "slideRight";
        StdTransition[StdTransition["dissolve"] = 2] = "dissolve";
    })(StdTransition = DevConsts.StdTransition || (DevConsts.StdTransition = {}));
    // -------------
    // adapters
    // -------------
    DevConsts.PT_ID = 0;
    DevConsts.PT_VISIBLE = 1;
    DevConsts.PT_ATTR = 2;
    DevConsts.PT_ATTR_FUNC = 3;
    DevConsts.PT_STYLE = 4;
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
    DevConsts.DIRECTION_TO_DIR_PAIR = [[1, 1], [-1, -1], [1, -1],
        [-1, 1]];
    // -------------
    // animations
    // -------------
    DevConsts.BP_FIRST_INSIDE = 0;
    DevConsts.BP_INSIDE = 1;
    DevConsts.BP_ALL = 2;
    DevConsts.DEFAULT_DURATION = '400ms';
    // -------------
    // interpolator
    // -------------
    DevConsts.VALUE_MACRO = '__VALUE__';
    DevConsts.PT_PIXEL = 0;
    DevConsts.PT_NUMBER = 1;
    DevConsts.PT_STR_MAP = 2;
    DevConsts.PT_STYLE_IN_STR_VALUE = 3;
    DevConsts.PT_STR = 4;
    DevConsts.PT_BOOLEAN = 5;
})(DevConsts = exports.DevConsts || (exports.DevConsts = {}));
//# sourceMappingURL=dev-consts.js.map