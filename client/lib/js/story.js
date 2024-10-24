"use strict";
var ABeamer;
((ABeamer2) => {
  class _WaitMan {
    constructor() {
      this.funcs = [];
      this.pos = 0;
    }
    addWaitFunc(func, params) {
      this.funcs.push({ func, params });
    }
  }
  ABeamer2._WaitMan = _WaitMan;
  class _Story {
    /**
     * Sets up the Story and adds the Default Scenes.
     */
    constructor(cfg, createParams) {
      // protected
      this._isServerReady = false;
      this._width = 0;
      this._height = 0;
      this._frameCount = 0;
      this._frameCountChanged = false;
      this._renderFramePos = 0;
      this._renderDir = 1;
      this._renderFrameEnd = 0;
      this._renderFrameCount = 0;
      this._renderStage = 0;
      this._renderPlaySpeed = 0;
      this._isRendering = false;
      this._scenes = [];
      this._curScene = void 0;
      this._wkFlyovers = [];
      this._queueRenders = [];
      this._metadata = {};
      // scene access
      this._args = {
        renderNr: 0,
        stage: AS_UNKNOWN,
        vars: _vars
      };
      /**
       * Default unit used when input time values are used in numeric forms.
       * Supports minutes, seconds, milliseconds and frames.
       *   `TimeUnit.f = 0;`
       *   `TimeUnit.ms = 1;`
       *   `TimeUnit.s = 2;`
       *   `TimeUnit.m = 3;`
       */
      this.defaultUnit = TimeUnit.f;
      /**
       * True if it's running a supporting server program for frame storage.
       *
       * #end-user @readonly
       */
      this.hasServer = false;
      /**
       * If true, the input parameters have strict checks and throw errors if fails.
       * If false, ABeamer is more relax and bypasses errors.
       * The server can modify this mode on startup.
       *
       * @default false
       */
      this._strictMode = false;
      /**
       * Defines the log level. Use `LL_VERBOSE` for debugging.
       * The server can modify this mode.
       */
      this._logLevel = 0;
      /**
       * If true, it terminates the server
       * when the render call finishes or if it's aborted.
       * For a serverless execution, it has no effect.
       *
       * @default true
       */
      this.toExitOnRenderFinished = true;
      this._virtualAnimators = [];
      /**
       * Internal map from selectors to VirtualAnimators.
       * Each animator must have a unique selector, but future versions
       * might support different animators have the selector.
       */
      this._virtualAnimatorMap = {};
      /**
       * Returns the play speed that best matches the fps.
       */
      this.bestPlaySpeed = () => Math.abs(1e3 / this.fps);
      const urlParams = window.location.search || "";
      const args = this._args;
      const self = this;
      this.logLevel = createParams.logLevel || LL_SILENT;
      if (urlParams) {
        urlParams.replace(new RegExp(_SRV_CNT.LOG_LEVEL_SUFFIX + "(\\d+)"), (_all, p1) => {
          this.logLevel = parseInt(p1);
          return "";
        });
      }
      _initBrowser(args);
      this._waitMan = new _WaitMan();
      args.waitMan = this._waitMan;
      this.storyAdapter = createParams.storyAdapter || new _DOMSceneAdapter(".abeamer-story");
      cfg.fps = cfg.fps || this.storyAdapter.getProp("fps", args);
      throwIfI8n(!isPositiveNatural(cfg.fps), Msgs.MustNatPositive, { p: "fps" });
      _vars.fps = cfg.fps;
      function setDim(srvPropPrefix, cfgValue, propName) {
        let res = cfgValue || self.storyAdapter.getProp(propName, args);
        if (urlParams) {
          urlParams.replace(new RegExp(srvPropPrefix + "(\\d+)"), (_all, p1) => {
            const qsValue = parseInt(p1);
            res = qsValue || res;
            return "";
          });
        }
        throwIfI8n(!isPositiveNatural(res), Msgs.MustNatPositive, { p: propName });
        self.storyAdapter.setProp(propName, res, args);
        return res;
      }
      this._width = cfg.width = setDim(_SRV_CNT.WIDTH_SUFFIX, cfg.width, "frame-width");
      _vars.frameWidth = cfg.width;
      this._height = cfg.height = setDim(_SRV_CNT.HEIGHT_SUFFIX, cfg.height, "frame-height");
      _vars.frameHeight = cfg.height;
      this.storyAdapter.setProp(
        "clip-path",
        `polygon(0 0, 0 ${cfg.height}px, ${cfg.width}px ${cfg.height}px, ${cfg.width}px 0px)`,
        args
      );
      args.story = this;
      this.fps = cfg.fps;
      this._isTeleporting = createParams.toTeleport || false;
      if (urlParams) {
        urlParams.replace(new RegExp(_SRV_CNT.TELEPORT_SUFFIX + "(\\w+)"), (_all, p1) => {
          this._isTeleporting = p1 === "true";
          return "";
        });
        urlParams.replace(new RegExp(_SRV_CNT.SERVER_SUFFIX + "(\\w+)"), (_all, p1) => {
          this.hasServer = true;
          this.storyAdapter.setProp("class", "has-server", args);
          this.serverName = p1;
          this.serverFeatures = _setServer(this.serverName);
          return "";
        });
        urlParams.replace(new RegExp(_SRV_CNT.RENDER_VAR_SUFFIX + "([^&]+)", "g"), (_all, p1) => {
          p1 = decodeURIComponent(p1);
          let [, key, value] = p1.match(/^([^=]+)=(.*)$/) || ["", "", ""];
          if (!key) {
            throw `var ${p1} requires the key field`;
          }
          key = key.replace(/-(\w)/g, (_all2, p) => p.toUpperCase());
          args.vars[key] = value;
          return "";
        });
      }
      args.hasServer = this.hasServer;
      args.isTeleporting = this._isTeleporting;
      args.vars.isTeleporting = args.isTeleporting;
      this._teleporter = new _Teleporter(this, cfg, this._isTeleporting);
      if (this._isTeleporting && createParams.toStartTeleporting !== false) {
        this.startTeleporting();
      }
      if (this._isVerbose) {
        this.logFrmt("story", [
          ["fps", this.fps],
          ["urlParams", urlParams],
          ["hasServer", this.hasServer.toString()],
          ["hasStory", this._teleporter.hasStory.toString()],
          ["frame-width", this._width],
          ["frame-height", this._height],
          ["browser.isMsIE", browser.isMsIE.toString()],
          ["browser.vendorPrefix", browser.vendorPrefix],
          ["toTeleport", this._isTeleporting.toString()]
        ]);
      }
      if (this._teleporter.hasStory) {
        this._teleporter._rebuildStory();
      } else {
        if (!createParams.dontAddDefaultScenes) {
          this.addDefaultScenes();
        }
      }
    }
    /**
     * Numerical value of the frame width in pixels.
     *
     * #end-user @readonly
     */
    get metadata() {
      return this._metadata;
    }
    /**
     * Numerical value of the frame width in pixels.
     *
     * #end-user @readonly
     */
    get width() {
      return this._width;
    }
    /**
     * Numerical value of the frame height in pixels.
     *
     * #end-user @readonly
     */
    get height() {
      return this._height;
    }
    /**
     * Total number of frames from all the scenes.
     *
     * #end-user @readonly
     */
    get frameCount() {
      this._calcFrameCount();
      return this._frameCount;
    }
    /**
     * Render direction. 1 for forward, -1 for backwards.
     * Defined during the call to `story.render`.
     *
     * #end-user @readonly
     */
    get renderDir() {
      return this._renderDir;
    }
    /**
     * The number of the last frame to be rendered within the story.
     * Defined during the call to `story.render`.
     * This value doesn't changes during the rendering process.
     *
     * #end-user @readonly
     */
    get renderFrameEnd() {
      return this._renderFrameEnd;
    }
    /**
     * The number of the current frame being rendered.
     * Defined during the call to `story.render`.
     * This value changes during the rendering process.
     *
     * #end-user @readonly
     */
    get renderFramePos() {
      return this._renderFramePos;
    }
    /**
     * The number of the current frame being rendered.
     * Defined during the call to `story.render`.
     * This value doesn't changes during the rendering process.
     *
     * #end-user @readonly
     */
    get renderFrameCount() {
      return this._renderFrameCount;
    }
    /**
     * True if the rendering has started.
     * Use `finishRender` to abort the rendering process.
     *
     * #end-user @readonly
     */
    get isRendering() {
      return this._isRendering;
    }
    /**
     * True if it's teleporting.
     *
     * #end-user @readonly
     */
    get isTeleporting() {
      return this._isTeleporting;
    }
    /**
     * Returns ABeamerArgs.
     * This should be used only in specific cases such the access to --var.
     * In most cases, this property is passed as an argument to plugins and callbacks.
     *
     * #end-user @readonly
     */
    get args() {
      return this._args;
    }
    get strictMode() {
      return this._strictMode;
    }
    set strictMode(newStrictMode) {
      this._strictMode = newStrictMode;
      this._args.isStrict = newStrictMode;
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(newLogLevel) {
      this._logLevel = newLogLevel;
      this._isVerbose = newLogLevel >= LL_VERBOSE;
      this._args.isVerbose = this._isVerbose;
    }
    get isVerbose() {
      return this._isVerbose;
    }
    /**
     * List of the scenes.
     *
     * #end-user @readonly
     */
    get scenes() {
      return this._scenes;
    }
    /**
     * Current active and visible scene.
     * Valid both for adding animations and rendering.
     * Use `gotoScene` to change this value.
     *
     * #end-user @readonly
     */
    get curScene() {
      return this._curScene;
    }
    /**
     * @deprecated Use addVirtualAnimator instead.
     * The direct access to virtualAnimators in future versions will likely be disabled
     *
     */
    get virtualAnimators() {
      console.log(`virtualAnimators has been deprecated, use addVirtualAnimator`);
      return this._virtualAnimators;
    }
    // ------------------------------------------------------------------------
    //                               Virtual Animators
    // ------------------------------------------------------------------------
    /**
     * Adds a [](VirtualAnimator) to the story.
     * Use [story.removeVirtualAnimator](#storyremovevirtualanimator) to take it from the story.
     */
    addVirtualAnimator(animator) {
      const selector = animator.selector;
      if (!selector) {
        throwI8n(Msgs.NoEmptySelector);
      }
      if (this._virtualAnimatorMap[selector]) {
        throwErr(`The selector must be unique`);
      }
      this._virtualAnimators.push(animator);
      this._virtualAnimatorMap[selector] = animator;
    }
    /**
     * Removes a [](VirtualAnimator) to the story.
     * Use [story.addVirtualAnimator](#storyaddvirtualanimator) to add it to the story.
     */
    removeVirtualAnimator(animator) {
      const index = this._virtualAnimators.indexOf(animator);
      if (index !== -1) {
        this._virtualAnimators.splice(index, 1);
        delete this._virtualAnimatorMap[animator.selector];
      }
    }
    // ------------------------------------------------------------------------
    //                               Scenes
    // ------------------------------------------------------------------------
    /**
     * Adds scenes defined in the html by `.abeamer-scene` class.
     * These classes are added automatically during Story constructor.
     * Add only after a `story.reset()`.
     */
    addDefaultScenes() {
      const story = this;
      $(".abeamer-scene").each((_index, htmlElement) => {
        story.addScene($(htmlElement));
      });
      if (this._scenes.length) {
        this.gotoScene(this._scenes[0]);
      }
    }
    /**
     * Adds a scene to the story.
     * HTML elements with abeamer-scene class are added automatically.
     *
     * @param sceneSelector DOM selector, JQuery object or Virtual Scene
     * @returns A pointer to newly created scene
     */
    addScene(sceneSelector) {
      const scene = new _Scene(
        this,
        sceneSelector,
        this._scenes.length ? this._scenes[this._scenes.length - 1] : void 0
      );
      this._scenes.push(scene);
      this._setFrameCountChanged();
      if (this._teleporter.active) {
        this._teleporter._addScene();
      }
      return scene;
    }
    /**
     * Removes a frame from scene list and removes the its rendering pipeline
     * but its DOM elements aren't removed.
     */
    removeScene(scene) {
      this._exceptIfRendering();
      if (this._curScene === scene) {
        scene._hide();
        this._curScene = void 0;
      }
      scene._remove();
      this._scenes.splice(scene.storySceneIndex, 1);
    }
    /**
     * Rewinds the animation to the start.
     * Deletes all the scenes and frames from the story.
     * The DOM is left untouched.
     */
    clear() {
      this._exceptIfRendering();
      this.rewind();
      this._internalGotoScene(void 0);
      this.scenes.length = 0;
      this._renderFramePos = 0;
      this._frameCount = 0;
    }
    // ------------------------------------------------------------------------
    //                               Animations
    // ------------------------------------------------------------------------
    /**
     * Adds a list scene/serial/parallel animations.
     * In essence, it represents the complete storyline.
     * Use this method to load the whole storyline from an external file.
     * Otherwise is preferable to add animation scene by scene.
     */
    addStoryAnimations(sceneSerialAnimes) {
      sceneSerialAnimes.forEach((sceneSerialAnime, index) => {
        this._scenes[index].addSerialAnimations(sceneSerialAnime);
      });
    }
    /**
     * Adds a list of serial/parallel animations per scene Id.
     * It requires that each scene has defined the id (DOM attribute).
     * It bypasses invalid scene ids.
     */
    addStoryAnimationsBySceneId(sceneSerialAnimes) {
      const ids = {};
      this._scenes.forEach((scene) => {
        ids[scene.id] = scene;
      });
      Object.keys(sceneSerialAnimes).forEach((id) => {
        const scene = ids[id];
        if (scene) {
          scene.addSerialAnimations(sceneSerialAnimes[id]);
        }
      });
    }
    // ------------------------------------------------------------------------
    //                               Flyovers
    // ------------------------------------------------------------------------
    /**
     * Adds a flyover, which is a function executed on every render step.
     *
     * @see flyovers
     */
    addFlyover(handler, params) {
      const wkFlyover = _buildWorkFlyover(handler, params, false, this._args);
      if (this._isTeleporting && this._args.stage !== AS_ADD_ANIMATION && this._scenes.length) {
        const scene = this._scenes[0];
        scene.addAnimations([{
          tasks: [
            {
              handler: "add-flyover",
              params: {
                handler: wkFlyover.name,
                params: wkFlyover.params
              }
            }
          ]
        }]);
      } else {
        wkFlyover.func(wkFlyover, wkFlyover.params, TS_INIT, this._args);
        this._wkFlyovers.push(wkFlyover);
      }
    }
    // ------------------------------------------------------------------------
    //                               Scene Methods
    // ------------------------------------------------------------------------
    /**
     * Changes the active and visible to a different scene.
     */
    gotoScene(scene) {
      if (scene === this._curScene) {
        return;
      }
      this._exceptIfRendering();
      this._calcFrameCount();
      this._internalGotoScene(scene);
    }
    /**
     * Internal and faster version of gotoScene.
     */
    _internalGotoScene(scene) {
      const curScene = this._curScene;
      if (curScene) {
        curScene._hide();
      }
      this._curScene = scene;
      if (scene) {
        scene._show();
      }
      this._args.scene = scene;
    }
    /** Returns the Scene Object which has `sceneName`, undefined otherwise */
    findSceneByName(sceneName) {
      return this._scenes.find((scene) => scene.name === sceneName);
    }
    // ------------------------------------------------------------------------
    //                               Frame Methods
    // ------------------------------------------------------------------------
    /**
     * Signals that there was a change in the number of frames.
     * Usually used by `addAnimations`.
     */
    _setFrameCountChanged() {
      this._frameCountChanged = true;
    }
    /**
     * Recomputes the total number of frames as well as other scene parameters
     * associated with frames.
     */
    _calcFrameCount() {
      if (!this._frameCountChanged) {
        return;
      }
      let frameCount = 0;
      this._scenes.forEach((scene, index) => {
        frameCount += scene._setStoryParams(frameCount, index);
      });
      this._frameCountChanged = false;
      this._frameCount = frameCount;
    }
    /**
     * Rewinds the animation to the start.
     */
    rewind() {
      this.gotoFrame(0);
    }
    /**
     * Moves the current render Position when is not rendering by consuming the pipeline.
     * Use this only if you need to compute parameters at certain position.
     * When render starts
     */
    gotoFrame(framePos) {
      this._exceptIfRendering();
      this._calcFrameCount();
      if (framePos < 0 || framePos >= this._frameCount) {
        throwI8n(Msgs.OutOfScope, { p: Msgs.pos });
      }
      this._internalGotoFrame(framePos);
    }
    _internalGotoFrame(framePos) {
      let _curScene = this._curScene;
      if (!_curScene || !_curScene._internalContainsFrame(framePos)) {
        _curScene = this._scenes.find((scene) => scene._internalContainsFrame(framePos));
        this._internalGotoScene(_curScene);
      }
      _curScene._internalGotoFrame(framePos - _curScene.storyFrameStart);
    }
    // ------------------------------------------------------------------------
    //                               Transitions
    // ------------------------------------------------------------------------
    _setupTransitions() {
      this._scenes.forEach((scene) => {
        scene._setupTransition();
      });
    }
    // ------------------------------------------------------------------------
    //                               Teleporting
    // ------------------------------------------------------------------------
    /**
     * Returns the animations, html, CSS as an object.
     * Use only if `isTeleporting = true`.
     * Send this information via Ajax to the remote server.
     * Due CORS, it requires a live server to access CSS information.
     * Set frameOpts, if you need segment rendering.
     * Set isPretty = true, to test only, since this mode will return a formatted output but bigger in size.
     */
    getStoryToTeleport(frameOpts, isPretty) {
      const cfg = this.getStoryToTeleportAsConfig(frameOpts);
      return cfg !== void 0 ? JSON.stringify(cfg, void 0, isPretty ? 2 : void 0) : "";
    }
    /**
     * Same as `getStoryToTeleport()` but it returns as `StoryConfig` object.
     * Use this function instead of getStoryToTeleport, if you need to
     * add extra fields.
     * Modifying the content of `config.abeamer` is forbidden for 3rd-party
     * remote server rendering.
     */
    getStoryToTeleportAsConfig(frameOpts) {
      if (!this._isTeleporting) {
        throw `getStoryToTeleport requires to be in teleporting mode`;
      }
      if (!this._calcRenderFrameOptions(frameOpts)) {
        return void 0;
      }
      return this._teleporter._getStoryToTeleportAsConfig();
    }
    /**
     * Stores the complete story on a file in the disk.
     * Use this method only for testing.
     * This method requires that:
     *
     * 1. Is on teleporting mode `isTeleporting === true`
     * 2. The render server agent. `abeamer render ...`
     *
     * Use this method instead of `getStoryToTeleport`.
     */
    teleport(frameOpts, isPretty) {
      if (!this.hasServer) {
        console.warn(`To teleport it requires the render server agent to be running`);
      }
      this._sendCmd(_SRV_CNT.MSG_TELEPORT, this.getStoryToTeleport(frameOpts, isPretty));
    }
    /**
     * Use this method only if you have created the story with `toTeleport = true`
     * and `toStartTeleporting = false`, because you need to inject
     * html/css code into the page before the teleporting process starts.
     * Otherwise, you won't need to call this method since it's called automatically
     * if teleporting a story.
     */
    startTeleporting() {
      if (this._isTeleporting) {
        this._teleporter.createSnapshot();
      }
    }
    // ------------------------------------------------------------------------
    //                               Render
    // ------------------------------------------------------------------------
    /**
     * Throws exception if is rendering.
     */
    _exceptIfRendering() {
      if (this._isRendering) {
        throw "Render is still running";
      }
    }
    _getSceneByHandler(scene) {
      switch (typeof scene) {
        case "object":
          return scene;
        case "string":
          const outScene = this.findSceneByName(scene);
          throwIfI8n(!outScene, Msgs.Unknown, { p: scene });
          return outScene;
        case "number":
          const sceneIdx = scene;
          if (this._strictMode) {
            throwIfI8n(
              isNotNegativeNatural(sceneIdx),
              Msgs.MustNatNotNegative,
              { p: sceneIdx }
            );
          }
          if (sceneIdx < 0 || sceneIdx >= this._scenes.length) {
            throwI8n(Msgs.OutOfScope, { p: Msgs.pos });
          }
          return this._scenes[sceneIdx];
      }
    }
    /**
     * Computes the render properties from the user frame params.
     */
    _calcRenderFrameOptions(frameOpts) {
      frameOpts = frameOpts || {};
      this._calcFrameCount();
      let renderFramePos = parseTimeHandler(frameOpts.renderPos, this._args, 0, 0);
      let renderFrameCount = parseTimeHandler(
        frameOpts.renderCount,
        this._args,
        this._frameCount,
        this._frameCount
      );
      if (frameOpts.startScene !== void 0) {
        const startScene = this._getSceneByHandler(frameOpts.startScene);
        renderFramePos += startScene.storyFrameStart;
        if (frameOpts.renderCount === void 0) {
          renderFrameCount -= startScene.storyFrameStart;
        }
      }
      if (frameOpts.endScene !== void 0) {
        const endScene = this._getSceneByHandler(frameOpts.endScene);
        if (frameOpts.renderCount === void 0) {
          renderFrameCount = endScene.storyFrameStart + endScene.frameCount - renderFramePos;
        }
      }
      if (!renderFrameCount) {
        return false;
      }
      const renderFrameDir = renderFrameCount > 0 ? 1 : -1;
      if (renderFrameDir === -1) {
        throwErr("Reverse render isn't supported yet");
      }
      const renderFrameEnd = renderFrameCount > 0 ? renderFramePos + renderFrameCount - 1 : renderFramePos + renderFrameCount;
      renderFrameCount = Math.abs(renderFrameCount);
      if (renderFramePos < 0 || renderFramePos >= this._frameCount) {
        throw "Render Pos is out of scope";
      }
      if (renderFrameEnd < -1 || renderFrameEnd > this._frameCount) {
        throw "Render Count is out of scope";
      }
      this._renderFramePos = renderFramePos;
      this._renderDir = renderFrameDir;
      this._renderFrameEnd = renderFrameEnd;
      this._renderFrameCount = renderFrameCount;
      return true;
    }
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
    render(playSpeedMs, frameOpts) {
      if (this.hasServer && this._isTeleporting) {
        this.teleport(frameOpts, true);
        this.exit();
        return;
      }
      if (this._isRendering) {
        frameOpts = frameOpts || {};
        frameOpts.playSpeedMs = playSpeedMs;
        this._queueRenders.push(frameOpts);
        return;
      }
      this._internalRender(playSpeedMs, frameOpts);
    }
    _internalRender(playSpeedMs, frameOpts) {
      this._args.stage = AS_RENDERING;
      this._isRendering = true;
      if (!this._calcRenderFrameOptions(this._teleporter._fillFrameOpts(frameOpts))) {
        this.finishRender();
        return;
      }
      this._renderStage = 0;
      this._waitMan.funcs = [];
      this._waitMan.pos = 0;
      this._renderPlaySpeed = !this.hasServer && playSpeedMs !== void 0 && playSpeedMs > 0 ? playSpeedMs : 0;
      this._setupTransitions();
      this.storyAdapter.setProp("visible", true, this._args);
      if (!this.hasServer) {
        this._renderLoop();
      } else {
        this._sendCmd(_SRV_CNT.MSG_READY);
      }
    }
    /**
     * Aborts the rendering process.
     */
    finishRender() {
      if (this._isRendering) {
        this._isRendering = false;
        if (this._renderTimer) {
          window.clearTimeout(this._renderTimer);
          this._renderTimer = void 0;
        }
        if (this._queueRenders.length) {
          const queuedRender = this._queueRenders[0];
          this._queueRenders.splice(0, 1);
          this._internalRender(queuedRender.playSpeedMs, queuedRender);
          return;
        }
        this._args.stage = AS_UNKNOWN;
        this._sendCmd(_SRV_CNT.MSG_RENDER_FINISHED);
        if (this.toExitOnRenderFinished) {
          this.exit();
        }
      }
    }
    /**
     * Renders each frame at a pre-defined speed.
     */
    _renderLoop() {
      let stage = this._renderStage;
      const waitMan = this._waitMan;
      while (true) {
        if (!this._isRendering) {
          return;
        }
        if (stage && waitMan.funcs.length > waitMan.pos) {
          this._renderStage = stage;
          const func = waitMan.funcs[waitMan.pos];
          waitMan.pos++;
          if (waitMan.funcs.length === waitMan.pos) {
            waitMan.pos = 0;
            waitMan.funcs = [];
          }
          func.func(this._args, func.params, () => {
            this._renderLoop();
          });
          return;
        }
        switch (stage) {
          case 0:
            stage++;
            this._renderTimeStamp = /* @__PURE__ */ new Date();
            break;
          case 1:
            stage += 2;
            this._internalGotoFrame(this._renderFramePos);
            break;
          case 3:
            stage++;
            this._wkFlyovers.forEach((wkFlyover) => {
              wkFlyover.func(
                wkFlyover,
                wkFlyover.params,
                TS_ANIME_LOOP,
                this._args
              );
            });
            break;
          case 4:
            stage++;
            if (this.onBeforeRenderFrame) {
              this.onBeforeRenderFrame(this._args);
            }
            break;
          case 5:
            stage++;
            this._curScene._internalRenderFrame(
              this._renderFramePos - this._curScene.storyFrameStart,
              this._renderDir,
              this._isVerbose,
              false
            );
            break;
          case 6:
            if (this.hasServer) {
              stage++;
            } else {
              stage += 2;
              if (this.onAfterRenderFrame) {
                this.onAfterRenderFrame(this._args);
              }
            }
            this._renderStage = stage;
            const newDate = /* @__PURE__ */ new Date();
            const elapsed = newDate - this._renderTimeStamp;
            const waitTime = Math.max(this._renderPlaySpeed - Math.floor(
              elapsed
              /* / 1000 */
            ), 1);
            this._renderTimer = window.setTimeout(() => {
              if (!this.hasServer) {
                this._renderLoop();
              } else {
                this._sendCmd(_SRV_CNT.MSG_RENDER);
              }
            }, waitTime);
            return;
          case 7:
            stage++;
            if (this.onAfterRenderFrame) {
              this.onAfterRenderFrame(this._args);
            }
            break;
          case 8:
            stage = 0;
            if (this._renderFramePos !== this._renderFrameEnd) {
              this._renderFramePos += this._renderDir;
              if (this.onNextFrame) {
                this.onNextFrame(this._args);
              }
            } else {
              this._renderStage = -1;
              this.finishRender();
              return;
            }
            break;
        }
      }
    }
    // ------------------------------------------------------------------------
    //                               Communicate with the server
    // ------------------------------------------------------------------------
    _sendCmd(cmd, value) {
      console.log(_SRV_CNT.MESSAGE_PREFIX + cmd + (value ? _SRV_CNT.CMD_VALUE_SEP + value : ""));
    }
    /**
     * Terminates the server in case is a headless webpage capture program.
     * In other cases, it has no effect.
     */
    exit() {
      this._sendCmd(_SRV_CNT.MSG_EXIT);
    }
    /**
     * Formats a log using a format supported by exact test framework.
     * This is mostly used internally for testing, but it's publicly available.
     *
     * @param params list of [name, value]
     */
    logFrmt(tag, params, logType) {
      const msg = `${tag}:` + params.map((param) => `${param[0]}=_[${param[1]}]_`).join(" ");
      switch (logType) {
        case LT_WARN:
          this.logWarn(msg);
          break;
        case LT_ERROR:
          this.logError(msg);
          break;
        default:
          this.logMsg(msg);
      }
    }
    /**
     * If a server is present and supports logging,
     * it sends a log message to server otherwise it sends to the browser console.
     */
    logMsg(msg) {
      if (this.hasServer && this.serverFeatures.hasLogging) {
        this._sendCmd(_SRV_CNT.MSG_LOG_MSG, msg);
      } else {
        console.log(msg);
      }
    }
    /**
     * If a server is present and supports logging,
     * it sends a warn message to server otherwise it sends to the browser console.
     */
    logWarn(msg) {
      if (this.hasServer && this.serverFeatures.hasLogging) {
        this._sendCmd(_SRV_CNT.MSG_LOG_WARN, msg);
      } else {
        console.warn(msg);
      }
    }
    /**
     * If a server is present and supports logging,
     * it sends a error message to server otherwise it sends to the browser console.
     */
    logError(msg) {
      if (this.hasServer && this.serverFeatures.hasLogging) {
        this._sendCmd(_SRV_CNT.MSG_LOG_ERROR, msg);
      } else {
        console.error(msg);
      }
    }
    /**
     * This method is called by the server to communicate with the client.
     */
    _internalGetServerMsg(cmd, _value) {
      switch (cmd) {
        case _SRV_CNT.MSG_SERVER_READY:
          this._isServerReady = true;
          this.logMsg("Received Server Ready");
          this._sendCmd(_SRV_CNT.MSG_SET_FPS, this.fps.toString());
          this._sendCmd(_SRV_CNT.MSG_SET_FRAME_COUNT, this._frameCount.toString());
          if (this.onServerReady) {
            this.onServerReady(this._args);
          }
          this._renderLoop();
          break;
        case _SRV_CNT.MSG_RENDER_DONE:
          this._renderLoop();
          break;
      }
    }
    // ------------------------------------------------------------------------
    //                               Proxies
    // ------------------------------------------------------------------------
    getElementAdapters(selector) {
      return _parseInElSelector(this, [], this.storyAdapter, selector);
    }
  }
  ABeamer2._Story = _Story;
  function createStory(fps, createParams) {
    _abeamer = new _Story({ fps }, createParams || {});
    return _abeamer;
  }
  ABeamer2.createStory = createStory;
  function createStoryFromConfig(cfgUrl, callback, fps, createParams) {
    $.get(cfgUrl, (data) => {
      let cfgRoot;
      if (cfgUrl.endsWith(".json")) {
        cfgRoot = data;
      } else {
        cfgRoot = {};
        data.split(/\n/).forEach((line) => line.replace(
          /^\s*[\$@]abeamer-([\w+\-]+)\s*:\s*"?([^\n]+)"?\s*;\s*$/,
          (_all, p1, p2) => {
            cfgRoot[p1] = p2;
            return "";
          }
        ));
        cfgRoot = { config: { abeamer: cfgRoot } };
      }
      const cfgConfig = cfgRoot.config;
      if (cfgConfig) {
        const cfg = cfgConfig.abeamer;
        if (cfg) {
          cfg.fps = cfg.fps || fps;
          _abeamer = new _Story(cfg, createParams || {});
          callback(_abeamer);
        }
      }
    });
  }
  ABeamer2.createStoryFromConfig = createStoryFromConfig;
})(ABeamer || (ABeamer = {}));
let _abeamer;
//# sourceMappingURL=story.js.map
