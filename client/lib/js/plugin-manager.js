"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * A **plugin** is a 3rd-party extension which provides a set of functionalities,
 * allowing to extend the ecosystem to the already rich set of built-in functionalities.
 *
 * Plugins creators who wish to create a plugin to support [](teleporter), must:
 *
 * - Declare the plugin via `pluginManager.addPlugin`.
 * - Set the `pluginInfo.teleportable = true`.
 * - Follow the [Developer Guideline Rules](../../../../../developer/dev-docs/coding-style).
 *
 * ABeamer allows plugins to add the following functionality types:
 *
 * - [](easings)
 * - [](oscillators)
 * - [](paths)
 * - [](tasks)
 * - [](transitions)
 * - [](flyovers)
 * - [](functions)
 * - [](i18n)
 *
 * To add a functionality use: `pluginManager.add<functionality-type>`.
 *
 * In most cases, a functionality is a function that receives a set of parameters
 * followed by `args?:ABeamerArgs`.
 * This last parameter will provide information regarding the state of the system.
 *
 * Plugins should try to be independent of DOM in order to work
 * with virtual elements such as WebGL and canvas. However, in some cases is
 * required to work with DOM only.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Plugin Manager
    // ------------------------------------------------------------------------
    /** List of all the functionalities available to be extended by plugins. */
    let Functionalities;
    (function (Functionalities) {
        Functionalities[Functionalities["easings"] = 0] = "easings";
        Functionalities[Functionalities["oscillators"] = 1] = "oscillators";
        Functionalities[Functionalities["paths"] = 2] = "paths";
        Functionalities[Functionalities["transitions"] = 3] = "transitions";
        Functionalities[Functionalities["tasks"] = 4] = "tasks";
        Functionalities[Functionalities["flyovers"] = 5] = "flyovers";
        Functionalities[Functionalities["functions"] = 6] = "functions";
    })(Functionalities = ABeamer.Functionalities || (ABeamer.Functionalities = {}));
    // #export-section-end: release
    // -------------------------------
    const _FunctionalitiesContainers = [
        ABeamer._easingFunctions,
        ABeamer._easingFunctions,
        ABeamer._pathFunctions,
        ABeamer._taskFunctions,
        ABeamer._transitionFunctions,
        ABeamer._flyoverFunctions,
        ABeamer._exFunctions,
    ];
    /**
     * Allows 3rd-party to add easings, oscillators, paths, etc.
     */
    class _PluginManager {
        constructor() {
            this._plugins = [];
            this._locale = 'en';
        }
        addPlugin(pluginInfo) {
            this._plugins.push(pluginInfo);
        }
        addEasings(easings) {
            easings.forEach(easing => {
                ABeamer._easingFunctions[easing[0]] = easing[1];
            });
        }
        addOscillators(oscillators) {
            oscillators.forEach(oscillator => {
                ABeamer._easingFunctions[oscillator[0]] = oscillator[1];
            });
        }
        addPaths(paths) {
            paths.forEach(path => {
                ABeamer._pathFunctions[path[0]] = path[1];
            });
        }
        addTasks(tasks) {
            tasks.forEach(task => {
                ABeamer._taskFunctions[task[0]] = task[1];
            });
        }
        addTransitions(transitions) {
            transitions.forEach(transition => {
                ABeamer._transitionFunctions[transition[0]] = transition[1];
            });
        }
        addFlyovers(flyovers) {
            flyovers.forEach(flyover => {
                ABeamer._flyoverFunctions[flyover[0]] = flyover[1];
            });
        }
        addFunctions(functions) {
            functions.forEach(exprFunction => {
                ABeamer._exFunctions[exprFunction[0]] = exprFunction[1];
            });
        }
        addLocalization(localeInfo) {
            this._locale = localeInfo.locale;
            if (!this._locale) {
                ABeamer.throwErr('The localization locale can not be empty');
            }
            if (localeInfo.charRanges) {
                localeInfo.charRanges.forEach(charRange => {
                    ABeamer.CharRanges.push(charRange);
                });
            }
            const msgs = localeInfo.messages;
            if (msgs) {
                Object.keys(msgs).forEach(srcMsg => {
                    ABeamer.Msgs[srcMsg] = msgs[srcMsg];
                });
            }
            if (localeInfo.functionalities) {
                localeInfo.functionalities.forEach(functionality => {
                    const [aType, map] = functionality;
                    const funcIndex = typeof aType === 'string' ? Functionalities[aType] : aType;
                    if (funcIndex === undefined) {
                        throw `Unknown functionality ${aType}`;
                    }
                    const container = _FunctionalitiesContainers[funcIndex];
                    map.forEach(srcDst => {
                        container[srcDst.dst] = container[srcDst.src];
                    });
                });
            }
        }
    }
    ABeamer._PluginManager = _PluginManager;
    ABeamer.pluginManager = new _PluginManager();
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=plugin-manager.js.map