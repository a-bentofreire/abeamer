# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.4.0] -
### Breaking changes
- `abeamer render` `--width` and `--height` parameter override abeamer.ini/story.json definition
  and override story CSS dimension properties.

### Changed
- Documentation breadcrumbs points to new links.
- Documentation uses a custom theme based on mkdocs.
- Update Documentation favicon.
- `gallery/animate-badges` read parameters via `--render-vars`.
- (DEV) Set The `README` gif loops more times and waits longer between loops.
- (DEV) Refactor set width/height in story.constructor.
- Change from fixed to dynamic dimensions in `animate-badges/main.scss`.

### Added
- Add Google Analytics to Documentation.
- (DEV) Add array and object type to command line parameters.
- `abeamer render` can pass `--render-var` parameters to client lib as `args.renderVars`.
- `story.args` is exposed as readonly property to allow to access `renderVars`.
- Add `duration`, `wait`, `name-background-color`, `value-background-color` to `gallery/animate-badges`.
- Add `name-width` to `gallery/animate-badges`.
- Add all parameters to the serverless pageUrl output in `abeamer render`.

### Fixed
- Fix `ChartLegend` in `chart-tasks` that had required typing `mark` parameter.


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
- npm package.json points to main repo.

## [0.2.13] -
- A version bump was required due using npm publish with npm@5.6.0. See [0.2.10].


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
- This version was used to overcome a critical bug on `npm publish` in npm@5.6.0
that fails to find the README.md, and it's not possible to update to
npm@6.1.0 because it has a critical bug on `npm update`, plus countless false positives
in `npm audit`.
Until npm team finds an acceptable solution it will be used npm@5.6.0 for all except for `npm publish`.


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
- Created a workaround to overcome 'github' and 'npm' striping video tag.


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
- (DEV) Harmonize of internal call parameters.
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
