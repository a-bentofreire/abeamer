"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const fps = 10;
  const seconds = 4;
  const cycle = import_exact.Exact.interpolateMinMax(0, 1, seconds * fps);
  const colors = [
    "#9400D3",
    "#4B0082",
    "#0000FF",
    "#00FF00",
    "#FFFF00",
    "#FF7F00",
    "#FF0000"
    // @HINT: Required due the fact chrome returns rgb values instead of #hhhhhh
  ].map((color) => import_exact.Exact.hexToRgb(color));
  const namedColors = ["red", "green", "blue", "yellow", "black"];
  const func1Name = "__Func_colorList";
  const jsMacros = [
    [
      `"${func1Name}"`,
      `function (t) {
        var c = ${JSON.stringify(namedColors)};
      return c[Math.floor(c.length * Math.min(Math.max(0, t), 0.999))];
    }`
    ]
  ];
  const transfMin = 2.2;
  const transfMax = 34.2;
  const transfMacroName = "_VALUE_";
  const transformStr = `rotateY(30deg) rotateX(${transfMacroName}deg)`;
  const transfCycle = import_exact.Exact.interpolateMinMax(transfMin, transfMax, seconds * fps).map((t) => transformStr.replace(transfMacroName, import_exact.Exact.roundTestDigit(t).toString()));
  const tests = [
    {
      name: "valueText:string",
      prop: "color",
      css: `color: ${colors[0]}`,
      valueText: colors,
      expected: import_exact.Exact.interpolateList(colors, cycle)
    },
    {
      name: "valueText:function",
      prop: "color",
      css: `color: ${colors[0]}`,
      valueText: func1Name,
      expected: import_exact.Exact.interpolateList(namedColors, cycle)
    },
    {
      name: "valueFormat",
      prop: "transform",
      css: `
          transform-origin: bottom;
          perspective: 20px;
          position: absolute;
        `,
      value: transfMax,
      valueStart: transfMin,
      valueFormat: transformStr.replace(transfMacroName, "%f"),
      expected: transfCycle
    }
  ];
  const func = (rd, done, index) => {
    const test = tests[index];
    rd.actions.isIdPropActions(`t${index}`, test.prop, test.expected);
    done();
  };
  const testParams = {};
  tests.forEach((test, index) => {
    testParams[`t${index} ${test.prop} uses ${test.name}`] = func;
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps,
      css: tests.map((test, index) => `#t${index} {${test.css}}`).join("\n"),
      animes: tests.map((test, index) => {
        return {
          selector: `#t${index}`,
          duration: `${seconds}s`,
          props: [{
            prop: test.prop,
            value: test.value,
            valueStart: test.valueStart,
            valueText: test.valueText,
            valueFormat: test.valueFormat
          }]
        };
      }),
      html: import_exact.Exact.genTestHtml(tests.length)
    },
    {
      jsMacros,
      tests: testParams
      /* ,
      toLogStdOut: true,
      toLogActions: true */
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-props.js.map
