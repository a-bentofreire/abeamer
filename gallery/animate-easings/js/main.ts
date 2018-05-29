"use strict";
// uuid: 14c1fd5d-c59d-4da7-a53a-6265db7aaf08

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
  scene1
    .addAnimations([{
      selector: '#text',
      duration: '2s',
      props: [{
        prop: 'left',
        value: 9,
        easing: 'easeOutBounce',
      }],
    }])
    .addStills('1s')
    .addAnimations([{
      selector: '#text',
      duration: '2s',
      props: [{
        prop: 'left',
        value: -270,
        easing: 'easeOutCubic',
      }],
    }, {
      selector: '#text2',
      duration: '2s',
      props: [{
        prop: 'left',
        value: 10,
        easing: 'easeInExpo',
      }],
    }])
    .addStills('1s')
    .addAnimations([{
      selector: '#text2',
      duration: '2s',
      props: [{
        prop: 'left',
        value: -280,
        easing: 'easeOutQuart',
      }],
    }, {
      selector: '#text3',
      duration: '2s',
      props: [{
        prop: 'left',
        value: 4,
        easing: 'easeOutBack',
      }],
    }])
    .addStills('1s')
    .addAnimations([{
      selector: '#text3',
      duration: '2s',
      props: [{
        prop: 'left',
        value: -280,
        easing: 'easeInBack',
      }],
    }, {
      selector: '#text4',
      duration: '2s',
      props: [{
        prop: 'left',
        value: 4,
        easing: 'easeInExpo',
      }],
    }])
    .addStills('1s');

  story.render(story.bestPlaySpeed());
});
