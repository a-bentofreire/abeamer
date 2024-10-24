"use strict";
var ABeamer;
((ABeamer2) => {
  let Functionalities;
  ((Functionalities2) => {
    Functionalities2[Functionalities2["easings"] = 0] = "easings";
    Functionalities2[Functionalities2["oscillators"] = 1] = "oscillators";
    Functionalities2[Functionalities2["paths"] = 2] = "paths";
    Functionalities2[Functionalities2["transitions"] = 3] = "transitions";
    Functionalities2[Functionalities2["tasks"] = 4] = "tasks";
    Functionalities2[Functionalities2["flyovers"] = 5] = "flyovers";
    Functionalities2[Functionalities2["functions"] = 6] = "functions";
  })(Functionalities = ABeamer2.Functionalities || (ABeamer2.Functionalities = {}));
  const _FunctionalitiesContainers = [
    _easingFunctions,
    _easingFunctions,
    _pathFunctions,
    _taskFunctions,
    _transitionFunctions,
    _flyoverFunctions,
    _exFunctions
  ];
  class _PluginManager {
    constructor() {
      this._plugins = [];
      this._locale = "en";
    }
    addPlugin(pluginInfo) {
      this._plugins.push(pluginInfo);
    }
    addEasings(easings) {
      easings.forEach((easing) => {
        _easingFunctions[easing[0]] = easing[1];
      });
    }
    addOscillators(oscillators) {
      oscillators.forEach((oscillator) => {
        _easingFunctions[oscillator[0]] = oscillator[1];
      });
    }
    addPaths(paths) {
      paths.forEach((path) => {
        _pathFunctions[path[0]] = path[1];
      });
    }
    addTasks(tasks) {
      tasks.forEach((task) => {
        _taskFunctions[task[0]] = task[1];
      });
    }
    addTransitions(transitions) {
      transitions.forEach((transition) => {
        _transitionFunctions[transition[0]] = transition[1];
      });
    }
    addFlyovers(flyovers) {
      flyovers.forEach((flyover) => {
        _flyoverFunctions[flyover[0]] = flyover[1];
      });
    }
    addFunctions(functions) {
      functions.forEach((exprFunction) => {
        _exFunctions[exprFunction[0]] = exprFunction[1];
      });
    }
    addLocalization(localeInfo) {
      this._locale = localeInfo.locale;
      if (!this._locale) {
        throwErr("The localization locale can not be empty");
      }
      if (localeInfo.charRanges) {
        localeInfo.charRanges.forEach((charRange) => {
          CharRanges.push(charRange);
        });
      }
      const msgs = localeInfo.messages;
      if (msgs) {
        Object.keys(msgs).forEach((srcMsg) => {
          Msgs[srcMsg] = msgs[srcMsg];
        });
      }
      if (localeInfo.functionalities) {
        localeInfo.functionalities.forEach((functionality) => {
          const [aType, map] = functionality;
          const funcIndex = typeof aType === "string" ? Functionalities[aType] : aType;
          if (funcIndex === void 0) {
            throw `Unknown functionality ${aType}`;
          }
          const container = _FunctionalitiesContainers[funcIndex];
          map.forEach((srcDst) => {
            container[srcDst.dst] = container[srcDst.src];
          });
        });
      }
    }
  }
  ABeamer2._PluginManager = _PluginManager;
  ABeamer2.pluginManager = new _PluginManager();
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=plugin-manager.js.map
