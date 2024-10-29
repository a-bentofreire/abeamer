---
title: Wrapper Tasks
group: Library
category: Pages
---
## Description
  
A wrapper task calls a story or scene method, allowing for a story
to be loaded from JSON file or to be [teleporter](teleporter.md).  
  
ABeamer has the following built-in wrapper tasks:  
  
- `scene-transition` - setup a scene transition.  
  
- `add-stills` - adds stills to the scene pipeline.  
  
- `add-flyover` - adds a flyover to the story.  
  
- `add-vars` - adds variables to be used by expressions.  
  
<div class=api-header>&nbsp;</div>
#API
## WrapperTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type WrapperTaskName =
    /** @see #SceneTransitionTaskParams */
    | 'scene-transition'
    /** @see #AddStillsTaskParams */
    | 'add-stills'
    /** @see #AddFlyoverTaskParams */
    | 'add-flyover'
    /** @see #AddVarsTaskParams */
    | 'add-vars';
```

## WrapperTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type WrapperTaskParams =
    | SceneTransitionTaskParams
    | AddStillsTaskParams
    | AddFlyoverTaskParams
    | AddVarsTaskParams;
```

<div class=class-interface-header>&nbsp;</div>
## SceneTransitionTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface SceneTransitionTaskParams extends AnyParams{ }
```

### SceneTransitionTaskParams.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SceneTransitionTaskParams](wrapper-tasks.md#scenetransitiontaskparams)]  
```js
handler?: TransitionHandler;
```

### SceneTransitionTaskParams.duration

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[SceneTransitionTaskParams](wrapper-tasks.md#scenetransitiontaskparams)]  
```js
duration?: TimeHandler;
```

<div class=class-interface-header>&nbsp;</div>
## AddStillsTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AddStillsTaskParams extends AnyParams{ }
```

### AddStillsTaskParams.duration

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddStillsTaskParams](wrapper-tasks.md#addstillstaskparams)]  
```js
duration: TimeHandler;
```

<div class=class-interface-header>&nbsp;</div>
## AddFlyoverTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AddFlyoverTaskParams extends AnyParams{ }
```

### AddFlyoverTaskParams.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddFlyoverTaskParams](wrapper-tasks.md#addflyovertaskparams)]  
```js
handler: FlyoverHandler;
```

### AddFlyoverTaskParams.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddFlyoverTaskParams](wrapper-tasks.md#addflyovertaskparams)]  
```js
params?: FlyoverParams;
```

<div class=class-interface-header>&nbsp;</div>
## AddVarsTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AddVarsTaskParams extends AnyParams{ }
```


Adds multiple variables to `args.vars`.  
Variables can be:  

- textual, numerical and arrays.  
- object variables of the above types.  

## Example

```typescript
tasks: [{
   handler: 'add-vars',
   params: {
     vars: {
       prop1: 'changes the args.vars.prop1',
       'obj1.prop2': 'creates an object obj1 in vars, set prop2',
       'over.about.blue': 'creates obj over.about.sets prop blue',
     },
   }
}]
```

### AddVarsTaskParams.overwrite

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddVarsTaskParams](wrapper-tasks.md#addvarstaskparams)]  
```js
overwrite?: boolean;
```


If false, it won't overwrite the previous value.  
_default_: `true`  
### AddVarsTaskParams.allowExpr

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddVarsTaskParams](wrapper-tasks.md#addvarstaskparams)]  
```js
allowExpr?: boolean;
```


If true and textual value starts with `=`, it will compute the expression.  
_default_: `false`  
### AddVarsTaskParams.vars

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AddVarsTaskParams](wrapper-tasks.md#addvarstaskparams)]  
```js
vars: { [varName: string]: string | ExprString | number | number[] };
```


Object with name: value of all the variables to add to `args.vars`.
