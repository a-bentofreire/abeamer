"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", () => {
    const story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    const d = '4s';
    const scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#text',
            duration: d,
            // [TOPIC] The 'decipher' text task generates a random list of texts
            // that gradually reveal the hidden text.
            tasks: [{
                    handler: 'decipher',
                    params: {
                        text: 'JUPITER',
                        iterations: 30,
                        revealCharIterations: 3,
                        revealDirection: ABeamer.RevealDir.toCenter,
                    },
                }],
        },
        {
            // Creates a counter.
            selector: '#year',
            duration: d,
            props: [{
                    prop: 'text',
                    valueStart: 0,
                    value: 2050,
                    valueFormat: '%d',
                }],
        },
        {
            // fades in the mission text.
            selector: '#mission',
            duration: d,
            props: [{
                    prop: 'opacity',
                }],
        }])
        .addStills('1s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map