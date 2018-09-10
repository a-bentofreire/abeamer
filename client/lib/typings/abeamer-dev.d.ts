// uuid: 3b50413d-12c3-4a6c-9877-e6ead77f58c5

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------


  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  
  //
  // These are the class interfaces for internal usage only
  // It won't be deployed on the release version
  // and it shouldn't be accessed by plugin creators
  // In theory, all of these class members should be have protected access
  // but due a lack of 'friend class' mechanism in TypeScript, they have
  // public access but both the interfaces as well as the members but all
  // must start with underscore
  //

declare namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Elements
  // ------------------------------------------------------------------------

  /**
   * It simplifies the usage of [](VirtualAnimator) by plugins.
   * In many cases plugins just need to receive the changing property,
   * in order to modify its state.
   * Override `animateProp` to receive the changing property.
   * animateProp isn't called if the property is `uid`.
   */
  export interface SimpleVirtualAnimatorImpl extends SimpleVirtualAnimator {

  }

  /**
   * Base class for all adapters: Element, Scene, Story,
   * and both DOM and virtual.
   */
  export interface _AbstractAdapterImpl extends AbstractAdapter {

  }

  /**
   * Base class for Element adapters both DOM and virtual.
   */
  export interface _ElementAdapterImpl extends ElementAdapter {

    _clearComputerData(): void;
  }

  /**
   * DOM Element adapter.
   * Gets and sets attributes from HTMLElements.
   * Maps the ABeamer animation property names into DOM attributes.
   */
  export interface _DOMElementAdapterImpl extends DOMElementAdapter {

    _clearComputerData(): void;
  }

  /**
   * Virtual Scene adapter.
   * Allows ABeamer to decouple from the details of any virtual scene.
   */
  export interface _SceneAdapterImpl extends SceneAdapter {

  }

  /**
   * DOM Scene and Story adapter.
   * Both of them are similar. No need for 2 separated classes.
   * Gets and sets properties from HTMLElements.
   * Maps the animation property names into DOM attributes.
   */
  export interface _DOMSceneAdapterImpl extends DOMSceneAdapter {

  }

  // ------------------------------------------------------------------------
  //                               Plugin Manager
  // ------------------------------------------------------------------------

  /**
   * Allows 3rd-party to add easings, oscillators, paths, etc.
   */
  export interface _PluginManagerImpl extends PluginManager {

    _plugins: PluginInfo[];
    _locale: string;
  }

  export interface _pElsImpl extends pEls {
    _elementAdapters: ElementAdapter[];
  }

  // ------------------------------------------------------------------------
  //                               Scene
  // ------------------------------------------------------------------------

  export interface _SceneImpl extends Scene {
    _frameInNr: uint;
    _story: _StoryImpl;
    _sceneAdpt: _SceneAdapter;
    _addAnimationCallCount: uint;
    _remove(): void;
    _internalContainsFrame(storyFramePos: int): boolean;
    _setStoryParams(storyFramePos: int,
      storySceneIndex: int): int;
    _internalGotoFrame(framePos: int): void;
    _show(): void;
    _hide(): void;
    /**
     * Prepares the transitions when the rendering process starts
     */
    _setupTransition(): void;


    _internalRenderFrame(framePos: int, dir: DirectionInt,
      isVerbose: boolean, bypassMode: boolean): void;
  }

  // ------------------------------------------------------------------------
  //                               Story
  // ------------------------------------------------------------------------

  export interface _WaitManImpl extends WaitMan {
  }

  /**
   * Implementation of _Story class.
   */
  export interface _StoryImpl extends Story {

    _teleporter: _Teleporter;
    _waitMan: _WaitMan;
    _args: ABeamerArgs;
    /**
     * If true, the input parameters have strict checks and throw errors if fails.
     * If false, ABeamer is more relax and bypasses errors.
     * The server can modify this mode on startup.
     *
     * @default false
     */
    _strictMode: boolean;


    /**
     * Defines the log level. Use `LL_VERBOSE` for debugging.
     * The server can modify this mode.
     */
    _logLevel: uint;


    _isVerbose: boolean;
    _virtualAnimators?: VirtualAnimator[];
    /**
     * Internal and faster version of gotoScene.
     */
    _internalGotoScene(scene: _SceneImpl | undefined): void;


    /**
     * Signals that there was a change in the number of frames.
     * Usually used by `addAnimations`.
     */
    _setFrameCountChanged(): void;


    /**
     * Recomputes the total number of frames as well as other scene parameters
     * associated with frames.
     */
    _calcFrameCount(): void;


    /**
     * Throws exception if is rendering.
     */
    _exceptIfRendering(): void;


    /**
     * This method is called by the server to communicate with the client.
     */
    _internalGetServerMsg(cmd: string, _value: string);


  }

}
