"use strict";
// uuid: 37609f7e-193b-4523-bbdb-e7a53897453c

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
      tasks: [{
        handler: 'add-vars',
        params: { vars: { defaultDuration: '2s' } } as ABeamer.AddVarsTaskParams,
      }],
    }])
    .addAnimations(
      [{
        selector: '#broccoli1',
        props: [
          {
            prop: 'left-top',
            valueStart: 0,
            value: 0.65,
            path: {
              handler: 'rect',
              params: {
                x0: 5,
                y0: 5,
                x1: 260,
                y1: 160,
              } as ABeamer.RectPathParams,
            },
          }],
      },

      {
        selector: '#tomato1',
        props: [
          {
            prop: 'left-top',
            valueStart: 0.25,
            value: 0,
            path: {
              handler: 'ellipse',
              params: {
                centerX: 8,
                centerY: 39,
                radiusX: 107 - 8,
                radiusY: 147 - 39,
              } as ABeamer.EllipsePathParams,
            },
          }],
      },
      {
        selector: '#tomato2',
        props: [
          {
            prop: 'right-top',
            valueStart: 0.25,
            value: 0,
            path: {
              handler: 'ellipse',
              params: {
                centerX: 8,
                centerY: 39,
                radiusX: 107 - 8,
                radiusY: 147 - 39,
              } as ABeamer.EllipsePathParams,
            },
          },
        ],
      },
      {
        selector: '#carrot1',
        props: [
          {
            prop: 'left-top',
            valueStart: 0,
            path: {
              handler: 'line',
              params: {
                x0: 10,
                y0: 10,
                x1: 133,
                y1: 60,
              } as ABeamer.LinePathParams,
            },
          }, {
            prop: 'transform',
            value: 90,
            valueFormat: 'rotate(%fdeg)',
          },
        ],
      }],
  )
    .addAnimations([{
      selector: 'p',
      duration: '1s',
      props: [{
        prop: 'opacity',
      }],
    }])
    .addStills('1s');

  story.render(story.bestPlaySpeed());
});
