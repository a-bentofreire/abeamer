"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const min = 50;
  const fps = 4;
  const divider = 1e3 / fps;
  const tests = [
    {
      scene: 1,
      element: 0,
      duration: "2s",
      max: 100,
      frameCount: 2e3 / divider
    },
    {
      scene: 2,
      element: 2,
      duration: "3s",
      max: 150,
      frameCount: 3e3 / divider
    }
  ];
  const func = (rd, done, index) => {
    const test = tests[index];
    rd.actions.isIdPropActions(
      `t${test.element}`,
      "left",
      import_exact.Exact.simulatePixelAction(
        import_exact.Exact.interpolateMinMax(min, test.max, test.frameCount)
      )
    );
    done();
  };
  const testParams = {};
  tests.forEach((test) => {
    testParams[`$t${test.element} on scene${test.scene} moves for ${test.duration}`] = func;
  });
  const animes = tests.map((test) => {
    return [`@@scene:${test.scene}`, {
      selector: `#t${test.element}`,
      duration: test.duration,
      props: [{
        prop: "left",
        value: test.max
      }]
    }];
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps,
      css: `.abslf {left: ${min}px}`,
      animes,
      html: import_exact.Exact.genTestHtml(7, { sceneMarkers: [2, 4, 6] })
    },
    {
      tests: testParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-flyovers.js.map
