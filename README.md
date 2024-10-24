## Description
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-abeamer/story-frames/story.gif)  

![NPM Version](https://img.shields.io/npm/v/abeamer)

[ABeamer](https://abeamer.devtoix.com) is a powerful frame-by-frame animation ecosystem, designed to create an animated story 
in the web browser and generate the file images of each frame in either a local machine or in the cloud.
  
Unlike `VelocityJs` and `JQuery.animate` which were built for real-time user interaction, 
ABeamer allows you to build complex frame based animations and save them frame-by-frame 
with transparency at high resolution and lossless compression without frame drop.  
  
When an animated story is designed to be rendered in the cloud, 
no software is required to install on the local machine,
allowing video hosting services, ad network, e-commerce companies 
many other businesses to provide a tool for their users to add text, images, 
and special effects to their images or videos by just using the web browser 
and then [teleport](https://abeamer.devtoix.com/docs/latest/end-user/en/site/teleporter/) 
the story to the company's machine to render the frame images and generate animated gifs or videos.  

If you find this project useful, please, read the [Support this Project](#support-this-project) on how to contribute.
  
## Components

ABeamer includes a web browser library, a render server agent and a command line utility.  
For the ABeamer Animation Editor, read [Animation Editor](https://abeamer.devtoix.com/docs/latest/end-user/en/site/animation-editor/).
  
- ABeamer **web browser library** is a highly extensible TypeScript/JavaScript library 
bundled with a rich [toolset](#toolset) reducing the time to build complex animations.  
- ABeamer **render server agent** is designed to communicate with a render server, usually a headless web browser, in order to save 
each frame to the disk. It can run either with the full potential supporting [Code Handlers](https://abeamer.devtoix.com/docs/latest/end-user/en/site/glossary/#code-handler) 
or in a sanitized environment allowing you to safely to render animations created by other users.  
- ABeamer **command line utility** allows you to build new projects, 
render frames, create animated gifs or movies.  

Read the [requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies in the local machine.  

## Features

- Free and Open-source.
- Simple and intuitive design.
- Supports rendering in the cloud in a sanitized environment.
- Extensively documented: [End-User Documentation](https://abeamer.devtoix.com/docs/latest/end-user/en/site/) and
 [Developer Documentation](https://abeamer.devtoix.com/docs/latest/developer/en/site/).
- Absolutely minimum [dependencies](#requirements).
- Highly Extensible via [plugins](https://abeamer.devtoix.com/docs/latest/end-user/en/site/plugin-manager/) including [interpolators](#interpolators), functions, flyovers and tasks.
- [Tasks](https://abeamer.devtoix.com/docs/latest/end-user/en/site/tasks/) to build complex animations 
and [F/X](https://abeamer.devtoix.com/docs/latest/end-user/en/site/tasks/#fx).
- Large gallery of [example projects](https://abeamer.devtoix.com/gallery/latest/).
- Multiple scenes (only default scenes are teleportable).
- Scene transitions.
- [Expressions](https://abeamer.devtoix.com/docs/latest/end-user/en/site/expressions/), functions and variables.
- Parallel and [off-sync](https://abeamer.devtoix.com/docs/latest/end-user/en/site/glossary/#off-sync) property animations.
- Teleportable [JQuery-like containers](https://abeamer.devtoix.com/docs/latest/end-user/en/site/pels/).
- Teleportable [flyovers](https://abeamer.devtoix.com/docs/latest/end-user/en/site/flyovers/).
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-rec-high-res/story-frames/story.gif)  
  
- Saves frame-by-frame into a file sequence with transparency and at high resolution.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-with-less/story-frames/story.gif)  
  
- Optional support for SCSS, LESS and TypeScript.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-virtual/story-frames/story.gif)  
  
- DOM and Virtual Elements, Animators and Scenes. [read more >>>](https://abeamer.devtoix.com/blog/2018/07/31/how-to-use-virtual-animators-in-abeamer.html)  
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-localization/story-frames/story.gif)  
  
- Localization of messages and plugin functionalities, including functions and variables.

# Property Animation

ABeamer has a complex system that allows to interpolate pixels, numbers,
text, colors and much more.
ABeamer guesses the starting value and property type from CSS style information,
or if that information is given via `valueStart`.
- General CSS properties:

e.g  `prop: 'border-style'; valueText: ['dotted', 'dashed']`.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-pixels/story-frames/story.gif)  
  
- Pixel properties.  
 e.g. `valueStart: 10px; value: 100;`
- Dual-pixel properties via [paths](https://abeamer.devtoix.com/docs/latest/end-user/en/site/paths/).
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-colors/story-frames/story.gif)  
  
- Color properties.  
e.g. `valueText: ['red', '#FF00AA'];`
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-counter/story-frames/story.gif)  
  
- Formatted numerical properties.  
e.g. `valueFormat: '%d%'; value: 100;`
- Unformatted numerical properties.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-images/story-frames/story.gif)  
  
- Image properties.  
e.g. `prop: 'src'; valueText: ['a.png', 'b.png'];`
- Text properties.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-class-prop/story-frames/story.gif)  
  
- `class` property.  
e.g. `prop: 'class'; valueText: ['+class1 -class2'];`
- `visible` property.  
e.g. `prop: 'visible'; duration: 1; value: 1;`
- `transform` property:  
e.g. `prop: 'transform'; valueFormat: 'rotateX(%fdeg)'`;

## CSS Animations

ABeamer doesn't supports CSS animations, but ABeamer was designed in a way that 
its animations are similar to CSS animations, therefore it's easy to convert CSS Animations 
to ABeamer animations.  
Besides the property interpolation described above, ABeamer also supports:

![Image](https://abeamer.devtoix.com/gallery/latest/animate-item-delay/story-frames/story.gif)  
  
- Item-delay with `disturbance` to produce random effects.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-loop/story-frames/story.gif)  
  
- CSS animation-iteration-count.

## Interpolators

ABeamer provides several interpolators, which can be defined by:

- Teleportable Built-in interpolators. Accessible by name and ID.
- Teleportable [Expressions](https://abeamer.devtoix.com/docs/latest/end-user/en/site/expressions/).
- [Plugins](https://abeamer.devtoix.com/docs/latest/end-user/en/site/plugin-manager/). Only official plugins can be teleportable.
- [Code Handlers](https://abeamer.devtoix.com/docs/latest/end-user/en/site/glossary/#code-handler) due security reasons aren't teleportable.

ABeamer has following interpolators:

  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-easings/story-frames/story.gif)  
  
- Easings - The speed of motion.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-oscillator/story-frames/story.gif)  
  
- `harmonic` and `damped` oscillators - Rotation and Balancing motion.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-pulsar/story-frames/story.gif)  
  
- `pulsar` oscillator.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-paths/story-frames/story.gif)  
  
- Paths - n-dimension motion.

The interpolators are chained in the following order: easing→oscillator→path.

## Toolset

ABeamer has a rich toolset. Extensibility and teleportation are the key features of these tools.  
Unless is noticed, all the built-in tools support teleportation.  
Just like in the case of interpolators, [Code Handlers](https://abeamer.devtoix.com/docs/latest/end-user/en/site/glossary/#code-handler) aren't teleported, and the tools can be extended via plugins but only official plugins are teleportable.  

ABeamer has the following tools:
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-transitions/story-frames/story.gif)  
  
- Scene transitions.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-flyovers/story-frames/story.gif)  
  
- `info` flyover.
  
[![Image](https://abeamer.devtoix.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/snapshot.jpg)](https://abeamer.devtoix.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/view-video.html)  
  
- `video-sync` flyover [[1]](https://abeamer.devtoix.com/docs/latest/end-user/en/site/flyovers/#video-sync-flyover).
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-wrappers/story-frames/story.gif)  
  
- Wrappers.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-text-tasks/story-frames/story.gif)  
  
- Text tasks:
   * `text-split` task.
   * `typewriter` task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-factory/story-frames/story.gif)  
  
- `factory` task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-decipher-text/story-frames/story.gif)  
  
- `decipher` task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-attack-task/story-frames/story.gif)  
  
- `color-attack` task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-shapes/story-frames/story.gif)  
  
- `shape` task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-speech/story-frames/story.gif)  
  
- `speech` shape task.
  
![Image](https://abeamer.devtoix.com/gallery/latest/animate-charts/story-frames/story.gif)  
  
- `charts` task.

and much more [coming soon](https://abeamer.devtoix.com/docs/latest/end-user/en/site/roadmap/).

## Installation

To create animations, It's only required to have the `web browser library` without the need of any software installed in the computer.  

If you have nodejs already installed, install using npm:  
  
`[sudo] npm install -g abeamer`  
  
Otherwise if you don't want to install nodejs, download from [here](https://abeamer.devtoix.com/downloads.html),
but it won't execute the command-line utility.

## Requirements

However, in order to render frames, generate gifs and movies, it requires:
1. [nodejs](https://nodejs.org/en/).

2. To render, it requires [puppeteer](https://www.npmjs.com/package/puppeteer) render server `npm install -g puppeteer`.  
   Puppeteer installs Chromium by default, since Chromium is outdated and it has less features than Chrome,  
   before installing puppeteer, read the following [note](https://abeamer.devtoix.com/docs/latest/end-user/en/site/faq/#can-i-install-puppeteer-without-chromium)
   on how to configure puppeteer to use Chrome instead of Chromium.
   ABeamer also supports `phantomjs` but since its features are outdated it is preferable to use puppeteer.  

3. To generate gifs, it requires to have [imagemagick](https://www.imagemagick.org) on system path.  
   For Windows users, read the following [note](https://abeamer.devtoix.com/docs/latest/end-user/en/site/faq/#it-doesnt-creates-a-gif-file).

4. To create movies, it requires to have [ffmpeg](https://www.ffmpeg.org/) on the system path.
  
To check if 2-4 points are installed and configured, execute:  
  `abeamer check`  

## Playground

Try these examples online without any installation:

- [Hello world](https://codepen.io/a-bentofreire/pen/rrRMRa)
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

```javascript
  let story = ABeamer.createStory(25); // creates a story with 25 fps
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
 const newScene = story.AddScene();
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

For detailed examples, read: [Command Line Utility](https://abeamer.devtoix.com/docs/latest/end-user/en/site/abeamer-cli/).  
Read [Requirements](#requirements) for details about the necessary software 
to install if you need to render, create gifs or movies on the local machine.

## Documentation

- [End-User Documentation](https://abeamer.devtoix.com/docs/latest/end-user/en/site/)
- [Developer Documentation](https://abeamer.devtoix.com/docs/latest/developer/en/site/)

## Known Issues

- [Known Issues](https://abeamer.devtoix.com/docs/latest/end-user/en/site/known-issues/)

## Support this Project

If you find this project useful, consider supporting it:

- Donate:

[![Donate via PayPal](https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-rect-paypal-34px.png)](https://www.paypal.com/donate/?business=MCZDHYSK6TCKJ&no_recurring=0&item_name=Support+Open+Source&currency_code=EUR)

[![Buy me a Coffee](https://www.devtoix.com/assets/buymeacoffee-small.png)](https://buymeacoffee.com/abentofreire)

- Visit the project [homepage](https://www.devtoix.com/en/projects/abeamer)
- Give the project a ⭐ on [Github](https://github.com/a-bentofreire/abeamer)
- Spread the word
- Follow me:
  - [Github](https://github.com/a-bentofreire)
  - [LinkedIn](https://www.linkedin.com/in/abentofreire)
  - [Twitter/X](https://x.com/devtoix)

## Contribute

![Image](https://abeamer.devtoix.com/assets/icons/warning.png) ABeamer 
was built on Linux/Chrome/Puppeteer and tested on Windows, Firefox, Opera, MS IE11 and MS Edge.  

To keep an healthy cooperation environment, before posting an issue, please read 
[Code Of Conduct](https://abeamer.devtoix.com/docs/latest/end-user/en/site/code-of-conduct/).

Report issues on [github](https://github.com/a-bentofreire/abeamer/issues/).

## License

MIT License

## Copyrights

(c) 2018-2024 [Alexandre Bento Freire](https://www.traveltoix.com)
