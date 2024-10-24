"use strict";
var ABeamer;
((ABeamer2) => {
  let WaitForWhat;
  ((WaitForWhat2) => {
    WaitForWhat2[WaitForWhat2["Custom"] = 0] = "Custom";
    WaitForWhat2[WaitForWhat2["ImageLoad"] = 1] = "ImageLoad";
    WaitForWhat2[WaitForWhat2["MediaSync"] = 2] = "MediaSync";
  })(WaitForWhat = ABeamer2.WaitForWhat || (ABeamer2.WaitForWhat = {}));
  class SimpleVirtualAnimator {
    constructor() {
      this.props = {};
      this.propsChanged = false;
    }
    /**
     * Called after property value changed.
     * Use this method instead animateProps, if the rendering should be right after
     * each property is updated, otherwise use animateProps.
     */
    animateProp(name, value) {
      if (this.onAnimateProp) {
        this.onAnimateProp(name, value);
      }
    }
    /**
     * Called after actions from the frame are rendered, and if at least one property changed.
     * Use this method instead animateProp, if the animation has multiple virtual properties and
     * each animation can be done after all are updated.
     */
    animateProps(args) {
      if (this.onAnimateProps) {
        this.onAnimateProps(args);
      }
    }
    getProp(name) {
      return this.props[name];
    }
    setProp(name, value) {
      this.props[name] = value;
      if (name !== "uid") {
        this.propsChanged = true;
        this.animateProp(name, value);
      }
    }
    frameRendered(args) {
      if (this.propsChanged) {
        this.animateProps(args);
        this.propsChanged = false;
      }
    }
  }
  ABeamer2.SimpleVirtualAnimator = SimpleVirtualAnimator;
  ABeamer2.browser = {
    isMsIE: false,
    vendorPrefix: "",
    prefixedProps: []
  };
  ABeamer2.DPT_ID = 0;
  ABeamer2.DPT_VISIBLE = 1;
  ABeamer2.DPT_ATTR = 2;
  ABeamer2.DPT_ATTR_FUNC = 3;
  ABeamer2.DPT_STYLE = 4;
  ABeamer2.DPT_PIXEL = 5;
  ABeamer2.DPT_DUAL_PIXELS = 6;
  ABeamer2.DPT_CLASS = 7;
  ABeamer2.DPT_MEDIA_TIME = 8;
  ABeamer2.DPT_SRC = 9;
  ABeamer2.DPT_ELEMENT = 10;
  const domPropMapper = {
    "element": [ABeamer2.DPT_ELEMENT, ""],
    "uid": [ABeamer2.DPT_ATTR_FUNC, "data-abeamer"],
    "id": [ABeamer2.DPT_ATTR, "id"],
    "html": [ABeamer2.DPT_ATTR, "innerHTML"],
    "text": [ABeamer2.DPT_ATTR, "textContent"],
    "innerHTML": [ABeamer2.DPT_ATTR, "innerHTML"],
    "outerHML": [ABeamer2.DPT_ATTR, "outerHML"],
    "textContent": [ABeamer2.DPT_ATTR, "textContent"],
    "currentTime": [ABeamer2.DPT_MEDIA_TIME, "currentTime"],
    "src": [ABeamer2.DPT_SRC, "src"],
    "class": [ABeamer2.DPT_CLASS, "className"],
    "visible": [ABeamer2.DPT_VISIBLE, ""],
    "left": [ABeamer2.DPT_PIXEL, "left"],
    "right": [ABeamer2.DPT_PIXEL, "right"],
    "bottom": [ABeamer2.DPT_PIXEL, "bottom"],
    "top": [ABeamer2.DPT_PIXEL, "top"],
    "width": [ABeamer2.DPT_PIXEL, "width"],
    "height": [ABeamer2.DPT_PIXEL, "height"],
    "width-height": [ABeamer2.DPT_DUAL_PIXELS, ["width", "height"]],
    "left-top": [ABeamer2.DPT_DUAL_PIXELS, ["left", "top"]],
    "right-top": [ABeamer2.DPT_DUAL_PIXELS, ["right", "top"]],
    "left-bottom": [ABeamer2.DPT_DUAL_PIXELS, ["left", "bottom"]],
    "right-bottom": [ABeamer2.DPT_DUAL_PIXELS, ["right", "bottom"]]
  };
  const cssPropNameMapper = {};
  function _addServerDOMPropMaps(map) {
    Object.keys(map).forEach((name) => {
      cssPropNameMapper[name] = map[name];
    });
  }
  ABeamer2._addServerDOMPropMaps = _addServerDOMPropMaps;
  class _AbstractAdapter {
    waitFor(waitItem, onDone, args) {
    }
    frameRendered(args) {
    }
  }
  ABeamer2._AbstractAdapter = _AbstractAdapter;
  class _ElementAdapter extends _AbstractAdapter {
    constructor(element) {
      super();
    }
    getId(args) {
      return this.getProp("id", args);
    }
    _clearComputerData() {
    }
  }
  ABeamer2._ElementAdapter = _ElementAdapter;
  function _setDOMProp(adapter, propName, value, args) {
    const [propType, domPropName] = domPropMapper[propName] || [ABeamer2.DPT_STYLE, propName];
    const element = adapter.htmlElement;
    switch (propType) {
      case ABeamer2.DPT_CLASS:
        if (value && value.search(/(?:^| )[\-+]/) !== -1) {
          value.split(/\s+/).forEach((aClass) => {
            const first = aClass[0];
            if (first === "-") {
              element.classList.remove(aClass.substr(1));
            } else if (first === "+") {
              element.classList.add(aClass.substr(1));
            } else {
              element.classList.add(aClass);
            }
          });
          break;
        }
      // flows to `DPT_ID`.
      case ABeamer2.DPT_ID:
      // flows to `DPT_ATTR`.
      case ABeamer2.DPT_ATTR:
        element[domPropName] = value;
        break;
      case ABeamer2.DPT_MEDIA_TIME:
        _waitForMediaSync(element, args, value);
        break;
      case ABeamer2.DPT_VISIBLE:
        const defDisplay = element["data-abeamer-display"];
        const curDisplay = element.style.display || adapter.getComputedStyle()["display"];
        if (value !== false && value !== "false" && value !== 0) {
          if (curDisplay === "none") {
            element.style.display = defDisplay || (element.tagName === "SPAN" ? "inline" : "block");
          }
        } else {
          if (!defDisplay) {
            element["data-abeamer-display"] = curDisplay;
          }
          element.style.display = "none";
        }
        break;
      case ABeamer2.DPT_SRC:
      // flows to DPT_ATTR_FUNC
      case ABeamer2.DPT_ATTR_FUNC:
        element.setAttribute(domPropName, value);
        if (propType === ABeamer2.DPT_SRC && element.tagName === "IMG") {
          _waitForImageLoad(element, args);
        }
        break;
      case ABeamer2.DPT_STYLE:
        const cssPropName = cssPropNameMapper[domPropName] || domPropName;
        element.style[cssPropName] = value;
        break;
      case ABeamer2.DPT_PIXEL:
        element.style[domPropName] = typeof value === "number" ? value + "px" : value;
        break;
      case ABeamer2.DPT_DUAL_PIXELS:
        const values = value.split(",");
        domPropName.forEach((propNameXY, index) => {
          element.style[propNameXY] = values[index] + "px";
        });
        break;
    }
  }
  function _NullToUnd(v) {
    return v === null ? void 0 : v;
  }
  function _getDOMProp(adapter, propName, args) {
    const [propType, domPropName] = domPropMapper[propName] || [ABeamer2.DPT_STYLE, propName];
    switch (propType) {
      case ABeamer2.DPT_ELEMENT:
        return adapter.htmlElement;
      case ABeamer2.DPT_MEDIA_TIME:
      // flows to `DPT_CLASS`.
      case ABeamer2.DPT_CLASS:
      // flows to `DPT_ID`.
      case ABeamer2.DPT_ID:
      // flows to `DPT_ATTR`.
      case ABeamer2.DPT_ATTR:
        return _NullToUnd(adapter.htmlElement[domPropName]);
      case ABeamer2.DPT_VISIBLE:
        const value = adapter.htmlElement.style.display || adapter.getComputedStyle()["display"];
        return value === "" || value !== "none" ? true : false;
      case ABeamer2.DPT_SRC:
      // flows to DPT_ATTR_FUNC
      case ABeamer2.DPT_ATTR_FUNC:
        return _NullToUnd(adapter.htmlElement.getAttribute(domPropName));
      case ABeamer2.DPT_PIXEL:
      case ABeamer2.DPT_STYLE:
        const cssPropName = cssPropNameMapper[domPropName] || domPropName;
        return adapter.htmlElement.style[cssPropName] || adapter.getComputedStyle()[cssPropName];
    }
  }
  class _DOMElementAdapter extends _ElementAdapter {
    constructor(element) {
      super(element);
      this.isVirtual = false;
      this.htmlElement = element;
    }
    /**
     * Requests the DOM engine the calculated information for CSS property.
     */
    getComputedStyle() {
      let compStyle = this["__compStyle"];
      if (!compStyle) {
        compStyle = window.getComputedStyle(this.htmlElement);
        this["__compStyle"] = compStyle;
      }
      return compStyle;
    }
    getProp(propName, args) {
      return _getDOMProp(this, propName, args);
    }
    setProp(propName, value, args) {
      _setDOMProp(this, propName, value, args);
    }
    _clearComputerData() {
    }
    waitFor(waitFor, onDone, args) {
      switch (waitFor.what) {
        case 1 /* ImageLoad */:
          _waitForImageLoad(this.htmlElement, args);
          break;
        case 2 /* MediaSync */:
          _waitForMediaSync(
            this.htmlElement,
            args,
            waitFor.value
          );
          break;
      }
    }
  }
  ABeamer2._DOMElementAdapter = _DOMElementAdapter;
  class _SVGElementAdapter extends _ElementAdapter {
  }
  class _VirtualElementAdapter extends _ElementAdapter {
    constructor(element) {
      super(element);
      this.isVirtual = true;
      this.vElement = element;
    }
    getProp(propName, args) {
      return this.vElement.getProp(propName, args);
    }
    setProp(propName, value, args) {
      this.vElement.setProp(propName, value, args);
    }
    waitFor(waitItem, onDone, args) {
      this.vElement.waitFor(waitItem, onDone, args);
    }
    frameRendered(args) {
      if (this.vElement.frameRendered) {
        this.vElement.frameRendered(args);
      }
    }
  }
  ABeamer2._isElementVirtual = (element) => element.getProp !== void 0;
  ABeamer2._isIdVirtual = (id) => id[0] === "%";
  function _getVirtualElement(story, fullId) {
    const selector = fullId.substr(1);
    const animator = story._virtualAnimators.find(
      (vAnimator) => vAnimator.selector === selector
    );
    if (animator) {
      return animator;
    }
    if (!story.onGetVirtualElement) {
      throwErr(`Story must have onGetVirtualElement to support virtual elements mapping`);
    }
    return story.onGetVirtualElement(selector, story._args);
  }
  ABeamer2._getVirtualElement = _getVirtualElement;
  ABeamer2._isVirtualScene = (sceneSelector) => typeof sceneSelector === "object" && sceneSelector.query !== void 0;
  class _SceneAdapter extends _AbstractAdapter {
    constructor(sceneSelector) {
      super();
    }
  }
  ABeamer2._SceneAdapter = _SceneAdapter;
  class _DOMSceneAdapter extends _SceneAdapter {
    constructor(sceneSelector) {
      super(sceneSelector);
      this.$scene = typeof sceneSelector === "string" ? $(sceneSelector) : sceneSelector;
      throwIfI8n(!this.$scene.length, Msgs.NoEmptySelector, { p: sceneSelector });
      this.htmlElement = this.$scene.get(0);
      this.isVirtual = false;
    }
    /**
     * Requests the DOM engine the calculated information for CSS property.
     */
    getComputedStyle() {
      let compStyle = this["__compStyle"];
      if (!compStyle) {
        compStyle = window.getComputedStyle(this.htmlElement);
        this["__compStyle"] = compStyle;
      }
      return compStyle;
    }
    getProp(propName, args) {
      switch (propName) {
        // story attributes
        case "fps":
          return parseInt(document.body.getAttribute("data-fps"));
        case "frame-width":
          return document.body.clientWidth;
        case "frame-height":
          return document.body.clientHeight;
        // scene attributes
        case "id":
          return this.htmlElement.id;
        // case 'html': return this.htmlElement.innerHTML;
        // case 'left':
        // case 'top':
        // case 'width':
        // case 'height':
        //   let value = this.htmlElement.style[propName];
        //   if (!value) {
        //     if (!this.compStyle) {
        //       this.compStyle = window.getComputedStyle(this.htmlElement);
        //     }
        //     value = this.compStyle[propName];
        //   }
        //   return value;
        default:
          return _getDOMProp(this, propName);
      }
    }
    setProp(propName, value, args) {
      const htmlElement = this.htmlElement;
      function setDim(dimName, clientDim) {
        const pxValue = value + "px";
        document.body.style[dimName] = pxValue;
        if (clientDim !== value) {
          htmlElement.style[dimName] = pxValue;
        }
      }
      switch (propName) {
        // story attributes
        case "clip-path":
          htmlElement.style.clipPath = value;
          break;
        case "frame-width":
          setDim("width", htmlElement.clientWidth);
          break;
        case "frame-height":
          setDim("height", htmlElement.clientHeight);
          break;
        // // scene attributes
        // case 'visible':
        //   if (value === 'true' || value === true) {
        //     this.$scene.show();
        //   } else {
        //     this.$scene.hide();
        //   }
        //   break;
        // case 'opacity':
        //   this.htmlElement.style.opacity = value.toString();
        //   break;
        // case 'html':
        //   this.htmlElement.innerHTML = value as string;
        //   break;
        // case 'left':
        // case 'top':
        // case 'width':
        // case 'height':
        //   this.htmlElement.style[propName] = typeof value === 'number'
        //     ? value + 'px' : value as string;
        //   break;
        default:
          _setDOMProp(this, propName, value);
      }
    }
    query(selector, iterator) {
      this.$scene.find(selector).each((index, element) => {
        iterator(element, index);
      });
    }
  }
  ABeamer2._DOMSceneAdapter = _DOMSceneAdapter;
  class _VirtualSceneAdapter extends _SceneAdapter {
    constructor(sceneSelector) {
      super(sceneSelector);
      this.vScene = sceneSelector;
      this.isVirtual = true;
    }
    getProp(propName, args) {
      return this.vScene.getProp(propName, args);
    }
    setProp(propName, value, args) {
      this.vScene.setProp(propName, value, args);
    }
    query(selector, iterator) {
      this.vScene.query(selector, iterator);
    }
  }
  ABeamer2._VirtualSceneAdapter = _VirtualSceneAdapter;
  function _addElementAdapter(story, elementOrStr, elementAdapters, isVirtual, isString) {
    let element;
    if (isString !== false && (isString || typeof elementOrStr === "string")) {
      if (isVirtual === false || isVirtual === void 0 && !(0, ABeamer2._isIdVirtual)(elementOrStr)) {
        throwErr(`selector ${elementOrStr} must be virtual`);
      }
      element = _getVirtualElement(story, elementOrStr);
      isVirtual = true;
    } else {
      element = elementOrStr;
    }
    isVirtual = isVirtual || (0, ABeamer2._isElementVirtual)(element);
    elementAdapters.push(isVirtual ? new _VirtualElementAdapter(element) : new _DOMElementAdapter(element));
  }
  function _parseInElSelector(story, elementAdapters, sceneAdpt, elSelector) {
    if (elSelector instanceof _pEls) {
      return elSelector._elementAdapters;
    }
    if (typeof elSelector === "function") {
      elSelector = elSelector(story._args);
    }
    if (typeof elSelector === "string") {
      if ((0, ABeamer2._isIdVirtual)(elSelector)) {
        _addElementAdapter(story, elSelector, elementAdapters, true, true);
      } else {
        sceneAdpt.query(elSelector, (element, index) => {
          _addElementAdapter(story, element, elementAdapters, false, false);
        });
      }
    } else {
      if (typeof elSelector === "object" && elSelector.length !== void 0) {
        if (!elSelector.length) {
          return;
        }
        elSelector.forEach((element) => {
          _addElementAdapter(story, element, elementAdapters);
        });
      } else {
        throwI8n(Msgs.UnknownType, { p: elSelector.toString() });
      }
    }
    return elementAdapters;
  }
  ABeamer2._parseInElSelector = _parseInElSelector;
  function _waitForImageLoad(elImg, args) {
    if (!elImg.complete) {
      args.waitMan.addWaitFunc((_args, _params, onDone) => {
        if (!elImg.complete) {
          elImg.addEventListener("load", () => {
            onDone();
          }, { once: true });
        } else {
          onDone();
        }
      }, {});
    }
  }
  function _waitForMediaSync(elMedia, args, pos) {
    args.waitMan.addWaitFunc((_args, _params, onDone) => {
      if (pos !== void 0) {
        if (elMedia.readyState < 3) {
          elMedia.addEventListener("loadeddata", () => {
            _waitForMediaSync(elMedia, args, pos);
          }, { once: true });
          return;
        }
        elMedia.addEventListener("seeked", () => {
          if (_args.isVerbose) {
            args.story.logFrmt("video-sync", [
              ["expected", pos],
              ["actual", elMedia.currentTime]
            ], LT_MSG);
          }
          onDone();
        }, { once: true });
        elMedia.currentTime = pos;
      } else {
        onDone();
      }
    }, {});
  }
  function _handleWaitFor(args, params, onDone) {
    params.elAdapter.waitFor(params.waitFor, onDone, args);
  }
  ABeamer2._handleWaitFor = _handleWaitFor;
  const FORCED_PROP_REMAPS = {
    "-webkit-": ["background-clip"]
  };
  const vendorRegEx = /^(-webkit-|-moz-|-ie-|-ms-)(.*)$/;
  function _propNameToVendorProps(propName) {
    const subPropName = propName.replace(vendorRegEx, "$2");
    const mapValue = domPropMapper[subPropName];
    if (mapValue && mapValue[1] && mapValue[1] !== subPropName) {
      return [subPropName, mapValue[1]];
    }
    return [subPropName];
  }
  ABeamer2._propNameToVendorProps = _propNameToVendorProps;
  function _addPropToDomPropMapper(subPropName, propName, canOverwrite) {
    const mapValue = domPropMapper[subPropName];
    if (!canOverwrite && mapValue !== void 0 && mapValue[1][0] === "-") {
      return;
    }
    const propType = mapValue !== void 0 ? mapValue[0] : ABeamer2.DPT_STYLE;
    domPropMapper[propName] = [propType, propName];
    domPropMapper[subPropName] = [propType, propName];
  }
  function _initBrowser(_args) {
    if (ABeamer2.browser.vendorPrefix) {
      return;
    }
    const isMsIE = navigator.userAgent.search(/Trident/) !== -1;
    ABeamer2.browser.isMsIE = isMsIE;
    const cssMap = window.getComputedStyle(document.body);
    const cssMapLen = (cssMap || []).length;
    let foundVendorPrefix = false;
    for (let i = 0; i < cssMapLen; i++) {
      const propName = cssMap[i];
      const parts = propName.match(vendorRegEx);
      if (parts) {
        if (!foundVendorPrefix) {
          const vendorPrefix = parts[1];
          ABeamer2.browser.vendorPrefix = vendorPrefix;
          foundVendorPrefix = true;
          const forcedProps = FORCED_PROP_REMAPS[vendorPrefix];
          if (forcedProps) {
            forcedProps.forEach((forcedProp) => {
              _addPropToDomPropMapper(forcedProp, vendorPrefix + forcedProp, !isMsIE);
            });
          }
        }
        const subPropName = parts[2];
        ABeamer2.browser.prefixedProps.push(subPropName);
        _addPropToDomPropMapper(subPropName, propName, !isMsIE);
      }
    }
  }
  ABeamer2._initBrowser = _initBrowser;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=adapters.js.map
