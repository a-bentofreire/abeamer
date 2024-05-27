"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      // [TOPIC] Uses a factory to build 20 stars
      selector: "#star-container",
      tasks: [
        {
          handler: 'factory',
          params: {
            count: 20,
            tag: 'img',
            attrs: [
              {
                name: 'src',
                value: 'assets/a-bentofreire/star.svg',
              },
              {
                name: 'style',
                // applies a random color. Teleportable!
                value: "='opacity: ' + random() + ';'",
                isFormatted: true,
              },
            ],
          } as ABeamer.FactoryTaskParams,
        },
      ],
    },
    { // moves them to a random end position
      selector: '#star-container img',
      duration: '2s',
      props: [
        {
          prop: 'top',
          value: '=-10-random()*120',
        },
        {
          prop: 'left',
          value: '=250+random()*200',
        },
      ],
    },
    { // [TOPIC] builds 20 balls using a factory
      selector: "#ball-container",
      tasks: [
        {
          handler: 'factory',
          params: {
            count: 20,
            tag: 'img',
            attrs: [
              {
                name: 'src',
                value: 'assets/a-bentofreire/ball.svg',
              },
              {
                name: 'style',
                // applies a random color. Teleportable!
                value: "='opacity: ' + random() + ';'",
                isFormatted: true,
              },
            ],
          } as ABeamer.FactoryTaskParams,
        },
      ],
    },
    { // moves them to a random end position
      selector: '#ball-container img',
      duration: '2s',
      props: [
        {
          prop: 'top',
          value: '=-10-random()*120',
        },
        {
          prop: 'right',
          value: '=250+random()*200',
        },
      ],
    }])
    .addStills('1s');

  story.render(story.bestPlaySpeed());
});
