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

  const d = '2s';

  const scene1 = story.scenes[0];
  scene1
    .addAnimations(
      [{
        selector: '#broccoli1',
        duration: d,
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
        duration: d,
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
        duration: d,
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
        duration: d,
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
