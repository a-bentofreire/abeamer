"use strict";
// uuid: 83f4f3c3-c981-4c4f-a42a-5e1e380722ae
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
    var step = 0.5;
    scene1
        .addAnimations([{
            selector: '#text',
            duration: 1,
            props: [
                {
                    prop: 'class',
                    valueText: ['step1 step1a'],
                },
                {
                    prop: 'class',
                    position: "+" + step + "s",
                    valueText: ['+step2'],
                },
                {
                    prop: 'class',
                    position: "+" + step * 2 + "s",
                    valueText: ['-step2 +step3'],
                }
            ],
        }])
        .addStills('1s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map