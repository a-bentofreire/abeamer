"use strict";
var ABeamer;
((ABeamer2) => {
  let TimeUnit;
  ((TimeUnit2) => {
    TimeUnit2[TimeUnit2["f"] = 0] = "f";
    TimeUnit2[TimeUnit2["ms"] = 1] = "ms";
    TimeUnit2[TimeUnit2["s"] = 2] = "s";
    TimeUnit2[TimeUnit2["m"] = 3] = "m";
    TimeUnit2[TimeUnit2["%"] = 4] = "%";
  })(TimeUnit = ABeamer2.TimeUnit || (ABeamer2.TimeUnit = {}));
  function frame2Time(frame, fps, unit, maxPrecision) {
    switch (unit) {
      case 0 /* f */:
        return frame.toString();
      case 1 /* ms */:
        frame = frame * 1e3;
        break;
      case 3 /* m */:
        frame = frame / 60;
        break;
    }
    const unitTime = frame / fps;
    const divider = 10 ** (maxPrecision || 4);
    return (downRound(unitTime * divider) / divider).toString() + TimeUnit[unit];
  }
  ABeamer2.frame2Time = frame2Time;
  function parseTimeHandler(timeOrFrame, args, defaultTimeOrFrame, referenceFrame, toInt = true) {
    if (timeOrFrame === void 0 || timeOrFrame === "") {
      timeOrFrame = defaultTimeOrFrame;
    }
    let shift = "";
    const story = args.story;
    if (typeof timeOrFrame === "function") {
      timeOrFrame = timeOrFrame(args);
    }
    let defaultUnit = story.defaultUnit;
    let isStringTime = typeof timeOrFrame === "string";
    if (isStringTime) {
      const exprTime = ifExprCalc(timeOrFrame, args);
      if (exprTime !== void 0) {
        timeOrFrame = exprTime;
        isStringTime = typeof timeOrFrame === "string";
      }
    }
    if (isStringTime) {
      const [, sShift, sValue, suffix] = timeOrFrame.match(/^([+\-])?([\d\.]+)([\w%]+)$/) || ["", "", "", ""];
      defaultUnit = TimeUnit[suffix];
      if (defaultUnit === void 0) {
        throw `Unknown time of ${timeOrFrame}`;
      }
      timeOrFrame = parseFloat(sValue);
      shift = sShift;
    }
    let res = timeOrFrame;
    switch (defaultUnit) {
      case 1 /* ms */:
        res = res * story.fps / 1e3;
        break;
      case 2 /* s */:
        res = res * story.fps;
        break;
      case 3 /* m */:
        res = res * story.fps * 60;
        break;
      case 4 /* % */:
        res = defaultTimeOrFrame * res / 100;
        break;
    }
    switch (shift) {
      case "+":
        res = referenceFrame + res;
        break;
      case "-":
        res = referenceFrame - res;
        break;
    }
    return toInt ? downRound(res) : res;
  }
  ABeamer2.parseTimeHandler = parseTimeHandler;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=time.js.map
