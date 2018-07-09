// uuid: 3b50413d-12c3-4a6c-9877-e6ead77f58c5

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------


  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  
  //
  // This file contains about the compilation of all the exported types
  // targeted for the end-user
  // The source data is all information in each source code file defined between
  //      #export-section-start: release
  // and  #export-section-end: release
  //
  // This way the user will have access to all the public information in one file
  // It won't be used during the development phase.
  // And it's excluded in tsconfig
  //

declare namespace ABeamer {

  export function downRound(v: number): int;

  export function sprintf(
    // pattern containing %d formatters
    format: string,
    // value to replace
    ...values): string;

  // ------------------------------------------------------------------------
  //                               Server
  // ------------------------------------------------------------------------


  export interface ServerFeatures {
    hasLogging: boolean;
  }


  // ------------------------------------------------------------------------
  //                               Messages
  // ------------------------------------------------------------------------


  export interface Localization {
    locale: string;
    charRanges?: [number, number][];
    messages?: { [srcMsg: string]: string };
    functionalities?: [Functionalities | string, { src: string, dst: string }[]][];
  }


  export enum Msgs {
    MustNatPositive = 'The value of %p% must be a natural positive',
    MustNatNotNegative = 'The value of %p% must be a natural non-negative',
    MustBeANumber = 'The value of %p% must be a number',
    MustBeAString = 'The value of %p% must be textual',
    MustBeANumberOrExpr = 'The value of %p% must be a number or an expression',
    MustBeAStringOrExpr = 'The value of %p% must be textual or an expression',
    Unknown = 'Unknown %p%',
    UnknownOf = 'Unknown "%type%" %p%',
    UnknownType = 'Unknown type of %p%',
    NoEmptyField = 'Field %p% can not be empty',
    NoEmptySelector = 'Selector %p% can not be empty',
    NoCode = 'Code Handler is not allowed',
    OutOfScope = '%p% out of scope',
    ExpHasErrors = 'Expression %e% has errors: %err%',
    WrongNrParams = 'Function %p% has the wrong number of input parameters',
    WrongParamType = 'Function %p% has the wrong type in parameter: %i%',
    ValueTypeError = 'Value %p% must be a number or an expression',
    UnaryErr = 'Unary operators only support numerical values',

    flyover = 'flyover',
    task = 'task',
    pos = 'position',
    startScene = 'startScene',
    endScene = 'endScene',
  }


  export interface I8nParams {
    [name: string]: (number | string);
  }


  export function i8nMsg(msg: string, params?: I8nParams): string;


  export enum RoundFuncName {
    none,
    round,
    ceil,
    floor,
    downRound,
  }


  export type RoundFunc = (v: number) => number;

  export type RoundHandlerFunc = string | RoundFuncName | RoundFunc;


  export function parseRoundFunc(handler: RoundHandlerFunc): RoundFunc;

  export function parseHandler<T, TO>(handler: T, defaultHandler: T,
    mapper: any, args: ABeamerArgs): TO;

  export function parseEnum<T>(value: T | string, mapper: any,
    defValue?: T | string | undefined): T;

  export function throwErr(msg: string): void;

  export function throwI8n(msg: string, params?: I8nParams): void;

  export function throwIf(isTrue: boolean, msg: string): void;

  export function throwIfI8n(isTrue: boolean, msg: string,
    params?: I8nParams): void;

  // ------------------------------------------------------------------------
  //                               Time
  // ------------------------------------------------------------------------


  /**
   * List of supported Time Units.
   * `%` can only be used if there is a parent time reference.
   */
  export enum TimeUnit {
    f,
    ms,
    s,
    m,
    '%',
  }


  /** Time [](Code Handler) */
  export type TimeFunc = (args?: ABeamerArgs) => TimeUnit | string
    | ExprString | number;


  /** Time used by the user to provide Duration and Position */
  export type TimeHandler = TimeUnit | string | ExprString | number | TimeFunc;


  export function frame2Time(frame: uint, fps: uint, unit: TimeUnit,
    maxPrecision?: uint): string;

  export function parseTimeHandler(
    timeOrFrame: TimeHandler | undefined,
    args: ABeamerArgs,
    defaultTimeOrFrame: string | int,
    referenceFrame: int,
    toInt: boolean = true): int | number;

  // ------------------------------------------------------------------------
  //                               Functions
  // ------------------------------------------------------------------------


  export const enum ExFuncParamType {
    Any,
    Number,
    String,
    Array,
  }


  export interface ExFuncParam {
    paType?: ExFuncParamType;
    sValue?: string;
    numValue?: number;
    arrayValue?: number[];
  }


  export type _CheckParamFunc = (req: ExFuncReq, paramCount: uint,
    paramTypes?: ExFuncParamType[]) => void;


  export interface ExFuncReq {
    args: ABeamerArgs;
    req?: ExFuncReq;
    res?: ExFuncParam;

    checkParams: _CheckParamFunc;
  }


  export type ExprFuncParams = ExFuncParam[];

  export type ExFunction = (params: ExprFuncParams, req?: ExFuncReq) => void;


  // ------------------------------------------------------------------------
  //                               Expressions
  // ------------------------------------------------------------------------


  export type VarType = number | string | boolean | number[] | object;


  export interface Vars {
    e: number;
    pi: number;
    /** =pi/180 */
    deg2rad: number;
    /** =180/pi */
    rad2deg: number;

    /** Frames per second. */
    fps?: uint;
    /** Frame output width = generated file image width. */
    frameWidth?: uint;
    /** Frame output height = generated file image height. */
    frameHeight?: uint;

    /** Is True, if it's teleporting. */
    isTeleporting?: boolean;

    /** Element index of the active adapter */
    elIndex?: uint;

    /** Number of elements inside defined by the active adapter */
    elCount?: uint;

    /** Computed Numerical `valueStart`. */
    v0?: number;
    /** Computed Numerical `value`. */
    v1?: number;
    /** Computed Numerical difference `value` - `valueStart`. */
    vd?: number;
    /** Computed Numerical value injected to the easing function. */
    vt?: number;
    /** Computed Numerical value injected to the oscillator function. */
    vot?: number;
    /** Computed Numerical value injected to the path function. */
    vpt?: number;
    /** `t` used to interpolate an easing, oscillator or path via expression. */
    t?: number;
    /** Generic value. Used in Charts. */
    v?: number;
    /** Generic iterator. Used in Factories. */
    i?: int;
    /** Generic number of items/points/elements. Used in Charts. */
    n?: int;

    [name: string]: VarType;
  }


  export const enum ExprType {
    NotExpr,
    CalcOnce,
    CalcMany,
  }


  export type ExprResult = string | number | number[];

  export type ExprString = string;


  export function isCharacter(ch: string | undefined, pos: uint = 0): boolean;

  export function isDigit(ch: string): boolean;

  export function isCharacterOrNum(ch: string): boolean;

  export function isExpr(text: string): boolean;

  export function calcExpr(expr: string, args: ABeamerArgs): ExprResult;

  export function ifExprCalc(expr: string,
    args: ABeamerArgs): ExprResult | undefined;

  export function ifExprCalcNum(expr: string, defNumber: number | undefined,
    args: ABeamerArgs): number | undefined;

  export function ifExprCalcStr(expr: string, defString: string | undefined,
    args: ABeamerArgs): string | undefined;

  export function ExprOrNumToNum(param: ExprString | number,
    defValue: number | undefined, args: ABeamerArgs): number | undefined;

  export function ExprOrStrToStr(param: ExprString | string,
    defValue: string | undefined, args: ABeamerArgs): string | undefined;

  // ------------------------------------------------------------------------
  //                               Easings
  // ------------------------------------------------------------------------



  /**
   * Defines the easing Code Handler.
   *
   * An **easing**  is a interpolator runs `t` from [0, 1], where
   * `t=0` is the first frame and `t=1` the last frame of the animation.
   * This interpolator can be viewed as the speed interpolator and its the
   * first one in the Animation Pipeline.
   * Usually outputs a value from [0, 1] but other values are also possible.
   */
  export type EasingFunc = (t: number, params: EasingParams, args?: ABeamerArgs) => number;


  /**
   * Defines the easing type, which is either string representing a predefined
   * easing function or a custom function (see easing function).
   *
   * The easing function interpolates from [0, 1].
   */
  export type EasingHandler = EasingName | string | ExprString | EasingFunc;


  /**
   * Defines the Base parameters for every easing function.
   * At the moment no parameter is required, but it can change in the future.
   */
  export type EasingParams = AnyParams;


  /** List of the built-in easings */
  export enum EasingName {
    linear,

    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInCirc,
    easeOutCirc,
    easeInOutCirc,
    easeInElastic,
    easeOutElastic,
    easeInOutElastic,
    easeInBack,
    easeOutBack,
    easeInOutBack,
    easeInBounce,
    easeOutBounce,
    easeInOutBounce,
  }


  // ------------------------------------------------------------------------
  //                               Oscillators
  // ------------------------------------------------------------------------



  /**
   * Defines the type of a oscillator function.
   * An oscillator function is an interpolator that runs from [0, 1].
   * Usually outputs a value from [-1, 1] but other values are also possible.
   * An oscillator is mostly used to rotate an element returning to the original position.
   */
  export type OscillatorFunc = (t: number, params: OscillatorParams,
    args?: ABeamerArgs) => number;


  /**
   * Defines the oscillator type, which is either string representing a predefined
   * oscillator function or a custom function (see oscillator function)
   * The oscillator function interpolates from [0, 1].
   */
  export type OscillatorHandler = OscillatorName | number | ExprString
    | OscillatorFunc | EasingFunc;


  /**
   * Defines the Base parameters for every oscillator function.
   * At the moment no parameter is required, but it can change in the future.
   */
  export type OscillatorParams = AnyParams;


  /** List of the built-in oscillators */
  export enum OscillatorName {
    harmonic = 1000,  // lower ids are for easings.
    damped,
    pulsar,
  }


  /** Oscillator parameters defined in an Animation Property. */
  export interface Oscillator {

    /** Defines an Oscillator by Name, Expression or Code Handler */
    handler: OscillatorHandler;


    /** Params passed to the Oscillator. Depends on the Oscillator Type */
    params?: AnyParams
    | HarmonicOscillatorParams
    | DampedOscillatorParams
    | PulsarOscillatorParams
    ;
  }

  /** Function used to define what to do when a value is negative. */
  export type NegativeFunc = (t: number) => number;


  /**
   * List of Negative built-in functions:
   * - `abs` Math.abs
   * - `clip` If v < 0 then v = 0
   */
  export enum NegativeBuiltInFuncs {
    none,
    clip,
    abs,
  }


  /** Params defined inside the props.oscillator.params, when `props.oscillator = 'harmonic'` */
  export interface HarmonicOscillatorParams extends OscillatorParams {
    /**
     * Defines the number of full cycles (positive arc+negative arc)
     * contained during the `duration` period.
     * If `negativeHander = abs`, 1 cycle will have 2 arcs.
     */
    cycles?: number;


    /** Function used to define what to do when a value is negative. */
    negativeHander?: NegativeBuiltInFuncs | string | NegativeFunc;

    /** Allows to shift and scale the input of every oscillator. */
    shift: number;

    // cut: number;
  }


  /** Params defined inside the props.oscillator.params, when `props.oscillator = 'damped'` */
  export interface DampedOscillatorParams {
    frequency?: number;
    /** Defines how much energy the oscillator will lose from one cycle to the next. */
    friction?: number;
    /** Function used to define what to do when a value is negative. */
    negativeHander?: NegativeBuiltInFuncs | string | NegativeFunc;
  }


  /** List of the built-in pulsar type */
  export enum PulsarType {
    normal,
    sine,
    random,
    positiveRandom,
  }


  /** Params defined inside the props.oscillator.params, when `props.oscillator = 'pulsar'` */
  export interface PulsarOscillatorParams {

    /** Type of pulsar defined by ID or string. */
    type?: PulsarType | string;


    /** The point where the pulsar reaches it's maximum value. */
    midpoint?: number;


    /**
     * The amplitude around midpoint where the pulsar begins to receive value.
     * The pulsar starts gaining energy at `midpoint-spread`, reaches the maximum value
     * at `midpoint` and then decreases until reaches zero at `midpoint+spread`.
     */
    spread?: number;
  }


  // ------------------------------------------------------------------------
  //                               Paths
  // ------------------------------------------------------------------------


  /**
   * Defines the type of a path function.
   * A path function is an interpolator that usually runs from [0, 1].
   * An path defines a movement in the n-space.
   */
  export type PathFunc = (t: number, params: PathParams, stage: uint,
    args?: ABeamerArgs) => number[];


  /**
   * Defines the path type, which is either string representing a predefined
   * path function or a custom function (see path function).
   * The path function interpolates from [0, 1].
   */
  export type PathHandler = PathName | string | ExprString | PathFunc;


  /** List of the built-in paths */
  export enum PathName {
    line,
    rect,
    circle,
    ellipse,
  }


  /**
   * Defines the Base parameters for every path function.
   * At the moment no parameter is required, but it can change in the future.
   */
  export type PathParams = AnyParams;


  /** Path parameters defined in an Animation Property. */
  export interface Path {

    /** Defines a Path by Name, Expression or Code Handler */
    handler: PathHandler;

    /** Params passed to the Path. Depends on the Path Type */
    params?: FuncParams
    | LinePathParams
    | RectPathParams
    | CirclePathParams
    | EllipsePathParams
    ;
  }


  export interface CenteredPathParams extends PathParams {
    centerX?: number | ExprString;
    centerY?: number | ExprString;
  }


  export interface LinePathParams extends PathParams {
    x0?: number | ExprString;
    y0?: number | ExprString;
    x1?: number | ExprString;
    y1?: number | ExprString;
  }


  export type RectPathParams = LinePathParams;


  export interface CirclePathParams extends CenteredPathParams {
    radius?: number | ExprString;
  }


  export interface EllipsePathParams extends CenteredPathParams {
    radiusX?: number | ExprString;
    radiusY?: number | ExprString;
  }


  // ------------------------------------------------------------------------
  //                               Tasks
  // ------------------------------------------------------------------------



  // ------------------------------------------------------------------------
  //                               Task Results
  // ------------------------------------------------------------------------

  export const TR_EXIT = 0;
  export const TR_DONE = 1;
  export const TR_INTERACTIVE = 2;

  export type TaskResult = 0 | 1 | 2;

  // ------------------------------------------------------------------------
  //                               Task Stage
  // ------------------------------------------------------------------------

  export const TS_INIT = 0;
  export const TS_ANIME_LOOP = 1;
  export const TS_TELEPORT = 2;

  // ------------------------------------------------------------------------
  //                               Task Interface
  // ------------------------------------------------------------------------

  export type TaskFunc = (anime: Animation, wkTask: WorkTask,
    params?: AnyParams, stage?: uint, args?: ABeamerArgs) => TaskResult;


  export type TaskHandler = TaskName | TaskFunc;

  export type TaskName = string
    | GeneralTaskName
    | TextTaskName
    | ShapeTaskName
    | AttackTaskName
    ;


  export type TaskParams = AnyParams
    | GeneralTaskParams
    | TextTaskParams
    | ShapeTaskParams
    | AttackTaskParams
    ;


  /**
   * Parameters provided by the user during an `addAnimation`.
   */
  export interface Task {
    /** Task Name, Expression or Input Function defined by the user. */
    handler: TaskHandler;
    /** Parameters passed to the task function */
    params?: TaskParams;
  }


  /**
   * Parameters passed to a task during the execution.
   */
  export interface WorkTask {
    name: string;
    params: TaskParams;
    animeIndex: uint;
  }


  export type GeneralTaskName =
    /** @see TaskFactoryParams */
    | 'factory'
    ;


  export type GeneralTaskParams =
    | FactoryTaskParams
    ;


  export type FactoryTaskAttr = string | ExprString | number | string[] | number[];


  export interface FactoryTaskParams extends AnyParams {
    count: uint | ExprString;
    tag?: string;
    content?: FactoryTaskAttr;
    isContentFormatted?: boolean;
    attrs?: {
      name: string;
      value: FactoryTaskAttr;
      isFormatted?: boolean;
    }[];
  }


  // ------------------------------------------------------------------------
  //                               Flyovers
  // ------------------------------------------------------------------------


  export interface InfoFlyoverParams {

    /**
     * Element selector from the story, it can be DOM or virtual.
     * @default .info-flyover
     */
    selector?: ElSelector;


    /**
     * Text patterns supporting '${}' macros.
     *
     * Supported macros are:
     *
     * - `storyFrameNr` - current render frame within the story.
     * - `storyElapsedS` - number of seconds elapsed within the story.
     * - `storyElapsedMS` - number of milliseconds elapsed within the story.
     * - `storyElapsedM` - number of minutes elapsed within the story.
     *
     * @example story-frame: ${storyFrameNr} story-time: ${storyTime}
     * @default ${storyFrameNr}
     */
    format?: string;


    /**
     * Maximum number of decimal digits for time macros.
     * @default: 4
     */
    maxPrecision?: int;
  }


  export interface VideoSyncFlyoverParams {

    /**
     * Element selector from the story, it can be DOM or virtual.
     *
     * @default #video
     */
    selector?: ElSelector;

    /**
     * If it's `false`, is disabled if `isServer = true`.
     *
     * @default true
     */
    serverRender: boolean;
  }


  /**
   * Generic parameters passed to a flyover function.
   */
  export type FlyoverParams = AnyParams
    | InfoFlyoverParams
    | VideoSyncFlyoverParams;


  /**
   * Defines a function that is executed on every render step.
   * Use it to render elements that scene independent.
   */
  export type FlyoverFunc = (wkFlyover: WorkFlyover, params: FlyoverParams,
    stage?: uint, args?: ABeamerArgs) => void;


  export interface WorkFlyover {
    name: string;
    params: FlyoverParams;
  }


  /**
   * Flyover Name, Expression or Input Function defined by the user.
   * in `story.addFlyover`.
   */
  export type FlyoverHandler = string | FlyoverFunc
    // Displays info about frames or time
    | 'info'
    // Synchronizes a video current time with the story current render frame
    | 'video-sync';



  // ------------------------------------------------------------------------
  //                               Elements
  // ------------------------------------------------------------------------


  /**
   * Defines the special names for [Adapter properties](#Adapter property) names.
   */
  export type SpecialAdapterPropName =
    // modifies the textContent property.
    'text'
    // same as text. It's preferable to use 'text'.
    | 'textContent'

    // modifies the innerHTML attribute.
    | 'html'
    // same as html. It's preferable to use 'html'.
    | 'innerHTML'
    // modifies outerHTML attribute.
    | 'outerHTML'
    // changes the style.display CSS property for DOM Elements/Scenes.
    // Uses DOM attribute `data-abeamer-display`.
    | 'visible'
    // modifies the attribute `src`.
    | 'src'
    // modifies the `classList` if it has `+` or `-` if has it starts a class.
    // otherwise it sets `className`.
    | 'class'
    ;


  /**
   * **Dual properties** are properties that map one animation property into 2 [](DOM properties).
   */
  export type DualPropName = 'width-height'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom';


  /**
   * List of Property Names that a DOM or Virtual Element should support.
   */
  export type ElPropName = string
    | 'id'
    | 'visible'
    | 'uid'
    | 'data-abeamer-display'
    ;


  /**
   * List of Property Names that a DOM or Virtual Scene should support.
   */
  export type ScenePropName = string
    | 'html'
    | 'left'
    | 'top'
    | 'width'
    | 'height'
    /** If this value is set, it will for `Visible=true` */
    | 'data-abeamer-display'
    ;


  /**
   * List of Property Names that a DOM or Virtual Story should support.
   */
  export type StoryPropName = string
    | 'frame-width'
    | 'frame-height'
    /** clip-path is a set only. see CSS clip-story properties  */
    | 'clip-path'
    | 'fps'
    ;


  /**
   * Union of Property Names that a DOM or Virtual Adapter should support.
   */
  export type PropName = string
    | ElPropName
    | ScenePropName
    | StoryPropName
    | SpecialAdapterPropName
    | DualPropName
    ;


  /**
   * Although, DOM only returns string values, a virtual Element can use
   * more rich data types.
   * e.g. DOM adapter maps a boolean `visible` into CSS display.
   * A virtual element can use directly booleans.
   */
  export type PropValue = string | number | int | boolean;


  export enum WaitForWhat {
    Custom,
    ImageLoad,
    MediaSync,
  }


  export interface WaitFor {
    prop: PropName;
    value?: string | number;
    what?: WaitForWhat;
  }


  export type WaitForList = WaitFor[];


  /**
   * Base interface for virtual elements such as WebGL, Canvas or Task animator.
   */
  export interface VirtualElement {

    getProp(name: PropName, args?: ABeamerArgs): PropValue;
    setProp(name: PropName, value: PropValue, args?: ABeamerArgs): void;
    waitFor?(waitFor: WaitFor, onDone: DoneFunc, args?: ABeamerArgs): void;
  }


  export type PElement = HTMLElement | VirtualElement;


  export interface VirtualAnimator extends VirtualElement {
    selector: string;
  }

  // ------------------------------------------------------------------------
  //                               Scene Selectors
  // ------------------------------------------------------------------------

  /**
   * Base interface for virtual scenes such as WebGL, Canvas.
   */
  export interface VirtualScene {


    /**
     * Must support `id` and `visible` attributes.
     */
    getProp(name: PropName, args?: ABeamerArgs): string;


    /**
     * Must support `visible` and `uid` attributes.
     */
    setProp(name: PropName, value: string, args?: ABeamerArgs): void;


    /**
     * Must call iterator for each element represented on the selector.
     *
     * @param selector CSS style selectors
     */
    query(selector: string,
      iterator: (element: PElement, index: uint) => void);
  }


  /**
   * Scene Selector defined by the user.
   */
  export type SceneSelector = string | JQuery | VirtualScene;

  // ------------------------------------------------------------------------
  //                               Element Selector
  // ------------------------------------------------------------------------

  /**
   * Defines css selectors, JQuery, meta-selectors, and Virtual selectors.
   * Virtual selectors start with `%`.
   */
  export type ElSelector = JQuery
    // (DOM or virtual) selectors
    | string
    // list of (DOM or virtual) elements ids
    | string[]
    // list of html elements
    | HTMLElement[]
    // list of virtual elements
    | VirtualElement[]
    // An pEls containing elements
    | pEls
    ;


  /**
   * User defined function that return an Element Selector.
   * Doesn't supports remote rendering.
   */
  export type ElSelectorFunc = (args?: ABeamerArgs) => ElSelector;


  /**
   * Element Selector defined by the user.
   */
  export type ElSelectorHandler = ElSelector | ElSelectorFunc;


  // ------------------------------------------------------------------------
  //                               Browser
  // ------------------------------------------------------------------------

  export interface Browser {

    vendorPrefix: string;
    prefixedProps: string[];
  }


  export const browser: Browser = {
    vendorPrefix: '',
    prefixedProps: [],
  };


  // ------------------------------------------------------------------------
  //                               Transitions
  // ------------------------------------------------------------------------


  // ------------------------------------------------------------------------
  //                               Transition States
  // ------------------------------------------------------------------------

  export const TRS_SETUP = 0;
  export const TRS_AT_OUT = 1;
  export const TRS_AT_IN = 2;


  export const DEFAULT_TRANSITION_DURATION = '1s';


  /**
   * List of the built-in Transition Names.
   */
  export enum StdTransitions {
    slideLeft,
    slideRight,
    slideTop,
    slideBottom,
    dissolve,
  }


  /**
   * Parameters passed to the Transition function.
   */
  export interface TransitionParams {
    bothVisible: boolean;
    state?: int;
    frameI?: int;
    enterFrameI?: uint | undefined;
    leaveRealFrameI?: uint | undefined;
    frameCount?: uint;
    leaveFrameCount?: uint;
    enterFrameCount?: uint;
    leaveAdapter?: AbstractAdapter;
    enterAdapter?: AbstractAdapter;
  }


  export type TransitionFunc = (params: TransitionParams, args?: ABeamerArgs) => void;

  export type TransitionHandler = string | ExprString | TransitionFunc
    | StdTransitions;


  export interface Transition {
    handler: TransitionHandler;
    duration?: TimeHandler;
  }


  // ------------------------------------------------------------------------
  //                               Plugin Manager
  // ------------------------------------------------------------------------


  export interface AnyParams { [key: string]: any; }

  export interface ABeamerArgs {
    story?: Story;
    scene?: Scene;
    stage?: uint;
    /** Every time, the render is executed this value is incremented. */
    renderNr?: uint;
    user?: AnyParams;
    waitMan?: WaitMan;
    /** If true, the internal code or plugin should dump information using `story.logFrmt`. */
    isVerbose?: boolean;
    /**
     * True if it's running a supporting server program for frame storage.
     *
     * #end-user @readonly
     */
    hasServer?: boolean;
    isTeleporting?: boolean;
    /** If true, perform type checks and other restriction checks. */
    isStrict?: boolean;
    /** Global variables used as variables in expressions. */
    vars: Vars;
    /**
     * Parameters passed by the server via command-line `abeamer render`.
     * @example: --render-var name=end-user --render-var value=1.2.3
     */
    renderVars: AnyParams;
  }


  /**
   * Information required by each plugin creator about its own plug-in.
   */
  export interface PluginInfo {
    id: string;
    uuid: string;
    author: string;
    email: string;
    copyrights?: string;
    jsUrls?: string[];
    cssUrls?: string[];
    assetsUrls?: string[];
    telemetricUrl?: string[];
    teleportable: boolean;
  }


  /** List of all the functionalities available to be extended by plugins. */
  export enum Functionalities {
    easings,
    oscillators,
    paths,
    transitions,
    tasks,
    flyovers,
    functions,
  }


  // ------------------------------------------------------------------------
  //                               Text Tasks
  // ------------------------------------------------------------------------


  export type WrapperTaskName =
    /** @see #SceneTransitionTaskParams */
    | 'scene-transition'
    /** @see #AddStillsTaskParams */
    | 'add-stills'
    /** @see #AddFlyoverTaskParams */
    | 'add-flyover'
    /** @see #AddVarsTaskParams */
    | 'add-vars'
    ;


  export type WrapperTaskParams =
    | SceneTransitionTaskParams
    | AddStillsTaskParams
    | AddFlyoverTaskParams
    | AddVarsTaskParams
    ;


  export interface SceneTransitionTaskParams extends AnyParams {
    handler?: TransitionHandler;
    duration?: TimeHandler;
  }


  export interface AddStillsTaskParams extends AnyParams {
    duration: TimeHandler;
  }


  export interface AddFlyoverTaskParams extends AnyParams {
    handler: FlyoverHandler;
    params?: FlyoverParams;
  }


  export interface AddVarsTaskParams extends AnyParams {
    vars: { [varName: string]: string | number };
  }


  // ------------------------------------------------------------------------
  //                               Animation Direction
  // ------------------------------------------------------------------------


  export enum Directions {
    normal,
    reverse,
    alternate,
    'alternate-reverse',
  }



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
  export const DEFAULT_DURATION = '1f';

  /** Value used, if no duration is defined for a fade in/out. */
  export const DEFAULT_FADE_DURATION = '400ms';

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
     * A `Scene.addAnimations` runs its list of animations and properties in parallel,
     * and at the end of last animation it moves the position forward.
     * Setting the `advance`:
     * 1. To `true` of an animation property will move forward the position
     * for the next property animation, but not the animation.
     * The property of each element moves independently.
     * 2. To `true` of an animation that isn't the last one, will move forward
     * for the next animation within the list.
     * The value used with the maximum of all the elements of the all the properties
     * of the previous animation.
     * 3. To `false` of the last animation, it won't move forward at the end.
     */
    advance?: boolean;

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
     * @example  (args) => '2s'  (JavaScript functions aren't teleportable)
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
     * @example (args) => '4ms' (JavaScript functions aren't teleportable)
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
    * Multi-dimension paths are mutual exclusive with textual `valueText`.
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
     * Animation Pipeline (easing➝oscillator➝path|valueText➝valueFormat).
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
     * **EXPERIMENTAL** Waits for the adapter to be ready to deliver an asset before
     * instructing the render to move to the next frame or give the server order to store the image.
     * Used to wait for loading images or sync with videos.
     *
     * This feature is not implemented yet..._Coming soon_ .
     *
     * @see gallery/animate-video-sync
     */
    waitFor?: WaitForList;



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


  // ------------------------------------------------------------------------
  //                               Story
  // ------------------------------------------------------------------------



  export type DoneFunc = () => void;

  export type WaitFunc = (args: ABeamerArgs, params: AnyParams,
    onDone: DoneFunc) => void;


  export interface WaitMan {
    addWaitFunc(func: WaitFunc, params: AnyParams): void;
  }


  export type DirectionInt = -1 | 1;


  export type LogType = 0 | 1 | 2;


  /** Scene by Object, index or name */
  export type SceneHandler = Scene | uint | string;


  export interface StoryMetadata {
    version?: string;
    author?: string;
    email?: string;
    copyrights?: string;
    categories?: string[];
    keywords?: string[];
    comments?: string[];
    rating?: uint;
    /** ISO DateTime stamp of the creation time. */
    createdDateTime?: string;
    /** ISO DateTime stamp of the last modified time. */
    modifiedDateTime?: string;
  }


  /** Parameters passed to the story when it's created */
  export interface CreateStoryParams {
    /** Adds automatically the default scenes. */
    dontAddDefaultScenes?: boolean;


    /** Defines if the story is going to be teleported. */
    toTeleport?: boolean;


    /**
     * Set this value, if you need use a Virtual Story Adapter inside of the
     * default DOM Adapter.
     */
    storyAdapter?: SceneAdapter;
  }


  /**
   * ABeamer still has to render all the previous frames
   * of active scene bypassing the middle frames,
   * but it won't be render to disk and it will bypass any unnecessary frames.
   */
  export interface RenderFrameOptions {
    /**
     * First render frame.
     * If `startScene` isn't defined it will be relative to the story, otherwise is
     * relative to the `startScene`.
     *
     * @default 0
     */
    renderPos?: TimeHandler;


    /**
     * Total number of frames to render.
     *
     * **EXPERIMENTAL** Use a negative value to render backwards.
     * For backward rendering, ABeamer first has to consume all the frames forward,
     * bypassing all middle frames, only after can render backwards.
     *
     * @default the total number of frames
     */
    renderCount?: TimeHandler;


    /**
     * First scene to be rendered.
     * Before start rendering the `startScene`, first,
     * ABeamer first has to consume all the frames until it reaches the
     * beginning of Scene.
     * Accepts by 'Scene Zero-Based Index', 'Name' or by 'Scene Object'
     */
    startScene?: SceneHandler;


    /**
     * Last scene to be rendered.
     * Accepts by 'Scene Zero-Based Index', 'Name' or by 'Scene Object'.
     */
    endScene?: SceneHandler;
  }


  export function createStory(fps?: uint,
    createParams?: CreateStoryParams): Story;

  export function createStoryFromConfig(
    cfgUrl: string,
    callback: (story: Story) => void,
    fps?: uint,
    createParams?: CreateStoryParams): void;

  // ------------------------------------------------------------------------
  //                               Text Tasks
  // ------------------------------------------------------------------------


  export type TextTaskName =
    /** @see #TextSplitTaskParams */
    | 'text-split'
    /** @see #TypewriterTaskParams */
    | 'typewriter'
    /** @see #DecipherTaskParams */
    | 'decipher'
    ;


  export type TextTaskParams =
    | TextSplitTaskParams
    | TypewriterTaskParams
    | DecipherTaskParams
    ;


  export interface TextSplitTaskParams extends AnyParams {
    text?: string;
    splitBy?:
    | 'char'
    | 'word'
    ;


    /**
     * If realign is true, it sets the left property of each new element
     * in a way that are align side by side.
     *
     * Use it if the element position is absolute.
     *
     * Main purpose is to use with transformations.
     *
     * Valid only for DOM elements.
     */
    realign?: boolean;
  }


  export interface TypewriterTaskParams extends TextSplitTaskParams {
    cursor?: boolean;
    cursorChar?: string;
  }


  /**
   * List of the directions that instruct how the text can be revealed.
   */
  export enum RevealDir {
    disabled,
    toRight,
    toLeft,
    toCenter,
  }


  export interface DecipherTaskParams extends AnyParams {
    upperCharRanges?: [number, number][];
    lowerCharRanges?: [number, number][];
    iterations: uint;
    revealCharIterations?: uint;
    revealDirection?: RevealDir | string;
    text: string;
  }



  // ------------------------------------------------------------------------
  //                               Shape Tasks
  // ------------------------------------------------------------------------


  export enum Shapes {
    rectangle,
    line,
    circle,
    speech,
  }

  export type ShapeTaskName = 'shape';


  export type ShapeTaskParams =
    | RectangleShapeTaskParams
    | LineShapeTaskParams
    | CircleShapeTaskParams
    | SpeechShapeTaskParams
    ;


  export interface BaseShapeTaskParams extends AnyParams {
    shape?: Shapes | string;
    stroke?: string;
    strokeWidth?: uint | ExprString;
    fill?: string;
  }


  export interface RectangleShapeTaskParams extends BaseShapeTaskParams {
    width?: uint | ExprString;
    height?: uint | ExprString;
    rx?: uint | ExprString;
    ry?: uint | ExprString;
  }


  export interface LineShapeTaskParams extends BaseShapeTaskParams {
    x?: int | ExprString;
    y?: int | ExprString;
    direction?: number | ExprString;
    length?: number | ExprString;
  }


  export interface CircleShapeTaskParams extends BaseShapeTaskParams {
    radius?: number | ExprString;
  }


  export const DEFAULT_SPEECH_START = 10;
  export const DEFAULT_SPEECH_WIDTH = 10;
  export const DEFAULT_SPEECH_HEIGHT = 10;
  export const DEFAULT_SPEECH_SHIFT = 0;


  export enum SpeechPosition {
    left,
    right,
  }


  export interface SpeechShapeTaskParams extends RectangleShapeTaskParams {
    speechPosition?: SpeechPosition | string;
    speechStart?: uint;
    speechWidth?: uint;
    speechHeight?: uint;
    speechShift?: int;
  }


  // ------------------------------------------------------------------------
  //                               Attack Tasks
  // ------------------------------------------------------------------------


  export type AttackTaskName =
    /** @see #ColorAttackTaskParams */
    | 'color-attack'
    ;


  export type AttackTaskParams =
    ColorAttackTaskParams;


  export interface ColorAttackTaskParams extends AnyParams {

    /** List of colors to attack the original color. */
    attack: string[];

    /**
     * Property Name.
     * @default: 'color'
     */
    prop?: string;


    /**
     * Number of times it will attack the color before returning to the original.
     * Expressions are supported.
     */
    cycles?: uint | ExprString;


    /** Color to end the attack. If undefined, it uses the original color. */
    endColor?: string;
  }


  // ------------------------------------------------------------------------
  //                               Chart Tasks
  // ------------------------------------------------------------------------


  export enum ChartTypes {
    pie,
    bar,
    area,
    line,
    marker,
    mixed,
  }

  export type ChartTaskName = 'chart';


  export interface ExprSeries {
    /**
     * Expression that defines the series.
     * `v` is the variable that starts in `startValue`, increments `step`.
     * `n` is the number of points.
     */
    expr: ExprString;
    /**
     * Number of points generated by the expr.
     * If it's undefined, but there is already a previous series it will use
     * the previous series nrPoints
     * @default ChartDefaults.nrPoints
     */
    nrPoints: uint;
    startValue?: number;
    step?: number;
  }


  export type SeriesData = number[] | ExprSeries;


  export enum ChartCaptionOrientation {
    horizontal,
    vertical,
  }


  export enum ChartCaptionPosition {
    top,
    bottom,
    left,
    right,
  }


  export enum ChartCaptionAlignment {
    left,
    center,
    right,
  }


  export interface ChartCaptions {
    fontColor?: string | ExprString;
    fontFamily?: string | ExprString;
    fontSize?: uint | ExprString;
    alignment?: ChartCaptionAlignment | string;
    position?: ChartCaptionPosition | string;
    orientation?: ChartCaptionOrientation | string;
    marginBefore?: uint | ExprString;
    marginAfter?: uint | ExprString;
  }


  export interface ChartLabels extends ChartCaptions {
    captions?: string[] | ExprString;
  }


  export type ChartLabelsX = ChartLabels;


  export interface ChartLegendMark {
    width?: uint | ExprString;
    height?: uint | ExprString;
    spacing?: uint | ExprString;
  }


  export interface ChartLegend extends ChartLabels {
    mark?: ChartLegendMark;
  }


  export interface ChartLabelsY extends ChartLabels {
    tickCount?: uint;
  }


  export enum ChartPointShape {
    circle,
    square,
    diamond,
  }


  export interface ChartMarkers {
    visible?: boolean | boolean[] | boolean[][];
    shape?: (ChartPointShape | string) | (ChartPointShape | string)[]
    | (ChartPointShape | string)[][];
    size?: uint | uint[] | uint[][];
    color?: string | string[] | string[][];
  }


  export interface ChartLine {
    visible?: boolean;
    color?: string | ExprString;
    width?: number | ExprString;
  }


  export interface ChartTitle extends ChartCaptions {
    caption: string | ExprString;
  }


  export interface ChartDefaults {
    labelsX: ChartLabelsX;
    labelsY: ChartLabelsY;
    legend: ChartLegend;
    title: ChartTitle;
    fillColors: string;
    strokeColors: string;
    strokeWidth: uint;
    markers: ChartMarkers;
    barWidth: uint;
    pointMaxHeight: uint;
    pointDistance: uint;
    seriesSpacing: uint;
    /** Number of Points for ExprSeries */
    nrPoints: uint;
  }


  /**
   * Parameters for both [Axis Charts](#AxisChartTaskParams) and [Pie Charts](#PieChartTaskParams).
   */
  export interface BaseChartTaskParams extends AnyParams {
    /**
     * Defines the type of chart.
     * If it's `mixed` it uses [](#chartTypes)
     */
    chartType?: ChartTypes | string;


    /**
     * List of series of data points.
     * Each series much have the same number of data points.
     */
    data: SeriesData[];

    /**
     * Set with a unique virtual selector, to be used another `addAnimations` to animate the chart.
     * ### Example
     * ```typescript
     *    scene.addAnimations([{
     *     selector: 'canvas',
     *     tasks: [{
     *       handler: 'chart',
     *       params: {
     *         data: [[100, 200, 50, 140, 300]],
     *         pointHeightStart: 0.1,    // defined the initial value for the animation point-height property
     *         animeSelector: 'chart-anime-02', // unique animation selector to be used by the animator
     *       } as ABeamer.AxisChartTaskParams,
     *     }],
     *   }])
     *     .addAnimations([{
     *       selector: `%chart-anime-02`, // animation selector defined previously, prefixed with '%'
     *       duration: `1s`,
     *       props: [{
     *         prop: 'point-height', // property which initial value is 0.1
     *         value: 1,             // value at the end of animation
     *       }],
     *     }]);
     * ```
     */
    animeSelector?: string;


    /**
     * Defines the chart title.
     * At the moment is only supported horizontal top or bottom titles.
     */
    title?: string | ExprString | ChartTitle;


    /**
     * Defines the chart legend.
     * At the moment is only supported stacked left or right top legend.
     */
    legend?: ChartLegend;


    // colors
    /** Interior Color used by `area`, `bar` and `pie` charts. */
    fillColors?: string | string[] | string[][];
    /** Outline Color used by `area`, `bar` and `pie` charts, and line color for `line` chart. */
    strokeColors?: string | string[] | string[][];
    strokeWidth?: uint | uint[] | uint[][];
  }


  /**
   * Parameters used by Pie Charts.
   * Pie Charts provide the following animators:
   * - [angle](#PieChartTaskParams.angleStart) with initial value in angleStart.
   * - [dispersion](#PieChartTaskParams.dispersionStart) with initial value in dispersionStart.
   */
  export interface PieChartTaskParams extends BaseChartTaskParams {
    /**
     * Initial angle in radians defining the zero radial line of the chart.
     * This parameter is animated with property `angle`.
     */
    angleStart?: number | ExprString;


    /**
     * Initial dispersion factor defined between 0 and 1.
     * A dispersion defines the percentage of how much the pie circle will be used.
     * A value of 1 represents a full circle, and a value of 0.5, represents half circle.
     * This parameter is animated with property `dispersion`.
     */
    dispersionStart?: number | ExprString;
    isClockwise?: boolean;
  }


  /**
   * Parameters used by Axis Charts, which are all except [Pie Charts](#PieChartTaskParams).
   * Axis Charts provide the following animators:
   * - [point-height](#AxisChartTaskParams.pointHeightStart) with initial value in pointHeightStart.
   * - [deviation](#AxisChartTaskParams.deviationStart) with initial value in deviationStart.
   * - [sweep](#AxisChartTaskParams.sweepStart) with initial value in sweepStart.
   */
  export interface AxisChartTaskParams extends BaseChartTaskParams {

    /**
     * Chart Type per series. Use only if [](#chartType) is `mixed`.
     * @example: [ABeamer.ChartTypes.bar, ABeamer.ChartTypes.bar, ABeamer.ChartTypes.line]
     */
    chartTypes?: (ChartTypes | string)[];


    /**
     * Defines the X labels with complete information or just as an [](#ExprString).
     * If it's a ExprString, it will create one label for each point.
     * The iterator variable is `v`.
     * If it's an array, it must match the number of points in a series.
     * @example =2012 + v
     * @example { captions: ['A', 'B', 'C', 'D'] }
     */
    labelsX?: ChartLabelsX | ExprString | string[];


    /**
     * Defines the Y labels with complete information or just as an [](#ExprString).
     * If it's a ExprString, it will create one label for each point.
     * The iterator variable is `v`.
     * If it's an array, it must match the tickCount.
     * @example =v/1000 + 'k'
     * @example { captions: ['10', '20', '30', '40'] }
     */
    labelsY?: ChartLabelsY | ExprString | string[];


    // markers
    markers?: ChartMarkers;


    /**
     * x bar length for `bar` charts.
     * If it's zero, it's calculated automatically in order to fill the complete x-space.
     */
    barWidth?: uint | ExprString;


    // points
    pointMaxHeight?: uint | ExprString;


    /**
     * x distance between two data points.
     * If it's zero, it's calculated automatically in order to fill the complete x-space.
     * If the chart includes bars charts it must be big enough to include all the bars.
     */
    pointDistance?: uint | ExprString;


    /**
     * x space between two bars. Used only in `bar` charts.
     */
    seriesSpacing?: uint | ExprString;


    // colors
    /**
     * Colors to be used in case of the data point is negative.
     * At the moment, it only supports `bar` charts.
     */
    negativeFillColors?: string | string[] | string[][];


    xAxis?: ChartLine;
    yAxis?: ChartLine;
    y0Line?: ChartLine;


    // limits
    maxValue?: number | ExprString;
    minValue?: number | ExprString;


    // animation
    pointHeightStart?: number | ExprString;
    deviationStart?: number | ExprString;
    sweepStart?: number | ExprString;
  }



}
