"use strict";
// uuid: 46bdbb98-cfc7-4828-ab28-1fc730f67878

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {
  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];
  scene1.addAnimations(
    [{
      selector: '#bkg',
      props: [
        {
          prop: 'src',
          duration: '4s',
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
      duration: '4s',
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
    }],
  );

  story.render(story.bestPlaySpeed());
});
