---
title: Time
group: Library
category: Pages
---
## Description
  
Provides time functions to convert between minutes/seconds/milliseconds into frames.  
Internally ABeamer only works with frames.  
    
  
<div class=api-header>&nbsp;</div>
#API
## TimeFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TimeFunc = (args?: ABeamerArgs) => TimeUnit | string
    | ExprString | number;
```

Time [Code Handler](glossary.md#code-handler)
## TimeHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TimeHandler = TimeUnit | string | ExprString | number | TimeFunc;
```

Time used by the user to provide Duration and Position
## frame2Time()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function frame2Time(frame: uint, fps: uint, unit: TimeUnit,
    maxPrecision?: uint): string;
```


Converts frames into time defined by the `unit`.

## parseTimeHandler()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function parseTimeHandler(
    timeOrFrame: TimeHandler | undefined,
    args: ABeamerArgs,
    defaultTimeOrFrame: string | int,
    referenceFrame: int,
    toInt: boolean = true): int | number;
```


 Parses positions or durations in f/ms/s/m in number of value.  
 Also supports adding or subtracting from the reference.  
 Floating point frames can be used together with toInt=false for `item-delay`.  
**param**: `toInt` rounds the nearest int. if the float part is 0.5, it rounds to the lower
