"use strict";
var ABeamer;
((ABeamer2) => {
  _taskFunctions["scene-transition"] = _SceneTransitionTask;
  function _SceneTransitionTask(_anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_TELEPORT:
        let handler = params.handler;
        if (typeof handler === "number") {
          handler = StdTransitions[handler];
        } else {
          throwIfI8n(typeof handler === "function", Msgs.NoCode);
        }
        params.handler = handler;
        return TR_EXIT;
      case TS_INIT:
        args.scene.transition = {
          handler: params.handler,
          duration: params.duration
        };
        return TR_EXIT;
    }
  }
  _taskFunctions["add-stills"] = _addStillsTask;
  function _addStillsTask(_anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        args.scene.addStills(params.duration);
        return TR_EXIT;
    }
  }
  _taskFunctions["add-flyover"] = _addFlyover;
  function _addFlyover(_anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        args.story.addFlyover(params.handler, params.params);
        return TR_EXIT;
    }
  }
  _taskFunctions["add-vars"] = _addVarsTask;
  function _addVarsTask(_anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        const vars = params.vars || {};
        const overwrite = params.overwrite !== false;
        const allowExpr = params.allowExpr === true;
        Object.keys(vars).forEach((varName) => {
          const varParts = varName.split(".");
          let argsPointer = args.vars;
          let objPartName = varParts.shift();
          while (varParts.length) {
            argsPointer[objPartName] = argsPointer[objPartName] || {};
            argsPointer = argsPointer[objPartName];
            objPartName = varParts.shift();
          }
          if (overwrite || argsPointer[objPartName] === void 0) {
            let varValue = vars[varName];
            if (allowExpr && typeof varValue === "string" && isExpr(varValue)) {
              varValue = calcExpr(varValue, args);
            }
            argsPointer[objPartName] = varValue;
          }
        });
        return TR_EXIT;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=wrapper-tasks.js.map
