"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Implements a list of core paths

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 * In the ABeamer 2.x the core paths will move into this plugin.
 * To prevent breaking changes include now the js script `core-paths.js` on the html file.
 *
 */
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'abeamer.core-paths',
    uuid: '1f43711e-d3e7-49bb-a26f-156f05597682',
    author: 'Alexandre Bento Freire',
    email: 'abeamer@a-bentofreire.com',
    jsUrls: ['plugins/core-paths/core-paths.js'],
    teleportable: true,
  });
}
