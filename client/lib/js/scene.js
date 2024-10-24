"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
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
    class _Scene {
        /**
         * Returns scene transition information.
         *
         * @see transitions
         */
        get transition() {
            return this._transitionInterpolator._transition;
        }
        /**
         * Defines the scene transition selector (name or function)
         * and duration.
         *
         * @see transitions
         */
        set transition(transition) {
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
        }
        constructor(story, sceneSelector, prevScene) {
            this._frameCount = 0;
            this._storyFrameStart = 0;
            this._storySceneIndex = -1;
            this._frameInNr = 0;
            /** Increases inside an `addAnimation`. It used to avoid multiple calls during teleporting. */
            this._addAnimationCallCount = 0;
            /** Internal list of all the scene frames. */
            this._frames = [];
            /** Internal position of where the render pipeline was [consumed](consuming-the-pipeline). */
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
        /** Removes it self from the story. Used internally. */
        _remove() {
            if (this._prevScene) {
                this._prevScene._nextScene = this._nextScene;
            }
            if (this._nextScene) {
                this._nextScene._prevScene = this._prevScene;
            }
        }
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
        get frameInNr() {
            return this._frameInNr;
        }
        /**
         * Total number of frames contained the scene.
         *
         * #end-user @readonly
         */
        get frameCount() {
            return this._frameCount;
        }
        /**
         * Sum of all the frames from the previous scenes.
         *
         * #end-user @readonly
         */
        get storyFrameStart() {
            this._story._calcFrameCount();
            return this._storyFrameStart;
        }
        /**
         * Zero-based Index of this scene within the list of scenes.
         *
         * #end-user @readonly
         */
        get storySceneIndex() {
            return this._storySceneIndex;
        }
        /**
         * Scene id from the DOM element.
         *
         * #end-user @readonly
         */
        get id() {
            return this._sceneAdpt.getProp('id', this._story._args);
        }
        // ------------------------------------------------------------------------
        //                               Frame methods
        // ------------------------------------------------------------------------
        _containsFrame(storyFramePos) {
            this._story._calcFrameCount();
            return this._internalContainsFrame(storyFramePos);
        }
        _internalContainsFrame(storyFramePos) {
            return (storyFramePos >= this._storyFrameStart)
                && storyFramePos < (this._storyFrameStart + this._frameCount);
        }
        _setStoryParams(storyFramePos, storySceneIndex) {
            this._storyFrameStart = storyFramePos;
            this._storySceneIndex = storySceneIndex;
            return this._frameCount;
        }
        _gotoSceneFrame(framePos) {
            if (framePos < 0 || framePos >= this._frameCount) {
                ABeamer.throwErr(`Position ${framePos} is out of scope`);
            }
            this._internalGotoFrame(framePos);
        }
        _internalGotoFrame(framePos) {
            if (framePos === this._renderFramePos) {
                return;
            }
            const isVerbose = this._story.isVerbose;
            // @WARN: Don't use story.renderDir since it can bypassing backwards
            // in order to rewind and the story.renderDir be moving forward
            const bypassDir = framePos > this._renderFramePos ? 1 : -1;
            while (framePos !== this._renderFramePos) {
                this._internalRenderFrame(this._renderFramePos, bypassDir, isVerbose, true);
            }
        }
        // ------------------------------------------------------------------------
        //                               Visibility
        // ------------------------------------------------------------------------
        _show() {
            this._sceneAdpt.setProp('visible', 'true', this._story._args);
        }
        _hide() {
            this._sceneAdpt.setProp('visible', 'false', this._story._args);
        }
        // ------------------------------------------------------------------------
        //                               Transitions
        // ------------------------------------------------------------------------
        /**
         * Prepares the transitions when the rendering process starts
         */
        _setupTransition() {
            if (this._transitionInterpolator._active) {
                this._transitionInterpolator._setup(this._sceneAdpt, this._nextScene ? this._nextScene._sceneAdpt : undefined, this._frameCount, this._story._args);
            }
        }
        // ------------------------------------------------------------------------
        //                               addStills
        // ------------------------------------------------------------------------
        /**
         * Adds a series of motionless frames defined by duration.
         * This method changes the end of the pipeline (frameInNr).
         */
        addStills(duration) {
            // if it's teleporting, then convert into a wrapper task.
            if (this._story.isTeleporting && !this._addAnimationCallCount) {
                this.addAnimations([{
                        tasks: [
                            {
                                handler: 'add-stills',
                                params: {
                                    duration,
                                },
                            },
                        ],
                    }]);
            }
            const frameCount = ABeamer.parseTimeHandler(duration, this._story._args, 0, 0);
            if (frameCount <= 0) {
                return this;
            }
            const newFrameInNr = this._frameInNr + frameCount;
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
        }
        // ------------------------------------------------------------------------
        //                               initInterpolators
        // ------------------------------------------------------------------------
        /**
         * Creates the interpolator animations for `Scene.addAnimations`.
         */
        _initInterpolators(animes) {
            const story = this._story;
            const args = story._args;
            const elAnimations = [];
            animes.forEach((anime) => {
                if (anime.enabled === false) {
                    elAnimations.push(undefined);
                    return;
                }
                let elAnimation = new ABeamer._ElWorkAnimation();
                elAnimation.buildElements(this._story, this._sceneAdpt, anime);
                if (elAnimation.elAdapters.length) {
                    if (elAnimation.assignValues(anime, story, undefined, elAnimation.elAdapters[0].getId(args), this._frameInNr)) {
                        anime.props.forEach(prop => {
                            elAnimation.propInterpolators
                                .push(prop.enabled !== false ? new ABeamer._PropInterpolator(prop) : undefined);
                        });
                    }
                    else {
                        elAnimation = undefined;
                    }
                }
                else {
                    if (this._story._logLevel >= ABeamer.LL_WARN) {
                        this._story.logWarn(`Selector ${anime.selector} is empty`);
                    }
                }
                elAnimations.push(elAnimation);
            });
            return elAnimations;
        }
        // ------------------------------------------------------------------------
        //                               addAnimations
        // ------------------------------------------------------------------------
        /**
         * Adds a list of parallel animations to the render pipeline.
         * The animations can start off-sync from each other via Position parameter.
         *
         * @see animations
         */
        addAnimations(animes) {
            if (!animes.length) {
                return this;
            }
            const story = this._story;
            const args = story._args;
            let maxEndFrame = this._frameInNr;
            const isVerbose = this._story._isVerbose;
            const prevStage = story._args.stage;
            let advanceInTheEnd = true;
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
                const wkAnimes = [];
                const wkAnimesTasks = [];
                animes.forEach((anime) => {
                    const tasks = anime.tasks;
                    let wkTasks;
                    if (tasks) {
                        wkTasks = [];
                        if (ABeamer._processTasks(tasks, wkTasks, anime, args) && !anime.props) {
                            return;
                        }
                    }
                    wkAnimes.push(anime);
                    wkAnimesTasks.push(wkTasks);
                });
                animes = wkAnimes;
                // 2st pass - preprocess interpolators
                const animeInterpolators = this._initInterpolators(animes);
                let animeAdvanceValue = 0;
                // 3st pass - compute values
                animes.forEach((anime, animeIndex) => {
                    const ai = animeInterpolators[animeIndex];
                    if (!ai) {
                        return;
                    } // bypass missing selectors
                    const propInterpolators = ai.propInterpolators;
                    const elementAdapters = ai.elAdapters;
                    ABeamer._vars.elCount = elementAdapters.length;
                    if (animeAdvanceValue) {
                        ai.positionFrame += animeAdvanceValue;
                    }
                    if (animeIndex === animes.length - 1) {
                        advanceInTheEnd = ai.advance !== false;
                    }
                    elementAdapters.forEach((elementAdpt, elIndex) => {
                        ABeamer._vars.elIndex = elIndex;
                        const wkTasks = wkAnimesTasks[animeIndex];
                        if (wkTasks) {
                            ABeamer._runTasks(wkTasks, anime, animeIndex, args);
                        }
                        ai.nextPropStartFrame = undefined;
                        anime.props.forEach((inProp, propIndex) => {
                            const pi = propInterpolators[propIndex];
                            // properties can override the anime values
                            if (!pi || !pi.propAssignValues(inProp, story, ai, elIndex)) {
                                return;
                            }
                            let posFrame = pi.startFrame;
                            const endFrame = pi.endFrame;
                            const totalDuration = pi.totalDuration;
                            if (endFrame > this._frameCount) {
                                this._frames.length = endFrame;
                                this._frameCount = endFrame;
                            }
                            maxEndFrame = Math.max(maxEndFrame, endFrame);
                            if (ai.advance) {
                                animeAdvanceValue = Math.max(animeAdvanceValue, endFrame - this._frameInNr);
                            }
                            const elActRg = ABeamer._findActionRg(this._actionRgMaps, elementAdpt, pi.realPropName, posFrame, endFrame - 1, args);
                            pi.attachSelector(elementAdpt, elActRg, isVerbose, args);
                            let frameI = pi.dirPair[0] === 1 ? 0 : (pi.framesPerCycle - 1);
                            let v;
                            let action;
                            // #debug-start
                            if (isVerbose) {
                                this._story.logFrmt('action-range', [
                                    ['id', elementAdpt.getId(args)],
                                    ['prop', pi.propName],
                                    ['frame', posFrame],
                                    ['total', totalDuration]
                                ]);
                            }
                            // #debug-end
                            for (let i = 0; i < totalDuration; i++) {
                                const t = pi.framesPerCycle > 1 ? frameI / (pi.framesPerCycle - 1) : 1;
                                v = pi.interpolate(t, story, isVerbose);
                                action = pi.toAction(v, i === 0, i === totalDuration - 1);
                                frameI = ABeamer._computeIterationCount(i, frameI, pi.dirPair, pi.framesPerCycle);
                                this._setActionOnFrames(posFrame, elementAdpt, pi, action, v);
                                posFrame++;
                            }
                            // stores the last output value in the ActRg
                            const outputValue = ABeamer._applyAction(action, elementAdpt, false, args, true);
                            elActRg.actionRg.endValue = outputValue;
                        });
                    });
                });
            }
            catch (error) {
                throw error;
            }
            finally {
                if (advanceInTheEnd) {
                    this._frameInNr = maxEndFrame;
                }
                else {
                    // #debug-start
                    if (isVerbose) {
                        this._story.logFrmt('no-advance-in-end', []);
                    }
                    // #debug-end
                }
                this._addAnimationCallCount--;
                if (!this._addAnimationCallCount) {
                    args.stage = prevStage;
                }
                story._setFrameCountChanged();
            }
            return this;
        }
        _setActionOnFrames(pos, elementAdpt, pi, action, v) {
            function getIAction() {
                return {
                    elementAdpt,
                    actions: [action],
                };
            }
            let frame;
            elementAdpt._clearComputerData();
            if (this._frames[pos] === undefined) {
                this._frames[pos] = {
                    elActions: [getIAction()],
                    uniqueElementAdpt: new Set([elementAdpt]),
                };
            }
            else {
                frame = this._frames[pos];
                frame.uniqueElementAdpt.add(elementAdpt);
                const item = frame.elActions.find(it => it.elementAdpt === elementAdpt);
                if (!item) {
                    frame.elActions.push(getIAction());
                }
                else {
                    const actions = item.actions;
                    const oldAction = actions.find(actionI => actionI.realPropName === pi.propName);
                    if (oldAction) {
                        oldAction.value = v;
                    }
                    else {
                        actions.push(action);
                    }
                }
            }
        }
        // ------------------------------------------------------------------------
        //                               addSerialAnimations
        // ------------------------------------------------------------------------
        /**
         * Adds a list of serial animations to the render pipeline.
         * This is the same as: `serialAnimes.forEach(anime => addAnimations(anime))`
         * Use this if you want to load all animations from an external file.
         */
        addSerialAnimations(serialAnimes) {
            serialAnimes.forEach(anime => this.addAnimations(anime));
            return this;
        }
        // ------------------------------------------------------------------------
        //                               Render
        // ------------------------------------------------------------------------
        _internalRenderFrame(framePos, dir, isVerbose, bypassMode) {
            const args = this._story._args;
            // handle transitions
            if (!bypassMode) {
                if (this._transitionInterpolator._active) {
                    this._transitionInterpolator._render(framePos, this._frameCount, true, this._story._args);
                }
                const prevScene = this._prevScene;
                if (prevScene && prevScene._transitionInterpolator._active) {
                    prevScene._transitionInterpolator._render(framePos, this._frameCount, false, this._story._args);
                }
            }
            const frame = this._frames[framePos];
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
            // execute each action of a frame
            const itemCount = frame.elActions.length;
            for (let i = 0; i < itemCount; i++) {
                const item = frame.elActions[i];
                const elementAdpt = item.elementAdpt;
                const actionCount = item.actions.length;
                for (let j = 0; j < actionCount; j++) {
                    const action = item.actions[j];
                    // handles bypassing
                    if (bypassMode) {
                        const canByPass = dir > 0 ? action.toBypassForward :
                            action.toBypassBackward;
                        if (canByPass) {
                            // #debug-start
                            if (isVerbose) {
                                this._story.logFrmt('bypass', [['id', elementAdpt.getId(args)],
                                    ['prop', action.realPropName],
                                    ['frame', framePos]]);
                            }
                            // #debug-end
                            continue;
                        }
                    }
                    ABeamer._applyAction(action, elementAdpt, isVerbose, args);
                }
            }
            frame.uniqueElementAdpt.forEach(elAdapter => {
                if (elAdapter.frameRendered) {
                    elAdapter.frameRendered(args);
                }
            });
            this._renderFramePos += dir;
        }
        // ------------------------------------------------------------------------
        //                               Wrappers
        // ------------------------------------------------------------------------
        /**
         * Used only task plugin creators.
         */
        getElementAdapters(selector) {
            return ABeamer._parseInElSelector(this._story, [], this._sceneAdpt, selector);
        }
        /**
         * Creates a pEls from the selectors.
         */
        getPEls(selector) {
            return new ABeamer._pEls(this, selector);
        }
        /**
         * Adds `visible = true` to the pipeline.
         */
        pElsShow(selector) {
            return this.getPEls(selector).show();
        }
        /**
         * Adds `visible = false` to the pipeline.
         */
        pElsHide(selector) {
            return this.getPEls(selector).hide();
        }
        /**
         * Wrapper for `addAnimation` with `visible = false`,
         * followed by opacity moving to 1.
         */
        pElsFadeIn(selector, duration) {
            return this.getPEls(selector).fadeIn(duration);
        }
        /**
         * Wrapper for `addAnimation` with opacity moving to 0,
         * followed by `visible = false`
         */
        pElsFadeOut(selector, duration) {
            return this.getPEls(selector).fadeOut(duration);
        }
    }
    ABeamer._Scene = _Scene;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=scene.js.map