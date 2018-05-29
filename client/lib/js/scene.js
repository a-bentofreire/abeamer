"use strict";
// uuid: 9c35c260-ebf2-42d9-b60d-94b1fe127739
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **scene** is a story segment and an element container.
 * Each scene has an animation pipeline that contains the actions to perform in each frame.
 * If a frame has no actions, it's called a still.
 * To build the animation pipeline use the methods:
 *
 * - `addAnimations`
 * - `addSerialAnimations`
 * - `addStills`
 *
 * A scene usually is associated with a `div` in the html file.
 * Scenes with `class=abeamer-class` are automatically added to story upon story creation.
 * But it can also be a virtual scene.
 *
 * Only one scene can be active at a certain point in time,
 * but if it's defined a transition it two scene can be visible during the transition process.
 *
 * @see transitions
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Scene
    // ------------------------------------------------------------------------
    var _Scene = /** @class */ (function () {
        function _Scene(story, sceneSelector, prevScene) {
            this._frameCount = 0;
            this._storyFrameStart = 0;
            this._storySceneIndex = -1;
            this._frameInNr = 0;
            /** Increases inside an `addAnimation`. It used to avoid multiple calls during teleporting. */
            this._addAnimationCallCount = 0;
            /** Internal list of all the scene frames. */
            this._frames = [];
            /** Internal position of where the render pipeline was [](#consumed). */
            this._renderFramePos = 0;
            this._transitionInterpolator = new ABeamer._TransitionInterpolator();
            /**
             * `_actionRgMaps` are 'maps' between the input animations and the output action
             * for every frame.
             * _actionRgMaps allow for a new animation to have access to the last modified value
             * of a property of an element of the previous animation.
             * And in a backward motion allows to retrieve the original value.
             */
            this._actionRgMaps = [];
            this._story = story;
            this._sceneAdpt = ABeamer._isVirtualScene(sceneSelector)
                ? new ABeamer._VirtualSceneAdapter(sceneSelector)
                : new ABeamer._DOMSceneAdapter(sceneSelector);
            if (prevScene) {
                this._prevScene = prevScene;
                prevScene._nextScene = this;
            }
        }
        Object.defineProperty(_Scene.prototype, "transition", {
            /**
             * Returns scene transition information.
             *
             * @see transitions
             */
            get: function () {
                return this._transitionInterpolator._transition;
            },
            /**
             * Defines the scene transition selector (name or function)
             * and duration.
             *
             * @see transitions
             */
            set: function (transition) {
                this._transitionInterpolator._set(transition, this._frameCount, this._story._args);
                // if it's teleporting, then convert into a wrapper task.
                if (this._story.isTeleporting && !this._addAnimationCallCount) {
                    this.addAnimations([{
                            tasks: [
                                {
                                    handler: 'scene-transition',
                                    params: {
                                        handler: transition.handler,
                                        duration: transition.duration,
                                    },
                                },
                            ],
                        }]);
                }
            },
            enumerable: true,
            configurable: true
        });
        /** Removes it self from the story. Used internally. */
        _Scene.prototype._remove = function () {
            if (this._prevScene) {
                this._prevScene._nextScene = this._nextScene;
            }
            if (this._nextScene) {
                this._nextScene._prevScene = this._prevScene;
            }
        };
        Object.defineProperty(_Scene.prototype, "frameInNr", {
            // ------------------------------------------------------------------------
            //                               get/set
            // ------------------------------------------------------------------------
            /**
             * Defines the end of the scene pipeline. Usually this value is the
             * same as `frameCount` but for off-sync animations `frameInNr` can have
             * less value than frameCount.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._frameInNr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Scene.prototype, "frameCount", {
            /**
             * Total number of frames contained the scene.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._frameCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Scene.prototype, "storyFrameStart", {
            /**
             * Sum of all the frames from the previous scenes.
             *
             * #end-user @readonly
             */
            get: function () {
                this._story._calcFrameCount();
                return this._storyFrameStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Scene.prototype, "storySceneIndex", {
            /**
             * Zero-based Index of this scene within the list of scenes.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._storySceneIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Scene.prototype, "id", {
            /**
             * Scene id from the DOM element.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._sceneAdpt.getProp('id');
            },
            enumerable: true,
            configurable: true
        });
        // ------------------------------------------------------------------------
        //                               Frame methods
        // ------------------------------------------------------------------------
        _Scene.prototype._containsFrame = function (storyFramePos) {
            this._story._calcFrameCount();
            return this._internalContainsFrame(storyFramePos);
        };
        _Scene.prototype._internalContainsFrame = function (storyFramePos) {
            return (storyFramePos >= this._storyFrameStart)
                && storyFramePos < (this._storyFrameStart + this._frameCount);
        };
        _Scene.prototype._setStoryParams = function (storyFramePos, storySceneIndex) {
            this._storyFrameStart = storyFramePos;
            this._storySceneIndex = storySceneIndex;
            return this._frameCount;
        };
        _Scene.prototype._gotoSceneFrame = function (framePos) {
            if (framePos < 0 || framePos >= this._frameCount) {
                ABeamer.throwErr("Position " + framePos + " is out of scope");
            }
            this._internalGotoFrame(framePos);
        };
        _Scene.prototype._internalGotoFrame = function (framePos) {
            if (framePos === this._renderFramePos) {
                return;
            }
            var isVerbose = this._story.isVerbose;
            // @WARN: Don't use story.renderDir since it can bypassing backwards
            // in order to rewind and the story.renderDir be moving forward
            var bypassDir = framePos > this._renderFramePos ? 1 : -1;
            while (framePos !== this._renderFramePos) {
                this._internalRenderFrame(this._renderFramePos, bypassDir, isVerbose, true);
            }
        };
        // ------------------------------------------------------------------------
        //                               Visibility
        // ------------------------------------------------------------------------
        _Scene.prototype._show = function () {
            this._sceneAdpt.setProp('visible', 'true');
        };
        _Scene.prototype._hide = function () {
            this._sceneAdpt.setProp('visible', 'false');
        };
        // ------------------------------------------------------------------------
        //                               Transitions
        // ------------------------------------------------------------------------
        /**
         * Prepares the transitions when the rendering process starts
         */
        _Scene.prototype._setupTransition = function () {
            if (this._transitionInterpolator._active) {
                this._transitionInterpolator._setup(this._sceneAdpt, this._nextScene ? this._nextScene._sceneAdpt : undefined, this._frameCount, this._story._args);
            }
        };
        // ------------------------------------------------------------------------
        //                               addStills
        // ------------------------------------------------------------------------
        /**
         * Adds a series of motionless frames defined by duration.
         * This method changes the end of the pipeline (frameInNr).
         */
        _Scene.prototype.addStills = function (duration) {
            // if it's teleporting, then convert into a wrapper task.
            if (this._story.isTeleporting && !this._addAnimationCallCount) {
                this.addAnimations([{
                        tasks: [
                            {
                                handler: 'add-stills',
                                params: {
                                    duration: duration,
                                },
                            },
                        ],
                    }]);
            }
            var frameCount = ABeamer._parseTimeHandler(duration, this._story, 0, 0);
            if (frameCount <= 0) {
                return this;
            }
            var newFrameInNr = this._frameInNr + frameCount;
            if (newFrameInNr > this._frames.length) {
                // #debug-start
                if (this._story._isVerbose) {
                    this._story.logFrmt('add-stills-frame-count', [
                        ['id', this.id],
                        ['old-frame-count', this._frames.length],
                        ['new-frame-count', newFrameInNr]
                    ]);
                }
                // #debug-end
                this._frames.length = newFrameInNr;
                this._frameCount = newFrameInNr;
            }
            // #debug-start
            if (this._story._isVerbose) {
                this._story.logFrmt('add-stills-frame-in', [
                    ['id', this.id],
                    ['old-frame-in', this._frameInNr],
                    ['new-frame-in', newFrameInNr]
                ]);
            }
            // #debug-end
            this._frameInNr = newFrameInNr;
            return this;
        };
        // ------------------------------------------------------------------------
        //                               initInterpolators
        // ------------------------------------------------------------------------
        /**
         * Creates the interpolator animations for `Scene.addAnimations`.
         */
        _Scene.prototype._initInterpolators = function (animes) {
            var _this = this;
            var story = this._story;
            var elAnimations = [];
            animes.forEach(function (anime) {
                if (anime.enabled === false) {
                    elAnimations.push(undefined);
                    return;
                }
                var elAnimation = new ABeamer._ElWorkAnimation();
                elAnimation.buildElements(_this._story, _this, _this._sceneAdpt, anime);
                if (elAnimation.elAdapters.length) {
                    if (elAnimation.assignValues(anime, story, _this, undefined, elAnimation.elAdapters[0].getId())) {
                        anime.props.forEach(function (prop) {
                            elAnimation.propInterpolators
                                .push(prop.enabled !== false ? new ABeamer._PropInterpolator(prop) : undefined);
                        });
                    }
                    else {
                        elAnimation = undefined;
                    }
                }
                else {
                    if (_this._story._logLevel >= ABeamer.LL_WARN) {
                        _this._story.logWarn("Selector " + anime.selector + " is empty");
                    }
                }
                elAnimations.push(elAnimation);
            });
            return elAnimations;
        };
        // ------------------------------------------------------------------------
        //                               addAnimations
        // ------------------------------------------------------------------------
        /**
         * Adds a list of parallel animations to the render pipeline.
         * The animations can start off-sync from each other via Position parameter.
         *
         * @see Animation
         */
        _Scene.prototype.addAnimations = function (animes) {
            var _this = this;
            if (!animes.length) {
                return this;
            }
            var story = this._story;
            var args = story._args;
            var maxEndFrame = this._frameInNr;
            var isVerbose = this._story._isVerbose;
            var prevStage = story._args.stage;
            story._exceptIfRendering();
            if (story._teleporter.active) {
                ABeamer._prepareAnimationsForTeleporting(animes, args);
                story._teleporter._addAnimations(animes, this._storySceneIndex);
            }
            this._addAnimationCallCount++;
            args.stage = ABeamer.AS_ADD_ANIMATION;
            try {
                if (story.curScene !== this) {
                    // _internalGotoScene is enough, since to add animations doesn't requires
                    // extra story frame values to be computed
                    story._internalGotoScene(this);
                }
                // 1st pass - process tasks
                var wkAnimes_1 = [];
                var wkAnimesTasks_1 = [];
                animes.forEach(function (anime) {
                    var tasks = anime.tasks;
                    var wkTasks;
                    if (tasks) {
                        wkTasks = [];
                        if (ABeamer._processTasks(tasks, wkTasks, anime, args) && !anime.props) {
                            return;
                        }
                    }
                    wkAnimes_1.push(anime);
                    wkAnimesTasks_1.push(wkTasks);
                });
                animes = wkAnimes_1;
                // 2st pass - preprocess interpolators
                var animeInterpolators_1 = this._initInterpolators(animes);
                // 3st pass - compute values
                animes.forEach(function (anime, animeIndex) {
                    var ai = animeInterpolators_1[animeIndex];
                    if (!ai) {
                        return;
                    } // bypass missing selectors
                    var propInterpolators = ai.propInterpolators;
                    var elementAdapters = ai.elAdapters;
                    ABeamer._vars.elCount = elementAdapters.length;
                    elementAdapters.forEach(function (elementAdpt, elIndex) {
                        ABeamer._vars.elIndex = elIndex;
                        var wkTasks = wkAnimesTasks_1[animeIndex];
                        if (wkTasks) {
                            ABeamer._runTasks(wkTasks, anime, animeIndex, args);
                        }
                        anime.props.forEach(function (inProp, propIndex) {
                            var pi = propInterpolators[propIndex];
                            // properties can override the anime values
                            if (!pi || !pi.assignValues(inProp, story, _this, ai)) {
                                return;
                            }
                            var pos = pi.positionFrame + (pi.itemDelay.duration
                                ? ABeamer._computeItemDelay(pi.itemDelay, elIndex) : 0);
                            var totalDuration = pi.framesPerCycle * pi.scaleDuration;
                            var endPos = totalDuration + pos;
                            if (endPos > _this._frameCount) {
                                _this._frames.length = endPos;
                                _this._frameCount = endPos;
                            }
                            maxEndFrame = Math.max(maxEndFrame, endPos);
                            var actRg = ABeamer._findActionRg(_this._actionRgMaps, elementAdpt, pi.realPropName, pos, endPos - 1);
                            pi.attachSelector(elementAdpt, actRg, isVerbose, args);
                            var frameI = pi.dirPair[0] === 1 ? 0 : (pi.framesPerCycle - 1);
                            var v;
                            var action;
                            // #debug-start
                            if (isVerbose) {
                                _this._story.logFrmt('action-range', [
                                    ['id', elementAdpt.getId()],
                                    ['prop', pi.propName],
                                    ['frame', pi.positionFrame],
                                    ['total', totalDuration]
                                ]);
                            }
                            // #debug-end
                            for (var i = 0; i < totalDuration; i++) {
                                var t = pi.framesPerCycle > 1 ? frameI / (pi.framesPerCycle - 1) : 1;
                                v = pi.interpolate(t, story, isVerbose);
                                action = pi.toAction(v, i === 0, i === totalDuration - 1);
                                frameI = ABeamer._computeIterationCount(i, frameI, pi.dirPair, pi.framesPerCycle);
                                _this._setActionOnFrames(pos, elementAdpt, pi, action, v);
                                pos++;
                            }
                            // stores the last output value in the ActRg
                            var outputValue = ABeamer._applyAction(action, elementAdpt, false, _this._story, true);
                            actRg.actionRg.endValue = outputValue;
                        });
                    });
                });
            }
            catch (error) {
                throw error;
            }
            finally {
                this._frameInNr = maxEndFrame;
                this._addAnimationCallCount--;
                if (!this._addAnimationCallCount) {
                    args.stage = prevStage;
                }
                story._setFrameCountChanged();
            }
            return this;
        };
        _Scene.prototype._setActionOnFrames = function (pos, elementAdpt, pi, action, v) {
            function getIAction() {
                return {
                    elementAdpt: elementAdpt,
                    actions: [action],
                };
            }
            var frame;
            elementAdpt._clearComputerData();
            if (this._frames[pos] === undefined) {
                this._frames[pos] = {
                    elActions: [getIAction()],
                };
            }
            else {
                frame = this._frames[pos];
                var item = frame.elActions.find(function (it) { return it.elementAdpt === elementAdpt; });
                if (!item) {
                    frame.elActions.push(getIAction());
                }
                else {
                    var actions = item.actions;
                    var oldAction = actions.find(function (actionI) {
                        return actionI.realPropName === pi.propName;
                    });
                    if (oldAction) {
                        oldAction.value = v;
                    }
                    else {
                        actions.push(action);
                    }
                }
            }
        };
        // ------------------------------------------------------------------------
        //                               addSerialAnimations
        // ------------------------------------------------------------------------
        /**
         * Adds a list of serial animations to the render pipeline.
         * This is the same as: `serialAnimes.forEach(anime => addAnimations(anime))`
         * Use this if you want to load all animations from an external file.
         */
        _Scene.prototype.addSerialAnimations = function (serialAnimes) {
            var _this = this;
            serialAnimes.forEach(function (anime) { return _this.addAnimations(anime); });
            return this;
        };
        // ------------------------------------------------------------------------
        //                               Render
        // ------------------------------------------------------------------------
        _Scene.prototype._internalRenderFrame = function (framePos, dir, isVerbose, bypassMode) {
            // handle transitions
            if (!bypassMode) {
                if (this._transitionInterpolator._active) {
                    this._transitionInterpolator._render(framePos, this._frameCount, true, this._story._args);
                }
                var prevScene = this._prevScene;
                if (prevScene && prevScene._transitionInterpolator._active) {
                    prevScene._transitionInterpolator._render(framePos, this._frameCount, false, this._story._args);
                }
            }
            var frame = this._frames[framePos];
            // stills must come after transitions
            if (!frame) {
                // #debug-start
                if (isVerbose && !bypassMode) {
                    this._story.logFrmt('render-still', [['frame', framePos]]);
                }
                // #debug-end
                this._renderFramePos += dir;
                return;
            }
            var itemCount = frame.elActions.length;
            for (var i = 0; i < itemCount; i++) {
                var item = frame.elActions[i];
                var elementAdpt = item.elementAdpt;
                var actionCount = item.actions.length;
                for (var j = 0; j < actionCount; j++) {
                    var action = item.actions[j];
                    // handles bypassing
                    if (bypassMode) {
                        var canByPass = dir > 0 ? action.toBypassForward :
                            action.toBypassBackward;
                        if (canByPass) {
                            // #debug-start
                            if (isVerbose) {
                                this._story.logFrmt('bypass', [['id', elementAdpt.getId()],
                                    ['prop', action.realPropName],
                                    ['frame', framePos]]);
                            }
                            // #debug-end
                            continue;
                        }
                    }
                    ABeamer._applyAction(action, elementAdpt, isVerbose, this._story);
                }
            }
            this._renderFramePos += dir;
        };
        // ------------------------------------------------------------------------
        //                               Wrappers
        // ------------------------------------------------------------------------
        /**
         * Used only task plugin creators.
         */
        _Scene.prototype.getElementAdapters = function (selector) {
            return ABeamer._parseInElSelector(this._story, [], this._sceneAdpt, selector);
        };
        /**
         * Creates a pEls from the selectors.
         */
        _Scene.prototype.getPEls = function (selector) {
            return new ABeamer._pEls(this, selector);
        };
        /**
         * Adds `visible = true` to the pipeline.
         */
        _Scene.prototype.pElsShow = function (selector) {
            return this.getPEls(selector).show();
        };
        /**
         * Adds `visible = false` to the pipeline.
         */
        _Scene.prototype.pElsHide = function (selector) {
            return this.getPEls(selector).hide();
        };
        /**
         * Wrapper for `addAnimation` with `visible = false`,
         * followed by opacity moving to 1.
         */
        _Scene.prototype.pElsFadeIn = function (selector, duration) {
            return this.getPEls(selector).fadeIn(duration);
        };
        /**
         * Wrapper for `addAnimation` with opacity moving to 0,
         * followed by `visible = false`
         */
        _Scene.prototype.pElsFadeOut = function (selector, duration) {
            return this.getPEls(selector).fadeOut(duration);
        };
        return _Scene;
    }());
    ABeamer._Scene = _Scene;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=scene.js.map