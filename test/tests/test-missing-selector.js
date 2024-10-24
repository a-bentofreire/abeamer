"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const ERR_EMPTY_SEL = "Selector #t1 is empty";
  import_exact.Exact.runTestSuite(
    __filename,
    {
      fps: 8,
      css: `#t0 {left:20px}`,
      animes: [
        {
          selector: "#t1",
          props: [{
            prop: "left",
            duration: "1s",
            value: 40
          }]
        },
        {
          selector: "#t0",
          props: [{
            prop: "left",
            duration: "1s",
            value: 140
          }]
        }
      ],
      html: import_exact.Exact.genTestHtml(1)
    },
    {
      expectedErrors: [ERR_EMPTY_SEL],
      tests: {
        "missing t1 is bypass gracefully": (rd, done) => {
          import_exact.Exact.AssertHasLine(rd, ERR_EMPTY_SEL, true);
          done();
        },
        "t0 moves as normal": (rd, done) => {
          rd.actions.isIdPropActions(
            "t0",
            "left",
            import_exact.Exact.simulatePixelAction(
              import_exact.Exact.interpolateMinMax(20, 140, rd.fps)
            )
          );
          done();
        }
      }
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-missing-selector.js.map
