"use strict";
// uuid: e8f361d2-c6fe-4649-9fde-fe6f24fa043a
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **expression** is a textual value that starts with `=`.
 * Expressions unlike Code Handlers can be defined on the `.json`
 * config file and support teleporting.
 *
 * ABeamer supports:
 *
 * - binary operators: `+`, `-`, `*`, `/`, `%` (modulus).
 *
 * - equality and comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`.
 *      These operators transform the 2 numerical values into 0 (false) or 1 (true).
 *
 * - parenthesis: `(`, `)`.
 * - functions: @see functions
 * - textual values: delimited by single quotes.
 *     the following character strings have a special meaning:
 *       - `\'` - defines a single quote
 *       - `\n' - defines new line
 * - numerical values.
 * - variables.
 *
 * ## Built-in Variables
 *
 * ABeamer has the following built-in variables:
 *
 * `e` - mathematical constant 'e'.
 * `pi` - mathematical constant 'pi'.
 * `deg2rad` - `=pi/180`.
 * `rad2deg` - `=180/pi`.
 *
 * `fps` - frames per second.
 * `frameWidth` - frame output width = generated file image width.
 * `frameHeight` - frame output height = generated file image height.
 *
 *  `isTeleporting` - Is True, if it's teleporting.
 *
 *  `v0` - Computed Numerical `valueStart`.
 *  `v1` - Computed Numerical `value`.
 *  `vd` - Computed Numerical difference `value` - `valueStart`.
 *  `vt` - Computed Numerical value injected to the easing function.
 *  `vot` - Computed Numerical value injected to the oscillator function.
 *  `vpt` - Computed Numerical value injected to the path function.
 *  `t` - `t` used to interpolate an easing, oscillator or path via expression.
 * ## Examples
 *
 * `= 'A' + 'Beamer'`
 * `= round(12.4 + ceil(50.5) / 2 * (60 % 4))`
 * `= cos(60*deg2rad) * random()`
 * `= iff(fps < 20, 'too few frames', 'lots of frames')`
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Expressions
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    /** Initializes the default global expression variables */
    ABeamer._vars = {
        e: Math.E,
        pi: Math.PI,
        deg2rad: Math.PI / 180,
        rad2deg: 180 / Math.PI,
    };
    /**
     * Defines the code range for characters.
     * By default only includes the latin alphabet
     * but if functions are mapped into another characters systems,
     * it must add to this list the extra character code ranges.
     *
     */
    ABeamer.CharRanges = [
        ['A'.charCodeAt(0), 'Z'.charCodeAt(0)],
        ['a'.charCodeAt(0), 'z'.charCodeAt(0)],
    ];
    /**
     * Utility function to test if `ch` is a character.
     * It might include non-latin characters. It depends on `CharRanges`.
     * Used by developers and plugin creators.
     *
     */
    function isCharacter(ch) {
        var codePoint = ch.codePointAt(0);
        return ABeamer.CharRanges.findIndex(function (rg) { return codePoint >= rg[0] && codePoint <= rg[1]; }) !== -1;
    }
    ABeamer.isCharacter = isCharacter;
    /**
     * Utility function to test if it's a digit.
     * Used by developers and plugin creators.
     *
     */
    function isDigit(ch) {
        return ch >= '0' && ch <= '9';
    }
    ABeamer.isDigit = isDigit;
    /**
     * Utility function to test if it's a digit or character.
     * It might include non-latin characters. It depends on `CharRanges`.
     * Used by developers and plugin creators.
     *
     */
    function isCharacterOrNum(ch) {
        return isDigit(ch) || isCharacter(ch);
    }
    ABeamer.isCharacterOrNum = isCharacterOrNum;
    /**
     * Tests if `text` is an expression.
     * Used by developers and plugin creators.
     */
    function isExpr(text) {
        return text !== undefined && text[0] === '=';
    }
    ABeamer.isExpr = isExpr;
    var TokenType2Str;
    (function (TokenType2Str) {
        TokenType2Str[TokenType2Str["("] = 3] = "(";
        TokenType2Str[TokenType2Str[")"] = 4] = ")";
        TokenType2Str[TokenType2Str["+"] = 6] = "+";
        TokenType2Str[TokenType2Str["-"] = 7] = "-";
        TokenType2Str[TokenType2Str["*"] = 8] = "*";
        TokenType2Str[TokenType2Str["/"] = 9] = "/";
        TokenType2Str[TokenType2Str["%"] = 10] = "%";
        TokenType2Str[TokenType2Str[","] = 2] = ",";
        TokenType2Str[TokenType2Str["=="] = 11] = "==";
        TokenType2Str[TokenType2Str["!="] = 12] = "!=";
        TokenType2Str[TokenType2Str["<"] = 13] = "<";
        TokenType2Str[TokenType2Str[">"] = 14] = ">";
        TokenType2Str[TokenType2Str["<="] = 15] = "<=";
        TokenType2Str[TokenType2Str[">="] = 16] = ">=";
    })(TokenType2Str || (TokenType2Str = {}));
    var opPriority = [
        0,
        19,
        19,
        20,
        20,
        1,
        13,
        13,
        14,
        14,
        14,
        10,
        10,
        11,
        11,
        11,
        11,
    ];
    var Type2Class = [
        0 /* None */,
        1 /* Function */,
        7 /* Comma */,
        3 /* ParamOpen */,
        4 /* ParamClose */,
        2 /* Value */,
        5 /* Unary */,
        5 /* Unary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
        6 /* Binary */,
    ];
    function parser(p, checkSign) {
        var startPos;
        function setToken(aType) {
            p.token.sValue = expr.substring(startPos, pos);
            p.token.tkType = aType;
            p.token.tkClass = Type2Class[aType];
        }
        var expr = p.expr;
        var pos = p.pos;
        p.token.tkClass = 0 /* None */;
        do {
            var ch = expr[pos];
            while (ch === ' ') {
                ch = expr[++pos];
            }
            startPos = pos;
            if (ch === undefined) {
                break;
            }
            // vars & functions
            if (isCharacter(ch)) {
                do {
                    var nextCh = expr[++pos];
                    if (!nextCh || !isCharacterOrNum(nextCh)) {
                        break;
                    }
                } while (true);
                if (expr[pos] === '(') {
                    setToken(1 /* Function */);
                    pos++;
                }
                else {
                    setToken(5 /* Value */);
                    var varName = p.token.sValue;
                    var varValue = p.args.vars[varName];
                    var varTypeOf = typeof varValue;
                    if (varValue === undefined) {
                        err(p, "Unknown variable " + varName);
                    }
                    if (varTypeOf === 'string') {
                        p.token.paType = 2 /* String */;
                        p.token.sValue = varValue;
                    }
                    else if (varTypeOf === 'number') {
                        p.token.paType = 1 /* Number */;
                        p.token.numValue = varValue;
                        p.token.sValue = undefined;
                    }
                    else if (varTypeOf === 'boolean') {
                        p.token.paType = 1 /* Number */;
                        p.token.numValue = varValue ? 1 : 0;
                        p.token.sValue = undefined;
                    }
                    else {
                        err(p, "Unsupported type of " + varName);
                    }
                }
                break;
            }
            // number sign
            if (checkSign && ((ch === '-' || ch === '+') && isDigit(expr[pos + 1]))) {
                ch = expr[++pos];
            }
            // numbers
            if (isDigit(ch)) {
                do {
                    ch = expr[++pos];
                } while (ch && (isDigit(ch) || ch === '.'));
                setToken(5 /* Value */);
                p.token.paType = 1 /* Number */;
                p.token.numValue = parseFloat(p.token.sValue);
                p.token.sValue = undefined;
                break;
            }
            // strings
            if (ch === "'") {
                var prevCh = void 0;
                do {
                    prevCh = ch;
                    ch = expr[++pos];
                } while ((ch !== "'" || prevCh === '\\') && ch !== undefined);
                startPos++;
                setToken(5 /* Value */);
                p.token.sValue = p.token.sValue.replace(/\\([n'])/g, function (all, meta) {
                    switch (meta) {
                        case 'n': return '\n';
                        case "'": return "'";
                    }
                });
                p.token.paType = 2 /* String */;
                pos++;
                break;
            }
            // equality and comparison
            if ('=!<>'.indexOf(ch) !== -1 && expr[pos + 1] === '=') {
                ch = ch + '=';
                pos++;
            }
            // symbols
            var type = TokenType2Str[ch] || 0 /* None */;
            if (type === 0 /* None */) {
                err(p, "Unknown token " + ch + " in position " + pos, p.token);
            }
            pos++;
            setToken(type);
            break;
        } while (true);
        var tkClass = p.token.tkClass;
        p.pos = pos;
        // @ts-ignore   TypeScript bug :-(
        p.token.canBinOp = tkClass === 5 /* Unary */ || tkClass === 6 /* Binary */;
        return tkClass;
    }
    // ------------------------------------------------------------------------
    //                               Execute Expression Function
    // ------------------------------------------------------------------------
    function _execExprFunction(p, funcToken) {
        var funcName = funcToken.sValue;
        var func = ABeamer._exFunctions[funcName];
        if (!func) {
            err(p, "Unknown function: " + funcName, funcToken);
        }
        var res = {
            canBinOp: false,
            tkClass: 2 /* Value */,
            tkType: 5 /* Value */,
        };
        p.res = res;
        p.token = funcToken;
        func(funcToken.funcParams, p);
        return res;
    }
    // ------------------------------------------------------------------------
    //                               State Machine
    // ------------------------------------------------------------------------
    function _stateMachine(p) {
        var stack = [];
        var state = 0 /* IdAndUnary */;
        var token;
        var op;
        /** stack.length - 1 */
        var stackLast = -1;
        /**  startPoints[startPoints.length-1] */
        var startPoint = 0;
        /** list of indexes to the stack element after for each 'func', '(' and ',' */
        var startPoints = [];
        p.req = p;
        function push() {
            stack.push(token);
            stackLast++;
        }
        function pop() {
            var tk = stack[stackLast];
            stack.length = stackLast;
            stackLast--;
            return tk;
        }
        function calcStackLeft() {
            // startPoint = 0;
            while (stackLast > 1 && stackLast > startPoint + 1) {
                op = stack[startPoint + 1];
                if (!op.canBinOp) {
                    break;
                }
                var t1 = stack[startPoint];
                var t2 = stack[startPoint + 2];
                _calcBinary(p, op, t1, t2);
                stack.splice(startPoint + 1, 2);
                stackLast -= 2;
            }
        }
        function calcStackRight() {
            while (stackLast > 2) {
                op = stack[stackLast - 1];
                if (!op.canBinOp) {
                    break;
                }
                var t1 = stack[stackLast - 2];
                var t2 = stack[stackLast];
                var prevOp = stack[stackLast - 3];
                if (_comparePriority(op, prevOp)) {
                    _calcBinary(p, op, t1, t2);
                    stack.length = stackLast - 1;
                    stackLast -= 2;
                }
                else {
                    break;
                }
            }
        }
        function onCloseParamOrFunc() {
            calcStackLeft();
            if (startPoint !== stackLast) {
                err(p, '', token);
            }
            token = stack.pop();
            stackLast--;
        }
        do {
            p.token = {};
            var thisTkClass = parser(p, state !== 2 /* Binary */);
            token = p.token;
            if (thisTkClass === 0 /* None */) {
                break;
            }
            switch (thisTkClass) {
                case 2 /* Value */:
                    if (state === 2 /* Binary */) {
                        err(p, '', token);
                    }
                    else if (state === 1 /* NoUnary */ && stack[stackLast].tkClass === 5 /* Unary */
                        && (stackLast === 0 || stack[stackLast - 1].tkClass !== 2 /* Value */)) {
                        state = 0 /* IdAndUnary */;
                        op = pop();
                        _calcUnary(p, op, token);
                    }
                    state = 2 /* Binary */;
                    push();
                    calcStackRight();
                    break;
                case 1 /* Function */:
                    token.funcParams = [];
                // flows to TokenClass.ParamOpen
                case 3 /* ParamOpen */:
                    if (state === 2 /* Binary */) {
                        err(p, '', token);
                    }
                    push();
                    startPoint = stackLast + 1;
                    startPoints.push(startPoint);
                    state = 0 /* IdAndUnary */;
                    break;
                case 7 /* Comma */:
                case 4 /* ParamClose */:
                    if (!startPoint) {
                        err(p, "Missing starting parenthesis", token);
                    }
                    var funcToken = stack[startPoint - 1];
                    var isTokenComma = thisTkClass === 7 /* Comma */;
                    var isFunc = funcToken.tkClass === 1 /* Function */;
                    if (isTokenComma && !isFunc) {
                        err(p, "Missing function", token);
                    }
                    if (isFunc && !isTokenComma) {
                        // function code
                        if (startPoint !== stackLast + 1) { // in case there are 0 parameters
                            onCloseParamOrFunc();
                            funcToken.funcParams.push(token);
                        }
                        token = _execExprFunction(p, funcToken);
                    }
                    else {
                        // not a function
                        onCloseParamOrFunc();
                    }
                    if (!isTokenComma) {
                        stack[stackLast] = token;
                        startPoints.pop();
                        startPoint = startPoints[startPoints.length - 1] || 0;
                        state = 2 /* Binary */;
                    }
                    else {
                        funcToken.funcParams.push(token);
                        state = 0 /* IdAndUnary */;
                    }
                    break;
                case 5 /* Unary */:
                    if (state === 0 /* IdAndUnary */) {
                        state = 1 /* NoUnary */;
                        push();
                        break;
                    }
                // it flows to TokenClass.Binary
                case 6 /* Binary */:
                    if (state !== 2 /* Binary */) {
                        err(p, '', token);
                    }
                    if (stackLast > 0 && stack[stackLast].tkClass === 2 /* Value */) {
                        op = stack[stackLast - 1];
                        if (op.canBinOp && _comparePriority(op, token)) {
                            calcStackLeft();
                        }
                    }
                    state = 1 /* NoUnary */;
                    push();
                    break;
            }
        } while (true);
        calcStackLeft();
        // #debug-start
        if (p.args.isVerbose) {
            token = stack.length > 0 ? stack[0] : { paType: 2 /* String */ };
            p.args.story.logFrmt('expression', [
                ['expression', p.expr],
                ['value', token.paType === 2 /* String */ ? token.sValue : token.numValue],
                ['stack.length', stack.length],
                ['stack', JSON.stringify(stack, undefined, 2)]
            ]);
        }
        // #debug-end
        if (stack.length !== 1) {
            err(p, "Stack not empty");
        }
        token = stack[0];
        if (stack[stackLast].tkClass !== 2 /* Value */) {
            err(p, 'Not a value');
        }
        return token.paType === 2 /* String */ ? token.sValue : token.numValue;
    }
    // ------------------------------------------------------------------------
    //                               Error Handling
    // ------------------------------------------------------------------------
    /** Throws a localized error */
    function err(p, msg, value) {
        ABeamer.throwI8n(ABeamer.Msgs.ExpHasErrors, { e: p.expr, err: msg || '' });
    }
    /**
     * Checks if the function parameter count matches the parameters expected,
     * and if their types match the expected.
     */
    function _checkFuncParams(req, paramCount, paramTypes) {
        var params = req.token.funcParams;
        if (paramCount >= 0 && params.length !== paramCount) {
            err(req, ABeamer.i8nMsg(ABeamer.Msgs.WrongNrParams, { p: req.token.sValue }));
        }
        if (paramTypes) {
            paramTypes.forEach(function (paramType, index) {
                var pi = params[index];
                if (!pi || (pi.paType !== paramType && paramType !== 0 /* Any */)) {
                    err(req, ABeamer.i8nMsg(ABeamer.Msgs.WrongParamType, { p: req.token.sValue, i: index }));
                }
            });
        }
    }
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    /** Compares the operators priority. */
    function _comparePriority(op1, op2) {
        return opPriority[op1.tkType] >= opPriority[op2.tkType];
    }
    // ------------------------------------------------------------------------
    //                               Compute
    // ------------------------------------------------------------------------
    /** Computes the unary operators. */
    function _calcUnary(p, op, value) {
        if (value.paType !== 1 /* Number */) {
            err(p, ABeamer.Msgs.UnaryErr, op);
        }
        if (op.tkType === 7 /* Minus */) {
            value.numValue = -value.numValue;
        }
    }
    /** Computes the binary operators. */
    function _calcBinary(p, op, value1, value2) {
        var AnyNotNumber = value1.paType !== 1 /* Number */
            || value2.paType !== 1 /* Number */;
        if (op.tkType !== 6 /* Plus */ && AnyNotNumber) {
            err(p, '', value1); // @TODO: Find a message for this error
        }
        var v;
        switch (op.tkType) {
            case 6 /* Plus */:
                if (AnyNotNumber) {
                    value1.sValue =
                        (value1.paType === 1 /* Number */
                            ? value1.numValue.toString() : value1.sValue)
                            + (value2.paType === 1 /* Number */
                                ? value2.numValue.toString() : value2.sValue);
                    value1.paType = 2 /* String */;
                    return;
                }
                else {
                    v = value1.numValue + value2.numValue;
                }
                break;
            case 7 /* Minus */:
                v = value1.numValue - value2.numValue;
                break;
            case 8 /* Multiply */:
                v = value1.numValue * value2.numValue;
                break;
            case 9 /* Divide */:
                v = value1.numValue / value2.numValue;
                break;
            case 10 /* Mod */:
                v = value1.numValue % value2.numValue;
                break;
            case 11 /* Equal */:
                v = value1.numValue === value2.numValue ? 1 : 0;
                break;
            case 12 /* Different */:
                v = value1.numValue !== value2.numValue ? 1 : 0;
                break;
            case 13 /* Lesser */:
                v = value1.numValue < value2.numValue ? 1 : 0;
                break;
            case 14 /* Greater */:
                v = value1.numValue > value2.numValue ? 1 : 0;
                break;
            case 15 /* LessEqual */:
                v = value1.numValue <= value2.numValue ? 1 : 0;
                break;
            case 16 /* GreaterEqual */:
                v = value1.numValue >= value2.numValue ? 1 : 0;
                break;
        }
        value1.numValue = v;
    }
    // ------------------------------------------------------------------------
    //                               Public Functions
    // ------------------------------------------------------------------------
    /**
     * Calculates an expression.
     * Expects the input to be an expression.
     * Used mostly by plugin creators and developers.
     */
    function calcExpr(expr, args) {
        return _stateMachine({
            args: args,
            checkParams: _checkFuncParams,
            expr: expr,
            pos: 1,
        });
    }
    ABeamer.calcExpr = calcExpr;
    /**
     * If it's an expression, it computes its value.
     * Returns undefined if it's not an expression.
     * Used mostly by plugin creators and developers.
     */
    function ifExprCalc(expr, args) {
        return isExpr(expr) ? calcExpr(expr, args) : undefined;
    }
    ABeamer.ifExprCalc = ifExprCalc;
    /**
     * If it's an expression, it computes its value and returns its numerical value.
     * Returns `defNumber` if it's not an expression.
     * Used mostly by plugin creators and developers.
     */
    function ifExprCalcNum(expr, defNumber, args) {
        if (!isExpr(expr)) {
            return defNumber;
        }
        var exprValue = calcExpr(expr, args);
        if (args.isStrict && exprValue !== undefined && typeof exprValue !== 'number') {
            ABeamer.throwI8n(ABeamer.Msgs.MustBeANumber, { p: expr });
        }
        return exprValue !== undefined ? parseFloat(exprValue) : defNumber;
    }
    ABeamer.ifExprCalcNum = ifExprCalcNum;
    /**
     * Checks if it's an expression, if it is, it computes and returns
     * the value as a number. Otherwise, returns the parameter as a number.
     * Used mostly by plugin creators and developers.
     */
    function ExprOrNumToNum(param, defValue, args) {
        if (args.isStrict && param !== undefined) {
            var typeofP = typeof param;
            if (typeofP !== 'string' && typeofP !== 'number') {
                ABeamer.throwI8n(ABeamer.Msgs.MustBeANumberOrExpr, { p: param });
            }
        }
        return ifExprCalcNum(param, param !== undefined ? param : defValue, args);
    }
    ABeamer.ExprOrNumToNum = ExprOrNumToNum;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=expressions.js.map