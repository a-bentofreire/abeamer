"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    10
  );
  const duration = 0.6;
  const defData0 = [23e3, 32e3, 45e3, 15e3, 50400, 6e4];
  const defData = [
    defData0,
    [3e4, 42e3, 5e4, 16e3, 48400, 65e3],
    [2e4, 45e3, 51e3, 18e3, 49400, 45e3]
  ];
  const defLabelsX = {
    captions: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  };
  const charts = [{
    chartType: ABeamer.ChartTypes.bar,
    labelsX: defLabelsX,
    title: "2017 Sales",
    data: [[23e3, 32e3, 45e3, 15e3, 50400, 58e3]],
    strokeWidth: 1,
    seriesSpacing: 8,
    fillColors: "#ffecad",
    negativeFillColors: "#ffb0b0",
    strokeColors: "#9c9c9c",
    labelsY: {
      captions: "=v/1000 + 'k'"
    },
    pointHeightStart: 0.1,
    props: [{
      prop: "point-height",
      value: 1
    }]
  }, {
    chartType: ABeamer.ChartTypes.area,
    data: [
      [30, 42, 50, 50, 45, 60, 40],
      [13, 32, 35, 85, 35, 70, 65]
    ],
    title: "Customer Satisfaction",
    labelsX: {
      captions: ["17Q1", "17Q2", "17Q3", "17Q4", "18Q1", "18Q2", "18Q3"]
    },
    labelsY: "=v + '%'",
    fillColors: ["rgba(53, 169, 192, 0.4392)", "rgba(173, 255, 185, 0.4392)"],
    strokeColors: ["#9c9c9c", "#9c9c9c"],
    strokeWidth: [2, 2],
    sweepStart: 0.2,
    props: [{
      prop: "sweep",
      value: 1
    }]
  }, {
    chartType: ABeamer.ChartTypes.line,
    labelsX: "=2012 + v",
    data: [
      [230, 320, 450, 150, 504, 600],
      [180, 400, 400, 180, 404, 500]
    ],
    strokeColors: ["#dd5252", "#5252dd"],
    strokeWidth: 2,
    // sweepStart: 0.2,
    deviationStart: 0.1,
    props: [{
      prop: "deviation",
      // prop: 'sweep',
      value: 1
    }]
  }, {
    chartType: ABeamer.ChartTypes.mixed,
    data: defData,
    chartTypes: [ABeamer.ChartTypes.bar, ABeamer.ChartTypes.bar, ABeamer.ChartTypes.line],
    labelsX: defLabelsX,
    fillColors: ["#11ecad", "#adffb9", ""],
    strokeColors: ["#9c9c9c", "#9c9c9c", "#d05858"],
    strokeWidth: [1, 1, 2],
    legend: {
      captions: ["2016", "2017", "Profit"]
    },
    // sweepStart: 0.2,
    pointHeightStart: 0.2,
    props: [{
      prop: "point-height",
      // prop: 'sweep',
      value: 1
    }],
    chartWidth: 320
  }, {
    chartType: ABeamer.ChartTypes.pie,
    // labelsX: defLabelsX,
    title: "Government expenditure",
    data: [[36.7, 17.1, 13.8, 12.9, 8.2, 4, 2.7]],
    fillColors: [["#E82C0C", "#2204FF", "#FFB80D", "#0DFFB6", "#CE0EE8", "#E8E70E", "#E86378"]],
    strokeColors: "#525252",
    angleStart: Math.PI,
    dispersionStart: 0.1,
    legend: {
      captions: [
        "Social Protection",
        "General Services",
        "Health",
        "Education",
        "Economic affairs",
        "Public order",
        "Defence"
      ]
    },
    props: [{
      prop: "dispersion",
      value: 1
    }]
  }, {
    chartType: ABeamer.ChartTypes.bar,
    labelsX: defLabelsX,
    title: "2017 Revenue",
    data: [[23e3, 32e3, 45e3, -15e3, 1e4, 6e4]],
    seriesSpacing: 1,
    fillColors: "#ffecad",
    negativeFillColors: "#ffb0b0",
    strokeColors: "#9c9c9c",
    strokeWidth: 1,
    markers: {
      visible: [[false, false, false, false, true, false]],
      shape: ABeamer.ChartPointShape.diamond,
      color: "blue",
      size: 10
    },
    pointHeightStart: 0.1,
    props: [{
      prop: "point-height",
      value: 1
    }]
  }, {
    chartType: ABeamer.ChartTypes.marker,
    labelsX: defLabelsX,
    data: [[23e3, 32e3, 45e3, 15e3, 50400, 6e4]],
    markers: {
      shape: ABeamer.ChartPointShape.circle,
      size: 10,
      color: "red"
    },
    seriesSpacing: 1,
    title: "Marker Chart",
    fillColors: "#ffecad",
    pointHeightStart: 0.1,
    props: [{
      prop: "point-height",
      value: 1
    }]
  }];
  $("#story").html(charts.map(() => `<div class=abeamer-scene><div class=gallery></div></div>`).join("\n"));
  story.addDefaultScenes();
  charts.forEach((chart, i) => {
    const scene = story.scenes[i];
    scene.addAnimations([{
      selector: ".gallery",
      tasks: [
        {
          handler: "factory",
          params: {
            count: 1,
            tag: "canvas",
            attrs: [
              {
                name: "width",
                value: `${chart.chartWidth || 280}`
              },
              {
                name: "height",
                value: "160"
              }
            ]
          }
        }
      ]
    }]);
    chart.animeSelector = `chart-${i}-anime`;
    scene.addAnimations([{
      selector: `canvas`,
      tasks: [{
        handler: "chart",
        params: chart
      }]
    }]);
    if (chart.props) {
      scene.addAnimations([{
        selector: `%chart-${i}-anime`,
        duration: `${duration}s`,
        props: chart.props
      }]);
    }
    scene.addStills("0.5s");
  });
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
