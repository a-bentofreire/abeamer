"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", () => {
    const story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    const scene1 = story.scenes[0];
    const easings = Object.keys(ABeamer.EasingName).filter(name => name.length > 2);
    const graphHeight = 100;
    const graphWidth = 200;
    const h = graphHeight;
    const margin = 10;
    const d = 2; // duration in seconds
    const x1 = graphWidth - 2 * margin;
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
    easings.forEach((easing, index) => {
        scene1
            .addAnimations([{
                selector: `#gallery>div:nth-child(${index + 1})>.dot`,
                advance: false,
                duration: `${d}s`,
                props: [{
                        prop: 'left',
                        valueStart: `${margin}px`,
                        value: x1,
                    }, {
                        prop: 'top',
                        easing,
                        valueStart: `${h - margin}px`,
                        value: margin,
                    }],
            },
            {
                selector: `#gallery>div:nth-child(${index + 1})>.label`,
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