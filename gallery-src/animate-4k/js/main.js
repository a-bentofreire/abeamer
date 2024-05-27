"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    // only 1 frame per second, since it's only a test, no need to have many large images.
    var story = ABeamer.createStory(/*FPS:*/ 1);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    scene1.addAnimations([{
            selector: '#l4klogo',
            // use only 4 frames because it generates very large images
            duration: '4f',
            props: [
                {
                    prop: 'right',
                    easing: 'linear',
                    value: 5,
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map