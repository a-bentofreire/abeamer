"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const tests = [
    { prop: "left", min: 20, max: 100 },
    { prop: "top", min: 40, max: 150 },
    { prop: "right", min: 15, max: 120 },
    { prop: "bottom", min: 13, max: 140 }
  ];
  const builder = new import_exact.Exact.TestBuilder();
  builder.cssClassesForHtml = { cssClass: "" };
  builder.addTests(tests);
  import_exact.Exact.runTestSuite(
    __filename,
    builder.getInMacros(),
    {
      tests: builder.runTestParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-move-pixels.js.map
