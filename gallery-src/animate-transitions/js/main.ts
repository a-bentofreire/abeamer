"use strict";
// uuid: a8ed448c-9a89-4963-b08b-d1e82bf03f2d

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/**
 * This example demonstrates how to do scene-transitions and also how to
 * teleport a story into another machine.
 * To teleport a story, it must:
 *
 * - Don't include any Code Handlers.
 * - Don't include local assets.
 * - Use only functions and plugins that supports teleporting.
 *
 * **WARNING** This example is built to be teleported for testing purposes,
 * using `abeamer render --teleport`.
 * read more details on teleport documentation.
 *
 * For production mode, uncomment the code lines with comments to get the
 * story to teleport.
 */
$(window).on("load", () => {

  const story: ABeamer.Story = ABeamer.createStory(/*FPS:*/20,

    // uncomment the code line bellow to create a `getStoryToTeleport`.
    // For testing purposes, just run `abeamer render --teleport`
    // read more details on teleport documentation.

    // { toTeleport: true }
  );


  story.metadata.comments = ['My first project'];

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];

  scene1
    .addAnimations([{
      // pac-man
      selector: '#scene1-img',
      duration: '2s',
      props: [
        {
          // moves the actor
          prop: 'left',
          value: 100,
        },
        { // makes it look like is looking back and forth
          prop: 'transform',
          oscillator: {
            handler: 'harmonic',
            params: {
              cycles: 2,
            },
          },
          valueStart: 0,
          valueText: "='scaleX(' + iff(t < 0, -1, 1) + ')'",
        },
      ],
    },
    { // increases the score
      selector: '#pac-score',
      duration: '2s',
      props: [{
        prop: 'text',
        easing: 'easeOutQuad',
        valueStart: 100,
        valueFormat: '%d',
        value: 500,
      }],
    },
    ],
  );

  // ------------------------------------------------------------------------
  //                               Scene2
  // ------------------------------------------------------------------------

  const scene2 = story.scenes[1];
  scene2
    .addAnimations([{
      selector: '#scene2-img1',
      duration: '2s',
      props: [
        {
          prop: 'left',
          duration: '1s',
          value: 133,
          iterationCount: 2,
          direction: ABeamer.Directions.alternate,
        }, {
          prop: 'top',
          duration: 1,
          position: '1s',
          value: '+5',
        }, {
          prop: 'src',
          duration: 5,
          iterationCount: 10,
          valueText: ['assets/pixabay/invader-42007_640-A.png', 'assets/pixabay/invader-42007_640-AB.png'],
        },
      ],
    },
    {
      selector: '#scene2-img2',
      props: [
        {
          prop: 'left',
          duration: '1s',
          value: 5,
          iterationCount: 2,
          direction: ABeamer.Directions.alternate,
        },
      ],
    }]);

  // ------------------------------------------------------------------------
  //                               Scene3
  // ------------------------------------------------------------------------

  const scene3 = story.scenes[2];
  scene3
    .addStills('1s')
    .addAnimations([{
      selector: '#player1',
      duration: '1s',
      tasks: [{
        handler: 'typewriter',
        params: {
          text: 'Animation 50pts',
        },
      }],
    },
    {
      selector: '#player2',
      duration: '1s',
      tasks: [{
        handler: 'typewriter',
        params: {
          text: 'Beamer 50pts',
        },
      }],
    }])
    .addStills('1s');

  // ------------------------------------------------------------------------
  //                               Scene3
  // ------------------------------------------------------------------------

  const scene4 = story.scenes[3];
  scene4.addStills('1s');

  // ------------------------------------------------------------------------
  //                               Transitions
  // ------------------------------------------------------------------------

  scene1.transition = {
    handler: ABeamer.StdTransitions.slideLeft,
    duration: '1s',
  };


  // same as above, using a wrapper task to demonstrate if the story is loaded from a config file.
  scene2
    .addAnimations([{
      tasks: [
        {
          handler: 'scene-transition',
          params: {
            handler: ABeamer.StdTransitions.slideTop,
            duration: '1s',
          } as ABeamer.SceneTransitionTaskParams,
        },
      ],
    }]);


  // using textual selectors instead of numbers.
  scene3.transition = {
    handler: 'slideRight',
    duration: '1s',
  };


  // use this code lines in production mode.
  // it doesn't requires a render server agent.
  // send storyToTeleport via ajax to the remote server.
  // along with login/password, assets and other data.

  // @WARN: Never place the login/password in the story.json,
  // since it can be read by 3rd party plugins.

  // const storyToTeleport = story.getStoryToTeleport();
  // console.log(storyToTeleport);

  story.render(story.bestPlaySpeed());
});
