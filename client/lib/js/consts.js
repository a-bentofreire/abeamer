"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Defines global constants
/** @module shared   | This module will generate a shared/lib file */
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Defines global constants.
 *
 * This module will generate a node module,
 * therefore it can't contain external references.
 */
var ABeamer;
(function (ABeamer) {
    // ------------------------------------------------------------------------
    //                               Logging Type
    // ------------------------------------------------------------------------
    ABeamer.LT_MSG = 0;
    ABeamer.LT_WARN = 1;
    ABeamer.LT_ERROR = 2;
    // ------------------------------------------------------------------------
    //                               Logging Level
    // ------------------------------------------------------------------------
    ABeamer.LL_SILENT = 0;
    ABeamer.LL_ERROR = 1;
    ABeamer.LL_WARN = 2;
    ABeamer.LL_VERBOSE = 3;
    // ------------------------------------------------------------------------
    //                               Args Stage
    // ------------------------------------------------------------------------
    ABeamer.AS_UNKNOWN = 0;
    ABeamer.AS_ADD_ANIMATION = 1;
    ABeamer.AS_RENDERING = 2;
    ABeamer.AS_STORY = 3;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=consts.js.map