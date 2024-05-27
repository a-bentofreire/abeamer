"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Computes the delay between each item.
 */
var ABeamer;
(function (ABeamer) {
    function _parseItemDelay(values, args) {
        if (!values.itemDelayDuration) {
            return { duration: 0 };
        }
        return {
            duration: ABeamer.parseTimeHandler(values.itemDelayDuration, args, 0, 0, false),
            grouping: values.itemDelayGrouping,
            disturbance: values.itemDelayDisturbance
                ? ABeamer.parseTimeHandler(values.itemDelayDisturbance, args, 0, 0, false) : 0,
        };
    }
    ABeamer._parseItemDelay = _parseItemDelay;
    function _computeItemDelay(it, elIndex /* , elCount: uint */) {
        var disturbance = it.disturbance;
        if (disturbance) {
            elIndex = elIndex + (Math.random() * 2 * disturbance) - disturbance;
        }
        return Math.max(ABeamer.downRound((!it.grouping ? elIndex : elIndex % it.grouping)
            * it.duration), 0);
    }
    ABeamer._computeItemDelay = _computeItemDelay;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=item-delay.js.map