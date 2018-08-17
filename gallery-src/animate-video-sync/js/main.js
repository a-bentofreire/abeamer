"use strict";
// uuid: c0fc6b7b-fa2a-4bcf-ae09-fd99299525ff
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