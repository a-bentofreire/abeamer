"use strict";
// uuid: 9beb242e-6cc6-4be9-8728-7bd56787152d

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module internal | This module is to be read only by developers */

/**
 * ## Description
 *
 * This module isolates all the property interpolations,
 * allowing to break down the complexity and perform unit tests.
 */
namespace ABeamer {

  const VALUE_MACRO = '__VALUE__';
  /** Var used only for internal testing via exact framework  */
  export let _TEST_DIGIT_LIMIT: int = 1000;

  // ------------------------------------------------------------------------
  //                               Tools
  // ------------------------------------------------------------------------

  function _bypassModeToBool(isFirst: boolean, isLast: boolean,
    mode: BypassMode) {

    switch (mode || BP_FIRST_INSIDE) {
      case BP_FIRST_INSIDE: return !isLast;
      case BP_ALL: return true;
      case BP_INSIDE: return !isLast && !isFirst;
    }
  }

  // ------------------------------------------------------------------------
  //                               Property Types
  // ------------------------------------------------------------------------

  export const PT_BOOLEAN = 0;
  export const PT_NUMBER = 1;
  export const PT_PIXEL = 2;
  export const PT_STR = 3;
  export const PT_VALUE_TEXT_LIST = 4;
  export const PT_VALUE_TEXT_FUNC = 5;
  export const PT_VALUE_TEXT_EXPR = 6;

  /** Pre-compiled RegEx to determine if the string is a pixel. */
  const pxRegExp = /^-?[\d\.]+(?:px)?$/;

  // ------------------------------------------------------------------------
  //                               _parseRelativeValue
  // ------------------------------------------------------------------------

  /**
   * Parses user defined `value`.
   * The `value` is similar to the `startValue` except also
   * supports relative values to the `startValue`.
   */
  function _parseParseValueHandler(
    value: PropValueHandler,
    curValue: number, args: ABeamerArgs): AnimPropValue {

    value = _parseStartValueHandler(value, args);
    if (typeof value === 'string') {
      if (value[0] === '+') {
        return curValue + parseFloat(value.substr(1));
      } else if (value[0] === '-') {
        return curValue - parseFloat(value.substr(1));
      } else { return parseFloat(value); }
    } else {
      return value as AnimPropValue;
    }
  }

  // ------------------------------------------------------------------------
  //                               _parseStartPropValue
  // ------------------------------------------------------------------------

  /**
   * Parses user defined `value` and `startValue`.
   * If it's a expression, it computes this expression,
   * and if it's a function it computes the function.
   */
  function _parseStartValueHandler(value: PropValueStartHandler,
    args: ABeamerArgs): PropValueHandler {

    return parseHandler<PropValueStartHandler, PropValueHandler>(value,
      undefined, undefined, args);
  }

  // ------------------------------------------------------------------------
  //                               PropInterpolator
  // ------------------------------------------------------------------------

  export class _PropInterpolator extends _WorkAnimationProp {

    protected numStartValue?: ActionNumValue;
    protected numEndValue?: ActionNumValue;
    protected curNumValue?: number;
    protected curStrValue?: string;


    attachSelector(elementAdpt: _ElementAdapter,
      actRg: _ElActionRg,
      isVerbose: boolean,
      args: ABeamerArgs): void {

      const self = this;
      const realPropName = this.realPropName;

      function getStartValue(): PropValue {

        // user valueStart has priority
        const valueStart = self.animProp.valueStart;
        if (valueStart !== undefined) {
          return _parseStartValueHandler(valueStart, args) as ActionValue;
        }
        // then comes linking with previous actRg
        if (actRg.linkIndex !== -1) {
          return actRg.actionRgList[actRg.linkIndex].endValue;
        } else {
          return elementAdpt.getProp(realPropName);
        }
      }

      const startValue = getStartValue();

      const strStartValue = startValue as string;
      let numStartValue = 0;
      let propType = PT_NUMBER;

      // computes PROP_TYPE based on startValue

      const valueText = this.animProp.valueText;
      if (valueText) {

        switch (typeof valueText) {
          case 'string':
            if (!isExpr(valueText as string)) {
              throwErr('Invalid valueText');
            }
            propType = PT_VALUE_TEXT_EXPR;
            break;
          case 'function':
            propType = PT_VALUE_TEXT_FUNC;
            break;
          case 'object':
            propType = PT_VALUE_TEXT_LIST;
            if (!valueText.length) {
              throwErr('Invalid valueText');
            }
            break;
          default:
            throwErr('Invalid valueText');
        }
        numStartValue = isDigit(strStartValue) ? parseFloat(strStartValue) : 0;

      } else {

        switch (typeof startValue) {
          case 'undefined':
            break;

          case 'boolean':
            propType = PT_BOOLEAN;
            numStartValue = startValue === true ? 1 : 0;
            break;

          case 'number':
            numStartValue = startValue as number;
            break;

          case 'string':
            if (strStartValue === 'true' || strStartValue === 'false') {
              propType = PT_BOOLEAN;
              numStartValue = strStartValue === 'true' ? 1 : 0;

            } else if (strStartValue.search(pxRegExp) === 0) {
              // string value is a pure value or a  pixel
              if (strStartValue.endsWith('px')) {
                propType = PT_PIXEL;
                numStartValue = parseFloat(strStartValue.substr(0, strStartValue.length - 2));
              } else {
                propType = PT_NUMBER;
                numStartValue = parseFloat(strStartValue);
              }
            } else {
              propType = PT_STR;
              numStartValue = isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
            }
        }
      }

      const endValue = this.animProp.value;
      let numEndValue: number;

      // computes EndValue based on value
      switch (propType) {
        case PT_BOOLEAN:
          numEndValue = endValue as int > 0.5 ? 1 : 0;
          break;
        default:
          numEndValue = endValue !== undefined ? _parseParseValueHandler(endValue,
            numStartValue, args) as number : 1;
      }

      this.propType = propType;
      this.numStartValue = numStartValue;
      this.numEndValue = numEndValue;
      this.variation = this.numEndValue - this.numStartValue;
      actRg.actionRg.initialValue = numStartValue;
    }


    interpolate(t: int, story: _StoryImpl, isVerbose: boolean): ActionValue {

      const args = story._args;

      _vars.v0 = this.numStartValue;
      _vars.v1 = this.numEndValue;
      _vars.vd = this.variation;

      // processes easing
      const tAfterEasing: ActionValue = this.easing ? this.easing.func(t, this.easing.params, args) : t;

      _vars.vot = tAfterEasing;
      // processes oscillator
      const tAfterOscillator: ActionValue = this.oscillator
        ? this.oscillator.func(tAfterEasing, this.oscillator.params, args) : tAfterEasing;

      // #debug-start
      if (isVerbose && this.oscillator) {

        story.logFrmt('oscillator', [
          ['selector', typeof this.oscillator.handler === 'string'
            ? this.oscillator.handler : ''],
          ['input', tAfterEasing],
          ['output', tAfterOscillator as number],
        ]);
      }
      // #debug-end

      // process variation and startValue
      let v = tAfterOscillator * this.variation + this.numStartValue;
      this.curNumValue = v;

      // process path
      let values: number[];
      let dimCount = 1;

      if (this.path) {
        _vars.vpt = v;
        values = this.path.func(v, this.path.params, FS_RUN, args);
        dimCount = values.length;

        // #debug-start
        if (isVerbose) {
          story.logFrmt('path', [
            ['selector', typeof this.path.handler === 'string'
              ? this.path.handler : ''],
            ['input', v],
            ['output', values.toString()],
          ]);
        }
        // #debug-end

        if (dimCount === 1) {
          v = values[0];
        }
      }

      const inProp = this.animProp;

      let value: string | number = v;
      const valueFormat = this.animProp.valueFormat;
      const propType = this.propType;

      if (dimCount === 1) {

        value = this.roundFunc ? this.roundFunc(value) : value;

        switch (propType) {
          case PT_BOOLEAN:
            value = value > 0.5 ? 1 : 0;
            break;

          case PT_PIXEL:
            value = (this.roundFunc ? v : Math.round(v)).toString() + 'px';
            break;

          case PT_VALUE_TEXT_EXPR:
            _vars.t = value;
            value = calcExpr(this.animProp.valueText as string,
              args).toString();
            break;

          case PT_VALUE_TEXT_LIST:
            const list = this.animProp.valueText as string[];
            const len = list.length;
            const listIndex = Math.floor(len * Math.min(Math.max(0, value), 0.999));
            value = list[listIndex];
            break;

          case PT_VALUE_TEXT_FUNC:
            value = this.roundFunc ? this.roundFunc(value) : value;
            value = (this.animProp.valueText as ValueTextFunc)(v, args);
            break;
        }
        value = valueFormat ? sprintf(valueFormat, value) : value;

      } else {

        // multi-dimension paths
        values = _applyRoundFunc(values, this.roundFunc);
        value = valueFormat ? sprintf(valueFormat, ...values) : values.toString();
      }

      // console.log(t, v, this.variation, value);
      return value;
    }


    toAction(v: ActionValue, isFirst: boolean, isLast: boolean): _Action {
      return {
        realPropName: this.realPropName,
        propType: this.propType,
        value: v,
        waitFor: this.waitFor,
        numValue: this.curNumValue,
        toBypassForward: _bypassModeToBool(isFirst,
          isLast, this.bypassForwardMode),
        toBypassBackward: _bypassModeToBool(isLast,
          isFirst, this.bypassBackwardMode),
      } as _Action;
    }
  }


  export function _applyAction(action: _Action,
    elementAdpt: _ElementAdapter,
    isVerbose: boolean,
    story: _StoryImpl,
    simulateOnly: boolean = false): ActionNumValue {

    const value = action.value;
    const propName = action.realPropName;

    // #debug-start
    function log(name, aValue) {
      story.logFrmt('action', [
        ['id', elementAdpt.getId()],
        ['prop', name],
        ['value', aValue],
      ]);
    }
    // #debug-end

    function setValue(newValue: PropValue): void {

      if (simulateOnly) { return; }

      let prevValue: PropValue;

      // #debug-start
      if (isVerbose) { prevValue = elementAdpt.getProp(propName); }
      // #debug-end

      elementAdpt.setProp(propName, newValue);

      // #debug-start
      if (isVerbose) {
        const actualNewValue = elementAdpt.getProp(propName);
        let isDifferent = newValue !== actualNewValue;

        if (isDifferent) {

          // compares numerical values taking into account the numeric precision errors
          if (isDifferent && action.propType === PT_NUMBER) {
            const actualFloat = Math.round(parseFloat(actualNewValue as string) * _TEST_DIGIT_LIMIT);
            const newFloat = Math.round((newValue as number) * _TEST_DIGIT_LIMIT);
            isDifferent = newFloat !== actualFloat;
          }
        }

        if (isDifferent) {
          story.logFrmt(`action-update-warn: `,
            [['id', elementAdpt.getId()]
              , ['prop', propName]
              , ['expected', newValue + '']
              , ['actual', actualNewValue + ''],
            ], LT_WARN);
        }
        log(propName, newValue);
      }
      // #debug-end
    }

    setValue(value);
    return action.numValue;
  }
}
