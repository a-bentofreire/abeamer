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
 * **WARNING:** The messages in this file will be moved to messages/messages-en.ts file on version 2.x.
 * Users are encouraged to include the messages/messages-en.js on their index.html
 * even though for now it's an empty file to prevent breaking changes.
 *
 * ABeamer allows to localize the name of functions and other functionalities
 * such the names of tasks, flyovers and scene transitions.
 * The names can include non-latin characters.
 *
 * Fill Localization with the localize data, and add it
 * via `ABeamer.pluginManager.addLocalization`.
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Messages
    // ------------------------------------------------------------------------
    /**
     * These messages will be moved messages/messages-en.ts on version 2.x
     */
    var Msgs;
    (function (Msgs) {
        Msgs["MustNatPositive"] = "The value of %p% must be a natural positive";
        Msgs["MustNatNotNegative"] = "The value of %p% must be a natural non-negative";
        Msgs["MustBeANumber"] = "The value of %p% must be a number";
        Msgs["MustBeAString"] = "The value of %p% must be textual";
        Msgs["MustBeANumberOrExpr"] = "The value of %p% must be a number or an expression";
        Msgs["MustBeAStringOrExpr"] = "The value of %p% must be textual or an expression";
        Msgs["Unknown"] = "Unknown %p%";
        Msgs["UnknownOf"] = "Unknown \"%type%\" %p%";
        Msgs["UnknownType"] = "Unknown type of %p%";
        Msgs["NoEmptyField"] = "Field %p% can not be empty";
        Msgs["NoEmptySelector"] = "Selector %p% can not be empty";
        Msgs["NoCode"] = "Code Handler is not allowed";
        Msgs["OutOfScope"] = "%p% out of scope";
        Msgs["ExpHasErrors"] = "Expression %e% has errors: %err%";
        Msgs["WrongNrParams"] = "Function %p% has the wrong number of input parameters";
        Msgs["WrongParamType"] = "Function %p% has the wrong type in parameter: %i%";
        Msgs["ValueTypeError"] = "Value %p% must be a number or an expression";
        Msgs["UnaryErr"] = "Unary operators only support numerical values";
        Msgs["flyover"] = "flyover";
        Msgs["task"] = "task";
        Msgs["pos"] = "position";
        Msgs["startScene"] = "startScene";
        Msgs["endScene"] = "endScene";
    })(Msgs = ABeamer.Msgs || (ABeamer.Msgs = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    function i8nMsg(msg, params) {
        if (params) {
            msg = msg.replace(/%(\w+)%/g, function (_all, p) { return params[p].toString(); });
        }
        return msg;
    }
    ABeamer.i8nMsg = i8nMsg;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=i18n.js.map