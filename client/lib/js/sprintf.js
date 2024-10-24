"use strict";
var ABeamer;
((ABeamer2) => {
  function downRound(v) {
    return Math.round(v - 1e-4);
  }
  ABeamer2.downRound = downRound;
  function sprintf(format, ...values) {
    let valueIndex = 0;
    return format.replace(
      /%(0*)((?:[1-9])?)([dfx])(?:\^([rfcd]))?/g,
      (_all, hasZeros, strNumDigits, specifier, roundFunc) => {
        let out;
        let strNumber;
        let value = values[valueIndex++];
        if (roundFunc) {
          switch (roundFunc) {
            case "r":
              value = Math.round(value);
              break;
            case "d":
              value = downRound(value);
              break;
            case "c":
              value = Math.ceil(value);
              break;
            case "f":
              value = Math.floor(value);
              break;
          }
        }
        switch (specifier) {
          case "d":
            strNumber = (roundFunc ? value : Math.floor(value)).toString();
            break;
          case "f":
            strNumber = value.toString();
            break;
          case "x":
            strNumber = value.toString(16);
            break;
        }
        out = strNumber;
        if (strNumDigits) {
          const numDigits = parseInt(strNumDigits);
          if (numDigits > strNumber.length) {
            out = new Array(numDigits - strNumber.length + 1).join(
              hasZeros ? "0" : " "
            ) + out;
          }
        }
        return out;
      }
    );
  }
  ABeamer2.sprintf = sprintf;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=sprintf.js.map
