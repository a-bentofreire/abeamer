"use strict";
// uuid: 4b46e734-07ff-4ae2-b3a0-4ee59d140f15
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene
    // ------------------------------------------------------------------------
    /**
     * For command line rendering use '-' notation.
     * e.g.:
     * abeamer render --var name-background-color=blue
     */
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#label',
            tasks: [{
                    handler: 'add-vars',
                    params: {
                        overwrite: false,
                        vars: {
                            name: 'target',
                            value: 'developer',
                            duration: '2s',
                            wait: '0.5s',
                            nameBackgroundColor: '#5a5a5a',
                            valueBackgroundColor: '#49c31b',
                            easing: 'easeOutElastic',
                            nameWidth: '55',
                        },
                    },
                }],
            props: [{
                    prop: 'background-color',
                    valueText: '=nameBackgroundColor',
                }, {
                    prop: 'width',
                    value: '=nameWidth',
                }, {
                    prop: 'text',
                    valueText: '=name',
                }],
        }, {
            selector: '#text',
            props: [{
                    prop: 'background-color',
                    valueText: '=valueBackgroundColor',
                }, {
                    prop: 'width',
                    value: '=frameWidth-toNumber(nameWidth)',
                }],
        }, {
            selector: '#text-value',
            duration: '=duration',
            props: [{
                    prop: 'text',
                    duration: 1,
                    valueText: '=value',
                }, {
                    prop: 'top',
                    easing: '==easing',
                }],
        }])
        .addStills('=wait');
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map