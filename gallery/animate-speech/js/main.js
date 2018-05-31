"use strict";
// uuid: 0eb254e3-2bdb-4ad6-999b-65c15bf2ac71
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: "#speech",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.speech,
                        speechPosition: ABeamer.SpeechPosition.left,
                        width: 160,
                        height: 80,
                        speechStart: 60,
                        speechHeight: 35,
                        speechShift: 15,
                        speechWidth: 15,
                        fill: '#42504fd0',
                        stroke: '#858585ff',
                        strokeWidth: 1,
                        rx: 5,
                        ry: 5,
                    },
                },
            ],
        }, {
            selector: "#speech, #text",
            props: [{
                    prop: 'opacity',
                    value: 1,
                    duration: '1s',
                }],
        }])
        .addAnimations([{
            selector: "#circle",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.circle,
                        radius: 10,
                        fill: 'yellow',
                        stroke: 'green',
                        strokeWidth: 3,
                    },
                },
            ],
        },
        {
            selector: "#speech2",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.speech,
                        speechPosition: ABeamer.SpeechPosition.left,
                        width: 200,
                        height: 35,
                        speechStart: 35,
                        speechHeight: 35,
                        speechShift: 35,
                        speechWidth: 15,
                        fill: '#42504fd0',
                        stroke: '#858585ff',
                        strokeWidth: 1,
                        rx: 5,
                        ry: 5,
                    },
                },
            ],
        }, {
            selector: "#speech2, #speech2-content",
            props: [{
                    prop: 'opacity',
                    value: 1,
                    duration: '1s',
                }],
        },
    ]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map