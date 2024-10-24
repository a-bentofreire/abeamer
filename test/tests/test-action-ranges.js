"use strict";
var import_exact = require("../exact.js");
var import_dev_consts = require("../../shared/lib/dev-consts.js");
var Tests;
((Tests2) => {
  const fps = 4;
  const seconds = 2;
  const absMin = 50;
  const elProps = [
    { elIndex: 0, prop: "left", relMin: absMin, startFrame: 0, propType: import_dev_consts.DevConsts.PT_PIXEL },
    { elIndex: 0, prop: "top", relMin: absMin, startFrame: 0, propType: import_dev_consts.DevConsts.PT_PIXEL },
    { elIndex: 1, prop: "left", relMin: absMin, startFrame: 0, propType: import_dev_consts.DevConsts.PT_PIXEL },
    { elIndex: 1, prop: "opacity", relMin: 1, startFrame: 0, propType: import_dev_consts.DevConsts.PT_NUMBER }
  ];
  const tests = [
    { elProp: 0, max: 100 },
    { elProp: 0, max: 200, label: "links to previous" },
    { elProp: 1, max: 100, label: "disrupts with a different prop" },
    { elProp: 0, max: 250, label: "resumes first prop" },
    { elProp: 2, max: 150, label: "disrupts with a different element" },
    { elProp: 0, max: 400, label: "resumes first prop" },
    { elProp: 0, max: 10, label: "reverses movement" },
    { elProp: 1, max: 150, label: "resumes 2nd prop" },
    { elProp: 3, max: 0.5, label: "tests num value" }
  ].map((test) => {
    const elProp = elProps[test.elProp];
    const v = {
      elIndex: elProp.elIndex,
      propName: elProp.prop,
      propType: elProp.propType,
      name: test.toString(),
      min: elProp.relMin,
      max: test.max,
      label: test.label ? `(${test.label}) - ` : "",
      startFrame: elProp.startFrame,
      frameCount: fps * seconds
    };
    elProp.startFrame += v.frameCount;
    elProp.relMin = test.max;
    return v;
  });
  const func = (rd, done, index) => {
    const test = tests[index];
    const expected = import_exact.Exact.interpolateMinMax(test.min, test.max, 2 * rd.fps);
    import_exact.Exact.roundToTestDigits(expected);
    const expectedPA = import_exact.Exact.simulateAction(expected, test.propType);
    rd.actions.isIdPropActions(
      `t${test.elIndex}`,
      test.propName,
      expectedPA,
      true,
      true,
      test.startFrame,
      test.frameCount
    );
    done();
  };
  const testParams = {};
  tests.forEach((test) => {
    testParams[`${test.label}t${test.elIndex} ${test.propName} goes from ${test.min} to ${test.max}`] = func;
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps,
      css: `#t0,#t1 {left: ${absMin}px; top: ${absMin}px;}`,
      animes: tests.map((test) => {
        return {
          selector: `#t${test.elIndex}`,
          duration: `${seconds}s`,
          props: [{
            prop: test.propName,
            value: test.max
          }]
        };
      }),
      html: import_exact.Exact.genTestHtml(2)
    },
    {
      tests: testParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-action-ranges.js.map
