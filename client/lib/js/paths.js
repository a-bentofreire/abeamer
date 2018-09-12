"use strict";
// uuid: 3d515a83-c625-4829-bc61-de6eb79b72cd
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **path** is an interpolator function where the input is the result of the
 * oscillator interpolator after the easing interpolator usually,
 * goes from [0, 1] and the output is an list of numbers,
 * representing the n-dimensions of a path.
 * To reverse the direction path, set `value = -1` and `valueStart = 0`.
 * To follow only a segment of the path, set both `value` and `valueStart`.
 *
 * Multi-dimension paths are mutual exclusive with textual `valueText`.
 *
 * Single-dimensions paths work similar to easings and oscillators.
 * These paths use the easing to define the speed and the path
 * can create post-effects such as steps.
 * The output of the a single-path value isn't stored in the Action Link, unlike
 * the oscillator.
 *
 * A multi-dimension path can be used in the following ways:
 *
 * - via `valueFormat`. Allows to encode that path in a single property.
 *    Used in `text-shadow`, `transform`.
 * - via dual-properties.
 *
 * ABeamer has the following built-in dual-properties:
 *
 * - Interpolate the following CSS properties for DOM Elements:
 *    * `left-top`.
 *    * `right-top`.
 *    * `left-bottom`.
 *    * `right-bottom`.
 *
 * - Interpolate n parameters via `valueFormat`.
 *  example:
 *  ```json
 * { selector: 'text-shadow',
 *   props: [{
 *     valueFormat: '%dpx %dpx 2px black',
 *     path: {
 *       handler: 'circle',
 *       params: {
 *          radius: 6px,
 *       },
 *     }
 *   }]
 * }
 *
 * - Interpolate n-dimension paths for virtual elements.
 *     Virtual Elements such as WebGL can use 3D paths to move their objects.
 *
 * ## Core paths
 * **WARNING!** In the ABeamer 2.x these core paths will move `core-paths` plugin.
 * To prevent breaking changes include now the js script `core-paths.js` on the html file.
 *
 *  ABeamer has the following core paths:
 *  - `line`
 *  - `rect`
 *  - `circle`
 *  - `ellipse`
 *
 * @see gallery/gallery-path
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Paths
    // ------------------------------------------------------------------------
    /** List of the built-in paths */
    var PathName;
    (function (PathName) {
        PathName[PathName["line"] = 0] = "line";
        PathName[PathName["rect"] = 1] = "rect";
        PathName[PathName["circle"] = 2] = "circle";
        PathName[PathName["ellipse"] = 3] = "ellipse";
    })(PathName = ABeamer.PathName || (ABeamer.PathName = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    /** Map of the built-in path functions, plus the ones added via plugins. */
    ABeamer._pathFunctions = {};
    function _pathNumToStr(num) {
        return PathName[num];
    }
    ABeamer._pathNumToStr = _pathNumToStr;
    function _expressionPath(t, params, _stage, args) {
        _vars.t = t;
        var v = ABeamer.calcExpr(params._expression, args);
        return Array.isArray(v) ? v : [parseFloat(v)];
    }
    ABeamer._expressionPath = _expressionPath;
    ABeamer._pathFunctions['line'] = _linePath;
    /** Implements the Line Path */
    function _linePath(t, params, _stage, args) {
        if (!params._isPrepared) {
            params._x0 = ABeamer.ExprOrNumToNum(params.x0, 0, args);
            params._y0 = ABeamer.ExprOrNumToNum(params.y0, 0, args);
            params._sx = ABeamer.ExprOrNumToNum(params.x1, 1, args) - params._x0;
            params._sy = ABeamer.ExprOrNumToNum(params.y1, 1, args) - params._y0;
        }
        return [params._sx * t + params._x0, params._sy * t + params._y0];
    }
    ABeamer._pathFunctions['rect'] = _rectPath;
    /** Implements the Rect Path */
    function _rectPath(t, params, _stage, args) {
        if (!params._isPrepared) {
            params._isPrepared = true;
            params._x0 = ABeamer.ExprOrNumToNum(params.x0, 0, args);
            params._y0 = ABeamer.ExprOrNumToNum(params.y0, 0, args);
            params._x1 = ABeamer.ExprOrNumToNum(params.x1, 1, args);
            params._y1 = ABeamer.ExprOrNumToNum(params.y1, 1, args);
            params._dx = params._x1 - params._x0;
            params._dy = params._y1 - params._y0;
            var divider = 1 / (2 * (params._dx + params._dy));
            params._xSlot = params._dx * divider;
            params._ySlot = params._dy * divider;
        }
        if (t < 0) {
            return [params._x0, params._y0];
        }
        if (t <= params._xSlot) {
            return [params._x0 + params._dx * t / params._xSlot, params._y0];
        }
        t -= params._xSlot;
        if (t <= params._ySlot) {
            return [params._x1, params._y0 + params._dy * t / params._ySlot];
        }
        t -= params._ySlot;
        if (t <= params._xSlot) {
            return [params._x1 - params._dx * t / params._xSlot, params._y1];
        }
        t -= params._xSlot;
        if (t <= params._ySlot) {
            return [params._x0, params._y1 - params._dy * t / params._ySlot];
        }
        return [params._x1, params._y1];
    }
    /** Common Implementation of the Circle and Ellipse Path */
    function _interpolateEllipse(t, params, radiusX, radiusY, _stage, args) {
        if (!params._isPrepared) {
            params._isPrepared = true;
            params._centerX = ABeamer.ExprOrNumToNum(params.centerX, 0, args);
            params._centerY = ABeamer.ExprOrNumToNum(params.centerY, 0, args);
            params._radiusX = ABeamer.ExprOrNumToNum(radiusX, 1, args);
            params._radiusY = ABeamer.ExprOrNumToNum(radiusY, 1, args);
        }
        t = 2 * Math.PI * t;
        return [
            Math.cos(t) * params._radiusX + params._centerX,
            Math.sin(t) * params._radiusY + params._centerY
        ];
    }
    ABeamer._pathFunctions['circle'] = _circlePath;
    /** Implements the Circle Path */
    function _circlePath(t, params, stage, args) {
        return _interpolateEllipse(t, params, params.radius, params.radius, stage, args);
    }
    ABeamer._pathFunctions['ellipse'] = _ellipsePath;
    /** Implements the Ellipse Path */
    function _ellipsePath(t, params, stage, args) {
        return _interpolateEllipse(t, params, params.radiusX, params.radiusY, stage, args);
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=paths.js.map