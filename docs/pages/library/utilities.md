---
title: Utilities
group: Library
category: Pages
---
  
## Description
  
This module provides utility functions, mostly to be used by plugin creators
or developers.  
  
<div class=api-header>&nbsp;</div>
#API
## RoundFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type RoundFunc = (v: number) => number;
```

## RoundHandlerFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type RoundHandlerFunc = string | RoundFuncName | RoundFunc;
```

## parseRoundFunc()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function parseRoundFunc(handler: RoundHandlerFunc): RoundFunc;
```

## parseHandler()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function parseHandler<T, TO>(handler: T, defaultHandler: T,
    _mapper: any, args: ABeamerArgs): TO;
```

## parseEnum()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function parseEnum<T>(value: T | string, mapper: any,
    defValue?: T | string | undefined): T;
```
