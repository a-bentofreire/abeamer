"use strict";
// uuid: f84d57af-708e-4353-8189-15ccc7c3e81b
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            tasks: [{
                    handler: 'add-vars',
                    params: {
                        vars: {
                            // creates a dynamic var for the total seconds of the progression
                            sec: 6,
                            barCount: 10,
                        },
                    },
                }],
        },
        {
            selector: '#values',
            duration: "=sec + 's'",
            props: [
                {
                    // [TOPIC] Creates a formated counter using `valueFormat`
                    // from `valueStart` to `value`
                    prop: 'text',
                    valueStart: 0,
                    valueFormat: '%d%',
                    value: 100,
                },
                {
                    prop: 'text-shadow',
                    valueFormat: '0 0 %dpx white',
                    value: 8,
                },
            ],
        },
        {
            // creates a list of hidden bars that will be used as a progression bar.
            selector: '#bars',
            duration: "=sec + 's'",
            tasks: [
                {
                    handler: 'factory',
                    params: {
                        count: '=barCount',
                        tag: 'span',
                        attrs: [
                            {
                                name: 'class',
                                value: 'bar',
                            },
                        ],
                    },
                },
            ],
        }, {
            // shows each bar one after the other with a delay defined by `itemDelayDuration`
            selector: '.bar',
            duration: "=sec/barCount+'s'",
            props: [
                {
                    prop: 'display',
                    valueFormat: 'inline-block',
                    value: 100,
                    itemDelayDuration: "=sec/barCount+'s'",
                },
            ],
        },
        {
            selector: '#file',
            duration: "=sec + 's'",
            props: [
                {
                    prop: 'text',
                    valueText: ['project-jupiter.md', 'crew.md', 'trajectory.md', 'secret-cargo.md',
                        ''],
                },
            ],
        },
        {
            selector: '#uploading',
            duration: "=sec + 's'",
            props: [
                {
                    prop: 'opacity',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 2,
                            negativeHander: ABeamer.NegativeBuiltInFuncs.abs,
                        },
                    },
                    valueStart: 0,
                },
            ],
        }])
        .addAnimations([
        {
            selector: '#complete',
            duration: "2s",
            props: [
                {
                    prop: 'visibility',
                    duration: 1,
                    valueFormat: 'visible',
                }, {
                    prop: 'opacity',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 0.5,
                            negativeHander: ABeamer.NegativeBuiltInFuncs.abs,
                        },
                    },
                    valueText: '=1-t',
                    valueStart: 0,
                }, {
                    prop: 'text-shadow',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 0.5,
                            negativeHander: ABeamer.NegativeBuiltInFuncs.abs,
                        },
                    },
                    valueText: "='0 0 ' + round(8*(1-t)) + 'px white'",
                    valueStart: 0,
                },
            ],
        }
    ]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map