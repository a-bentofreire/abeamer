"use strict";
var import_exact = require("../exact.js");
var Tests;
((Tests2) => {
  const builder = new import_exact.Exact.TestBuilder();
  builder.addTests([{}]);
  import_exact.Exact.runTestSuite(
    __filename,
    builder.getInMacros(),
    {
      toGenFrames: true,
      tests: builder.runTestParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-sanity.js.map
