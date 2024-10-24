"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", () => {
    const story = ABeamer.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    const scene1 = story.scenes[0];
    scene1
        .addSerialAnimations([[{
                selector: '#only',
                props: [
                    {
                        prop: 'top',
                        duration: '400ms',
                        value: 50,
                    },
                ],
            },
            {
                selector: '#buy',
                duration: '1s',
                props: [
                    {
                        prop: 'transform',
                        // uses a path to interpolate both rotateY and rotateZ
                        path: {
                            handler: 'line',
                            params: {
                                x0: -49,
                                x1: 360,
                                y0: 21,
                                y1: 0,
                            },
                        },
                        valueFormat: 'rotateY(%fdeg) rotateZ(%fdeg)',
                    }, {
                        prop: 'font-size',
                        value: 30,
                    }, {
                        prop: 'left-top',
                        path: {
                            handler: 'line',
                            params: {
                                x0: 140,
                                y0: 20,
                                x1: 8,
                                y1: 5,
                            },
                        },
                    },
                ],
            }],
        [{
                selector: '#price',
                props: [
                    {
                        prop: 'opacity',
                        duration: '400ms',
                    },
                ],
            }],
        [{
                // [TOPIC] Uses a `color-attack` to quickly flash the colors and return to the original color in the end
                selector: '#price',
                duration: '2s',
                tasks: [{
                        handler: 'color-attack',
                        params: {
                            cycles: 3,
                            attack: ['white', 'yellow', 'red', 'green'],
                        },
                    }],
            }],
    ])
        .addStills('0.5s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map