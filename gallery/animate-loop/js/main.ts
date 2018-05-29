"use strict";
// uuid: ef7b4046-8a49-4628-a5bc-2fa7f1df2d12

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
      selector: '#ball1',
      duration: '1s',
      props: [
        {
          prop: 'top',
          easing: 'linear',
          iterationCount: 3,
          value: 70,
        },
      ],
    },
    {
      selector: '#ball2',
      duration: '1s',
      props: [
        {
          prop: 'top',
          easing: 'linear',
          iterationCount: 3,
          direction: ABeamer.Directions.alternate,
          value: 70,
        },
      ],
    }],
  );

  story.render(story.bestPlaySpeed());
});
