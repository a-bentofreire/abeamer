// @doc-name FAQ
<!--- @uuid: 1b793830-465f-430c-bc97-3dd3539e5e22 -->
<!--- @author: Alexandre Bento Freire -->
# Description
This document provides information regarding installation and execution for the end-user.  
For developers and plugin creators read: [Developer Documentation](../../../../../developer/versions/latest/en/site/)  

---------------------
## Installation

### I can't install ABeamer!

ABeamer is a nodejs package.  
It requires the installation of nodejs.  
It can be downloaded here: [nodejs](http://www.nodejs.com)  

During the installation process, abeamer requires to create a shortcut, 
if you are running on linux OS, it must be installed with sudo  
`sudo npm install -g abeamer`

If you have access errors, consider installing your global node packages 
on a path where you have access rights.  
Read how to do it here: [fixing-npm-permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)  

### Can I install ABeamer as a local nodejs package?

Yes, you can.  
Install via: `npm install abeamer`  
And then execute via `npm run abeamer --`  
Hint: The ending `--` allows abeamer to receive options

### Can I execute ABeamer without installing nodejs?

ABeamer is an ecosystem that encompasses a TypeScript/Javascript web browser library, 
a render server agent and command line utility.  
The web browser library doesn't requires nodejs, but it won't be able to 
store the images on the disk, nor generate gifs.  
  
If you just to use ABeamer as an animation library or generate the frames 
via [teleporting](teleporter.md) then you don't need to install nodejs.

### Can I download just the animation library?

Yes, you can.  
Here is the link: @TODO: add link

### I can't install puppeteer.   

`puppeteer` is a node package just like abeamer.  
For details, read the question above [I can't install ABeamer!](#i-cant-install-abeamer)

### Can I install puppeteer without chromium?

Yes, you can.  
Set the environments variables on your terminal console:

```shell
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
CHROME_BIN=<full-chrome-path-including-file-name>
```
---------------------
## Execution

### When I render, it gives an error

ABeamer has included a render server agent, and this one requires a server.  
The default server is `puppeteer`, you can install it via:  
`npm install -g puppeteer`  
Tip: on linux OS, it requires a `sudo`.   

If you have puppeteer installed, but still have errors, 
set the environment variable to:  
```shell
CHROME_PATH=<full-chrome-path-including-file-name>
```

### My animation doesn't changes the current physical position.

In order for an element to change its position, in necessary that:  

1. The starting position be defined in pixels either by:  

   - Info in a CSS file. e.g `{ left: 10px; top: 0px; }`  
   - `valueStart` defined in pixels. e.g. `valueStart: '30px'`.  
   - The property had been previously animated.  
2. The `value` be defined numerically not in pixels.  



### How do I change the output frame size?

Inside `abeamer.ini` there are two fields: `$abeamer-width` and `$abeamer-height`.  
After modifying these two fields, recompile the `js/main.scss` using SCSS compiler.   

### Can I use only JavaScript without TypeScript?

Yes, you can.  
ABeamer provides TypeScript typings for convenience and documentation purposes, 
but all the functions and constants are designed to be used without TypeScript.   

### Can I use only CSS without SCSS?

Yes, you can. Although, it's advisable to use SCSS.  
ABeamer uses SCSS only to read `abeamer.ini` which provides information 
regarding width and height.  
When placing absolute elements on your story, 
knowing the output width and height might be necessary.   

### Can I use LESS instead of SCSS?

Yes, you can.  
ABeamer was mainly built to use SCSS or CSS.  
Nevertheless, it has LESS support.  
You need to modify `$abeamer` fields into `@abeamer` on `abeamer.ini` file.  

### Why is abeamer.ini an .ini file and not a .scss file?

`abeamer.ini` is read both by scss compiler and ABeamer server agent.  
It only allows a small subset of scss specification.   

### I don't known how to program, can I use ABeamer?

Yes, you can.  
You can build your story just with HTML+(S)CSS+JSON without any coding.   

### ABeamer has lots of functions and constants starting with underscore.   

All the member names starting with underscore are internal members 
and they can change over time.  
It's advisable to use only the public API which is stable.   

### Can I use ABeamer for real-time animations?

Yes, you can but ABeamer wasn't build for speed.  
It's a software based interpolator designed to be powerful, highly configurable 
and to allow to save images to the disk.   

---------------------
## Animation

### Can I have quotes on text inside expression?

Yes, you can.  
Double slash followed by slash-quote.  
`"='\\\'=sen(t)\\\''`

---------------------
## Rendering

### Why I do I need puppeteer to render, if ABeamer has a server?

ABeamer has included a render server agent which communicates between 
the ABeamer web browser library and puppeteer and which in turns communicates with Chrome.   

### It doesn't render from my url?

If your url doesn't includes the `index.html` then it must end with the slash.  
**example:** `abeamer render --url "http://localhost:9000/gallery/remote-server/"`

### Why I can't save the frames in jpg format?

ABeamer uses puppeteer/chrome to render the images to the disk
and these application don't allow to save the images into jpg.   

### Why the elements on output have a different size than the ones I tested on the browser?

The render engine uses a zoom factor 100%. If you use a different zoom factor 
to test the images it will result in a different output.   

### Why the rendering speed is different from the browser to the generated image frames?

ABeamer was built with image generation in mind, 
it guaranties that each generated frame has the correct information.  
However, when the animation is tested in the browser, 
the time between two frames can be delayed due a complex calculations or image loading.   
In such cases, ABeamer tries to compensate by having a shorter time for the next frame.   

### Why a N seconds animation, doesn't generate exactly N seconds frames?

ABeamer works internally with frames.  
Each time duration or position is converted to a integer frame number.  
If the frames per second, is not a integer division of a second, such as 30fps, 
it will round to the nearest frame.   
It's advisable to use fps that are integer divisions such as 20 or 25fps.   

---------------------
## General

### Why addAnimation uses properties naming and not attributes?

A property defined in `addAnimation` is then mapped to a DOM attribute or CSS property or 
a Virtual Element property.

### Why is fps information on main.ts and not in abeamer.ini like width and height?

Due CORS, a script running inside a browser can't load an external text file without a live server.  
ABeamer was designed to be executed, in general, without requiring of a live server.  
ABeamer web browser library requires `fps` information.  
Initial versions of ABeamer used gimmicks to get information from style sheets but it wasn't clear solution.   
