<!--- @ -->
<!--- @author: Alexandre Bento Freire -->
## Action

An **action** is an internal representation of how a property value
of an element will change in a specific frame.
Actions are the resulting tree of the `scene.addAnimations`,
which transform user defined animations into frames.

##  Adapter

An **adapter** allows ABeamer to decouple from DOM by serving as an agent
between the ABeamer library and elements and scenes.   
  
For DOM adapters, ABeamer uses jQuery to query DOM and
maps special properties such `text` and `html` to
`textContent` and `innerHTML`.   
  
DOM adapters map [DOM Properties](DOM Property) into either HtmlElement attributes
or CSS properties, depending on the DOM Property name.   
  
For HtmlElement attributes, the DOM Adapter uses `element.getAttribute`.   
For CSS Properties, it uses `element.style`, but if it's empty,
it retrieves all the computed CSS properties via `window.getComputedStyle`
and caches its content.   
  
DOM Adapters use the attribute `abeamer-display` if present to define which
value will be when visible is set to true.   
  
A 'DOM Scene' is typically a DIV. A 'DOM Element' can be any HtmlElement.   
  
DOM Scenes can provide Virtual Elements via ids starting with `%`,
and `story.onGetVirtualElement`.   
  
For Virtual adapters there is a direct connection to the Virtual Element
and Scene attribute.   
  
Unlike DOM elements which only provide textual values, Virtual Elements can
get and set numerical values.   


## Animation

Defines how a list of [elements](#Element) (HTML Element, SVG element and Virtual Element),
inside a [](#Scene) defined by [](#Selector) will have a list of
[properties](#Animation Properties) (left, src, color, font-size, ...) modified over time.   

Animations are added in parallel, via `addAnimation`, and in series via `addSerialAnimations`.   
Although, the animations that are added in parallel, they can be [](#Off-Sync)
via `position` parameter.   

An animation has an [](#Animation Interpolator) that passes a `t` parameter from
[Start Value](animations#animationpropvaluestart) to [Value](animations#animationpropvalue) through the
[](#Animation Pipeline).   

An animation doesn't communicates direct with an HTML Element attributes, instead
uses an [](#Adapter) to use as an interface, allowing for an
[](#Animation Property) to map into different type of Elements
and to map an animation property into multiple element properties such [](#Dual Properties).   

[](#Tasks) which are also added via `addAnimation` and
allow to create complex animations and special effects.   


## Animation Duration

Defines the duration of the animation of a single cycle
in terms of frames, seconds, minutes or milliseconds.   
The total duration is `duration*(iterationCount + 1)`.   
In case of numerical values, ABeamer uses `defaultUnit`
to known what kind of unit is it.   


## Animation Property
<a name="animation-properties"></a>

List of parameters that are part of an animation, and define how an
[](#Adapter Property) will change over time.  
An Animation property besides its own parameters can override the [](#Animation) parameters.  

## Code Handler

A **code handler** is a TypeScript/JavaScript function that interacts with ABeamer during
the build of the [](#Animation Pipeline) or during the [](#Rendering) process.
Code Handlers provide great flexibility in providing interpolators, transitions, 
flyovers and tasks but for security reasons aren't teleported.
They can only be used in local rendering.

## Animation Pipeline

The **Animation Pipeline** is a multi step process that every `t` 
running from `0` to `1` will go through.  
The steps are the following:  
1. [](#Easing) - An interpolator that will set the motion speed.  
2. [](#Oscillator) - An optional interpolator used for rotational motion or pulsars.  
3. `v = startValue + (value - startValue) * oscillator(easing(t))`.  
4. [](#Path) - An optional interpolator that transforms `v` into a multi-dimension value.  
5. `valueText` - transforms into a textual value. Use only for textual properties.  
  Not supported by paths.  
6. `valueFormat` - An `sprintf` that formats numeric values, paths, and `valueText`.  


## Consuming the pipeline
<a name="consumed"></a>
<a name="consume-pipeline"></a>

This is a technique used internally by the render to reach the first render Position,
or used by the user to be able to compute a parameter that otherwise is not possible.  

The user should avoid this process and use `startValue` instead or other techniques
to compute parameters, since it forces the render to reverse the process before starting the rendering.  


## Easing

An **easing**  is a interpolator runs `t` from [0, 1], where
`t=0` is the first frame and `t=1` the last frame of the animation.  
This interpolator can be viewed as the speed interpolator and its the
first one in the Animation Pipeline.  
The output value will be used to feed the [](#oscillator).  
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
The output value will be used to feed the [](#oscillator).  

ABeamer includes a list of the most common easings by
bundling the jquery.easing plugin.   
More can be added via plugins.   

An easing can be defined by:
1. Name - It will use the list of easings predefined or added via plugins.   
2. Expression - It evaluate the expression for each frame, passing the variable `t`.   
3. Code Handler - This function will receive the variable `t`.   

**WARNING** Code Handlers aren't [teleported](#teleporter),
therefore it can't be used in remote rendering.   


## Flushing

Flushing means [](#consuming the pipeline) until the last frame.


## Off-Sync

**Off-Sync** an animation is when 2 animation in parallel don't start at the same position,
or when 2 animations in series don't follow each other due a change in the start position.  
Off-sync is accomplished by setting the `position` or `advance` parameter.  

## Oscillator

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

The oscillators shares the namespace with [](easings), allowing any easing function
to operate also as a oscillator.   
Since the main function of an oscillator is to return to its original position
at the end of the animation cycle, when an easing is used as an oscillator the
best is to use the following:  
```json
{ iterationCount: 2,
  direction: alternate
}
```

## Path

A **path** is an interpolator function where the input is the result of the
oscillator interpolator after the easing interpolator usually,
goes from [0, 1] and the output is an list of numbers,
representing the n-dimensions of a path.   
To reverse the direction path, set `value = -1` and `valueStart = 0`.   
To follow only a segment of the path, set both `value` and `valueStart`.   

Multi-dimension paths are mutual exclusive with textual `valueText`.   

Single-dimensions paths work similar to easings and oscillators.   
These paths use the easing to define the speed and the path
can create post-effects such as steps.   
The output of the a single-path value isn't stored in the Action Link, unlike
the oscillator.   

A multi-dimension path can be used in the following ways:  
- via `valueFormat`. Allows to encode that path in a single property.   
   Used in `text-shadow`, `transform`.   
- via dual-properties.   


## Scene

Represents a segment inside a [](#Story).   
Two scenes don't overlap, except during a [](#Scene Transition).   
Every scene, has its own animation pipeline, which is created by adding [](#Animations).   


## Scene Transition

Defines how will a [](#Scene) leave the story, and how the next scene will enter the story.   


## Remote rendering

Is the process of rendering images into the disk from a story that was created
in a different machine. Usually it's done via [](#teleporting).  


## Teleporting
<a name="teleporter"></a>
<a name="teleport"></a>

**Teleporting** is the process of splitting the story created in one machine
into its constituting pieces and then from this pieces,
recreate the story in a remote machine, in order to generate
the physical story frames images in this remote machine.  
