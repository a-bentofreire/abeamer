"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2.TR_EXIT = 0;
  ABeamer2.TR_DONE = 1;
  ABeamer2.TR_INTERACTIVE = 2;
  ABeamer2.TS_INIT = 0;
  ABeamer2.TS_ANIME_LOOP = 1;
  ABeamer2.TS_TELEPORT = 2;
  ABeamer2._taskFunctions = {};
  function _buildWorkTask(task, anime, toTeleport, args) {
    const handler = task.handler;
    let taskFunc;
    args.user = task.params;
    switch (typeof handler) {
      case "string":
        taskFunc = ABeamer2._taskFunctions[handler];
        break;
      case "function":
        taskFunc = handler;
        throwIfI8n(toTeleport, Msgs.NoCode);
        break;
    }
    if (!taskFunc) {
      throwI8n(Msgs.UnknownOf, { type: Msgs.task, p: handler });
    }
    const wkTask = {
      func: taskFunc,
      name: handler,
      params: task.params || {},
      animeIndex: -1
    };
    if (toTeleport) {
      task.handler = handler;
      taskFunc(anime, wkTask, wkTask.params, ABeamer2.TS_TELEPORT, args);
    }
    return wkTask;
  }
  function _prepareTasksForTeleporting(anime, tasks, args) {
    tasks.forEach((task) => {
      _buildWorkTask(task, anime, true, args);
    });
  }
  ABeamer2._prepareTasksForTeleporting = _prepareTasksForTeleporting;
  function _processTasks(tasks, wkTasks, anime, args) {
    let toExit = true;
    tasks.forEach((task) => {
      const wkTask = _buildWorkTask(task, anime, false, args);
      const taskResult = wkTask.func(anime, wkTask, wkTask.params, ABeamer2.TS_INIT, args);
      switch (taskResult) {
        case ABeamer2.TR_EXIT:
          return;
        case ABeamer2.TR_DONE:
          toExit = false;
          break;
        case ABeamer2.TR_INTERACTIVE:
          toExit = false;
          wkTasks.push(wkTask);
          break;
      }
    });
    return toExit;
  }
  ABeamer2._processTasks = _processTasks;
  function _runTasks(wkTasks, anime, animeIndex, args) {
    wkTasks.forEach((wkTask) => {
      wkTask.animeIndex = animeIndex;
      wkTask.func(anime, wkTask, wkTask.params, ABeamer2.TS_ANIME_LOOP, args);
    });
  }
  ABeamer2._runTasks = _runTasks;
  function _formatValue(value, isFormatted, index, args) {
    if (typeof value === "object") {
      value = value[index % value.length];
    }
    if (isFormatted === false) {
      return value;
    }
    args.vars.i = index;
    const exprValue = ifExprCalc(value, args);
    return exprValue !== void 0 ? exprValue.toString() : sprintf(value, index);
  }
  ABeamer2._taskFunctions["factory"] = _factory;
  function _factory(anime, _wkTask, params, stage, args) {
    switch (stage) {
      case ABeamer2.TS_INIT:
        const tag = params.tag || "div";
        const count = ifExprCalcNum(
          params.count,
          params.count,
          args
        );
        const needsClosing = ["img"].indexOf(tag) === -1;
        const elAdapters = args.scene.getElementAdapters(anime.selector);
        args.vars.elCount = elAdapters.length;
        elAdapters.forEach((elAdapter, elIndex) => {
          args.vars.elIndex = elIndex;
          const inTextHtml = [];
          for (let i = 0; i < count; i++) {
            const parts = ["<" + tag];
            (params.attrs || []).forEach((param) => {
              const value = _formatValue(param.value, param.isFormatted, i, args);
              parts.push(` ${param.name}="${value}"`);
            });
            parts.push(">");
            parts.push(_formatValue(
              params.content || "",
              params.isContentFormatted,
              i,
              args
            ));
            if (needsClosing) {
              parts.push(`</${tag}>`);
            }
            inTextHtml.push(parts.join(""));
          }
          elAdapter.setProp("html", inTextHtml.join("\n"), args);
        });
        return ABeamer2.TR_EXIT;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=tasks.js.map
