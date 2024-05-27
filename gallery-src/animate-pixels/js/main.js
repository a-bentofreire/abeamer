"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    scene1
        // move the bug to the left and the letters to the bottom
        .addAnimations([{
            selector: '#bug',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    value: -80,
                },
            ],
        },
        {
            selector: '#w2',
            duration: '0.7s',
            position: '0.1s',
            props: [
                {
                    prop: 'top',
                    easing: 'easeInCubic',
                    value: 35,
                },
                {
                    prop: 'left',
                    easing: 'easeInCubic',
                    value: 30,
                },
            ],
        },
        {
            selector: '#w1',
            duration: '0.5s',
            position: '0.3s',
            props: [
                {
                    prop: 'top',
                    easing: 'easeInCubic',
                    value: 30,
                },
                {
                    prop: 'left',
                    easing: 'easeInCubic',
                    value: -30,
                },
            ],
        }])
        .addAnimations([{
            // place it on the top and set the correct letters
            selector: '#w1',
            duration: 1,
            props: [{
                    prop: 'text',
                    valueText: ['m'],
                },
                {
                    prop: 'top',
                    value: -30,
                }],
        },
        {
            selector: '#w2',
            duration: 1,
            props: [{
                    prop: 'text',
                    valueText: ['r'],
                },
                {
                    prop: 'top',
                    value: -30,
                }],
        }])
        .addAnimations([{
            // returns to the original position
            selector: '#w1, #w2',
            duration: '0.25s',
            props: [
                {
                    prop: 'top',
                    easing: 'easeOutQuad',
                    value: 0,
                },
                {
                    prop: 'left',
                    easing: 'easeOutQuad',
                    value: 0,
                },
            ],
        }])
        .addStills('0.5s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map