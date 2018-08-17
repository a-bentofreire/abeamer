"use strict";
// uuid: 0a05866f-cabc-410a-b9f5-3c450ef7f792
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
            // builds 15 cubes
            selector: "#container",
            tasks: [
                {
                    handler: 'factory',
                    params: {
                        count: 14,
                        tag: 'span',
                        // although it uses a function, it's not a Code Handler,
                        // allowing to be teleported the result.
                        content: 'HAPPY-BIRTHDAY'.split(''),
                        isContentFormatted: true,
                        attrs: [
                            {
                                name: 'id',
                                value: 'cube%d',
                                isFormatted: true,
                            },
                            {
                                name: 'style',
                                // applies a random color. supports teleporting.
                                value: "='color: #' + rgb(80+floor(random()*(255-80)), "
                                    + "80+floor(random()*(255-80)), 80+floor(random()*(255-80))) + ';'",
                                isFormatted: true,
                            },
                        ],
                    },
                },
            ],
        },
        {
            // [TOPIC] moves them with a delay and harmonic oscillation
            // and small disturbance
            selector: '#container span',
            props: [
                {
                    prop: 'top',
                    duration: '2s',
                    value: 20,
                    itemDelayDuration: '2.6f',
                    itemDelayDisturbance: '1f',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            cycles: 2,
                        },
                    },
                },
            ],
        },
    ]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map