## What's new

## [1.5] -
  
- New `datetime-functions` plugin.
- Added `hsl2Rgb`, `rgb2Hsl`, `hsl` and `hsla` functions to `color-functions` plugin.
- Support input array parameter in `color-functions`.
- Added `abs` and `sign` functions.
- Added `allowExpr` parameter to `add-vars` task.
- Fixed a bug on the reducing the release version size.
- Improved command line documentation.
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/09/10/abeamer-1.5.0-released.html)  
  
## [1.4] -
  
![Image](https://abeamer.a-bentofreire.com/gallery/latest/animate-delay-teleportation/story-frames/story.gif)  ![Image](https://abeamer.a-bentofreire.com/gallery/latest/animate-delay-teleportation/story-frames/story-lighthouse.gif)  
  
- Teleportation initial snapshot can be delay by using `story.startTeleporting()`. Read about it on the blog [post](https://abeamer.a-bentofreire.com/blog/2018/08/20/how-to-delay-the-teleportation-in-abeamer.html).  
- Debugging code was removed from `abeamer.min.js`. Use `abeamer-debug.min.js` if you need such information.
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/08/20/abeamer-1.4.0-released.html)  
  
## [1.3] -
  
- Fixes font rendering on `animate-transitions` example.
- Adds minify to all abeamer release js files.
- Adds execution scripts (linux and windows) when ABeamer is downloaded as [zip](https://abeamer.a-bentofreire.com/downloads.html) file.  
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/08/15/abeamer-1.3.0-released.html)  
  
## [1.2] -
  
- Fixes gif generator bug on Windows.
- Adds `--gif-background` to `abeamer gif` CLI.  
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/08/06/abeamer-1.2.0-released.html)  
  
## [1.1] -
  
![Image](https://abeamer.a-bentofreire.com/gallery/latest/animate-simple-virtual-animator/story-frames/story.gif)
  
- Improves and simplifies the usage of [Virtual Animators](https://abeamer.a-bentofreire.com/blog/2018/07/31/how-to-use-virtual-animators-in-abeamer.html).
- The CLI has:
    * a new `check` command to verify the requirements and help to configure puppeteer.
    * new parameters to fine-tune the generation of movies and gifs.
    * new environments variables to avoid changing the search path to execute `ffmpeg` and imagemagick `convert`.
- Better support for paths with spaces.
- Improved support for windows developers with new batch files.  
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/07/31/abeamer-1.1.0-released.html)  
  
## [1.0] -
  
![Image](https://abeamer.a-bentofreire.com/gallery/latest/animate-badges/story-frames/story.gif)
  
ABeamer was raised to production level with the release of ABeamer 1.0.0.  
This is the first LTS version and it includes many improvements, bug fixes, a few cosmetics changes in the documentation, 
and better support on Windows platform and Microsoft web browsers.  
ABeamer 1.0.0 gives great access to the command-line allowing to create stories that can 
be configure by the server, opening the door to multiple dimension rendering.  
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/07/11/abeamer-1.0.0-released.html)  
  
The `animated-badges` now are configurable by the server, and don't require the installation of local js/css files.  
[How to generate an animated badge with ABeamer >>>](https://abeamer.a-bentofreire.com/blog/2018/07/11/how-to-generate-an-animated-badge-with-abeamer.html)  
  
## [0.3.2] -
  
ABeamer 0.3.2: Now ABeamer has a website and blog. Have a look: [https://abeamer.a-bentofreire.com](https://abeamer.a-bentofreire.com).  
With the creation of the blog, the project updates will be described in more detail and its information can be used as documentation.
In this version includes more detailed documentation and several fixed several documentation bugs.
The major goal now is to raise the ABeamer to production level.  
The [roadmap](https://abeamer.a-bentofreire.com/docs/latest/end-user/en/site/roadmap/) was also updated and added many details.   
  
## [0.3.1] -
  
ABeamer 0.3.1 includes chart series as expressions, allowing to plot mathematical functions.  
The standard library now also includes `log`, `log10` and `exp`.  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/06/29/abeamer-0.3.1-released.html)  
 
## [0.3.0] -
  
![Image](https://a-bentofreire.github.io/abeamer-gallery-release/animate-charts/story-frames/story.gif)  
  
ABeamer 0.3.0 includes the first implementation of the charts plugin.  
Although there is still a lot of work for reach production stage, and the API can still change,
is already usable in projects.  
This plugin, will now enter a phase of research to ensure all parameters are consistent and their names 
and specifications are easy to use.  
Have a look how the charts look in [action](https://a-bentofreire.github.io/abeamer-gallery-release/charts-gallery/index-online.html) or 
play with them in [Code Pen](https://codepen.io/a-bentofreire/pen/mKjQXR).  
  
[read more >>>](https://abeamer.a-bentofreire.com/blog/2018/06/25/abeamer-0.3.0-released.html)  
  
This version also includes:
* Gallery examples can viewed online without installing.
* expressions support object variables.
* expressions support one-dimension indices access to array variable.
* [Easings gallery](https://a-bentofreire.github.io/abeamer-gallery-release/easings-gallery/index-online.html).
  
## [0.2.12] -

In the version 0.2.11, it was added the alpha version of the charts plugin.
In the next versions, this plugin will be improved to reach beta version.
In this version 0.2.12, the command line and teleporter were both improved 
and fixed small bugs.
