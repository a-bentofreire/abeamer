"use strict";
var ABeamer;
((ABeamer2) => {
  function _findActionRg(actionRgMaps, elementAdpt, propName, startFrame, endFrame, args) {
    const propValue = elementAdpt.getProp("uid", args);
    let index = propValue !== void 0 ? parseInt(propValue) : -1;
    const found = index >= 0;
    let actionRgMap;
    if (!found) {
      index = actionRgMaps.length;
      elementAdpt.setProp("uid", index.toString(), args);
      actionRgMap = {};
      actionRgMaps.push(actionRgMap);
    } else {
      actionRgMap = actionRgMaps[index];
    }
    let actionRgList = actionRgMap[propName];
    if (!actionRgList) {
      actionRgList = [];
      actionRgMap[propName] = actionRgList;
    }
    const actionRg = {
      startFrame,
      endFrame
    };
    actionRgList.push(actionRg);
    const res = {
      actionRgMap,
      actionRgList,
      actionRg,
      linkIndex: actionRgList.length - 2
    };
    if (res.linkIndex >= 0) {
      const lastActionRg = actionRgList[res.linkIndex];
      actionRg.propType = lastActionRg.propType;
      if (lastActionRg.endFrame >= startFrame) {
        throwErr(`overlapping property animations is not supported.${lastActionRg.endFrame} must be higher than ${startFrame}`);
      }
    }
    return res;
  }
  ABeamer2._findActionRg = _findActionRg;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=actions.js.map
