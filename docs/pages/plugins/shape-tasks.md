---
title: Shape Tasks
group: Plugins
category: Pages
---
## Description
  
A **shape task** creates a configurable shape by creating a `svg` tag.  
  
This plugin has the following built-in shapes:  
  
- `rectangle` - rectangle shape including round rectangle via cx,cy fields.  
- `line` - x,y and directional shape.  
- `circle`  
- `speech` - round rectangle with left and right speech triangle.  
  
<div class=api-header>&nbsp;</div>
#API
## ShapeTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ShapeTaskName = 'shape';
```

## ShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ShapeTaskParams =
    | RectangleShapeTaskParams
    | LineShapeTaskParams
    | CircleShapeTaskParams
    | SpeechShapeTaskParams;
```

<div class=class-interface-header>&nbsp;</div>
## BaseShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface BaseShapeTaskParams extends AnyParams{ }
```

### BaseShapeTaskParams.shape

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseShapeTaskParams](shape-tasks.md#baseshapetaskparams)]  
```js
shape?: Shapes | string;
```

### BaseShapeTaskParams.stroke

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseShapeTaskParams](shape-tasks.md#baseshapetaskparams)]  
```js
stroke?: string;
```

### BaseShapeTaskParams.strokeWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseShapeTaskParams](shape-tasks.md#baseshapetaskparams)]  
```js
strokeWidth?: uint | ExprString;
```

### BaseShapeTaskParams.fill

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseShapeTaskParams](shape-tasks.md#baseshapetaskparams)]  
```js
fill?: string;
```

<div class=class-interface-header>&nbsp;</div>
## RectangleShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface RectangleShapeTaskParams extends BaseShapeTaskParams{ }
```

### RectangleShapeTaskParams.width

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RectangleShapeTaskParams](shape-tasks.md#rectangleshapetaskparams)]  
```js
width?: uint | ExprString;
```

### RectangleShapeTaskParams.height

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RectangleShapeTaskParams](shape-tasks.md#rectangleshapetaskparams)]  
```js
height?: uint | ExprString;
```

### RectangleShapeTaskParams.rx

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RectangleShapeTaskParams](shape-tasks.md#rectangleshapetaskparams)]  
```js
rx?: uint | ExprString;
```

### RectangleShapeTaskParams.ry

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RectangleShapeTaskParams](shape-tasks.md#rectangleshapetaskparams)]  
```js
ry?: uint | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## LineShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface LineShapeTaskParams extends BaseShapeTaskParams{ }
```

### LineShapeTaskParams.x

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LineShapeTaskParams](shape-tasks.md#lineshapetaskparams)]  
```js
x?: int | ExprString;
```

### LineShapeTaskParams.y

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LineShapeTaskParams](shape-tasks.md#lineshapetaskparams)]  
```js
y?: int | ExprString;
```

### LineShapeTaskParams.direction

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LineShapeTaskParams](shape-tasks.md#lineshapetaskparams)]  
```js
direction?: number | ExprString;
```

### LineShapeTaskParams.length

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[LineShapeTaskParams](shape-tasks.md#lineshapetaskparams)]  
```js
length?: number | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## CircleShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface CircleShapeTaskParams extends BaseShapeTaskParams{ }
```

### CircleShapeTaskParams.radius

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CircleShapeTaskParams](shape-tasks.md#circleshapetaskparams)]  
```js
radius?: number | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## SpeechShapeTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface SpeechShapeTaskParams extends RectangleShapeTaskParams{ }
```

### SpeechShapeTaskParams.speechPosition

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SpeechShapeTaskParams](shape-tasks.md#speechshapetaskparams)]  
```js
speechPosition?: SpeechPosition | string;
```

### SpeechShapeTaskParams.speechStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SpeechShapeTaskParams](shape-tasks.md#speechshapetaskparams)]  
```js
speechStart?: uint;
```

### SpeechShapeTaskParams.speechWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SpeechShapeTaskParams](shape-tasks.md#speechshapetaskparams)]  
```js
speechWidth?: uint;
```

### SpeechShapeTaskParams.speechHeight

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SpeechShapeTaskParams](shape-tasks.md#speechshapetaskparams)]  
```js
speechHeight?: uint;
```

### SpeechShapeTaskParams.speechShift

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SpeechShapeTaskParams](shape-tasks.md#speechshapetaskparams)]  
```js
speechShift?: int;
```
