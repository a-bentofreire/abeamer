---
title: Adapters
group: Library
category: Pages
---
## Description
  
An **adapter** allows ABeamer to decouple from DOM by serving as an agent
between the ABeamer library and elements and scenes.  
  
For DOM adapters, ABeamer uses `jQuery` to query DOM and
maps special properties such `text` and `html` to
`textContent` and `innerHTML`.  
  
DOM adapters map [DOM Properties](DOM Property) into either HtmlElement attributes
or CSS properties, depending on the Animation Property name.  
  
For HtmlElement attributes, the DOM Adapter uses `element.getAttribute`.  
For CSS Properties, it uses `element.style`, but if it's empty,
it retrieves all the computed CSS properties via `window.getComputedStyle`  
and caches its content.  
  
DOM Adapters use the attribute `data-abeamer-display` to define which
value will be used in `display` when visible is set to true.  
If it's not defined, it will be set to `inline` for `span` tags,
and `block` for all the other tags.  
  
'DOM Scenes' are typically a DIV. 'DOM Elements' can be any HtmlElement.  
  
'DOM Scenes' can provide Virtual Elements via ids starting with `%`,
and `story.onGetVirtualElement`.  
  
For Virtual adapters there is a direct connection to the Virtual Element
and Scene property.  
  
Unlike DOM elements which only provide textual values, Virtual Elements can
get and set numerical values.  
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## SimpleVirtualAnimator

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface SimpleVirtualAnimator{ }
```


It simplifies the usage of [VirtualAnimator](adapters.md#virtualanimator) by plugins.  
In many cases plugins just need to receive the changing property,
in order to modify its state.  
Override `animateProp` to receive the changing property.  
animateProp isn't called if the property is `uid`.

### SimpleVirtualAnimator.props

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
props: AnyParams;
```

### SimpleVirtualAnimator.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
selector: string;
```

### SimpleVirtualAnimator.propsChanged

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
propsChanged: boolean;
```

### SimpleVirtualAnimator.onAnimateProp

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
onAnimateProp: (name: PropName, value: PropValue) => void;
```

### SimpleVirtualAnimator.onAnimateProps

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
onAnimateProps: (args?: ABeamerArgs) => void;
```

### SimpleVirtualAnimator.animateProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
animateProp(name: PropName, value: PropValue): void;
```


Called after property value changed.  
Use this method instead animateProps, if the rendering should be right after
each property is updated, otherwise use animateProps.

### SimpleVirtualAnimator.animateProps()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
animateProps(args?: ABeamerArgs): void;
```


Called after actions from the frame are rendered, and if at least one property changed.  
Use this method instead animateProp, if the animation has multiple virtual properties and
each animation can be done after all are updated.

### SimpleVirtualAnimator.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
getProp(name: PropName): PropValue;
```

### SimpleVirtualAnimator.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
setProp(name: PropName, value: PropValue): void;
```

### SimpleVirtualAnimator.frameRendered()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
frameRendered(args?: ABeamerArgs);
```

<div class=class-interface-header>&nbsp;</div>
## AbstractAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AbstractAdapter{ }
```


Base class for all adapters: Element, Scene, Story,
and both DOM and virtual.

### AbstractAdapter.isVirtual

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AbstractAdapter](adapters.md#abstractadapter)]  
```js
isVirtual: boolean;
```

### AbstractAdapter.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[AbstractAdapter](adapters.md#abstractadapter)]  
```js
getProp(name: PropName, args?: ABeamerArgs): PropValue;
```

### AbstractAdapter.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[AbstractAdapter](adapters.md#abstractadapter)]  
```js
setProp(name: PropName, value: PropValue, args?: ABeamerArgs): void;
```

<div class=class-interface-header>&nbsp;</div>
## ElementAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ElementAdapter extends AbstractAdapter{ }
```


Base class for Element adapters both DOM and virtual.

### ElementAdapter.getId()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[ElementAdapter](adapters.md#elementadapter)]  
```js
getId(args?: ABeamerArgs): string;
```

<div class=class-interface-header>&nbsp;</div>
## DOMElementAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface DOMElementAdapter extends ElementAdapter{ }
```


DOM Element adapter.  
Gets and sets attributes from HTMLElements.  
Maps the ABeamer animation property names into DOM attributes.

### DOMElementAdapter.htmlElement

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DOMElementAdapter](adapters.md#domelementadapter)]  
```js
htmlElement: HTMLElement;
```

### DOMElementAdapter.compStyle

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DOMElementAdapter](adapters.md#domelementadapter)]  
```js
compStyle: CSSStyleDeclaration;
```

### DOMElementAdapter.getComputedStyle()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMElementAdapter](adapters.md#domelementadapter)]  
```js
getComputedStyle(): any;
```


Requests the DOM engine the calculated information for CSS property.

### DOMElementAdapter.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMElementAdapter](adapters.md#domelementadapter)]  
```js
getProp(propName: PropName, args?: ABeamerArgs): PropValue;
```

### DOMElementAdapter.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMElementAdapter](adapters.md#domelementadapter)]  
```js
setProp(propName: PropName, value: PropValue, args?: ABeamerArgs): void;
```

<div class=class-interface-header>&nbsp;</div>
## SceneAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface SceneAdapter extends AbstractAdapter{ }
```


Virtual Scene adapter.  
Allows ABeamer to decouple from the details of any virtual scene.

### SceneAdapter.query()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SceneAdapter](adapters.md#sceneadapter)]  
```js
query(selector: string,
      iterator: (element: PElement, index: uint) => void);
```

<div class=class-interface-header>&nbsp;</div>
## DOMSceneAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface DOMSceneAdapter extends SceneAdapter{ }
```


DOM Scene and Story adapter.  
Both of them are similar. No need for 2 separated classes.  
Gets and sets properties from HTMLElements.  
Maps the animation property names into DOM attributes.

### DOMSceneAdapter.htmlElement

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
htmlElement: HTMLElement;
```

### DOMSceneAdapter.compStyle

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
compStyle: CSSStyleDeclaration;
```

### DOMSceneAdapter.getComputedStyle()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
getComputedStyle(): any;
```


Requests the DOM engine the calculated information for CSS property.

### DOMSceneAdapter.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
getProp(propName: PropName, args?: ABeamerArgs): PropValue;
```

### DOMSceneAdapter.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
setProp(propName: PropName, value: PropValue, args?: ABeamerArgs): void;
```

### DOMSceneAdapter.query()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[DOMSceneAdapter](adapters.md#domsceneadapter)]  
```js
query(selector: string,
      iterator: (element: PElement, index: uint) => void): void;
```

## SpecialAdapterPropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type SpecialAdapterPropName =
    // modifies the textContent property.
    'text'
    // same as text. It's preferable to use 'text'.
    | 'textContent'

    // modifies the innerHTML attribute.
    | 'html'
    // same as html. It's preferable to use 'html'.
    | 'innerHTML'
    // modifies outerHTML attribute.
    | 'outerHTML'
    // changes the style.display CSS property for DOM Elements/Scenes.
    // Uses DOM attribute `data-abeamer-display`.
    | 'visible'
    // modifies the attribute `src`.
    | 'src'
    // modifies the `classList` if it has `+` or `-` if has it starts a class.
    // otherwise it sets `className`.
    | 'class';
```


Defines the special names for [Adapter properties](#Adapter property) names.

## DualPropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type DualPropName = 'width-height'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom';
```


**Dual properties** are properties that map one animation property into 2 [DOM properties](DOM properties).

## ElPropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ElPropName = string
    | 'id'
    | 'visible'
    | 'uid'
    | 'data-abeamer-display';
```


List of Property Names that a DOM or Virtual Element should support.

## ScenePropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ScenePropName = string
    | 'html'
    | 'left'
    | 'top'
    | 'width'
    | 'height'
    /** If this value is set, it will for `Visible=true` */
    | 'data-abeamer-display';
```


List of Property Names that a DOM or Virtual Scene should support.

## StoryPropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type StoryPropName = string
    | 'frame-width'
    | 'frame-height'
    /** clip-path is a set only. see CSS clip-story properties  */
    | 'clip-path'
    | 'fps';
```


List of Property Names that a DOM or Virtual Story should support.

## PropName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PropName = string
    | ElPropName
    | ScenePropName
    | StoryPropName
    | SpecialAdapterPropName
    | DualPropName;
```


Union of Property Names that a DOM or Virtual Adapter should support.

## PropValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PropValue = string | number | int | boolean;
```


Although, DOM only returns string values, a virtual Element can use
more rich data types.  
e.g. DOM adapter maps a boolean `visible` into CSS display.  
A virtual element can use directly booleans.

<div class=class-interface-header>&nbsp;</div>
## WaitFor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface WaitFor{ }
```

### WaitFor.prop

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WaitFor](adapters.md#waitfor)]  
```js
prop: PropName;
```

### WaitFor.value

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WaitFor](adapters.md#waitfor)]  
```js
value?: string | number;
```

### WaitFor.what

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WaitFor](adapters.md#waitfor)]  
```js
what?: WaitForWhat;
```

## WaitForList

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type WaitForList = WaitFor[];
```

<div class=class-interface-header>&nbsp;</div>
## VirtualElement

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface VirtualElement{ }
```


Base interface for virtual elements such as WebGL, Canvas or Task animator.

### VirtualElement.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[VirtualElement](adapters.md#virtualelement)]  
```js
getProp(name: PropName, args?: ABeamerArgs): PropValue;
```

### VirtualElement.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[VirtualElement](adapters.md#virtualelement)]  
```js
setProp(name: PropName, value: PropValue, args?: ABeamerArgs): void;
```

### VirtualElement.waitFor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[VirtualElement](adapters.md#virtualelement)]  
```js
waitFor?(waitFor: WaitFor, onDone: DoneFunc, args?: ABeamerArgs): void;
```

### VirtualElement.frameRendered

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[VirtualElement](adapters.md#virtualelement)]  
```js
frameRendered?(args?: ABeamerArgs): void;
```


Called after the frame is rendered, and before moves to the next frame.  
This method is called even if no property changed.  
It's an optional method, but future version might require its implementation.

## PElement

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type PElement = HTMLElement | VirtualElement;
```

<div class=class-interface-header>&nbsp;</div>
## VirtualAnimator

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface VirtualAnimator extends VirtualElement{ }
```


Used by plugin creators to allow their content to be animated.  
A plugin can animate canvas, WebGl, svg or reduce the complexity of a CSS animation.  
The story uses `uid` to manage animators.

### VirtualAnimator.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[VirtualAnimator](adapters.md#virtualanimator)]  
```js
selector: string;
```

<div class=class-interface-header>&nbsp;</div>
## SimpleVirtualAnimator

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-class">class</span>    
```js
export class SimpleVirtualAnimator implements VirtualAnimator{ }
```


It simplifies the usage of [VirtualAnimator](adapters.md#virtualanimator) by plugins.  
In many cases plugins just need to receive the changing property,
in order to modify its state.  
Override `animateProp` to receive the changing property.  
animateProp isn't called if the property is `uid`.

### SimpleVirtualAnimator.props

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
props: AnyParams = {};
```

### SimpleVirtualAnimator.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
selector: string;
```

### SimpleVirtualAnimator.propsChanged

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
propsChanged: boolean = false;
```

### SimpleVirtualAnimator.onAnimateProp

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
onAnimateProp: (name: PropName, value: PropValue) => void;
```

### SimpleVirtualAnimator.onAnimateProps

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
onAnimateProps: (args?: ABeamerArgs) => void;
```

### SimpleVirtualAnimator.animateProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
animateProp(name: PropName, value: PropValue): void;
```


Called after property value changed.  
Use this method instead animateProps, if the rendering should be right after
each property is updated, otherwise use animateProps.

### SimpleVirtualAnimator.animateProps()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
animateProps(args?: ABeamerArgs): void;
```


Called after actions from the frame are rendered, and if at least one property changed.  
Use this method instead animateProp, if the animation has multiple virtual properties and
each animation can be done after all are updated.

### SimpleVirtualAnimator.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
getProp(name: PropName): PropValue;
```

### SimpleVirtualAnimator.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
setProp(name: PropName, value: PropValue): void;
```

### SimpleVirtualAnimator.frameRendered()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[SimpleVirtualAnimator](adapters.md#simplevirtualanimator)]  
```js
frameRendered(args?: ABeamerArgs);
```

<div class=class-interface-header>&nbsp;</div>
## VirtualScene

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface VirtualScene{ }
```


Base interface for virtual scenes such as WebGL, Canvas.

### VirtualScene.getProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[VirtualScene](adapters.md#virtualscene)]  
```js
getProp(name: PropName, args?: ABeamerArgs): string;
```


Must support `id` and `visible` attributes.

### VirtualScene.setProp()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[VirtualScene](adapters.md#virtualscene)]  
```js
setProp(name: PropName, value: string, args?: ABeamerArgs): void;
```


Must support `visible` and `uid` attributes.

### VirtualScene.query()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[VirtualScene](adapters.md#virtualscene)]  
```js
query(selector: string,
      iterator: (element: PElement, index: uint) => void);
```


Must call iterator for each element represented on the selector.  
**param**: `selector` CSS style selectors

## SceneSelector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type SceneSelector = string | JQuery | VirtualScene;
```


Scene Selector defined by the user.

## ElSelector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ElSelector = JQuery
    // (DOM or virtual) selectors
    | string
    // list of (DOM or virtual) elements ids
    | string[]
    // list of html elements
    | HTMLElement[]
    // list of virtual elements
    | VirtualElement[]
    // An pEls containing elements
    | pEls;
```


Defines css selectors, JQuery, meta-selectors, and Virtual selectors.  
Virtual selectors start with `%`.

## ElSelectorFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ElSelectorFunc = (args?: ABeamerArgs) => ElSelector;
```


User defined function that return an Element Selector.  
Doesn't supports remote rendering.

## ElSelectorHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ElSelectorHandler = ElSelector | ElSelectorFunc;
```


Element Selector defined by the user.

<div class=class-interface-header>&nbsp;</div>
## Browser

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Browser{ }
```

### Browser.isMsIE

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Browser](adapters.md#browser)]  
```js
isMsIE: boolean;
```

### Browser.vendorPrefix

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Browser](adapters.md#browser)]  
```js
vendorPrefix: string;
```

### Browser.prefixedProps

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Browser](adapters.md#browser)]  
```js
prefixedProps: string[];
```
