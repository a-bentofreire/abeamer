---
title: Tasks
group: Library
category: Pages
---
## Description
  
A **task** is a function executed at the beginning of `addAnimations`,
before selector and properties information is processed,
and has the following goals:  
  
- *Setup*: A setup allows to prepare elements for further processing.  
    An example is text splitting. text splitting prepares DOM for individual
    character manipulation.  
    Setup tasks can stop the processing of a `addAnimations`, and might not
    require a selector..  
  
- *Wrapping*: Only `addAnimations` can be stored in a JSON file or sent
    for remote rendering. In this case, methods such as `addStills` and scene transitions
    need to be wrapped in a task.  
    Wrapping tasks can stop the processing of a `addAnimations`, and might not
    require a selector.  
  
- *Asset creation*: A task can create an asset avoiding the need of loading external
    assets such as svg shape files.  
  
- *Complex animations*: A task can simplify the creation of a complex animation.  
  
## F/X
  
If you just want to do a single-shot animation, use `scene.addAnimations`,
but if you want to reuse the animation or want to break down the complexity
into multiple parts, the best is to create a task.  
  
A task implementation is a function with the following syntax:  
```typescript
function myTaskFunc(anime: Animation, wkTask: WorkTask,
  params: FactoryTaskParams, stage?: uint, args?: ABeamerArgs): TaskResult;
```  
And add this task to ABeamer using `ABeamer.pluginManager.addTasks([['my-task', myTaskFunc]]);`.  
  
If the task just uses plain DOM, the simplest is to:  
- inject DOM by using the animation `selector`, and then
```typescript
switch (stage) {
   case TS_INIT:  
     const adapters = args.scene.getElementAdapters(anime.selector);
     elAdapters.forEach((elAdapter, elIndex) => {
       const html = elAdapter.getProp('html', args);
       const myPiece = '<div>Hello</div>';
       elAdapter.setProp('html', html + myPiece, args);
     });
}
```  
  
- inject animation properties into the pipeline by:  
```typescript
switch (stage) {
   case TS_INIT:  
     anime.props.push({ prop: 'text', value: ['hello'] });
}
```  
  
<div class=api-header>&nbsp;</div>
#API
## TaskResult

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TaskResult = 0 | 1 | 2;
```

## TaskFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TaskFunc = (anime: Animation, wkTask: WorkTask,
    params?: AnyParams, stage?: uint, args?: ABeamerArgs) => TaskResult;
```

## TaskHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TaskHandler = TaskName | TaskFunc;
```

## TaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TaskName = string
    | GeneralTaskName
    | TextTaskName
    | ShapeTaskName
    | AttackTaskName;
```

## TaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type TaskParams = AnyParams
    | GeneralTaskParams
    | TextTaskParams
    | ShapeTaskParams
    | AttackTaskParams;
```

<div class=class-interface-header>&nbsp;</div>
## Task

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Task{ }
```


Parameters provided by the user during an `addAnimation`.

### Task.handler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Task](tasks.md#task)]  
```js
handler: TaskHandler;
```

Task Name, Expression or Input Function defined by the user.
### Task.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Task](tasks.md#task)]  
```js
params?: TaskParams;
```

Parameters passed to the task function
<div class=class-interface-header>&nbsp;</div>
## WorkTask

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface WorkTask{ }
```


Parameters passed to a task during the execution.

### WorkTask.name

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WorkTask](tasks.md#worktask)]  
```js
name: string;
```

### WorkTask.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WorkTask](tasks.md#worktask)]  
```js
params: TaskParams;
```

### WorkTask.animeIndex

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WorkTask](tasks.md#worktask)]  
```js
animeIndex: uint;
```

## GeneralTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type GeneralTaskName =
    /** @see TaskFactoryParams */
    | 'factory';
```

## GeneralTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type GeneralTaskParams =
    | FactoryTaskParams;
```

## FactoryTaskAttr

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type FactoryTaskAttr = string | ExprString | number | string[] | number[];
```

<div class=class-interface-header>&nbsp;</div>
## FactoryTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface FactoryTaskParams extends AnyParams{ }
```

### FactoryTaskParams.count

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[FactoryTaskParams](tasks.md#factorytaskparams)]  
```js
count: uint | ExprString;
```

### FactoryTaskParams.tag

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[FactoryTaskParams](tasks.md#factorytaskparams)]  
```js
tag?: string;
```

### FactoryTaskParams.content

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[FactoryTaskParams](tasks.md#factorytaskparams)]  
```js
content?: FactoryTaskAttr;
```

### FactoryTaskParams.isContentFormatted

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[FactoryTaskParams](tasks.md#factorytaskparams)]  
```js
isContentFormatted?: boolean;
```

### FactoryTaskParams.attrs

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[FactoryTaskParams](tasks.md#factorytaskparams)]  
```js
attrs?: {
      name: string;
```
