# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.5.0] -
### Changed
- (DEV) Port documents build to mkdocs 1.0.1.
- Improve the gallery example descriptions.
- Improve of a few cosmetic steps of the `build gallery-release`.
- Fix broken links, documentation formating and its output.
  > The output documentation code syntax highlight is changed to javascript due
  > the fact the highligher processor performs better.  
  > The website scripts will be responsible to improve the code highlight output.  
- (DEV) Remove dead code. Add missing void return type.
- (DEV) Remove local build-docs.
  > By moving the docs and gallery to the same domain as the website and blog,
  > and by restructuring the docs and gallery output paths to be the same as online,
  > now it's possible to test the docs and gallery offline using a local server and symlinks.  
- Improve command line documentation.
- (DEV) Move build paths, urls and parts of gulp code to `config.yaml`.
  > With this change, a developer can change the release paths and execute gulp tasks
  > without changing the gulpfile. There are still parts inside the gulp file that needs to
  > be ported.  
- (DEV) Change gulp task, npm scripts, code naming to match path names of release,gallery and docs.
  > With this change, the gulp tasks, builder filenames are easier to understand
  > its meaning since they match the output path names.  
- (DEV) Change main gulp tasks into gulpSequence.
  > Instead of chaining gulp tasks with the required finished tasks and having parts of the tasks
  > in the `package.json` file. the external gulp tasks use a gulpSequence which is much easier to
  > read the workflow.  

### Fixed
- Fix the removal of export of ids starting with `_` during build process of a single file.
  > This bug was introduced just before the commit 5f4f3e6. In practice, the
  > committed code didn't remove the exports of the ids starting with `_`.  
  > There was no side-effects just had no effect.  
  > Also added `_vars` to the list of exclusions of this process since
  > it's still being used by chart tasks.  
- Fix minor design issues in 2 `gallery-src` examples.

### Added
- Add Minor cosmetic improvements on gallery README.
- (DEV) Add `gulp post-build-docs` to improve documentation output.
  > This version replaces documentation online links with local links
  > to support offline testing.  
- Add type and keyword syntax highlighting code during `post-build-docs`.
- Add `allowExpr` parameter to `add-vars` task.
  > When `allowExpr` is true, and the value is string starting with `=`,
  > it will compute the expression, using ABeamer expression parser.  
- Add `datetime-functions` plugin.
  > This plugin allows to create teleportable expressions with date/time functions.  
- (DEV) Add `_` to the start of the id of unused function parameters. 
  > Although the tsconfig.json has `"noUnusedParameters": false`,  
  > adding the underscore prevent warnings in case of is set to `true`,  
  > and also helps to understand better unused parameters for future cleanups.  


## [1.4.0] -
### Fixed
- Fix the bug in `gulp build-release` that forced to have 2 folders in the gallery.

### Added
- Add abeamer-debug.min.js to release version and both min.js are smaller.
  > To generate the release version, all core .ts files are joined and
  >  it's removed the inner namespaces and removed the exports from id starting with `_`.  
  > Then they are compiled again using tsc.  
  > This process makes the minify compress more since there more internal symbols.  
  > The abeamer.min takes one step further by stripping all the code
  > inside #debug-start/#debug-end section.  
  > This will remove its capacity to provide debug logs but it will make it lighter.  
- Add `story.startTeleporting` to delay the teleportation initial snapshot.
  > This new method allows to teleport any HTML/CSS code injected
  > after the story has been created and before this method was invoked.
  > Read more on https://www.abeamer.com/blog/2018/08/20/how-to-delay-the-teleportation-in-abeamer.html

### Changed
- Move gallery, badges, icons file paths to be compatible with the website.
  > This change moves not only the file structure but also updates all the build scripts.  
  > With this change, it simplifies the process of local testing
  > and converting from local links to online links back and forth.  
  > Information regarding the old repos and git pages is removed.  
  > Documentation links are also updated to reflect this change.  
  >
  > File structure changes:
  >
  > - gallery -> gallery-src
  > - gallery-release -> gallery/latest
  > - docs/sources/*.{svg,gif} -> assets/badges
  > - docs/sources/*.png -> assets/icons
- Change the background image of `animate-item-delay` to reduce the pixelization.
  > When it was converted to animated gif the image looked pixelized due the fact
  > there is a color reduction to 256-colors and the previous background image add
  > too many shades.  


## [1.3.0] -
### Fixed
- Fix font rendering bug in `animate-transitions` example.
  > The problem was due a bug in Chrome as described in:
  > http://www.abeamer.com/blog/2018/08/15/abeamer-1.3.0-released.html

## [1.2.0] -
### Fixed
- Change imagemagick `convert` alpha parameters to fix gif generation on windows.

### Changed
- Remove `docs` and `gallery-release` visual customization.
  > Since the website, blog, release, and gallery-release are all hosted by the www.abeamer.com
  > website, this is now in responsibility to do all the customization.  
- Change the release version from release to `release/latest`.
  > This change will allow a local webserver have access to the same
  > url subpart as it is on the www.abeamer.com site.  
  > Simplifying the process of testing and deploying release versions.  
- Add minify to all js files during the `build-release` phase.

### Changed
- Move documentation from github repo to https://www.abeamer.com/docs.
- Update links and generators to move docs, gallery and release to abeamer website.
  > The github repos are replaced with folders on https://www.abeamer.com.  
  >
  > - docs/build/(target)/versions/latest/en ----> docs/release/latest/(target)/en
  > - git repo abeamer-release ----> release/latest
  > - git repo abeamer-gallery-release ----> gallery/latest
  > - git repo abeamer-docs ----> docs/latest
- Remove `index-online.html` from `gallery/*/code.zip`.
  > This file will be integrated with the website and shouldn't be part of user files.  

### Added
- Add parameter `--gif-background` to `abeamer gif` CLI.
- (DEV) `gulp build-gallery-release` generate index.html.
  > Since www.abeamer.com doesn't support markdown render, it's required to generate the index.html
- Add `messages/messages-en.js` to be the version 2.x holder of the english messages.
  > The messages in i18n.ts file will be moved to messages/messages-en.ts file on version 2.x.  
  > Users are encouraged to include the messages/messages-en.js on their index.html
  > even though for now it's an empty file to prevent breaking changes.  
- Add core plugins to gallery examples using oscillators, paths, transitions and functions.
- (DEV) Add check for missing gif files on `gulp build-gallery-release`.
- Add abeamer scripts to abeamer-release.zip.
  > This addition allows users how just want to download abeamer as a zip instead of using
  > npm to have running scripts without having to build their own scripts.  

## [1.1.0] -
### Changed
- Access to `story.virtualAnimator` is deprecated.
  > use `addVirtualAnimator`/`removeVirtualAnimator` instead.  
- (DEV) Port `_ChartVirtualAnimator` to `SimpleVirtualAnimator`.
  > Using `SimpleVirtualAnimator` gives a cleaner implementation, and by also using
  > `animateProps` reduces the render count when the animator has multiple animation properties.  

### Added
- Add `addVirtualAnimator`/`removeVirtualAnimator` to the story.
  > By using these methods instead of direct access to `virtualAnimator`,
  > allows to create maps for quicker access to virtual animators.
- Add `SimpleVirtualAnimator` class.
  > To be used by plugin creators to simplify the process of animating their content.
- Add support value parameters starting with -- in the abeamer cli.
- Add `--movie-pre` and `--movie-post` parameters to abeamer cli.
  > These arguments to be passed to ffmpeg before/after the arguments passed by abeamer.
- Add `--gif-pre` and `--gif-post` parameters to abeamer cli.
  > These arguments to be passed to convert before/after the arguments passed by abeamer.
- (DEV) Add `Launch abeamer cli` to VSC debugger configuration.
- (DEV) Add excludes to vsc files.watcher
  > VSC complains about too many files on the project.  
  > This change is an attempt to solve this issue.  
- Add support of system env FFMPEG_BIN to locate ffmpeg executable.
  > By having an environment variable pointing to the ffmpeg executable,
  > ABeamer can generate a movie without requiring ffmpeg to be in the search path.  
- Add support of system env IM_CONVERT_BIN to locate imagemagick convert executable.
  > By having an environment variable pointing to the imagemagick convert executable,
  > ABeamer can generate a gif without requiring imagemagick convert to be in the search path.  
  > On windows the search path points to windows convert program which can conflict with imagemagick convert.  
- Add `check` command to the abeamer cli.
  > Gives the user information how to configure `puppeteer` to use `Chrome` instead of `Chromium`.  
- (DEV) Add windows test batch files.
  > It helps windows developers to test developer versions.  
- Add adapters.frameRendered.
  > Using `frameRendered` allows animators with multiple animation properties
  > to be called only once per frame. This is the case of charts and
  > many other common canvas and WebGL virtual animators.  
- Add SimpleVirtualAnimator.animateProps.
- Prepare core parts to be moved into plugins on version 2.x.
  > By having many core parts as plugins, the ABeamer will load faster
  > and the user can opt-out parts that aren't needed in a project.  
  > Since this will generate breaking changes,
  > this phase will only be a preparation.

### Fix
- Fix http-server for URL with path with %20(spaces).
- (DEV) Fix unix test scripts project paths containing spaces.
- Fix render plugin injector to apply the same url base part.
  > This allows the dev script teleport.sh to inject on non-release version,
  > and in the release version to correctly inject in case the user changed from abeamer
  > to another path.  
- (DEV) Fix unix test script teleport.sh project paths containing spaces.

## [1.0.1] -
### Fix
- Update cdn.rawgit.com links with a-bentofreire.github.io.
  > Using `cdn.rawgit.com` didn't guarantee the updated links to `abeamer-release` files.  


## [1.0.0] -
### Breaking changes
- `abeamer render` `--width` and `--height` parameter override abeamer.ini/story.json definition
  and override story CSS dimension properties.
- Remove hide the story when the render starts, and then show it again to avoid first frame problem.
  It best method is author the way it is, and when authoring is finished hide the story on CSS.


### Changed
- Documentation breadcrumbs points to new links.
- Documentation uses a custom theme based on mkdocs.
- Update Documentation favicon.
- Read parameters of `gallery/animate-badges` via command line `--var` parameter.
- (DEV) Set The `README` gif loops more times and waits longer between loops.
- (DEV) Refactor set width/height in story.constructor.
- Change from fixed to dynamic dimensions in `animate-badges/main.scss`.
- Change `gallery/animate-badges` to support teleported dynamic story.
- Change `server-agent` to operate without --file or --out if there is --url.
- Change `abeamer render` to operate without any local file, only needs --url,--width,--height.
- Remove unnecessary `text-tasks` from `gallery/animate-badges`.

### Added
- Add Google Analytics to Documentation.
- (DEV) Add array and object type to command line parameters.
- `abeamer render` can pass `--var` parameters to client lib as `args.vars`.
- `story.args` is exposed as readonly property to allow to access `story.args.vars`.
- Add `duration`, `wait`, `name-background-color`, `value-background-color` to `gallery/animate-badges`.
- Add `name-width` to `gallery/animate-badges`.
- Add all parameters to the serverless pageUrl output in `abeamer render`.
- Add object variables in `add-vars` tasks.
- Add `overwrite` parameter to `add-vars` tasks.
- Add `calcStr` to compute textual expressions and check the output.
- Add easings with names defined as an expression starting with '=='
- Add extra exception handling server-agent-puppeteer to prevent freezing.
- Add `story.getStoryToTeleportAsConfig` to provide an object access to story to teleport.
- Add '[..]' to the listing in `abeamer serve --list-dir`.
- Add `logLevel` to `story.constructor`, allowing to get verbose
    information during story constructor phase.

### Fixed
- Fix `ChartLegend` in `chart-tasks` that had required typing `mark` parameter.
- (DEV) Fix `gulp build-release` in Windows, by disable `gulpPreserveTime` in `rel:server-minify` task.
- Fix CSS transform property on IE11, by disable overwriting property vendor remapping.
- Fix the transparency in area charts for IE11/MS Edge by changing from #RRGGBBAA to rgb(r,g,b,a).

## [0.3.2] -
### Changed
- Improve documentation.
- Add website information.


## [0.3.1] -
### Fixed
- (DEV) Fix the `gulp README-to-local` and `gulp README-to-online`.
- (DEV) Fix code examples on JSDocs for `gulp build-docs`.
- (DEV) Fix the tests that had errors.
- Fix the chart legend color for `line` charts.
- Fix the chart y-labels when there is not enough y-space created by labelsX to `chart-tasks`.

### Changed
- (DEV) Set `npm run test-all-serial` to runs all the tests in serial.

### Added
- Add links for property and method classes to `gulp build-docs`.
- Add functions: `log`, `log10` and `exp`.
- Add expression series in `chart-tasks`.


## [0.3.0] -
### Breaking changes
- `chart-tasks` parameters are incompatible.

### Fixed
- Fix several `chart-tasks` bugs.

### Added
- Add many features to the `chart-tasks`.
- Add `parseEnum` utility function.
- Add `elIndex` and `i` to `factory` task attribute expressions.
- Add object variables to `expressions`.
- Add one-dimension indices access to array variable to `expressions`.
- Add default values to `chart-tasks`.
- each gallery example has a `index-online.html` using links for online ABeamer.
- Add `easings-gallery`.
- Add to `gulp build-gallery-release` "try it online" link.

### Changed
- npm `package.json` points to main repo.

## [0.2.13] -
- A version bump was required due using npm publish with `npm@5.6.0`. See [0.2.10].


## [0.2.12] -
### Fixed
- Fix `abeamer create .` and `abeamer create`.
- Fix command line error messages.
- Fix `gallery-release` links in order to allow to override a created project.
- (DEV) Fix `gulp update-gallery-scripts`.
- Fix `abeamer render --inject` plugins.
- Fix the creation of `gallery-release/remote-server/code.zip`.
- Fix adding `assets` folder to `gallery-release/remote-server`.

### Added
- Add extra file and directory exists tests to `server-agent`.
- Add more examples to the command line documentation.

### Changed
- (DEV)`gulp build-release` makes `chmod u+x` for `cli/abeamer-cli.js`.
- Set gallery html files spacing to 2 spaces.
- Update `teleporter` documentation.
- Improve the `README.md` files.


## [0.2.11] -
### Changed
- Improve `README.md`.
- Improve documentation.

### Added
- Add more utility functions to `expressions`.
- Add `virtualAnimators`.
- First version of `chart-tasks`.


## [0.2.10] -
- This version was used to overcome a critical bug on `npm publish` in `npm@5.6.0`
that fails to find the README.md, and it's not possible to update to
npm@6.1.0 because it has a critical bug on `npm update`, plus countless false positives
in `npm audit`.  
Until npm team finds an acceptable solution it will be used `npm@5.6.0` for all except for `npm publish`.


## [0.2.9] -
### Added
- Add `width-height` as dual-property to `Adapters`.
- Add numerical arrays to `expressions`.
- Add array binary operators to `expressions`.

### Fixed
- Paths support expression paths.


## [0.2.8] -
### Fixed
- Fix running in JSFiddle by executing `_initBrowser();` during `story.constructor`.

### Added
- Add the `playground` to `README.md`.
- Add `normalize.css` to `hello-world` example.


## [0.2.7] -
### Changed
- Relax the `abeamer create` to support a project names with spaces and non-latin characters.
- If `server-agent-puppeteer` has `page.goto` it logs the error.
- (DEV)`gulp bump-version` checks for error conditions of badge creation.
- `abeamer create` checks if the project name already exists, and throws error if is true.
- `abeamer create` if project name has a path component it does `mkdirp`.
- rebranding.

### Added
- Add `.webm` and `.avi` outputs to `abeamer movie`.

### Fixed
- Fix web links.


## [0.2.6] -
### Fixed
- `abeamer-cli` converts exception into `console.error` messages.

### Added
- Add `.webm` and `.avi` outputs to `abeamer movie`.
- Add `--loop` parameter to define the number of loops to `abeamer gif`.
- Add animated badges to `README.md`.

## [0.2.5] -
### Fixed
- Fix the case where a pixel property has previous animation and has no `valueStart`.
- Fix documentation badges.

### Changed
- (DEV) `pEls` no longer needs to use `laserMarker`.
- (DEV) Remove several unused vars.
- Improve `gulp bump-version`.

### Added
- Add `advance` parameter to animations and property animations.
- Add badges to the `README.md`.
- Add `color-functions` to documentation.


## [0.2.4] -
### Fixed
- Created a workaround to overcome `github` and `npm` striping `video` tag.


## [0.2.3] -
### Fixed
- Fix `README.md`.
- Improve `_waitForMediaSync` to wait for video ready to play and finish seek, only when is ready.
- `video-sync` Flyover support `serverRender` param to disable if `hasServer`.
- Fix `/gallery/animate-video-sync/js/main.ts` duration.

### Added
- (DEV) `npm serve-with-dirs` also lists 'index.html', 'README.md' files.
- Add more info about the command line utility to the documentation.
- `gulp build-gallery-release` can add video to its `README.md` instead of gifs.
- Add `gulp clean-gallery-png`.
- Add `--bkg-movie` option to blend a movie with a transparent image sequence to `abeamer-cli movie`.

### Changed
- Set default movie name generated by `abeamer-cli movie` to `story.mp4`.


## [0.2.2] -
### Fixed
- Fix `gallery/animate-workbench` top value parameter.
- Add extra info to gallery examples to improve browser compatibility.
- Improve browser compatibility in `Adapter` and `interpolator`.
- Fix missing devDependencies.

### Added
- Add logical `and`, or `or` to `expressions`.
- Add comment before injecting the plugins to `abeamer-cli create`.
- (DEV) Declare function return `void` if it didn't had a return value.
- `abeamer serve --dirs` define the body colors (fixes a problem on firefox with dark themes)

### Changed
- Set `scene1` instead of `scene0` to `hello-world` example.
- Improve documentation.
- Improve `build-docs`: remove README.md, generate logs, improve generation of `api-header`.
- Remove `TransitionFuncHandler`.


## [0.2.1] -
### Added
- Raise an exception if `value` parameter isn't number nor expression.
- Add `gallery/animate-video-sync`.

### Changed
- Set `div` instead of `p` to `hello-world` example.
- `gulp build-gallery-release` clean `gallery-release` before copy all the examples.
- Improve `hello-world` example.

### Fixed
- Fix `radiusY` parameter in `ellipse` path.
- Fix `gulp build-docs` link parser.
- Fix `server-agent-phantomjs`.
- Minor cosmetic improvements on gallery examples.


## [0.2.0] -
### Breaking changes
- Change `isExpression` to `isExpr`.
- Remove `vars.defaultDuration`.
- Change `DEFAULT_DURATION` to immutable `1f`.
- Move `rgb` function to `color-functions` plugin.
- Change `typewriter` text task cursor parameterization to a similar way of CSS properties.

### Changed
- (DEV) Harmonize the internal call parameters.
- Set `parseTimeHandler` to public.
- Set `calcExpr`, `ifExprCalc`, `ifExprCalcNum` to public.
- Remove `defaultDuration` from the gallery.
- Improve cross-browser CSS support.
- Adapters have access to ABeamerArgs.
- Redesign the render loop to support wait functions.
- Improve `README.md`.
- Redesign `gallery/animate-speech`.

### Added
- (DEV) Add plugins to `exact` framework.
- (DEV) Add `teleport.sh` test script.
- Add `DEFAULT_FADE_DURATION = '400ms'`.
- Add `color-functions` plugin with `rgb` and `rgba` functions.
- `_DOMElementAdapter` can sync HTMLMediaElement `currentTime` property.
- `_DOMElementAdapter` check if `img` `src` is loaded, if not adds `waitFor` to wait until loaded.
- Add First implementation of custom `waitFor`.
- `_DOMElementAdapter` handle Animation property waitFor parameter.

### Fixed
- Fix `gulp build-gallery-gifs` links.
- Improve CSS properties teleportation.


## [0.1.6] -
### Changed
- Improve the `gulp bump-version`.

### Added
- Add `npm before-*` commands to reduce the errors when abeamer is published.


## [0.1.5] -
### Added
- Add Easings, Oscillator and Path handlers by Id.
- Lists command line utility options in the dash format.
- Add print `http://localhost:${port}/?dir` to `abeamer serve --list-dir`.
- `abeamer serve --list-dir` sorts the listing, and places directory names first.
- Add `class` property animation.
- `gulp build-docs*` and `build-gallery-release` with local and online links.
- `gulp README-*` converts `README.md` links to local or online.
- Improve documentation.

### Fixed
- Fix `gallery/localization` text label.


## [0.1.4] -
### Fixed
- Fix typings.


## [0.1.3] -
### Fixed
- Fix `hello-world/main.scss` clip-path.


## [0.1.2] -
### Fixed
- Fix `.npmignore`.


## [0.1.1] -
### Fixed
- Fix links and fixed phrases in documentation.


## [0.1.0] -
- First Release
