"use strict";
// uuid: 356b847c-3d7b-491d-86de-715dc4c4bb9f

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { Exact } from "../exact.js";

namespace Tests {

    const ERR_EMPTY_SEL = 'Selector #t1 is empty';

    Exact.runTestSuite(__filename, {
        fps: 8,
        css: `#t0 {left:20px}`,
        animes:
            [{
                selector: '#t1',
                props: [{
                    prop: 'left',
                    duration: '1s',
                    value: 40,
                }],
            },
            {
                selector: '#t0',
                props: [{
                    prop: 'left',
                    duration: '1s',
                    value: 140,
                }],
            }],
        html: Exact.genTestHtml(1),
    },
        {
            expectedErrors: [ERR_EMPTY_SEL],

            tests: {
                'missing t1 is bypass gracefully':
                    (rd: Exact.ExactResult, done) => {
                        // @TODO: convert to proper tagging 
                        Exact.AssertHasLine(rd, ERR_EMPTY_SEL, true);
                        done();
                    },
                't0 moves as normal': (rd: Exact.ExactResult, done) => {
                    rd.actions.isIdPropActions('t0', 'left',
                        Exact.simulatePixelAction(
                            Exact.interpolateMinMax(20, 140, rd.fps)));
                    done();
                },
            },
        });
}
