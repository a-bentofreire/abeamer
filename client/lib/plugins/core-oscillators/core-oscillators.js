"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of core oscillators
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In the ABeamer 2.x the core oscillators will move into this plugin.
 * To prevent breaking changes include now the js script `core-oscillators.js` on the html file.
 *
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.core-oscillators',
        uuid: 'bb845fdf-7493-4000-8b04-6ec2a386ea21',
        author: 'Alexandre Bento Freire',
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/core-oscillators/core-oscillators.js'],
        teleportable: true,
    });
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=core-oscillators.js.map