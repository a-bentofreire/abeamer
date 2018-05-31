"use strict";
// uuid: c59478ce-5f42-4538-8599-0e275fbc494f

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module internal | This module is to be read only by developers */

/**
 * ## Description
 *
 * Computes the delay between each item.
 */
namespace ABeamer {

  export interface _ItemDelay {
    /**
     * Delay of the start of the animation between 2 elements defined inside the selector.
     * The total duration of the animation will be: `duration+count*itemDelayDuration`.
     */
    duration: number;


    /**
     * Applies a modulus division to the elements defined in the selector when
     * it relates the `itemDelayDuration`.
     * A `itemDelayDuration=2`, will make the odd elements to have the same
     * `itemDelayDuration`.
     */
    grouping?: uint;


    /**
     * Applies a random changes with maximum of `itemDelayDisturbance` to the
     * `itemDelayDuration` for each element defined by the selector.
     */
    disturbance?: number;
  }


  export function _parseItemDelay(values: AnimationCommonParams,
    args: ABeamerArgs): _ItemDelay {

    if (!values.itemDelayDuration) {
      return { duration: 0 };
    }

    return {
      duration: parseTimeHandler(values.itemDelayDuration, args, 0, 0, false),
      grouping: values.itemDelayGrouping,
      disturbance: values.itemDelayDisturbance
        ? parseTimeHandler(values.itemDelayDisturbance, args, 0, 0, false) : 0,
    };
  }


  export function _computeItemDelay(it: _ItemDelay,
    elIndex: number/* , elCount: uint */): uint {

    const disturbance = it.disturbance;
    if (disturbance) {
      elIndex = elIndex + (Math.random() * 2 * disturbance) - disturbance;
    }

    return Math.max(downRound((!it.grouping ? elIndex : elIndex % it.grouping)
      * it.duration), 0);
  }
}
