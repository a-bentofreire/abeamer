"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
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
    let RevealDir;
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
        email: 'abeamer@a-bentofreire.com',
        jsUrls: ['plugins/text-tasks/text-tasks.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    function _textSplitter(params) {
        const text = params.text;
        return params.splitBy === 'word' ?
            text.replace(/(\s+)/g, '\0$1').split(/\0/) : text.split('');
    }
    // ------------------------------------------------------------------------
    //                               text-split Task
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addTasks([['text-split', _textSplit]]);
    /** Implements the Text Split Task */
    function _textSplit(anime, _wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                const inTextArray = _textSplitter(params);
                const elAdapters = args.scene.getElementAdapters(anime.selector);
                const inTextHtml = inTextArray.map((item, index) => `<span data-index="${index}" data="${item.replace(/[\n"']/g, '')}">`
                    + `${item.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')}</span>`);
                elAdapters.forEach(elAdapter => {
                    elAdapter.setProp('html', inTextHtml.join(''), args);
                    if (params.realign && !elAdapter.isVirtual) {
                        const $spans = $(elAdapter.htmlElement).find('span');
                        let left = 0;
                        $spans.each((_index, domEl) => {
                            domEl.style.left = `${left}px`;
                            left += domEl.clientWidth;
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
    function _typewriter(anime, _wkTask, params, stage, _args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                const textInter = [];
                const inTextArray = _textSplitter(params);
                const len = inTextArray.length;
                const hasCursor = params.cursor !== undefined;
                const cursorChar = hasCursor ? params.cursorChar || '▐' : '';
                let accText = '';
                for (let i = 0; i < len; i++) {
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
    function _decipherTask(anime, _wkTask, params, stage, _args) {
        function isInsideRange(code, ranges) {
            return ranges.findIndex(range => range[0] <= code && range[1] >= code)
                !== -1 ? ranges : undefined;
        }
        function reveal(textInter, text, _textLen, rangesByIndex, _revealDir, revealCharIterations, i, scale) {
            if (rangesByIndex[i]) {
                scale++;
                let textInterPos = textInter.length - 1;
                const downCounter = revealCharIterations * scale;
                for (let j = 0; j < downCounter; j++) {
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
                const cc_A = 'A'.charCodeAt(0);
                const cc_Z = 'Z'.charCodeAt(0);
                const cc_a = 'a'.charCodeAt(0);
                const cc_z = 'z'.charCodeAt(0);
                const cc_0 = '0'.charCodeAt(0);
                const cc_9 = '9'.charCodeAt(0);
                const iterations = params.iterations;
                const text = params.text;
                const textLen = text.length;
                const upperCharRanges = params.upperCharRanges || [[cc_A, cc_Z]];
                const lowerCharRanges = params.lowerCharRanges || [[cc_a, cc_z]];
                const digitRanges = [[cc_0, cc_9]];
                const revealCharIterations = params.revealCharIterations || 1;
                const revealDir = ABeamer.parseEnum(params.revealDirection, RevealDir, RevealDir.disabled);
                ABeamer.throwIfI8n(!ABeamer.isPositiveNatural(iterations), ABeamer.Msgs.MustNatPositive, { p: 'iterations' });
                ABeamer.throwIfI8n(!textLen, ABeamer.Msgs.NoEmptyField, { p: 'text' });
                // let usableCharsCount = 0;
                const rangesByIndex = [];
                for (let charI = 0; charI < textLen; charI++) {
                    const charCode = text.charCodeAt(charI);
                    const ranges = isInsideRange(charCode, upperCharRanges)
                        || isInsideRange(charCode, lowerCharRanges)
                        || isInsideRange(charCode, digitRanges);
                    // if (ranges) {
                    //   usableCharsCount++;
                    // }
                    rangesByIndex.push(ranges);
                }
                const textInter = [];
                for (let i = 0; i < iterations - 1; i++) {
                    const dText = text.split('');
                    for (let charI = 0; charI < textLen; charI++) {
                        const ranges = rangesByIndex[charI];
                        if (ranges) {
                            const charRangesLen = ranges.length;
                            const charRangesIndex = charRangesLen === 1 ? 0
                                : Math.floor(Math.random() * charRangesLen);
                            const charRange = ranges[charRangesIndex];
                            const range = charRange[1] - charRange[0];
                            const winnerChar = String.fromCharCode(Math.round(Math.random() * range)
                                + charRange[0]);
                            dText[charI] = winnerChar;
                        }
                    }
                    textInter.push(dText);
                }
                let scale = 0;
                switch (revealDir) {
                    case RevealDir.toLeft:
                        for (let i = textLen - 1; i >= 0; i--) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                        }
                        break;
                    case RevealDir.toRight:
                        for (let i = 0; i < textLen; i++) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                        }
                        break;
                    case RevealDir.toCenter:
                        const midLen = Math.floor(textLen / 2);
                        for (let i = midLen - 1; i >= 0; i--) {
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, i, scale);
                            scale = reveal(textInter, text, textLen, rangesByIndex, revealDir, revealCharIterations, textLen - i - 1, scale);
                        }
                        break;
                }
                textInter.push(text.split(''));
                if (!anime.props) {
                    anime.props = [];
                }
                anime.props.push({ prop: 'text', valueText: textInter.map(inter => inter.join('')) });
                return ABeamer.TR_DONE;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=text-tasks.js.map