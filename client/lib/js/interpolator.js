"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * This module isolates all the property interpolations,
 * allowing to break down the complexity and perform unit tests.
 */
var ABeamer;
(function (ABeamer) {
    /** Var used only for internal testing via exact framework  */
    ABeamer._TEST_DIGIT_LIMIT = 1000;
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    function _bypassModeToBool(isFirst, isLast, mode) {
        switch (mode || ABeamer.BP_FIRST_INSIDE) {
            case ABeamer.BP_FIRST_INSIDE: return !isLast;
            case ABeamer.BP_ALL: return true;
            case ABeamer.BP_INSIDE: return !isLast && !isFirst;
        }
    }
    // ------------------------------------------------------------------------
    //                               Property Types
    // ------------------------------------------------------------------------
    ABeamer.PT_BOOLEAN = 0;
    ABeamer.PT_NUMBER = 1;
    ABeamer.PT_PIXEL = 2;
    ABeamer.PT_STR = 3;
    ABeamer.PT_VALUE_TEXT_LIST = 4;
    ABeamer.PT_VALUE_TEXT_FUNC = 5;
    ABeamer.PT_VALUE_TEXT_EXPR = 6;
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
    function _parseParseValueHandler(value, curValue, args) {
        value = _parseStartValueHandler(value, args);
        if (typeof value === 'string') {
            if (value[0] === '+') {
                return curValue + parseFloat(value.substr(1));
            }
            else if (value[0] === '-') {
                return curValue - parseFloat(value.substr(1));
            }
            else {
                const resValue = parseFloat(value);
                if (isNaN(resValue)) {
                    ABeamer.throwI8n(ABeamer.Msgs.ValueTypeError, { p: value });
                }
                return value;
            }
        }
        else {
            return value;
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
    function _parseStartValueHandler(value, args) {
        return ABeamer.parseHandler(value, undefined, undefined, args);
    }
    // ------------------------------------------------------------------------
    //                               PropInterpolator
    // ------------------------------------------------------------------------
    class _PropInterpolator extends ABeamer._WorkAnimationProp {
        attachSelector(elementAdpt, elActRg, _isVerbose, args) {
            const self = this;
            const realPropName = this.realPropName;
            const actRg = elActRg.actionRg;
            function getStartValue() {
                // user valueStart has priority
                const valueStart = self.animProp.valueStart;
                if (valueStart !== undefined) {
                    return _parseStartValueHandler(valueStart, args);
                }
                // then comes linking with previous actRg
                if (elActRg.linkIndex !== -1) {
                    return elActRg.actionRgList[elActRg.linkIndex].endValue;
                }
                else {
                    return elementAdpt.getProp(realPropName, args);
                }
            }
            let startValue = getStartValue();
            if (startValue === 'auto') {
                startValue = '';
            }
            const strStartValue = startValue;
            let numStartValue = 0;
            let propType = ABeamer.PT_NUMBER;
            // computes PROP_TYPE based on startValue
            const valueText = this.animProp.valueText;
            if (valueText) {
                switch (typeof valueText) {
                    case 'string':
                        if (!ABeamer.isExpr(valueText)) {
                            ABeamer.throwErr('Invalid valueText');
                        }
                        propType = ABeamer.PT_VALUE_TEXT_EXPR;
                        break;
                    case 'function':
                        propType = ABeamer.PT_VALUE_TEXT_FUNC;
                        break;
                    case 'object':
                        propType = ABeamer.PT_VALUE_TEXT_LIST;
                        if (!valueText.length) {
                            ABeamer.throwErr('Invalid valueText');
                        }
                        break;
                    default:
                        ABeamer.throwErr('Invalid valueText');
                }
                numStartValue = ABeamer.isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
            }
            else {
                switch (typeof startValue) {
                    case 'undefined':
                        break;
                    case 'boolean':
                        propType = ABeamer.PT_BOOLEAN;
                        numStartValue = startValue === true ? 1 : 0;
                        break;
                    case 'number':
                        numStartValue = startValue;
                        // if this property was animated previously and is pixel,
                        // the start value will be numerical not `%dpx`.
                        if (actRg.propType === ABeamer.PT_PIXEL) {
                            propType = ABeamer.PT_PIXEL;
                        }
                        break;
                    case 'string':
                        if (strStartValue === 'true' || strStartValue === 'false') {
                            propType = ABeamer.PT_BOOLEAN;
                            numStartValue = strStartValue === 'true' ? 1 : 0;
                        }
                        else if (strStartValue.search(pxRegExp) === 0) {
                            // string value is a pure value or a  pixel
                            if (strStartValue.endsWith('px')) {
                                propType = ABeamer.PT_PIXEL;
                                numStartValue = parseFloat(strStartValue.substr(0, strStartValue.length - 2));
                            }
                            else {
                                propType = ABeamer.PT_NUMBER;
                                numStartValue = parseFloat(strStartValue);
                            }
                        }
                        else {
                            propType = ABeamer.PT_STR;
                            numStartValue = ABeamer.isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
                        }
                }
            }
            const endValue = this.animProp.value;
            let numEndValue;
            // computes EndValue based on value
            switch (propType) {
                case ABeamer.PT_BOOLEAN:
                    numEndValue = endValue > 0.5 ? 1 : 0;
                    break;
                default:
                    numEndValue = endValue !== undefined ? _parseParseValueHandler(endValue, numStartValue, args) : 1;
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
            ABeamer._vars.v0 = this.numStartValue;
            ABeamer._vars.v1 = this.numEndValue;
            ABeamer._vars.vd = this.variation;
            // processes easing
            const tAfterEasing = this.easing ? this.easing.func(t, this.easing.params, args) : t;
            ABeamer._vars.vot = tAfterEasing;
            // processes oscillator
            const tAfterOscillator = this.oscillator
                ? this.oscillator.func(tAfterEasing, this.oscillator.params, args) : tAfterEasing;
            // #debug-start
            if (isVerbose && this.oscillator) {
                story.logFrmt('oscillator', [
                    ['selector', typeof this.oscillator.handler === 'string'
                            ? this.oscillator.handler : ''],
                    ['input', tAfterEasing],
                    ['output', tAfterOscillator],
                ]);
            }
            // #debug-end
            // processes `variation` and `startValue`
            let v = tAfterOscillator * this.variation + this.numStartValue;
            this.curNumValue = v;
            // processes `path`
            let values;
            let dimCount = 1;
            if (this.path) {
                ABeamer._vars.vpt = v;
                values = this.path.func(v, this.path.params, ABeamer.FS_RUN, args);
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
            let value = v;
            const valueFormat = this.animProp.valueFormat;
            const propType = this.propType;
            if (dimCount === 1) {
                value = this.roundFunc ? this.roundFunc(value) : value;
                switch (propType) {
                    case ABeamer.PT_BOOLEAN:
                        value = value > 0.5 ? 1 : 0;
                        break;
                    case ABeamer.PT_PIXEL:
                        value = (this.roundFunc ? v : Math.round(v)).toString() + 'px';
                        break;
                    case ABeamer.PT_VALUE_TEXT_EXPR:
                        ABeamer._vars.t = value;
                        value = ABeamer.calcExpr(this.animProp.valueText, args).toString();
                        break;
                    case ABeamer.PT_VALUE_TEXT_LIST:
                        const list = this.animProp.valueText;
                        const len = list.length;
                        const listIndex = Math.floor(len * Math.min(Math.max(0, value), 0.999));
                        value = list[listIndex];
                        break;
                    case ABeamer.PT_VALUE_TEXT_FUNC:
                        value = this.roundFunc ? this.roundFunc(value) : value;
                        value = this.animProp.valueText(v, args);
                        break;
                }
                // #debug-start
                if (isVerbose && typeof value === 'number') {
                    value = Math.round(value * ABeamer._TEST_DIGIT_LIMIT) / ABeamer._TEST_DIGIT_LIMIT;
                }
                // #debug-end
                value = valueFormat ? ABeamer.sprintf(valueFormat, value) : value;
            }
            else {
                // multi-dimension paths
                values = ABeamer._applyRoundFunc(values, this.roundFunc);
                value = valueFormat ? ABeamer.sprintf(valueFormat, ...values) : values.toString();
            }
            // console.log(t, v, this.variation, value);
            return value;
        }
        toAction(v, isFirst, isLast) {
            return {
                realPropName: this.realPropName,
                value: v,
                actRg: this.actRg,
                numValue: this.curNumValue,
                toBypassForward: _bypassModeToBool(isFirst, isLast, this.bypassForwardMode),
                toBypassBackward: _bypassModeToBool(isLast, isFirst, this.bypassBackwardMode),
            };
        }
    }
    ABeamer._PropInterpolator = _PropInterpolator;
    function _applyAction(action, elAdapter, isVerbose, args, simulateOnly = false) {
        const actRg = action.actRg;
        const value = action.value;
        const propName = action.realPropName;
        // #debug-start
        function log(name, aValue) {
            args.story.logFrmt('action', [
                ['id', elAdapter.getId(args)],
                ['prop', name],
                ['value', aValue],
            ]);
        }
        // #debug-end
        function setValue(newValue) {
            if (simulateOnly) {
                return;
            }
            // let prevValue: PropValue;
            // // #debug-start
            // if (isVerbose) { prevValue = elAdapter.getProp(propName, args); }
            // // #debug-end
            elAdapter.setProp(propName, newValue, args);
            // #debug-start
            if (isVerbose) {
                const actualNewValue = elAdapter.getProp(propName, args);
                let isDifferent = newValue !== actualNewValue;
                if (isDifferent) {
                    // compares numerical values taking into account the numeric precision errors
                    if (isDifferent && actRg.propType === ABeamer.PT_NUMBER) {
                        const actualFloat = Math.round(parseFloat(actualNewValue) * ABeamer._TEST_DIGIT_LIMIT);
                        const newFloat = Math.round(newValue * ABeamer._TEST_DIGIT_LIMIT);
                        isDifferent = newFloat !== actualFloat;
                    }
                }
                if (isDifferent) {
                    args.story.logFrmt('action-update-warn', [
                        ['id', elAdapter.getId(args)],
                        ['prop', propName],
                        ['expected', newValue + ''],
                        ['actual', actualNewValue + ''],
                    ], ABeamer.LT_WARN);
                }
                log(propName, newValue);
            }
            // #debug-end
        }
        setValue(value);
        if (actRg.waitFor && actRg.waitFor.length) {
            for (const waitFor of actRg.waitFor) {
                args.waitMan.addWaitFunc(ABeamer._handleWaitFor, { waitFor, elAdapter });
            }
        }
        return action.numValue;
    }
    ABeamer._applyAction = _applyAction;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=interpolator.js.map