"use strict";
var ABeamer;
((ABeamer2) => {
  let ExprType;
  ((ExprType2) => {
    ExprType2[ExprType2["NotExpr"] = 0] = "NotExpr";
    ExprType2[ExprType2["CalcOnce"] = 1] = "CalcOnce";
    ExprType2[ExprType2["CalcMany"] = 2] = "CalcMany";
  })(ExprType = ABeamer2.ExprType || (ABeamer2.ExprType = {}));
  ABeamer2._vars = {
    e: Math.E,
    pi: Math.PI,
    deg2rad: Math.PI / 180,
    rad2deg: 180 / Math.PI
  };
  function getVars() {
    return ABeamer2._vars;
  }
  ABeamer2.getVars = getVars;
  ABeamer2.CharRanges = [
    ["A".charCodeAt(0), "Z".charCodeAt(0)],
    ["a".charCodeAt(0), "z".charCodeAt(0)]
  ];
  function isCharacter(ch, pos = 0) {
    if (ch === void 0 || ch[pos] === void 0) {
      return false;
    }
    const codePoint = ch.codePointAt(pos);
    return ABeamer2.CharRanges.findIndex((rg) => codePoint >= rg[0] && codePoint <= rg[1]) !== -1;
  }
  ABeamer2.isCharacter = isCharacter;
  function isDigit(ch) {
    return ch >= "0" && ch <= "9";
  }
  ABeamer2.isDigit = isDigit;
  function isCharacterOrNum(ch) {
    return isDigit(ch) || isCharacter(ch);
  }
  ABeamer2.isCharacterOrNum = isCharacterOrNum;
  function isExpr(text) {
    return text !== void 0 && text[0] === "=";
  }
  ABeamer2.isExpr = isExpr;
  let TokenType;
  ((TokenType2) => {
    TokenType2[TokenType2["None"] = 0] = "None";
    TokenType2[TokenType2["Function"] = 1] = "Function";
    TokenType2[TokenType2["ArrayOpen"] = 2] = "ArrayOpen";
    TokenType2[TokenType2["ArrayClose"] = 3] = "ArrayClose";
    TokenType2[TokenType2["Comma"] = 4] = "Comma";
    TokenType2[TokenType2["ParamOpen"] = 5] = "ParamOpen";
    TokenType2[TokenType2["ParamClose"] = 6] = "ParamClose";
    TokenType2[TokenType2["Value"] = 7] = "Value";
    TokenType2[TokenType2["Plus"] = 8] = "Plus";
    TokenType2[TokenType2["Minus"] = 9] = "Minus";
    TokenType2[TokenType2["Multiply"] = 10] = "Multiply";
    TokenType2[TokenType2["Divide"] = 11] = "Divide";
    TokenType2[TokenType2["Mod"] = 12] = "Mod";
    TokenType2[TokenType2["Equal"] = 13] = "Equal";
    TokenType2[TokenType2["Different"] = 14] = "Different";
    TokenType2[TokenType2["Lesser"] = 15] = "Lesser";
    TokenType2[TokenType2["Greater"] = 16] = "Greater";
    TokenType2[TokenType2["LessEqual"] = 17] = "LessEqual";
    TokenType2[TokenType2["GreaterEqual"] = 18] = "GreaterEqual";
    TokenType2[TokenType2["LogicalAnd"] = 19] = "LogicalAnd";
    TokenType2[TokenType2["LogicalOr"] = 20] = "LogicalOr";
    TokenType2[TokenType2["LogicalNot"] = 21] = "LogicalNot";
  })(TokenType || (TokenType = {}));
  let TokenClass;
  ((TokenClass2) => {
    TokenClass2[TokenClass2["None"] = 0] = "None";
    TokenClass2[TokenClass2["Function"] = 1] = "Function";
    TokenClass2[TokenClass2["ArrayOpen"] = 2] = "ArrayOpen";
    TokenClass2[TokenClass2["ArrayClose"] = 3] = "ArrayClose";
    TokenClass2[TokenClass2["Value"] = 4] = "Value";
    TokenClass2[TokenClass2["ParamOpen"] = 5] = "ParamOpen";
    TokenClass2[TokenClass2["ParamClose"] = 6] = "ParamClose";
    TokenClass2[TokenClass2["Unary"] = 7] = "Unary";
    TokenClass2[TokenClass2["LogicalUnary"] = 8] = "LogicalUnary";
    TokenClass2[TokenClass2["Binary"] = 9] = "Binary";
    TokenClass2[TokenClass2["Comma"] = 10] = "Comma";
  })(TokenClass || (TokenClass = {}));
  let Str2TokenType;
  ((Str2TokenType2) => {
    Str2TokenType2[Str2TokenType2["["] = 2 /* ArrayOpen */] = "[";
    Str2TokenType2[Str2TokenType2["]"] = 3 /* ArrayClose */] = "]";
    Str2TokenType2[Str2TokenType2["("] = 5 /* ParamOpen */] = "(";
    Str2TokenType2[Str2TokenType2[")"] = 6 /* ParamClose */] = ")";
    Str2TokenType2[Str2TokenType2["+"] = 8 /* Plus */] = "+";
    Str2TokenType2[Str2TokenType2["-"] = 9 /* Minus */] = "-";
    Str2TokenType2[Str2TokenType2["*"] = 10 /* Multiply */] = "*";
    Str2TokenType2[Str2TokenType2["/"] = 11 /* Divide */] = "/";
    Str2TokenType2[Str2TokenType2["%"] = 12 /* Mod */] = "%";
    Str2TokenType2[Str2TokenType2[","] = 4 /* Comma */] = ",";
    Str2TokenType2[Str2TokenType2["=="] = 13 /* Equal */] = "==";
    Str2TokenType2[Str2TokenType2["!="] = 14 /* Different */] = "!=";
    Str2TokenType2[Str2TokenType2["<"] = 15 /* Lesser */] = "<";
    Str2TokenType2[Str2TokenType2[">"] = 16 /* Greater */] = ">";
    Str2TokenType2[Str2TokenType2["<="] = 17 /* LessEqual */] = "<=";
    Str2TokenType2[Str2TokenType2[">="] = 18 /* GreaterEqual */] = ">=";
  })(Str2TokenType || (Str2TokenType = {}));
  const opPriority = [
    0,
    // None,
    19,
    // Function,
    19,
    // ArrayOpen,
    19,
    // ArrayClose,
    19,
    // Comma,
    20,
    // ParamOpen,
    20,
    // ParamClose,
    1,
    // Value,
    13,
    // Plus,
    13,
    // Minus,
    14,
    // Multiply,
    14,
    // Divide,
    14,
    // Mod,
    10,
    // Equal,
    10,
    // Different,
    11,
    // Lesser,
    11,
    // Greater,
    11,
    // LessEqual,
    11,
    // GreaterEqual,
    6,
    // LogicalAnd
    5,
    // LogicalOr
    16
    // LogicalNot
  ];
  const Type2Class = [
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
    // equality operators
    9 /* Binary */,
    9 /* Binary */,
    // conditional Operators
    9 /* Binary */,
    9 /* Binary */,
    9 /* Binary */,
    9 /* Binary */,
    // Logical operators
    9 /* Binary */,
    9 /* Binary */,
    8 /* LogicalUnary */
  ];
  function _isId(ch, isFirst) {
    return ch === void 0 ? false : ch === "_" ? true : isFirst ? isCharacter(ch) : isCharacterOrNum(ch);
  }
  function _parseVars(p, varValue, varName, expr, pos) {
    const varTypeOf = typeof varValue;
    if (varValue === void 0) {
      err(p, `Unknown variable ${varName}`);
    }
    if (varTypeOf === "string") {
      p.token.paType = ExFuncParamType.String;
      p.token.sValue = varValue;
    } else if (varTypeOf === "number") {
      p.token.paType = ExFuncParamType.Number;
      p.token.numValue = varValue;
      p.token.sValue = void 0;
      p.token.arrayValue = void 0;
    } else if (varTypeOf === "object") {
      if (Array.isArray(varValue)) {
        p.token.paType = ExFuncParamType.Array;
        p.token.arrayValue = varValue;
        p.token.sValue = void 0;
        p.token.numValue = void 0;
      } else if (expr[pos] === ".") {
        const varPropStart = ++pos;
        while (_isId(expr[pos], varPropStart === pos)) {
          pos++;
        }
        const varProp = expr.substring(varPropStart, pos);
        if (!varProp) {
          err(p, `Invalid object variable ${varName}`);
        }
        pos = _parseVars(p, varValue[varProp], varName + "." + varProp, expr, pos);
      }
      if (expr[pos] === "[") {
        const varPropStart = ++pos;
        let bracketCount = 1;
        while (bracketCount > 0) {
          switch (expr[pos]) {
            case "[":
              bracketCount++;
              break;
            case "]":
              bracketCount--;
              break;
            case void 0:
              err(p, `Invalid  variable indexing ${varName}`);
          }
          pos++;
        }
        const indexExpr = "=" + expr.substring(varPropStart, pos - 1);
        const indexValue = calcExpr(indexExpr, p.args);
        const arrayItem = varValue[parseInt(indexValue)];
        _parseVars(p, arrayItem, varName, indexExpr, 1);
        pos++;
      }
    } else if (varTypeOf === "boolean") {
      p.token.paType = ExFuncParamType.Number;
      p.token.numValue = varValue ? 1 : 0;
      p.token.sValue = void 0;
      p.token.arrayValue = void 0;
    } else {
      err(p, `Unsupported type of ${varName}`);
    }
    return pos;
  }
  function _parser(p, checkSign) {
    let startPos;
    function setToken(aType) {
      p.token.sValue = expr.substring(startPos, pos);
      p.token.tkType = aType;
      p.token.tkClass = Type2Class[aType];
    }
    const expr = p.expr;
    let pos = p.pos;
    p.token.tkClass = 0 /* None */;
    do {
      let ch = expr[pos];
      while (ch === " ") {
        ch = expr[++pos];
      }
      startPos = pos;
      if (ch === void 0) {
        break;
      }
      if (ch === "_" || isCharacter(ch)) {
        while (_isId(expr[++pos], false)) {
        }
        if (expr[pos] === "(") {
          setToken(1 /* Function */);
          const funcName = p.token.sValue;
          if (funcName === "not") {
            p.token.tkType = 21 /* LogicalNot */;
            p.token.tkClass = 8 /* LogicalUnary */;
          } else {
            pos++;
          }
        } else {
          setToken(7 /* Value */);
          const varName = p.token.sValue;
          const opNameIndex = ["not", "and", "or"].indexOf(varName);
          if (opNameIndex !== -1) {
            p.token.tkType = [
              21 /* LogicalNot */,
              19 /* LogicalAnd */,
              /**/
              20 /* LogicalOr */
            ][opNameIndex];
            p.token.tkClass = opNameIndex !== 0 ? 9 /* Binary */ : 8 /* LogicalUnary */;
          } else {
            pos = _parseVars(p, p.args.vars[varName], varName, expr, pos);
          }
        }
        break;
      }
      if (checkSign && ((ch === "-" || ch === "+") && isDigit(expr[pos + 1]))) {
        ch = expr[++pos];
      }
      if (isDigit(ch)) {
        do {
          ch = expr[++pos];
        } while (ch && (isDigit(ch) || ch === "."));
        setToken(7 /* Value */);
        p.token.paType = ExFuncParamType.Number;
        p.token.numValue = parseFloat(p.token.sValue);
        p.token.sValue = void 0;
        break;
      }
      if (ch === "'") {
        let prevCh;
        do {
          prevCh = ch;
          ch = expr[++pos];
        } while ((ch !== "'" || prevCh === "\\") && ch !== void 0);
        startPos++;
        setToken(7 /* Value */);
        p.token.sValue = p.token.sValue.replace(/\\([n'])/g, (_all, meta) => {
          switch (meta) {
            case "n":
              return "\n";
            case "'":
              return "'";
          }
        });
        p.token.paType = ExFuncParamType.String;
        pos++;
        break;
      }
      if ("=!<>".indexOf(ch) !== -1 && expr[pos + 1] === "=") {
        ch = ch + "=";
        pos++;
      }
      const type = Str2TokenType[ch] || 0 /* None */;
      if (type === 0 /* None */) {
        err(p, `Unknown token ${ch} in position ${pos}`, p.token);
      }
      pos++;
      setToken(type);
      break;
    } while (true);
    const tkClass = p.token.tkClass;
    p.pos = pos;
    p.token.canBinOp = tkClass === 7 /* Unary */ || tkClass === 9 /* Binary */;
    return tkClass;
  }
  function _execExprFunction(p, funcToken) {
    const funcName = funcToken.sValue;
    const func = _exFunctions[funcName];
    if (!func) {
      err(p, `Unknown function: ${funcName}`, funcToken);
    }
    const res = {
      canBinOp: false,
      tkClass: 4 /* Value */,
      tkType: 7 /* Value */
    };
    p.res = res;
    p.token = funcToken;
    func(funcToken.funcParams, p);
    return res;
  }
  function _execArray(_p, funcToken) {
    const res = {
      paType: ExFuncParamType.Array,
      sValue: void 0,
      numValue: void 0,
      arrayValue: funcToken.funcParams.map((param) => {
        return param.numValue;
      }),
      canBinOp: false,
      tkClass: 4 /* Value */,
      tkType: 7 /* Value */
    };
    return res;
  }
  function _stateMachine(p) {
    let States;
    ((States2) => {
      States2[States2["IdAndUnary"] = 0] = "IdAndUnary";
      States2[States2["NoUnary"] = 1] = "NoUnary";
      States2[States2["Binary"] = 2] = "Binary";
    })(States || (States = {}));
    const stack = [];
    let state = 0 /* IdAndUnary */;
    let token;
    let op;
    let stackLast = -1;
    let startPoint = 0;
    const startPoints = [];
    p.req = p;
    function push() {
      stack.push(token);
      stackLast++;
    }
    function pop() {
      const tk = stack[stackLast];
      stack.length = stackLast;
      stackLast--;
      return tk;
    }
    function calcStackLeft() {
      while (stackLast > 1 && stackLast > startPoint + 1) {
        op = stack[startPoint + 1];
        if (!op.canBinOp) {
          break;
        }
        const t1 = stack[startPoint];
        const t2 = stack[startPoint + 2];
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
        const t1 = stack[stackLast - 2];
        const t2 = stack[stackLast];
        const prevOp = stack[stackLast - 3];
        if (_comparePriority(op, prevOp)) {
          _calcBinary(p, op, t1, t2);
          stack.length = stackLast - 1;
          stackLast -= 2;
        } else {
          break;
        }
      }
    }
    function onCloseParamOrArrayOrFunc() {
      calcStackLeft();
      if (startPoint !== stackLast) {
        err(p, "", token);
      }
      token = stack.pop();
      stackLast--;
    }
    do {
      p.token = {};
      const thisTkClass = _parser(p, state !== 2 /* Binary */);
      token = p.token;
      if (thisTkClass === 0 /* None */) {
        break;
      }
      switch (thisTkClass) {
        case 4 /* Value */:
          if (state === 2 /* Binary */) {
            err(p, "", token);
          } else if (state === 1 /* NoUnary */ && [7 /* Unary */, 8 /* LogicalUnary */].indexOf(stack[stackLast].tkClass) !== -1 && (stackLast === 0 || stack[stackLast - 1].tkClass !== 4 /* Value */)) {
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
            err(p, "", token);
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
            err(p, `Missing starting parenthesis`, token);
          }
          const funcToken = stack[startPoint - 1];
          const isTokenComma = thisTkClass === 10 /* Comma */;
          const isFunc = funcToken.tkClass === 1 /* Function */;
          const isArray = funcToken.tkClass === 2 /* ArrayOpen */;
          if (isTokenComma && !isFunc && !isArray) {
            err(p, `Missing function`, token);
          }
          if ((isFunc || isArray) && !isTokenComma) {
            if (startPoint !== stackLast + 1) {
              onCloseParamOrArrayOrFunc();
              funcToken.funcParams.push(token);
            }
            if (isFunc) {
              token = _execExprFunction(p, funcToken);
            } else {
              token = _execArray(p, funcToken);
            }
          } else {
            onCloseParamOrArrayOrFunc();
          }
          if (!isTokenComma) {
            stack[stackLast] = token;
            startPoints.pop();
            startPoint = startPoints[startPoints.length - 1] || 0;
            state = 2 /* Binary */;
          } else {
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
            err(p, "", token);
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
    if (p.args.isVerbose) {
      token = stack.length > 0 ? stack[0] : { paType: ExFuncParamType.String };
      const v = _valueOfToken(token);
      p.args.story.logFrmt("expression", [
        ["expression", p.expr],
        ["value", v.toString()],
        ["stack.length", stack.length],
        ["stack", JSON.stringify(stack, void 0, 2)]
      ]);
    }
    if (stack.length !== 1) {
      err(p, `Stack not empty`);
    }
    token = stack[0];
    if (stack[stackLast].tkClass !== 4 /* Value */) {
      err(p, "Not a value");
    }
    return _valueOfToken(token);
  }
  function _valueOfToken(token) {
    return token.paType === ExFuncParamType.String ? token.sValue : token.paType === ExFuncParamType.Array ? token.arrayValue : token.numValue;
  }
  function err(p, msg, _value) {
    throwI8n(Msgs.ExpHasErrors, { e: p.expr, err: msg || "" });
  }
  function _checkFuncParams(req, paramCount, paramTypes) {
    const params = req.token.funcParams;
    if (paramCount >= 0 && params.length !== paramCount) {
      err(req, i8nMsg(Msgs.WrongNrParams, { p: req.token.sValue }));
    }
    if (paramTypes) {
      paramTypes.forEach((paramType, index) => {
        const pi = params[index];
        if (!pi || pi.paType !== paramType && paramType !== ExFuncParamType.Any) {
          err(req, i8nMsg(Msgs.WrongParamType, { p: req.token.sValue, i: index }));
        }
      });
    }
  }
  function arrayInputHelper(params, req, paramCount, arrayLength, func) {
    let inpArray;
    if (params.length === 1 && params[0].paType === ExFuncParamType.Array) {
      inpArray = params[0].arrayValue;
      if (arrayLength && inpArray.length !== arrayLength) {
        err(req, i8nMsg(Msgs.WrongNrParams, { p: req.token.sValue }));
      }
      if (paramCount !== arrayLength) {
        inpArray.forEach((el, index) => {
          inpArray[index] = func(el);
        });
        req.res.paType = ExFuncParamType.Array;
        req.res.arrayValue = inpArray;
        return;
      }
    } else {
      if (paramCount >= 0 && params.length !== paramCount) {
        err(req, i8nMsg(
          Msgs.WrongNrParams,
          { p: req.token.sValue }
        ));
      }
      inpArray = params.map((param, index) => {
        if (param.paType !== ExFuncParamType.Number) {
          err(req, i8nMsg(
            Msgs.WrongParamType,
            { p: req.token.sValue, i: index }
          ));
        }
        return param.numValue;
      });
      if (paramCount === 1) {
        req.res.paType = ExFuncParamType.Number;
        req.res.numValue = func(inpArray[0]);
        return;
      }
    }
    const resValue = func(inpArray);
    if (typeof resValue === "number") {
      req.res.paType = ExFuncParamType.Number;
      req.res.numValue = resValue;
    } else {
      req.res.paType = ExFuncParamType.Array;
      req.res.arrayValue = resValue;
    }
  }
  ABeamer2.arrayInputHelper = arrayInputHelper;
  function _comparePriority(op1, op2) {
    return opPriority[op1.tkType] >= opPriority[op2.tkType];
  }
  function _calcUnary(p, op, value) {
    if (value.paType !== ExFuncParamType.Number) {
      err(p, Msgs.UnaryErr, op);
    }
    if (op.tkType === 9 /* Minus */) {
      value.numValue = -value.numValue;
    } else if (op.tkType === 21 /* LogicalNot */) {
      value.numValue = value.numValue ? 0 : 1;
    }
  }
  function _calcBinary(p, op, value1, value2) {
    const AnyNotNumber = value1.paType !== ExFuncParamType.Number || value2.paType !== ExFuncParamType.Number;
    const is1stArray = value1.paType === ExFuncParamType.Array;
    const is2ndArray = value2.paType === ExFuncParamType.Array;
    function NumbersOnly() {
      if (AnyNotNumber) {
        err(p, "This op only supports numbers", value1);
      }
    }
    let v;
    function execOp(f, allowOther) {
      if (is1stArray || is2ndArray) {
        if (!is1stArray || !is2ndArray) {
          throwErr(`Can only add 2 arrays`);
        }
        if (value1.arrayValue.length !== value2.arrayValue.length) {
          throwErr(`Both arrays must have the same value`);
        }
        value1.arrayValue.forEach((v1, index) => {
          value1.arrayValue[index] = f(v1, value2.arrayValue[index]);
        });
        value1.paType = ExFuncParamType.Array;
        v = void 0;
      } else {
        if (AnyNotNumber) {
          if (allowOther) {
            return false;
          } else {
            NumbersOnly();
          }
        } else {
          v = f(value1.numValue, value2.numValue);
        }
      }
      return true;
    }
    switch (op.tkType) {
      case 8 /* Plus */:
        if (!execOp((a, b) => a + b, true)) {
          value1.sValue = (value1.paType === ExFuncParamType.Number ? value1.numValue.toString() : value1.sValue) + (value2.paType === ExFuncParamType.Number ? value2.numValue.toString() : value2.sValue);
          value1.paType = ExFuncParamType.String;
          return;
        }
        break;
      case 9 /* Minus */:
        execOp((a, b) => a - b);
        break;
      case 10 /* Multiply */:
        execOp((a, b) => a * b);
        break;
      case 11 /* Divide */:
        execOp((a, b) => a / b);
        break;
      case 12 /* Mod */:
        execOp((a, b) => a % b);
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
  function calcExpr(expr, args) {
    return _stateMachine({
      args,
      checkParams: _checkFuncParams,
      expr,
      pos: 1
    });
  }
  ABeamer2.calcExpr = calcExpr;
  function ifExprCalc(expr, args) {
    return isExpr(expr) ? calcExpr(expr, args) : void 0;
  }
  ABeamer2.ifExprCalc = ifExprCalc;
  function ifExprCalcNum(expr, defNumber, args) {
    if (!isExpr(expr)) {
      return defNumber;
    }
    const exprValue = calcExpr(expr, args);
    if (args.isStrict && exprValue !== void 0 && typeof exprValue !== "number") {
      throwI8n(Msgs.MustBeANumber, { p: expr });
    }
    return exprValue !== void 0 ? parseFloat(exprValue) : defNumber;
  }
  ABeamer2.ifExprCalcNum = ifExprCalcNum;
  function calcStr(expr, args) {
    const exprValue = calcExpr(expr, args);
    if (args.isStrict && (exprValue === void 0 || typeof exprValue !== "string")) {
      throwI8n(Msgs.MustBeAString, { p: expr });
    }
    return exprValue;
  }
  ABeamer2.calcStr = calcStr;
  function ifExprCalcStr(expr, defString, args) {
    if (!isExpr(expr)) {
      return defString;
    }
    const exprValue = calcExpr(expr, args);
    if (args.isStrict && exprValue !== void 0 && typeof exprValue !== "string") {
      throwI8n(Msgs.MustBeAString, { p: expr });
    }
    return exprValue !== void 0 ? exprValue : defString;
  }
  ABeamer2.ifExprCalcStr = ifExprCalcStr;
  function ExprOrNumToNum(param, defValue, args) {
    if (args.isStrict && param !== void 0) {
      const typeofP = typeof param;
      if (typeofP !== "string" && typeofP !== "number") {
        throwI8n(Msgs.MustBeANumberOrExpr, { p: param });
      }
    }
    return ifExprCalcNum(
      param,
      param !== void 0 ? param : defValue,
      args
    );
  }
  ABeamer2.ExprOrNumToNum = ExprOrNumToNum;
  function ExprOrStrToStr(param, defValue, args) {
    if (args.isStrict && param !== void 0) {
      const typeofP = typeof param;
      if (typeofP !== "string") {
        throwI8n(Msgs.MustBeAStringOrExpr, { p: param });
      }
    }
    return ifExprCalcStr(
      param,
      param !== void 0 ? param : defValue,
      args
    );
  }
  ABeamer2.ExprOrStrToStr = ExprOrStrToStr;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=expressions.js.map
