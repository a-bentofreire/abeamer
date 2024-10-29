---
title: Oscillators
group: Library
category: Pages
---
## Description
  
An **oscillator** is an optional interpolator that runs `t` from [easing(0), easing(1)]
and the usually outputs a value from [-1, 1] where usually
f(0) = 0 and f(1) = 0.  
Its output will be generate `v = valueStart + (value - valueStart) * oscillator(easing(t))`  
and then will be injected into a path as input.  
  
An oscillator has the following usages:  
  
1. A rotational movement, where the oscillator defines the rotation and
the easing the defines the speed.  
  
2. Flashing elements, where an element changes its `opacity` or `text-shadow`,
and these values oscillate between [0, 1].  
  
3. Uni-dimensional oscillators. Unlike oscillators, the oscillators have their value stored
in the Action Link, allowing to link the end value to the next animation.  
  
An oscillator if it's used together with an easing will if it's in the same dimension
deform the wave and if it's in different dimensions the easing will define
the speed of oscillator.  
  
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
  
One type of oscillators are `pulsars`.  
Pulsars only have energy during a certain amount of time,
the rest of the time are motionless.  
  
  
## Core oscillators
**WARNING!** In the ABeamer 2.x these core oscillators will move `core-oscillators` plugin.  
To prevent breaking changes include now the js script `core-oscillators.js` on the html file.  
  
 ABeamer has the following core oscillators:  
  
- `harmonic` - it generates a sinusoidal function that repeats it self every
duration / cycles.  
_see_: [animate-oscillator](/gallery/latest/#animate-oscillator).  
  
- `damped` - it's a sinusoidal function that reduces its amplitude due friction in
every cycle.  
To reduce the user's effort, ABeamer uses cycles parameter to compute the friction.  
  
- `pulsar` - outside the range of [midpoint - spread, midpoint + spread]
it will return 0, and inside the range will generate a function depending of
the parameter `type`:  
    * `normal` - a bell shape curve. this is the default type.  
    * `sine` - a sinusoidal function.  
    * `random` - a random value within [-1, 1].  
    * `positive-random` - a random value with [0, 1].  
_see_: [animate-pulsar](/gallery/latest/#animate-pulsar).    
  
<div class=api-header>&nbsp;</div>
#API
## OscillatorFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type OscillatorFunc = (t: number, params: OscillatorParams,
    args?: ABeamerArgs) => number;
```


Defines the type of a oscillator function.  
An oscillator function is an interpolator that runs from [0, 1].  
Usually outputs a value from [-1, 1] but other values are also possible.  
An oscillator is mostly used to rotate an element returning to the original position.

## OscillatorHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type OscillatorHandler = OscillatorName | number | ExprString
    | OscillatorFunc | EasingFunc;
```


Defines the oscillator type, which is either string representing a predefined
oscillator function or a custom function (see oscillator function)
The oscillator function interpolates from [0, 1].

## OscillatorParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type OscillatorParams = AnyParams;
```


Defines the Base parameters for every oscillator function.  
At the moment no parameter is required, but it can change in the future.

<div class=class-interface-header>&nbsp;</div>
## Oscillator

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Oscillator{ }
```

Oscillator parameters defined in an Animation Property.
### Oscillator.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Oscillator](oscillators.md#oscillator)]  
```js
handler: OscillatorHandler;
```

Defines an Oscillator by Name, Expression or Code Handler
### Oscillator.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Oscillator](oscillators.md#oscillator)]  
```js
params?: AnyParams
    | HarmonicOscillatorParams
    | DampedOscillatorParams
    | PulsarOscillatorParams;
```

Params passed to the Oscillator. Depends on the Oscillator Type
## NegativeFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type NegativeFunc = (t: number) => number;
```

Function used to define what to do when a value is negative.
<div class=class-interface-header>&nbsp;</div>
## HarmonicOscillatorParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface HarmonicOscillatorParams extends OscillatorParams{ }
```

Params defined inside the props.oscillator.params, when `props.oscillator = 'harmonic'`
### HarmonicOscillatorParams.cycles

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[HarmonicOscillatorParams](oscillators.md#harmonicoscillatorparams)]  
```js
cycles?: number;
```


Defines the number of full cycles (positive arc+negative arc)
contained during the `duration` period.  
If `negativeHander = abs`, 1 cycle will have 2 arcs.

### HarmonicOscillatorParams.negativeHander

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[HarmonicOscillatorParams](oscillators.md#harmonicoscillatorparams)]  
```js
negativeHander?: NegativeBuiltInFuncs | string | NegativeFunc;
```

Function used to define what to do when a value is negative.
### HarmonicOscillatorParams.shift

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[HarmonicOscillatorParams](oscillators.md#harmonicoscillatorparams)]  
```js
shift: number;
```

Allows to shift and scale the input of every oscillator.
<div class=class-interface-header>&nbsp;</div>
## DampedOscillatorParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface DampedOscillatorParams{ }
```

Params defined inside the props.oscillator.params, when `props.oscillator = 'damped'`
### DampedOscillatorParams.frequency

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DampedOscillatorParams](oscillators.md#dampedoscillatorparams)]  
```js
frequency?: number;
```

### DampedOscillatorParams.friction

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DampedOscillatorParams](oscillators.md#dampedoscillatorparams)]  
```js
friction?: number;
```

Defines how much energy the oscillator will lose from one cycle to the next.
### DampedOscillatorParams.negativeHander

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DampedOscillatorParams](oscillators.md#dampedoscillatorparams)]  
```js
negativeHander?: NegativeBuiltInFuncs | string | NegativeFunc;
```

Function used to define what to do when a value is negative.
<div class=class-interface-header>&nbsp;</div>
## PulsarOscillatorParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface PulsarOscillatorParams{ }
```

Params defined inside the props.oscillator.params, when `props.oscillator = 'pulsar'`
### PulsarOscillatorParams.type

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PulsarOscillatorParams](oscillators.md#pulsaroscillatorparams)]  
```js
type?: PulsarType | string;
```

Type of pulsar defined by ID or string.
### PulsarOscillatorParams.midpoint

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PulsarOscillatorParams](oscillators.md#pulsaroscillatorparams)]  
```js
midpoint?: number;
```

The point where the pulsar reaches it's maximum value.
### PulsarOscillatorParams.spread

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PulsarOscillatorParams](oscillators.md#pulsaroscillatorparams)]  
```js
spread?: number;
```


The amplitude around midpoint where the pulsar begins to receive value.  
The pulsar starts gaining energy at `midpoint-spread`, reaches the maximum value
at `midpoint` and then decreases until reaches zero at `midpoint+spread`.
