"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2.BP_FIRST_INSIDE = 0;
  ABeamer2.BP_INSIDE = 1;
  ABeamer2.BP_ALL = 2;
  ABeamer2.FS_PREPARE = 0;
  ABeamer2.FS_TELEPORT = 1;
  ABeamer2.FS_RUN = 2;
  ABeamer2.DEFAULT_DURATION = "1f";
  ABeamer2.DEFAULT_FADE_DURATION = "400ms";
  function _parseInterpolator(handler, params, exprMotionHandler, numToName, mapper, args) {
    let func;
    params = params || {};
    switch (typeof handler) {
      case "undefined":
        return void 0;
      case "number":
        handler = numToName(handler);
      // it flows to string case
      case "string":
        if (handler.startsWith("==")) {
          handler = calcStr(handler.substr(1), args);
        }
        if (isExpr(handler)) {
          func = exprMotionHandler;
          params._expression = handler;
        } else {
          func = mapper[handler];
        }
        break;
      case "function":
        func = handler;
        break;
    }
    if (!func) {
      throwI8n(`Unknown: ${handler}`);
    }
    return {
      handler,
      func,
      params
    };
  }
  class _AbstractWorkAnimation {
    assignValues(acp, story, parent, nameTag, refOrDef) {
      const args = story._args;
      this.framesPerCycle = parseTimeHandler(
        acp.duration,
        args,
        parent ? parent.framesPerCycle : ABeamer2.DEFAULT_DURATION,
        0
      );
      this.itemDelay = _parseItemDelay(acp, args);
      if (!story._strictMode) {
        if (this.framesPerCycle < 0 && (parent && !this.framesPerCycle)) {
          if (story._logLevel >= LL_ERROR) {
            story.logMsg(`${nameTag} has invalid duration frames: ${this.framesPerCycle}`);
          }
          return false;
        }
      } else {
        if (parent && !isPositiveNatural(this.framesPerCycle) || !parent && !isNotNegativeNatural(this.framesPerCycle)) {
          throwErr(`${nameTag} has invalid duration frames: ${this.framesPerCycle}`);
        }
      }
      this.positionFrame = parseTimeHandler(acp.position, args, refOrDef, refOrDef);
      this.advance = acp.advance;
      if (!story._strictMode) {
        if (this.positionFrame < 0) {
          story.logMsg(`${nameTag} has invalid position: ${this.positionFrame}`);
          return false;
        }
      } else {
        if (!isNotNegativeNatural(this.positionFrame)) {
          throwErr(`${nameTag} has invalid position: ${this.positionFrame}`);
        }
      }
      if (acp.easing) {
        this.easing = _parseInterpolator(
          acp.easing,
          {},
          _expressionEasing,
          _easingNumToStr,
          _easingFunctions,
          args
        );
      } else if (parent) {
        this.easing = parent.easing;
      }
      if (acp.oscillator) {
        this.oscillator = _parseInterpolator(
          acp.oscillator.handler,
          acp.oscillator.params,
          _expressionEasing,
          _oscillatorNumToStr,
          _easingFunctions,
          args
        );
      } else if (parent) {
        this.oscillator = parent.oscillator;
      }
      if (acp.path) {
        this.path = _parseInterpolator(
          acp.path.handler,
          acp.path.params,
          _expressionPath,
          _pathNumToStr,
          _pathFunctions,
          args
        );
      } else if (parent) {
        this.path = parent.path;
      }
      return true;
    }
  }
  ABeamer2._AbstractWorkAnimation = _AbstractWorkAnimation;
  class _ElWorkAnimation extends _AbstractWorkAnimation {
    constructor() {
      super(...arguments);
      this.elAdapters = [];
      this.propInterpolators = [];
    }
    buildElements(story, sceneAdpt, anime) {
      this.elAdapters = _parseInElSelector(
        story,
        this.elAdapters,
        sceneAdpt,
        anime.selector
      );
    }
  }
  ABeamer2._ElWorkAnimation = _ElWorkAnimation;
  class _WorkAnimationProp extends _AbstractWorkAnimation {
    constructor(animProp) {
      super();
      this.realPropName = animProp.prop;
      this.propName = animProp.prop;
      this.animProp = animProp;
      this.iterationCount = Math.max(animProp.iterationCount || 1, 1);
      this.scaleDuration = this.iterationCount;
      this.dirPair = _propDirToDirPair(animProp.direction);
      this.bypassForwardMode = animProp.bypassForwardMode;
      this.bypassBackwardMode = animProp.bypassBackwardMode;
      this.roundFunc = parseRoundFunc(animProp.roundFunc);
      this.waitFor = !animProp.waitFor ? void 0 : animProp.waitFor.map((waitItem) => {
        waitItem.prop = waitItem.prop || this.propName;
        return waitItem;
      });
    }
    propAssignValues(acp, story, ai, elIndex) {
      if (!this.assignValues(
        acp,
        story,
        ai,
        this.realPropName,
        ai.nextPropStartFrame !== void 0 ? ai.nextPropStartFrame : ai.positionFrame
      )) {
        return false;
      }
      const startFrame = this.positionFrame + (this.itemDelay.duration ? _computeItemDelay(this.itemDelay, elIndex) : 0);
      this.startFrame = startFrame;
      this.totalDuration = this.framesPerCycle * this.scaleDuration;
      this.endFrame = this.totalDuration + startFrame;
      ai.nextPropStartFrame = this.advance === true ? this.endFrame : void 0;
      return true;
    }
  }
  ABeamer2._WorkAnimationProp = _WorkAnimationProp;
  function _prepareAnimationsForTeleporting(animes, args) {
    animes.forEach((anime) => {
      if (anime.tasks) {
        _prepareTasksForTeleporting(anime, anime.tasks, args);
      }
    });
  }
  ABeamer2._prepareAnimationsForTeleporting = _prepareAnimationsForTeleporting;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=animations.js.map
