"use strict";
var import_exact = require("../exact.js");
var import_dev_consts = require("../../shared/lib/dev-consts.js");
var Tests;
((Tests2) => {
  const directions = [
    import_dev_consts.DevConsts.Directions.normal,
    import_dev_consts.DevConsts.Directions.reverse,
    import_dev_consts.DevConsts.Directions.alternate,
    import_dev_consts.DevConsts.Directions["alternate-reverse"]
  ].map((v) => import_dev_consts.DevConsts.Directions[v]);
  const min = 10;
  const max = 40;
  const minIterCount = 1;
  const maxIterCount = 6;
  const fps = 4;
  const seconds = 1;
  const cycle = import_exact.Exact.interpolateMinMax(min, max, seconds * fps);
  const revCycle = cycle.slice();
  revCycle.reverse();
  let tests = [];
  for (let j = minIterCount; j < maxIterCount; j++) {
    tests = tests.concat(directions.map((name) => ({ name, iterCount: j })));
  }
  const func = (rd, done, index) => {
    const test = tests[index];
    let fullCycle = [];
    const dirIndex = index % 4;
    for (let i = 0; i < test.iterCount; i++) {
      const isOdd = i % 2 === 0;
      switch (dirIndex) {
        case 0:
          fullCycle = fullCycle.concat(cycle);
          break;
        case 1:
          fullCycle = fullCycle.concat(revCycle);
          break;
        case 2:
          fullCycle = fullCycle.concat(isOdd ? cycle : revCycle);
          break;
        case 3:
          fullCycle = fullCycle.concat(!isOdd ? cycle : revCycle);
          break;
      }
    }
    rd.actions.isIdPropActions(
      `t${index}`,
      "left",
      import_exact.Exact.simulatePixelAction(fullCycle)
    );
    done();
  };
  const testParams = {};
  tests.forEach((test, index) => {
    testParams[`t${index} left uses direction ${test.name} ${test.iterCount} cycles goes from ${min} to ${max}`] = func;
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps,
      css: tests.map((_test, index) => `#t${index} {left: ${min}px}`).join("\n"),
      animes: tests.map((test, index) => {
        return {
          selector: `#t${index}`,
          duration: `${seconds}s`,
          props: [{
            prop: "left",
            iterationCount: test.iterCount,
            direction: test.name,
            value: max
          }]
        };
      }),
      html: import_exact.Exact.genTestHtml(tests.length)
    },
    {
      tests: testParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-direction.js.map
