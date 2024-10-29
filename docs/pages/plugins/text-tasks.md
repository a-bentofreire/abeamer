---
title: Text Tasks
group: Plugins
category: Pages
---
## Description
  
A **text task** transforms text elements or creates complex text animation.  
  
This plugin has the following built-in text tasks:  
  
- `text-split` - Wraps words or characters with `span` tags, allowing to later
     animate individual words or characters.  
  
- `typewriter` - Creates the typewriter effect by typing individual characters
     or words one by one followed by a cursor.  
  
- `decipher` - Generates a random list of texts that gradually reveal the hidden text.  
  
<div class=api-header>&nbsp;</div>
#API
## TextTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TextTaskName =
    /** @see #TextSplitTaskParams */
    | 'text-split'
    /** @see #TypewriterTaskParams */
    | 'typewriter'
    /** @see #DecipherTaskParams */
    | 'decipher';
```

## TextTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TextTaskParams =
    | TextSplitTaskParams
    | TypewriterTaskParams
    | DecipherTaskParams;
```

<div class=class-interface-header>&nbsp;</div>
## TextSplitTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface TextSplitTaskParams extends AnyParams{ }
```

### TextSplitTaskParams.text

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TextSplitTaskParams](text-tasks.md#textsplittaskparams)]  
```js
text?: string;
```

### TextSplitTaskParams.splitBy

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TextSplitTaskParams](text-tasks.md#textsplittaskparams)]  
```js
splitBy?:
    | 'char'
    | 'word';
```

### TextSplitTaskParams.realign

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TextSplitTaskParams](text-tasks.md#textsplittaskparams)]  
```js
realign?: boolean;
```


If realign is true, it sets the left property of each new element
in a way that are align side by side.  

Use it if the element position is absolute.  

Main purpose is to use with transformations.  

Valid only for DOM elements.

<div class=class-interface-header>&nbsp;</div>
## TypewriterTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface TypewriterTaskParams extends TextSplitTaskParams{ }
```

### TypewriterTaskParams.cursor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TypewriterTaskParams](text-tasks.md#typewritertaskparams)]  
```js
cursor?: boolean;
```

### TypewriterTaskParams.cursorChar

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TypewriterTaskParams](text-tasks.md#typewritertaskparams)]  
```js
cursorChar?: string;
```

<div class=class-interface-header>&nbsp;</div>
## DecipherTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface DecipherTaskParams extends AnyParams{ }
```

### DecipherTaskParams.upperCharRanges

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
upperCharRanges?: [number, number][];
```

### DecipherTaskParams.lowerCharRanges

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
lowerCharRanges?: [number, number][];
```

### DecipherTaskParams.iterations

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
iterations: uint;
```

### DecipherTaskParams.revealCharIterations

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
revealCharIterations?: uint;
```

### DecipherTaskParams.revealDirection

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
revealDirection?: RevealDir | string;
```

### DecipherTaskParams.text

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DecipherTaskParams](text-tasks.md#deciphertaskparams)]  
```js
text: string;
```
