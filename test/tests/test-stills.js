"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const min = 50;
  const fps = 4;
  const divider = 1e3 / fps;
  const tests = [
    {
      name: "before-still",
      duration: "2s",
      max: 100,
      frameCount: 2e3 / divider,
      shift: 0
    },
    {
      name: "still",
      duration: "1s",
      isStill: true,
      shift: 1e3 / divider
    },
    {
      name: "after-still",
      duration: "3s",
      max: 150,
      position: "-0.5s",
      frameCount: 3e3 / divider,
      shift: -500 / divider
    }
  ];
  const ranges = [];
  let minAcc = min;
  let startFrameAcc = 0;
  let absStartFrameAcc = 0;
  tests.forEach((test) => {
    absStartFrameAcc += test.shift;
    if (!test.isStill) {
      test.min = minAcc;
      minAcc = test.max;
      test.startFrame = startFrameAcc;
      startFrameAcc += test.frameCount;
      ranges.push([absStartFrameAcc, test.frameCount]);
      absStartFrameAcc += test.frameCount;
    }
  });
  const func = (rd, done, index) => {
    const test = tests[index];
    if (!test.isStill) {
      rd.actions.isIdPropActions(
        "t0",
        "left",
        import_exact.Exact.simulatePixelAction(
          import_exact.Exact.interpolateMinMax(test.min, test.max, test.frameCount)
        ),
        true,
        true,
        test.startFrame,
        test.frameCount
      );
    } else {
      rd.actions.isIdPropRanges("t0", "left", ranges);
    }
    done();
  };
  const testParams = {};
  tests.forEach((test) => {
    testParams[!test.isStill ? `${test.name} - t0 moves for ${test.duration} at ${test.position || ""}` : `${test.name} - t0 DOESN'T moves for ${test.duration}`] = func;
  });
  const animes = tests.map((test) => {
    return !test.isStill ? {
      selector: `#t0`,
      duration: test.duration,
      position: test.position,
      props: [{
        prop: "left",
        value: test.max
      }]
    } : ["@@no-wrap-add-animation", `scene1.addStills("${test.duration}");`];
  });
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps,
      css: `#t0 {left: ${min}px}`,
      animes,
      html: import_exact.Exact.genTestHtml(1)
    },
    {
      tests: testParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-stills.js.map
