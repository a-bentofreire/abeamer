---
title: Validators
group: Library
category: Pages
---
## Description
  
This module provides validations functions to check if input values
are within the expected space.  
Mostly to be used by plugin creators or developers.  
  
<div class=api-header>&nbsp;</div>
#API
## throwErr()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function throwErr(msg: string): void;
```

## throwI8n()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function throwI8n(msg: string, params?: I8nParams): void;
```

## throwIf()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function throwIf(isTrue: boolean, msg: string): void;
```

## throwIfI8n()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function throwIfI8n(isTrue: boolean, msg: string,
    params?: I8nParams): void;
```
