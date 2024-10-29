---
title: Attack Tasks
group: Plugins
category: Pages
---
## Description
  
An **attack** is a quick and strong distortion of reality, created
with the purpose of grabbing the user attention or to process the visual
sensation as an attack by an exterior force.  
Attacks can be done by changing quickly colors, texts, images and dimensions.  
  
This plugin has the following built-in attack tasks:  
  
- `color-attack` - produces a change in colors, returning to the original color at the end.  
  
<div class=api-header>&nbsp;</div>
#API
## AttackTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type AttackTaskName =
    /** @see #ColorAttackTaskParams */
    | 'color-attack';
```

## AttackTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type AttackTaskParams =
    ColorAttackTaskParams;
```

<div class=class-interface-header>&nbsp;</div>
## ColorAttackTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ColorAttackTaskParams extends AnyParams{ }
```

### ColorAttackTaskParams.attack

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ColorAttackTaskParams](attack-tasks.md#colorattacktaskparams)]  
```js
attack: string[];
```

List of colors to attack the original color.
### ColorAttackTaskParams.prop

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ColorAttackTaskParams](attack-tasks.md#colorattacktaskparams)]  
```js
prop?: string;
```


Property Name.  
_default_: `: 'color'`  
### ColorAttackTaskParams.cycles

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ColorAttackTaskParams](attack-tasks.md#colorattacktaskparams)]  
```js
cycles?: uint | ExprString;
```


Number of times it will attack the color before returning to the original.  
Expressions are supported.

### ColorAttackTaskParams.endColor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ColorAttackTaskParams](attack-tasks.md#colorattacktaskparams)]  
```js
endColor?: string;
```

Color to end the attack. If undefined, it uses the original color.