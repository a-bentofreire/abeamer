"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// uuid: f3413d18-79c1-4c02-92c6-8ecef7f9da79
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implementation of ElementAdapters and SceneAdapters in order to
// support DOM Elements/Scenes and virtual Elements/Scenes
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **adapter** allows ABeamer to decouple from DOM by serving as an agent
 * between the ABeamer library and elements and scenes.
 *
 * For DOM adapters, ABeamer uses `jQuery` to query DOM and
 * maps special properties such `text` and `html` to
 * `textContent` and `innerHTML`.
 *
 * DOM adapters map [DOM Properties](DOM Property) into either HtmlElement attributes
 * or CSS properties, depending on the Animation Property name.
 *
 * For HtmlElement attributes, the DOM Adapter uses `element.getAttribute`.
 * For CSS Properties, it uses `element.style`, but if it's empty,
 * it retrieves all the computed CSS properties via `window.getComputedStyle`
 * and caches its content.
 *
 * DOM Adapters use the attribute `data-abeamer-display` to define which
 * value will be used in `display` when visible is set to true.
 * If it's not defined, it will be set to `inline` for `span` tags,
 * and `block` for all the other tags.
 *
 * 'DOM Scenes' are typically a DIV. 'DOM Elements' can be any HtmlElement.
 *
 * 'DOM Scenes' can provide Virtual Elements via ids starting with `%`,
 * and `story.onGetVirtualElement`.
 *
 * For Virtual adapters there is a direct connection to the Virtual Element
 * and Scene property.
 *
 * Unlike DOM elements which only provide textual values, Virtual Elements can
 * get and set numerical values.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Elements
    // ------------------------------------------------------------------------
    var WaitForWhat;
    (function (WaitForWhat) {
        WaitForWhat[WaitForWhat["Custom"] = 0] = "Custom";
        WaitForWhat[WaitForWhat["ImageLoad"] = 1] = "ImageLoad";
        WaitForWhat[WaitForWhat["MediaSync"] = 2] = "MediaSync";
    })(WaitForWhat = ABeamer.WaitForWhat || (ABeamer.WaitForWhat = {}));
    ABeamer.browser = {
        vendorPrefix: '',
        prefixedProps: [],
    };
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    /* ---- Animation Property Type ---- */
    ABeamer.DPT_ID = 0;
    ABeamer.DPT_VISIBLE = 1;
    ABeamer.DPT_ATTR = 2;
    ABeamer.DPT_ATTR_FUNC = 3;
    ABeamer.DPT_STYLE = 4;
    ABeamer.DPT_PIXEL = 5;
    ABeamer.DPT_DUAL_PIXELS = 6;
    ABeamer.DPT_CLASS = 7;
    ABeamer.DPT_MEDIA_TIME = 8;
    ABeamer.DPT_SRC = 9;
    /**
     * Maps user property names to DOM property names.
     *
     * In general, property names represent style attributes.
     * This map is used to handle the special cases.
     */
    var domPropMapper = {
        'uid': [ABeamer.DPT_ATTR_FUNC, 'data-abeamer'],
        'id': [ABeamer.DPT_ATTR, 'id'],
        'html': [ABeamer.DPT_ATTR, 'innerHTML'],
        'text': [ABeamer.DPT_ATTR, 'textContent'],
        'innerHTML': [ABeamer.DPT_ATTR, 'innerHTML'],
        'outerHML': [ABeamer.DPT_ATTR, 'outerHML'],
        'textContent': [ABeamer.DPT_ATTR, 'textContent'],
        'currentTime': [ABeamer.DPT_MEDIA_TIME, 'currentTime'],
        'src': [ABeamer.DPT_SRC, 'src'],
        'class': [ABeamer.DPT_CLASS, 'className'],
        'visible': [ABeamer.DPT_VISIBLE, ''],
        'left': [ABeamer.DPT_PIXEL, 'left'],
        'right': [ABeamer.DPT_PIXEL, 'right'],
        'bottom': [ABeamer.DPT_PIXEL, 'bottom'],
        'top': [ABeamer.DPT_PIXEL, 'top'],
        'width': [ABeamer.DPT_PIXEL, 'width'],
        'height': [ABeamer.DPT_PIXEL, 'height'],
        'left-top': [ABeamer.DPT_DUAL_PIXELS, ['left', 'top']],
        'right-top': [ABeamer.DPT_DUAL_PIXELS, ['right', 'top']],
        'left-bottom': [ABeamer.DPT_DUAL_PIXELS, ['left', 'bottom']],
        'right-bottom': [ABeamer.DPT_DUAL_PIXELS, ['right', 'bottom']],
    };
    /**
     * Used to map css Properties due the differences between the web browser
     * used to build the animation and the web browser used to render the image.
     */
    var cssPropNameMapper = {};
    /**
     * Maps attribute names when server doesn't supports a certain attribute.
     *
     * e.g.
     * Chrome has already the support for transform css attribute,
     * but phantomJS uses Chromium which only supports via webKit prefix.
     *
     * @see server-features
     */
    function _addServerDOMPropMaps(map) {
        Object.keys(map).forEach(function (name) { cssPropNameMapper[name] = map[name]; });
    }
    ABeamer._addServerDOMPropMaps = _addServerDOMPropMaps;
    // ------------------------------------------------------------------------
    //                               _AbstractAdapter
    // ------------------------------------------------------------------------
    /**
     * Base class for all adapters: Element, Scene, Story,
     * and both DOM and virtual.
     */
    var _AbstractAdapter = /** @class */ (function () {
        function _AbstractAdapter() {
        }
        _AbstractAdapter.prototype.waitFor = function (waitItem, onDone, args) { };
        return _AbstractAdapter;
    }());
    ABeamer._AbstractAdapter = _AbstractAdapter;
    // ------------------------------------------------------------------------
    //                               _ElementAdapter
    // ------------------------------------------------------------------------
    /**
     * Base class for Element adapters both DOM and virtual.
     */
    var _ElementAdapter = /** @class */ (function (_super) {
        __extends(_ElementAdapter, _super);
        function _ElementAdapter(element) {
            return _super.call(this) || this;
        }
        _ElementAdapter.prototype.getId = function (args) { return this.getProp('id', args); };
        _ElementAdapter.prototype._clearComputerData = function () { };
        return _ElementAdapter;
    }(_AbstractAdapter));
    ABeamer._ElementAdapter = _ElementAdapter;
    function _setDOMProp(adapter, propName, value, args) {
        var _a = domPropMapper[propName]
            || [ABeamer.DPT_STYLE, propName], propType = _a[0], domPropName = _a[1];
        var element = adapter.htmlElement;
        switch (propType) {
            case ABeamer.DPT_CLASS:
                if (value && value.search(/(?:^| )[\-+]/) !== -1) {
                    value.split(/\s+/).forEach(function (aClass) {
                        var first = aClass[0];
                        if (first === '-') {
                            element.classList.remove(aClass.substr(1));
                        }
                        else if (first === '+') {
                            element.classList.add(aClass.substr(1));
                        }
                        else {
                            element.classList.add(aClass);
                        }
                    });
                    break;
                }
            // flows to `DPT_ID`.
            case ABeamer.DPT_ID:
            // flows to `DPT_ATTR`.
            case ABeamer.DPT_ATTR:
                element[domPropName] = value;
                break;
            case ABeamer.DPT_MEDIA_TIME:
                _waitForMediaSync(element, args, value);
                break;
            case ABeamer.DPT_VISIBLE:
                var defDisplay = element['data-abeamer-display'];
                var curDisplay = element.style.display || adapter.getComputedStyle()['display'];
                if (value !== false && value !== 'false' && value !== 0) {
                    if (curDisplay === 'none') {
                        element.style.display =
                            defDisplay || (element.tagName === 'SPAN'
                                ? 'inline' : 'block');
                    }
                }
                else {
                    if (!defDisplay) {
                        element['data-abeamer-display'] = curDisplay;
                    }
                    element.style.display = 'none';
                }
                break;
            case ABeamer.DPT_SRC:
            // flows to DPT_ATTR_FUNC
            case ABeamer.DPT_ATTR_FUNC:
                element.setAttribute(domPropName, value);
                if (propType === ABeamer.DPT_SRC && element.tagName === 'IMG') {
                    _waitForImageLoad(element, args);
                }
                break;
            case ABeamer.DPT_STYLE:
                var cssPropName = cssPropNameMapper[domPropName] || domPropName;
                element.style[cssPropName] = value;
                break;
            case ABeamer.DPT_PIXEL:
                element.style[domPropName] = typeof value === 'number'
                    ? value + 'px' : value;
                break;
            case ABeamer.DPT_DUAL_PIXELS:
                var values_1 = value.split(',');
                domPropName.forEach(function (propNameXY, index) {
                    element.style[propNameXY] = values_1[index] + 'px';
                });
                break;
        }
    }
    function _NullToUnd(v) {
        return v === null ? undefined : v;
    }
    function _getDOMProp(adapter, propName, args) {
        var _a = domPropMapper[propName]
            || [ABeamer.DPT_STYLE, propName], propType = _a[0], domPropName = _a[1];
        switch (propType) {
            case ABeamer.DPT_MEDIA_TIME:
            // flows to `DPT_CLASS`.
            case ABeamer.DPT_CLASS:
            // flows to `DPT_ID`.
            case ABeamer.DPT_ID:
            // flows to `DPT_ATTR`.
            case ABeamer.DPT_ATTR: return _NullToUnd(adapter.htmlElement[domPropName]);
            case ABeamer.DPT_VISIBLE:
                var value = adapter.htmlElement.style.display || adapter.getComputedStyle()['display'];
                return (value === '' || value !== 'none') ? true : false;
            case ABeamer.DPT_SRC:
            // flows to DPT_ATTR_FUNC
            case ABeamer.DPT_ATTR_FUNC: return _NullToUnd(adapter.htmlElement.getAttribute(domPropName));
            case ABeamer.DPT_PIXEL:
            case ABeamer.DPT_STYLE:
                var cssPropName = cssPropNameMapper[domPropName] || domPropName;
                return adapter.htmlElement.style[cssPropName]
                    || adapter.getComputedStyle()[cssPropName];
        }
    }
    // ------------------------------------------------------------------------
    //                               _DOMElementAdapter
    // ------------------------------------------------------------------------
    /**
     * DOM Element adapter.
     * Gets and sets attributes from HTMLElements.
     * Maps the ABeamer animation property names into DOM attributes.
     */
    var _DOMElementAdapter = /** @class */ (function (_super) {
        __extends(_DOMElementAdapter, _super);
        function _DOMElementAdapter(element) {
            var _this = _super.call(this, element) || this;
            _this.isVirtual = false;
            _this.htmlElement = element;
            return _this;
        }
        /**
         * Requests the DOM engine the calculated information for CSS property.
         */
        _DOMElementAdapter.prototype.getComputedStyle = function () {
            var compStyle = this['__compStyle'];
            if (!compStyle) {
                compStyle = window.getComputedStyle(this.htmlElement);
                this['__compStyle'] = compStyle;
            }
            return compStyle;
        };
        _DOMElementAdapter.prototype.getProp = function (propName, args) {
            return _getDOMProp(this, propName, args);
        };
        _DOMElementAdapter.prototype.setProp = function (propName, value, args) {
            _setDOMProp(this, propName, value, args);
        };
        _DOMElementAdapter.prototype._clearComputerData = function () {
            // @TODO: Discover to clear data when is no longer used
            // this.compStyle = undefined;
        };
        _DOMElementAdapter.prototype.waitFor = function (waitFor, onDone, args) {
            switch (waitFor.what) {
                case WaitForWhat.ImageLoad:
                    _waitForImageLoad(this.htmlElement, args);
                    break;
                case WaitForWhat.MediaSync:
                    _waitForMediaSync(this.htmlElement, args, waitFor.value);
                    break;
            }
        };
        return _DOMElementAdapter;
    }(_ElementAdapter));
    ABeamer._DOMElementAdapter = _DOMElementAdapter;
    // ------------------------------------------------------------------------
    //                               _SVGElementAdapter
    // ------------------------------------------------------------------------
    /** This feature is not implemented yet..._Coming soon_ . */
    var _SVGElementAdapter = /** @class */ (function (_super) {
        __extends(_SVGElementAdapter, _super);
        function _SVGElementAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return _SVGElementAdapter;
    }(_ElementAdapter));
    // ------------------------------------------------------------------------
    //                               _VirtualElementAdapter
    // ------------------------------------------------------------------------
    /**
     * Virtual Element adapter.
     * Allows ABeamer to decouple from the details of any virtual element.
     */
    var _VirtualElementAdapter = /** @class */ (function (_super) {
        __extends(_VirtualElementAdapter, _super);
        function _VirtualElementAdapter(element) {
            var _this = _super.call(this, element) || this;
            _this.isVirtual = true;
            _this.vElement = element;
            return _this;
        }
        _VirtualElementAdapter.prototype.getProp = function (propName, args) {
            return this.vElement.getProp(propName, args);
        };
        _VirtualElementAdapter.prototype.setProp = function (propName, value, args) {
            this.vElement.setProp(propName, value, args);
        };
        _VirtualElementAdapter.prototype.waitFor = function (waitItem, onDone, args) {
            this.vElement.waitFor(waitItem, onDone, args);
        };
        return _VirtualElementAdapter;
    }(_ElementAdapter));
    // ------------------------------------------------------------------------
    //                               Global Utility Functions
    // ------------------------------------------------------------------------
    /**
     * Returns true if the element is Virtual.
     */
    ABeamer._isElementVirtual = function (element) {
        return element.getProp !== undefined;
    };
    /**
     * Returns true if the id is Virtual.
     */
    ABeamer._isIdVirtual = function (id) { return id[0] === '%'; };
    /**
     * Safely retrieves the Virtual Element from `story.onGetVirtualElement`.
     */
    function _getVirtualElement(story, fullId) {
        if (!story.onGetVirtualElement) {
            ABeamer.throwErr("Story must have onGetVirtualElement to support virtual elements mapping");
        }
        return story.onGetVirtualElement(fullId.substr(1), story._args);
    }
    ABeamer._getVirtualElement = _getVirtualElement;
    // ------------------------------------------------------------------------
    //                               SceneAdapter
    // ------------------------------------------------------------------------
    /**
     * Returns true if the Scene is Virtual.
     */
    ABeamer._isVirtualScene = function (sceneSelector) {
        return typeof sceneSelector === 'object' &&
            sceneSelector.query !== undefined;
    };
    /**
     * Virtual Scene adapter.
     * Allows ABeamer to decouple from the details of any virtual scene.
     */
    var _SceneAdapter = /** @class */ (function (_super) {
        __extends(_SceneAdapter, _super);
        function _SceneAdapter(sceneSelector) {
            return _super.call(this) || this;
        }
        return _SceneAdapter;
    }(_AbstractAdapter));
    ABeamer._SceneAdapter = _SceneAdapter;
    // ------------------------------------------------------------------------
    //                               _DOMSceneAdapter
    // ------------------------------------------------------------------------
    /**
     * DOM Scene and Story adapter.
     * Both of them are similar. No need for 2 separated classes.
     * Gets and sets properties from HTMLElements.
     * Maps the animation property names into DOM attributes.
     */
    var _DOMSceneAdapter = /** @class */ (function (_super) {
        __extends(_DOMSceneAdapter, _super);
        function _DOMSceneAdapter(sceneSelector) {
            var _this = _super.call(this, sceneSelector) || this;
            _this.$scene = typeof sceneSelector === 'string' ? $(sceneSelector)
                : sceneSelector;
            ABeamer.throwIfI8n(!_this.$scene.length, ABeamer.Msgs.NoEmptySelector, { p: sceneSelector });
            _this.htmlElement = _this.$scene.get(0);
            _this.isVirtual = false;
            return _this;
        }
        /**
         * Requests the DOM engine the calculated information for CSS property.
         */
        _DOMSceneAdapter.prototype.getComputedStyle = function () {
            var compStyle = this['__compStyle'];
            if (!compStyle) {
                compStyle = window.getComputedStyle(this.htmlElement);
                this['__compStyle'] = compStyle;
            }
            return compStyle;
        };
        _DOMSceneAdapter.prototype.getProp = function (propName, args) {
            switch (propName) {
                // story attributes
                case 'fps':
                    return parseInt(document.body.getAttribute('data-fps'));
                case 'frame-width':
                    return document.body.clientWidth;
                case 'frame-height':
                    return document.body.clientHeight;
                // scene attributes
                case 'id': return this.htmlElement.id;
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
        };
        _DOMSceneAdapter.prototype.setProp = function (propName, value, args) {
            switch (propName) {
                // story attributes
                case 'clip-path':
                    this.htmlElement.style.clipPath = value;
                    break;
                case 'frame-width':
                    document.body.style.width = value + 'px';
                    break;
                case 'frame-height':
                    document.body.style.height = value + 'px';
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
        };
        _DOMSceneAdapter.prototype.query = function (selector, iterator) {
            this.$scene.find(selector).each(function (index, element) {
                iterator(element, index);
            });
        };
        return _DOMSceneAdapter;
    }(_SceneAdapter));
    ABeamer._DOMSceneAdapter = _DOMSceneAdapter;
    // ------------------------------------------------------------------------
    //                               _VirtualSceneAdapter
    // ------------------------------------------------------------------------
    var _VirtualSceneAdapter = /** @class */ (function (_super) {
        __extends(_VirtualSceneAdapter, _super);
        function _VirtualSceneAdapter(sceneSelector) {
            var _this = _super.call(this, sceneSelector) || this;
            _this.vScene = sceneSelector;
            _this.isVirtual = true;
            return _this;
        }
        _VirtualSceneAdapter.prototype.getProp = function (propName, args) {
            return this.vScene.getProp(propName, args);
        };
        _VirtualSceneAdapter.prototype.setProp = function (propName, value, args) {
            this.vScene.setProp(propName, value, args);
        };
        _VirtualSceneAdapter.prototype.query = function (selector, iterator) {
            this.vScene.query(selector, iterator);
        };
        return _VirtualSceneAdapter;
    }(_SceneAdapter));
    ABeamer._VirtualSceneAdapter = _VirtualSceneAdapter;
    // ------------------------------------------------------------------------
    //                               Factory
    // ------------------------------------------------------------------------
    /**
     * Creates and Adds an Element Adapter defined by a Element selector
     * to a list of ElementAdapters.
     */
    function _addElementAdapter(story, elementOrStr, elementAdapters, isVirtual, isString) {
        var element;
        if ((isString !== false) && (isString || typeof elementOrStr === 'string')) {
            if ((isVirtual === false) ||
                (isVirtual === undefined && !ABeamer._isIdVirtual(elementOrStr))) {
                ABeamer.throwErr("selector " + elementOrStr + " must be virtual");
            }
            element = _getVirtualElement(story, elementOrStr);
            isVirtual = true;
        }
        else {
            element = elementOrStr;
        }
        isVirtual = isVirtual || ABeamer._isElementVirtual(element);
        elementAdapters.push(isVirtual ? new _VirtualElementAdapter(element) :
            new _DOMElementAdapter(element));
    }
    /**
     * Parses the user defined Element Selector, returning an Element Adapter
     */
    function _parseInElSelector(story, elementAdapters, sceneAdpt, elSelector) {
        // test of _pEls
        if (elSelector.__laserMarker__ !== undefined) {
            return elSelector._elementAdapters;
        }
        if (typeof elSelector === 'function') {
            elSelector = elSelector(story._args);
        }
        if (typeof elSelector === 'string') {
            if (ABeamer._isIdVirtual(elSelector)) {
                _addElementAdapter(story, elSelector, elementAdapters, true, true);
            }
            else {
                sceneAdpt.query(elSelector, function (element, index) {
                    _addElementAdapter(story, element, elementAdapters, false, false);
                });
            }
        }
        else {
            if (typeof elSelector === 'object' && (elSelector.length !== undefined)) {
                if (!elSelector.length) {
                    return;
                }
                (elSelector).forEach(function (element) {
                    _addElementAdapter(story, element, elementAdapters);
                });
            }
            else {
                ABeamer.throwI8n(ABeamer.Msgs.UnknownType, { p: elSelector.toString() });
            }
        }
        return elementAdapters;
    }
    ABeamer._parseInElSelector = _parseInElSelector;
    // ------------------------------------------------------------------------
    //                               Wait Events
    // ------------------------------------------------------------------------
    function _waitForImageLoad(elImg, args) {
        if (!elImg.complete) {
            args.waitMan.addWaitFunc(function (_args, params, onDone) {
                if (!elImg.complete) {
                    elImg.addEventListener('load', function () {
                        onDone();
                    }, { once: true });
                }
                else {
                    onDone();
                }
            }, {});
        }
    }
    function _waitForMediaSync(elMedia, args, pos) {
        args.waitMan.addWaitFunc(function (_args, params, onDone) {
            // @TODO: Find a way to sync video.
            // this code doesn't work on chrome.
            if (pos !== undefined) {
                if (elMedia.readyState < 3) {
                    elMedia.addEventListener('loadeddata', function () {
                        _waitForMediaSync(elMedia, args, pos);
                    }, { once: true });
                    return;
                }
                elMedia.addEventListener('seeked', function () {
                    // #debug-start
                    if (_args.isVerbose) {
                        args.story.logFrmt("video-sync: ", [
                            ['expected', pos],
                            ['actual', elMedia.currentTime],
                        ], ABeamer.LT_MSG);
                    }
                    // #debug-end
                    onDone();
                }, { once: true });
                elMedia.currentTime = pos;
            }
            else {
                onDone();
            }
        }, {});
    }
    function _handleWaitFor(args, params, onDone) {
        params.elAdapter.waitFor(params.waitFor, onDone, args);
    }
    ABeamer._handleWaitFor = _handleWaitFor;
    // ------------------------------------------------------------------------
    //                               Browser
    // ------------------------------------------------------------------------
    /**
     * List of CSS properties by vendor prefix that aren't caught by
     * `window.getComputedStyle`
     */
    var FORCED_PROP_REMAPS = {
        '-webkit-': ['background-clip'],
    };
    var vendorRegEx = /^(-webkit-|-moz-|-ie-|-ms-)(.*)$/;
    /**
     * Maps an input CSS property into the current CSS property, adding a prefixed
     * CSS property if necessary.
     */
    function _propNameToVendorProps(propName) {
        var subPropName = propName.replace(vendorRegEx, '$2');
        var mapValue = domPropMapper[subPropName];
        if (mapValue && mapValue[1] && mapValue[1] !== subPropName) {
            return [subPropName, mapValue[1]];
        }
        return [subPropName];
    }
    ABeamer._propNameToVendorProps = _propNameToVendorProps;
    /**
     * Adds a vendor prefixed CSS properties to the domPropMapper.
     */
    function _addPropToDomPropMapper(subPropName, propName) {
        var mapValue = domPropMapper[subPropName];
        var propType = mapValue !== undefined ? mapValue[0] : ABeamer.DPT_STYLE;
        domPropMapper[propName] = [propType, propName];
        domPropMapper[subPropName] = [propType, propName];
    }
    /**
     * Discovers the vendor prefix and vendor prefixed CSS properties
     * by using `window.getComputedStyle`.
     */
    function _initBrowser() {
        var cssMap = window.getComputedStyle(document.body);
        var cssMapLen = cssMap.length;
        var foundVendorPrefix = false;
        var _loop_1 = function (i) {
            var propName = cssMap[i];
            var parts = propName.match(vendorRegEx);
            if (parts) {
                if (!foundVendorPrefix) {
                    var vendorPrefix_1 = parts[1];
                    ABeamer.browser.vendorPrefix = vendorPrefix_1;
                    foundVendorPrefix = true;
                    var forcedProps = FORCED_PROP_REMAPS[vendorPrefix_1];
                    if (forcedProps) {
                        forcedProps.forEach(function (forcedProp) {
                            _addPropToDomPropMapper(forcedProp, vendorPrefix_1 + forcedProp);
                        });
                    }
                }
                var subPropName = parts[2];
                ABeamer.browser.prefixedProps.push(subPropName);
                _addPropToDomPropMapper(subPropName, propName);
            }
        };
        for (var i = 0; i < cssMapLen; i++) {
            _loop_1(i);
        }
    }
    // executed at startup
    _initBrowser();
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=adapters.js.map