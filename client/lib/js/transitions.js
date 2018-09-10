"use strict";
// uuid: 2aaf5a17-2c1e-4290-a541-b2fe7a88ea69
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements transitions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * A **transition** is the motion between the end of a scene
 * and the beginning of the next scene.
 *
 * Its computation is done outside the [](Animation Pipeline).
 *
 * It can affect the properties of its children elements,
 * in such cases it's required for the user to provide the starting value
 * since the computed value might not be correct.
 * Currently, only scene transitions are supported,
 * future versions might support element transition as well.
 * The transition duration provided by the user is converted into frames
 * and split half to the out scene, the previous scene,
 * and half into the in scene, the next scene.
 * ABeamer doesn't adds extra frames to ensure the execution of the transition,
 * instead it works on top of the element animation pipeline.
 * If there aren't enough frames in the pipeline, part of the transition will be missing.
 *
 * ## Core transitions
 * **WARNING!** In the ABeamer 2.x these core transitions will move `core-transitions` plugin.
 * To prevent breaking changes include now the js script `core-transitions.js` on the html file.
 *
 *  ABeamer has the following core transitions:
 * - `slideLeft`
 * - `slideRight`
 * - `slideTop`
 * - `slideBottom`
 * - `dissolve`
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Transitions
    // ------------------------------------------------------------------------
    // The following section contains data for the end-user
    // generated by `gulp build-definition-files`
    // -------------------------------
    // #export-section-start: release
    // ------------------------------------------------------------------------
    //                               Transition States
    // ------------------------------------------------------------------------
    ABeamer.TRS_SETUP = 0;
    ABeamer.TRS_AT_OUT = 1;
    ABeamer.TRS_AT_IN = 2;
    ABeamer.DEFAULT_TRANSITION_DURATION = '1s';
    /**
     * List of the built-in Transition Names.
     */
    var StdTransitions;
    (function (StdTransitions) {
        StdTransitions[StdTransitions["slideLeft"] = 0] = "slideLeft";
        StdTransitions[StdTransitions["slideRight"] = 1] = "slideRight";
        StdTransitions[StdTransitions["slideTop"] = 2] = "slideTop";
        StdTransitions[StdTransitions["slideBottom"] = 3] = "slideBottom";
        StdTransitions[StdTransitions["dissolve"] = 4] = "dissolve";
    })(StdTransitions = ABeamer.StdTransitions || (ABeamer.StdTransitions = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer._transitionFunctions = {};
    var _TransitionInterpolator = /** @class */ (function () {
        function _TransitionInterpolator() {
            this._active = false;
            this._transition = {
                handler: '',
            };
        }
        _TransitionInterpolator.prototype._set = function (transition, sceneFrameCount, args) {
            this._active = false;
            this._transition = transition;
            var handler = transition.handler;
            var duration = transition.duration;
            if (handler === undefined) {
                return false;
            }
            var frameCount = ABeamer.parseTimeHandler(duration, args, ABeamer.DEFAULT_TRANSITION_DURATION, sceneFrameCount);
            if (frameCount === 0) {
                return false;
            }
            this._params = {
                bothVisible: true,
                frameCount: frameCount,
                leaveFrameCount: Math.round(frameCount / 2),
            };
            this._params.enterFrameCount = frameCount - this._params.leaveFrameCount;
            if (typeof handler === 'number') {
                handler = StdTransitions[handler];
            }
            if (typeof handler === 'string') {
                this._transitionFunc = ABeamer._transitionFunctions[handler];
            }
            else {
                this._transitionFunc = handler;
            }
            this._active = this._transitionFunc !== undefined;
            return this._active;
        };
        _TransitionInterpolator.prototype._setup = function (leaveAdapter, enterAdapter, sceneFrameCount, args) {
            var params = this._params;
            this._firstOutTransitionFrame = sceneFrameCount - params.leaveFrameCount;
            params.leaveAdapter = leaveAdapter;
            params.enterAdapter = enterAdapter;
            params.state = ABeamer.TRS_SETUP;
            this._transitionFunc(params, args);
        };
        _TransitionInterpolator.prototype._render = function (frameNr, _frameCount, isLeaveAdapted, args) {
            var params = this._params;
            if (isLeaveAdapted) {
                var frameI = frameNr - this._firstOutTransitionFrame;
                if (frameI >= 0) {
                    params.state = ABeamer.TRS_AT_OUT;
                    params.enterFrameI = undefined;
                    params.leaveRealFrameI = frameNr;
                    params.frameI = frameI;
                    if (params.bothVisible && params.enterAdapter && params.frameI === 0) {
                        params.enterAdapter.setProp('visible', true, args);
                    }
                    this._transitionFunc(params, args);
                }
            }
            else {
                if (frameNr <= params.enterFrameCount) {
                    params.state = ABeamer.TRS_AT_IN;
                    params.enterFrameI = frameNr;
                    params.leaveRealFrameI = undefined;
                    params.frameI = frameNr + params.leaveFrameCount;
                    if (params.bothVisible) {
                        if (params.enterAdapter && frameNr === 0) {
                            params.leaveAdapter.setProp('visible', true, args);
                        }
                        if (frameNr === params.enterFrameCount) {
                            params.leaveAdapter.setProp('visible', false, args);
                        }
                    }
                    this._transitionFunc(params, args);
                }
            }
        };
        return _TransitionInterpolator;
    }());
    ABeamer._TransitionInterpolator = _TransitionInterpolator;
    function _slide(params, args, refAttrName, lengthAttrName, isNegDir) {
        var sParams = params;
        var leaveAdapter = params.leaveAdapter;
        if (params.state === ABeamer.TRS_SETUP) {
            sParams.ref = parseInt(leaveAdapter.getProp(refAttrName, args));
            sParams.length = parseInt(leaveAdapter.getProp(lengthAttrName, args));
        }
        else {
            var shift = ABeamer.downRound((params.frameI / params.frameCount) * sParams.length);
            var ref = sParams.ref;
            ref = isNegDir ? ref - shift : ref + shift;
            params.leaveAdapter.setProp(refAttrName, ref, args);
            // #debug-start
            if (args.isVerbose) {
                args.story.logFrmt('slide-leave', [
                    ['frameI', params.frameI],
                    [refAttrName, ref],
                ]);
            }
            // #debug-end
            if (params.enterAdapter) {
                ref = isNegDir ? ref + sParams.length : ref - sParams.length;
                params.enterAdapter.setProp(refAttrName, ref, args);
                // #debug-start
                if (args.isVerbose) {
                    args.story.logFrmt('slide-enter', [
                        ['frameI', params.frameI],
                        [refAttrName, refAttrName],
                    ]);
                }
                // #debug-end
            }
        }
    }
    ABeamer._transitionFunctions['slideLeft'] = _slideLeft;
    function _slideLeft(params, args) {
        _slide(params, args, 'left', 'width', true);
    }
    ABeamer._transitionFunctions['slideRight'] = _slideRight;
    function _slideRight(params, args) {
        _slide(params, args, 'left', 'width', false);
    }
    ABeamer._transitionFunctions['slideTop'] = _slideTop;
    function _slideTop(params, args) {
        _slide(params, args, 'top', 'height', true);
    }
    ABeamer._transitionFunctions['slideBottom'] = _slideBottom;
    function _slideBottom(params, args) {
        _slide(params, args, 'top', 'height', false);
    }
    ABeamer._transitionFunctions['dissolve'] = _dissolveTransition;
    function _dissolveTransition(params, args) {
        if (params.state !== ABeamer.TRS_SETUP) {
            var opacity = 1 - (params.frameI / params.frameCount);
            params.leaveAdapter.setProp('opacity', opacity, args);
            // #debug-start
            if (args.isVerbose) {
                args.story.logFrmt('dissolve-leave', [
                    ['frameI', params.frameI],
                    ['opacity', opacity],
                ]);
            }
            // #debug-end
            if (params.enterAdapter) {
                opacity = 1 - opacity;
                params.enterAdapter.setProp('opacity', opacity, args);
                // #debug-start
                if (args.isVerbose) {
                    args.story.logFrmt('dissolve-enter', [
                        ['frameI', params.frameI],
                        ['opacity', opacity],
                    ]);
                }
                // #debug-end
            }
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=transitions.js.map