"use strict";
// uuid: a8ed448c-9a89-4963-b08b-d1e82bf03f2d
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
            selector: '#O1',
            props: [
                {
                    prop: 'opacity',
                    duration: '0.5s',
                }
            ],
        }])
        .addAnimations([{
            selector: '#O2',
            props: [
                {
                    prop: 'opacity',
                    duration: '0.5s',
                },
                {
                    prop: 'transform',
                    valueFormat: 'rotate(%fdeg)',
                    duration: '1s',
                    position: '+0.5s',
                    value: 100,
                }
            ],
        }])
        .addAnimations([{
            selector: '#O2',
            props: [
                {
                    prop: 'opacity',
                    value: 0,
                    duration: '0.5s',
                }
            ],
        }, {
            selector: '#O3',
            props: [
                {
                    prop: 'opacity',
                    duration: '0.5s',
                }
            ],
        }]).addAnimations([{
            selector: '#O4',
            props: [
                {
                    prop: 'opacity',
                    duration: '0.5s',
                },
                {
                    prop: 'transform',
                    valueFormat: 'rotate(%fdeg)',
                    duration: '1s',
                    position: '+0.5s',
                    value: 100,
                }
            ],
        }]).addAnimations([{
            selector: '#O4',
            props: [
                {
                    prop: 'opacity',
                    value: 0,
                    duration: '0.5s',
                }
            ],
        }])
        .addAnimations([{
            selector: '#O1, #O3, #O1B, #O3B',
            props: [
                {
                    prop: 'transform',
                    valueFormat: 'rotateX(%fdeg)',
                    value: 75,
                    duration: '0.5s',
                }
            ],
        }])
        .addAnimations([{
            selector: '#O1, #O3, #O1B, #O3B',
            props: [
                {
                    prop: 'top',
                    value: "= case(elIndex, -9, 3, 50, 62)",
                    duration: '0.5s',
                }
            ],
        }, {
            selector: '#O1B, #O3B',
            props: [
                {
                    prop: 'opacity',
                    duration: 1,
                }
            ],
        }, {
            selector: '#beamer, #animation',
            props: [
                {
                    prop: 'opacity',
                    position: '+0.2s',
                    duration: '0.5s',
                }
            ],
        }])
        .addAnimations([{
            selector: '#beamer',
            props: [
                {
                    prop: 'left',
                    duration: '1s',
                    easing: 'easeInCubic',
                    value: 52,
                },
                {
                    prop: 'left',
                    position: '+1s',
                    duration: '2s',
                    oscillator: {
                        handler: 'damped',
                        params: {},
                    },
                    value: 100,
                },
            ],
        }]).addStills('1s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map