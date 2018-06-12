"use strict";
// uuid: 4b46e734-07ff-4ae2-b3a0-4ee59d140f15

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  let nameText = 'target';
  let valueText = 'developer';
  const qs = window.location.search || '';
  qs.replace(/name=([\w\-\.]+)/, (all, p1) => {
    nameText = p1;
    return '';
  });

  qs.replace(/value=([\w\-\.]+)/, (all, p1) => {
    valueText = p1;
    return '';
  });

  $("#label").text(nameText);
  $("#text-value").text(valueText);

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: '#text-value',
      duration: '2s',
      props: [{
        prop: 'top',
        easing: ABeamer.EasingName.easeOutElastic,
      }],
    }])
    .addStills('0.5s');

  story.render(story.bestPlaySpeed());
});
