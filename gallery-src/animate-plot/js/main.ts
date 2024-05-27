"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/10);

  // ------------------------------------------------------------------------
  //                               Plots
  // ------------------------------------------------------------------------

  const duration = 0.6;


  const f1 = 'exp(8*v/n)';
  const f2 = 'v*v';

  const scene = story.scenes[0];
  scene
    .addAnimations([{
      selector: `canvas`,
      tasks: [{
        handler: 'chart',
        params: {
          chartType: ABeamer.ChartTypes.line,
          animeSelector: 'plot1-anime',
          data: [
            {
              expr: `=${f1}`,
              nrPoints: 50,
            },
            {
              expr: `=${f2}`,
            }] as ABeamer.ExprSeries[],
          strokeColors: ['#dd5252', 'blue'],
          strokeWidth: 2,
          sweepStart: 0.2,
          legend: {
            captions: [f1, f2],
          },
          title: {
            caption: 'Math function comparison',
            position: ABeamer.ChartCaptionPosition.bottom,
          },
        } as ABeamer.AxisChartTaskParams,
      }],
    }])
    .addAnimations([{
      selector: `%plot1-anime`,
      duration: `${duration}s`,
      props: [{
        prop: 'sweep',
        value: 1,
      }],
    }])
    .addStills('0.5s');

  story.render(story.bestPlaySpeed());
});
