"use strict";
// uuid: 102c3ac7-02d0-49c5-80da-c6dcb24f243b
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of core transitions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In the ABeamer 2.x the core transitions will move into this plugin.
 * To prevent breaking changes include now the js script `core-transitions.js` on the html file.
 *
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.core-transitions',
        uuid: 'b948c9cc-60e7-4106-bb88-f038b6fa9cf4',
        author: 'Alexandre Bento Freire',
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/core-transitions/core-transitions.js'],
        teleportable: true,
    });
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=core-transitions.js.map