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
    var d = '5s';
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#img',
            duration: d,
            props: [
                {
                    prop: 'opacity',
                    easing: 'easeInSine',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 2,
                        },
                    },
                },
            ],
        },
        {
            selector: '#t3',
            duration: d,
            props: [
                {
                    prop: 'left',
                    easing: 'linear',
                    valueStart: 0,
                    value: 4,
                    oscillator: {
                        handler: 'damped',
                        params: {},
                    },
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map