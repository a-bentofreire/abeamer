"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **expression** is a textual value that starts with `=`.
 * Expressions unlike [Code Handlers](code handler) can be defined on the `.json`
 * config file and support teleporting.
 *
 * ABeamer supports:
 *
 * - binary operators: `+`, `-`, `*`, `/`, `%` (modulus).
 *      Work both with numbers and arrays.
 *      `+` operator also concatenates textual values.
 *
 * - equality and comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`.
 * - logical comparison: `and`, `or`.
 *      These operators transform the 2 numerical values into 0 (false) or 1 (true).
 *
 * - parenthesis: `(`, `)`.
 * - [](functions).
 * - textual values: delimited by single quotes.
 *     the following character strings have a special meaning:
 *       - `\'` - defines a single quote
 *       - `\n` - defines new line
 * - numerical values.
 * - numerical arrays: [x,y,z].
 * - variables: numerical, textual, numerical arrays, objects.
 * - variable array one-dimension indices.
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
 * `= 'A' + 'Beamer'`.
 * `= round(12.4 + ceil(50.5) / 2 * (60 % 4))`.
 * `= cos(60*deg2rad) * random()`.
 * `= iff(fps < 20, 'too few frames', 'lots of frames')`.
 * `=[2, 3] + [4, 5]`.
 * `=chart.labelsY.marginAfter`.
 * `=foo[x-y+z]`.
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
    /**
     * Initializes the default global expression variables.
     * Code outside the core library should access this const.
     * It should use instead `getVars()`.
     */
    ABeamer._vars = {
        e: Math.E,
        pi: Math.PI,
        deg2rad: Math.PI / 180,
        rad2deg: 180 / Math.PI,
    };
    /**
     * Returns the global expression variables.
     * Plugins who want to add init variables, should use this function.
     * The usage of _vars is discourage to be used outside the scope adding init vars
     * for plugins.
     * Use `args.vars` instead.
     */
    function getVars() {
        return ABeamer._vars;
    }
    ABeamer.getVars = getVars;
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
    function isCharacter(ch, pos) {
        if (pos === void 0) { pos = 0; }
        if (ch === undefined || ch[pos] === undefined) {
            return false;
        }
        var codePoint = ch.codePointAt(pos);
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
    var Str2TokenType;
    (function (Str2TokenType) {
        Str2TokenType[Str2TokenType["["] = 2] = "[";
        Str2TokenType[Str2TokenType["]"] = 3] = "]";
        Str2TokenType[Str2TokenType["("] = 5] = "(";
        Str2TokenType[Str2TokenType[")"] = 6] = ")";
        Str2TokenType[Str2TokenType["+"] = 8] = "+";
        Str2TokenType[Str2TokenType["-"] = 9] = "-";
        Str2TokenType[Str2TokenType["*"] = 10] = "*";
        Str2TokenType[Str2TokenType["/"] = 11] = "/";
        Str2TokenType[Str2TokenType["%"] = 12] = "%";
        Str2TokenType[Str2TokenType[","] = 4] = ",";
        Str2TokenType[Str2TokenType["=="] = 13] = "==";
        Str2TokenType[Str2TokenType["!="] = 14] = "!=";
        Str2TokenType[Str2TokenType["<"] = 15] = "<";
        Str2TokenType[Str2TokenType[">"] = 16] = ">";
        Str2TokenType[Str2TokenType["<="] = 17] = "<=";
        Str2TokenType[Str2TokenType[">="] = 18] = ">=";
    })(Str2TokenType || (Str2TokenType = {}));
    /**
     * List of operator precedence.
     * Taken from the JavaScript operator precedence.
     */
    var opPriority = [
        0,
        19,
        19,
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
        6,
        5,
        16,
    ];
    var Type2Class = [
        0 /* None */,
        1 /* Function */,
        2 /* ArrayOpen */,
        3 /* ArrayClose */,
        10 /* Comma */,
        5 /* ParamOpen */,
        6 /* ParamClose */,
        4 /* Value */,
        7 /* Unary */,
        7 /* Unary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        9 /* Binary */,
        8 /* LogicalUnary */,
    ];
    function _isId(ch, isFirst) {
        return ch === undefined ? false :
            (ch === '_' ? true : isFirst ? isCharacter(ch) : isCharacterOrNum(ch));
    }
    function _parseVars(p, varValue, varName, expr, pos) {
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
            p.token.arrayValue = undefined;
        }
        else if (varTypeOf === 'object') {
            if (Array.isArray(varValue)) {
                p.token.paType = 3 /* Array */;
                p.token.arrayValue = varValue;
                p.token.sValue = undefined;
                p.token.numValue = undefined;
            }
            else if (expr[pos] === '.') {
                var varPropStart = ++pos;
                while (_isId(expr[pos], varPropStart === pos)) {
                    pos++;
                }
                var varProp = expr.substring(varPropStart, pos);
                if (!varProp) {
                    err(p, "Invalid object variable " + varName);
                }
                pos = _parseVars(p, varValue[varProp], varName + '.' + varProp, expr, pos);
            }
            if (expr[pos] === '[') {
                var varPropStart = ++pos;
                var bracketCount = 1;
                while (bracketCount > 0) {
                    switch (expr[pos]) {
                        case '[':
                            bracketCount++;
                            break;
                        case ']':
                            bracketCount--;
                            break;
                        case undefined:
                            err(p, "Invalid  variable indexing " + varName);
                    }
                    pos++;
                }
                var indexExpr = '=' + expr.substring(varPropStart, pos - 1);
                var indexValue = calcExpr(indexExpr, p.args);
                var arrayItem = varValue[parseInt(indexValue)];
                _parseVars(p, arrayItem, varName, indexExpr, 1);
                pos++;
            }
        }
        else if (varTypeOf === 'boolean') {
            p.token.paType = 1 /* Number */;
            p.token.numValue = varValue ? 1 : 0;
            p.token.sValue = undefined;
            p.token.arrayValue = undefined;
        }
        else {
            err(p, "Unsupported type of " + varName);
        }
        return pos;
    }
    function _parser(p, checkSign) {
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
            // vars, functions, named operators
            if (ch === '_' || isCharacter(ch)) {
                while (_isId(expr[++pos], false)) { }
                if (expr[pos] === '(') {
                    setToken(1 /* Function */);
                    var funcName = p.token.sValue;
                    if (funcName === 'not') {
                        p.token.tkType = 21 /* LogicalNot */;
                        p.token.tkClass = 8 /* LogicalUnary */;
                    }
                    else {
                        pos++;
                    }
                }
                else {
                    setToken(7 /* Value */);
                    var varName = p.token.sValue;
                    var opNameIndex = ['not', 'and', 'or'].indexOf(varName);
                    if (opNameIndex !== -1) {
                        // named operators
                        p.token.tkType = [21 /* LogicalNot */, 19 /* LogicalAnd */,
                            20 /* LogicalOr */][opNameIndex];
                        p.token.tkClass = opNameIndex !== 0 ? 9 /* Binary */ : 8 /* LogicalUnary */;
                    }
                    else {
                        // variables
                        pos = _parseVars(p, p.args.vars[varName], varName, expr, pos);
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
                setToken(7 /* Value */);
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
                setToken(7 /* Value */);
                p.token.sValue = p.token.sValue.replace(/\\([n'])/g, function (_all, meta) {
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
            var type = Str2TokenType[ch] || 0 /* None */;
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
        p.token.canBinOp = tkClass === 7 /* Unary */ || tkClass === 9 /* Binary */;
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
            tkClass: 4 /* Value */,
            tkType: 7 /* Value */,
        };
        p.res = res;
        p.token = funcToken;
        func(funcToken.funcParams, p);
        return res;
    }
    // ------------------------------------------------------------------------
    //                               Execute Array
    // ------------------------------------------------------------------------
    function _execArray(_p, funcToken) {
        var res = {
            paType: 3 /* Array */,
            sValue: undefined,
            numValue: undefined,
            arrayValue: funcToken.funcParams.map(function (param) {
                return param.numValue;
            }),
            canBinOp: false,
            tkClass: 4 /* Value */,
            tkType: 7 /* Value */,
        };
        return res;
    }
    // ------------------------------------------------------------------------
    //                               State Machine
    // ------------------------------------------------------------------------
    // @TODO: Implement logical Not
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
        function onCloseParamOrArrayOrFunc() {
            calcStackLeft();
            if (startPoint !== stackLast) {
                err(p, '', token);
            }
            token = stack.pop();
            stackLast--;
        }
        do {
            p.token = {};
            var thisTkClass = _parser(p, state !== 2 /* Binary */);
            token = p.token;
            if (thisTkClass === 0 /* None */) {
                break;
            }
            switch (thisTkClass) {
                case 4 /* Value */:
                    if (state === 2 /* Binary */) {
                        err(p, '', token);
                    }
                    else if (state === 1 /* NoUnary */
                        && [7 /* Unary */, 8 /* LogicalUnary */].indexOf(stack[stackLast].tkClass) !== -1
                        && (stackLast === 0 || stack[stackLast - 1].tkClass !== 4 /* Value */)) {
                        state = 0 /* IdAndUnary */;
                        op = pop();
                        _calcUnary(p, op, token);
                    }
                    state = 2 /* Binary */;
                    push();
                    calcStackRight();
                    break;
                case 2 /* ArrayOpen */:
                // flows to TokenClass.Function
                case 1 /* Function */:
                    token.funcParams = [];
                // flows to TokenClass.ParamOpen
                case 5 /* ParamOpen */:
                    if (state === 2 /* Binary */) {
                        err(p, '', token);
                    }
                    push();
                    startPoint = stackLast + 1;
                    startPoints.push(startPoint);
                    state = 0 /* IdAndUnary */;
                    break;
                case 10 /* Comma */:
                case 6 /* ParamClose */:
                case 3 /* ArrayClose */:
                    if (!startPoint) {
                        err(p, "Missing starting parenthesis", token);
                    }
                    var funcToken = stack[startPoint - 1];
                    var isTokenComma = thisTkClass === 10 /* Comma */;
                    var isFunc = funcToken.tkClass === 1 /* Function */;
                    var isArray = funcToken.tkClass === 2 /* ArrayOpen */;
                    if (isTokenComma && !isFunc && !isArray) {
                        err(p, "Missing function", token);
                    }
                    if ((isFunc || isArray) && !isTokenComma) {
                        // function code
                        if (startPoint !== stackLast + 1) { // in case there are 0 parameters
                            onCloseParamOrArrayOrFunc();
                            funcToken.funcParams.push(token);
                        }
                        if (isFunc) {
                            token = _execExprFunction(p, funcToken);
                        }
                        else {
                            token = _execArray(p, funcToken);
                        }
                    }
                    else {
                        // not a function
                        onCloseParamOrArrayOrFunc();
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
                case 8 /* LogicalUnary */:
                case 7 /* Unary */:
                    if (state === 0 /* IdAndUnary */) {
                        if (thisTkClass === 7 /* Unary */) {
                            state = 1 /* NoUnary */;
                        }
                        push();
                        break;
                    }
                // it flows to TokenClass.Binary
                case 9 /* Binary */:
                    if (state !== 2 /* Binary */) {
                        err(p, '', token);
                    }
                    if (stackLast > 0 && stack[stackLast].tkClass === 4 /* Value */) {
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
            var v = _valueOfToken(token);
            p.args.story.logFrmt('expression', [
                ['expression', p.expr],
                ['value', v.toString()],
                ['stack.length', stack.length],
                ['stack', JSON.stringify(stack, undefined, 2)]
            ]);
        }
        // #debug-end
        if (stack.length !== 1) {
            err(p, "Stack not empty");
        }
        token = stack[0];
        if (stack[stackLast].tkClass !== 4 /* Value */) {
            err(p, 'Not a value');
        }
        return _valueOfToken(token);
    }
    function _valueOfToken(token) {
        return token.paType === 2 /* String */ ? token.sValue
            : token.paType === 3 /* Array */ ? token.arrayValue : token.numValue;
    }
    // ------------------------------------------------------------------------
    //                               Error Handling
    // ------------------------------------------------------------------------
    /** Throws a localized error */
    function err(p, msg, _value) {
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
    //                               Function Tools
    // ------------------------------------------------------------------------
    /**
     * Provides services for functions where the input can be N numerical parameters,
     * or an array of numerical values.
     *
     * Supported cases:
     * - `paramCount=1; arrayLength=undefined;`
     *     - if it's an array, it will exec the `func` on each index, and set output to an array.
     *     - if it's 1 numerical parameter, it will execute the `func` and set output a number.
     *
     * - `paramCount=undefined; arrayLength=undefined;`
     *    - it calls the `func` with an array, the result value type
     *    is the same as the one returned by the `func`.
     *
     */
    function arrayInputHelper(params, req, paramCount, arrayLength, func) {
        var inpArray;
        if (params.length === 1 && params[0].paType === 3 /* Array */) {
            // if the input value is a numerical array
            inpArray = params[0].arrayValue;
            if (arrayLength && inpArray.length !== arrayLength) {
                err(req, ABeamer.i8nMsg(ABeamer.Msgs.WrongNrParams, { p: req.token.sValue }));
            }
            if (paramCount !== arrayLength) {
                inpArray.forEach(function (el, index) {
                    inpArray[index] = func(el);
                });
                req.res.paType = 3 /* Array */;
                req.res.arrayValue = inpArray;
                return;
            }
        }
        else {
            // if the input is a list of numerical parameters
            if (paramCount >= 0 && params.length !== paramCount) {
                err(req, ABeamer.i8nMsg(ABeamer.Msgs.WrongNrParams, { p: req.token.sValue }));
            }
            inpArray = params.map(function (param, index) {
                if (param.paType !== 1 /* Number */) {
                    err(req, ABeamer.i8nMsg(ABeamer.Msgs.WrongParamType, { p: req.token.sValue, i: index }));
                }
                return param.numValue;
            });
            if (paramCount === 1) {
                req.res.paType = 1 /* Number */;
                req.res.numValue = func(inpArray[0]);
                return;
            }
        }
        var resValue = func(inpArray);
        if (typeof resValue === 'number') {
            req.res.paType = 1 /* Number */;
            req.res.numValue = resValue;
        }
        else {
            req.res.paType = 3 /* Array */;
            req.res.arrayValue = resValue;
        }
    }
    ABeamer.arrayInputHelper = arrayInputHelper;
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    /** Compares operators priority. */
    function _comparePriority(op1, op2) {
        return opPriority[op1.tkType] >= opPriority[op2.tkType];
    }
    // ------------------------------------------------------------------------
    //                               Compute
    // ------------------------------------------------------------------------
    /** Computes unary operators. */
    function _calcUnary(p, op, value) {
        if (value.paType !== 1 /* Number */) {
            err(p, ABeamer.Msgs.UnaryErr, op);
        }
        if (op.tkType === 9 /* Minus */) {
            value.numValue = -value.numValue;
        }
        else if (op.tkType === 21 /* LogicalNot */) {
            value.numValue = value.numValue ? 0 : 1;
        }
    }
    /** Computes binary operators. */
    function _calcBinary(p, op, value1, value2) {
        var AnyNotNumber = value1.paType !== 1 /* Number */
            || value2.paType !== 1 /* Number */;
        var is1stArray = value1.paType === 3 /* Array */;
        var is2ndArray = value2.paType === 3 /* Array */;
        function NumbersOnly() {
            if (AnyNotNumber) {
                err(p, 'This op only supports numbers', value1);
            }
        }
        var v;
        function execOp(f, allowOther) {
            if (is1stArray || is2ndArray) {
                if (!is1stArray || !is2ndArray) {
                    ABeamer.throwErr("Can only add 2 arrays");
                }
                if (value1.arrayValue.length !== value2.arrayValue.length) {
                    ABeamer.throwErr("Both arrays must have the same value");
                }
                value1.arrayValue.forEach(function (v1, index) {
                    value1.arrayValue[index] = f(v1, value2.arrayValue[index]);
                });
                value1.paType = 3 /* Array */;
                v = undefined;
            }
            else {
                if (AnyNotNumber) {
                    if (allowOther) {
                        return false;
                    }
                    else {
                        NumbersOnly();
                    }
                }
                else {
                    v = f(value1.numValue, value2.numValue);
                }
            }
            return true;
        }
        switch (op.tkType) {
            case 8 /* Plus */:
                if (!execOp(function (a, b) { return a + b; }, true)) {
                    value1.sValue =
                        (value1.paType === 1 /* Number */
                            ? value1.numValue.toString() : value1.sValue)
                            + (value2.paType === 1 /* Number */
                                ? value2.numValue.toString() : value2.sValue);
                    value1.paType = 2 /* String */;
                    return;
                }
                break;
            case 9 /* Minus */:
                execOp(function (a, b) { return a - b; });
                break;
            case 10 /* Multiply */:
                execOp(function (a, b) { return a * b; });
                break;
            case 11 /* Divide */:
                execOp(function (a, b) { return a / b; });
                break;
            case 12 /* Mod */:
                execOp(function (a, b) { return a % b; });
                break;
            case 13 /* Equal */:
                NumbersOnly();
                v = value1.numValue === value2.numValue ? 1 : 0;
                break;
            case 14 /* Different */:
                NumbersOnly();
                v = value1.numValue !== value2.numValue ? 1 : 0;
                break;
            case 15 /* Lesser */:
                NumbersOnly();
                v = value1.numValue < value2.numValue ? 1 : 0;
                break;
            case 16 /* Greater */:
                NumbersOnly();
                v = value1.numValue > value2.numValue ? 1 : 0;
                break;
            case 17 /* LessEqual */:
                NumbersOnly();
                v = value1.numValue <= value2.numValue ? 1 : 0;
                break;
            case 18 /* GreaterEqual */:
                NumbersOnly();
                v = value1.numValue >= value2.numValue ? 1 : 0;
                break;
            case 19 /* LogicalAnd */:
                NumbersOnly();
                v = value1.numValue && value2.numValue ? 1 : 0;
                break;
            case 20 /* LogicalOr */:
                NumbersOnly();
                v = value1.numValue || value2.numValue ? 1 : 0;
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
     * Computes the expression and returns the value.
     * If isStrict, checks if the return value is textual, if not throws error.
     */
    function calcStr(expr, args) {
        var exprValue = calcExpr(expr, args);
        if (args.isStrict && (exprValue === undefined || typeof exprValue !== 'string')) {
            ABeamer.throwI8n(ABeamer.Msgs.MustBeAString, { p: expr });
        }
        return exprValue;
    }
    ABeamer.calcStr = calcStr;
    /**
     * If it's an expression, it computes its value and returns its numerical value.
     * Returns `defNumber` if it's not an expression.
     * Used mostly by plugin creators and developers.
     */
    function ifExprCalcStr(expr, defString, args) {
        if (!isExpr(expr)) {
            return defString;
        }
        var exprValue = calcExpr(expr, args);
        if (args.isStrict && exprValue !== undefined && typeof exprValue !== 'string') {
            ABeamer.throwI8n(ABeamer.Msgs.MustBeAString, { p: expr });
        }
        return exprValue !== undefined ? exprValue : defString;
    }
    ABeamer.ifExprCalcStr = ifExprCalcStr;
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
    /**
     * Checks if it's an expression, if it is, it computes and returns
     * the value as a number. Otherwise, returns the parameter as a number.
     * Used mostly by plugin creators and developers.
     */
    function ExprOrStrToStr(param, defValue, args) {
        if (args.isStrict && param !== undefined) {
            var typeofP = typeof param;
            if (typeofP !== 'string') {
                ABeamer.throwI8n(ABeamer.Msgs.MustBeAStringOrExpr, { p: param });
            }
        }
        return ifExprCalcStr(param, param !== undefined ? param : defValue, args);
    }
    ABeamer.ExprOrStrToStr = ExprOrStrToStr;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=expressions.js.map