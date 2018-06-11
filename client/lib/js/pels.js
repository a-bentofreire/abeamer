"use strict";
// uuid: 7c94ca82-c471-468f-9226-51c72caac4bb
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements pEls classes
// @doc-name pEls
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **pEls** is a element container providing a functionality similar to jQuery
 *  but, unlike JQuery, pEls supports both DOM and virtual elements.
 *
 * pEls are useful when there are multiple animations on the same element set
 * or to users that are used to use jQuery.
 *
 * During teleportation, it will set the animation selector to the pEls selector.
 * This process will slow down the computation, since it must generate the jQuery for
 * every animation but it will guarantee that is teleportable.
 *
 * A pEls is created via `Scene.getPEls` and its selector is immutable.
 *
 * ## Example
 *
 * ```js
 *  // a DOM scene
 *  var scene1 = story.scenes[0];
 *  var pEls = scene1.getPEls('#message, #square,.circle');
 *  pEls.fadeIn();
 *
 * // a virtual elements on a DOM scene.
 * // requires story.onGetVirtualElement to be set for a VirtualElement factory
 *  var scene2 = story.scenes[0];
 *  var pEls2 = scene2.getPEls('%liver, %lungs');
 *  pEls2.fadeIn();
 * ```
 *
 * @example gallery/animate-wrappers
 *
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               pEls
    // ------------------------------------------------------------------------
    var _pEls = /** @class */ (function () {
        function _pEls(scene, selector) {
            this._elementAdapters = [];
            this._scene = scene;
            this._selector = selector;
            this._elementAdapters = scene.getElementAdapters(selector);
        }
        _pEls.prototype.getSelector = function () {
            return ABeamer._vars.isTeleporting ? this._selector : this;
        };
        /**
         * Wrapper for `scene.addAnimation` with `visible = false`,
         * followed by opacity moving to 1.
         */
        _pEls.prototype.fadeIn = function (duration) {
            var selector = this.getSelector();
            this._scene.addSerialAnimations([
                [{
                        selector: selector,
                        duration: '1f',
                        props: [
                            {
                                prop: 'visible',
                                value: 1,
                            },
                        ],
                    }],
                [{
                        selector: selector,
                        position: '-1f',
                        duration: duration || ABeamer.DEFAULT_FADE_DURATION,
                        props: [
                            {
                                prop: 'opacity',
                                value: 1,
                            },
                        ],
                    }],
            ]);
            return this;
        };
        /**
         * Wrapper for scene.addAnimation with opacity moving to 0,
         * followed by `visible = false`.
         */
        _pEls.prototype.fadeOut = function (duration) {
            var selector = this.getSelector();
            this._scene.addSerialAnimations([
                [{
                        selector: selector,
                        duration: duration || ABeamer.DEFAULT_FADE_DURATION,
                        props: [
                            {
                                prop: 'opacity',
                                value: 0,
                            },
                        ],
                    }],
                [{
                        selector: selector,
                        position: '-1f',
                        duration: '1f',
                        props: [
                            {
                                prop: 'visible',
                                value: 0,
                            },
                        ],
                    }],
            ]);
            return this;
        };
        /**
         * Shows all the elements owned by pEls.
         */
        _pEls.prototype.show = function () {
            this._scene.addAnimations([{
                    selector: this.getSelector(),
                    duration: '1f',
                    props: [
                        {
                            prop: 'visible',
                            value: 1,
                        },
                    ],
                }]);
            return this;
        };
        /**
         * Hides all the elements owned by pEls.
         */
        _pEls.prototype.hide = function () {
            this._scene.addAnimations([{
                    selector: this.getSelector(),
                    duration: '1f',
                    props: [
                        {
                            prop: 'visible',
                            value: 0,
                        },
                    ],
                }]);
            return this;
        };
        /**
         * Sets the text of all the elements owned by pEls.
         */
        _pEls.prototype.text = function (text) {
            this._scene.addAnimations([{
                    selector: this.getSelector(),
                    duration: '1f',
                    props: [
                        {
                            prop: 'text',
                            valueText: [text],
                        },
                    ],
                }]);
            return this;
        };
        return _pEls;
    }());
    ABeamer._pEls = _pEls;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=pels.js.map