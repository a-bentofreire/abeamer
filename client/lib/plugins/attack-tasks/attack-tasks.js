"use strict";
// uuid: 1c95b803-a2d8-463e-a8cd-743d6fc16d25
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of built-in attack Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **attack** is a quick and strong distortion of reality, created
 * with the purpose of grabbing the user attention or to process the visual
 * sensation as an attack by an exterior force.
 * Attacks can be done by changing quickly colors, texts, images and dimensions.
 *
 * This plugin has the following built-in attack tasks:
 *
 * - `color-attack` - produces a change in colors, returning to the original color at the end.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Attack Tasks
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    ABeamer.pluginManager.addPlugin({
        id: 'abeamer.attack-tasks',
        uuid: 'e98cfe21-ec23-4545-88eb-829a0e9add39',
        author: 'Alexandre Bento Freire',
        email: 'dev@a-bentofreire.com',
        jsUrls: ['plugins/attack-tasks/attack-tasks.js'],
        teleportable: true,
    });
    ABeamer.pluginManager.addTasks([['color-attack', _colorAttack]]);
    /** Implements the Color Attack Task */
    function _colorAttack(anime, wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                var attack = params.attack;
                var propName = params.prop || 'color';
                var cycles = ABeamer.ExprOrNumToNum(params.cycles, 1, args);
                var endColor = params.endColor;
                var finalAttack = [];
                for (var i = 0; i < cycles; i++) {
                    finalAttack = finalAttack.concat(attack);
                }
                if (endColor === undefined) {
                    var elAdaptors = args.scene.getElementAdapters(anime.selector);
                    if (elAdaptors.length) {
                        endColor = elAdaptors[0].getProp(propName);
                    }
                }
                if (endColor !== undefined) {
                    finalAttack.push(endColor);
                }
                if (!anime.props) {
                    anime.props = [];
                }
                anime.props.push({ prop: propName, valueText: finalAttack });
                return ABeamer.TR_DONE;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=attack-tasks.js.map