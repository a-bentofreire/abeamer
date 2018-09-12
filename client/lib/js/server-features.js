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
        _default: {
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
    /**
     * Adds server property mapping and returns the server features.
     * Used by `Story.Create` method to assign the server property mapping.
     */
    function _setServer(serverName) {
        var serverInfo = INFO_PER_SERVER[serverName] || INFO_PER_SERVER._default;
        ABeamer._addServerDOMPropMaps(serverInfo.map);
        return serverInfo.features;
    }
    ABeamer._setServer = _setServer;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=server-features.js.map