"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
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
    let WaitForWhat;
    (function (WaitForWhat) {
        WaitForWhat[WaitForWhat["Custom"] = 0] = "Custom";
        WaitForWhat[WaitForWhat["ImageLoad"] = 1] = "ImageLoad";
        WaitForWhat[WaitForWhat["MediaSync"] = 2] = "MediaSync";
    })(WaitForWhat = ABeamer.WaitForWhat || (ABeamer.WaitForWhat = {}));
    /**
     * It simplifies the usage of [](VirtualAnimator) by plugins.
     * In many cases plugins just need to receive the changing property,
     * in order to modify its state.
     * Override `animateProp` to receive the changing property.
     * animateProp isn't called if the property is `uid`.
     */
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
            if (name !== 'uid') {
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
    ABeamer.SimpleVirtualAnimator = SimpleVirtualAnimator;
    ABeamer.browser = {
        isMsIE: false,
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
    ABeamer.DPT_ELEMENT = 10;
    /**
     * Maps user property names to DOM property names.
     *
     * In general, property names represent style attributes.
     * This map is used to handle the special cases.
     */
    const domPropMapper = {
        'element': [ABeamer.DPT_ELEMENT, ''],
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
        'width-height': [ABeamer.DPT_DUAL_PIXELS, ['width', 'height']],
        'left-top': [ABeamer.DPT_DUAL_PIXELS, ['left', 'top']],
        'right-top': [ABeamer.DPT_DUAL_PIXELS, ['right', 'top']],
        'left-bottom': [ABeamer.DPT_DUAL_PIXELS, ['left', 'bottom']],
        'right-bottom': [ABeamer.DPT_DUAL_PIXELS, ['right', 'bottom']],
    };
    /**
     * Used to map css Properties due the differences between the web browser
     * used to build the animation and the web browser used to render the image.
     */
    const cssPropNameMapper = {};
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
        Object.keys(map).forEach(name => { cssPropNameMapper[name] = map[name]; });
    }
    ABeamer._addServerDOMPropMaps = _addServerDOMPropMaps;
    // ------------------------------------------------------------------------
    //                               _AbstractAdapter
    // ------------------------------------------------------------------------
    /**
     * Base class for all adapters: Element, Scene, Story,
     * and both DOM and virtual.
     */
    class _AbstractAdapter {
        waitFor(waitItem, onDone, args) { }
        frameRendered(args) { }
    }
    ABeamer._AbstractAdapter = _AbstractAdapter;
    // ------------------------------------------------------------------------
    //                               _ElementAdapter
    // ------------------------------------------------------------------------
    /**
     * Base class for Element adapters both DOM and virtual.
     */
    class _ElementAdapter extends _AbstractAdapter {
        constructor(element) { super(); }
        getId(args) { return this.getProp('id', args); }
        _clearComputerData() { }
    }
    ABeamer._ElementAdapter = _ElementAdapter;
    function _setDOMProp(adapter, propName, value, args) {
        const [propType, domPropName] = domPropMapper[propName]
            || [ABeamer.DPT_STYLE, propName];
        const element = adapter.htmlElement;
        switch (propType) {
            case ABeamer.DPT_CLASS:
                if (value && value.search(/(?:^| )[\-+]/) !== -1) {
                    value.split(/\s+/).forEach(aClass => {
                        const first = aClass[0];
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
                const defDisplay = element['data-abeamer-display'];
                const curDisplay = element.style.display || adapter.getComputedStyle()['display'];
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
                const cssPropName = cssPropNameMapper[domPropName] || domPropName;
                element.style[cssPropName] = value;
                break;
            case ABeamer.DPT_PIXEL:
                element.style[domPropName] = typeof value === 'number'
                    ? value + 'px' : value;
                break;
            case ABeamer.DPT_DUAL_PIXELS:
                const values = value.split(',');
                domPropName.forEach((propNameXY, index) => {
                    element.style[propNameXY] = values[index] + 'px';
                });
                break;
        }
    }
    function _NullToUnd(v) {
        return v === null ? undefined : v;
    }
    function _getDOMProp(adapter, propName, args) {
        const [propType, domPropName] = domPropMapper[propName]
            || [ABeamer.DPT_STYLE, propName];
        switch (propType) {
            case ABeamer.DPT_ELEMENT:
                return adapter.htmlElement;
            case ABeamer.DPT_MEDIA_TIME:
            // flows to `DPT_CLASS`.
            case ABeamer.DPT_CLASS:
            // flows to `DPT_ID`.
            case ABeamer.DPT_ID:
            // flows to `DPT_ATTR`.
            case ABeamer.DPT_ATTR: return _NullToUnd(adapter.htmlElement[domPropName]);
            case ABeamer.DPT_VISIBLE:
                const value = adapter.htmlElement.style.display || adapter.getComputedStyle()['display'];
                return (value === '' || value !== 'none') ? true : false;
            case ABeamer.DPT_SRC:
            // flows to DPT_ATTR_FUNC
            case ABeamer.DPT_ATTR_FUNC: return _NullToUnd(adapter.htmlElement.getAttribute(domPropName));
            case ABeamer.DPT_PIXEL:
            case ABeamer.DPT_STYLE:
                const cssPropName = cssPropNameMapper[domPropName] || domPropName;
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
            let compStyle = this['__compStyle'];
            if (!compStyle) {
                compStyle = window.getComputedStyle(this.htmlElement);
                this['__compStyle'] = compStyle;
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
            // @TODO: Discover to clear data when is no longer used
            // this.compStyle = undefined;
        }
        waitFor(waitFor, onDone, args) {
            switch (waitFor.what) {
                case WaitForWhat.ImageLoad:
                    _waitForImageLoad(this.htmlElement, args);
                    break;
                case WaitForWhat.MediaSync:
                    _waitForMediaSync(this.htmlElement, args, waitFor.value);
                    break;
            }
        }
    }
    ABeamer._DOMElementAdapter = _DOMElementAdapter;
    // ------------------------------------------------------------------------
    //                               _SVGElementAdapter
    // ------------------------------------------------------------------------
    /** This feature is not implemented yet..._Coming soon_ . */
    class _SVGElementAdapter extends _ElementAdapter {
    }
    // ------------------------------------------------------------------------
    //                               _VirtualElementAdapter
    // ------------------------------------------------------------------------
    /**
     * Virtual Element adapter.
     * Allows ABeamer to decouple from the details of any virtual element.
     */
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
    // ------------------------------------------------------------------------
    //                               Global Utility Functions
    // ------------------------------------------------------------------------
    /**
     * Returns true if the element is Virtual.
     */
    ABeamer._isElementVirtual = (element) => element.getProp !== undefined;
    /**
     * Returns true if the id is Virtual.
     */
    ABeamer._isIdVirtual = (id) => id[0] === '%';
    /**
     * Safely retrieves the Virtual Element from `story.onGetVirtualElement`.
     */
    function _getVirtualElement(story, fullId) {
        const selector = fullId.substr(1);
        // Although there is _virtualAnimatorMap and provides faster access,
        // until the access to virtualAnimators has been disabled, it can't be used.
        const animator = story._virtualAnimators.find(vAnimator => vAnimator.selector === selector);
        if (animator) {
            return animator;
        }
        if (!story.onGetVirtualElement) {
            ABeamer.throwErr(`Story must have onGetVirtualElement to support virtual elements mapping`);
        }
        return story.onGetVirtualElement(selector, story._args);
    }
    ABeamer._getVirtualElement = _getVirtualElement;
    // ------------------------------------------------------------------------
    //                               SceneAdapter
    // ------------------------------------------------------------------------
    /**
     * Returns true if the Scene is Virtual.
     */
    ABeamer._isVirtualScene = (sceneSelector) => typeof sceneSelector === 'object' &&
        sceneSelector.query !== undefined;
    /**
     * Virtual Scene adapter.
     * Allows ABeamer to decouple from the details of any virtual scene.
     */
    class _SceneAdapter extends _AbstractAdapter {
        constructor(sceneSelector) { super(); }
    }
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
    class _DOMSceneAdapter extends _SceneAdapter {
        constructor(sceneSelector) {
            super(sceneSelector);
            this.$scene = typeof sceneSelector === 'string' ? $(sceneSelector)
                : sceneSelector;
            ABeamer.throwIfI8n(!this.$scene.length, ABeamer.Msgs.NoEmptySelector, { p: sceneSelector });
            this.htmlElement = this.$scene.get(0);
            this.isVirtual = false;
        }
        /**
         * Requests the DOM engine the calculated information for CSS property.
         */
        getComputedStyle() {
            let compStyle = this['__compStyle'];
            if (!compStyle) {
                compStyle = window.getComputedStyle(this.htmlElement);
                this['__compStyle'] = compStyle;
            }
            return compStyle;
        }
        getProp(propName, args) {
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
        }
        setProp(propName, value, args) {
            const htmlElement = this.htmlElement;
            function setDim(dimName, clientDim) {
                const pxValue = value + 'px';
                document.body.style[dimName] = pxValue;
                if (clientDim !== value) {
                    htmlElement.style[dimName] = pxValue;
                }
            }
            switch (propName) {
                // story attributes
                case 'clip-path':
                    htmlElement.style.clipPath = value;
                    break;
                case 'frame-width':
                    setDim('width', htmlElement.clientWidth);
                    break;
                case 'frame-height':
                    setDim('height', htmlElement.clientHeight);
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
    ABeamer._DOMSceneAdapter = _DOMSceneAdapter;
    // ------------------------------------------------------------------------
    //                               _VirtualSceneAdapter
    // ------------------------------------------------------------------------
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
    ABeamer._VirtualSceneAdapter = _VirtualSceneAdapter;
    // ------------------------------------------------------------------------
    //                               Factory
    // ------------------------------------------------------------------------
    /**
     * Creates and Adds an Element Adapter defined by a Element selector
     * to a list of ElementAdapters.
     */
    function _addElementAdapter(story, elementOrStr, elementAdapters, isVirtual, isString) {
        let element;
        if ((isString !== false) && (isString || typeof elementOrStr === 'string')) {
            if ((isVirtual === false) ||
                (isVirtual === undefined && !ABeamer._isIdVirtual(elementOrStr))) {
                ABeamer.throwErr(`selector ${elementOrStr} must be virtual`);
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
        if (elSelector instanceof ABeamer._pEls) {
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
                sceneAdpt.query(elSelector, (element, index) => {
                    _addElementAdapter(story, element, elementAdapters, false, false);
                });
            }
        }
        else {
            if (typeof elSelector === 'object' && (elSelector.length !== undefined)) {
                if (!elSelector.length) {
                    return;
                }
                elSelector.forEach(element => {
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
            args.waitMan.addWaitFunc((_args, _params, onDone) => {
                if (!elImg.complete) {
                    elImg.addEventListener('load', () => {
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
        args.waitMan.addWaitFunc((_args, _params, onDone) => {
            // @TODO: Find a way to sync video.
            // this code doesn't work on chrome.
            if (pos !== undefined) {
                if (elMedia.readyState < 3) {
                    elMedia.addEventListener('loadeddata', () => {
                        _waitForMediaSync(elMedia, args, pos);
                    }, { once: true });
                    return;
                }
                elMedia.addEventListener('seeked', () => {
                    // #debug-start
                    if (_args.isVerbose) {
                        args.story.logFrmt('video-sync', [
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
    const FORCED_PROP_REMAPS = {
        '-webkit-': ['background-clip'],
    };
    const vendorRegEx = /^(-webkit-|-moz-|-ie-|-ms-)(.*)$/;
    /**
     * Maps an input CSS property into the current CSS property, adding a prefixed
     * CSS property if necessary.
     */
    function _propNameToVendorProps(propName) {
        const subPropName = propName.replace(vendorRegEx, '$2');
        const mapValue = domPropMapper[subPropName];
        if (mapValue && mapValue[1] && mapValue[1] !== subPropName) {
            return [subPropName, mapValue[1]];
        }
        return [subPropName];
    }
    ABeamer._propNameToVendorProps = _propNameToVendorProps;
    /**
     * Adds a vendor prefixed CSS properties to the domPropMapper.
     */
    function _addPropToDomPropMapper(subPropName, propName, canOverwrite) {
        const mapValue = domPropMapper[subPropName];
        if (!canOverwrite && mapValue !== undefined && mapValue[1][0] === '-') {
            return;
        }
        const propType = mapValue !== undefined ? mapValue[0] : ABeamer.DPT_STYLE;
        domPropMapper[propName] = [propType, propName];
        domPropMapper[subPropName] = [propType, propName];
    }
    /**
     * Discovers the vendor prefix and vendor prefixed CSS properties
     * by using `window.getComputedStyle`.
     */
    function _initBrowser(_args) {
        if (ABeamer.browser.vendorPrefix) {
            return;
        }
        const isMsIE = navigator.userAgent.search(/Trident/) !== -1;
        ABeamer.browser.isMsIE = isMsIE;
        const cssMap = window.getComputedStyle(document.body);
        const cssMapLen = (cssMap || []).length;
        let foundVendorPrefix = false;
        for (let i = 0; i < cssMapLen; i++) {
            const propName = cssMap[i];
            const parts = propName.match(vendorRegEx);
            if (parts) {
                if (!foundVendorPrefix) {
                    const vendorPrefix = parts[1];
                    ABeamer.browser.vendorPrefix = vendorPrefix;
                    foundVendorPrefix = true;
                    const forcedProps = FORCED_PROP_REMAPS[vendorPrefix];
                    if (forcedProps) {
                        forcedProps.forEach(forcedProp => {
                            _addPropToDomPropMapper(forcedProp, vendorPrefix + forcedProp, !isMsIE);
                        });
                    }
                }
                const subPropName = parts[2];
                ABeamer.browser.prefixedProps.push(subPropName);
                _addPropToDomPropMapper(subPropName, propName, !isMsIE);
            }
        }
    }
    ABeamer._initBrowser = _initBrowser;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=adapters.js.map