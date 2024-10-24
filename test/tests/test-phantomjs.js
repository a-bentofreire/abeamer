"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const min = 20;
  const max = 40;
  const tests = [
    {}
  ];
  const func = (rd, done) => {
    rd.actions.isIdPropActions(
      "t0",
      "left",
      import_exact.Exact.simulatePixelAction(
        import_exact.Exact.interpolateMinMax(min, max, rd.fps)
      )
    );
    done();
  };
  const testParams = {};
  tests.forEach((_test, index) => {
    testParams[`t${index} left goes from ${min} to ${max}`] = func;
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps: 4,
      css: tests.map((_test, index) => `#t${index} {position: absolute; left: ${min}px}`).join("\n"),
      animes: tests.map((_test, index) => {
        return {
          selector: `#t${index}`,
          duration: "1s",
          props: [{
            prop: "left",
            value: max
          }]
        };
      }),
      html: import_exact.Exact.genTestHtml(tests.length)
    },
    {
      toGenFrames: true,
      server: "phantomjs",
      tests: testParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-phantomjs.js.map
