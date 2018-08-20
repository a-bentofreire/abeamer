## Description
![Target](https://www.abeamer.com/assets/badges/developer-badge.gif)![Target](https://www.abeamer.com/assets/badges/v-1.4.0.gif)  
  
![Image](https://www.abeamer.com/gallery/latest/animate-abeamer/story-frames/story.gif)  
  
**ABeamer** is a powerful frame-by-frame animation ecosystem, designed to create an animated story 
in the web browser and generate the file images of each frame in either a local machine or in the cloud.  
  
Unlike `VelocityJs` and `JQuery.animate` which were built for real-time user interaction, 
ABeamer allows you to build complex frame based animations and save them frame-by-frame 
with transparency at high resolution and lossless compression without frame drop.  
  
When an animated story is designed to be rendered in the cloud, 
no software is required to install on the local machine,
allowing video hosting services, ad network, e-commerce companies 
many other businesses to provide a tool for their users to add text, images, 
and special effects to their images or videos by just using the web browser 
and then [teleport](https://www.abeamer.com/docs/latest/end-user/en/site/teleporter/) 
the story to the company's machine to render the frame images and generate animated gifs or videos.  

## What's new

ABeamer 1.3.0: 
- Fixes font rendering on `animate-transitions` example.
- Adds minify to all abeamer release js files.
- Adds execution scripts (linux and windows) when ABeamer is downloaded as [zip](https://www.abeamer.com/downloads.html) file.
[read more >>>](https://www.abeamer.com/blog/2018/08/15/abeamer-1.3.0-released.html)  

ABeamer 1.2.0: 
- Fixes gif generator bug on Windows.
- Adds `--gif-background` to `abeamer gif` CLI.
[read more >>>](https://www.abeamer.com/blog/2018/08/06/abeamer-1.2.0-released.html)  

ABeamer 1.1.0: 
- Improves and simplifies the usage of Virtual Animators.
- The CLI has:
    * a new `check` command to verify the requirements and help to configure puppeteer.
    * new parameters to fine-tune the generation of movies and gifs.
    * new environments variables to avoid changing the search path to execute `ffmpeg` and imagemagick `convert`.
- Better support for paths with spaces.
- Improved support for windows developers with new batch files.
[read more >>>](https://www.abeamer.com/blog/2018/07/31/abeamer-1.1.0-released.html)  

ABeamer was raised to production level with the release of ABeamer 1.0.0.  
This is the first LTS version and it includes many improvements, bug fixes, a few cosmetics changes in the documentation, 
and better support on Windows platform and Microsoft web browsers.  
ABeamer 1.0.0 gives great access to the command-line allowing to create stories that can 
be configure by the server, opening the door to multiple dimension rendering.  
[read more >>>](https://www.abeamer.com/blog/2018/07/11/abeamer-1.0.0-released.html)  
The `animated-badges` now are configurable by the server, and don't require the installation of local js/css files.  
[How to generate an animated badge with ABeamer >>>](https://www.abeamer.com/blog/2018/07/11/how-to-generate-an-animated-badge-with-abeamer.html)  
  
ABeamer 0.3.2: Now ABeamer has a website and blog. Have a look: [https://www.abeamer.com](https://www.abeamer.com).  
With the creation of the blog, the project updates will be described in more detail and its information can be used as documentation.
In this version includes more detailed documentation and several fixed several documentation bugs.
The major goal now is to raise the ABeamer to production level.  
The [roadmap](https://www.abeamer.com/docs/latest/end-user/en/site/roadmap/) was also updated and added many details.   
  
![Image](https://www.abeamer.com/gallery/latest/animate-plot/story-frames/story.gif)   
  
ABeamer 0.3.1 includes chart series as expressions, allowing to plot mathematical functions.  
The standard library now also includes `log`, `log10` and `exp`.  
[read more >>>](https://www.abeamer.com/blog/2018/06/29/abeamer-0.3.1-released.html)  
  
![Image](https://www.abeamer.com/gallery/latest/animate-charts/story-frames/story.gif) 
  
ABeamer 0.3.0 includes the first implementation of the charts plugin.  
Although there is still a lot of work for reach production stage, and the API can still change,
is already usable in projects.  
This plugin, will now enter a phase of research to ensure all parameters are consistent and their names 
and specifications are easy to use.  
Have a look how the charts look in [action](https://www.abeamer.com/gallery/latest/charts-gallery/index-online.html) or 
play with them in [Code Pen](https://codepen.io/a-bentofreire/pen/mKjQXR).  
[read more >>>](https://www.abeamer.com/blog/2018/06/25/abeamer-0.3.0-released.html)  

This version also includes:
* Gallery examples can viewed online without installing.
* expressions support object variables.
* expressions support one-dimension indices access to array variable.
* [Easings gallery](https://www.abeamer.com/gallery/latest/easings-gallery/index-online.html).
  
For more details see the [CHANGELOG](https://github.com/a-bentofreire/abeamer/blob/master/CHANGELOG.md).  
  
## Components

ABeamer includes a web browser library, a render server agent and a command line utility.  
For the ABeamer Animation Editor, read [Animation Editor](https://www.abeamer.com/docs/latest/end-user/en/site/animation-editor/).
  
- ABeamer **web browser library** is a highly extensible TypeScript/JavaScript library 
bundled with a rich [toolset](#toolset) reducing the time to build complex animations.  
- ABeamer **render server agent** is designed to communicate with a render server, usually a headless web browser, in order to save 
each frame to the disk. It can run either with the full potential supporting [Code Handlers](https://www.abeamer.com/docs/latest/end-user/en/site/glossary/#code-handler) 
or in a sanitized environment allowing you to safely to render animations created by other users.  
- ABeamer **command line utility** allows you to build new projects, 
render frames, create animated gifs or movies.  

Read the [requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies in the local machine.  

## Donate
  
![Image](https://www.abeamer.com/gallery/latest/animate-support/story-frames/story.gif)  
  
To build this project, and take it to the next level with the creation of the [Animation Editor](https://www.abeamer.com/docs/latest/end-user/en/site/animation-editor/), it requires a full-time developer, 
please, consider donating to keep this project
alive and help to tell your story or to grow your business:  

* ![Image](https://www.abeamer.com/assets/icons/paypal.png) [paypal](https://www.paypal.me/abentofreire) 
* ![Image](https://www.abeamer.com/assets/icons/bitcoin.png) Bitcoin: `1mH89kWbvffActY7FAke26t2fbJE9U6jv`
* Add a star to the [github repo](https://github.com/a-bentofreire/abeamer).

## Features

* Free and Open-source.
* Simple and intuitive design.
* Supports rendering in the cloud in a sanitized environment.
* Extensively documented: [End-User Documentation](https://www.abeamer.com/docs/latest/end-user/en/site/) and
 [Developer Documentation](https://www.abeamer.com/docs/latest/developer/en/site/).
* Absolutely minimum [dependencies](#requirements).
* Highly Extensible via [plugins](https://www.abeamer.com/docs/latest/end-user/en/site/plugin-manager/) including [interpolators](#interpolators), functions, flyovers and tasks.
* [Tasks](https://www.abeamer.com/docs/latest/end-user/en/site/tasks/) to build complex animations 
and [F/X](https://www.abeamer.com/docs/latest/end-user/en/site/tasks/#fx).
* Large gallery of [example projects](https://www.abeamer.com/gallery/latest/).
* Multiple scenes (only default scenes are teleportable).
* Scene transitions.
* [Expressions](https://www.abeamer.com/docs/latest/end-user/en/site/expressions/), functions and variables.
* Parallel and [off-sync](https://www.abeamer.com/docs/latest/end-user/en/site/glossary/#off-sync) property animations.
* Teleportable [JQuery-like containers](https://www.abeamer.com/docs/latest/end-user/en/site/pels/).
* Teleportable [flyovers](https://www.abeamer.com/docs/latest/end-user/en/site/flyovers/).
  
![Image](https://www.abeamer.com/gallery/latest/animate-rec-high-res/story-frames/story.gif)  
  
* Saves frame-by-frame into a file sequence with transparency and at high resolution.
  
![Image](https://www.abeamer.com/gallery/latest/animate-with-less/story-frames/story.gif)  
  
* Optional support for SCSS, LESS and TypeScript.
  
![Image](https://www.abeamer.com/gallery/latest/animate-virtual/story-frames/story.gif)  
  
* DOM and Virtual Elements, Animators and Scenes. [read more >>>](https://www.abeamer.com/blog/2018/07/31/how-to-use-virtual-animators-in-abeamer.html)  
  
![Image](https://www.abeamer.com/gallery/latest/animate-localization/story-frames/story.gif)  
  
* Localization of messages and plugin functionalities, including functions and variables.

# Property Animation

ABeamer has a complex system that allows to interpolate pixels, numbers,
text, colors and much more.
ABeamer guesses the starting value and property type from CSS style information,
or if that information is given via `valueStart`.
* General CSS properties:   
e.g  `prop: 'border-style'; valueText: ['dotted', 'dashed']`.
  
![Image](https://www.abeamer.com/gallery/latest/animate-pixels/story-frames/story.gif)  
  
* Pixel properties.  
 e.g. `valueStart: 10px; value: 100;`
* Dual-pixel properties via [paths](https://www.abeamer.com/docs/latest/end-user/en/site/paths/).
  
![Image](https://www.abeamer.com/gallery/latest/animate-colors/story-frames/story.gif)  
  
* Color properties.  
e.g. `valueText: ['red', '#FF00AA'];`
  
![Image](https://www.abeamer.com/gallery/latest/animate-counter/story-frames/story.gif)  
  
* Formatted numerical properties.  
e.g. `valueFormat: '%d%'; value: 100;`
* Unformatted numerical properties.
  
![Image](https://www.abeamer.com/gallery/latest/animate-images/story-frames/story.gif)  
  
* Image properties.  
e.g. `prop: 'src'; valueText: ['a.png', 'b.png'];`
* Text properties.
  
![Image](https://www.abeamer.com/gallery/latest/animate-class-prop/story-frames/story.gif)  
  
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
   
![Image](https://www.abeamer.com/gallery/latest/animate-item-delay/story-frames/story.gif)  
  
* Item-delay with `disturbance` to produce random effects.
  
![Image](https://www.abeamer.com/gallery/latest/animate-loop/story-frames/story.gif)  
  
* CSS animation-iteration-count.

## Interpolators

ABeamer provides several interpolators, which can be defined by:

- Teleportable Built-in interpolators. Accessible by name and ID.
- Teleportable [Expressions](https://www.abeamer.com/docs/latest/end-user/en/site/expressions/).
- [Plugins](https://www.abeamer.com/docs/latest/end-user/en/site/plugin-manager/). Only official plugins can be teleportable.
- [Code Handlers](https://www.abeamer.com/docs/latest/end-user/en/site/glossary/#code-handler) due security reasons aren't teleportable.

ABeamer has following interpolators:

  
![Image](https://www.abeamer.com/gallery/latest/animate-easings/story-frames/story.gif)  
  
- Easings - The speed of motion.
  
![Image](https://www.abeamer.com/gallery/latest/animate-oscillator/story-frames/story.gif)  
  
* `harmonic` and `damped` oscillators - Rotation and Balancing motion.
  
![Image](https://www.abeamer.com/gallery/latest/animate-pulsar/story-frames/story.gif)  
  
* `pulsar` oscillator.
  
![Image](https://www.abeamer.com/gallery/latest/animate-paths/story-frames/story.gif)  
  
* Paths - n-dimension motion.

The interpolators are chained in the following order: easing→oscillator→path.

## Toolset

ABeamer has a rich toolset. Extensibility and teleportation are the key features of these tools.  
Unless is noticed, all the built-in tools support teleportation.  
Just like in the case of interpolators, [Code Handlers](https://www.abeamer.com/docs/latest/end-user/en/site/glossary/#code-handler) aren't teleported, and the tools can be extended via plugins but only official plugins are teleportable.  

ABeamer has the following tools:
  
![Image](https://www.abeamer.com/gallery/latest/animate-transitions/story-frames/story.gif)  
  
* Scene transitions.
  
![Image](https://www.abeamer.com/gallery/latest/animate-flyovers/story-frames/story.gif)  
  
* `info` flyover.
  
[![Image](https://www.abeamer.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/snapshot.jpg)](https://www.abeamer.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/view-video.html)  
  
* `video-sync` flyover [[1]](https://www.abeamer.com/docs/latest/end-user/en/site/flyovers/#video-sync-flyover).
  
![Image](https://www.abeamer.com/gallery/latest/animate-wrappers/story-frames/story.gif)  
  
* Wrappers.
  
![Image](https://www.abeamer.com/gallery/latest/animate-text-tasks/story-frames/story.gif)  
  
* Text tasks:
   * `text-split` task.
   * `typewriter` task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-factory/story-frames/story.gif)  
  
* `factory` task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-decipher-text/story-frames/story.gif)  
  
* `decipher` task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-attack-task/story-frames/story.gif)  
  
* `color-attack` task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-shapes/story-frames/story.gif)  
  
* `shape` task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-speech/story-frames/story.gif)  
  
* `speech` shape task.
  
![Image](https://www.abeamer.com/gallery/latest/animate-charts/story-frames/story.gif)  
  
* `charts` task.

and much more [coming soon](https://www.abeamer.com/docs/latest/end-user/en/site/roadmap/).

## Installation

To create animations, It's only required to have the `web browser library` without the need of any software installed in the computer.  

If you have nodejs already installed, install using npm:  
  
`[sudo] npm install -g abeamer`  
  
Otherwise if you don't want to install nodejs, download from [here](https://www.abeamer.com/downloads.zip),
but it won't execute the command-line utility.

## Requirements

However, in order to render frames, generate gifs and movies, it requires:
1. [nodejs](https://nodejs.org/en/).
     
2. To render, it requires [puppeteer](https://www.npmjs.com/package/puppeteer) render server `npm install -g puppeteer`.  
   Puppeteer installs Chromium by default, since Chromium is outdated and it has less features than Chrome,  
   before installing puppeteer, read the following [note](https://www.abeamer.com/docs/latest/end-user/en/site/faq/#can-i-install-puppeteer-without-chromium)
   on how to configure puppeteer to use Chrome instead of Chromium.
   ABeamer also supports `phantomjs` but since its features are outdated it is preferable to use puppeteer.  
     
3. To generate gifs, it requires to have [imagemagick](https://www.imagemagick.org) on system path.  
   For Windows users, read the following [note](https://www.abeamer.com/docs/latest/end-user/en/site/faq/#it-doesnt-creates-a-gif-file). 
     
4. To create movies, it requires to have [ffmpeg](https://www.ffmpeg.org/) on the system path.
  
To check if 2-4 points are installed and configured, execute:  
  `abeamer check`  

## Playground

Try these examples online without any installation:

- [Hello world](https://jsfiddle.net/abentofreire/peax4f9n/4/)
- [Image Overlays](https://codepen.io/a-bentofreire/pen/QxMPYR)
- [Ad Example](https://codepen.io/a-bentofreire/pen/qKPdVo)
- [E-Commerce](https://codepen.io/a-bentofreire/pen/aKyxyd)
- [Charts](https://codepen.io/a-bentofreire/pen/mKjQXR)

## Get started

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
  
The bare-bones of a `abeamer.ini` file:   
```scss
$abeamer-width: 200;
$abeamer-height: 100;
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

1. checks if requirements are configured: `abeamer check`.
2. create projects: `abeamer create`.
3. launch a live server: `abeamer serve`.
4. create a png file sequence: `abeamer render`.
5. create gifs: `abeamer gif`.
6. create movies: `abeamer movie`.

For detailed examples, read: [Command Line Utility](https://www.abeamer.com/docs/latest/end-user/en/site/abeamer-cli/).  
Read [Requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies on the local machine.

## Documentation

* [End-User Documentation](https://www.abeamer.com/docs/latest/end-user/en/site/)
* [Developer Documentation](https://www.abeamer.com/docs/latest/developer/en/site/)

## Roadmap & Known Issues

* [Roadmap](https://www.abeamer.com/docs/latest/end-user/en/site/roadmap/)
* [Known Issues](https://www.abeamer.com/docs/latest/end-user/en/site/known-issues/)

## Contribute

![Image](https://www.abeamer.com/assets/icons/warning.png) ABeamer 
was built on Linux/Chrome/Puppeteer and tested on Windows, Firefox, Opera, MS IE11 and MS Edge.  

To keep an healthy cooperation environment, before posting an issue, please read 
[Code Of Conduct](https://www.abeamer.com/docs/latest/end-user/en/site/code-of-conduct/).

Report issues on [github](https://github.com/a-bentofreire/abeamer/issues/).

## License

[MIT License+uuid License](https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md)

## Copyrights

(c) 2018 Alexandre Bento Freire
