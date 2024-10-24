"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2.TRS_SETUP = 0;
  ABeamer2.TRS_AT_OUT = 1;
  ABeamer2.TRS_AT_IN = 2;
  ABeamer2.DEFAULT_TRANSITION_DURATION = "1s";
  let StdTransitions;
  ((StdTransitions2) => {
    StdTransitions2[StdTransitions2["slideLeft"] = 0] = "slideLeft";
    StdTransitions2[StdTransitions2["slideRight"] = 1] = "slideRight";
    StdTransitions2[StdTransitions2["slideTop"] = 2] = "slideTop";
    StdTransitions2[StdTransitions2["slideBottom"] = 3] = "slideBottom";
    StdTransitions2[StdTransitions2["dissolve"] = 4] = "dissolve";
  })(StdTransitions = ABeamer2.StdTransitions || (ABeamer2.StdTransitions = {}));
  ABeamer2._transitionFunctions = {};
  class _TransitionInterpolator {
    constructor() {
      this._active = false;
      this._transition = {
        handler: ""
      };
    }
    _set(transition, sceneFrameCount, args) {
      this._active = false;
      this._transition = transition;
      let handler = transition.handler;
      const duration = transition.duration;
      if (handler === void 0) {
        return false;
      }
      const frameCount = parseTimeHandler(
        duration,
        args,
        ABeamer2.DEFAULT_TRANSITION_DURATION,
        sceneFrameCount
      );
      if (frameCount === 0) {
        return false;
      }
      this._params = {
        bothVisible: true,
        frameCount,
        leaveFrameCount: Math.round(frameCount / 2)
      };
      this._params.enterFrameCount = frameCount - this._params.leaveFrameCount;
      if (typeof handler === "number") {
        handler = StdTransitions[handler];
      }
      if (typeof handler === "string") {
        this._transitionFunc = ABeamer2._transitionFunctions[handler];
      } else {
        this._transitionFunc = handler;
      }
      this._active = this._transitionFunc !== void 0;
      return this._active;
    }
    _setup(leaveAdapter, enterAdapter, sceneFrameCount, args) {
      const params = this._params;
      this._firstOutTransitionFrame = sceneFrameCount - params.leaveFrameCount;
      params.leaveAdapter = leaveAdapter;
      params.enterAdapter = enterAdapter;
      params.state = ABeamer2.TRS_SETUP;
      this._transitionFunc(params, args);
    }
    _render(frameNr, _frameCount, isLeaveAdapted, args) {
      const params = this._params;
      if (isLeaveAdapted) {
        const frameI = frameNr - this._firstOutTransitionFrame;
        if (frameI >= 0) {
          params.state = ABeamer2.TRS_AT_OUT;
          params.enterFrameI = void 0;
          params.leaveRealFrameI = frameNr;
          params.frameI = frameI;
          if (params.bothVisible && params.enterAdapter && params.frameI === 0) {
            params.enterAdapter.setProp("visible", true, args);
          }
          this._transitionFunc(params, args);
        }
      } else {
        if (frameNr <= params.enterFrameCount) {
          params.state = ABeamer2.TRS_AT_IN;
          params.enterFrameI = frameNr;
          params.leaveRealFrameI = void 0;
          params.frameI = frameNr + params.leaveFrameCount;
          if (params.bothVisible) {
            if (params.enterAdapter && frameNr === 0) {
              params.leaveAdapter.setProp("visible", true, args);
            }
            if (frameNr === params.enterFrameCount) {
              params.leaveAdapter.setProp("visible", false, args);
            }
          }
          this._transitionFunc(params, args);
        }
      }
    }
  }
  ABeamer2._TransitionInterpolator = _TransitionInterpolator;
  function _slide(params, args, refAttrName, lengthAttrName, isNegDir) {
    const sParams = params;
    const leaveAdapter = params.leaveAdapter;
    if (params.state === ABeamer2.TRS_SETUP) {
      sParams.ref = parseInt(leaveAdapter.getProp(refAttrName, args));
      sParams.length = parseInt(leaveAdapter.getProp(lengthAttrName, args));
    } else {
      const shift = downRound(params.frameI / params.frameCount * sParams.length);
      let ref = sParams.ref;
      ref = isNegDir ? ref - shift : ref + shift;
      params.leaveAdapter.setProp(refAttrName, ref, args);
      if (args.isVerbose) {
        args.story.logFrmt("slide-leave", [
          ["frameI", params.frameI],
          [refAttrName, ref]
        ]);
      }
      if (params.enterAdapter) {
        ref = isNegDir ? ref + sParams.length : ref - sParams.length;
        params.enterAdapter.setProp(refAttrName, ref, args);
        if (args.isVerbose) {
          args.story.logFrmt("slide-enter", [
            ["frameI", params.frameI],
            [refAttrName, refAttrName]
          ]);
        }
      }
    }
  }
  ABeamer2._transitionFunctions["slideLeft"] = _slideLeft;
  function _slideLeft(params, args) {
    _slide(params, args, "left", "width", true);
  }
  ABeamer2._transitionFunctions["slideRight"] = _slideRight;
  function _slideRight(params, args) {
    _slide(params, args, "left", "width", false);
  }
  ABeamer2._transitionFunctions["slideTop"] = _slideTop;
  function _slideTop(params, args) {
    _slide(params, args, "top", "height", true);
  }
  ABeamer2._transitionFunctions["slideBottom"] = _slideBottom;
  function _slideBottom(params, args) {
    _slide(params, args, "top", "height", false);
  }
  ABeamer2._transitionFunctions["dissolve"] = _dissolveTransition;
  function _dissolveTransition(params, args) {
    if (params.state !== ABeamer2.TRS_SETUP) {
      let opacity = 1 - params.frameI / params.frameCount;
      params.leaveAdapter.setProp("opacity", opacity, args);
      if (args.isVerbose) {
        args.story.logFrmt("dissolve-leave", [
          ["frameI", params.frameI],
          ["opacity", opacity]
        ]);
      }
      if (params.enterAdapter) {
        opacity = 1 - opacity;
        params.enterAdapter.setProp("opacity", opacity, args);
        if (args.isVerbose) {
          args.story.logFrmt("dissolve-enter", [
            ["frameI", params.frameI],
            ["opacity", opacity]
          ]);
        }
      }
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=transitions.js.map
