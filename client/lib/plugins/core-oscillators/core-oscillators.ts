"use strict";
// uuid: fc2751eb-9f3b-4862-adc4-17280fd8d238

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// Implements a list of core oscillators

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 * In the ABeamer 2.x the core oscillators will move into this plugin.
 * To prevent breaking changes include now the js script `core-oscillators.js` on the html file.
 *
 */
namespace ABeamer {

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'abeamer.core-oscillators',
    uuid: 'bb845fdf-7493-4000-8b04-6ec2a386ea21',
    author: 'Alexandre Bento Freire',
    email: 'abeamer@a-bentofreire.com',
    jsUrls: ['plugins/core-oscillators/core-oscillators.js'],
    teleportable: true,
  });
}
