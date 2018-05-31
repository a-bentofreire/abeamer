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
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               pEls
  // ------------------------------------------------------------------------

  export class _pEls implements pEls {

    protected _scene: _SceneImpl;
    protected _selector: ElSelectorHandler;
    _elementAdapters: ElementAdapter[] = [];


    /** The laser marker is used to detected if it's a pEls */
    __laserMarker__ = 1;


    constructor(scene: _SceneImpl, selector: ElSelectorHandler) {
      this._scene = scene;
      this._selector = selector;
      this._elementAdapters = scene.getElementAdapters(selector);
    }

    protected getSelector(): pEls | ElSelectorHandler {
      return _vars.isTeleporting ? this._selector : this;
    }

    /**
     * Wrapper for `scene.addAnimation` with `visible = false`,
     * followed by opacity moving to 1.
     */
    fadeIn(duration?: TimeHandler): pEls {

      const selector = this.getSelector();

      this._scene.addSerialAnimations([
        [{
          selector,
          duration: '1f',
          props: [
            {
              prop: 'visible',
              value: 1,
            },
          ],
        }],
        [{
          selector,
          position: '-1f',
          duration: duration || DEFAULT_FADE_DURATION,
          props: [
            {
              prop: 'opacity',
              value: 1,
            },
          ],
        }],
      ]);

      return this;
    }


    /**
     * Wrapper for scene.addAnimation with opacity moving to 0,
     * followed by `visible = false`.
     */
    fadeOut(duration?: TimeHandler): pEls {

      const selector = this.getSelector();

      this._scene.addSerialAnimations([
        [{
          selector,
          duration: duration || DEFAULT_FADE_DURATION,
          props: [
            {
              prop: 'opacity',
              value: 0,
            },
          ],
        }],
        [{
          selector,
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
    }

    /**
     * Shows all the elements owned by pEls.
     */
    show(): pEls {
      this._scene.addAnimations(
        [{
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
    }


    /**
     * Hides all the elements owned by pEls.
     */
    hide(): pEls {
      this._scene.addAnimations(
        [{
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
    }


    /**
     * Sets the text of all the elements owned by pEls.
     */
    text(text: string): pEls {
      this._scene.addAnimations(
        [{
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
    }
  }
}
