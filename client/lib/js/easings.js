"use strict";
var ABeamer;
((ABeamer2) => {
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
  })(EasingName = ABeamer2.EasingName || (ABeamer2.EasingName = {}));
  ABeamer2._easingFunctions = {
    linear(t) {
      return t;
    }
  };
  function _easingNumToStr(num) {
    return EasingName[num];
  }
  ABeamer2._easingNumToStr = _easingNumToStr;
  const excludeFunctions = ["linear", "swing", "_default", "def"];
  Object.keys($.easing).forEach((name) => {
    if (excludeFunctions.indexOf(name) !== -1) {
      return;
    }
    ABeamer2._easingFunctions[name] = (t) => $.easing[name](0, t, 0, 1, 1);
  });
  function _expressionEasing(t, params, args) {
    _vars.t = t;
    return parseFloat(
      calcExpr(params._expression, args)
    );
  }
  ABeamer2._expressionEasing = _expressionEasing;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=easings.js.map
