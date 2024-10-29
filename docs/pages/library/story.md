---
title: Story
group: Library
category: Pages
---
## Description
  
A **story** is the entry point of ABeamer web browser library.  
It has the following functions:  
  
- Manage multiple scenes, including insert and remove.  
- Manage scene transitions.  
- Manage flyovers.  
- Start the rendering process.  
- Communicate with the render server agent.  
- Load the complete story from a configuration file.  
  
The workflow summary is:  
  
- A story automatically creates DOM scenes.  
- In each scene, the user adds its animations.  
- The user executes `story.render` which will process the animation pipeline
frame by frame and sends it to the render server agent.  
- The render server agent will communicate with a headless server such as puppeteer
to store each frame on the disk.  
  
_see_: [workflow](workflow.md).    
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## WaitMan

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface WaitMan{ }
```

### WaitMan.funcs

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WaitMan](story.md#waitman)]  
```js
funcs: _WaitFunc[];
```

### WaitMan.pos

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WaitMan](story.md#waitman)]  
```js
pos: uint;
```

### WaitMan.addWaitFunc()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[WaitMan](story.md#waitman)]  
```js
addWaitFunc(func: WaitFunc, params: AnyParams): void;
```

<div class=class-interface-header>&nbsp;</div>
## Story

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface Story{ }
```


Implementation of _Story class.

### Story.fps

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly fps: uint;
```


Frames per second.  
All the time values is converted into frames using this value.  
Defined during the call to `createStory`.  


### Story.defaultUnit

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
defaultUnit: TimeUnit;
```


Default unit used when input time values are used in numeric forms.  
Supports minutes, seconds, milliseconds and frames.  
  `TimeUnit.f = 0;`  
  `TimeUnit.ms = 1;`  
  `TimeUnit.s = 2;`  
  `TimeUnit.m = 3;`

### Story.hasServer

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly hasServer: boolean;
```


True if it's running a supporting server program for frame storage.  


### Story.serverName

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly serverName: string;
```


The name of the server.  
The server will assign this property value.  


### Story.serverFeatures

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
serverFeatures: ServerFeatures;
```


Provides information about the running server.

### Story.metadata

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly metadata: StoryMetadata;
```


Numerical value of the frame width in pixels.  


### Story.width

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly width: uint;
```


Numerical value of the frame width in pixels.  


### Story.height

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly height: uint;
```


Numerical value of the frame height in pixels.  


### Story.frameCount

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly frameCount: uint;
```


Total number of frames from all the scenes.  


### Story.renderDir

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly renderDir: DirectionInt;
```


Render direction. 1 for forward, -1 for backwards.  
Defined during the call to `story.render`.  


### Story.renderFrameEnd

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly renderFrameEnd: uint;
```


The number of the last frame to be rendered within the story.  
Defined during the call to `story.render`.  
This value doesn't changes during the rendering process.  


### Story.renderFramePos

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly renderFramePos: uint;
```


The number of the current frame being rendered.  
Defined during the call to `story.render`.  
This value changes during the rendering process.  


### Story.renderFrameCount

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly renderFrameCount: uint;
```


The number of the current frame being rendered.  
Defined during the call to `story.render`.  
This value doesn't changes during the rendering process.  


### Story.isRendering

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly isRendering: boolean;
```


True if the rendering has started.  
Use `finishRender` to abort the rendering process.  


### Story.isTeleporting

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly isTeleporting: boolean;
```


True if it's teleporting.  


### Story.args

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly args: ABeamerArgs;
```


Returns ABeamerArgs.  
This should be used only in specific cases such the access to --var.  
In most cases, this property is passed as an argument to plugins and callbacks.  


### Story.strictMode

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
strictMode: boolean;
```

### Story.logLevel

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
logLevel: uint;
```

### Story.isVerbose

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
isVerbose: boolean;
```

### Story.scenes

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly scenes: Scene[];
```


List of the scenes.  


### Story.curScene

<span class="code-badge badge-readonly">readonly</span> <span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
readonly curScene: Scene | undefined;
```


Current active and visible scene.  
Valid both for adding animations and rendering.  
Use `gotoScene` to change this value.  


### Story.storyAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
storyAdapter: SceneAdapter;
```


Allows flyovers to find elements on the document body or
in the virtual world.

### Story.toExitOnRenderFinished

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
toExitOnRenderFinished: boolean;
```


If true, it terminates the server
when the render call finishes or if it's aborted.  
For a serverless execution, it has no effect.  
_default_: `true`  
### Story.onRenderFinished

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onRenderFinished?: (args?: ABeamerArgs) => void;
```


Event triggered when render finished the rendering process.  
**EXPERIMENTAL** The behavior can changed or be deprecated.

### Story.onServerReady

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onServerReady?: (args?: ABeamerArgs) => void;
```


Event triggered by server, stating that it's ready to receive frames.  
A server is usually a headless capture program such as puppeteer.  
If the animation is running without server, this event is never fired.

### Story.onBeforeRenderFrame

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onBeforeRenderFrame?: (args?: ABeamerArgs) => void;
```


Event triggered before a frame is rendered.

### Story.onAfterRenderFrame

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onAfterRenderFrame?: (args?: ABeamerArgs) => void;
```


Event triggered after a frame is rendered.

### Story.onNextFrame

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onNextFrame?: (args?: ABeamerArgs) => void;
```


Event triggered during the rendering process after a frame is rendered
and is ready to move to following frame.

### Story.onGetVirtualElement

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
onGetVirtualElement?: (id: string, args?: ABeamerArgs) => VirtualElement;
```


Maps Ids into Virtual Elements
Used only in non-DOM elements such as WebGL elements.  
**param**: `id` virtual element Id without '%'

### Story.virtualAnimators

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
virtualAnimators: VirtualAnimator[];
```


@deprecated Use addVirtualAnimator instead.  
The direct access to virtualAnimators in future versions will likely be disabled


### Story.addVirtualAnimator()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addVirtualAnimator(animator: VirtualAnimator): void;
```


Adds a [VirtualAnimator](adapters.md#virtualanimator) to the story.  
Use [story.removeVirtualAnimator](story.md#storyremovevirtualanimator) to take it from the story.

### Story.removeVirtualAnimator()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
removeVirtualAnimator(animator: VirtualAnimator): void;
```


Removes a [VirtualAnimator](adapters.md#virtualanimator) to the story.  
Use [story.addVirtualAnimator](story.md#storyaddvirtualanimator) to add it to the story.

### Story.addDefaultScenes()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addDefaultScenes(): void;
```


Adds scenes defined in the html by `.abeamer-scene` class.  
These classes are added automatically during Story constructor.  
Add only after a `story.reset()`.

### Story.addScene()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addScene(sceneSelector: SceneSelector): Scene;
```


Adds a scene to the story.  
HTML elements with abeamer-scene class are added automatically.  
**param**: `sceneSelector` DOM selector, JQuery object or Virtual Scene
**returns**: A pointer to newly created scene

### Story.removeScene()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
removeScene(scene: Scene): void;
```


Removes a frame from scene list and removes the its rendering pipeline
but its DOM elements aren't removed.

### Story.clear()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
clear(): void;
```


Rewinds the animation to the start.  
Deletes all the scenes and frames from the story.  
The DOM is left untouched.

### Story.addStoryAnimations()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addStoryAnimations(sceneSerialAnimes: Animations[][]): void;
```


Adds a list scene/serial/parallel animations.  
In essence, it represents the complete storyline.  
Use this method to load the whole storyline from an external file.  
Otherwise is preferable to add animation scene by scene.

### Story.addStoryAnimationsBySceneId()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addStoryAnimationsBySceneId(sceneSerialAnimes:
      { [sceneId: string]: Animation[][] }): void;
```


Adds a list of serial/parallel animations per scene Id.  
It requires that each scene has defined the id (DOM attribute).  
It bypasses invalid scene ids.

### Story.addFlyover()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
addFlyover(handler: FlyoverHandler, params?: FlyoverParams): void;
```


Adds a flyover, which is a function executed on every render step.  

_see_: [flyovers](flyovers.md).  

### Story.gotoScene()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
gotoScene(scene: Scene): void;
```


Changes the active and visible to a different scene.

### Story.findSceneByName()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
findSceneByName(sceneName: string): Scene;
```

### Story.rewind()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
rewind(): void;
```


Rewinds the animation to the start.

### Story.gotoFrame()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
gotoFrame(framePos: int): void;
```


Moves the current render Position when is not rendering by consuming the pipeline.  
Use this only if you need to compute parameters at certain position.  
When render starts

### Story.getStoryToTeleport()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
getStoryToTeleport(frameOpts?: RenderFrameOptions, isPretty?: boolean): string;
```


Returns the animations, html, CSS as an object.  
Use only if `isTeleporting = true`.  
Send this information via Ajax to the remote server.  
Due CORS, it requires a live server to access CSS information.  
Set frameOpts, if you need segment rendering.  
Set isPretty = true, to test only, since this mode will return a formatted output but bigger in size.

### Story.getStoryToTeleportAsConfig()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
getStoryToTeleportAsConfig(frameOpts?: RenderFrameOptions): StoryConfig;
```


Same as `getStoryToTeleport()` but it returns as `StoryConfig` object.  
Use this function instead of getStoryToTeleport, if you need to
add extra fields.  
Modifying the content of `config.abeamer` is forbidden for 3rd-party
remote server rendering.

### Story.teleport()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
teleport(frameOpts?: RenderFrameOptions, isPretty?: boolean);
```


Stores the complete story on a file in the disk.  
Use this method only for testing.  
This method requires that:  

1. Is on teleporting mode `isTeleporting === true`  
2. The render server agent. `abeamer render ...`  

Use this method instead of `getStoryToTeleport`.

### Story.startTeleporting()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
startTeleporting(): void;
```


Use this method only if you have created the story with `toTeleport = true`  
and `toStartTeleporting = false`, because you need to inject
html/css code into the page before the teleporting process starts.  
Otherwise, you won't need to call this method since it's called automatically
if teleporting a story.

### Story.bestPlaySpeed

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[Story](story.md#story)]  
```js
bestPlaySpeed: () => uint;
```


Returns the play speed that best matches the fps.

### Story.render()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
render(playSpeedMs?: uint | undefined, frameOpts?: RenderFrameOptions): void;
```


Starts the Rendering process.  
It can render the whole storyline or just a segment.  
Forward and backward rending is supported.  
If it has a server, such as headless webpage capture program, it will
render a frame, and send a message to the server to store it on the disk.  
If it's running on the browser, it will render and wait `playSpeedMs` time.  
**param**: `playSpeedMs` Play speed in milliseconds,
ignored on server mode. ABeamer doesn't guarantee the exact timing.  
If it's undefined, it will play at full speed.

### Story.finishRender()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
finishRender(): void;
```


Aborts the rendering process.

### Story.exit()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
exit(): void;
```


Terminates the server in case is a headless webpage capture program.  
In other cases, it has no effect.

### Story.logFrmt()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
logFrmt(tag: string, params: (string | number)[][], logType?: LogType): void;
```


Formats a log using a format supported by exact test framework.  
This is mostly used internally for testing, but it's publicly available.  
**param**: `params` list of [name, value]

### Story.logMsg()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
logMsg(msg: string): void;
```


If a server is present and supports logging,
it sends a log message to server otherwise it sends to the browser console.

### Story.logWarn()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
logWarn(msg: string): void;
```


If a server is present and supports logging,
it sends a warn message to server otherwise it sends to the browser console.

### Story.logError()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
logError(msg: string): void;
```


If a server is present and supports logging,
it sends a error message to server otherwise it sends to the browser console.

### Story.getElementAdapters()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[Story](story.md#story)]  
```js
getElementAdapters(selector: ElSelectorHandler): ElementAdapter[];
```

## DoneFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type DoneFunc = () => void;
```

## WaitFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type WaitFunc = (args: ABeamerArgs, params: AnyParams,
    onDone: DoneFunc) => void;
```

<div class=class-interface-header>&nbsp;</div>
## WaitMan

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface WaitMan{ }
```

### WaitMan.addWaitFunc()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-method">method</span>  [[WaitMan](story.md#waitman)]  
```js
addWaitFunc(func: WaitFunc, params: AnyParams): void;
```

## DirectionInt

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type DirectionInt = -1 | 1;
```

## LogType

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type LogType = 0 | 1 | 2;
```

## SceneHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type SceneHandler = Scene | uint | string;
```

Scene by Object, index or name
<div class=class-interface-header>&nbsp;</div>
## StoryConfig

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface StoryConfig{ }
```

### StoryConfig.config

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryConfig](story.md#storyconfig)]  
```js
config: {
      abeamer: any;
```

<div class=class-interface-header>&nbsp;</div>
## StoryMetadata

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface StoryMetadata{ }
```

### StoryMetadata.version

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
version?: string;
```

### StoryMetadata.author

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
author?: string;
```

### StoryMetadata.email

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
email?: string;
```

### StoryMetadata.copyrights

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
copyrights?: string;
```

### StoryMetadata.categories

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
categories?: string[];
```

### StoryMetadata.keywords

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
keywords?: string[];
```

### StoryMetadata.comments

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
comments?: string[];
```

### StoryMetadata.rating

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
rating?: uint;
```

### StoryMetadata.createdDateTime

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
createdDateTime?: string;
```

ISO DateTime stamp of the creation time.
### StoryMetadata.modifiedDateTime

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[StoryMetadata](story.md#storymetadata)]  
```js
modifiedDateTime?: string;
```

ISO DateTime stamp of the last modified time.
<div class=class-interface-header>&nbsp;</div>
## CreateStoryParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface CreateStoryParams{ }
```

Parameters passed to the story when it's created
### CreateStoryParams.dontAddDefaultScenes

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CreateStoryParams](story.md#createstoryparams)]  
```js
dontAddDefaultScenes?: boolean;
```

Adds automatically the default scenes.
### CreateStoryParams.toTeleport

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CreateStoryParams](story.md#createstoryparams)]  
```js
toTeleport?: boolean;
```

Defines if the story is going to be teleported.
### CreateStoryParams.toStartTeleporting

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CreateStoryParams](story.md#createstoryparams)]  
```js
toStartTeleporting?: boolean;
```


Set this parameter to false,
if you need to inject html/css code into the page before the teleporting
process starts.  
_default_: `true`  
### CreateStoryParams.storyAdapter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CreateStoryParams](story.md#createstoryparams)]  
```js
storyAdapter?: SceneAdapter;
```


Set this value, if you need use a Virtual Story Adapter inside of the
default DOM Adapter.

### CreateStoryParams.logLevel

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[CreateStoryParams](story.md#createstoryparams)]  
```js
logLevel?: uint;
```


Defines the log level. Use `LL_VERBOSE` for debugging.  
The server can modify this mode.  
Set this parameter to log during the constructor phase,
otherwise is also possible to set later via `story.logLevel`.

<div class=class-interface-header>&nbsp;</div>
## RenderFrameOptions

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface RenderFrameOptions{ }
```


ABeamer still has to render all the previous frames
of active scene bypassing the middle frames,
but it won't be render to disk and it will bypass any unnecessary frames.

### RenderFrameOptions.renderPos

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RenderFrameOptions](story.md#renderframeoptions)]  
```js
renderPos?: TimeHandler;
```


First render frame.  
If `startScene` isn't defined it will be relative to the story, otherwise is
relative to the `startScene`.  
_default_: `0`  
### RenderFrameOptions.renderCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RenderFrameOptions](story.md#renderframeoptions)]  
```js
renderCount?: TimeHandler;
```


Total number of frames to render.  

**EXPERIMENTAL** Use a negative value to render backwards.  
For backward rendering, ABeamer first has to consume all the frames forward,
bypassing all middle frames, only after can render backwards.  
_default_: `the total number of frames`  
### RenderFrameOptions.startScene

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RenderFrameOptions](story.md#renderframeoptions)]  
```js
startScene?: SceneHandler;
```


First scene to be rendered.  
Before start rendering the `startScene`, first,
ABeamer first has to consume all the frames until it reaches the
beginning of Scene.  
Accepts by 'Scene Zero-Based Index', 'Name' or by 'Scene Object'

### RenderFrameOptions.endScene

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[RenderFrameOptions](story.md#renderframeoptions)]  
```js
endScene?: SceneHandler;
```


Last scene to be rendered.  
Accepts by 'Scene Zero-Based Index', 'Name' or by 'Scene Object'.

## createStory()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function createStory(fps?: uint,
    createParams?: CreateStoryParams): Story;
```


Creates a story. Loading parameters from style data.  
`fps` property can also be defined on `body.data-fps` or config file.  

_see_: [config-file](config-file.md).  

## createStoryFromConfig()

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-function">function</span>    
```js
export function createStoryFromConfig(
    cfgUrl: string,
    callback: (story: Story) => void,
    fps?: uint,
    createParams?: CreateStoryParams): void;
```


Creates a story by loading the configuration from a file or a teleported story.  

_see_: [config-file](config-file.md).  
