# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.4.0] -
### Changed
- Documentation breadcrumbs points to new links.
- Documentation uses a custom theme based on mkdocs.
- Updated Documentation favicon.
### Added
- Added Google Analytics to Documentation.
### Added
- (DEV) Added array and object type to command line parameters.
- `abeamer render` can pass `--render-var` parameters to client lib as `args.renderVars`.
- `story.args` is exposed as readonly property to allow to access `renderVars`.
- `gallery/animate-badges` reads parameters via `--render-vars`.

## [0.3.2] -
### Changed
- Improved documentation.
- Added website information.


## [0.3.1] -
### Fixed
- (DEV) Fixed the `gulp README-to-local` and `gulp README-to-online`.
- (DEV) Fixed code examples on JSDocs for `gulp build-docs`.
- (DEV) Fixed the tests that had errors.
- Fixes the chart legend color for `line` charts.
- Fixes the chart y-labels when there is not enough y-space created by labelsX.
### Changed
- (DEV) `npm run test-all-serial` runs all the tests in serial.
### Added
- `gulp build-docs` adds links for property and method classes.
- Added functions: `log`, `log10` and `exp`.
- Added expression series in `charts`.


## [0.3.0] -
### Breaking changes
- `chart` parameters are incompatible.
### Fixed
- Fixed several `chart` bugs.
### Added
- Added many features to the `charts`.
- Added `parseEnum` utility function.
- Added `elIndex` and `i` to `factory` task attribute expressions.
- expressions support object variables.
- expressions support one-dimension indices access to array variable.
- `chart` support default values.
- each gallery example has a `index-online.html` using links for online ABeamer.
- Added `easings-gallery`.
- `gulp build-gallery-release` adds "try it online" link.
### Changed
- npm package.json points to main repo.

## [0.2.13] -
- A version bump was required due using npm publish with npm@5.6.0. See [0.2.10].


## [0.2.12] -
### Fixed
- Fixed `abeamer create .` and `abeamer create`.
- Fixed command line error messages.
- Fixes `gallery-release` links in order to allow to override a created project.
- (DEV) Fixes `gulp update-gallery-scripts`.
- Fixes `abeamer render --inject` plugins.
- Fixes the creation of `gallery-release/remote-server/code.zip`.
- Fixes adding `assets` folder to `gallery-release/remote-server`.
### Added
- Added extra file and directory exists tests to server-agent.
- Added more examples to the command line documentation.
### Changed
- (DEV)`gulp build-release` makes `chmod u+x` for `cli/abeamer-cli.js`.
- Sets gallery html files spacing to 2 spaces.
- Updated teleporter documentation.
- Improved the `README` files.


## [0.2.11] -
### Changed
- Improved `README.md`.
- Improved documentation.
### Added
- Added more utility functions in `expressions`.
- Added `virtualAnimators`.
- First version of `chart` tasks.


## [0.2.10] -
- This version was used to overcome a critical bug on `npm publish` in npm@5.6.0
that fails to find the README.md, and it's not possible to update to
npm@6.1.0 because it has a critical bug on `npm update`, plus countless false positives
in `npm audit`.
Until npm team finds an acceptable solution it will be used npm@5.6.0 for all except for `npm publish`.


## [0.2.9] -
### Added
- `Adapters` support `width-height` as dual-property.
- Expressions support numerical arrays and binary ops on those arrays.
### Fixed
- Paths support expression paths.


## [0.2.8] -
### Fixed
- `_initBrowser();` is only executed during `story.constructor` in order to work with JSFiddle
- `hello-world` example now has included the normalize.css
### Added
- Added the `playground` to `README.md`.


## [0.2.7] -
### Changed
- Relaxes the `abeamer create` to support a project names with spaces and non-latin characters.
- If `server-agent-puppeteer` has `page.goto` it logs the error.
- (DEV)`gulp bump-version` checks for error conditions of badge creation.
- `abeamer create` checks if the project name already exists, and throws error if is true.
- `abeamer movie` also supports `.webm` and `.avi` outputs.
- `abeamer create` if project name has a path component it does `mkdirp`.
- rebranding.
### Fixed
- fixes web links.


## [0.2.6] -
### Fixed
- `abeamer-cli` converts exception into `console.error` messages.
### Added
- `abeamer movie` also supports `.webm` and `.avi` outputs.
- `abeamer gif` supports `--loop` parameter to define the number of loops.
- `README` supports animated badges.

## [0.2.5] -
### Fixed
- Fixes the case where a pixel property has previous animation and has no `valueStart`.
- Added `color-functions` to documentation.
- Fixes documentation badges.
### Changed
- `pEls` no longer needs to use `laserMarker`.
- (DEV)Removed several unused vars.
- Improved `gulp bump-version`.
### Added
- Added `advance` parameter for both animations and property animations.
- Added badges to the `README.md`.


## [0.2.4] -
### Fixed
- Created a workaround to overcome github/npm striping video tag.


## [0.2.3] -
### Fixed
- Fixes `README.md`.
- Improved `_waitForMediaSync` to wait for video ready to play and finish seek, only when is ready.
- `video-sync` Flyover supports `serverRender` param to disable if `hasServer`.
- Fixes `/gallery/animate-video-sync/js/main.ts` duration.
- `abeamer-cli movie` supports `--bkg-movie` option to blend a movie with a transparent image sequence.
### Added
- (DEV) http-server-ex.ts: `npm serve-with-dirs` also lists 'index.html', 'README.md' files.
- Added more info about the command line utility.
- `gulp build-gallery-release` can add video to `README.md` instead of gifs.
- Added `gulp clean-gallery-png`.
### Changed
- Default movie name generated by `abeamer-cli movie` to `story.mp4`.


## [0.2.2] -
### Fixed
- Fixes `gallery/animate-workbench` top value parameter.
- Added extra info to gallery examples to improve browser compatibility.
- `Adaptor` and `interpolator` improved browser compatibility.
- fixes missing devDependencies.
### Added
- Added logical `and`, or `or` to expressions.
- `abeamer-cli create` adds a comment before injecting the plugins.
- (DEV)declared function return `void` if it didn't had a return value.
- `abeamer serve --dirs` defines the body colors (fixes a problem on firefox with dark themes)
### Changed
- `hello-world` uses `scene1` instead of `scene0`.
- Improved documentation.
- Improved `build-docs`: removes README.md, generates logs, improves generation of `api-header`.
- Removed `TransitionFuncHandler`.


## [0.2.1] -
### Added
- Raises an exception if `value` parameter isn't number nor expression.
- Added `gallery/animate-video-sync`.
### Changed
- `hello-world` example uses `div` instead of `p`.
- `gulp build-gallery-release` cleans `gallery-release` before copy all the examples.
- Improved `hello-world` example.
### Fixed
- Fixes `ellipse` path `radiusY` parameter.
- Fixes `gulp build-docs` link parser.
- Fixes `server-agent-phantomjs`.
- Minor cosmetic improvements on gallery examples.


## [0.2.0] -
### Breaking changes
- `isExpression` becomes `isExpr`.
- `vars.defaultDuration` removed.
- `DEFAULT_DURATION` becomes immutable `1f`.
- `rgb` function moves into color-functions plugin.
- `typewriter` text task cursor is parameterized in similar way to CSS properties.

### Changed
- (DEV)Harmonization of internal call parameters.
- `parseTimeHandler` becomes public.
- `calcExpr`, `ifExprCalc`, `ifExprCalcNum` becomes public.
- Removed `defaultDuration` from the gallery.
- (DEV)exact framework supports plugins.
- Improved cross-browser CSS support.
- Adapters have access to ABeamerArgs.
- Redesigned the render loop to support wait functions.
- Improved `README.md`.
- Redesigned `gallery/animate-speech`.
### Added
- Added `DEFAULT_FADE_DURATION = '400ms'`.
- Added `color-functions` plugin with `rgb` and `rgba` functions.
- (DEV)Added `teleport.sh` test script.
- `_DOMElementAdapter` can sync HTMLMediaElement `currentTime` property.
- `_DOMElementAdapter` checks if `img` `src` is loaded, if not adds `waitFor` to wait until loaded.
- First implementation of custom waitFor.
- `_DOMElementAdapter` handles Animation property waitFor parameter.
### Fixed
- Fixed `gulp build-gallery-gifs` links.
- Improved CSS properties teleportation.


## [0.1.6] -
### Changed
- Improved the bump-version gulp command.
### Added
- Added npm before-* commands to reduce the errors when abeamer is published.


## [0.1.5] -
### Added
- Easings, Oscillator and Path handlers by Id.
- Lists command line utility options in the dash format.
- abeamer serve --list-dir also prints the link with `http://localhost:${port}/?dir`
- abeamer serve --list-dir sorts the listing, and places directory names first.
- Class property animation.
- gulp build-docs* and build-gallery-release with local and online links.
- gulp README-* converts README.md links to local or online.
- improved documentation.
### Fixed
- Fixes gallery/localization text label.


## [0.1.4] -
### Fixed
- Fixed typings.


## [0.1.3] -
### Fixed
- Fixed hello-world/main.scss clip-path.


## [0.1.2] -
### Fixed
- Fixed npmignore.


## [0.1.1] -
### Fixed
- Fixed links and fixed phrases in documentation.


## [0.1.0] -
- First Release
