"use strict";
var ABeamer;
((ABeamer2) => {
  let Directions;
  ((Directions2) => {
    Directions2[Directions2["normal"] = 0] = "normal";
    Directions2[Directions2["reverse"] = 1] = "reverse";
    Directions2[Directions2["alternate"] = 2] = "alternate";
    Directions2[Directions2["alternate-reverse"] = 3] = "alternate-reverse";
  })(Directions = ABeamer2.Directions || (ABeamer2.Directions = {}));
  const DIRECTION_TO_DIR_PAIR = [
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
  ];
  function _propDirToDirPair(direction) {
    if (direction === void 0) {
      return DIRECTION_TO_DIR_PAIR[0 /* normal */];
    }
    if (typeof direction === "string") {
      direction = Directions[direction];
    }
    if (direction < 0 || direction >= DIRECTION_TO_DIR_PAIR.length) {
      throwErr(`Direction has an invalid value`);
    }
    return DIRECTION_TO_DIR_PAIR[direction];
  }
  ABeamer2._propDirToDirPair = _propDirToDirPair;
  function _computeIterationCount(i, frameI, dirPair, framesPerCycle) {
    if (dirPair[0] !== dirPair[1] && (i + 1) % framesPerCycle === 0) {
      return frameI;
    }
    const isOddInt = Math.floor((i + 1) / framesPerCycle) % 2;
    frameI += dirPair[isOddInt];
    if (frameI >= framesPerCycle) {
      frameI -= framesPerCycle;
    } else if (frameI < 0) {
      frameI += framesPerCycle;
    }
    return frameI;
  }
  ABeamer2._computeIterationCount = _computeIterationCount;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=animation-direction.js.map
