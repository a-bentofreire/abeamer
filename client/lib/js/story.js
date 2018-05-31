"use strict";
// uuid: 3b581118-d68b-4f8e-8663-99ec6d761d04
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements story class
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **story** is the entry point of ABeamer client library.
 * It has the following functions:
 *
 * - Manage multiple scenes, including insert and remove.
 * - Manage scene transitions.
 * - Manage flyovers.
 * - Start the rendering process.
 * - Communicate with the server agent.
 * - Load the complete story from a configuration file.
 *
 * The workflow summary is:
 *
 * - A story automatically creates DOM scenes.
 * - In each scene, the user adds its animations.
 * - The user executes `story.render` which will process the animation pipeline
 * frame by frame and send it to the server agent.
 * - The server agent will communicate with a headless server such as puppeteer
 * to store each frame on the disk.
 *
 * @see workflow
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Story
    // ------------------------------------------------------------------------
    /**
     * Implementation of _Story class.
     */
    var _Story = /** @class */ (function () {
        /**
         * Sets up the Story and adds the Default Scenes.
         */
        function _Story(cfg, createParams) {
            var _this = this;
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
            this._isRendering = false;
            this._scenes = [];
            this._curScene = undefined;
            this._wkFlyovers = [];
            this._queueRenders = [];
            this._metadata = {};
            // scene access
            this._args = {
                renderNr: 0,
                stage: ABeamer.AS_UNKNOWN,
                vars: ABeamer._vars,
            };
            /**
             * Default unit used when input time values are used in numeric forms.
             * Supports minutes, seconds, milliseconds and frames.
             *   `TimeUnit.f = 0;`
             *   `TimeUnit.ms = 1;`
             *   `TimeUnit.s = 2;`
             *   `TimeUnit.m = 3;`
             */
            this.defaultUnit = ABeamer.TimeUnit.f;
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
            /**
             * Returns the play speed that best matches the fps.
             */
            this.bestPlaySpeed = function () { return Math.abs(1000 / _this.fps); };
            var urlParams = window.location.search || '';
            this.storyAdapter = createParams.storyAdapter || new ABeamer._DOMSceneAdapter('.abeamer-story');
            cfg.fps = cfg.fps || this.storyAdapter.getProp('fps');
            ABeamer.throwIfI8n(!ABeamer.isPositiveNatural(cfg.fps), ABeamer.Msgs.MustNatPositive, { p: 'fps' });
            ABeamer._vars.fps = cfg.fps;
            cfg.width = cfg.width || this.storyAdapter.getProp('frame-width');
            ABeamer.throwIfI8n(!ABeamer.isPositiveNatural(cfg.width), ABeamer.Msgs.MustNatPositive, { p: 'frame-width' });
            this.storyAdapter.setProp('frame-width', cfg.width);
            ABeamer._vars.frameWidth = cfg.width;
            cfg.height = cfg.height || this.storyAdapter.getProp('frame-height');
            ABeamer.throwIfI8n(!ABeamer.isPositiveNatural(cfg.height), ABeamer.Msgs.MustNatPositive, { p: 'frame-height' });
            this.storyAdapter.setProp('frame-height', cfg.height);
            ABeamer._vars.frameHeight = cfg.height;
            // setting clip-path is used because of slide transitions that display outside
            // the story boundaries
            this.storyAdapter.setProp('clip-path', "polygon(0 0, 0 " + cfg.height + "px, " + cfg.width + "px " + cfg.height + "px, " + cfg.width + "px 0px)");
            this._width = cfg.width;
            this._height = cfg.height;
            this._args.story = this;
            this.fps = cfg.fps;
            this._isTeleporting = createParams.toTeleport || false;
            urlParams.replace(new RegExp(ABeamer._SRV_CNT.LOG_LEVEL_SUFFIX + '(\\d+)'), function (m, p1) {
                _this.logLevel = parseInt(p1); // don't use _logLevel
                return '';
            });
            urlParams.replace(new RegExp(ABeamer._SRV_CNT.TELEPORT_SUFFIX + '(\\w+)'), function (m, p1) {
                _this._isTeleporting = p1 === 'true';
                return '';
            });
            urlParams.replace(new RegExp(ABeamer._SRV_CNT.SERVER_SUFFIX + '(\\w+)'), function (m, p1) {
                _this.hasServer = true;
                _this.serverName = p1;
                _this.serverFeatures = ABeamer._setServer(_this.serverName);
                return '';
            });
            this._args.isTeleporting = this._isTeleporting;
            this._args.vars.isTeleporting = this._args.isTeleporting;
            this._teleporter = new ABeamer._Teleporter(this, cfg, this._isTeleporting);
            // #debug-start
            if (this._isVerbose) {
                this.logFrmt('story', [
                    ['fps', this.fps],
                    ['urlParams', urlParams],
                    ['hasServer', this.hasServer.toString()],
                    ['hasStory', this._teleporter.hasStory.toString()],
                    ['toTeleport', this._isTeleporting.toString()],
                ]);
            }
            // #debug-end
            if (this._teleporter.hasStory) {
                this._teleporter._rebuildStory();
            }
            else {
                if (!createParams.dontAddDefaultScenes) {
                    this.addDefaultScenes();
                }
            }
        }
        Object.defineProperty(_Story.prototype, "metadata", {
            /**
             * Numerical value of the frame width in pixels.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._metadata;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "width", {
            /**
             * Numerical value of the frame width in pixels.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "height", {
            /**
             * Numerical value of the frame height in pixels.
             *
             * #end-user @readonly
             */
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "frameCount", {
            /**
             * Total number of frames from all the scenes.
             *
             * #end-user @readonly
             */
            get: function () {
                this._calcFrameCount();
                return this._frameCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "renderDir", {
            /**
             * Render direction. 1 for forward, -1 for backwards.
             * Defined during the call to `story.render`.
             *
             * #end-user @readonly
             */
            get: function () { return this._renderDir; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "renderFrameEnd", {
            /**
             * The number of the last frame to be rendered within the story.
             * Defined during the call to `story.render`.
             * This value doesn't changes during the rendering process.
             *
             * #end-user @readonly
             */
            get: function () { return this._renderFrameEnd; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "renderFramePos", {
            /**
             * The number of the current frame being rendered.
             * Defined during the call to `story.render`.
             * This value changes during the rendering process.
             *
             * #end-user @readonly
             */
            get: function () { return this._renderFramePos; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "renderFrameCount", {
            /**
             * The number of the current frame being rendered.
             * Defined during the call to `story.render`.
             * This value doesn't changes during the rendering process.
             *
             * #end-user @readonly
             */
            get: function () { return this._renderFrameCount; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "isRendering", {
            /**
             * True if the rendering has started.
             * Use `finishRender` to abort the rendering process.
             *
             * #end-user @readonly
             */
            get: function () { return this._isRendering; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "isTeleporting", {
            /**
             * True if it's teleporting.
             *
             * #end-user @readonly
             * @type {boolean}
             * @memberof _Story
             */
            get: function () { return this._isTeleporting; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "strictMode", {
            get: function () {
                return this._strictMode;
            },
            set: function (newStrictMode) {
                this._strictMode = newStrictMode;
                this._args.isStrict = newStrictMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "logLevel", {
            get: function () { return this._logLevel; },
            set: function (newLogLevel) {
                this._logLevel = newLogLevel;
                this._isVerbose = newLogLevel >= ABeamer.LL_VERBOSE;
                this._args.isVerbose = this._isVerbose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "isVerbose", {
            get: function () { return this._isVerbose; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "scenes", {
            /**
             * List of the scenes.
             *
             * #end-user @readonly
             */
            get: function () { return this._scenes; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Story.prototype, "curScene", {
            /**
             * Current active and visible scene.
             * Valid both for adding animations and rendering.
             * Use `gotoScene` to change this value.
             *
             * #end-user @readonly
             */
            get: function () { return this._curScene; },
            enumerable: true,
            configurable: true
        });
        // ------------------------------------------------------------------------
        //                               Addition
        // ------------------------------------------------------------------------
        /**
         * Adds scenes defined in the html by `.abeamer-scene` class.
         * These classes are added automatically during Story constructor.
         * Add only after a `story.reset()`.
         */
        _Story.prototype.addDefaultScenes = function () {
            var story = this;
            $('.abeamer-scene').each(function (index, htmlElement) {
                story.addScene($(htmlElement));
            });
            if (this._scenes.length) {
                this.gotoScene(this._scenes[0]);
            }
        };
        /**
         * Adds a scene to the story.
         * HTML elements with abeamer-scene class are added automatically.
         *
         * @param sceneSelector DOM selector, JQuery object or Virtual Scene
         * @returns A pointer to newly created scene
         */
        _Story.prototype.addScene = function (sceneSelector) {
            var scene = new ABeamer._Scene(this, sceneSelector, this._scenes.length ? this._scenes[this._scenes.length - 1] : undefined);
            this._scenes.push(scene);
            this._setFrameCountChanged();
            if (this._teleporter.active) {
                this._teleporter._addScene();
            }
            return scene;
        };
        /**
         * Removes a frame from scene list and removes the its rendering pipeline
         * but its DOM elements aren't removed.
         */
        _Story.prototype.removeScene = function (scene) {
            this._exceptIfRendering();
            if (this._curScene === scene) {
                scene._hide();
                this._curScene = undefined;
            }
            scene._remove();
            this._scenes.splice(scene.storySceneIndex, 1);
        };
        /**
         * Rewinds the animation to the start.
         * Deletes all the scenes and frames from the story.
         * The DOM is left untouched.
         */
        _Story.prototype.clear = function () {
            this._exceptIfRendering();
            this.rewind();
            this._internalGotoScene(undefined);
            this.scenes.length = 0;
            this._renderFramePos = 0;
            this._frameCount = 0;
        };
        // ------------------------------------------------------------------------
        //                               Animations
        // ------------------------------------------------------------------------
        /**
         * Adds a list scene/serial/parallel animations.
         * In essence, it represents the complete storyline.
         * Use this method to load the whole storyline from an external file.
         * Otherwise is preferable to add animation scene by scene.
         */
        _Story.prototype.addStoryAnimations = function (sceneSerialAnimes) {
            var _this = this;
            sceneSerialAnimes.forEach(function (sceneSerialAnime, index) {
                _this._scenes[index].addSerialAnimations(sceneSerialAnime);
            });
        };
        /**
         * Adds a list of serial/parallel animations per scene Id.
         * It requires that each scene has defined the id (DOM attribute).
         * It bypasses invalid scene ids.
         */
        _Story.prototype.addStoryAnimationsBySceneId = function (sceneSerialAnimes) {
            var ids = {};
            this._scenes.forEach(function (scene) { ids[scene.id] = scene; });
            Object.keys(sceneSerialAnimes).forEach(function (id) {
                var scene = ids[id];
                if (scene) {
                    scene.addSerialAnimations(sceneSerialAnimes[id]);
                }
            });
        };
        // ------------------------------------------------------------------------
        //                               Flyovers
        // ------------------------------------------------------------------------
        /**
         * Adds a flyover, which is a function executed on every render step.
         *
         * @see flyovers
         */
        _Story.prototype.addFlyover = function (handler, params) {
            var wkFlyover = ABeamer._buildWorkFlyover(handler, params, false, this._args);
            if (this._isTeleporting && this._args.stage !== ABeamer.AS_ADD_ANIMATION
                && this._scenes.length) {
                var scene = this._scenes[0];
                scene.addAnimations([{
                        tasks: [
                            {
                                handler: 'add-flyover',
                                params: {
                                    handler: wkFlyover.name,
                                    params: wkFlyover.params,
                                },
                            },
                        ],
                    }]);
            }
            else {
                wkFlyover.func(wkFlyover, wkFlyover.params, ABeamer.TS_INIT, this._args);
                this._wkFlyovers.push(wkFlyover);
            }
        };
        // ------------------------------------------------------------------------
        //                               Scene Methods
        // ------------------------------------------------------------------------
        /**
         * Changes the active and visible to a different scene.
         */
        _Story.prototype.gotoScene = function (scene) {
            if (scene === this._curScene) {
                return;
            }
            this._exceptIfRendering();
            this._calcFrameCount();
            this._internalGotoScene(scene);
        };
        /**
         * Internal and faster version of gotoScene.
         */
        _Story.prototype._internalGotoScene = function (scene) {
            var curScene = this._curScene;
            if (curScene) {
                curScene._hide();
            }
            this._curScene = scene;
            if (scene) {
                scene._show();
            }
            this._args.scene = scene;
        };
        /** Returns the Scene Object which has `sceneName`, undefined otherwise */
        _Story.prototype.findSceneByName = function (sceneName) {
            return this._scenes.find(function (scene) { return scene.name === sceneName; });
        };
        // ------------------------------------------------------------------------
        //                               Frame Methods
        // ------------------------------------------------------------------------
        /**
         * Signals that there was a change in the number of frames.
         * Usually used by `addAnimations`.
         */
        _Story.prototype._setFrameCountChanged = function () {
            this._frameCountChanged = true;
        };
        /**
         * Recomputes the total number of frames as well as other scene parameters
         * associated with frames.
         */
        _Story.prototype._calcFrameCount = function () {
            if (!this._frameCountChanged) {
                return;
            }
            var frameCount = 0;
            this._scenes.forEach(function (scene, index) {
                frameCount += scene._setStoryParams(frameCount, index);
            });
            this._frameCountChanged = false;
            this._frameCount = frameCount;
        };
        /**
         * Rewinds the animation to the start.
         */
        _Story.prototype.rewind = function () {
            this.gotoFrame(0);
        };
        /**
         * Moves the current render Position when is not rendering by consuming the pipeline.
         * Use this only if you need to compute parameters at certain position.
         * When render starts
         */
        _Story.prototype.gotoFrame = function (framePos) {
            this._exceptIfRendering();
            this._calcFrameCount();
            if (framePos < 0 || framePos >= this._frameCount) {
                ABeamer.throwI8n(ABeamer.Msgs.OutOfScope, { p: ABeamer.Msgs.pos });
            }
            this._internalGotoFrame(framePos);
        };
        _Story.prototype._internalGotoFrame = function (framePos) {
            var _curScene = this._curScene;
            if (!_curScene
                || !_curScene._internalContainsFrame(framePos)) {
                _curScene = this._scenes.find(function (scene) {
                    return scene._internalContainsFrame(framePos);
                });
                this._internalGotoScene(_curScene);
            }
            _curScene._internalGotoFrame(framePos - _curScene.storyFrameStart);
        };
        _Story.prototype._AfterWaitRenderFrame = function (scene) {
            if (this.onBeforeRenderFrame) {
                this.onBeforeRenderFrame(this._args);
            }
            scene._internalRenderFrame(this._renderFramePos - scene.storyFrameStart, this._renderDir, this._isVerbose, false);
            // @TODO: Rethink so it's placed only after the frame is stored on the server
            if (this.onAfterRenderFrame) {
                this.onAfterRenderFrame(this._args);
            }
        };
        // @TODO: This can cause a stack overflow. It needs a better solution,
        // probably using async.
        _Story.prototype._internalCallWaitFor = function (scene, waitFor, at, onFinished) {
            var _this = this;
            if (at < waitFor.length) {
                waitFor[at](this._args, function () {
                    _this._internalCallWaitFor(scene, waitFor, at + 1, onFinished);
                });
            }
            else {
                this._AfterWaitRenderFrame(scene);
                onFinished();
            }
        };
        _Story.prototype._internalRenderFrame = function (onFinished) {
            var _this = this;
            var scene = this._curScene;
            while (!scene._internalContainsFrame(this._renderFramePos)) {
                scene = this._scenes[this._curScene.storySceneIndex + this._renderDir];
            }
            this._args.scene = scene;
            if (scene !== this._curScene) {
                this._internalGotoScene(scene);
            }
            var waitFor = [];
            this._wkFlyovers.forEach(function (wkFlyover) {
                var waitFunc = wkFlyover.func(wkFlyover, wkFlyover.params, ABeamer.TS_ANIME_LOOP, _this._args);
                if (waitFunc) {
                    waitFor.push(waitFunc);
                }
            });
            this._internalCallWaitFor(scene, waitFor, 0, onFinished);
        };
        // ------------------------------------------------------------------------
        //                               Transitions
        // ------------------------------------------------------------------------
        _Story.prototype._setupTransitions = function () {
            this._scenes.forEach(function (scene, index) {
                scene._setupTransition();
            });
        };
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
        _Story.prototype.getStoryToTeleport = function (frameOpts, isPretty) {
            if (!this._isTeleporting) {
                throw "getStoryToTeleport requires to be in teleporting mode";
            }
            if (!this._calcRenderFrameOptions(frameOpts)) {
                return '';
            }
            return this._teleporter._getStoryToTeleport(isPretty);
        };
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
        _Story.prototype.teleport = function (frameOpts, isPretty) {
            if (!this.hasServer) {
                console.warn("To teleport it requires the server agent to be running");
            }
            this._sendCmd(ABeamer._SRV_CNT.MSG_TELEPORT, this.getStoryToTeleport(frameOpts, isPretty));
        };
        // ------------------------------------------------------------------------
        //                               Render
        // ------------------------------------------------------------------------
        /**
         * Throws exception if is rendering.
         */
        _Story.prototype._exceptIfRendering = function () {
            if (this._isRendering) {
                throw "Render is still running";
            }
        };
        _Story.prototype._getSceneByHandler = function (scene) {
            switch (typeof scene) {
                case 'object': return scene;
                case 'string':
                    var outScene = this.findSceneByName(scene);
                    ABeamer.throwIfI8n(!outScene, ABeamer.Msgs.Unknown, { p: scene });
                    return outScene;
                case 'number':
                    var sceneIdx = scene;
                    if (this._strictMode) {
                        ABeamer.throwIfI8n(ABeamer.isNotNegativeNatural(sceneIdx), ABeamer.Msgs.MustNatNotNegative, { p: sceneIdx });
                    }
                    if (sceneIdx < 0 || sceneIdx >= this._scenes.length) {
                        ABeamer.throwI8n(ABeamer.Msgs.OutOfScope, { p: ABeamer.Msgs.pos });
                    }
                    return this._scenes[sceneIdx];
            }
        };
        /**
         * Computes the render properties from the user frame params.
         */
        _Story.prototype._calcRenderFrameOptions = function (frameOpts) {
            frameOpts = frameOpts || {};
            this._calcFrameCount();
            var renderFramePos = ABeamer.parseTimeHandler(frameOpts.renderPos, this._args, 0, 0);
            var renderFrameCount = ABeamer.parseTimeHandler(frameOpts.renderCount, this._args, this._frameCount, this._frameCount);
            if (frameOpts.startScene !== undefined) {
                var startScene = this._getSceneByHandler(frameOpts.startScene);
                renderFramePos += startScene.storyFrameStart;
                if (frameOpts.renderCount === undefined) {
                    renderFrameCount -= startScene.storyFrameStart;
                }
            }
            if (frameOpts.endScene !== undefined) {
                var endScene = this._getSceneByHandler(frameOpts.endScene);
                if (frameOpts.renderCount === undefined) {
                    renderFrameCount = endScene.storyFrameStart
                        + endScene.frameCount - renderFramePos;
                }
            }
            // needs at least one frame to render
            if (!renderFrameCount) {
                return false;
            }
            var renderFrameDir = renderFrameCount > 0 ? 1 : -1;
            if (renderFrameDir === -1) {
                ABeamer.throwErr('Reverse render isn\'t supported yet');
            }
            var renderFrameEnd = renderFrameCount > 0
                ? renderFramePos + renderFrameCount - 1
                : renderFramePos + renderFrameCount;
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
        };
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
        _Story.prototype.render = function (playSpeedMs, frameOpts) {
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
        };
        _Story.prototype._internalRender = function (playSpeedMs, frameOpts) {
            this._args.stage = ABeamer.AS_RENDERING;
            this._isRendering = true;
            if (!this._calcRenderFrameOptions(this._teleporter._fillFrameOpts(frameOpts))) {
                this.finishRender();
                return;
            }
            this._setupTransitions();
            this._internalGotoFrame(this._renderFramePos);
            if (!this.hasServer) {
                this._serverlessRender(playSpeedMs);
            }
            else {
                this._sendCmd(ABeamer._SRV_CNT.MSG_READY);
            }
        };
        /**
         * Aborts the rendering process.
         */
        _Story.prototype.finishRender = function () {
            if (this._isRendering) {
                this._isRendering = false;
                if (this._renderTimer) {
                    window.clearTimeout(this._renderTimer);
                    this._renderTimer = undefined;
                }
                if (this._queueRenders.length) {
                    var queuedRender = this._queueRenders[0];
                    this._queueRenders.splice(0, 1);
                    this._internalRender(queuedRender.playSpeedMs, queuedRender);
                    return;
                }
                this._args.stage = ABeamer.AS_UNKNOWN;
                this._sendCmd(ABeamer._SRV_CNT.MSG_RENDER_FINISHED);
                if (this.toExitOnRenderFinished) {
                    this.exit();
                }
            }
        };
        _Story.prototype._internalCallRenderFrame = function (onFinished) {
            var _this = this;
            // in case DOM notification system after this.finishRender();
            if (!this._isRendering) {
                onFinished(false);
            }
            this._internalRenderFrame(function () {
                if (_this._renderFramePos !== _this._renderFrameEnd) {
                    _this._renderFramePos += _this._renderDir;
                    if (_this.onNextFrame) {
                        _this.onNextFrame(_this._args);
                    }
                    onFinished(true);
                }
                else {
                    _this.finishRender();
                    onFinished(false);
                }
            });
        };
        /**
         * Renders each frame at a pre-defined speed.
         */
        _Story.prototype._pacedRenderLoop = function (playSpeedMs) {
            // @TODO: set interval / 2 and sync frames to have a more abeamer timing
            var _this = this;
            var now = new Date();
            var stackLevel = 0; // protects from stack overflow
            var callRenderFrame = function () {
                _this._internalCallRenderFrame(function (res) {
                    if (res) {
                        var newDate = new Date();
                        var elapsed = newDate - now;
                        var waitTime = playSpeedMs - Math.floor(elapsed /* / 1000 */);
                        now = newDate;
                        if (waitTime > 0 || stackLevel > 100) {
                            stackLevel = 0;
                            _this._renderTimer = window.setTimeout(callRenderFrame, Math.max(waitTime, 0));
                        }
                        else {
                            stackLevel++;
                            callRenderFrame();
                        }
                    }
                });
            };
            callRenderFrame(); // renders the first frame without delay
        };
        _Story.prototype._serverlessRender = function (playSpeedMs) {
            if (playSpeedMs !== undefined && playSpeedMs > 0) {
                this._pacedRenderLoop(playSpeedMs);
            }
            else {
                // with waitFor events even at full speed it will need a timer.
                // do {
                //   this._internalCallRenderFrame();
                // } while (this._isRendering);
                // @TODO: Better solution. probably using async.
                this._pacedRenderLoop(1);
            }
        };
        // ------------------------------------------------------------------------
        //                               Communicate with the server
        // ------------------------------------------------------------------------
        _Story.prototype._sendCmd = function (cmd, value) {
            console.log(ABeamer._SRV_CNT.MESSAGE_PREFIX + cmd +
                (value ? ABeamer._SRV_CNT.CMD_VALUE_SEP + value : ''));
        };
        /**
         * Terminates the server in case is a headless webpage capture program.
         * In other cases, it has no effect.
         */
        _Story.prototype.exit = function () {
            this._sendCmd(ABeamer._SRV_CNT.MSG_EXIT);
        };
        /**
         * Formats a log using a format supported by exact test framework.
         * This is mostly used internally for testing, but it's publicly available.
         *
         * @param params list of [name, value]
         */
        _Story.prototype.logFrmt = function (tag, params, logType) {
            var msg = tag + ":" + params.map(function (param) { return param[0] + "=_[" + param[1] + "]_"; })
                .join(' ');
            switch (logType) {
                case ABeamer.LT_WARN:
                    this.logWarn(msg);
                    break;
                case ABeamer.LT_ERROR:
                    this.logError(msg);
                    break;
                default:
                    this.logMsg(msg);
            }
        };
        /**
         * If a server is present and supports logging,
         * it sends a log message to server otherwise it sends to the browser console.
         */
        _Story.prototype.logMsg = function (msg) {
            if (this.hasServer && this.serverFeatures.hasLogging) {
                this._sendCmd(ABeamer._SRV_CNT.MSG_LOG_MSG, msg);
            }
            else {
                console.log(msg);
            }
        };
        /**
         * If a server is present and supports logging,
         * it sends a warn message to server otherwise it sends to the browser console.
         */
        _Story.prototype.logWarn = function (msg) {
            if (this.hasServer && this.serverFeatures.hasLogging) {
                this._sendCmd(ABeamer._SRV_CNT.MSG_LOG_WARN, msg);
            }
            else {
                console.warn(msg);
            }
        };
        /**
         * If a server is present and supports logging,
         * it sends a error message to server otherwise it sends to the browser console.
         */
        _Story.prototype.logError = function (msg) {
            if (this.hasServer && this.serverFeatures.hasLogging) {
                this._sendCmd(ABeamer._SRV_CNT.MSG_LOG_ERROR, msg);
            }
            else {
                console.error(msg);
            }
        };
        /**
         * This method is called by the server to communicate with the client.
         */
        _Story.prototype._internalGetServerMsg = function (cmd, value) {
            var _this = this;
            switch (cmd) {
                case ABeamer._SRV_CNT.MSG_SERVER_READY:
                    this._isServerReady = true;
                    this.logMsg('Received Server Ready');
                    this._sendCmd(ABeamer._SRV_CNT.MSG_SET_FPS, this.fps.toString());
                    this._sendCmd(ABeamer._SRV_CNT.MSG_SET_FRAME_COUNT, this._frameCount.toString());
                    if (this.onServerReady) {
                        this.onServerReady(this._args);
                    }
                    break;
                case ABeamer._SRV_CNT.MSG_RENDER_DONE:
                    if (this._renderFramePos === this._renderFrameEnd) {
                        this.finishRender();
                        return;
                    }
                    this._renderFramePos += this._renderDir;
                    if (this.onNextFrame) {
                        this.onNextFrame(this._args);
                    }
            }
            // Avoids stack overflow, since isn't clear if the server is async
            window.setTimeout(function () {
                _this._internalRenderFrame(function () {
                    _this._sendCmd(ABeamer._SRV_CNT.MSG_RENDER);
                });
            }, 1);
        };
        // ------------------------------------------------------------------------
        //                               Proxies
        // ------------------------------------------------------------------------
        _Story.prototype.getElementAdapters = function (selector) {
            return ABeamer._parseInElSelector(this, [], this.storyAdapter, selector);
        };
        return _Story;
    }());
    ABeamer._Story = _Story;
    // ------------------------------------------------------------------------
    //                               Global Functions
    // ------------------------------------------------------------------------
    /**
     * Creates a story. Loading parameters from style data.
     * `fps` property can also be defined on `body.data-fps` or config file.
     *
     * @see config-file
     */
    function createStory(fps, createParams) {
        _abeamer = new _Story({ fps: fps }, createParams || {});
        return _abeamer;
    }
    ABeamer.createStory = createStory;
    /**
     * Creates a story by loading the configuration from a file or a teleported story.
     *
     * @see config-file
     */
    function createStoryFromConfig(cfgUrl, callback, fps, createParams) {
        $.get(cfgUrl, function (data) {
            var cfgRoot;
            if (cfgUrl.endsWith('.json')) {
                cfgRoot = data;
            }
            else {
                cfgRoot = {};
                // @HINT: this code is a copy of  server.ts / parseIniCfgContent
                // @TODO: find a way to avoid duplicating this code
                data.split(/\n/).forEach(function (line) {
                    return line.replace(/^\s*[\$@]abeamer-([\w+\-]+)\s*:\s*"?([^\n]+)"?\s*;\s*$/, function (m, p1, p2) {
                        cfgRoot[p1] = p2;
                        return '';
                    });
                });
                cfgRoot = { config: { abeamer: cfgRoot } };
            }
            var cfgConfig = cfgRoot['config'];
            if (cfgConfig) {
                var cfg = cfgConfig['abeamer'];
                if (cfg) {
                    cfg.fps = cfg.fps || fps;
                    _abeamer = new _Story(cfg, createParams || {});
                    callback(_abeamer);
                }
            }
        });
    }
    ABeamer.createStoryFromConfig = createStoryFromConfig;
})(ABeamer || (ABeamer = {}));
var _abeamer;
//# sourceMappingURL=story.js.map