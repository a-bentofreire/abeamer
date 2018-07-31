"use strict";
// uuid: ed166757-f4d6-4dfd-bc0c-f2682d3e783b
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of core functions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In the ABeamer 2.x the core functions will move into this plugin.
 * To prevent breaking changes include now the js script `core-functions.js` on the html file.
 *
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.core-functions',
        uuid: '3e5d5813-348a-4eb1-a8b5-9c87c3988923',
        author: 'Alexandre Bento Freire',
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/core-functions/core-functions.js'],
        teleportable: true,
    });
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=core-functions.js.map