"use strict";
// uuid: 9130a5eb-7b3c-4a2b-9715-860a85a6f2f3
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    var defData0 = [23000, 32000, 45000, 15000, 50400, 60000];
    var defData = [
        defData0,
        [30000, 42000, 50000, 16000, 48400, 65000],
        [20000, 45000, 51000, 18000, 49400, 45000],
    ];
    var defLabelsX = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    };
    var defAnimeProps = [{
            prop: 'col-height',
            value: 1,
        }];
    var firstOnly = false;
    var viewOnly = undefined;
    var charts = [{
            chartType: ABeamer.ChartTypes.bar,
            labelsX: defLabelsX,
            title: '2017 Sales',
            data: [[23000, 32000, 45000, 15000, 50400, 60000]],
            colInterSpacing: 1,
            fillColors: '#ffecad',
            negativeFillColors: '#ffb0b0',
            strokeColors: '#9c9c9c',
            strokeWidth: 1,
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
                labels: ['Q1', 'Q2', 'Q3', 'Q4', '18-Q1', 'Q2', 'Q3'],
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
                [18000, 40000, 40000, 18000, 40400, 50000]
            ],
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
    var chartCount = !firstOnly ? charts.length : 1;
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
                    },
                },
            ],
        }]);
    // ------------------------------------------------------------------------
    //                               Add Charts
    // ------------------------------------------------------------------------
    charts.forEach(function (chart, i) {
        if (i >= chartCount || (viewOnly !== undefined && i !== viewOnly)) {
            return;
        }
        chart.animeSelector = "chart-" + i + "-anime";
        scene1
            .addAnimations([{
                selector: "canvas:nth-child(" + (i + 1) + ")",
                tasks: [{
                        handler: 'chart',
                        params: chart,
                    }],
            }]);
    });
    scene1
        .addAnimations(charts.map(function (chart, i) {
        return {
            selector: "%chart-" + i + "-anime",
            duration: '3s',
            props: chart.props,
        };
    }));
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map