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
            selector: "#circle",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.circle,
                        radius: 25,
                        fill: '#ebebeb',
                        stroke: '#9d9d9d',
                        strokeWidth: 2,
                    },
                },
            ],
        }, {
            selector: "#rectangle",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: 'rectangle',
                        width: 150,
                        height: 55,
                        fill: '#ebebeb',
                        stroke: '#9d9d9d',
                        strokeWidth: 2,
                        rx: 4,
                        ry: 4,
                    },
                },
            ],
        }, {
            selector: "#line",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.line,
                        x: 30,
                        y: 30,
                        stroke: 'red',
                        strokeWidth: 3,
                    },
                },
            ],
        }, {
            selector: "#line-dir",
            tasks: [
                {
                    handler: 'shape',
                    params: {
                        shape: ABeamer.Shapes.line,
                        direction: 150,
                        length: 110,
                        stroke: 'red',
                        strokeWidth: 3,
                    },
                },
            ],
        }]).addStills(2);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map