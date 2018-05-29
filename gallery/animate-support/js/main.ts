"use strict";
// uuid: 708c6a68-c92f-4bb9-ad0a-82caaa69716f

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const d1 = '5s';
  const scene1 = story.scenes[0];
  scene1
    // move the bug to the left and the letters to the bottom
    .addAnimations([{
      selector: '#p2t',
      duration: d1,
      tasks: [{
        handler: 'typewriter',
        params: {
          text: 'BECOME A SPONSOR',
          cursor: true,
        },
      }],
    },
    {
      selector: '#counter',
      duration: d1,
      props: [
        {
          prop: 'text',
          easing: 'easeInExpo',
          valueText: "=iff(t<1000, floor(t),floor(t/1000)+'k')",
          value: 90000,
        },
      ],
    }, {
      selector: '#paypal',
      duration: '1s',
      props: [
        {
          prop: 'left',
          position: '+0s',
          easing: 'easeInBounce',
          value: 12,
        },
        {
          prop: 'left',
          position: '+2s',
          value: 56,
        },
      ],
    }, {
      selector: '#bitcoin',
      duration: '1s',
      props: [
        {
          prop: 'left',
          position: '+3s',
          easing: 'easeInBounce',
          value: -10,
        },
        {
          prop: 'left',
          position: '+5s',
          value: 56,
        },
      ],
    }])
    .addStills('0.5s');

  story.render(story.bestPlaySpeed());
});
