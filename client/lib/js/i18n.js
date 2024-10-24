"use strict";
var ABeamer;
((ABeamer2) => {
  let Msgs;
  ((Msgs2) => {
    Msgs2["MustNatPositive"] = "The value of %p% must be a natural positive";
    Msgs2["MustNatNotNegative"] = "The value of %p% must be a natural non-negative";
    Msgs2["MustBeANumber"] = "The value of %p% must be a number";
    Msgs2["MustBeAString"] = "The value of %p% must be textual";
    Msgs2["MustBeANumberOrExpr"] = "The value of %p% must be a number or an expression";
    Msgs2["MustBeAStringOrExpr"] = "The value of %p% must be textual or an expression";
    Msgs2["Unknown"] = "Unknown %p%";
    Msgs2["UnknownOf"] = 'Unknown "%type%" %p%';
    Msgs2["UnknownType"] = "Unknown type of %p%";
    Msgs2["NoEmptyField"] = "Field %p% can not be empty";
    Msgs2["NoEmptySelector"] = "Selector %p% can not be empty";
    Msgs2["NoCode"] = "Code Handler is not allowed";
    Msgs2["OutOfScope"] = "%p% out of scope";
    Msgs2["ExpHasErrors"] = "Expression %e% has errors: %err%";
    Msgs2["WrongNrParams"] = "Function %p% has the wrong number of input parameters";
    Msgs2["WrongParamType"] = "Function %p% has the wrong type in parameter: %i%";
    Msgs2["ValueTypeError"] = "Value %p% must be a number or an expression";
    Msgs2["UnaryErr"] = "Unary operators only support numerical values";
    Msgs2["flyover"] = "flyover";
    Msgs2["task"] = "task";
    Msgs2["pos"] = "position";
    Msgs2["startScene"] = "startScene";
    Msgs2["endScene"] = "endScene";
  })(Msgs = ABeamer2.Msgs || (ABeamer2.Msgs = {}));
  function i8nMsg(msg, params) {
    if (params) {
      msg = msg.replace(/%(\w+)%/g, (_all, p) => params[p].toString());
    }
    return msg;
  }
  ABeamer2.i8nMsg = i8nMsg;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=i18n.js.map
