// uuid: 3b50413d-12c3-4a6c-9877-e6ead77f58c5

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------


  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  
  //
  // These are the class interfaces for the end-user and plugin creators
  // Any modification on these interfaces will require an increment in the high number version
  //

declare namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Elements
  // ------------------------------------------------------------------------

  /**
   * Base class for all adapters: Element, Scene, Story,
   * and both DOM and virtual.
   */
  export interface AbstractAdapter {

    isVirtual: boolean;
    getProp(name: PropName, args?: ABeamerArgs): PropValue;
    setProp(name: PropName, value: PropValue, args?: ABeamerArgs): void;
  }

  /**
   * Base class for Element adapters both DOM and virtual.
   */
  export interface ElementAdapter extends AbstractAdapter {

    getId(args?: ABeamerArgs): string;
  }

  /**
   * DOM Element adapter.
   * Gets and sets attributes from HTMLElements.
   * Maps the ABeamer animation property names into DOM attributes.
   */
  export interface DOMElementAdapter extends ElementAdapter {

    htmlElement: HTMLElement;
    compStyle: CSSStyleDeclaration;
    /**
     * Requests the DOM engine the calculated information for CSS property.
     */
    getComputedStyle(): any;


    getProp(propName: PropName, args?: ABeamerArgs): PropValue;
    setProp(propName: PropName, value: PropValue, args?: ABeamerArgs): void;
  }

  /**
   * Virtual Scene adapter.
   * Allows ABeamer to decouple from the details of any virtual scene.
   */
  export interface SceneAdapter extends AbstractAdapter {

    query(selector: string,
      iterator: (element: PElement, index: uint) => void);
  }

  /**
   * DOM Scene and Story adapter.
   * Both of them are similar. No need for 2 separated classes.
   * Gets and sets properties from HTMLElements.
   * Maps the animation property names into DOM attributes.
   */
  export interface DOMSceneAdapter extends SceneAdapter {

    htmlElement: HTMLElement;
    compStyle: CSSStyleDeclaration;
    /**
     * Requests the DOM engine the calculated information for CSS property.
     */
    getComputedStyle(): any;


    getProp(propName: PropName, args?: ABeamerArgs): PropValue;
    setProp(propName: PropName, value: PropValue, args?: ABeamerArgs): void;
    query(selector: string,
      iterator: (element: PElement, index: uint) => void): void;
  }

  // ------------------------------------------------------------------------
  //                               Plugin Manager
  // ------------------------------------------------------------------------

  /**
   * Allows 3rd-party to add easings, oscillators, paths, etc.
   */
  export interface PluginManager {

    addPlugin(pluginInfo: PluginInfo);
    addEasings(easings: [string, EasingFunc][]): void;
    addOscillators(oscillators: [string, OscillatorFunc][]): void;
    addPaths(paths: [string, PathFunc][]): void;
    addTasks(tasks: [string, TaskFunc][]): void;
    addTransitions(transitions: [string, TransitionFunc][]): void;
    addFlyovers(flyovers: [string, FlyoverFunc][]): void;
    addFunctions(functions: [string, ExFunction][]): void;
    addLocalization(localeInfo: Localization);
  }

  export interface pEls {
    /**
     * Wrapper for `scene.addAnimation` with `visible = false`,
     * followed by opacity moving to 1.
     */
    fadeIn(duration?: TimeHandler): pEls;


    /**
     * Wrapper for scene.addAnimation with opacity moving to 0,
     * followed by `visible = false`.
     */
    fadeOut(duration?: TimeHandler): pEls;


    /**
     * Shows all the elements owned by pEls.
     */
    show(): pEls;


    /**
     * Hides all the elements owned by pEls.
     */
    hide(): pEls;


    /**
     * Sets the text of all the elements owned by pEls.
     */
    text(text: string): pEls;


  }

  // ------------------------------------------------------------------------
  //                               Scene
  // ------------------------------------------------------------------------

  export interface Scene {
    name?: string;
    /**
     * Returns scene transition information.
     *
     * @see transitions
     */
    transition: Transition;


    /**
     * Defines the end of the scene pipeline. Usually this value is the
     * same as `frameCount` but for off-sync animations `frameInNr` can have
     * less value than frameCount.
     *
     * @readonly
     */
    readonly frameInNr: uint;


    /**
     * Total number of frames contained the scene.
     *
     * @readonly
     */
    readonly frameCount: uint;


    /**
     * Sum of all the frames from the previous scenes.
     *
     * @readonly
     */
    readonly storyFrameStart: uint;


    /**
     * Zero-based Index of this scene within the list of scenes.
     *
     * @readonly
     */
    readonly storySceneIndex: uint;


    /**
     * Scene id from the DOM element.
     *
     * @readonly
     */
    readonly id: string;


    /**
     * Adds a series of motionless frames defined by duration.
     * This method changes the end of the pipeline (frameInNr).
     */
    addStills(duration: TimeHandler): Scene;


    /**
     * Adds a list of parallel animations to the render pipeline.
     * The animations can start off-sync from each other via Position parameter.
     *
     * @see animations
     */
    addAnimations(animes: Animations): Scene;


    /**
     * Adds a list of serial animations to the render pipeline.
     * This is the same as: `serialAnimes.forEach(anime => addAnimations(anime))`
     * Use this if you want to load all animations from an external file.
     */
    addSerialAnimations(serialAnimes: Animations[]): Scene;


    /**
     * Used only task plugin creators.
     */
    getElementAdapters(selector: ElSelectorHandler): ElementAdapter[];


    /**
     * Creates a pEls from the selectors.
     */
    getPEls(selector: ElSelector): pEls;


    /**
     * Adds `visible = true` to the pipeline.
     */
    pElsShow(selector: ElSelector): pEls;


    /**
     * Adds `visible = false` to the pipeline.
     */
    pElsHide(selector: ElSelector): pEls;


    /**
     * Wrapper for `addAnimation` with `visible = false`,
     * followed by opacity moving to 1.
     */
    pElsFadeIn(selector: ElSelector, duration?: TimeHandler): pEls;


    /**
     * Wrapper for `addAnimation` with opacity moving to 0,
     * followed by `visible = false`
     */
    pElsFadeOut(selector: ElSelector, duration?: TimeHandler): pEls;


  }

  // ------------------------------------------------------------------------
  //                               Story
  // ------------------------------------------------------------------------

  export interface WaitMan {
    funcs: _WaitFunc[];
    pos: uint;
    addWaitFunc(func: WaitFunc, params: AnyParams): void;
  }

  /**
   * Implementation of _Story class.
   */
  export interface Story {

    /**
     * Frames per second.
     * All the time values is converted into frames using this value.
     * Defined during the call to `createStory`.
     *
     * @readonly
     */
    readonly fps: uint;


    /**
     * Default unit used when input time values are used in numeric forms.
     * Supports minutes, seconds, milliseconds and frames.
     *   `TimeUnit.f = 0;`
     *   `TimeUnit.ms = 1;`
     *   `TimeUnit.s = 2;`
     *   `TimeUnit.m = 3;`
     */
    defaultUnit: TimeUnit;


    /**
     * True if it's running a supporting server program for frame storage.
     *
     * @readonly
     */
    readonly hasServer: boolean;


    /**
     * The name of the server.
     * The server will assign this property value.
     *
     * @readonly
     */
    readonly serverName: string;


    /**
     * Provides information about the running server.
     */
    serverFeatures: ServerFeatures;


    /**
     * Numerical value of the frame width in pixels.
     *
     * @readonly
     */
    readonly metadata: StoryMetadata;


    /**
     * Numerical value of the frame width in pixels.
     *
     * @readonly
     */
    readonly width: uint;


    /**
     * Numerical value of the frame height in pixels.
     *
     * @readonly
     */
    readonly height: uint;


    /**
     * Total number of frames from all the scenes.
     *
     * @readonly
     */
    readonly frameCount: uint;


    /**
     * Render direction. 1 for forward, -1 for backwards.
     * Defined during the call to `story.render`.
     *
     * @readonly
     */
    readonly renderDir: DirectionInt;


    /**
     * The number of the last frame to be rendered within the story.
     * Defined during the call to `story.render`.
     * This value doesn't changes during the rendering process.
     *
     * @readonly
     */
    readonly renderFrameEnd: uint;


    /**
     * The number of the current frame being rendered.
     * Defined during the call to `story.render`.
     * This value changes during the rendering process.
     *
     * @readonly
     */
    readonly renderFramePos: uint;


    /**
     * The number of the current frame being rendered.
     * Defined during the call to `story.render`.
     * This value doesn't changes during the rendering process.
     *
     * @readonly
     */
    readonly renderFrameCount: uint;


    /**
     * True if the rendering has started.
     * Use `finishRender` to abort the rendering process.
     *
     * @readonly
     */
    readonly isRendering: boolean;


    /**
     * True if it's teleporting.
     *
     * @readonly
     * @type {boolean}
     * @memberof Story
     */
    readonly isTeleporting: boolean;


    strictMode: boolean;
    logLevel: uint;
    isVerbose: boolean;
    /**
     * List of the scenes.
     *
     * @readonly
     */
    readonly scenes: Scene[];


    /**
     * Current active and visible scene.
     * Valid both for adding animations and rendering.
     * Use `gotoScene` to change this value.
     *
     * @readonly
     */
    readonly curScene: Scene | undefined;


    /**
     * Allows flyovers to find elements on the document body or
     * in the virtual world.
     */
    storyAdapter: SceneAdapter;


    /**
     * If true, it terminates the server
     * when the render call finishes or if it's aborted.
     * For a serverless execution, it has no effect.
     *
     * @default true
     */
    toExitOnRenderFinished: boolean;


    /**
     * Event triggered when render finished the rendering process.
     * **EXPERIMENTAL** The behavior can changed or be deprecated.
     */
    onRenderFinished?: (args?: ABeamerArgs) => void;


    /**
     * Event triggered by server, stating that it's ready to receive frames.
     * A server is usually a headless capture program such as puppeteer.
     * If the animation is running without server, this event is never fired.
     */
    onServerReady?: (args?: ABeamerArgs) => void;


    /**
     * Event triggered before a frame is rendered.
     */
    onBeforeRenderFrame?: (args?: ABeamerArgs) => void;


    /**
     * Event triggered after a frame is rendered.
     */
    onAfterRenderFrame?: (args?: ABeamerArgs) => void;


    /**
     * Event triggered during the rendering process after a frame is rendered
     * and is ready to move to following frame.
     */
    onNextFrame?: (args?: ABeamerArgs) => void;


    /**
     * Maps Ids into Virtual Elements
     * Used only in non-DOM elements such as WebGL elements.
     *
     * @param id  virtual element Id without '%'
     */
    onGetVirtualElement?: (id: string, args?: ABeamerArgs) => VirtualElement;


    virtualAnimators?: VirtualAnimator[];
    /**
     * Adds scenes defined in the html by `.abeamer-scene` class.
     * These classes are added automatically during Story constructor.
     * Add only after a `story.reset()`.
     */
    addDefaultScenes(): void;


    /**
     * Adds a scene to the story.
     * HTML elements with abeamer-scene class are added automatically.
     *
     * @param sceneSelector DOM selector, JQuery object or Virtual Scene
     * @returns A pointer to newly created scene
     */
    addScene(sceneSelector: SceneSelector): Scene;


    /**
     * Removes a frame from scene list and removes the its rendering pipeline
     * but its DOM elements aren't removed.
     */
    removeScene(scene: Scene): void;


    /**
     * Rewinds the animation to the start.
     * Deletes all the scenes and frames from the story.
     * The DOM is left untouched.
     */
    clear(): void;


    /**
     * Adds a list scene/serial/parallel animations.
     * In essence, it represents the complete storyline.
     * Use this method to load the whole storyline from an external file.
     * Otherwise is preferable to add animation scene by scene.
     */
    addStoryAnimations(sceneSerialAnimes: Animations[][]): void;


    /**
     * Adds a list of serial/parallel animations per scene Id.
     * It requires that each scene has defined the id (DOM attribute).
     * It bypasses invalid scene ids.
     */
    addStoryAnimationsBySceneId(sceneSerialAnimes:
      { [sceneId: string]: Animation[][] }): void;


    /**
     * Adds a flyover, which is a function executed on every render step.
     *
     * @see flyovers
     */
    addFlyover(handler: FlyoverHandler, params?: FlyoverParams): void;


    /**
     * Changes the active and visible to a different scene.
     */
    gotoScene(scene: Scene): void;


    findSceneByName(sceneName: string): Scene;
    /**
     * Rewinds the animation to the start.
     */
    rewind(): void;


    /**
     * Moves the current render Position when is not rendering by consuming the pipeline.
     * Use this only if you need to compute parameters at certain position.
     * When render starts
     */
    gotoFrame(framePos: int): void;


    /**
     * Returns the animations, html, CSS as an object.
     * Use only if `isTeleporting = true`.
     * Send this information via Ajax to the remote server.
     * Due CORS, it requires a live server to access CSS information.
     * Set frameOpts, if you need segment rendering.
     * Set isPretty = true, to test only, since this mode will return a formatted output but bigger in size.
     */
    getStoryToTeleport(frameOpts?: RenderFrameOptions,
      isPretty?: boolean): string;


    /**
     * Stores the complete story on a file in the disk.
     * Use this method only for testing.
     * This method requires that:
     *
     * 1. Is on teleporting mode `isTeleporting === true`
     * 2. The server agent. `abeamer render ...`
     *
     * Use this method instead of `getStoryToTeleport`.
     */
    teleport(frameOpts?: RenderFrameOptions, isPretty?: boolean);


    /**
     * Returns the play speed that best matches the fps.
     */
    bestPlaySpeed: () => uint;


    /**
     * Starts the Rendering process.
     * It can render the whole storyline or just a segment.
     * Forward and backward rending is supported.
     * If it has a server, such as headless webpage capture program, it will
     * render a frame, and send a message to the server to store it on the disk.
     * If it's running on the browser, it will render and wait `playSpeedMs` time.
     *
     * @param playSpeedMs Play speed in milliseconds,
     * ignored on server mode. ABeamer doesn't guarantee the exact timing.
     * If it's undefined, it will play at full speed.
     */
    render(playSpeedMs?: uint | undefined, frameOpts?: RenderFrameOptions): void;


    /**
     * Aborts the rendering process.
     */
    finishRender(): void;


    /**
     * Terminates the server in case is a headless webpage capture program.
     * In other cases, it has no effect.
     */
    exit(): void;


    /**
     * Formats a log using a format supported by exact test framework.
     * This is mostly used internally for testing, but it's publicly available.
     *
     * @param params list of [name, value]
     */
    logFrmt(tag: string, params: (string | number)[][], logType?: LogType): void;


    /**
     * If a server is present and supports logging,
     * it sends a log message to server otherwise it sends to the browser console.
     */
    logMsg(msg: string): void;


    /**
     * If a server is present and supports logging,
     * it sends a warn message to server otherwise it sends to the browser console.
     */
    logWarn(msg: string): void;


    /**
     * If a server is present and supports logging,
     * it sends a error message to server otherwise it sends to the browser console.
     */
    logError(msg: string): void;


    getElementAdapters(selector: ElSelectorHandler): ElementAdapter[];
  }

}
