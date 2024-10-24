"use strict";
var ABeamer;
((ABeamer2) => {
  let PathName;
  ((PathName2) => {
    PathName2[PathName2["line"] = 0] = "line";
    PathName2[PathName2["rect"] = 1] = "rect";
    PathName2[PathName2["circle"] = 2] = "circle";
    PathName2[PathName2["ellipse"] = 3] = "ellipse";
  })(PathName = ABeamer2.PathName || (ABeamer2.PathName = {}));
  ABeamer2._pathFunctions = {};
  function _pathNumToStr(num) {
    return PathName[num];
  }
  ABeamer2._pathNumToStr = _pathNumToStr;
  function _expressionPath(t, params, _stage, args) {
    _vars.t = t;
    const v = calcExpr(params._expression, args);
    return Array.isArray(v) ? v : [parseFloat(v)];
  }
  ABeamer2._expressionPath = _expressionPath;
  ABeamer2._pathFunctions["line"] = _linePath;
  function _linePath(t, params, _stage, args) {
    if (!params._isPrepared) {
      params._x0 = ExprOrNumToNum(params.x0, 0, args);
      params._y0 = ExprOrNumToNum(params.y0, 0, args);
      params._sx = ExprOrNumToNum(params.x1, 1, args) - params._x0;
      params._sy = ExprOrNumToNum(params.y1, 1, args) - params._y0;
    }
    return [params._sx * t + params._x0, params._sy * t + params._y0];
  }
  ABeamer2._pathFunctions["rect"] = _rectPath;
  function _rectPath(t, params, _stage, args) {
    if (!params._isPrepared) {
      params._isPrepared = true;
      params._x0 = ExprOrNumToNum(params.x0, 0, args);
      params._y0 = ExprOrNumToNum(params.y0, 0, args);
      params._x1 = ExprOrNumToNum(params.x1, 1, args);
      params._y1 = ExprOrNumToNum(params.y1, 1, args);
      params._dx = params._x1 - params._x0;
      params._dy = params._y1 - params._y0;
      const divider = 1 / (2 * (params._dx + params._dy));
      params._xSlot = params._dx * divider;
      params._ySlot = params._dy * divider;
    }
    if (t < 0) {
      return [params._x0, params._y0];
    }
    if (t <= params._xSlot) {
      return [params._x0 + params._dx * t / params._xSlot, params._y0];
    }
    t -= params._xSlot;
    if (t <= params._ySlot) {
      return [params._x1, params._y0 + params._dy * t / params._ySlot];
    }
    t -= params._ySlot;
    if (t <= params._xSlot) {
      return [params._x1 - params._dx * t / params._xSlot, params._y1];
    }
    t -= params._xSlot;
    if (t <= params._ySlot) {
      return [params._x0, params._y1 - params._dy * t / params._ySlot];
    }
    return [params._x1, params._y1];
  }
  function _interpolateEllipse(t, params, radiusX, radiusY, _stage, args) {
    if (!params._isPrepared) {
      params._isPrepared = true;
      params._centerX = ExprOrNumToNum(params.centerX, 0, args);
      params._centerY = ExprOrNumToNum(params.centerY, 0, args);
      params._radiusX = ExprOrNumToNum(radiusX, 1, args);
      params._radiusY = ExprOrNumToNum(radiusY, 1, args);
    }
    t = 2 * Math.PI * t;
    return [
      Math.cos(t) * params._radiusX + params._centerX,
      Math.sin(t) * params._radiusY + params._centerY
    ];
  }
  ABeamer2._pathFunctions["circle"] = _circlePath;
  function _circlePath(t, params, stage, args) {
    return _interpolateEllipse(t, params, params.radius, params.radius, stage, args);
  }
  ABeamer2._pathFunctions["ellipse"] = _ellipsePath;
  function _ellipsePath(t, params, stage, args) {
    return _interpolateEllipse(
      t,
      params,
      params.radiusX,
      params.radiusY,
      stage,
      args
    );
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=paths.js.map
