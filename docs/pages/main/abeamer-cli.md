---
title: Command Line
group: main
category: Pages
---
## Description
  
**ABeamer** command line utility is used to:  
  
- create projects:  
```shell
abeamer create
```  
- launch a live server:  
```shell
abeamer serve
```  
- render the project to disk:  
```shell
abeamer render
```  
- create gifs:  
```shell
abeamer gif
```  
- create movies:  
```shell
abeamer movie
```  
---------------------
## Examples
  
- Create a TypeScript/JavaScript project.  
```shell
abeamer create foo --width 720 --height 480 --fps 20
```  
---------------------
- Create a JavaScript project without TypeScript.  
```shell
abeamer create foo-js --width 384 --height 288 --fps 30 --no-typescript
```  
---------------------
- Start the live server on port 9000. The url is `http://localhost:9000/`.  
```shell
abeamer serve
```  
---------------------
- Start the live server with list directory option if search part of url is `?dir`.  
The url is `http://localhost:9000/?dir`.  
```shell
abeamer serve --list-dir
```  
---------------------
- Start the live server on port 8000. The url is `http://localhost:8000/`.  
```shell
abeamer serve --port 8000
```  
---------------------
- Generate the animations in file image sequences from the project in the current directory.  
```shell
abeamer render
```  
---------------------
- Same as above, but deletes the previous images and the project is on directory `foo`.  
```shell
abeamer render --dp foo
```  
---------------------
- Same as the first render, but it renders from a live server.  
Required if it's loading `.json` files or is teleporting.  
```shell
abeamer render --url http://localhost:9000/foo/index.html
```  
---------------------
- Generate only the `story.json` file, it doesn't generates the file image sequence.  
This should be used only for testing. Teleporting should be done from the web browser library,
and the teleported story via Ajax to the cloud.  
```shell
abeamer render --url http://localhost:9000/foo/index.html --teleport
```  
---------------------
- Same as the first render command, but with verbose logging.  
```shell
abeamer render --ll 3 --dp foo
```  
---------------------
- Same as the first render command, but uses slimerjs as the server.  
NOTE: slimerjs is on alpha version!
```shell
abeamer render --server slimerjs foo
```  
---------------------
- Same as the previous render command, but sets the server executable.  
```shell
abeamer render --server slimerjs --server-exec ./slimerjs-path/src/slimerjs-node foo
```  
---------------------
- Create an animated gif from the previous generated image sequence on `foo/story-frames/story.gif`.  
 Requires that imagemagick `convert` to be on the search path, or set `IM_CONVERT_BIN=<absolute-path-to-executable>`.  
```shell
abeamer gif foo
```  
---------------------
- Create an animated gif from the previous generated image sequence on `hello.gif`.  
```shell
abeamer gif foo --gif hello.gif
```  
---------------------
- Create an animated gif without looping.  
```shell
abeamer gif foo --loop 1
```  
---------------------
- Create an animated gif with a 25% scale frame size of the PNG sequence frame size.  
```shell
abeamer gif --gif-pre --scale 25% foo
```  
---------------------
- Create a movie from the previous generated image sequence on `foo/story-frames/movie.mp4`.  
Requires that `ffmpeg` to be on the search path, or set `FFMPEG_BIN=<absolute-path-to-executable>`.  
```shell
abeamer movie foo
```  
---------------------
- Create the movie `foo/story.webm`.  
```shell
abeamer movie foo --movie foo/story.webm
```  
---------------------
- Create a movie from the previous generated image sequence using `foo/bkg-movie.mp4` as a background.  
```shell
abeamer movie foo/ --bkg-movie foo/bkg-movie.mp4
```  
---------------------
- Create the movie a 50% scale frame size of the PNG sequence frame size.  
```shell
abeamer movie foo --scale 50%
```
