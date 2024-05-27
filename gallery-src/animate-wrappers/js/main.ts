"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/10);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];

  // [TOPIC] adds 0.5s of unanimated frames.
  scene1.addStills('0.5s');

  // [TOPIC] fades in story using pElsFadeIn
  const storyPels = scene1.pElsFadeIn('#storyTxt');

  scene1.addStills('1s');

  const justPels = scene1.pElsFadeIn('#just');

  scene1.addStills('1s');

  // [TOPIC] uses pels directly
  justPels.fadeOut('100ms');

  scene1.pElsFadeOut('#storyTxt', '0.5s');

  const aPls = scene1.pElsHide('#a');

  scene1.addAnimations([{
    // [TOPIC] uses aPls as a selector, but it's not teleportable.
    selector: !story.isTeleporting ? aPls : '#a',
    duration: 1,
    props: [{
      prop: 'text',
      valueFormat: 'BUT A',
    }, {
      prop: 'visible',
    }],
  }]);

  storyPels.fadeIn('0.2s');


  scene1.addAnimations([{
    // [TOPIC] uses aPls as a selector, but it's not teleportable.
    selector: !story.isTeleporting ? justPels : '#just',
    duration: 1,
    props: [{
      prop: 'text',
      valueFormat: 'CAN CHANGE',
    }, {
      prop: 'visible',
    }, {
      prop: 'opacity',
      duration: '0.4s',
    }],
  }]);

  scene1.addStills('0.5s');

  // [TOPIC] gets pEls first, to later allow their usage.
  const endPels = scene1.getPEls('#world, #img');
  endPels.fadeIn('2s');

  story.render(story.bestPlaySpeed());
});
