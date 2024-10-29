---
title: Easings
group: Library
category: Pages
---
## Description
  
An **easing**  is a interpolator runs `t` from [0, 1], where
`t=0` is the first frame and `t=1` the last frame of the animation.  
This interpolator can be viewed as the speed interpolator and its the
first one in the Animation Pipeline.  
The output value will be used to feed the [oscillator](oscillators.md#oscillator).  
Usually outputs a value from [0, 1] but other values are also possible.  
  
This interpolator can be used outside physical motion (left/right/top/bottom).  
In cases of textual property, such as `color`, `text`, `src`,
the easing will define how quickly those values will change
among a list defined `valueText` or by using `valueFormat`.  
In this case, the `startValue` and `value` should be between [0, 1].  
Setting a `startValue` higher than `value`,
will reverse the direction of the changes.  
  
The easing can also be used to define the speed of the changes
of multi-parameter properties, such as `text-shadow`, by using as an input
of a `valueFormat`.  
  
This is the first stage of the Animation Pipeline.  
  
  
An easing can be defined by:  
1. Name - It will use the list of easings predefined or added via plugins.  
2. Expression - It evaluate the expression for each frame, passing the variable `t`.  
3. Code Handler - This function will receive the variable `t`.  
  
**WARNING** Code Handlers aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.  
  
## Built-in easings
  
ABeamer includes a list of the most common easings by
bundling the jquery.easing plugin.  
More can be added via plugins.  
  
_see_: [http://gsgd.co.uk/sandbox/jquery/easing](http://gsgd.co.uk/sandbox/jquery/easing).  
_default_: `linear`    
  
<div class=api-header>&nbsp;</div>
#API
## EasingFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type EasingFunc = (t: number, params: EasingParams, args?: ABeamerArgs) => number;
```


Defines the easing Code Handler.  

An **easing**  is a interpolator runs `t` from [0, 1], where
`t=0` is the first frame and `t=1` the last frame of the animation.  
This interpolator can be viewed as the speed interpolator and its the
first one in the Animation Pipeline.  
Usually outputs a value from [0, 1] but other values are also possible.

## EasingHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type EasingHandler = EasingName | string | ExprString | EasingFunc | ExprName;
```


Defines the easing type, which is either string representing a predefined
easing function or a custom function (see easing function).  

The easing function interpolates from [0, 1].

## EasingParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type EasingParams = AnyParams;
```


Defines the Base parameters for every easing function.  
At the moment no parameter is required, but it can change in the future.
