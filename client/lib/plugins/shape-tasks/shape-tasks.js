"use strict";
// uuid: 4b9e44d3-3db7-45f8-b991-534a03125b29
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of built-in shape Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **shape task** creates a configurable shape via creating a `svg` tag.
 *
 * This plugin has the following built-in shape tasks:
 *
 * - `rectangle` - rectangle shape including round rectangle via cx,cy fields.
 * - `line` - x,y and directional shape.
 * - `circle`
 * - `speech` - round rectangle with left and right speech triangle.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Shape Tasks
    // ------------------------------------------------------------------------
    // The following section contains data for the end-user
    // generated by `gulp build-definition-files`
    // -------------------------------
    // #export-section-start: release
    var Shapes;
    (function (Shapes) {
        Shapes[Shapes["rectangle"] = 0] = "rectangle";
        Shapes[Shapes["line"] = 1] = "line";
        Shapes[Shapes["circle"] = 2] = "circle";
        Shapes[Shapes["speech"] = 3] = "speech";
    })(Shapes = ABeamer.Shapes || (ABeamer.Shapes = {}));
    ABeamer.DEFAULT_SPEECH_START = 10;
    ABeamer.DEFAULT_SPEECH_WIDTH = 10;
    ABeamer.DEFAULT_SPEECH_HEIGHT = 10;
    ABeamer.DEFAULT_SPEECH_SHIFT = 0;
    var SpeechPosition;
    (function (SpeechPosition) {
        SpeechPosition[SpeechPosition["left"] = 0] = "left";
        SpeechPosition[SpeechPosition["right"] = 1] = "right";
    })(SpeechPosition = ABeamer.SpeechPosition || (ABeamer.SpeechPosition = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.shape-tasks',
        uuid: '3e5d5813-348a-4eb1-a8b5-9c87c3988923',
        author: 'Alexandre Bento Freire',
        email: 'dev@a-bentofreire.com',
        jsUrls: ['plugins/shape-tasks/shape-tasks.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Shape Task
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addTasks([['shape', _shapeTask]]);
    /** Implements the Shape Task */
    function _shapeTask(anime, wkTask, params, stage, args) {
        function buildSvg(inTextHtml, shapeTag, width, height, attrs, x0, y0) {
            if (x0 === void 0) { x0 = 0; }
            if (y0 === void 0) { y0 = 0; }
            inTextHtml.push(" width=\"" + width + "\"");
            inTextHtml.push(" height=\"" + height + "\"");
            inTextHtml.push(" viewBox=\"" + x0 + " " + y0 + " " + width + " " + height + "\"");
            inTextHtml.push(" ><" + shapeTag);
            attrs.forEach(function (attr) {
                var name = attr[0], value = attr[1];
                if (value !== undefined) {
                    inTextHtml.push(" " + name + "=\"" + value + "\"");
                }
            });
        }
        function buildRectangle(inTextHtml, sw, sr) {
            var rw = ABeamer.ExprOrNumToNum(sr.width, 0, args);
            var rh = ABeamer.ExprOrNumToNum(sr.height, 0, args);
            var rx = ABeamer.ExprOrNumToNum(sr.rx, 0, args);
            var ry = ABeamer.ExprOrNumToNum(sr.ry, 0, args);
            buildSvg(inTextHtml, 'rect', rw, rh, [['x', sw], ['y', sw], ['rx', rx], ['ry', ry],
                ['width', rw - 2 * sw], ['height', rh - 2 * sw]]);
        }
        function buildSpeech(inTextHtml, sw, sp) {
            var w = ABeamer.ExprOrNumToNum(sp.width, 0, args);
            var h = ABeamer.ExprOrNumToNum(sp.height, 0, args);
            var srx = ABeamer.ExprOrNumToNum(sp.rx, 0, args);
            var sry = ABeamer.ExprOrNumToNum(sp.ry, 0, args);
            var x0 = -sw;
            var rx = srx || sry || 0;
            var ry = sry || rx || 0;
            var isRound = rx !== 0 && ry !== 0;
            var speechStart = Math.max(sp.speechStart || ABeamer.DEFAULT_SPEECH_START, rx);
            var speechWidth = Math.max(sp.speechWidth || ABeamer.DEFAULT_SPEECH_WIDTH, 0);
            var speechHeight = sp.speechHeight || ABeamer.DEFAULT_SPEECH_HEIGHT;
            var speechShift = sp.speechShift || ABeamer.DEFAULT_SPEECH_SHIFT;
            var path = [];
            // @TODO: fix speech shift
            if (!sp.speechPosition || sp.speechPosition === SpeechPosition.left
                || SpeechPosition[sp.speechPosition] === 'left') {
                speechShift = -speechShift - speechWidth;
                speechStart = w - speechStart - speechWidth;
            }
            path.push("M" + rx + " 0 H" + (w - rx));
            if (isRound) {
                path.push("A " + rx + " " + ry + " 0 0 1 " + w + " " + ry);
            }
            path.push("V" + (h - ry));
            if (isRound) {
                path.push("A " + rx + " " + ry + " 0 0 1 " + (w - rx) + " " + h);
            }
            path.push("h" + -speechStart);
            path.push("l" + speechShift + " " + speechHeight);
            path.push("l" + (-speechWidth - speechShift) + " " + -speechHeight);
            path.push("H" + rx);
            if (isRound) {
                path.push("A " + rx + " " + ry + " 0 0 1 0 " + (h - ry));
            }
            path.push("V" + ry);
            if (isRound) {
                path.push("A " + rx + " " + ry + " 0 0 1 " + rx + " 0");
            }
            buildSvg(inTextHtml, 'path', w + 2 * sw, h + speechHeight + 2 * sw, [['d', path.join(' ')]], x0, -sw);
        }
        function buildArrow(inTextHtml, sa, isArrow) {
            // @TODO: Build Arrow code
            var x = ABeamer.ExprOrNumToNum(sa.x, 0, args);
            var y = ABeamer.ExprOrNumToNum(sa.y, 0, args);
            var x0 = 0;
            var y0 = 0;
            var radDir;
            var len;
            if (params.direction) {
                radDir = ABeamer.ExprOrNumToNum(sa.direction, 0, args) * Math.PI / 180;
                len = ABeamer.ExprOrNumToNum(sa.length, 0, args);
                x = Math.cos(radDir) * len;
                y = Math.sin(radDir) * len;
            }
            else {
                if (isArrow) {
                }
            }
            x0 = Math.min(0, x);
            y0 = Math.min(0, y);
            if (isArrow) {
                var norm = Math.sqrt(x * x + y * y);
                // const
            }
            buildSvg(inTextHtml, 'line', Math.abs(x), Math.abs(y), [['x1', 0], ['y1', 0], ['x2', x], ['y2', y]], x0, y0);
        }
        switch (stage) {
            case ABeamer.TS_INIT:
                var sw = ABeamer.ExprOrNumToNum(params.strokeWidth, 0, args);
                var shape = params.shape;
                var inTextHtml_1 = ["<svg"];
                if (typeof shape === 'string') {
                    shape = Shapes[shape];
                }
                switch (shape) {
                    case Shapes.rectangle:
                        buildRectangle(inTextHtml_1, sw, params);
                        break;
                    case Shapes.line:
                        buildArrow(inTextHtml_1, params, false);
                        break;
                    case Shapes.circle:
                        var r = ABeamer.ExprOrNumToNum(params.radius, 0, args);
                        var r_sw = r + sw;
                        buildSvg(inTextHtml_1, 'circle', 2 * r_sw, 2 * r_sw, [['cx', r_sw], ['cy', r_sw], ['r', r]]);
                        break;
                    case Shapes.speech:
                        buildSpeech(inTextHtml_1, sw, params);
                        break;
                    default:
                        return ABeamer.TR_EXIT;
                }
                if (params.fill) {
                    inTextHtml_1.push(" fill=\"" + params.fill + "\"");
                }
                if (params.stroke) {
                    inTextHtml_1.push(" stroke=\"" + params.stroke + "\"");
                }
                if (sw) {
                    inTextHtml_1.push(" stroke-width=\"" + sw + "\"");
                }
                inTextHtml_1.push('/></svg >');
                var elAdaptors = args.scene.getElementAdapters(anime.selector);
                elAdaptors.forEach(function (elAdaptor) {
                    elAdaptor.setProp('html', elAdaptor.getProp('html') + inTextHtml_1.join(''));
                });
                return ABeamer.TR_EXIT;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=shape-tasks.js.map