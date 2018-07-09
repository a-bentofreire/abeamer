"use strict";
// uuid: 57f31321-69a9-4170-96a1-6baac731403b
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
// Implements a list of built-in wrapper Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A wrapper task calls a story or scene method, allowing for a story
 * to be loaded from JSON file or to be [](teleported).
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
    function _SceneTransitionTask(anime, wkTask, params, stage, args) {
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
    function _addStillsTask(anime, wkTask, params, stage, args) {
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
    function _addFlyover(anime, wkTask, params, stage, args) {
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
    function _addVarsTask(anime, wkTask, params, stage, args) {
        switch (stage) {
            case ABeamer.TS_INIT:
                var vars_1 = params.vars || {};
                Object.keys(vars_1).forEach(function (varName) {
                    var varParts = varName.split('.');
                    var argsPointer = args.vars;
                    var part = varParts.shift();
                    while (varParts.length) {
                        argsPointer[part] = argsPointer[part] || {};
                        argsPointer = argsPointer[part];
                        part = varParts.shift();
                    }
                    argsPointer[part] = vars_1[varName];
                });
                return ABeamer.TR_EXIT;
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=wrapper-tasks.js.map