"use strict";
var ABeamer;
((ABeamer2) => {
  pluginManager.addPlugin({
    id: "abeamer.attack-tasks",
    uuid: "e98cfe21-ec23-4545-88eb-829a0e9add39",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/attack-tasks/attack-tasks.js"],
    teleportable: true
  });
  pluginManager.addTasks([["color-attack", _colorAttack]]);
  function _colorAttack(anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        const attack = params.attack;
        const propName = params.prop || "color";
        const cycles = ExprOrNumToNum(params.cycles, 1, args);
        let endColor = params.endColor;
        let finalAttack = [];
        for (let i = 0; i < cycles; i++) {
          finalAttack = finalAttack.concat(attack);
        }
        if (endColor === void 0) {
          const elAdapters = args.scene.getElementAdapters(anime.selector);
          if (elAdapters.length) {
            endColor = elAdapters[0].getProp(propName);
          }
        }
        if (endColor !== void 0) {
          finalAttack.push(endColor);
        }
        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: propName, valueText: finalAttack });
        return TR_DONE;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=attack-tasks.js.map
