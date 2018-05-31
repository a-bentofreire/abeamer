# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.0] -
### Breaking changes
- `isExpression` becomes `isExpr`.
- `vars.defaultDuration` removed.
- `DEFAULT_DURATION` becomes immutable `1f`.
- `rgb` function moves into color-functions plugin.

### Changed
- (DEV)Harmonization of internal call parameters.
- `parseTimeHandler` becomes public.
- `calcExpr`, `ifExprCalc`, `ifExprCalcNum` becomes public.
- Removed `defaultDuration` from the gallery.
- (DEV)exact framework supports plugins.
- Improved cross-browser CSS support.
### Added
- Added `DEFAULT_FADE_DURATION = '400ms'`.
- Added `color-functions` plugin with `rgb` and `rgba` functions.
- (DEV)Added `teleport.sh` test script.
### Fixed
- Fixed `gulp build-gallery-gifs` links.


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
