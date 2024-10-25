"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Plots
    // ------------------------------------------------------------------------
    var duration = 0.6;
    var f1 = 'exp(8*v/n)';
    var f2 = 'v*v';
    var scene = story.scenes[0];
    scene
        .addAnimations([{
            selector: "canvas",
            tasks: [{
                    handler: 'chart',
                    params: {
                        chartType: ABeamer.ChartTypes.line,
                        animeSelector: 'plot1-anime',
                        data: [
                            {
                                expr: "=".concat(f1),
                                nrPoints: 50,
                            },
                            {
                                expr: "=".concat(f2),
                            }
                        ],
                        strokeColors: ['#dd5252', 'blue'],
                        strokeWidth: 2,
                        sweepStart: 0.2,
                        legend: {
                            captions: [f1, f2],
                        },
                        title: {
                            caption: 'Math function comparison',
                            position: ABeamer.ChartCaptionPosition.bottom,
                        },
                    },
                }],
        }])
        .addAnimations([{
            selector: "%plot1-anime",
            duration: "".concat(duration, "s"),
            props: [{
                    prop: 'sweep',
                    value: 1,
                }],
        }])
        .addStills('0.5s');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map