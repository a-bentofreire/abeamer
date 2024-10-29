---
title: Animations
group: Library
category: Pages
---
## Description
  
Defines how a list of [elements](#Element) (HTML Element, SVG element and Virtual Element),
inside a [Scene](scene.md#scene) defined by [Selector](#Selector) will have a list of
[properties](#Animation Properties) (left, src, color, font-size, ...) modified over time.  
  
Animations are added in parallel, via `addAnimation`, and in series via `addSerialAnimations`.  
Although, the animations that are added in parallel, they can be [Off-Sync](glossary.md#off-sync)
via `position` parameter.  
  
An animation has an [Animation Interpolator](#Animation Interpolator) that passes a `t` parameter from
[Start Value](animations.md#animationpropvaluestart) to [Value](animations.md#animationpropvalue) through the
[Animation Pipeline](workflow.md#animation-pipeline).  
  
An animation doesn't communicates direct with an HTMLElement attributes, instead
uses an [Adapter](glossary.md#adapter) to serve as an interface, allowing for an
[animation property](#Animation Properties) to map into different type of Elements
and to map an animation property into multiple element properties such [Dual Properties](#Dual Properties).  
  
[Tasks](tasks.md) which are also added via `addAnimation` and
allow to create complex animations and special effects.  
  
<div class=api-header>&nbsp;</div>
#API
## BypassMode

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type BypassMode = 0 | 1 | 2;
```

## FuncParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type FuncParams = AnyParams;
```

Base parameters used by any Animation Function.
## ExprName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ExprName = ExprString;
```


A ExprName is used for motion handlers, mostly for easings, to have
dynamic names.  
Since an expression can be used to interpolate, by using expressions starting
with '==', it will compute immediately the expression and the output
must the motion name.  
_example_: `= 'easeIn' + iff(frameWidth < 100, 'Quad', 'Cubic')`  
<div class=class-interface-header>&nbsp;</div>
## AnimationCommonParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AnimationCommonParams{ }
```


Defines parameters used both by `Animation` and `AnimationProp`.  
The `AnimationProp` overrides the parameters defined by `Animation`.  
This way, an animation can have parameters for all animation properties
and some animation properties can have different parameters.  
The `duration` parameter defined in the animation property


### AnimationCommonParams.enabled

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
enabled?: boolean;
```

If it's false, it will bypass the animation or property.
### AnimationCommonParams.advance

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
advance?: boolean;
```


A `Scene.addAnimations` runs its list of animations and properties in parallel,
and at the end of last animation it moves the position forward.  
Setting the `advance`:  
1. To `true` of an animation property will move forward the position
for the next property animation, but not the animation.  
The property of each element moves independently.  
2. To `true` of an animation that isn't the last one, will move forward
for the next animation within the list.  
The value used with the maximum of all the elements of the all the properties
of the previous animation.  
3. To `false` of the last animation, it won't move forward at the end.

### AnimationCommonParams.duration

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
duration?: TimeHandler;
```


Defines the duration of the animation of a single cycle
in terms of frames, seconds, minutes or milliseconds.  
The total duration is `duration*(iterationCount + 1)`.  
In case of numerical values, ABeamer uses `defaultUnit`  
to known what kind of unit is it.  

_see_: [iterationCount](#iterationcount).  
_example_: `'1s'`  
_example_: `'40ms'`  
_example_: `'20%'  (use only on the animation property duration)`  
_example_: `'5fps'`  
_example_: `50`  
_example_: `2.5   (use only if the DefaultUnit is 's' or 'ms')`  
_example_: `(args) => '2s'  (JavaScript functions aren't teleportable)`  
_example_: `'=round(fps/2)'`  
### AnimationCommonParams.position

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
position?: TimeHandler;
```


Allows to [off-sync](glossary.md#off-sync) the starting point of an animation.  
Use `+`, `-` for relative positions.  
Prefer relative positions over absolute positions.  
Use only if you need to off-sync an animation.  
Overlapping property animations isn't supported.  
_example_: `'-10fps'  (starts the animation 10 frames before the expected starting point)`  
_example_: `'+2ms'  (starts the animation 2 milliseconds after the expected starting point`  
_example_: `(args) => '4ms' (JavaScript functions aren't teleportable)`  
### AnimationCommonParams.easing

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
easing?: EasingHandler;
```


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
The output value will be used to feed the [oscillator](oscillators.md#oscillator).  

ABeamer includes a list of the most common easings by
bundling the jquery.easing plugin.  
More can be added via plugins.  

An easing can be defined by:  
1. Name - It will use the list of easings predefined or added via plugins.  
2. Expression - It evaluate the expression for each frame, passing the variable `t`.  
3. Code Handler - This function will receive the variable `t`.  

**WARNING** Code Handlers aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.  
_default_: `'linear'`  
_see_: [easings](easings.md).  

### AnimationCommonParams.oscillator

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
oscillator?: Oscillator;
```


An **oscillator** is an optional interpolator that runs `t` from [easing(0), easing(1)]
and the usually outputs a value from [-Amplitude, Amplitude] where usually
f(0) = 0 and f(1) = 0.  
Its output will be generate `v = valueStart + (value - valueStart) * oscillator(easing(t))`  
and then will be injected into a path as input.  

An oscillator has the following usages:  

1. A rotational movement, where the oscillator defines the rotation and
the easing the defines the speed.  

2. Flashing elements, where an element changes its `opacity` or `text-shadow`,
and these values oscillate between [0, 1].  

3. Uni-dimensional paths. Unlike paths, the oscillators have their value stored
in the Action Link, allowing to link the end value to the next animation.  

The oscillators shares the namespace with [easings](easings.md), allowing any easing function
to operate also as a oscillator.  
Since the main function of an oscillator is to return to its original position
at the end of the animation cycle, when an easing is used as an oscillator the
best is to use the following:  
```json
{ iterationCount: 2,
  direction: alternate
}
```  
An oscillator can be defined by:  
1. Name - It will use the list of easings and oscillator predefined or added via plugins.  
2. Expression - It evaluate the expression for each frame, passing the variable `t`.  
3. Code Handler - This function will receive the variable `t`.  

**WARNING** Code Handlers aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.  


### AnimationCommonParams.path

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
path?: Path;
```

### AnimationCommonParams.itemDelayDuration

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
itemDelayDuration?: TimeHandler;
```


Delay of the start of the animation between 2 elements defined inside the selector.  
The total duration of the animation will be: `duration+count*itemDelayDuration`.  
_see_: [itemDelayGrouping](itemDelayGrouping.md).  

### AnimationCommonParams.itemDelayGrouping

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
itemDelayGrouping?: uint;
```


Applies a modulus division to the elements defined in the selector when
it relates the `itemDelayDuration`.  
A `itemDelayDuration=2`, will make the odd elements to have the same
`itemDelayDuration`.

### AnimationCommonParams.itemDelayDisturbance

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationCommonParams](animations.md#animationcommonparams)]  
```js
itemDelayDisturbance?: TimeHandler;
```


Applies a random changes with maximum of `itemDelayDisturbance` to the
`itemDelayDuration` for each element defined by the selector.

## AnimPropValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type AnimPropValue = string | number;
```

## PropValueFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PropValueFunc = (args?: ABeamerArgs) => AnimPropValue;
```

## PropValueStartHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PropValueStartHandler = AnimPropValue | int | ExprString | PropValueFunc;
```

## PropValueHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PropValueHandler = PropValueStartHandler;
```

## ValueTextFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ValueTextFunc = (t: number, args?: ABeamerArgs) => string;
```

<div class=class-interface-header>&nbsp;</div>
## AnimationProp

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AnimationProp extends AnimationCommonParams{ }
```

### AnimationProp.prop

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
prop: PropName;
```


Defines the property name. The property corresponds to DOM style element
or special properties

_see_: [AnimationPropName](AnimationPropName.md).  

### AnimationProp.valueStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
valueStart?: PropValueStartHandler;
```


Defines the starting value of an animation injected into the
Animation Pipeline (easing➝oscillator➝path|valueText➝valueFormat).  
Easing interpolates from `valueStart` to `value`.  

Use only if:  
1. ABeamer can't get the value from the element property.  
2. There is no [Action Link](#Action Link) or you want to have a different start value.  
3. Handle virtual elements.  

- Always set this value CSS transforms, since ABeamer doesn't
computes the CSS transform.  
- For pixels, all write text with 'px' suffix unless
is defined `valueFormat`.  
- To interpolate textual values, usually set `valueStart=0`.  
- It supports expressions and Code Handlers.  

**WARNING** Code Handlers aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.  
_example_: `10`  
_example_: `'4px'`  
_example_: `'true'`  
_example_: `'=frameCount'`  
If `valueFormat='%dpx'`  
_example_: `4`  
### AnimationProp.value

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
value?: PropValueHandler;
```


Defines the end numerical value into the
Animation Pipeline (easing->oscillator->path|valueText->valueFormat).  
Easing interpolates from `valueStart` to `value`.  

- For pixels, use a numerical value.  
- Use textual properties, usually don't need to define this value since
the default is 1.  
- To have a value relative to the starting value (valueStart or computed value),
use '+value' or '-value'.  
- It supports expressions and Code Handlers.  

**WARNING** Code Handlers aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.  
_default_: `1`  
_example_: `'+10'`  
_example_: `100`  
### AnimationProp.onSetValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
onSetValue?(value: AnimPropValue, args?: ABeamerArgs): boolean;
```


This event is fired before modifying an element property during rending.  
Use if you need to handle virtual elements.  
or if you want to manually set an element value.  
If returns `false`, ABeamer won't set the element property.  

**WARNING** Events aren't [teleported](teleporter.md),
therefore it can't be used in remote rendering.

### AnimationProp.valueFormat

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
valueFormat?: string;
```


Formats the value using the sprintf rules.  
This is the last node in the computation pipeline.  
It can format numerical values returned by the easing->oscillator,
but also each value of a path and a value returning from `valueText`.  
_example_: `'%dpx %dpx 8px white'`  
_example_: `'rotateX(%fdeg)'`  
_example_: `'rotateX(%fdeg)'`  
### AnimationProp.valueText

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
valueText?: string[] | ExprString | ValueTextFunc;
```


Provides a list of textual values, expression or function to be interpolated.  
This value is computed after easing, oscillator and path interpolators and round function.  
Mutual exclusive with pixels, multi-dimension paths and booleans.  

Used by textual properties such as `color`, `url`, `font-family` and `text`.

### AnimationProp.waitFor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
waitFor?: WaitForList;
```


**EXPERIMENTAL** Waits for the adapter to be ready to deliver an asset before
instructing the render to move to the next frame or give the server order to store the image.  
Used to wait for loading images or sync with videos.  

This feature is not implemented yet..._Coming soon_ .  

_see_: [animate-video-sync](/gallery/latest/#animate-video-sync).  

### AnimationProp.roundFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
roundFunc?: RoundFuncName;
```


Round function to apply after easing->oscillator->path.  
If this value is not set, for pixels properties the round function will be used,
for other properties there is no default round function.

### AnimationProp.iterationCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
iterationCount?: int;
```


Defines how many times the animation repeats itself.  
Same as CSS `animation-iteration-count`.  

_see_: [animate-loop](/gallery/latest/#animate-loop).  
_example_: `1 (to run twice)`  
_example_: `3 (to run 4 times)`  
### AnimationProp.direction

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
direction?: uint | string;
```


Defines the direction of each iteration.  
Same as CSS `animation-direction`.  
_example_: `'alternate'`  
_example_: `ABeamer.DI_ALTERNATE`  
_example_: `ABeamer.DS_NORMAL`  
### AnimationProp.bypassForwardMode

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
bypassForwardMode?: BypassMode;
```


Defines how the frames should be bypassed in case of a flush or another
forward motion outside the rendering process.  
_default_: `BP_FIRST_INSIDE`  
### AnimationProp.bypassBackwardMode

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AnimationProp](animations.md#animationprop)]  
```js
bypassBackwardMode?: BypassMode;
```


Defines how the frames should be bypassed in case of a flush or another
backward motion outside the rendering process.  
In a backward motion the first stage it's end point of animation.  
_default_: `BP_FIRST_INSIDE`  
<div class=class-interface-header>&nbsp;</div>
## Animation

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Animation extends AnimationCommonParams{ }
```


Definition of the animation to be sent to the render pipeline.  
Used by `Scene.addAnimations`.

### Animation.tasks

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Animation](glossary.md#animation)]  
```js
tasks?: Task[];
```


Tasks allow to build complex animations and
to avoid executing javascript code.  

_see_: [tasks](tasks.md).  

### Animation.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Animation](glossary.md#animation)]  
```js
selector?: ElSelectorHandler;
```


css selector, JQuery, html elements, virtual selector or meta-selectors
that defines the list of elements.  
If `strictMode` is `false`, the empty selectors will be gracefully bypassed.  

This field can be empty only if there is a setup task.

### Animation.props

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Animation](glossary.md#animation)]  
```js
props?: AnimationProp[];
```


List of properties per animation.  

_see_: [AnimationProp](AnimationProp.md).  

## Animations

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type Animations = Animation[];
```
