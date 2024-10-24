# Description

This is the developer version of the gallery folder.

This folder contains a list of examples of ABeamer with the following goals:
- Highlight a particular ABeamer feature.
- To be as simple as possible, in order the user can reproduce each step.
- To be eye catching.
- To be able to generate a small file size animated gif.

To be eye catching and to be simple work on opposite directions,
and that is where it lies the talent of the creator.

## Guidelines

Each example should have the following:
- Base Files: abeamer.ini, index.html, js/main.(ts|js), css/main.(scss|.min.scc)
- Asset Files: assets folder
- All 3rd party files must be inside a folder named vendor
- A small description inside abeamer.ini file, on the field called $abeamer-description
    Use \n to split description
- Declaring if requires live server, on field $abeamer-uses-live, on abeamer.ini file
- Declaring if is excluded from the gallery-release on ./exclude-from-release.json
- Be written in TypeScript
- Have a UUID

## How to generate release version

To generate the release version, execute: `npx gulp build_gallery_release`
