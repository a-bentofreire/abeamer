"use strict";
// uuid: 9130a5eb-7b3c-4a2b-9715-860a85a6f2f3

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
      selector: '#bar-chart',
      tasks: [{
        handler: 'chart',
        params: {
          chartType: ABeamer.ChartTypes.mixed,
          dataFrame: [
            [23000, 32000, 45000, 15000, 50400, 60000],
            [30000, 42000, 50000, 16000, 48400, 65000],
            [20000, 45000, 51000, 18000, 49400, 45000],
          ],
          charTypes: [ABeamer.ChartTypes.bar, ABeamer.ChartTypes.bar, ABeamer.ChartTypes.line],
          labelsX: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          animeSelector: 'bar-chart-anime',
          barHeightStart: 0.2,
          barSeriesSpacing: 1,
          fillColors: ['#ffecad', '#adffb9', ''],
          strokeColors: ['#9c9c9c', '#9c9c9c', '#dd5252'],
          strokeWidth: [1, 1, 2],
          maxValue: 65000,
          // minValue: -15000,
        } as ABeamer.AxisChartTaskParams,
      }],
    }])
    .addAnimations([{
      selector: '#area-chart',
      tasks: [{
        handler: 'chart',
        params: {
          chartType: ABeamer.ChartTypes.area,
          dataFrame: [
            [30000, 42000, 50000],
            [13000, 12000, 35000],
          ],
          animeSelector: 'area-chart-anime',
          barHeightStart: 0.2,
          barSeriesSpacing: 1,
          fillColors: ['#ffecad', '#adffb9'],
          strokeColors: ['#9c9c9c', '#9c9c9c'],
          strokeWidth: [2, 2],
          maxValue: 80000,
        } as ABeamer.AxisChartTaskParams,
      }],
    }])
    .addAnimations([{
      selector: '%bar-chart-anime',
      duration: '1s',
      props: [{
        prop: 'bar-height',
        value: 1,
      }],
    }, {
      selector: '%area-chart-anime',
      duration: '1s',
      props: [{
        prop: 'bar-height',
        value: 1,
      }],
    }])
    .addStills('2s');

  story.render(story.bestPlaySpeed());
});
