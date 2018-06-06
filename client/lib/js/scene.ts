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
namespace ABeamer {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Scene
  // ------------------------------------------------------------------------

  export class _Scene implements _SceneImpl {

    /** Name assigned by the user, and can be used to find the scene by name. */
    name?: string;

    protected _frameCount: int = 0;

    protected _storyFrameStart: int = 0;
    protected _storySceneIndex: int = -1;

    _frameInNr: uint = 0;
    _story: _StoryImpl;
    _sceneAdpt: _SceneAdapter;
    /** Increases inside an `addAnimation`. It used to avoid multiple calls during teleporting. */
    _addAnimationCallCount: uint = 0;

    /** Internal list of all the scene frames. */
    protected _frames: _Frame[] = [];
    /** Internal position of where the render pipeline was [consumed](consuming-the-pipeline). */
    protected _renderFramePos: int = 0;


    /**
     * Returns scene transition information.
     *
     * @see transitions
     */
    get transition(): Transition {
      return this._transitionInterpolator._transition;
    }


    /**
     * Defines the scene transition selector (name or function)
     * and duration.
     *
     * @see transitions
     */
    set transition(transition: Transition) {
      this._transitionInterpolator._set(transition,
        this._frameCount, this._story._args);

      // if it's teleporting, then convert into a wrapper task.
      if (this._story.isTeleporting && !this._addAnimationCallCount) {
        this.addAnimations([{
          tasks: [
            {
              handler: 'scene-transition',
              params: {
                handler: transition.handler,
                duration: transition.duration,
              } as SceneTransitionTaskParams,
            },
          ],
        }]);
      }
    }


    protected _transitionInterpolator = new _TransitionInterpolator();


    /**
     * `_actionRgMaps` are 'maps' between the input animations and the output action
     * for every frame.
     * _actionRgMaps allow for a new animation to have access to the last modified value
     * of a property of an element of the previous animation.
     * And in a backward motion allows to retrieve the original value.
     */
    protected _actionRgMaps: _ActionRgMaps = [];


    /**
     * Pointer to previous scene.
     * Used by scene transitions.
     */
    protected _prevScene: _Scene;


    /**
     * Pointer to next scene.
     * Used by scene transitions.
     */
    protected _nextScene: _Scene;


    constructor(story: _StoryImpl, sceneSelector: SceneSelector,
      prevScene: _SceneImpl | undefined) {
      this._story = story;
      this._sceneAdpt = _isVirtualScene(sceneSelector)
        ? new _VirtualSceneAdapter(sceneSelector)
        : new _DOMSceneAdapter(sceneSelector);
      if (prevScene) {
        this._prevScene = prevScene as _Scene;
        (prevScene as _Scene)._nextScene = this;
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
    get frameInNr(): uint {
      return this._frameInNr;
    }


    /**
     * Total number of frames contained the scene.
     *
     * #end-user @readonly
     */
    get frameCount(): uint {
      return this._frameCount;
    }


    /**
     * Sum of all the frames from the previous scenes.
     *
     * #end-user @readonly
     */
    get storyFrameStart(): uint {
      this._story._calcFrameCount();
      return this._storyFrameStart;
    }


    /**
     * Zero-based Index of this scene within the list of scenes.
     *
     * #end-user @readonly
     */
    get storySceneIndex(): uint {
      return this._storySceneIndex;
    }


    /**
     * Scene id from the DOM element.
     *
     * #end-user @readonly
     */
    get id(): string {
      return this._sceneAdpt.getProp('id', this._story._args) as string;
    }

    // ------------------------------------------------------------------------
    //                               Frame methods
    // ------------------------------------------------------------------------

    protected _containsFrame(storyFramePos: int): boolean {
      this._story._calcFrameCount();
      return this._internalContainsFrame(storyFramePos);
    }


    _internalContainsFrame(storyFramePos: int): boolean {
      return (storyFramePos >= this._storyFrameStart)
        && storyFramePos < (this._storyFrameStart + this._frameCount);
    }


    _setStoryParams(storyFramePos: int,
      storySceneIndex: int): int {

      this._storyFrameStart = storyFramePos;
      this._storySceneIndex = storySceneIndex;
      return this._frameCount;
    }


    protected _gotoSceneFrame(framePos: int): void {
      if (framePos < 0 || framePos >= this._frameCount) {
        throwErr(`Position ${framePos} is out of scope`);
      }
      this._internalGotoFrame(framePos);
    }


    _internalGotoFrame(framePos: int): void {
      if (framePos === this._renderFramePos) { return; }

      const isVerbose = this._story.isVerbose;
      // @WARN: Don't use story.renderDir since it can bypassing backwards
      // in order to rewind and the story.renderDir be moving forward
      const bypassDir: DirectionInt = framePos > this._renderFramePos ? 1 : -1;

      while (framePos !== this._renderFramePos) {
        this._internalRenderFrame(this._renderFramePos, bypassDir,
          isVerbose, true);
      }
    }

    // ------------------------------------------------------------------------
    //                               Visibility
    // ------------------------------------------------------------------------

    _show(): void {
      this._sceneAdpt.setProp('visible', 'true', this._story._args);
    }


    _hide(): void {
      this._sceneAdpt.setProp('visible', 'false', this._story._args);
    }

    // ------------------------------------------------------------------------
    //                               Transitions
    // ------------------------------------------------------------------------

    /**
     * Prepares the transitions when the rendering process starts
     */
    _setupTransition(): void {
      if (this._transitionInterpolator._active) {
        this._transitionInterpolator._setup(this._sceneAdpt,
          this._nextScene ? this._nextScene._sceneAdpt : undefined,
          this._frameCount, this._story._args);
      }
    }

    // ------------------------------------------------------------------------
    //                               addStills
    // ------------------------------------------------------------------------

    /**
     * Adds a series of motionless frames defined by duration.
     * This method changes the end of the pipeline (frameInNr).
     */
    addStills(duration: TimeHandler): Scene {

      // if it's teleporting, then convert into a wrapper task.
      if (this._story.isTeleporting && !this._addAnimationCallCount) {
        this.addAnimations([{
          tasks: [
            {
              handler: 'add-stills',
              params: {
                duration,
              } as AddStillsTaskParams,
            },
          ],
        }]);
      }

      const frameCount = parseTimeHandler(duration, this._story._args, 0, 0);
      if (frameCount <= 0) { return this; }
      const newFrameInNr = this._frameInNr + frameCount;
      if (newFrameInNr > this._frames.length) {

        // #debug-start
        if (this._story._isVerbose) {
          this._story.logFrmt('add-stills-frame-count', [
            ['id', this.id],
            ['old-frame-count', this._frames.length],
            ['new-frame-count', newFrameInNr]]);
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
          ['new-frame-in', newFrameInNr]]);
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
    protected _initInterpolators(animes: Animations): _ElWorkAnimation[] {
      const story = this._story;
      const args = story._args;

      const elAnimations: _ElWorkAnimation[] = [];
      animes.forEach((anime) => {

        if (anime.enabled === false) {
          elAnimations.push(undefined);
          return;
        }

        let elAnimation: _ElWorkAnimation = new _ElWorkAnimation();

        elAnimation.buildElements(this._story, this, this._sceneAdpt, anime);

        if (elAnimation.elAdapters.length) {

          if (elAnimation.assignValues(anime, story, this, undefined,
            elAnimation.elAdapters[0].getId(args))) {
            anime.props.forEach(prop => {
              elAnimation.propInterpolators
                .push(prop.enabled !== false ? new _PropInterpolator(prop) : undefined);
            });
          } else {
            elAnimation = undefined;
          }

        } else {
          if (this._story._logLevel >= LL_WARN) {
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
    addAnimations(animes: Animations): Scene {

      if (!animes.length) { return this; }
      const story = this._story;
      const args = story._args;
      let maxEndFrame = this._frameInNr;
      const isVerbose = this._story._isVerbose;
      const prevStage = story._args.stage;

      story._exceptIfRendering();

      if (story._teleporter.active) {
        _prepareAnimationsForTeleporting(animes, args);
        story._teleporter._addAnimations(animes, this._storySceneIndex);
      }

      this._addAnimationCallCount++;
      args.stage = AS_ADD_ANIMATION;
      try {

        if (story.curScene !== this) {
          // _internalGotoScene is enough, since to add animations doesn't requires
          // extra story frame values to be computed
          story._internalGotoScene(this);
        }

        // 1st pass - process tasks
        const wkAnimes: Animations = [];
        const wkAnimesTasks: _WorkTask[][] = [];
        animes.forEach((anime) => {
          const tasks = anime.tasks;
          let wkTasks: _WorkTask[];
          if (tasks) {
            wkTasks = [];
            if (_processTasks(tasks, wkTasks, anime, args) && !anime.props) { return; }
          }
          wkAnimes.push(anime);
          wkAnimesTasks.push(wkTasks);
        });
        animes = wkAnimes;


        // 2st pass - preprocess interpolators
        const animeInterpolators = this._initInterpolators(animes);

        // 3st pass - compute values
        animes.forEach((anime, animeIndex) => {

          const ai = animeInterpolators[animeIndex];
          if (!ai) { return; } // bypass missing selectors
          const propInterpolators = ai.propInterpolators;

          const elementAdapters = ai.elAdapters;
          _vars.elCount = elementAdapters.length;

          elementAdapters.forEach((elementAdpt, elIndex) => {

            _vars.elIndex = elIndex;

            const wkTasks = wkAnimesTasks[animeIndex];
            if (wkTasks) { _runTasks(wkTasks, anime, animeIndex, args); }

            anime.props.forEach((inProp, propIndex) => {

              const pi = propInterpolators[propIndex];
              // properties can override the anime values
              if (!pi || !pi.assignValues(inProp, story, this, ai)) { return; }

              let pos = pi.positionFrame + (pi.itemDelay.duration
                ? _computeItemDelay(pi.itemDelay, elIndex) : 0);
              const totalDuration = pi.framesPerCycle * pi.scaleDuration;
              const endPos = totalDuration + pos;

              if (endPos > this._frameCount) {
                this._frames.length = endPos;
                this._frameCount = endPos;
              }
              maxEndFrame = Math.max(maxEndFrame, endPos);

              const elActRg = _findActionRg(this._actionRgMaps, elementAdpt, pi.realPropName,
                pos, endPos - 1, args);
              pi.attachSelector(elementAdpt, elActRg, isVerbose, args);

              let frameI = pi.dirPair[0] === 1 ? 0 : (pi.framesPerCycle - 1);

              let v: ActionValue;
              let action: _Action;

              // #debug-start
              if (isVerbose) {
                this._story.logFrmt('action-range', [
                  ['id', elementAdpt.getId(args)],
                  ['prop', pi.propName],
                  ['frame', pi.positionFrame],
                  ['total', totalDuration]],
                );
              }
              // #debug-end

              for (let i = 0; i < totalDuration; i++) {
                const t = pi.framesPerCycle > 1 ? frameI / (pi.framesPerCycle - 1) : 1;
                v = pi.interpolate(t, story, isVerbose);
                action = pi.toAction(v, i === 0, i === totalDuration - 1);
                frameI = _computeIterationCount(i, frameI, pi.dirPair, pi.framesPerCycle);

                this._setActionOnFrames(pos, elementAdpt, pi, action, v);
                pos++;
              }

              // stores the last output value in the ActRg
              const outputValue = _applyAction(action, elementAdpt, false,
                args, true);
              elActRg.actionRg.endValue = outputValue;
            });
          });
        });

      } catch (error) {
        throw error;
      } finally {
        this._frameInNr = maxEndFrame;
        this._addAnimationCallCount--;
        if (!this._addAnimationCallCount) { args.stage = prevStage; }
        story._setFrameCountChanged();
      }
      return this;
    }


    protected _setActionOnFrames(pos: uint,
      elementAdpt: _ElementAdapter,
      pi: _PropInterpolator,
      action: _Action,
      v: ActionValue): void {

      function getIAction(): _ElActions {
        return {
          elementAdpt,
          actions: [action],
        } as _ElActions;
      }

      let frame: _Frame;
      elementAdpt._clearComputerData();

      if (this._frames[pos] === undefined) {
        this._frames[pos] = {
          elActions: [getIAction()],
        };
      } else {
        frame = this._frames[pos];
        const item = frame.elActions.find(it => it.elementAdpt === elementAdpt);
        if (!item) {
          frame.elActions.push(getIAction());
        } else {
          const actions = item.actions;
          const oldAction = actions.find(actionI =>
            actionI.realPropName === pi.propName);
          if (oldAction) {
            oldAction.value = v;
          } else {
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
    addSerialAnimations(serialAnimes: Animations[]): Scene {
      serialAnimes.forEach(anime => this.addAnimations(anime));
      return this;
    }

    // ------------------------------------------------------------------------
    //                               Render
    // ------------------------------------------------------------------------

    _internalRenderFrame(framePos: int, dir: DirectionInt,
      isVerbose: boolean, bypassMode: boolean): void {

      const args = this._story._args;

      // handle transitions
      if (!bypassMode) {
        if (this._transitionInterpolator._active) {
          this._transitionInterpolator._render(framePos, this._frameCount,
            true, this._story._args);
        }
        const prevScene = this._prevScene;
        if (prevScene && prevScene._transitionInterpolator._active) {
          prevScene._transitionInterpolator._render(framePos, this._frameCount,
            false, this._story._args);
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
                this._story.logFrmt('bypass',
                  [['id', elementAdpt.getId(args)],
                  ['prop', action.realPropName],
                  ['frame', framePos]]);
              }
              // #debug-end

              continue;
            }
          }

          _applyAction(action, elementAdpt, isVerbose, args);
        }
      }
      this._renderFramePos += dir;
    }

    // ------------------------------------------------------------------------
    //                               Wrappers
    // ------------------------------------------------------------------------

    /**
     * Used only task plugin creators.
     */
    getElementAdapters(selector: ElSelectorHandler): ElementAdapter[] {
      return _parseInElSelector(this._story, [], this._sceneAdpt, selector);
    }


    /**
     * Creates a pEls from the selectors.
     */
    getPEls(selector: ElSelector): pEls {
      return new _pEls(this, selector);
    }


    /**
     * Adds `visible = true` to the pipeline.
     */
    pElsShow(selector: ElSelector): pEls {
      return this.getPEls(selector).show();
    }


    /**
     * Adds `visible = false` to the pipeline.
     */
    pElsHide(selector: ElSelector): pEls {
      return this.getPEls(selector).hide();
    }


    /**
     * Wrapper for `addAnimation` with `visible = false`,
     * followed by opacity moving to 1.
     */
    pElsFadeIn(selector: ElSelector, duration?: TimeHandler): pEls {
      return this.getPEls(selector).fadeIn(duration);
    }


    /**
     * Wrapper for `addAnimation` with opacity moving to 0,
     * followed by `visible = false`
     */
    pElsFadeOut(selector: ElSelector, duration?: TimeHandler): pEls {
      return this.getPEls(selector).fadeOut(duration);
    }
  }
}
