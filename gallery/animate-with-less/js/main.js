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
            selector: '#type, #java',
            duration: '3s',
            props: [
                {
                    prop: 'top',
                    oscillator: {
                        handler: 'damped',
                        params: {
                            frequency: 2,
                        },
                    },
                    value: '=iff(elIndex==0, 30, 100)',
                },
            ],
        }])
        .addStills('0.5s')
        .addAnimations([{
            selector: '#type, #java',
            duration: '1s',
            props: [
                {
                    prop: 'top',
                    value: '=iff(elIndex==0, 30, 100)',
                },
            ],
        }])
        .addAnimations([{
            selector: '#type, #script',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    easing: 'easeOutElastic',
                    value: '-195',
                },
            ],
        },
        {
            selector: '#less',
            props: [
                {
                    prop: 'display',
                    valueText: ['inline'],
                    duration: 1,
                }, {
                    prop: 'left',
                    easing: 'easeOutElastic',
                    duration: '1s',
                    value: 0,
                }
            ],
        }])
        .addAnimations([{
            selector: '#less',
            position: '+0.5s',
            duration: '3s',
            props: [
                {
                    prop: 'transform',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 2,
                        },
                    },
                    valueStart: 0,
                    valueFormat: 'rotateX(%fdeg)',
                    value: 90,
                }, {
                    prop: 'text',
                    duration: '1.5s',
                    iterationCount: 2,
                    valueText: ['SCSS', 'LESS'],
                }
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map