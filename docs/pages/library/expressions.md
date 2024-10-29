---
title: Expressions
group: Library
category: Pages
---
## Description
  
An **expression** is a textual value that starts with `=`.  
Expressions unlike [Code Handlers](glossary.md#code-handler) can be defined on the `.json`  
config file and support teleporting.  
  
ABeamer supports:  
  
- binary operators: `+`, `-`, `*`, `/`, `%` (modulus).  
     Work both with numbers and arrays.  
     `+` operator also concatenates textual values.  
  
- equality and comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`.  
- logical comparison: `and`, `or`.  
     These operators transform the 2 numerical values into 0 (false) or 1 (true).  
  
- parenthesis: `(`, `)`.  
- [functions](roadmap.md#functions).  
- textual values: delimited by single quotes.  
    the following character strings have a special meaning:  
      - `\'` - defines a single quote
      - `\n` - defines new line
- numerical values.  
- numerical arrays: [x,y,z].  
- variables: numerical, textual, numerical arrays, objects.  
- variable array one-dimension indices.  
  
## Built-in Variables
  
ABeamer has the following built-in variables:  
  
`e` - mathematical constant 'e'.  
`pi` - mathematical constant 'pi'.  
`deg2rad` - `=pi/180`.  
`rad2deg` - `=180/pi`.  
  
`fps` - frames per second.  
`frameWidth` - frame output width = generated file image width.  
`frameHeight` - frame output height = generated file image height.  
  
 `isTeleporting` - Is True, if it's teleporting.  
  
 `v0` - Computed Numerical `valueStart`.  
 `v1` - Computed Numerical `value`.  
 `vd` - Computed Numerical difference `value` - `valueStart`.  
 `vt` - Computed Numerical value injected to the easing function.  
 `vot` - Computed Numerical value injected to the oscillator function.  
 `vpt` - Computed Numerical value injected to the path function.  
 `t` - `t` used to interpolate an easing, oscillator or path via expression.  
## Examples
  
`= 'A' + 'Beamer'`.  
`= round(12.4 + ceil(50.5) / 2 * (60 % 4))`.  
`= cos(60*deg2rad) * random()`.  
`= iff(fps < 20, 'too few frames', 'lots of frames')`.  
`=[2, 3] + [4, 5]`.  
`=chart.labelsY.marginAfter`.  
`=foo[x-y+z]`.  
  
<div class=api-header>&nbsp;</div>
#API
## VarType

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type VarType = number | string | boolean | number[] | object;
```

<div class=class-interface-header>&nbsp;</div>
## Vars

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Vars{ }
```

### Vars.e

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
e: number;
```

### Vars.pi

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
pi: number;
```

### Vars.deg2rad

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
deg2rad: number;
```

=pi/180
### Vars.rad2deg

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
rad2deg: number;
```

=180/pi
### Vars.fps

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
fps?: uint;
```

Frames per second.
### Vars.frameWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
frameWidth?: uint;
```

Frame output width = generated file image width.
### Vars.frameHeight

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
frameHeight?: uint;
```

Frame output height = generated file image height.
### Vars.isTeleporting

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
isTeleporting?: boolean;
```

Is True, if it's teleporting.
### Vars.elIndex

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
elIndex?: uint;
```

Element index of the active adapter
### Vars.elCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
elCount?: uint;
```

Number of elements inside defined by the active adapter
### Vars.v0

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
v0?: number;
```

Computed Numerical `valueStart`.
### Vars.v1

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
v1?: number;
```

Computed Numerical `value`.
### Vars.vd

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
vd?: number;
```

Computed Numerical difference `value` - `valueStart`.
### Vars.vt

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
vt?: number;
```

Computed Numerical value injected to the easing function.
### Vars.vot

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
vot?: number;
```

Computed Numerical value injected to the oscillator function.
### Vars.vpt

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
vpt?: number;
```

Computed Numerical value injected to the path function.
### Vars.t

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
t?: number;
```

`t` used to interpolate an easing, oscillator or path via expression.
### Vars.v

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
v?: number;
```

Generic value. Used in Charts.
### Vars.i

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
i?: int;
```

Generic iterator. Used in Factories.
### Vars.n

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Vars](expressions.md#vars)]  
```js
n?: int;
```

Generic number of items/points/elements. Used in Charts.
## ExprType

<span class="code-badge badge-export">export</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-const">const</span> <span class="code-badge badge-enum">enum</span>    
```js
export const enum ExprType;
```

## ExprResult

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ExprResult = string | number | number[];
```

## ExprString

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ExprString = string;
```

## getVars()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function getVars(): Vars;
```


Returns the global expression variables.  
Plugins who want to add init variables, should use this function.  
The usage of _vars is discourage to be used outside the scope adding init vars
for plugins.  
Use `args.vars` instead.

## isCharacter()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function isCharacter(ch: string | undefined, pos: uint = 0): boolean;
```


Utility function to test if `ch` is a character.  
It might include non-latin characters. It depends on `CharRanges`.  
Used by developers and plugin creators.  


## isDigit()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function isDigit(ch: string): boolean;
```


Utility function to test if it's a digit.  
Used by developers and plugin creators.  


## isCharacterOrNum()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function isCharacterOrNum(ch: string): boolean;
```


Utility function to test if it's a digit or character.  
It might include non-latin characters. It depends on `CharRanges`.  
Used by developers and plugin creators.  


## isExpr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function isExpr(text: string): boolean;
```


Tests if `text` is an expression.  
Used by developers and plugin creators.

## TokenType

<span class="code-badge badge-public">public</span> <span class="code-badge badge-const">const</span> <span class="code-badge badge-enum">enum</span>    
```js
const enum TokenType;
```

## TokenClass

<span class="code-badge badge-public">public</span> <span class="code-badge badge-const">const</span> <span class="code-badge badge-enum">enum</span>    
```js
const enum TokenClass;
```

## arrayInputHelper()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function arrayInputHelper(params: ExprFuncParams,
    req: ExFuncReq,
    paramCount: uint | undefined, arrayLength: uint | undefined,
    func: (inpArray: any) => any): void;
```


Provides services for functions where the input can be N numerical parameters,
or an array of numerical values.  

Supported cases:  
- `paramCount=1; arrayLength=undefined;`  
    - if it's an array, it will exec the `func` on each index, and set output to an array.  
    - if it's 1 numerical parameter, it will execute the `func` and set output a number.  

- `paramCount=undefined; arrayLength=undefined;`  
   - it calls the `func` with an array, the result value type
   is the same as the one returned by the `func`.  


## calcExpr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function calcExpr(expr: string, args: ABeamerArgs): ExprResult;
```


Calculates an expression.  
Expects the input to be an expression.  
Used mostly by plugin creators and developers.

## ifExprCalc()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function ifExprCalc(expr: string,
    args: ABeamerArgs): ExprResult | undefined;
```


If it's an expression, it computes its value.  
Returns undefined if it's not an expression.  
Used mostly by plugin creators and developers.

## ifExprCalcNum()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function ifExprCalcNum(expr: string, defNumber: number | undefined,
    args: ABeamerArgs): number | undefined;
```


If it's an expression, it computes its value and returns its numerical value.  
Returns `defNumber` if it's not an expression.  
Used mostly by plugin creators and developers.

## calcStr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function calcStr(expr: string, args: ABeamerArgs): string;
```


Computes the expression and returns the value.  
If isStrict, checks if the return value is textual, if not throws error.

## ifExprCalcStr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function ifExprCalcStr(expr: string, defString: string | undefined,
    args: ABeamerArgs): string | undefined;
```


If it's an expression, it computes its value and returns its numerical value.  
Returns `defNumber` if it's not an expression.  
Used mostly by plugin creators and developers.

## ExprOrNumToNum()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function ExprOrNumToNum(param: ExprString | number,
    defValue: number | undefined, args: ABeamerArgs): number | undefined;
```


Checks if it's an expression, if it is, it computes and returns
the value as a number. Otherwise, returns the parameter as a number.  
Used mostly by plugin creators and developers.

## ExprOrStrToStr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function ExprOrStrToStr(param: ExprString | string,
    defValue: string | undefined, args: ABeamerArgs): string | undefined;
```


Checks if it's an expression, if it is, it computes and returns
the value as a number. Otherwise, returns the parameter as a number.  
Used mostly by plugin creators and developers.
