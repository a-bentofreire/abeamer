"use strict";
// uuid: 41857a1a-0eb0-4091-ba3f-6f55bcd1e250

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {
  const story = ABeamer.createStory(/*FPS:*/10);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];
  scene1.addAnimations([{
    selector: '#text',
    duration: '4s',
    // [TOPIC] The 'decipher' text task generates a random list of texts
    // that gradually reveal the hidden text.
    tasks: [{
      handler: 'decipher',
      params: {
        text: 'JUPITER',
        iterations: 30,
        revealCharIterations: 3,
        revealDirection: ABeamer.RevealDir.toCenter,
      } as ABeamer.DecipherTaskParams,
    }],
  },
  {
    // Creates a counter.
    selector: '#year',
    duration: '4s',
    props: [{
      prop: 'text',
      valueStart: 0,
      value: 2050,
      valueFormat: '%d',
    }],
  },
  {
    // fades in the mission text.
    selector: '#mission',
    duration: '4s',
    props: [{
      prop: 'opacity',
    }],
  }])
    .addStills('1s');

  story.render(story.bestPlaySpeed());
});
