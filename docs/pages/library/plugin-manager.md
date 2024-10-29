---
title: Plugin Manager
group: Library
category: Pages
---
  
## Description
  
A **plugin** is a 3rd-party extension which provides a set of functionalities,
allowing to extend the ecosystem to the already rich set of built-in functionalities.  
  
Plugins creators who wish to create a plugin to support [teleporter](teleporter.md), must:  
  
- Declare the plugin via `pluginManager.addPlugin`.  
- Set the `pluginInfo.teleportable = true`.  
- Follow the [Developer Guideline Rules](../../../../../developer/dev-docs/coding-style).  
  
ABeamer allows plugins to add the following functionality types:  
  
- [easings](easings.md)
- [oscillators](roadmap.md#oscillators)
- [paths](roadmap.md#paths)
- [tasks](tasks.md)
- [transitions](transitions.md)
- [flyovers](flyovers.md)
- [functions](roadmap.md#functions)
- [i18n](i18n.md)
  
To add a functionality use: `pluginManager.add<functionality-type>`.  
  
In most cases, a functionality is a function that receives a set of parameters
followed by `args?:ABeamerArgs`.  
This last parameter will provide information regarding the state of the system.  
  
Plugins should try to be independent of DOM in order to work
with virtual elements such as WebGL and canvas. However, in some cases is
required to work with DOM only.  
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## PluginManager

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface PluginManager{ }
```


Allows 3rd-party to add easings, oscillators, paths, etc.

### PluginManager.addPlugin()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addPlugin(pluginInfo: PluginInfo): void;
```

### PluginManager.addEasings()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addEasings(easings: [string, EasingFunc][]): void;
```

### PluginManager.addOscillators()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addOscillators(oscillators: [string, OscillatorFunc][]): void;
```

### PluginManager.addPaths()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addPaths(paths: [string, PathFunc][]): void;
```

### PluginManager.addTasks()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addTasks(tasks: [string, TaskFunc][]): void;
```

### PluginManager.addTransitions()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addTransitions(transitions: [string, TransitionFunc][]): void;
```

### PluginManager.addFlyovers()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addFlyovers(flyovers: [string, FlyoverFunc][]): void;
```

### PluginManager.addFunctions()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addFunctions(functions: [string, ExFunction][]): void;
```

### PluginManager.addLocalization()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[PluginManager](plugin-manager.md#pluginmanager)]  
```js
addLocalization(localeInfo: Localization): void;
```

<div class=class-interface-header>&nbsp;</div>
## AnyParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AnyParams { [key: string]: any;{ }
```

<div class=class-interface-header>&nbsp;</div>
## AnyParams.ABeamerArgs

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>  [[AnyParams](plugin-manager.md#anyparams)]  
```js
export interface ABeamerArgs{ }
```

### ABeamerArgs.story

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
story?: Story;
```

### ABeamerArgs.scene

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
scene?: Scene;
```

### ABeamerArgs.stage

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
stage?: uint;
```

### ABeamerArgs.renderNr

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
renderNr?: uint;
```

Every time, the render is executed this value is incremented.
### ABeamerArgs.user

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
user?: AnyParams;
```

### ABeamerArgs.waitMan

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
waitMan?: WaitMan;
```

### ABeamerArgs.isVerbose

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
isVerbose?: boolean;
```

If true, the internal code or plugin should dump information using `story.logFrmt`.
### ABeamerArgs.hasServer

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
hasServer?: boolean;
```


True if it's running a supporting server program for frame storage.  



### ABeamerArgs.isTeleporting

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
isTeleporting?: boolean;
```

### ABeamerArgs.isStrict

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
isStrict?: boolean;
```

If true, perform type checks and other restriction checks.
### ABeamerArgs.vars

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ABeamerArgs](ABeamerArgs)]  
```js
vars: Vars;
```

<div class=class-interface-header>&nbsp;</div>
## PluginInfo

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface PluginInfo{ }
```


Information required by each plugin creator about its own plug-in.

### PluginInfo.id

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
id: string;
```

### PluginInfo.uuid

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
uuid: string;
```

### PluginInfo.author

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
author: string;
```

### PluginInfo.email

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
email: string;
```

### PluginInfo.copyrights

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
copyrights?: string;
```

### PluginInfo.jsUrls

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
jsUrls?: string[];
```

### PluginInfo.cssUrls

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
cssUrls?: string[];
```

### PluginInfo.assetsUrls

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
assetsUrls?: string[];
```

### PluginInfo.telemetricUrl

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
telemetricUrl?: string[];
```

### PluginInfo.teleportable

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PluginInfo](plugin-manager.md#plugininfo)]  
```js
teleportable: boolean;
```
