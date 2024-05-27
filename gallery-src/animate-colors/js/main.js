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
    var d = '2s';
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#life',
            duration: d,
            props: [
                {
                    prop: 'color',
                    // [TOPIC] Uses a Code Handler to retrieve the color RGB.
                    // This example is not teleportable.
                    valueText: function (t) {
                        return '#'
                            + Number(20).toString(16)
                            + Number(Math.round(255 * t)).toString(16)
                            + Number(Math.round(128 * t)).toString(16);
                    },
                },
            ],
        },
        {
            selector: '#rainbow',
            duration: d,
            props: [
                {
                    prop: 'color',
                    // [TOPIC] Uses a list RGB colors.
                    valueText: 
                    // uses an array of colors
                    [
                        '#9400D3',
                        '#4B0082',
                        '#0000FF',
                        '#00FF00',
                        '#FFFF00',
                        '#FF7F00',
                        '#FF0000',
                    ],
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map