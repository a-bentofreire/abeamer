"use strict";
var import_exact = require("../exact.js");
var import_jquery_easing_node = require("./vendor/jquery.easing.node.js");
var Tests;
((Tests2) => {
  const builder = new import_exact.Exact.TestBuilder();
  builder.min = 50;
  builder.max = 200;
  builder.elDuration = "2s";
  builder.addTests(Object.keys(import_jquery_easing_node.Easings.EasingFunctions).map((easingName) => ({
    preLabel: `easing ${easingName}: `,
    easingName,
    easingFunc: (t) => import_jquery_easing_node.Easings.EasingFunctions[easingName](0, t, 0, 1, 1)
  })));
  import_exact.Exact.runTestSuite(
    __filename,
    builder.getInMacros(),
    {
      tests: builder.runTestParams
    }
  );
})(Tests || (Tests = {}));
//# sourceMappingURL=test-easings.js.map
