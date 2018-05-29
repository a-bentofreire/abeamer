"use strict";
// uuid: c529c696-b770-4389-8723-0671bdd6883f

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
      selector: '#img',
      duration: '5s',
      props: [
        {
          prop: 'opacity',
          easing: 'easeInSine',
          oscillator: {
            handler: 'harmonic',
            params: {
              cycles: 2,
            },
          },
        },
      ],
    },
    {
      selector: '#t3',
      duration: '5s',
      props: [
        {
          prop: 'left',
          easing: 'linear',
          valueStart: 0,
          value: 4,
          oscillator: {
            handler: 'damped',
            params: {

            } as ABeamer.DampedOscillatorParams,
          },
        },
      ],
    }],
  );

  story.render(story.bestPlaySpeed());
});
