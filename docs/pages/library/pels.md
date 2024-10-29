---
title: pEls
group: Library
category: Pages
---
## Description
  
A **pEls** is a element container providing a functionality similar to jQuery
 but, unlike JQuery, pEls supports both DOM and virtual elements.  
  
pEls are useful when there are multiple animations on the same element set
or to users that are used to use jQuery.  
  
During teleportation, it will set the animation selector to the pEls selector.  
This process will slow down the computation, since it must generate the jQuery for
every animation but it will guarantee that is teleportable.  
  
A pEls is created via `Scene.getPEls` and its selector is immutable.  
  
## Example
  
```js
 // a DOM scene
 var scene1 = story.scenes[0];
 var pEls = scene1.getPEls('#message, #square,.circle');
 pEls.fadeIn();
  
// a virtual elements on a DOM scene.  
// requires story.onGetVirtualElement to be set for a VirtualElement factory
 var scene2 = story.scenes[0];
 var pEls2 = scene2.getPEls('%liver, %lungs');
 pEls2.fadeIn();
```  
  
_see_: [animate-wrappers](/gallery/latest/#animate-wrappers).  
    
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## pEls

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface pEls{ }
```

### pEls.fadeIn()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[pEls](pels.md#pels)]  
```js
fadeIn(duration?: TimeHandler): pEls;
```


Wrapper for `scene.addAnimation` with `visible = false`,
followed by opacity moving to 1.

### pEls.fadeOut()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[pEls](pels.md#pels)]  
```js
fadeOut(duration?: TimeHandler): pEls;
```


Wrapper for scene.addAnimation with opacity moving to 0,
followed by `visible = false`.

### pEls.show()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[pEls](pels.md#pels)]  
```js
show(): pEls;
```


Shows all the elements owned by pEls.

### pEls.hide()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[pEls](pels.md#pels)]  
```js
hide(): pEls;
```


Hides all the elements owned by pEls.

### pEls.text()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[pEls](pels.md#pels)]  
```js
text(text: string): pEls;
```


Sets the text of all the elements owned by pEls.
