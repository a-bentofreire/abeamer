"use strict";
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
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               AnimationCommonParams
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  /* ---- Bypass Mode ---- */
  export const BP_FIRST_INSIDE = 0; // this is the default bypass mode
  export const BP_INSIDE = 1;
  export const BP_ALL = 2;

  export type BypassMode = 0 | 1 | 2;


  /* ---- Function Stage ---- */
  export const FS_PREPARE = 0;
  export const FS_TELEPORT = 1;
  export const FS_RUN = 2;

  /** Base parameters used by any Animation Function. */
  export type FuncParams = AnyParams;

  /** Value used, if no duration is defined for an animation. */
  export const DEFAULT_DURATION = '400ms';


  /**
   * Defines parameters used both by `Animation` and `AnimationProp`.
   * The `AnimationProp` overrides the parameters defined by `Animation`.
   * This way, an animation can have parameters for all animation properties
   * and some animation properties can have different parameters.
   * The `duration` parameter defined in the animation property
   *
   */
  export interface AnimationCommonParams {


    /** If it's false, it will bypass the animation or property. */
    enabled?: boolean;

    /**
     * Defines the duration of the animation of a single cycle
     * in terms of frames, seconds, minutes or milliseconds.
     * The total duration is `duration*(iterationCount + 1)`.
     * In case of numerical values, ABeamer uses `defaultUnit`
     * to known what kind of unit is it.
     *
     * @see #iterationCount
     *
     * @example  '1s'
     * @example  '40ms'
     * @example  '20%'  (use only on the animation property duration)
     * @example  '5fps'
     * @example  50
     * @example  2.5   (use only if the DefaultUnit is 's' or 'ms')
     * @example  (args) => '2s'  (JavaScript functions don't support remote-rendering)
     * @example '=round(fps/2)'
     */
    duration?: TimeHandler;


    /**
     * Allows to [](#off-sync) the starting point of an animation.
     * Use `+`, `-` for relative positions.
     * Prefer relative positions over absolute positions.
     * Use only if you need to off-sync an animation.
     * Overlapping property animations isn't supported.
     *
     * @example '-10fps'  (starts the animation 10 frames before the expected starting point)
     * @example '+2ms'  (starts the animation 2 milliseconds after the expected starting point
     * @example (args) => '4ms' (JavaScript functions don't support remote-rendering)
     */
    position?: TimeHandler;


    /**
     * An **easing**  is a interpolator runs `t` from [0, 1], where
     * `t=0` is the first frame and `t=1` the last frame of the animation.
     * This interpolator can be viewed as the speed interpolator and its the
     * first one in the Animation Pipeline.
     * The output value will be used to feed the [](#oscillator).
     * Usually outputs a value from [0, 1] but other values are also possible.
     *
     * This interpolator can be used outside physical motion (left/right/top/bottom).
     * In cases of textual property, such as `color`, `text`, `src`,
     * the easing will define how quickly those values will change
     * among a list defined `valueText` or by using `valueFormat`.
     * In this case, the `startValue` and `value` should be between [0, 1].
     * Setting a `startValue` higher than `value`,
     * will reverse the direction of the changes.
     *
     * The easing can also be used to define the speed of the changes
     * of multi-parameter properties, such as `text-shadow`, by using as an input
     * of a `valueFormat`.
     *
     * This is the first stage of the Animation Pipeline.
     * The output value will be used to feed the [](#oscillator).
     *
     * ABeamer includes a list of the most common easings by
     * bundling the jquery.easing plugin.
     * More can be added via plugins.
     *
     * An easing can be defined by:
     * 1. Name - It will use the list of easings predefined or added via plugins.
     * 2. Expression - It evaluate the expression for each frame, passing the variable `t`.
     * 3. Code Handler - This function will receive the variable `t`.
     *
     * **WARNING** Code Handlers aren't [teleported](teleporter),
     * therefore it can't be used in remote rendering.
     *
     * @default 'linear'
     * @see easings
     */
    easing?: EasingHandler;


    /**
     * An **oscillator** is an optional interpolator that runs `t` from [easing(0), easing(1)]
     * and the usually outputs a value from [-Amplitude, Amplitude] where usually
     * f(0) = 0 and f(1) = 0.
     * Its output will be generate `v = valueStart + (value - valueStart) * oscillator(easing(t))`
     * and then will be injected into a path as input.
     *
     * An oscillator has the following usages:
     *
     * 1. A rotational movement, where the oscillator defines the rotation and
     * the easing the defines the speed.
     *
     * 2. Flashing elements, where an element changes its `opacity` or `text-shadow`,
     * and these values oscillate between [0, 1].
     *
     * 3. Uni-dimensional paths. Unlike paths, the oscillators have their value stored
     * in the Action Link, allowing to link the end value to the next animation.
     *
     * The oscillators shares the namespace with [](easings), allowing any easing function
     * to operate also as a oscillator.
     * Since the main function of an oscillator is to return to its original position
     * at the end of the animation cycle, when an easing is used as an oscillator the
     * best is to use the following:
     * ```json
     * { iterationCount: 2,
     *   direction: alternate
     * }
     * ```
     * An oscillator can be defined by:
     * 1. Name - It will use the list of easings and oscillator predefined or added via plugins.
     * 2. Expression - It evaluate the expression for each frame, passing the variable `t`.
     * 3. Code Handler - This function will receive the variable `t`.
     *
     * **WARNING** Code Handlers aren't [teleported](teleporter),
     * therefore it can't be used in remote rendering.
     *
     */
    oscillator?: Oscillator;


    /*
    * An interpolator function where the input is the result of the
    * oscillator interpolator after the easing interpolator usually,
    * goes from [0, 1] and the output is an list of numbers,
    * representing the n-dimensions of a path.
    * To reverse the direction path, set `value = -1` and `valueStart = 0`.
    * To follow only a segment of the path, set both `value` and `valueStart`.
    *
    * Multi-dimension paths are mutual exclusive with textual `valueList`.
    *
    * Single-dimensions paths work similar to easings and oscillators.
    * These paths use the easing to define the speed and the path
    * can create post-effects such as steps.
    * The output of the a single-path value isn't stored in the Action Link, unlike
    * the oscillator.
    *
    * A multi-dimension path can be used in the following ways:
    * - via `valueFormat`. Allows to encode that path in a single property.
    *    Used in `text-shadow`, `transform`.
    * - via dual-properties.
    */
    path?: Path;


    /**
     * Delay of the start of the animation between 2 elements defined inside the selector.
     * The total duration of the animation will be: `duration+count*itemDelayDuration`.
     * @see itemDelayGrouping
     */
    itemDelayDuration?: TimeHandler;


    /**
     * Applies a modulus division to the elements defined in the selector when
     * it relates the `itemDelayDuration`.
     * A `itemDelayDuration=2`, will make the odd elements to have the same
     * `itemDelayDuration`.
     */
    itemDelayGrouping?: uint;


    /**
     * Applies a random changes with maximum of `itemDelayDisturbance` to the
     * `itemDelayDuration` for each element defined by the selector.
     */
    itemDelayDisturbance?: TimeHandler;
  }

  // ------------------------------------------------------------------------
  //                               AnimationProp
  // ------------------------------------------------------------------------

  export type AnimPropValue = string | number;

  export type PropValueFunc = (args?: ABeamerArgs) => AnimPropValue;

  export type PropValueStartHandler = AnimPropValue | int | ExprString | PropValueFunc;

  export type PropValueHandler = PropValueStartHandler;

  export type ValueTextFunc = (t: number, args?: ABeamerArgs) => string;


  export interface AnimationProp extends AnimationCommonParams {

    /**
     * Defines the property name. The property corresponds to DOM style element
     * or special properties
     *
     * @see AnimationPropName
     */
    prop: PropName;


    /**
     * Defines the starting value of an animation injected into the
     * Animation Pipeline (easing->oscillator->path|valueText->valueFormat).
     * Easing interpolates from `valueStart` to `value`.
     *
     * Use only if:
     * 1. ABeamer can't get the value from the element property.
     * 2. There is no [](#Action Link) or you want to have a different start value.
     * 3. Handle virtual elements.
     *
     * - Always set this value CSS transforms, since ABeamer doesn't
     * computes the CSS transform.
     * - For pixels, all write text with 'px' suffix unless
     * is defined `valueFormat`.
     * - To interpolate textual values, usually set `valueStart=0`.
     * - It supports expressions and Code Handlers.
     *
     * **WARNING** Code Handlers aren't [teleported](teleporter),
     * therefore it can't be used in remote rendering.
     *
     * @example 10
     * @example '4px'
     * @example 'true'
     * @example '=frameCount'
     *
     * If `valueFormat='%dpx'`
     * @example 4
     */
    valueStart?: PropValueStartHandler;


    /**
     * Defines the end numerical value into the
     * Animation Pipeline (easing->oscillator->path|valueText->valueFormat).
     * Easing interpolates from `valueStart` to `value`.
     *
     * - For pixels, use a numerical value.
     * - Use textual properties, usually don't need to define this value since
     * the default is 1.
     * - To have a value relative to the starting value (valueStart or computed value),
     * use '+value' or '-value'.
     * - It supports expressions and Code Handlers.
     *
     * **WARNING** Code Handlers aren't [teleported](teleporter),
     * therefore it can't be used in remote rendering.
     *
     * @default 1
     * @example '+10'
     * @example 100
     */
    value?: PropValueHandler;


    /**
     * This event is fired before modifying an element property during rending.
     * Use if you need to handle virtual elements.
     * or if you want to manually set an element value.
     * If returns `false`, ABeamer won't set the element property.
     *
     * **WARNING** Events aren't [teleported](teleporter),
     * therefore it can't be used in remote rendering.
     */
    onSetValue?(value: AnimPropValue, args?: ABeamerArgs): boolean;



    /**
     * Formats the value using the sprintf rules.
     * This is the last node in the computation pipeline.
     * It can format numerical values returned by the easing->oscillator,
     * but also each value of a path and a value returning from `valueText`.
     *
     * @example '%dpx %dpx 8px white'
     * @example 'rotateX(%fdeg)'
     * @example 'rotateX(%fdeg)'
     */
    valueFormat?: string;


    /**
     * Provides a list of textual values, expression or function to be interpolated.
     * This value is computed after easing, oscillator and path interpolators and round function.
     * Mutual exclusive with pixels, multi-dimension paths and booleans.
     *
     * Used by textual properties such as `color`, `url`, `font-family` and `text`.
     */
    valueText?: string[] | ExprString | ValueTextFunc;



    /**
     * **EXPERIMENTAL** Waits for the adaptor to be ready to deliver an asset before
     * instructing the render to move to the next frame or give the server order to store the image.
     * Used to wait for loading images or sync with videos.
     *
     * This feature is not implemented yet..._Coming soon_ .
     *
     * @see gallery/animate-video-sync
     */
    waitFor?: WaitItems;



    /**
     * Round function to apply after easing->oscillator->path.
     * If this value is not set, for pixels properties the round function will be used,
     * for other properties there is no default round function.
     */
    roundFunc?: RoundFuncName;


    /**
     * Defines how many times the animation repeats itself.
     * Same as CSS `animation-iteration-count`.
     *
     * @see gallery/animate-loop
     *
     * @example 1 (to run twice)
     * @example 3 (to run 4 times)
     */
    iterationCount?: int;


    /**
     * Defines the direction of each iteration.
     * Same as CSS `animation-direction`.
     *
     * @example 'alternate'
     * @example ABeamer.DI_ALTERNATE
     * @example ABeamer.DS_NORMAL
     */
    direction?: uint | string;


    /**
     * Defines how the frames should be bypassed in case of a flush or another
     * forward motion outside the rendering process.
     *
     * @default BP_FIRST_INSIDE
     */
    bypassForwardMode?: BypassMode;


    /**
     * Defines how the frames should be bypassed in case of a flush or another
     * backward motion outside the rendering process.
     * In a backward motion the first stage it's end point of animation.
     *
     * @default BP_FIRST_INSIDE
     */
    bypassBackwardMode?: BypassMode;
  }


  /**
   * Definition of the animation to be sent to the render pipeline.
   * Used by `Scene.addAnimations`.
   */
  export interface Animation extends AnimationCommonParams {

    /**
     * Tasks allow to build complex animations and
     * to avoid executing javascript code.
     *
     * @see tasks
     */
    tasks?: Task[];


    /**
     * css selector, JQuery, html elements, virtual selector or meta-selectors
     * that defines the list of elements.
     * If `strictMode` is `false`, the empty selectors will be gracefully bypassed.
     *
     * This field can be empty only if there is a setup task.
     */
    selector?: ElSelectorHandler;


    /**
     * List of properties per animation.
     *
     * @see AnimationProp
     */
    props?: AnimationProp[];
  }

  export type Animations = Animation[];

  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  /**
   * Since animations script is executed after expressions.
   * it can't be initialized on _vars initialization.
   */
  _vars.defaultDuration = DEFAULT_DURATION;


  export interface _WorkMotion<THandler, TFunc, TParams> {
    handler: THandler | TFunc | string;
    func: TFunc;
    params: TParams;
  }

  export interface _WorkExprMotionParams {
    __expression: string;
  }


  function _parseMotion<THandler, TFunc, TParams>(
    handler: THandler | TFunc | string, params: TParams,
    exprMotionHandler: TFunc,
    mapper: { [name: string]: TFunc },
    args: ABeamerArgs): _WorkMotion<THandler, TFunc, TParams> {

    let func: TFunc;
    params = params || {} as TParams;

    switch (typeof handler) {
      case 'undefined':
        return undefined;
      case 'string':
        if (isExpression(handler as string)) {
          func = exprMotionHandler;
          ((params as any) as _WorkExprMotionParams).__expression = handler as any;
        } else {
          func = mapper[handler as string];
        }
        break;
      case 'function':
        func = handler as TFunc;
        break;
    }
    if (!func) { throwI8n(`Unknown: ${handler}`); }

    return {
      handler,
      func,
      params,
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
  export abstract class _AbstractWorkAnimation {

    framesPerCycle: int;
    positionFrame: int;

    easing?: _WorkMotion<EasingHandler, EasingFunc, EasingParams>;
    oscillator?: _WorkMotion<OscillatorHandler, OscillatorFunc, OscillatorParams>;
    path?: _WorkMotion<PathHandler, PathFunc, PathParams>;

    itemDelay?: _ItemDelay;

    assignValues(
      acp: AnimationCommonParams,
      story: _StoryImpl,
      scene: _SceneImpl,
      parent?: _AbstractWorkAnimation | undefined,
      nameTag?: string,

    ): boolean {

      this.framesPerCycle = _parseTimeHandler(acp.duration,
        story, parent ? parent.framesPerCycle : _vars.defaultDuration, 0);

      this.itemDelay = _parseItemDelay(acp, story);

      if (!story._strictMode) {
        if (this.framesPerCycle < 0 && (parent && !this.framesPerCycle)) {
          if (story._logLevel >= LL_ERROR) {
            story.logMsg(`${nameTag} has invalid duration frames: ${this.framesPerCycle}`);
          }
          return false;
        }
      } else {
        if ((parent && !isPositiveNatural(this.framesPerCycle)) ||
          (!parent && !isNotNegativeNatural(this.framesPerCycle))) {
          throwErr(`${nameTag} has invalid duration frames: ${this.framesPerCycle}`);
        }
      }

      const refOrDef = parent ? parent.positionFrame : scene._frameInNr;
      this.positionFrame = _parseTimeHandler(acp.position, story, refOrDef, refOrDef);

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
        this.easing = _parseMotion<EasingHandler, EasingFunc, EasingParams>(
          acp.easing, {}, _expressionEasing, _easingFunctions, story._args);
      } else if (parent) {
        this.easing = parent.easing;
      }

      if (acp.oscillator) {
        this.oscillator = _parseMotion<OscillatorHandler, OscillatorFunc, OscillatorParams>(
          acp.oscillator.handler, acp.oscillator.params, _expressionEasing, _easingFunctions, story._args);
      } else if (parent) {
        this.oscillator = parent.oscillator;
      }

      if (acp.path) {
        this.path = _parseMotion<PathHandler, PathFunc, PathParams>(
          acp.path.handler, acp.path.params, undefined, _pathFunctions, story._args);
      } else if (parent) {
        this.path = parent.path;
      }

      return true;
    }
  }

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
  export class _ElWorkAnimation extends _AbstractWorkAnimation {

    elAdapters: _ElementAdapter[] = [];
    propInterpolators: _PropInterpolator[] = [];

    buildElements(story: _StoryImpl, scene: _SceneImpl,
      sceneAdpt: _SceneAdapter, anime: Animation) {

      this.elAdapters = _parseInElSelector(story, this.elAdapters,
        sceneAdpt, anime.selector);
    }
  }

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
  export abstract class _WorkAnimationProp extends _AbstractWorkAnimation {

    /**
     * Information has it's provided by the user.
     */
    animProp?: AnimationProp;


    /**
     * It can represent a `HTMLElement.style` property or HTMLElement property
     * PT_TEXT property types use HTMLElement property instead of style.
     */
    realPropName?: string;


    /**
     * Property Name defined by the user. Usually the same as realPropName
     * But in some cases it can differ.
     */
    propName?: string;

    propType?: uint;
    variation: ActionNumValue;

    scaleDuration: int;
    iterationCount: uint;
    dirPair: _DirPair;

    bypassForwardMode?: BypassMode;
    bypassBackwardMode?: BypassMode;
    forward: boolean;

    roundFunc: RoundFunc;
    waitFor: WaitItems;

    constructor(animProp: AnimationProp) {
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

      this.waitFor = !animProp.waitFor ? undefined :
        animProp.waitFor.map((waitItem: WaitItem) => {
          waitItem.prop = waitItem.prop || this.propName;
          return waitItem;
        });
    }
  }

  // ------------------------------------------------------------------------
  //                               Teleportation
  // ------------------------------------------------------------------------

  export function _prepareAnimationsForTeleporting(animes: Animations,
    args: ABeamerArgs) {

    animes.forEach(anime => {
      if (anime.tasks) {
        _prepareTasksForTeleporting(anime, anime.tasks, args);
      }
    });
  }
}
