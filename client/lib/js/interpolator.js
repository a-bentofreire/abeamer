"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2._TEST_DIGIT_LIMIT = 1e3;
  function _bypassModeToBool(isFirst, isLast, mode) {
    switch (mode || BP_FIRST_INSIDE) {
      case BP_FIRST_INSIDE:
        return !isLast;
      case BP_ALL:
        return true;
      case BP_INSIDE:
        return !isLast && !isFirst;
    }
  }
  ABeamer2.PT_BOOLEAN = 0;
  ABeamer2.PT_NUMBER = 1;
  ABeamer2.PT_PIXEL = 2;
  ABeamer2.PT_STR = 3;
  ABeamer2.PT_VALUE_TEXT_LIST = 4;
  ABeamer2.PT_VALUE_TEXT_FUNC = 5;
  ABeamer2.PT_VALUE_TEXT_EXPR = 6;
  const pxRegExp = /^-?[\d\.]+(?:px)?$/;
  function _parseParseValueHandler(value, curValue, args) {
    value = _parseStartValueHandler(value, args);
    if (typeof value === "string") {
      if (value[0] === "+") {
        return curValue + parseFloat(value.substr(1));
      } else if (value[0] === "-") {
        return curValue - parseFloat(value.substr(1));
      } else {
        const resValue = parseFloat(value);
        if (isNaN(resValue)) {
          throwI8n(Msgs.ValueTypeError, { p: value });
        }
        return value;
      }
    } else {
      return value;
    }
  }
  function _parseStartValueHandler(value, args) {
    return parseHandler(
      value,
      void 0,
      void 0,
      args
    );
  }
  class _PropInterpolator extends _WorkAnimationProp {
    attachSelector(elementAdpt, elActRg, _isVerbose, args) {
      const self = this;
      const realPropName = this.realPropName;
      const actRg = elActRg.actionRg;
      function getStartValue() {
        const valueStart = self.animProp.valueStart;
        if (valueStart !== void 0) {
          return _parseStartValueHandler(valueStart, args);
        }
        if (elActRg.linkIndex !== -1) {
          return elActRg.actionRgList[elActRg.linkIndex].endValue;
        } else {
          return elementAdpt.getProp(realPropName, args);
        }
      }
      let startValue = getStartValue();
      if (startValue === "auto") {
        startValue = "";
      }
      const strStartValue = startValue;
      let numStartValue = 0;
      let propType = ABeamer2.PT_NUMBER;
      const valueText = this.animProp.valueText;
      if (valueText) {
        switch (typeof valueText) {
          case "string":
            if (!isExpr(valueText)) {
              throwErr("Invalid valueText");
            }
            propType = ABeamer2.PT_VALUE_TEXT_EXPR;
            break;
          case "function":
            propType = ABeamer2.PT_VALUE_TEXT_FUNC;
            break;
          case "object":
            propType = ABeamer2.PT_VALUE_TEXT_LIST;
            if (!valueText.length) {
              throwErr("Invalid valueText");
            }
            break;
          default:
            throwErr("Invalid valueText");
        }
        numStartValue = isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
      } else {
        switch (typeof startValue) {
          case "undefined":
            break;
          case "boolean":
            propType = ABeamer2.PT_BOOLEAN;
            numStartValue = startValue === true ? 1 : 0;
            break;
          case "number":
            numStartValue = startValue;
            if (actRg.propType === ABeamer2.PT_PIXEL) {
              propType = ABeamer2.PT_PIXEL;
            }
            break;
          case "string":
            if (strStartValue === "true" || strStartValue === "false") {
              propType = ABeamer2.PT_BOOLEAN;
              numStartValue = strStartValue === "true" ? 1 : 0;
            } else if (strStartValue.search(pxRegExp) === 0) {
              if (strStartValue.endsWith("px")) {
                propType = ABeamer2.PT_PIXEL;
                numStartValue = parseFloat(strStartValue.substr(0, strStartValue.length - 2));
              } else {
                propType = ABeamer2.PT_NUMBER;
                numStartValue = parseFloat(strStartValue);
              }
            } else {
              propType = ABeamer2.PT_STR;
              numStartValue = isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
            }
        }
      }
      const endValue = this.animProp.value;
      let numEndValue;
      switch (propType) {
        case ABeamer2.PT_BOOLEAN:
          numEndValue = endValue > 0.5 ? 1 : 0;
          break;
        default:
          numEndValue = endValue !== void 0 ? _parseParseValueHandler(
            endValue,
            numStartValue,
            args
          ) : 1;
      }
      this.propType = propType;
      this.numStartValue = numStartValue;
      this.numEndValue = numEndValue;
      this.variation = this.numEndValue - this.numStartValue;
      this.actRg = actRg;
      actRg.initialValue = numStartValue;
      actRg.waitFor = this.waitFor;
      actRg.propType = this.propType;
    }
    interpolate(t, story, isVerbose) {
      const args = story._args;
      _vars.v0 = this.numStartValue;
      _vars.v1 = this.numEndValue;
      _vars.vd = this.variation;
      const tAfterEasing = this.easing ? this.easing.func(t, this.easing.params, args) : t;
      _vars.vot = tAfterEasing;
      const tAfterOscillator = this.oscillator ? this.oscillator.func(tAfterEasing, this.oscillator.params, args) : tAfterEasing;
      if (isVerbose && this.oscillator) {
        story.logFrmt("oscillator", [
          ["selector", typeof this.oscillator.handler === "string" ? this.oscillator.handler : ""],
          ["input", tAfterEasing],
          ["output", tAfterOscillator]
        ]);
      }
      let v = tAfterOscillator * this.variation + this.numStartValue;
      this.curNumValue = v;
      let values;
      let dimCount = 1;
      if (this.path) {
        _vars.vpt = v;
        values = this.path.func(v, this.path.params, FS_RUN, args);
        dimCount = values.length;
        if (isVerbose) {
          story.logFrmt("path", [
            ["selector", typeof this.path.handler === "string" ? this.path.handler : ""],
            ["input", v],
            ["output", values.toString()]
          ]);
        }
        if (dimCount === 1) {
          v = values[0];
        }
      }
      let value = v;
      const valueFormat = this.animProp.valueFormat;
      const propType = this.propType;
      if (dimCount === 1) {
        value = this.roundFunc ? this.roundFunc(value) : value;
        switch (propType) {
          case ABeamer2.PT_BOOLEAN:
            value = value > 0.5 ? 1 : 0;
            break;
          case ABeamer2.PT_PIXEL:
            value = (this.roundFunc ? v : Math.round(v)).toString() + "px";
            break;
          case ABeamer2.PT_VALUE_TEXT_EXPR:
            _vars.t = value;
            value = calcExpr(
              this.animProp.valueText,
              args
            ).toString();
            break;
          case ABeamer2.PT_VALUE_TEXT_LIST:
            const list = this.animProp.valueText;
            const len = list.length;
            const listIndex = Math.floor(len * Math.min(Math.max(0, value), 0.999));
            value = list[listIndex];
            break;
          case ABeamer2.PT_VALUE_TEXT_FUNC:
            value = this.roundFunc ? this.roundFunc(value) : value;
            value = this.animProp.valueText(v, args);
            break;
        }
        if (isVerbose && typeof value === "number") {
          value = Math.round(value * ABeamer2._TEST_DIGIT_LIMIT) / ABeamer2._TEST_DIGIT_LIMIT;
        }
        value = valueFormat ? sprintf(valueFormat, value) : value;
      } else {
        values = _applyRoundFunc(values, this.roundFunc);
        value = valueFormat ? sprintf(valueFormat, ...values) : values.toString();
      }
      return value;
    }
    toAction(v, isFirst, isLast) {
      return {
        realPropName: this.realPropName,
        value: v,
        actRg: this.actRg,
        numValue: this.curNumValue,
        toBypassForward: _bypassModeToBool(
          isFirst,
          isLast,
          this.bypassForwardMode
        ),
        toBypassBackward: _bypassModeToBool(
          isLast,
          isFirst,
          this.bypassBackwardMode
        )
      };
    }
  }
  ABeamer2._PropInterpolator = _PropInterpolator;
  function _applyAction(action, elAdapter, isVerbose, args, simulateOnly = false) {
    const actRg = action.actRg;
    const value = action.value;
    const propName = action.realPropName;
    function log(name, aValue) {
      args.story.logFrmt("action", [
        ["id", elAdapter.getId(args)],
        ["prop", name],
        ["value", aValue]
      ]);
    }
    function setValue(newValue) {
      if (simulateOnly) {
        return;
      }
      elAdapter.setProp(propName, newValue, args);
      if (isVerbose) {
        const actualNewValue = elAdapter.getProp(propName, args);
        let isDifferent = newValue !== actualNewValue;
        if (isDifferent) {
          if (isDifferent && actRg.propType === ABeamer2.PT_NUMBER) {
            const actualFloat = Math.round(parseFloat(actualNewValue) * ABeamer2._TEST_DIGIT_LIMIT);
            const newFloat = Math.round(newValue * ABeamer2._TEST_DIGIT_LIMIT);
            isDifferent = newFloat !== actualFloat;
          }
        }
        if (isDifferent) {
          args.story.logFrmt("action-update-warn", [
            ["id", elAdapter.getId(args)],
            ["prop", propName],
            ["expected", newValue + ""],
            ["actual", actualNewValue + ""]
          ], LT_WARN);
        }
        log(propName, newValue);
      }
    }
    setValue(value);
    if (actRg.waitFor && actRg.waitFor.length) {
      for (const waitFor of actRg.waitFor) {
        args.waitMan.addWaitFunc(
          _handleWaitFor,
          { waitFor, elAdapter }
        );
      }
    }
    return action.numValue;
  }
  ABeamer2._applyAction = _applyAction;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=interpolator.js.map
