## Description
![Target](https://raw.githubusercontent.com/a-bentofreire/abeamer/master/docs/badges/developer-badge.gif)![Target](https://raw.githubusercontent.com/a-bentofreire/abeamer/master/docs/badges/v-0.2.8.gif)  
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-abeamer/story-frames/story.gif)  
  
**ABeamer** is a powerful animation EcoSystem, designed to create an animated story 
in the web browser and generate the file images of each frame in either a local machine or in the cloud.  
  
Unlike `VelocityJs` and `JQuery.animate` which were built for real-time user interaction, 
ABeamer allows you to build complex frame based animations and save them frame-by-frame 
with transparency at high resolution and lossless compression without frame drop.  
  
When an animated story is designed to be rendered in the cloud, 
no software is required to install on the local machine,
allowing video hosting services, ad network, e-commerce companies 
many other businesses to provide a tool for their users to add text, images, 
and special effects to their images or videos by just using the web browser 
and then [teleport](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/teleporter/) 
the story to the company's machine to render the frame images and generate animated gifs or videos.  

## Components

ABeamer includes a web browser library, a server agent and a command line utility.  
For the ABeamer Animation Editor, read [Animation Editor](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/animation-editor/).
  
- ABeamer **web browser library** is a highly extensible TypeScript/JavaScript 
bundled with a rich [toolset](#toolset) reducing the time to build complex animations.  
- ABeamer **server agent** is designed to communicate with a render server, usually a headless web browser, in order to save 
each frame to the disk. It can run either with the full potential supporting [Code Handlers](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/glossary/#code-handler) 
or in a sanitized environment allowing you to safely to render animations created by other users.  
- ABeamer **command line utility** allows you to build new projects, 
render frames, create animated gifs or movies.  

Read the [requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies in the local machine.  

## Donate
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-support/story-frames/story.gif)  
  
To build this project, and take it to the next level with the creation of the [Animation Editor](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/animation-editor/), it requires a full-time developer, 
please, consider donating to keep this project
alive and help to tell your story or to grow your business:  

* ![Image](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/paypal.png) [paypal](https://www.paypal.me/abentofreire) 
* ![Image](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/bitcoin.png) Bitcoin: `1mH89kWbvffActY7FAke26t2fbJE9U6jv`
* Add a star to the [main repo](https://github.com/a-bentofreire/abeamer).

## Features

* Free and Open-source.
* Simple and intuitive design.
* Supports rendering in the cloud in a sanitized environment.
* Extensively documented: [End-User Documentation](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/) and
 [Developer Documentation](https://a-bentofreire.github.io/abeamer-docs/developer/versions/latest/en/site/).
* Absolutely minimum [dependencies](#requirements).
* Highly Extensible via [plugins](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/plugin-manager/) including [interpolators](#interpolators), functions, flyovers and tasks.
* [Tasks](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/tasks/) to build complex animations 
and [F/X](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/tasks/special-effects).
* Large gallery of [example projects](https://github.com/a-bentofreire/abeamer-gallery-release/).
* Multiple scenes (only default scenes are teleportable).
* Scene transitions.
* [Expressions](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/expressions/), functions and variables.
* Parallel and [off-sync](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/glossary/#off-sync) property animations.
* Teleportable [JQuery-like containers](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/pels/).
* Teleportable [flyovers](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/flyovers/).
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-rec-high-res/story-frames/story.gif)  
  
* Saves frame-by-frame into a file sequence with transparency and at high resolution.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-with-less/story-frames/story.gif)  
  
* Optional support for SCSS, LESS and TypeScript.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-virtual/story-frames/story.gif)  
  
* DOM and Virtual Elements and Scenes.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-localization/story-frames/story.gif)  
  
* Localization of messages and plugin functionalities, including functions and variables.

# Property Animation

ABeamer has a complex system that allows to interpolate pixels, numbers,
text, colors and much more.
ABeamer guesses the starting value and property type from CSS style information,
or if that information is given via `valueStart`.
* General CSS properties:   
e.g  `prop: 'border-style'; valueText: ['dotted', 'dashed']`.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-pixels/story-frames/story.gif)  
  
* Pixel properties.  
 e.g. `valueStart: 10px; value: 100;`
* Dual-pixel properties via [paths](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/paths/).
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-colors/story-frames/story.gif)  
  
* Color properties.  
e.g. `valueText: ['red', '#FF00AA'];`
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-counter/story-frames/story.gif)  
  
* Formatted numerical properties.  
e.g. `valueFormat: '%d%'; value: 100;`
* Unformatted numerical properties.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-images/story-frames/story.gif)  
  
* Image properties.  
e.g. `prop: 'src'; valueText: ['a.png', 'b.png'];`
* Text properties.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-class-prop/story-frames/story.gif)  
  
* `class` property.  
e.g. `prop: 'class'; valueText: ['+class1 -class2'];`
* `visible` property.  
e.g. `prop: 'visible'; duration: 1; value: 1;`
* `transform` property:  
e.g. `prop: 'transform'; valueFormat: 'rotateX(%fdeg)'`;

## CSS Animations
ABeamer doesn't supports CSS animations, but ABeamer was designed in a way that 
its animations are similar to CSS animations, therefore it's easy to convert CSS Animations 
to ABeamer animations.  
Besides the property interpolation described above, ABeamer also supports:
   
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-item-delay/story-frames/story.gif)  
  
* Item-delay with `disturbance` to produce random effects.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-loop/story-frames/story.gif)  
  
* CSS animation-iteration-count.

## Interpolators

ABeamer provides several interpolators, which can be defined by:

- Teleportable Built-in interpolators. Accessible by name and ID.
- Teleportable [Expressions](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/expressions/).
- [Plugins](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/plugin-manager/). Only official plugins can be teleportable.
- [Code Handlers](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/glossary/#code-handler) due security reasons aren't teleportable.

ABeamer has following interpolators:

  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-easings/story-frames/story.gif)  
  
- Easings - The speed of motion.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-oscillator/story-frames/story.gif)  
  
* `harmonic` and `damped` oscillators - Rotation and Balancing motion.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-pulsar/story-frames/story.gif)  
  
* `pulsar` oscillator.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-paths/story-frames/story.gif)  
  
* Paths - n-dimension motion.

The interpolators are chained in the following order: easing→oscillator→path.

## Toolset

ABeamer has a rich toolset. Extensibility and teleportation are the key features of these tools.  
Unless is noticed, all the built-in tools support teleportation.  
Just like in the case of interpolators, Code Handlers aren't teleported, and the tools can be extended via plugins but only official plugins are teleportable.  

ABeamer has the following tools:
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-transitions/story-frames/story.gif)  
  
* Scene transitions.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-flyovers/story-frames/story.gif)  
  
* `info` flyover.
  
[![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-video-sync/story-frames/../assets/a-bentofreire/snapshot.jpg)](https://a-bentofreire.github.io/abeamer-gallery-release/animate-video-sync/story-frames/../assets/a-bentofreire/view-video.html)  
  
* `video-sync` flyover [[1]](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/flyovers/#video-sync-flyover).
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-wrappers/story-frames/story.gif)  
  
* Wrappers.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-text-tasks/story-frames/story.gif)  
  
* Text tasks:
   * `text-split` task.
   * `typewriter` task.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-factory/story-frames/story.gif)  
  
* `factory` task.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-decipher-text/story-frames/story.gif)  
  
* `decipher` task.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-attack-task/story-frames/story.gif)  
  
* `color-attack` task.
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-shapes/story-frames/story.gif)  
  
* `shape` task.

![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-speech/story-frames/story.gif)  
  
* `speech` shape task.

and much more [coming soon](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/roadmap/).

## Installation

To create animations, It's only required to have the `web browser library` without the need of any software installed in the computer.  

`[sudo] npm install -g abeamer`  

However, in order to render frames, generate gifs and movies, it requires:
1. [nodejs](https://nodejs.org/en/).
2. To render, it requires a render server [puppeteer](https://www.npmjs.com/package/puppeteer) `npm install -g puppeteer`.
3. To generate gifs, it requires to have [imagemagick](https://www.imagemagick.org) on system path.
4. To create movies, it requires to have [ffmpeg](https://www.ffmpeg.org/) on the system path.

## Playground

Try these examples online without any installation:

- [Hello world](https://jsfiddle.net/abentofreire/peax4f9n/)
- [Image Overlays](https://jsfiddle.net/abentofreire/dj9m7ztf/12/)
- [E-Commerce](https://jsfiddle.net/abentofreire/dkztn53o/)

## Getting started

Start by creating a new project using the ABeamer command line utility:  
  
`abeamer create myproject`

ABeamer web browser library root is `ABeamer.Story`.  
When you create a story, you define an immutable number of frames per second,  
and all animations are interpolated based on that `fps`.  
  
on file `js/main.ts`:  
``` javascript
  var story = ABeamer.createStory(25); // creates a story with 25 fps
```
  
The `story` holds a collection of Scenes.  
Only one scene can be visible at a given moment in time except during the transition between two scenes.   
It represents the natural concept of a scene in a storyline.  
By using Scenes, ABeamer can speed up the processing speed by reducing the global amount of calculations.   

The bare-bones of a `html` file:   
```html
  <div class="abeamer-story" id=story>
      <div class=abeamer-scene id=scene1>
           <p id="hello">Hello world</p>
      </div>
  </div>
```
  
The bare-bones of a `scss` file:   
```scss
@import "./../abeamer.ini";
body,
html,
.abeamer-story,
.abeamer-scene {
  width: $abeamer-width + px;
  height: $abeamer-height + px;
}
```
  
Html Elements with `abeamer-scene` class are added automatically.  
Scenes can be added manually with the following code:  
```javascript
 var newScene = story.AddScene();
```

Creating scenes with `abeamer-scene` class is the preferable way.  
You add animations to the scene defining the time in 'seconds', 'milliseconds' or 'frames' 
but if it's defined in time, these are converted to frames based on the story fps.

```javascript
  scene1.addAnimations(
    [{
      selector: '#hello',  // dom or JQuery selector
      duration: '4s', // at 25fps, the duration is 100 frames
      props: [
        {
          prop: 'left',  // property, text, url to animate
          easing: 'easeOutQuad', // easing
          value: 100 // end value
        }
      ]
    }]
  );

```

You can add multiple properties in parallel or off-sync with the `position` or `advance` parameter.  

## Command line

**ABeamer** command line utility is used to:

* create projects: `abeamer create`.
2. launch a live server: `abeamer serve`.
3. render the project to disk: `abeamer render`.
4. create gifs: `abeamer gif`.
5. create movies: `abeamer movie`.

For detailed examples, read: [Command Line Utility](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/abeamer-cli/).  
Read [Requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies on the local machine.

## Documentation

* [End-User Documentation](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/)
* [Developer Documentation](https://a-bentofreire.github.io/abeamer-docs/developer/versions/latest/en/site/)

## GitHub Repositories

* [Developer version](https://github.com/a-bentofreire/abeamer)
* [Release version](https://github.com/a-bentofreire/abeamer-release)
* [Documentation](https://github.com/a-bentofreire/abeamer-docs)
* [Gallery - Release version](https://github.com/a-bentofreire/abeamer-gallery-release)

## Roadmap & Known Issues

* [Roadmap](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/roadmap/)
* [Known Issues](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/known-issues/)

## Contribute

![Image](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/warning.png) ABeamer is still in **beta** stage,
and before the first GitHub commit it went through multiple redesigns both the 
code and the documentation as well, although it has now reach a mature phase, 
now is in a process of harmonize the code and documentation created during the multiple designs.   
It still has bugs and inconsistences to tackle.

![Image](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/warning.png) ABeamer 
was built on Linux/Chrome/Puppeteer and tested on Windows, Firefox, Opera and MS Edge.  
There is still a lot of work to support all the most common web browsers, OSes and render servers.

To keep an healthy cooperation environment, before posting an issue, please read 
[Code Of Conduct](https://a-bentofreire.github.io/abeamer-docs/end-user/versions/latest/en/site/code-of-conduct.md)

To report issues, use the main repo [issues](https://raw.githubusercontent.com/a-bentofreire/abeamer/master/issues).

## License

[MIT License+uuid License](https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md)

## Copyrights

(c) 2018 Alexandre Bento Freire
