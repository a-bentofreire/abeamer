"use strict";
// uuid: 4e1951ce-4437-4155-a860-7c8a5b2a36f3
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Messages
    // ------------------------------------------------------------------------
    var Msgs;
    (function (Msgs) {
        Msgs["MustNatPositive"] = "The value of %p% must be a natural positive";
        Msgs["MustNatNotNegative"] = "The value of %p% must be a natural non-negative";
        Msgs["MustBeANumber"] = "The value of %p% must be a number";
        Msgs["MustBeANumberOrExpr"] = "The value of %p% must be a number or an expression";
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
            msg = msg.replace(/%(\w+)%/g, function (all, p) { return params[p].toString(); });
        }
        return msg;
    }
    ABeamer.i8nMsg = i8nMsg;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=i18n.js.map