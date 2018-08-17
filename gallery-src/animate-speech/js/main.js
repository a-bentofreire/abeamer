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
    var IMG = '<img src="assets/pixabay/emoji-2762568_640.png">';
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#write',
            duration: '0.5s',
            tasks: [
                {
                    handler: 'typewriter',
                    params: {
                        text: 'What\'s up!',
                        splitBy: 'char',
                    },
                },
            ],
        }])
        .addAnimations([{
            selector: '#write',
            props: [
                {
                    prop: 'html',
                    duration: '1f',
                    valueText: ["What's up!" + IMG],
                },
            ],
        }])
        .addStills('0.2s')
        .addAnimations([{
            selector: "#speech1L, #speech2L",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.speech,
                        speechPosition: ABeamer.SpeechPosition.left,
                        width: 160,
                        height: 30,
                        speechStart: 10,
                        speechHeight: 15,
                        speechShift: 5,
                        speechWidth: 15,
                        fill: '#eeeeee',
                        stroke: 'black',
                        strokeWidth: 1,
                        rx: 5,
                        ry: 5,
                    },
                },
            ],
        }, {
            selector: "#speech1L, #text1L",
            props: [{
                    prop: 'opacity',
                    duration: '0.2s',
                }],
        }])
        .addStills('0.5s')
        .addAnimations([{
            selector: "#speech1R, #speech2R",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.speech,
                        speechPosition: ABeamer.SpeechPosition.right,
                        width: 160,
                        height: 30,
                        speechStart: 10,
                        speechHeight: 15,
                        speechShift: 5,
                        speechWidth: 15,
                        fill: '#eeeeee',
                        stroke: 'black',
                        strokeWidth: 1,
                        rx: 5,
                        ry: 5,
                    },
                },
            ],
        }, {
            selector: "#speech1R, #text1R",
            props: [{
                    prop: 'opacity',
                    duration: '0.2s',
                }],
        }, {
            selector: '#write',
            props: [{
                    prop: 'text',
                    valueText: [''],
                    valueStart: 0,
                    value: 0,
                }],
        }])
        .addAnimations([{
            selector: '#write',
            duration: '1s',
            tasks: [
                {
                    handler: 'typewriter',
                    params: {
                        text: 'What\'s left',
                        splitBy: 'char',
                    },
                },
            ],
        }])
        .addAnimations([{
            selector: '#write',
            props: [
                {
                    prop: 'html',
                    duration: '5f',
                    valueText: ["What's left" + IMG, "What's left" + IMG + IMG, "What's left" + IMG + IMG + IMG],
                },
            ],
        }])
        .addAnimations([{
            selector: "#speech2L, #text2L",
            props: [{
                    prop: 'opacity',
                    duration: '0.2s',
                }],
        }])
        .addStills('0.5s')
        .addAnimations([{
            selector: "#speech2R, #text2R",
            props: [{
                    prop: 'opacity',
                    duration: '0.2s',
                }],
        }])
        .addStills('0.5s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map