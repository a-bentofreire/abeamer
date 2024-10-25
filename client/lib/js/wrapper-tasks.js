"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of built-in wrapper Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A wrapper task calls a story or scene method, allowing for a story
 * to be loaded from JSON file or to be [](teleporter).
 *
 * ABeamer has the following built-in wrapper tasks:
 *
 * - `scene-transition` - setup a scene transition.
 *
 * - `add-stills` - adds stills to the scene pipeline.
 *
 * - `add-flyover` - adds a flyover to the story.
 *
 * - `add-vars` - adds variables to be used by expressions.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Text Tasks
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               SceneTransition Task
    // ------------------------------------------------------------------------
    ABeamer._taskFunctions['scene-transition'] = _SceneTransitionTask;
    /** Implements the Scene Transition Task */
    function _SceneTransitionTask(_anime, _wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_TELEPORT:
                var handler = params.handler;
                if (typeof handler === 'number') {
                    handler = ABeamer.StdTransitions[handler];
                }
                else {
                    ABeamer.throwIfI8n(typeof handler === 'function', ABeamer.Msgs.NoCode);
                }
                params.handler = handler;
                return ABeamer.TR_EXIT;
            case ABeamer.TS_INIT:
                args.scene.transition = {
                    handler: params.handler,
                    duration: params.duration,
                };
                return ABeamer.TR_EXIT;
        }
    }
    // ------------------------------------------------------------------------
    //                               AddStills
    // ------------------------------------------------------------------------
    ABeamer._taskFunctions['add-stills'] = _addStillsTask;
    /** Implements the Add Stills Task */
    function _addStillsTask(_anime, _wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                args.scene.addStills(params.duration);
                return ABeamer.TR_EXIT;
        }
    }
    // ------------------------------------------------------------------------
    //                               AddFlyover
    // ------------------------------------------------------------------------
    ABeamer._taskFunctions['add-flyover'] = _addFlyover;
    /** Implements the Add Flyover Task */
    function _addFlyover(_anime, _wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                args.story.addFlyover(params.handler, params.params);
                return ABeamer.TR_EXIT;
        }
    }
    // ------------------------------------------------------------------------
    //                               AddVars
    // ------------------------------------------------------------------------
    ABeamer._taskFunctions['add-vars'] = _addVarsTask;
    /** Implements the Add Vars Task */
    function _addVarsTask(_anime, _wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                var vars_1 = params.vars || {};
                var overwrite_1 = params.overwrite !== false;
                var allowExpr_1 = params.allowExpr === true;
                Object.keys(vars_1).forEach(function (varName) {
                    var varParts = varName.split('.');
                    var argsPointer = args.vars;
                    var objPartName = varParts.shift();
                    while (varParts.length) {
                        argsPointer[objPartName] = argsPointer[objPartName] || {};
                        argsPointer = argsPointer[objPartName];
                        objPartName = varParts.shift();
                    }
                    if (overwrite_1 || argsPointer[objPartName] === undefined) {
                        var varValue = vars_1[varName];
                        if (allowExpr_1 && typeof varValue === 'string' && ABeamer.isExpr(varValue)) {
                            varValue = ABeamer.calcExpr(varValue, args);
                        }
                        argsPointer[objPartName] = varValue;
                    }
                });
                return ABeamer.TR_EXIT;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=wrapper-tasks.js.map