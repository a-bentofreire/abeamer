"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    var easings = Object.keys(ABeamer.EasingName).filter(function (name) { return name.length > 2; });
    var graphHeight = 100;
    var graphWidth = 200;
    var h = graphHeight;
    var margin = 10;
    var d = 2; // duration in seconds
    var x1 = graphWidth - 2 * margin;
    console.log(easings);
    scene1.addAnimations([{
            selector: '#gallery',
            tasks: [{
                    handler: 'factory',
                    params: {
                        count: easings.length,
                        content: '<div class=dot></div><div class=label></div>',
                    },
                }],
        }]);
    easings.forEach(function (easing, index) {
        scene1
            .addAnimations([{
                selector: "#gallery>div:nth-child(".concat(index + 1, ")>.dot"),
                advance: false,
                duration: "".concat(d, "s"),
                props: [{
                        prop: 'left',
                        valueStart: "".concat(margin, "px"),
                        value: x1,
                    }, {
                        prop: 'top',
                        easing: easing,
                        valueStart: "".concat(h - margin, "px"),
                        value: margin,
                    }],
            },
            {
                selector: "#gallery>div:nth-child(".concat(index + 1, ")>.label"),
                duration: 1,
                advance: false,
                props: [{
                        prop: 'text',
                        valueFormat: easing,
                    }],
            }]);
    });
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map