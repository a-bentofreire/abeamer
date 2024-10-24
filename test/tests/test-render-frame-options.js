"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const min = 50;
  const fps = 4;
  const tests = [
    {
      // it goes from 50 to 100 in 2s
      sceneNr: 1,
      element: 0,
      duration: "2s",
      max: 100
    },
    {
      // then from 100 to 200 in 2s
      sceneNr: 1,
      element: 0,
      duration: "2s",
      max: 200
    },
    {
      sceneNr: 2,
      element: 3,
      duration: "1s",
      max: 150
    },
    {
      sceneNr: 2,
      element: 3,
      duration: "2s",
      max: 300
    }
  ].map((test) => {
    test.frameCount = import_exact.Exact.calcFrameCount(test.duration, fps);
    return test;
  });
  const t0_inter = [].concat(
    import_exact.Exact.simulatePixelAction(
      import_exact.Exact.interpolateMinMax(min, tests[0].max, tests[0].frameCount)
    ),
    import_exact.Exact.simulatePixelAction(import_exact.Exact.interpolateMinMax(
      tests[0].max,
      tests[1].max,
      tests[1].frameCount
    ))
  );
  const t3_inter = [].concat(
    import_exact.Exact.simulatePixelAction(
      import_exact.Exact.interpolateMinMax(min, tests[2].max, tests[2].frameCount)
    ),
    import_exact.Exact.simulatePixelAction(import_exact.Exact.interpolateMinMax(
      tests[2].max,
      tests[3].max,
      tests[3].frameCount
    ))
  );
  function testBypass(rd, element, fromFrame, count, dir) {
    while (count > 0) {
      const s = `bypass:id=_[${element}]_ prop=_[left]_ frame=_[${fromFrame}]_`;
      import_exact.Exact.AssertHasLine(rd, s);
      fromFrame += dir;
      count--;
    }
  }
  function testAction(rd, element, inter, fromFrame, count, dir) {
    while (count > 0) {
      const s = `action:id=_[${element}]_ prop=_[left]_ value=_[${inter[fromFrame]}]_`;
      import_exact.Exact.AssertHasLine(rd, s);
      fromFrame += dir;
      count--;
    }
  }
  const renders = [
    {
      test: {
        name: "Test bypass 1s, and then renders t0 for 2s"
      },
      runTest: (rd, _render, opts) => {
        const startFrame = import_exact.Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = import_exact.Exact.calcFrameCount(opts.renderCount, fps);
        testBypass(rd, "t0", 0, startFrame, 1);
        testAction(rd, "t0", t0_inter, startFrame, renderFrameCount, 1);
      },
      frameOptions: {
        renderPos: "1s",
        renderCount: "2s"
      }
    },
    {
      test: {
        name: "Test render 2nd scene, skipping 2frames. moves t2"
      },
      runTest: (rd, _render, opts) => {
        const startFrame = import_exact.Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = t3_inter.length - startFrame;
        testBypass(rd, "t3", 0, 3, 1);
        testBypass(rd, "t3", 4, startFrame - 4, 1);
        testAction(rd, "t3", t3_inter, startFrame, renderFrameCount, 1);
      },
      frameOptions: {
        renderPos: "1.5s",
        startScene: 1,
        endScene: 1
      }
    },
    {
      test: {
        name: "Test go back to scene 1, rewind 1s, and render 2s"
      },
      runTest: (rd, _render, opts) => {
        testBypass(rd, "t0", 12, 4, -1);
        const startFrame = import_exact.Exact.calcFrameCount(opts.renderPos, fps);
        const renderFrameCount = import_exact.Exact.calcFrameCount(opts.renderCount, fps);
        testAction(rd, "t0", t0_inter, startFrame, renderFrameCount, 1);
      },
      frameOptions: {
        renderPos: "2s",
        renderCount: "2s"
      }
    }
  ];
  const func = (rd, done, index) => {
    const render = renders[index];
    render.runTest(rd, render, render.frameOptions);
    done();
  };
  const testParams = {};
  renders.forEach((render) => {
    testParams[render.test.name] = func;
  });
  const animes = tests.map((test) => {
    return [`@@scene:${test.sceneNr}`, {
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
      tests: testParams,
      renderFrameOptions: renders[0].frameOptions,
      extraRenderCalls: renders.slice(1).map((render) => render.frameOptions)
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-render-frame-options.js.map
