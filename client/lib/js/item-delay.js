"use strict";
var ABeamer;
((ABeamer2) => {
  function _parseItemDelay(values, args) {
    if (!values.itemDelayDuration) {
      return { duration: 0 };
    }
    return {
      duration: parseTimeHandler(values.itemDelayDuration, args, 0, 0, false),
      grouping: values.itemDelayGrouping,
      disturbance: values.itemDelayDisturbance ? parseTimeHandler(values.itemDelayDisturbance, args, 0, 0, false) : 0
    };
  }
  ABeamer2._parseItemDelay = _parseItemDelay;
  function _computeItemDelay(it, elIndex) {
    const disturbance = it.disturbance;
    if (disturbance) {
      elIndex = elIndex + Math.random() * 2 * disturbance - disturbance;
    }
    return Math.max(downRound((!it.grouping ? elIndex : elIndex % it.grouping) * it.duration), 0);
  }
  ABeamer2._computeItemDelay = _computeItemDelay;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=item-delay.js.map
