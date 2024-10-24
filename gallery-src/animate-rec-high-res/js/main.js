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
    const d = '1s';
    const scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#bkg1',
            duration: d,
            props: [
                {
                    prop: 'opacity',
                    easing: 'easeInCubic',
                    value: 1,
                    iterationCount: 2,
                    direction: ABeamer.Directions.alternate,
                },
            ],
        },
        {
            selector: '#rec',
            duration: d,
            props: [
                {
                    prop: 'opacity',
                    easing: 'linear',
                    value: 0.3,
                    iterationCount: 2,
                    direction: ABeamer.Directions.alternate,
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map