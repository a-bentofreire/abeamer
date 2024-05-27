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
    var d = '4s';
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            selector: '#bkg',
            props: [
                {
                    prop: 'src',
                    duration: d,
                    valueText: [
                        'assets/pixabay/barley-field-1684052_640.jpg',
                        'assets/pixabay/field-533541_640.jpg',
                        'assets/pixabay/schilthorn-3033448_640.jpg',
                        'assets/pixabay/world-549425_640.jpg',
                    ],
                },
            ],
        },
        {
            selector: '#text',
            duration: d,
            // enabled: false,
            props: [
                {
                    prop: 'backgroundImage',
                    valueText: [
                        'url("assets/pixabay/world-549425_640.jpg")',
                        'url("assets/pixabay/schilthorn-3033448_640.jpg")',
                        'url("assets/pixabay/barley-field-1684052_640.jpg")',
                        'url("assets/pixabay/field-533541_640.jpg")',
                    ],
                },
                {
                    prop: 'color',
                    easing: 'easeInQuad',
                    value: 0.8,
                    valueFormat: 'rgba(224, 224, 224, %f)',
                },
                {
                    prop: 'html',
                    valueText: ['SAVE<br>THE<br>PLANET', 'IT\'S<br>THE<br>ONLY', 'HOME', 'HE<br>HAVE'],
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map