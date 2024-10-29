---
title: Transitions
group: Library
category: Pages
---
  
## Description
  
A **transition** is the motion between the end of a scene
and the beginning of the next scene.  
  
Its computation is done outside the [Animation Pipeline](workflow.md#animation-pipeline).  
  
It can affect the properties of its children elements,
in such cases it's required for the user to provide the starting value
since the computed value might not be correct.  
Currently, only scene transitions are supported,
future versions might support element transition as well.  
The transition duration provided by the user is converted into frames
and split half to the out scene, the previous scene,
and half into the in scene, the next scene.  
ABeamer doesn't adds extra frames to ensure the execution of the transition,
instead it works on top of the element animation pipeline.  
If there aren't enough frames in the pipeline, part of the transition will be missing.  
  
## Core transitions
**WARNING!** In the ABeamer 2.x these core transitions will move `core-transitions` plugin.  
To prevent breaking changes include now the js script `core-transitions.js` on the html file.  
  
 ABeamer has the following core transitions:  
- `slideLeft`  
- `slideRight`  
- `slideTop`  
- `slideBottom`  
- `dissolve`  
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## TransitionParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface TransitionParams{ }
```


Parameters passed to the Transition function.

### TransitionParams.bothVisible

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
bothVisible: boolean;
```

### TransitionParams.state

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
state?: int;
```

### TransitionParams.frameI

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
frameI?: int;
```

### TransitionParams.enterFrameI

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
enterFrameI?: uint | undefined;
```

### TransitionParams.leaveRealFrameI

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
leaveRealFrameI?: uint | undefined;
```

### TransitionParams.frameCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
frameCount?: uint;
```

### TransitionParams.leaveFrameCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
leaveFrameCount?: uint;
```

### TransitionParams.enterFrameCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
enterFrameCount?: uint;
```

### TransitionParams.leaveAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
leaveAdapter?: AbstractAdapter;
```

### TransitionParams.enterAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[TransitionParams](transitions.md#transitionparams)]  
```js
enterAdapter?: AbstractAdapter;
```

## TransitionFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TransitionFunc = (params: TransitionParams, args?: ABeamerArgs) => void;
```

## TransitionHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TransitionHandler = string | ExprString | TransitionFunc
    | StdTransitions;
```

<div class=class-interface-header>&nbsp;</div>
## Transition

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Transition{ }
```

### Transition.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Transition](transitions.md#transition)]  
```js
handler: TransitionHandler;
```

### Transition.duration

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Transition](transitions.md#transition)]  
```js
duration?: TimeHandler;
```
