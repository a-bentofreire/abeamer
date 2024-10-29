---
title: Paths
group: Library
category: Pages
---
## Description
  
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
  
ABeamer has the following built-in dual-properties:  
  
- Interpolate the following CSS properties for DOM Elements:  
   * `left-top`.  
   * `right-top`.  
   * `left-bottom`.  
   * `right-bottom`.  
  
- Interpolate n parameters via `valueFormat`.  
 example:  
 ```json
{ selector: 'text-shadow',
  props: [{
    valueFormat: '%dpx %dpx 2px black',
    path: {
      handler: 'circle',
      params: {
         radius: 6px,
      },
    }
  }]
}
  
- Interpolate n-dimension paths for virtual elements.  
    Virtual Elements such as WebGL can use 3D paths to move their objects.  
  
## Core paths
**WARNING!** In the ABeamer 2.x these core paths will move `core-paths` plugin.  
To prevent breaking changes include now the js script `core-paths.js` on the html file.  
  
 ABeamer has the following core paths:  
 - `line`  
 - `rect`  
 - `circle`  
 - `ellipse`  
  
_see_: [gallery-path](/gallery/latest/#gallery-path).    
  
<div class=api-header>&nbsp;</div>
#API
## PathFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PathFunc = (t: number, params: PathParams, stage: uint,
    args?: ABeamerArgs) => number[];
```


Defines the type of a path function.  
A path function is an interpolator that usually runs from [0, 1].  
An path defines a movement in the n-space.

## PathHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PathHandler = PathName | string | ExprString | PathFunc;
```


Defines the path type, which is either string representing a predefined
path function or a custom function (see path function).  
The path function interpolates from [0, 1].

## PathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PathParams = AnyParams;
```


Defines the Base parameters for every path function.  
At the moment no parameter is required, but it can change in the future.

<div class=class-interface-header>&nbsp;</div>
## Path

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Path{ }
```

Path parameters defined in an Animation Property.
### Path.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Path](paths.md#path)]  
```js
handler: PathHandler;
```

Defines a Path by Name, Expression or Code Handler
### Path.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Path](paths.md#path)]  
```js
params?: FuncParams
    | LinePathParams
    | RectPathParams
    | CirclePathParams
    | EllipsePathParams;
```

Params passed to the Path. Depends on the Path Type
<div class=class-interface-header>&nbsp;</div>
## CenteredPathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface CenteredPathParams extends PathParams{ }
```

### CenteredPathParams.centerX

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CenteredPathParams](paths.md#centeredpathparams)]  
```js
centerX?: number | ExprString;
```

### CenteredPathParams.centerY

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CenteredPathParams](paths.md#centeredpathparams)]  
```js
centerY?: number | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## LinePathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface LinePathParams extends PathParams{ }
```

### LinePathParams.x0

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LinePathParams](paths.md#linepathparams)]  
```js
x0?: number | ExprString;
```

### LinePathParams.y0

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LinePathParams](paths.md#linepathparams)]  
```js
y0?: number | ExprString;
```

### LinePathParams.x1

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LinePathParams](paths.md#linepathparams)]  
```js
x1?: number | ExprString;
```

### LinePathParams.y1

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LinePathParams](paths.md#linepathparams)]  
```js
y1?: number | ExprString;
```

## RectPathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type RectPathParams = LinePathParams;
```

<div class=class-interface-header>&nbsp;</div>
## CirclePathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface CirclePathParams extends CenteredPathParams{ }
```

### CirclePathParams.radius

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CirclePathParams](paths.md#circlepathparams)]  
```js
radius?: number | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## EllipsePathParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface EllipsePathParams extends CenteredPathParams{ }
```

### EllipsePathParams.radiusX

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[EllipsePathParams](paths.md#ellipsepathparams)]  
```js
radiusX?: number | ExprString;
```

### EllipsePathParams.radiusY

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[EllipsePathParams](paths.md#ellipsepathparams)]  
```js
radiusY?: number | ExprString;
```
