---
title: Functions
group: Library
category: Pages
---
## Description
  
A **function** transforms zero or more textual or numerical parameters
into another value.  
Functions are used inside an expression, and support remote rendering.  
The user can create its own custom functions but only built-in functions
and official plugins can create functions that support [teleportation](teleporter.md).  
  
## Core functions
**WARNING!** In the ABeamer 2.x these core functions will move `core-functions` plugin.  
To prevent breaking changes include now the js script `core-functions.js` on the html file.  
  
ABeamer has the following core functions:  
  
- `sin` - 'sine' trigonometric function.  
- `cos` - 'cosine' trigonometric function.  
- `tan` - 'tangent' trigonometric function.  
  
- `exp` - 2^x
- `log` - ln
- `log10` - base 10 logarithm.  
  
- `abs` - absolute value.  
- `sign` - sign function `v != 0 ? v / |v| : 0`.  
  
- `random` - random number between [0, 1].  
- `ceil`- always rounds up.  
- `floor`- always rounds down.  
- `sqrt` - square root.  
- `round` - round to the nearest integer value.  
- `downRound` - similar to round, but it guaranties that if fractional
part is 0.5, it will always round down.  
  
- `toNumber` - converts a textual parameter into a numerical parameter.  
- `toString` - converts a numerical parameter into a textual parameter.  
  
- `uppercase` - returns the uppercase of the textual parameter.  
- `lowercase` - returns the lowercase of the textual parameter.  
- `capitalize` -returns the uppercase of the first letter of each word
- `substr` - returns the a section of the 1st parameter.  
 The 2nd parameter is the start value and the 3rd parameter is the length.  
 If the 3rd parameter is less than 0, than is considered until the end.  
  
- `iff` - if the 1st numerical parameter is different from 0,
it returns the 2nd parameter, otherwise it returns the 3rd paramter.  
This function doesn't supports [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation).  
  
- `case` - the 1st numerical parameter is a zero index to select which
parameters to return.  
This function doesn't supports [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation).  
  
- `get` - returns the numerical N-value of a 0-base array.  
  
- `slice` - returns a subarray starting from `start` to `end-1` of a 0-base array.  
  
## Examples
_example_: `= substr('ABeamer', 4, 4)`  
_example_: `= round(12.4)`  
_example_: `= get([10,30,15],1)`  
it returns `30`  
_example_: `= slice([10,30,15,40],1, 3)`  
it returns `[30, 15]`  
  
## Arrays
  
Since ABeamer 1.6 that single numerical argument functions also support arrays.  
The operation is perform for each element, and it returns an array.  
The array functions can be composed.  
_example_: `= round(sqrt([12.4, 75, 10]))`    
  
<div class=api-header>&nbsp;</div>
#API
## ExFuncParamType

<span class="code-badge badge-export">export</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-const">const</span> <span class="code-badge badge-enum">enum</span>    
```js
export const enum ExFuncParamType;
```

<div class=class-interface-header>&nbsp;</div>
## ExFuncParam

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ExFuncParam{ }
```

### ExFuncParam.paType

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncParam](functions.md#exfuncparam)]  
```js
paType?: ExFuncParamType;
```

### ExFuncParam.sValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncParam](functions.md#exfuncparam)]  
```js
sValue?: string;
```

### ExFuncParam.numValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncParam](functions.md#exfuncparam)]  
```js
numValue?: number;
```

### ExFuncParam.arrayValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncParam](functions.md#exfuncparam)]  
```js
arrayValue?: number[];
```

<div class=class-interface-header>&nbsp;</div>
## ExFuncReq

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ExFuncReq{ }
```

### ExFuncReq.args

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncReq](functions.md#exfuncreq)]  
```js
args: ABeamerArgs;
```

### ExFuncReq.req

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncReq](functions.md#exfuncreq)]  
```js
req?: ExFuncReq;
```

### ExFuncReq.res

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncReq](functions.md#exfuncreq)]  
```js
res?: ExFuncParam;
```

### ExFuncReq.checkParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExFuncReq](functions.md#exfuncreq)]  
```js
checkParams: _CheckParamFunc;
```

## ExprFuncParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ExprFuncParams = ExFuncParam[];
```

## ExFunction

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ExFunction = (params: ExprFuncParams, req?: ExFuncReq) => void;
```
