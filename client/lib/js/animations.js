"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// uuid: 3fe62749-acf9-4a01-a252-3850004fc747
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * Defines how a list of [elements](#Element) (HTML Element, SVG element and Virtual Element),
 * inside a [](#Scene) defined by [](#Selector) will have a list of
 * [properties](#Animation Properties) (left, src, color, font-size, ...) modified over time.
 *
 * Animations are added in parallel, via `addAnimation`, and in series via `addSerialAnimations`.
 * Although, the animations that are added in parallel, they can be [](#Off-Sync)
 * via `position` parameter.
 *
 * An animation has an [](#Animation Interpolator) that passes a `t` parameter from
 * [Start Value](#Animation Start Value) to [Value](#Animation Value) through the
 * [](#Animation Pipeline).
 *
 * An animation doesn't communicates direct with an HTMLElement attributes, instead
 * uses an [](#Adapter) to serve as an interface, allowing for an
 * [animation property](#Animation Properties) to map into different type of Elements
 * and to map an animation property into multiple element properties such [](#Dual Properties).
 *
 * [](#Tasks) which are also added via `addAnimation` and
 * allow to create complex animations and special effects.
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               AnimationCommonParams
    // ------------------------------------------------------------------------
    // The following section contains data for the end-user
    // generated by `gulp build-definition-files`
    // -------------------------------
    // #export-section-start: release
    /* ---- Bypass Mode ---- */
    ABeamer.BP_FIRST_INSIDE = 0; // this is the default bypass mode
    ABeamer.BP_INSIDE = 1;
    ABeamer.BP_ALL = 2;
    /* ---- Function Stage ---- */
    ABeamer.FS_PREPARE = 0;
    ABeamer.FS_TELEPORT = 1;
    ABeamer.FS_RUN = 2;
    /** Value used, if no duration is defined for an animation. */
    ABeamer.DEFAULT_DURATION = '400ms';
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    /**
     * Since animations script is executed after expressions.
     * it can't be initialized on _vars initialization.
     */
    ABeamer._vars.defaultDuration = ABeamer.DEFAULT_DURATION;
    function _parseInterpolator(handler, params, exprMotionHandler, numToName, mapper, args) {
        var func;
        params = params || {};
        switch (typeof handler) {
            case 'undefined':
                return undefined;
            case 'number':
                handler = numToName(handler);
            // it flows to string case
            case 'string':
                if (ABeamer.isExpression(handler)) {
                    func = exprMotionHandler;
                    params.__expression = handler;
                }
                else {
                    func = mapper[handler];
                }
                break;
            case 'function':
                func = handler;
                break;
        }
        if (!func) {
            ABeamer.throwI8n("Unknown: " + handler);
        }
        return {
            handler: handler,
            func: func,
            params: params,
        };
    }
    // ------------------------------------------------------------------------
    //                               _AbstractWorkAnimation
    // ------------------------------------------------------------------------
    /**
     * Base for the internal representation of an animation.
     * It can be used for `_ElAnimation` and `_PropAnimation`,
     * where `_PropAnimation` belongs to a `_ElAnimation`.
     *
     * This class stores the user parameters after being converted into an
     * internal format.
     */
    var _AbstractWorkAnimation = /** @class */ (function () {
        function _AbstractWorkAnimation() {
        }
        _AbstractWorkAnimation.prototype.assignValues = function (acp, story, scene, parent, nameTag) {
            var args = story._args;
            this.framesPerCycle = ABeamer.parseTimeHandler(acp.duration, args, parent ? parent.framesPerCycle : ABeamer._vars.defaultDuration, 0);
            this.itemDelay = ABeamer._parseItemDelay(acp, args);
            if (!story._strictMode) {
                if (this.framesPerCycle < 0 && (parent && !this.framesPerCycle)) {
                    if (story._logLevel >= ABeamer.LL_ERROR) {
                        story.logMsg(nameTag + " has invalid duration frames: " + this.framesPerCycle);
                    }
                    return false;
                }
            }
            else {
                if ((parent && !ABeamer.isPositiveNatural(this.framesPerCycle)) ||
                    (!parent && !ABeamer.isNotNegativeNatural(this.framesPerCycle))) {
                    ABeamer.throwErr(nameTag + " has invalid duration frames: " + this.framesPerCycle);
                }
            }
            var refOrDef = parent ? parent.positionFrame : scene._frameInNr;
            this.positionFrame = ABeamer.parseTimeHandler(acp.position, args, refOrDef, refOrDef);
            if (!story._strictMode) {
                if (this.positionFrame < 0) {
                    story.logMsg(nameTag + " has invalid position: " + this.positionFrame);
                    return false;
                }
            }
            else {
                if (!ABeamer.isNotNegativeNatural(this.positionFrame)) {
                    ABeamer.throwErr(nameTag + " has invalid position: " + this.positionFrame);
                }
            }
            if (acp.easing) {
                this.easing = _parseInterpolator(acp.easing, {}, ABeamer._expressionEasing, ABeamer._easingNumToStr, ABeamer._easingFunctions, args);
            }
            else if (parent) {
                this.easing = parent.easing;
            }
            if (acp.oscillator) {
                this.oscillator = _parseInterpolator(acp.oscillator.handler, acp.oscillator.params, ABeamer._expressionEasing, ABeamer._oscillatorNumToStr, ABeamer._easingFunctions, args);
            }
            else if (parent) {
                this.oscillator = parent.oscillator;
            }
            if (acp.path) {
                this.path = _parseInterpolator(acp.path.handler, acp.path.params, undefined, ABeamer._pathNumToStr, ABeamer._pathFunctions, args);
            }
            else if (parent) {
                this.path = parent.path;
            }
            return true;
        };
        return _AbstractWorkAnimation;
    }());
    ABeamer._AbstractWorkAnimation = _AbstractWorkAnimation;
    // ------------------------------------------------------------------------
    //                               _ElWorkAnimation
    // ------------------------------------------------------------------------
    /**
     * Internal representation of an element animation.
     *
     * An element can represent multiple DOM Elements and is defined by its selector.
     *
     * It stores the the user parameters after being converted into an
     * internal format.
     */
    var _ElWorkAnimation = /** @class */ (function (_super) {
        __extends(_ElWorkAnimation, _super);
        function _ElWorkAnimation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.elAdapters = [];
            _this.propInterpolators = [];
            return _this;
        }
        _ElWorkAnimation.prototype.buildElements = function (story, scene, sceneAdpt, anime) {
            this.elAdapters = ABeamer._parseInElSelector(story, this.elAdapters, sceneAdpt, anime.selector);
        };
        return _ElWorkAnimation;
    }(_AbstractWorkAnimation));
    ABeamer._ElWorkAnimation = _ElWorkAnimation;
    // ------------------------------------------------------------------------
    //                               _WorkAnimationProp
    // ------------------------------------------------------------------------
    /**
     * Internal representation of an property animation.
     *
     * Each property belongs to an element defined by its selector,
     * which can represent multiple DOM Elements.
     *
     * It stores the the user parameters after being converted into an
     * internal format.
     *
     * This class is abstract because it's always derived by an Interpolator class
     */
    var _WorkAnimationProp = /** @class */ (function (_super) {
        __extends(_WorkAnimationProp, _super);
        function _WorkAnimationProp(animProp) {
            var _this = _super.call(this) || this;
            _this.realPropName = animProp.prop;
            _this.propName = animProp.prop;
            _this.animProp = animProp;
            _this.iterationCount = Math.max(animProp.iterationCount || 1, 1);
            _this.scaleDuration = _this.iterationCount;
            _this.dirPair = ABeamer._propDirToDirPair(animProp.direction);
            _this.bypassForwardMode = animProp.bypassForwardMode;
            _this.bypassBackwardMode = animProp.bypassBackwardMode;
            _this.roundFunc = ABeamer.parseRoundFunc(animProp.roundFunc);
            _this.waitFor = !animProp.waitFor ? undefined :
                animProp.waitFor.map(function (waitItem) {
                    waitItem.prop = waitItem.prop || _this.propName;
                    return waitItem;
                });
            return _this;
        }
        return _WorkAnimationProp;
    }(_AbstractWorkAnimation));
    ABeamer._WorkAnimationProp = _WorkAnimationProp;
    // ------------------------------------------------------------------------
    //                               Teleportation
    // ------------------------------------------------------------------------
    function _prepareAnimationsForTeleporting(animes, args) {
        animes.forEach(function (anime) {
            if (anime.tasks) {
                ABeamer._prepareTasksForTeleporting(anime, anime.tasks, args);
            }
        });
    }
    ABeamer._prepareAnimationsForTeleporting = _prepareAnimationsForTeleporting;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=animations.js.map