---
title: Flyovers
group: Library
category: Pages
---
## Description
  
A **flyover** is a function executed for every frame during render process
with the main purpose of providing useful information or sync data.  
  
A flyover operates outside a scene animation pipeline, and can it
modify the content of one or more elements.  
  
ABeamer has following built-in flyovers:  
- `info`  
- `video-sync`.  
  
More flyovers can be added via `pluginManager.addFlyovers`.  
  
## Info flyover
  
A `info` flyover provides information regarding current time position and frame.  
  
_see_: [animate-flyovers](/gallery/latest/#animate-flyovers).  
  
### Example
css
```css
#flyover {
  left: 10px;
}
```  
html
```html
<div id="flyover" class="abeamer-flyover"></div>
```  
js
```js
story.addFlyover('info', {
   selector: '#flyover',
   format: 'story-frame: ${storyFrameNr}\nstory-time: ${storyElapsedS}',
});
```  
  
## Video Sync flyover
  
A `video-sync` flyover synchronizes the current render frame with a background video.  
  
**WARNING** Due Chrome 'autoplay-policy', it's not possible to 'safely' use Chrome to sync with videos,
In order to overcome this limitation:  
1. Use Firefox to test the animation with a background video.  
2. Set `serverRender: false` to prevent `abeamer render` from attempting to sync the video while server render.  
3. When using `abeamer movie`, set `--bkg-movie` parameter with the video filename to use a background video.  
  
_see_: [animate-video-sync](/gallery/latest/#animate-video-sync).  
  
### Example
css
```css
#flyover {
  left: 10px;
}
```  
html
```html
<video id=video width="385" height="288" src="assets/video.mp4" type="video/mp4">
```  
  
js
```js
story.addFlyover('video-sync', {
    selector: '#video',
    serverRender: false,
  });
```  
  
<div class=api-header>&nbsp;</div>
#API
<div class=class-interface-header>&nbsp;</div>
## InfoFlyoverParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface InfoFlyoverParams{ }
```

### InfoFlyoverParams.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[InfoFlyoverParams](flyovers.md#infoflyoverparams)]  
```js
selector?: ElSelector;
```


Element selector from the story, it can be DOM or virtual.  
_default_: `.info-flyover`  
### InfoFlyoverParams.format

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[InfoFlyoverParams](flyovers.md#infoflyoverparams)]  
```js
format?: string;
```


Text patterns supporting '${}' macros.  

Supported macros are:  

- `storyFrameNr` - current render frame within the story.  
- `storyElapsedS` - number of seconds elapsed within the story.  
- `storyElapsedMS` - number of milliseconds elapsed within the story.  
- `storyElapsedM` - number of minutes elapsed within the story.  
_example_: `story-frame: ${storyFrameNr} story-time: ${storyTime}`  
_default_: `${storyFrameNr}`  
### InfoFlyoverParams.maxPrecision

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[InfoFlyoverParams](flyovers.md#infoflyoverparams)]  
```js
maxPrecision?: int;
```


Maximum number of decimal digits for time macros.  
_default_: `: 4`  
<div class=class-interface-header>&nbsp;</div>
## VideoSyncFlyoverParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface VideoSyncFlyoverParams{ }
```

### VideoSyncFlyoverParams.selector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[VideoSyncFlyoverParams](flyovers.md#videosyncflyoverparams)]  
```js
selector?: ElSelector;
```


Element selector from the story, it can be DOM or virtual.  
_default_: `#video`  
### VideoSyncFlyoverParams.serverRender

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[VideoSyncFlyoverParams](flyovers.md#videosyncflyoverparams)]  
```js
serverRender: boolean;
```


If it's `false`, is disabled if `isServer = true`.  
_default_: `true`  
## FlyoverParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type FlyoverParams = AnyParams
    | InfoFlyoverParams
    | VideoSyncFlyoverParams;
```


Generic parameters passed to a flyover function.

## FlyoverFunc

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type FlyoverFunc = (wkFlyover: WorkFlyover, params: FlyoverParams,
    stage?: uint, args?: ABeamerArgs) => void;
```


Defines a function that is executed on every render step.  
Use it to render elements that scene independent.

<div class=class-interface-header>&nbsp;</div>
## WorkFlyover

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface WorkFlyover{ }
```

### WorkFlyover.name

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WorkFlyover](flyovers.md#workflyover)]  
```js
name: string;
```

### WorkFlyover.params

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[WorkFlyover](flyovers.md#workflyover)]  
```js
params: FlyoverParams;
```

## FlyoverHandler

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type FlyoverHandler = string | FlyoverFunc
    // Displays info about frames or time
    | 'info'
    // Synchronizes a video current time with the story current render frame
    | 'video-sync';
```


Flyover Name, Expression or Input Function defined by the user.  
in `story.addFlyover`.
