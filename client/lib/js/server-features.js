"use strict";
// uuid: c923dc86-0c1b-413d-aa1f-1a6a2666d8db
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// This file includes the list of all CSS properties that aren't pixel properties,
// mapping them to the correct property type
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * Different servers can provide different features.
 * At the moment only `puppeteer` and `phantomjs` are supported.
 * In the future, more servers can be added.
 *
 * `ServerFeatures` provides information regarding the server.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Server
    // ------------------------------------------------------------------------
    var INFO_PER_SERVER = {
        phantomjs: {
            map: {},
            features: {
                hasLogging: true,
            },
        },
        puppeteer: {
            map: {},
            features: {
                hasLogging: true,
            },
        },
    };
    // @TODO: Use feature detection to determine which properties requires prefixes.
    var BROWSERS = {
        chrome: {
            vendor: '-webkit-',
            prefix: ['background-clip'],
        },
        firefox: {
            vendor: '-moz-',
            prefix: ['background-clip'],
        },
        ie: {
            vendor: '-ms-',
            prefix: ['background-clip'],
        },
    };
    var curBrowserPrefix = BROWSERS.chrome.prefix;
    var curVendor = BROWSERS.chrome.vendor;
    /**
     * Adds server property mapping and returns the server features.
     * Used by `Story.Create` method to assign the server property mapping.
     */
    function _setServer(serverName) {
        var serverInfo = INFO_PER_SERVER[serverName];
        ABeamer._addServerDOMPropMaps(serverInfo.map);
        return serverInfo.features;
    }
    ABeamer._setServer = _setServer;
    /**
     * Maps an input CSS property into the current CSS property, adding a prefixed
     * CSS property if necessary.
     */
    function _propNameToVendorProps(propName) {
        propName = propName.replace(/(?:-webkit-|-moz-|-ie-)/, '');
        if (curBrowserPrefix.indexOf(propName) !== -1) {
            return [propName, curVendor + propName];
        }
        return [propName];
    }
    ABeamer._propNameToVendorProps = _propNameToVendorProps;
    /**
     * Initializes the `curBrowserPrefix` and `curVendor` based on the running browser.
     */
    function initBrowser() {
        // this code is credit to https://stackoverflow.com/users/938089
        // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        // @ts-ignore
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // @ts-ignore
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        // @ts-ignore
        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) ||
            (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(
            // @ts-ignore
            !window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        // @ts-ignore
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        // @ts-ignore
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        // @ts-ignore
        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        // added code
        if (isFirefox) {
            curBrowserPrefix = BROWSERS.firefox.prefix;
            curVendor = BROWSERS.firefox.vendor;
        }
        else if (isIE) {
            curBrowserPrefix = BROWSERS.ie.prefix;
            curVendor = BROWSERS.ie.vendor;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=server-features.js.map