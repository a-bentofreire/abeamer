"use strict";
// uuid: 57f31321-69a9-4170-96a1-6baac731403b
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of built-in text Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **text task** transforms text elements or creates complex text animation.
 *
 * This plugin has the following built-in text tasks:
 *
 * - `text-split` - Wraps words or characters with `span` tags, allowing to later
 *      animate individual words or characters.
 *
 * - `typewriter` - Creates the typewriter effect by typing individual characters
 *      or words one by one followed by a cursor.
 *
 * - `decipher` - Generates a random list of texts that gradually reveal the hidden text.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Text Tasks
    // ------------------------------------------------------------------------
    /**
     * List of the directions that instruct how the text can be revealed.
     */
    var RevealDir;
    (function (RevealDir) {
        RevealDir[RevealDir["disabled"] = 0] = "disabled";
        RevealDir[RevealDir["toRight"] = 1] = "toRight";
        RevealDir[RevealDir["toLeft"] = 2] = "toLeft";
        RevealDir[RevealDir["toCenter"] = 3] = "toCenter";
    })(RevealDir = ABeamer.RevealDir || (ABeamer.RevealDir = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.text-tasks',
        uuid: '8b547eff-a0de-446a-9753-fb8b39d8031a',
        author: 'Alexandre Bento Freire',
        email: 'dev@a-bentofreire.com',
        jsUrls: ['plugins/text-tasks/text-tasks.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    function _textSplitter(params) {
        var text = params.text;
        return params.splitBy === 'word' ?
            text.replace(/(\s+)/g, '\0$1').split(/\0/) : text.split('');
    }
    // ------------------------------------------------------------------------
    //                               text-split Task
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addTasks([['text-split', _textSplit]]);
    /** Implements the Text Split Task */
    function _textSplit(anime, wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                var inTextArray = _textSplitter(params);
                var elAdapters = args.scene.getElementAdapters(anime.selector);
                var inTextHtml_1 = inTextArray.map(function (item, index) {
                    return "<span data-index=\"" + index + "\" data=\"" + item.replace(/[\n"']/g, '') + "\">"
                        + (item.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>') + "</span>");
                });
                elAdapters.forEach(function (elAdapter) {
                    elAdapter.setProp('html', inTextHtml_1.join(''));
                    if (params.realign && !elAdapter.isVirtual) {
                        var $spans = $(elAdapter.htmlElement).find('span');
                        var left_1 = 0;
                        $spans.each(function (index, domEl) {
                            domEl.style.left = left_1 + "px";
                            left_1 += domEl.clientWidth;
                        });
                    }
                });
                return ABeamer.TR_EXIT;
        }
    }
    // ------------------------------------------------------------------------
    //                               typewriter Task
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addTasks([['typewriter', _typewriter]]);
    /** Implements the Typewriter Task */
    function _typewriter(anime, wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                var textInter = [];
                var inTextArray = _textSplitter(params);
                var len = inTextArray.length;
                var hasCursor = params.cursor !== undefined;
                var cursorChar = '';
                if (hasCursor) {
                    cursorChar = '▐';
                    if (typeof (params.cursor) === 'object') {
                        cursorChar = params.cursor.char || cursorChar;
                    }
                }
                var accText = '';
                for (var i = 0; i < len; i++) {
                    accText += inTextArray[i];
                    textInter.push(accText + cursorChar);
                }
                if (hasCursor) {
                    textInter.push(accText);
                }
                if (!anime.props) {
                    anime.props = [];
                }
                anime.props.push({ prop: 'text', valueText: textInter });
                return ABeamer.TR_DONE;
        }
    }
    // ------------------------------------------------------------------------
    //                               decipher Task
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addTasks([['decipher', _decipherTask]]);
    /** Implements the Decipher Task */
    function _decipherTask(anime, wkTask, params, stage, args) {
        function isInsideRange(code, ranges) {
            return ranges.findIndex(function (range) { return range[0] <= code && range[1] >= code; })
                !== -1 ? ranges : undefined;
        }
        function reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale) {
            if (rangesByIndex[i]) {
                scale++;
                var textInterPos = textInter.length - 1;
                var downCounter = revealCharIterations * scale;
                for (var j = 0; j < downCounter; j++) {
                    if (textInterPos < 0) {
                        return;
                    }
                    textInter[textInterPos][i] = text[i];
                    textInterPos--;
                }
            }
            return scale;
        }
        switch (stage) {
            case ABeamer.TS_INIT:
                var cc_A = 'A'.charCodeAt(0);
                var cc_Z = 'Z'.charCodeAt(0);
                var cc_a = 'a'.charCodeAt(0);
                var cc_z = 'z'.charCodeAt(0);
                var cc_0 = '0'.charCodeAt(0);
                var cc_9 = '9'.charCodeAt(0);
                var iterations = params.iterations;
                var text = params.text;
                var textLen = text.length;
                var upperCharRanges = params.upperCharRanges || [[cc_A, cc_Z]];
                var lowerCharRanges = params.lowerCharRanges || [[cc_a, cc_z]];
                var digitRanges = [[cc_0, cc_9]];
                var revealCharIterations = params.revealCharIterations || 1;
                var revealDir = params.revealDirection || RevealDir.disabled;
                if (typeof revealDir === 'string') {
                    revealDir = RevealDir[revealDir];
                }
                ABeamer.throwIfI8n(!ABeamer.isPositiveNatural(iterations), ABeamer.Msgs.MustNatPositive, { p: 'iterations' });
                ABeamer.throwIfI8n(!textLen, ABeamer.Msgs.NoEmptyField, { p: 'text' });
                var usableCharsCount = 0;
                var rangesByIndex = [];
                for (var charI = 0; charI < textLen; charI++) {
                    var charCode = text.charCodeAt(charI);
                    var ranges = isInsideRange(charCode, upperCharRanges)
                        || isInsideRange(charCode, lowerCharRanges)
                        || isInsideRange(charCode, digitRanges);
                    if (ranges) {
                        usableCharsCount++;
                    }
                    rangesByIndex.push(ranges);
                }
                var textInter = [];
                for (var i = 0; i < iterations - 1; i++) {
                    var dText = text.split('');
                    for (var charI = 0; charI < textLen; charI++) {
                        var ranges = rangesByIndex[charI];
                        if (ranges) {
                            var charRangesLen = ranges.length;
                            var charRangesIndex = charRangesLen === 1 ? 0
                                : Math.floor(Math.random() * charRangesLen);
                            var charRange = ranges[charRangesIndex];
                            var range = charRange[1] - charRange[0];
                            var winnerChar = String.fromCharCode(Math.round(Math.random() * range)
                                + charRange[0]);
                            dText[charI] = winnerChar;
                        }
                    }
                    textInter.push(dText);
                }
                var scale = 0;
                switch (revealDir) {
                    case RevealDir.toLeft:
                        for (var i = textLen - 1; i >= 0; i--) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                        }
                        break;
                    case RevealDir.toRight:
                        for (var i = 0; i < textLen; i++) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                        }
                        break;
                    case RevealDir.toCenter:
                        var midLen = Math.floor(textLen / 2);
                        for (var i = midLen - 1; i >= 0; i--) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, textLen - i - 1, scale);
                        }
                        break;
                }
                textInter.push(text.split(''));
                if (!anime.props) {
                    anime.props = [];
                }
                anime.props.push({ prop: 'text', valueText: textInter.map(function (inter) { return inter.join(''); }) });
                return ABeamer.TR_DONE;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=text-tasks.js.map