"use strict";
// uuid: 86788cd0-9f7a-49b8-bf77-896d82a242d5

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {

  ABeamer.pluginManager.addLocalization({
    locale: 'pt_PT',
    functionalities: [[ABeamer.Functionalities.functions, [
      { src: 'sin', dst: 'sen' },
      { src: 'iff', dst: 'se' }]]],
    messages: {
      /* spell-checker: disable */
      MustNatPositive: 'O valor de %p% tem de ser um número natural positivo',
    },
  });
  const story = ABeamer.createStory(/*FPS:*/8);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];
  const d = '2s';
  scene1
    .addAnimations([{
      selector: '#dot',
      duration: d,
      props: [{
        prop: 'top',
        oscillator: {
          handler: '=sin(t*pi*4)',
        },
        valueStart: "=frameHeight/2 +'px'",
        value: '=frameHeight/2-20',
      }, {
        prop: 'left',
        value: '=frameWidth-10',
      }],
    }])
    .addAnimations([{
      selector: '#title, #expr',
      props: [{
        prop: 'text',
        duration: 1,
        // Portuguese iff = se
        valueText: "=se(elIndex==0,'Português', '\\\'=sen(t)\\\'')",
      }],
    }, {
      selector: '#dot',
      duration: d,
      props: [{
        prop: 'top',
        oscillator: {
          // Portuguese sin = sen
          handler: '=sen(t*pi*4)',
        },
        valueStart: "=frameHeight/2 +'px'",
        value: '=frameHeight/2-20',
      }, {
        prop: 'left',
        valueStart: '10px',
        value: '=frameWidth-10',
      }],
    }]);

  story.render(story.bestPlaySpeed());
});
