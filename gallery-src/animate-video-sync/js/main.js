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
    scene1.addAnimations([{
            selector: '#wow',
            props: [
                {
                    prop: 'font-size',
                    duration: '4.72s',
                    value: 60,
                    oscillator: {
                        handler: 'damped',
                    },
                },
            ],
        }]);
    story.addFlyover('video-sync', {
        selector: '#video',
        serverRender: false,
    });
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map