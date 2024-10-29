---
title: Teleporter
group: Library
category: Pages
---
## Description
  
<i class="fa fa-exclamation-triangle fa-lg"></i>
**Warning** This is still an experimental technology,
to push forward the development in this field,
please, consider leaving your donation or become a sponsor.  
  
**Teleporting** is the process of splitting the story created in one machine
into its constituting pieces and then from this pieces,
recreate the story in a remote machine, in order to generate
the physical story frames images in this remote machine.  
  
Teleporting allows a user to create animations just by using **a web browser
from a computer or tablet** without the need of installed software
nor direct access to the computer files.  
  
It was created with the main goal of allowing video hosting services,
ad network, and e-commerce companies to allow their users
or employees to build their animation in their machines,
and then generate the video on the company's machines.  
  
It can also be used, in case where the user is on a controlled
computer environment defined by the company's policy
or in case there is a faster machine available for rendering,
specially when the story contains heavy computational WebGL elements.  
  
The [ABeamer Animation Editor](animation-editor.md) will allow
to bring the remote rending to new heights.  
  
Without the ABeamer Animation Editor, it's required that the user has
basic skills of CSS and HTML. JavaScript programming skills aren't required.  
  
Due restrictions imposed by [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
It's required that:  
  
- The client either runs on a remote link or runs under a live server.  
  ABeamer includes a live server. Just execute `abeamer serve`  
- The render server agent must execute the url from a live server.  
  
With the current technology still has following limitations,
some of them imposed due security reasons:  
  
- [Code Handlers](glossary.md#code-handler) aren't allowed.  
- Only default scenes are allowed.  
- Scenes can't be removed during the execution.  
- Only fixed remote assets are allowed.  
- Use only functionality that isn't marked as: doesn't supports teleporting.  
- Assets inside CSS files must have the `url("....") format`  
and be part of the project structure.  
- No `<style>` tag inside html file is allowed.  
- No `<script>` files are allowed.  
  
  
## Usage
  
The whole process is fairly simple, just follow these steps:  
  
- create a project using abeamer command line called `my-project`.  
  
```shell
abeamer create my-project
```  
  
- download [animate-transitions](/gallery/latest/animate-transitions/code.zip),
and unzip to the newly created folder `my-project`. When asked to overwrite the files, select 'Yes'.  
This is just a complete example of story ready to teleport.  
The following steps are for testing purposes, for production mode will be
described after.  
  
- Run the live server:  
  
```shell
abeamer serve
```  
  
Due CORS and since this is a local file it requires a live server.  
  
- Execute:  
  
```shell
abeamer render my-project --url http://localhost:9000/my-project/ --teleport
```  
  
This will create a file called `story.json` on `my-project` folder.  
  
- create a project using abeamer command line called `server`.  
  
```shell
abeamer create server
```  
  
Download [remote-server](/gallery/latest/remote-server/code.zip),
and unzip  to the newly created folder `server`. When asked to overwrite the files, select 'Yes'.  
  
- Copy the `story.json` from the `my-project` folder to the `server` folder.  
  
- Copy all the assets sub-folder from the `my-project` folder to the `server` folder.  
  
- Execute:  
  
```shell
abeamer render \
--url http://localhost:9000/server/ \
--allowed-plugins server/.allowed-plugins.json \
--inject-page server/index.html \
--config server/story.json
```  
  
This will generate the frames on `server/story-frames`.  
  
  
The previous steps where built for testing purposes,
since the teleporter was built to be used without the need of using anything
but the web browser.  
  
For production mode:  
  
1. Open on chrome the following url: `http://localhost:9000/gallery/animate-transitions/`.  
  
2. Uncomment both code lines on the 'animate-transitions/js/main.ts'.  
And either compile using TypeScript or port those lines into main.js.  
This will create the story with `{ toTeleport: true }`.  
Which will record every part of the animation and instruct the library and plugins
to behave differently.  
  
3. On chrome developer tools, you will see on the console the complete story as string.  
This data was generated via `story.getStoryToTeleport()`  
This is the data you have to send via Ajax to the remote server.  
  
In this case, it's no longer needed: `abeamer render --teleport`, nor access to the computer disk.  
  
## How it works?
  
When a story is created with `toTeleport = true`, ABeamer will:  
  
1. Store a copy of the initial html and CSS (due CORS, it requires a live server).  
2. When transitions, stills or pEls are used, it will behave differently in order to be recorded into a file.  
3. On each addAnimations, a deep copy will be stored before tasks modify its content.  
4. Plugins will check if it's on teleporting mode, and act according to it.  
  
Instead of calling render, the `getStoryToTeleport` will generate data ready to be teleported.  
This data must be **beamed** to the remote machine, usually via Ajax.  
  
`getStoryToTeleport` will return a string, if you want to add more parameters,
use `getStoryToTeleportAsConfig`, and it will return an Object.  
ABeamer uses only `config.abeamer` record inside the generated object,
any other field can be used to store extra data.  
  
The remote machine has an empty story body,
see [remote-server](/gallery/latest/#remote-server), where it fills
with the data has been teleported and injects the plugins.  
  
  
## Security tips
  
ABeamer is an open-source library, which runs inside a contained environment such as a web browser,
and doesn't allows the execution of any javascript code except from plugins.  
However, in order to prevent malicious users or plugins, ensure that:  
  
1. **Only allow 3rd party plugins from trusted sources**.  
2. Execute the live server in a contained environment.  
3. Don't place any password files accessible to the live server.  
4. The provided live server, is just a simple live server, consider using a more restrict live server.  
5. Blacklist from the browser the access to the local network resources.  
6. Use only the latest versions of the ABeamer, browser, and render server.  
7. Set the maxWidth, maxHeight, maxFps and maxFrameCount parameters for `abeamer render`  
8. Move the files .allowed-plugins.json and story.json from the user access.