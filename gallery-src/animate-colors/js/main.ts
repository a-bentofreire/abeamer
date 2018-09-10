"use strict";
// uuid: f84d57af-708e-4353-8189-15ccc7c3e81b

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const d = '2s';

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: '#life',
      duration: d,
      props: [
        {
          prop: 'color',
          // [TOPIC] Uses a Code Handler to retrieve the color RGB.
          // This example is not teleportable.
          valueText: (t) => {
            return '#'
              + Number(20).toString(16)
              + Number(Math.round(255 * t)).toString(16)
              + Number(Math.round(128 * t)).toString(16);
          },
        },
      ],
    },
    {
      selector: '#rainbow',
      duration: d,
      props: [
        {
          prop: 'color',
          // [TOPIC] Uses a list RGB colors.
          valueText:
            // uses an array of colors
            [
              '#9400D3',
              '#4B0082',
              '#0000FF',
              '#00FF00',
              '#FFFF00',
              '#FF7F00',
              '#FF0000',
            ],

          // alternative way: using a rgb function expression.
          /*
          "='#'+rgb("
          + `floor(t*255), `
          + `floor((1-t)*255), `
          + `floor(abs((0.5+t/0.5)*255)))`,
          */

          // alternative way: using a hsl function expression.
          /*
           `='#'+hsl(t, 0.2 + (t / 0.3), 0.5)`,
          */
        },
      ],

    }],
    );

  story.render(story.bestPlaySpeed());
});
