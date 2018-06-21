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

  const defData0 = [23000, 32000, 45000, 15000, 50400, 60000];
  const defData = [
    defData0,
    [30000, 42000, 50000, 16000, 48400, 65000],
    [20000, 45000, 51000, 18000, 49400, 45000],
  ];

  const defLabelsX = {
    captions: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  };

  const defAnimeProps = [{
    prop: 'col-height',
    value: 1,
  }];


  interface AxisChartTaskParamsEx extends ABeamer.AxisChartTaskParams {
    props?: ABeamer.AnimationProp[];
  }


  interface PieChartTaskParamsEx extends ABeamer.PieChartTaskParams {
    props?: ABeamer.AnimationProp[];
  }

  // 'Social Protection','General Public Services','Health','Education','Economic affairs',
  // 'Public order and safety','Defence','Recreation, culture and religion',
  // 'Housing and community amenities','Environmental protection',

  const firstOnly = false;
  const viewOnly = undefined;

  const charts: (AxisChartTaskParamsEx | PieChartTaskParamsEx)[] = [{

    chartType: ABeamer.ChartTypes.pie,
    // labelsX: defLabelsX,
    title: 'Government expenditure',
    data: [[36.7, 17.1, 13.8, 12.9, 8.2, 4.0, 2.7]],
    fillColors: [['#E82C0C', '#2204FF', '#FFB80D', '#0DFFB6', '#CE0EE8', '#E8E70E', '#E86378']],
    strokeColors: '#525252',
    angleStart: Math.PI,
    dispersionStart: 0.1,
    props: [{
      prop: 'dispersion',
      value: 1,
    }],
  } as PieChartTaskParamsEx, {

    chartType: ABeamer.ChartTypes.bar,
    labelsX: defLabelsX,
    title: '2017 Sales',
    data: [[23000, 32000, 45000, 15000, 50400, 58000]],
    colInterSpacing: 1,
    strokeWidth: 1,
    fillColors: '#ffecad',
    negativeFillColors: '#ffb0b0',
    strokeColors: '#9c9c9c',
    colHeightStart: 0.1,
    props: [{
      prop: 'col-height',
      value: 1,
    }],
  }, {
    chartType: ABeamer.ChartTypes.area,
    data: [
      [30000, 42000, 50000, 30000, 45000, 40000, 30000],
      [13000, 32000, 35000, 55000, 35000, 50000, 25000],
    ],
    colInterSpacing: 1,
    colSpacing: 20,
    title: 'Customer Satisfaction',
    labelsX: {
      captions: ['Q1', 'Q2', 'Q3', 'Q4', '18-Q1', 'Q2', 'Q3'],
    },
    fillColors: ['#35a9c070', '#adffb970'],
    strokeColors: ['#9c9c9c', '#9c9c9c'],
    strokeWidth: [2, 2],
    sweepStart: 0.2,
    props: [{
      prop: 'sweep',
      value: 1,
    }],
  }, {
    chartType: ABeamer.ChartTypes.line,
    labelsX: defLabelsX,
    data: [
      [23000, 32000, 45000, 15000, 50400, 60000],
      [18000, 40000, 40000, 18000, 40400, 50000]],
    colInterSpacing: 1,
    colSpacing: 10,
    strokeColors: ['#dd5252', '#5252dd'],
    strokeWidth: 2,
    // sweepStart: 0.2,
    deviationStart: 0.1,
    props: [{
      prop: 'deviation',
      // prop: 'sweep',
      value: 1,
    }],
  }, {
    chartType: ABeamer.ChartTypes.mixed,
    data: defData,
    charTypes: [ABeamer.ChartTypes.bar, ABeamer.ChartTypes.bar, ABeamer.ChartTypes.line],
    labelsX: defLabelsX,
    colInterSpacing: 1,
    fillColors: ['#11ecad', '#adffb9', ''],
    strokeColors: ['#9c9c9c', '#9c9c9c', '#d05858'],
    strokeWidth: [1, 1, 2],
    colHeightStart: 0.2,
    props: [{
      prop: 'col-height',
      value: 1,
    }],
  }, {
    chartType: ABeamer.ChartTypes.bar,
    labelsX: defLabelsX,
    title: '2017 Revenue',
    data: [[23000, 32000, 45000, -15000, 10000, 60000]],
    colInterSpacing: 1,
    fillColors: '#ffecad',
    negativeFillColors: '#ffb0b0',
    strokeColors: '#9c9c9c',
    strokeWidth: 1,
    markers: {
      visible: [[false, false, false, false, true, false]],
      shape: ABeamer.ChartPointShape.diamond,
      color: 'blue',
      size: 10,
    },
    colHeightStart: 0.1,
    props: [{
      prop: 'col-height',
      value: 1,
    }],
  }, {
    chartType: ABeamer.ChartTypes.marker,
    labelsX: defLabelsX,
    data: [[23000, 32000, 45000, 15000, 50400, 60000]],
    markers: {
      shape: ABeamer.ChartPointShape.circle,
      size: 10,
      color: 'red',
    },
    colInterSpacing: 1,
    title: 'Line Chart',
    fillColors: '#ffecad',
    colHeightStart: 0.1,
    props: [{
      prop: 'col-height',
      value: 1,
    }],
  }];

  // ------------------------------------------------------------------------
  //                               Factory
  // ------------------------------------------------------------------------

  const chartCount = !firstOnly ? charts.length : 1;

  scene1
    .addAnimations([{
      selector: '#gallery',
      tasks: [
        {
          handler: 'factory',
          params: {
            count: chartCount,
            tag: 'canvas',
            attrs: [
              {
                name: 'width',
                value: '280',
              },
              {
                name: 'height',
                value: '160',
              },
            ],
          } as ABeamer.FactoryTaskParams,
        },
      ],
    }]);

  // ------------------------------------------------------------------------
  //                               Add Charts
  // ------------------------------------------------------------------------

  charts.forEach((chart, i) => {

    if (i >= chartCount || (viewOnly !== undefined && i !== viewOnly)) {
      return;
    }

    chart.animeSelector = `chart-${i}-anime`;

    scene1
      .addAnimations([{
        selector: `canvas:nth-child(${i + 1})`,
        tasks: [{
          handler: 'chart',
          params: chart,
        }],
      }]);
  });

  scene1
    .addAnimations(charts.map((chart, i) => chart.props ? {
      selector: `%chart-${i}-anime`,
      duration: '3s',
      props: chart.props,
    } : undefined).filter(anime => anime !== undefined));

  story.render(story.bestPlaySpeed());
});
