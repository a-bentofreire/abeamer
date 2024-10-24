"use strict";
var ABeamer;
((ABeamer2) => {
  class _pEls {
    constructor(scene, selector) {
      this._elementAdapters = [];
      this._scene = scene;
      this._selector = selector;
      this._elementAdapters = scene.getElementAdapters(selector);
    }
    getSelector() {
      return _vars.isTeleporting ? this._selector : this;
    }
    /**
     * Wrapper for `scene.addAnimation` with `visible = false`,
     * followed by opacity moving to 1.
     */
    fadeIn(duration) {
      const selector = this.getSelector();
      this._scene.addSerialAnimations([
        [{
          selector,
          duration: "1f",
          props: [
            {
              prop: "visible",
              value: 1
            }
          ]
        }],
        [{
          selector,
          position: "-1f",
          duration: duration || DEFAULT_FADE_DURATION,
          props: [
            {
              prop: "opacity",
              value: 1
            }
          ]
        }]
      ]);
      return this;
    }
    /**
     * Wrapper for scene.addAnimation with opacity moving to 0,
     * followed by `visible = false`.
     */
    fadeOut(duration) {
      const selector = this.getSelector();
      this._scene.addSerialAnimations([
        [{
          selector,
          duration: duration || DEFAULT_FADE_DURATION,
          props: [
            {
              prop: "opacity",
              value: 0
            }
          ]
        }],
        [{
          selector,
          position: "-1f",
          duration: "1f",
          props: [
            {
              prop: "visible",
              value: 0
            }
          ]
        }]
      ]);
      return this;
    }
    /**
     * Shows all the elements owned by pEls.
     */
    show() {
      this._scene.addAnimations(
        [{
          selector: this.getSelector(),
          duration: "1f",
          props: [
            {
              prop: "visible",
              value: 1
            }
          ]
        }]
      );
      return this;
    }
    /**
     * Hides all the elements owned by pEls.
     */
    hide() {
      this._scene.addAnimations(
        [{
          selector: this.getSelector(),
          duration: "1f",
          props: [
            {
              prop: "visible",
              value: 0
            }
          ]
        }]
      );
      return this;
    }
    /**
     * Sets the text of all the elements owned by pEls.
     */
    text(text) {
      this._scene.addAnimations(
        [{
          selector: this.getSelector(),
          duration: "1f",
          props: [
            {
              prop: "text",
              valueText: [text]
            }
          ]
        }]
      );
      return this;
    }
  }
  ABeamer2._pEls = _pEls;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=pels.js.map
