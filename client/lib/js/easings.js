"use strict";
// uuid: 03041456-df2c-4ae0-bbe2-56c597f03155
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Adapts the easing functions from jquery.easing.min.js to ABeamer interface
// and implements extra built-in easings
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **easing**  is a interpolator runs `t` from [0, 1], where
 * `t=0` is the first frame and `t=1` the last frame of the animation.
 * This interpolator can be viewed as the speed interpolator and its the
 * first one in the Animation Pipeline.
 * The output value will be used to feed the [](#oscillator).
 * Usually outputs a value from [0, 1] but other values are also possible.
 *
 * This interpolator can be used outside physical motion (left/right/top/bottom).
 * In cases of textual property, such as `color`, `text`, `src`,
 * the easing will define how quickly those values will change
 * among a list defined `valueText` or by using `valueFormat`.
 * In this case, the `startValue` and `value` should be between [0, 1].
 * Setting a `startValue` higher than `value`,
 * will reverse the direction of the changes.
 *
 * The easing can also be used to define the speed of the changes
 * of multi-parameter properties, such as `text-shadow`, by using as an input
 * of a `valueFormat`.
 *
 * This is the first stage of the Animation Pipeline.
 *
 *
 * An easing can be defined by:
 * 1. Name - It will use the list of easings predefined or added via plugins.
 * 2. Expression - It evaluate the expression for each frame, passing the variable `t`.
 * 3. Code Handler - This function will receive the variable `t`.
 *
 * **WARNING** Code Handlers aren't [teleported](teleporter),
 * therefore it can't be used in remote rendering.
 *
 * ## Built-in easings
 *
 * ABeamer includes a list of the most common easings by
 * bundling the jquery.easing plugin.
 * More can be added via plugins.
 *
 * @see http://gsgd.co.uk/sandbox/jquery/easing
 *
 * @default linear
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Easings
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    ABeamer._easingFunctions = {
        linear: function (t) {
            return t;
        },
    };
    var excludeFunctions = ['linear', 'swing', '_default', 'def'];
    Object.keys($.easing).forEach(function (name) {
        if (excludeFunctions.indexOf(name) !== -1) {
            return;
        }
        ABeamer._easingFunctions[name] = function (t) { return $.easing[name](0, t, 0, 1, 1); };
    });
    function _expressionEasing(t, params, args) {
        ABeamer._vars.t = t;
        return parseFloat(ABeamer._computeExpression(params.__expression, args));
    }
    ABeamer._expressionEasing = _expressionEasing;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=easings.js.map