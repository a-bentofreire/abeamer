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
    var args = story.args;
    var nameText = args.renderVars['name'] || 'target';
    var valueText = args.renderVars['value'] || 'developer';
    var duration = args.renderVars['duration'] || '2s';
    var waitTime = args.renderVars['wait'] || '0.5s';
    var nameBackgroundColor = args.renderVars['name-background-color'] || '#5a5a5a';
    var valueBackgroundColor = args.renderVars['value-background-color'] || '#49c31b';
    var easing = args.renderVars['easing'] || ABeamer.EasingName.easeOutElastic;
    var nameWidth = parseInt(args.renderVars['name-width'] || 55);
    var valueWidth = story.width - nameWidth;
    $("#label").text(nameText);
    $("#text-value").text(valueText);
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#label',
            props: [{
                    prop: 'background-color',
                    valueText: [nameBackgroundColor],
                }, {
                    prop: 'width',
                    value: nameWidth,
                }],
        }, {
            selector: '#text',
            props: [{
                    prop: 'background-color',
                    valueText: [valueBackgroundColor],
                }, {
                    prop: 'width',
                    value: valueWidth,
                }],
        }, {
            selector: '#text-value',
            duration: duration,
            props: [{
                    prop: 'top',
                    easing: easing,
                }],
        }])
        .addStills(waitTime);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map