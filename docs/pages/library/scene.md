---
title: Scene
group: Library
category: Pages
---
## Description
  
A **scene** is a story segment and an element container.  
Each scene has an animation pipeline that contains the actions to perform in each frame.  
If a frame has no actions, it's called a still.  
To build the animation pipeline use the methods:  
  
- `addAnimations`  
- `addSerialAnimations`  
- `addStills`  
  
A scene usually is associated with a `div` in the html file.  
Scenes with `class=abeamer-class` are automatically added to story upon story creation.  
But it can also be a virtual scene.  
  
Only one scene can be active at a certain point in time,
but if it's defined a transition it two scene can be visible during the transition process.  
  
_see_: [transitions](transitions.md).    
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## Scene

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Scene{ }
```

### Scene.name

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
name?: string;
```

### Scene.transition

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
transition: Transition;
```


Returns scene transition information.  

_see_: [transitions](transitions.md).  

### Scene.frameInNr

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
readonly frameInNr: uint;
```


Defines the end of the scene pipeline. Usually this value is the
same as `frameCount` but for off-sync animations `frameInNr` can have
less value than frameCount.  


### Scene.frameCount

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
readonly frameCount: uint;
```


Total number of frames contained the scene.  


### Scene.storyFrameStart

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
readonly storyFrameStart: uint;
```


Sum of all the frames from the previous scenes.  


### Scene.storySceneIndex

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
readonly storySceneIndex: uint;
```


Zero-based Index of this scene within the list of scenes.  


### Scene.id

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Scene](scene.md#scene)]  
```js
readonly id: string;
```


Scene id from the DOM element.  


### Scene.addStills()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
addStills(duration: TimeHandler): Scene;
```


Adds a series of motionless frames defined by duration.  
This method changes the end of the pipeline (frameInNr).

### Scene.addAnimations()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
addAnimations(animes: Animations): Scene;
```


Adds a list of parallel animations to the render pipeline.  
The animations can start off-sync from each other via Position parameter.  

_see_: [animations](animations.md).  

### Scene.addSerialAnimations()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
addSerialAnimations(serialAnimes: Animations[]): Scene;
```


Adds a list of serial animations to the render pipeline.  
This is the same as: `serialAnimes.forEach(anime => addAnimations(anime))`  
Use this if you want to load all animations from an external file.

### Scene.getElementAdapters()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
getElementAdapters(selector: ElSelectorHandler): ElementAdapter[];
```


Used only task plugin creators.

### Scene.getPEls()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
getPEls(selector: ElSelector): pEls;
```


Creates a pEls from the selectors.

### Scene.pElsShow()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
pElsShow(selector: ElSelector): pEls;
```


Adds `visible = true` to the pipeline.

### Scene.pElsHide()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
pElsHide(selector: ElSelector): pEls;
```


Adds `visible = false` to the pipeline.

### Scene.pElsFadeIn()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
pElsFadeIn(selector: ElSelector, duration?: TimeHandler): pEls;
```


Wrapper for `addAnimation` with `visible = false`,
followed by opacity moving to 1.

### Scene.pElsFadeOut()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Scene](scene.md#scene)]  
```js
pElsFadeOut(selector: ElSelector, duration?: TimeHandler): pEls;
```


Wrapper for `addAnimation` with opacity moving to 0,
followed by `visible = false`
