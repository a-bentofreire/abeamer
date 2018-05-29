"use strict";
// uuid: 8ab5107b-37cb-40e2-85bb-14e9e5ccc528

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
      selector: "#bkg",
      duration: '2s',
      props: [
        {
          prop: 'transform',
          valueStart: 5,
          value: 0,
          valueFormat: 'rotate(%fdeg)',
        }],
    },
    {
      selector: '#message',
      duration: '2s',
      tasks: [{
        handler: 'typewriter',
        params: {
          text: '06:00 Pacific Ocean',
          cursor: true,
        },
      }],
    }],
  );

  scene1.addStills('0.5s');

  scene1.transition = {
    handler: ABeamer.StdTransitions.dissolve,
    duration: '1s',
  };

  const scene2 = story.scenes[1];

  scene2.addAnimations(
    [
      {
        selector: '#message2',
        tasks: [
          {
            handler: 'text-split',
            params: {
              text: '08:49 Kaohsiung',
              splitBy: 'char',
            },
          },
        ],
      }],
  );

  scene2.addAnimations(
    [
      {
        selector: '#message2 span',
        duration: '2s',
        props: [{
          prop: 'margin-right',
          valueStart: '50px',
          value: 0,
        }],
      }],
  );

  scene2.addStills('2s');

 
  story.render(story.bestPlaySpeed());
});
