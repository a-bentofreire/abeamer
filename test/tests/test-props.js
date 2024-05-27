"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var Tests;
(function (Tests) {
    var fps = 10;
    var seconds = 4;
    var cycle = exact_js_1.Exact.interpolateMinMax(0, 1, seconds * fps);
    var colors = [
        '#9400D3',
        '#4B0082',
        '#0000FF',
        '#00FF00',
        '#FFFF00',
        '#FF7F00',
        '#FF0000',
    ].map(function (color) { return exact_js_1.Exact.hexToRgb(color); });
    var namedColors = ['red', 'green', 'blue', 'yellow', 'black'];
    var func1Name = '__Func_colorList';
    var jsMacros = [
        ["\"" + func1Name + "\"",
            "function (t) {\n        var c = " + JSON.stringify(namedColors) + ";\n      return c[Math.floor(c.length * Math.min(Math.max(0, t), 0.999))];\n    }",
        ],
    ];
    var transfMin = 2.2;
    var transfMax = 34.2;
    var transfMacroName = '_VALUE_';
    var transformStr = "rotateY(30deg) rotateX(" + transfMacroName + "deg)";
    var transfCycle = exact_js_1.Exact.interpolateMinMax(transfMin, transfMax, seconds * fps).
        map(function (t) { return transformStr.replace(transfMacroName, exact_js_1.Exact.roundTestDigit(t).toString()); });
    // console.log(transfCycle);
    var tests = [
        {
            name: 'valueText:string',
            prop: 'color',
            css: "color: " + colors[0],
            valueText: colors,
            expected: exact_js_1.Exact.interpolateList(colors, cycle),
        },
        {
            name: 'valueText:function',
            prop: 'color',
            css: "color: " + colors[0],
            valueText: func1Name,
            expected: exact_js_1.Exact.interpolateList(namedColors, cycle),
        },
        {
            name: 'valueFormat',
            prop: 'transform',
            css: "\n          transform-origin: bottom;\n          perspective: 20px;\n          position: absolute;\n        ",
            value: transfMax,
            valueStart: transfMin,
            valueFormat: transformStr.replace(transfMacroName, '%f'),
            expected: transfCycle,
        },
    ];
    var func = function (rd, done, index) {
        var test = tests[index];
        rd.actions.isIdPropActions("t" + index, test.prop, test.expected);
        done();
    };
    var testParams = {};
    tests.forEach(function (test, index) {
        testParams["t" + index + " " + test.prop + " uses " + test.name] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: fps,
        css: tests.map(function (test, index) {
            return "#t" + index + " {" + test.css + "}";
        }).join('\n'),
        animes: tests.map(function (test, index) {
            return {
                selector: "#t" + index,
                duration: seconds + "s",
                props: [{
                        prop: test.prop,
                        value: test.value,
                        valueStart: test.valueStart,
                        valueText: test.valueText,
                        valueFormat: test.valueFormat,
                    }],
            };
        }),
        html: exact_js_1.Exact.genTestHtml(tests.length),
    }, {
        jsMacros: jsMacros,
        tests: testParams,
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-props.js.map