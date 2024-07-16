
Read a detailed description about the roadmap updates on the blog [post](https://abeamer.devtoix.com/blog/2018/07/04/website-published-roadmap-updates.html#roadmap-updates).

## General

- Research how to fix vsc max file watcher problem.
- Research on the side-effects of no longer using `clip-path` on body to allow to add widgets and toolbars to the ABeamer.
- Port core parts to plugins.

### Teleportation
- Create a complete example of how to send to teleport and receive in the server side.
- Add setup parameters to the teleported story.
- Add video sync information to the teleported story.

### Client Rendering
- Bypass frames if the time for that frame is too delayed, allowing ABeamer to be used as a real-time animator.
- Implement reversibility to allow to reverse rendering from the end to beginning
and to allow reverse bypass the pipeline to allow to repeat an animation.

### Server Rendering
- Research how to disable Chrome auto-play policy on puppeteer.
- Research why the render frames on the server rendering don't match the client rendering.
- Research why the slow fonts don't always render (chrome font fallback feature).
- Research on distributed rendering.

### Builders
- Add abeamer library and plugins to each gallery/latest.

### Documentation
- Fix the JSDocs parser bug in the documentation generator.
- Add methods and property description to interfaces and classes.
- Transform the code tag of interfaces/classes/types to html tags in order to improve syntax highlighting
and have linkable code.
- Add tooltips to property types inside the generated code.
- Add more information to each user function.

### Add Animations Phase
- Allow to filter and remap urls.
- Improve Wait for assets load and sync support.
- Test more cases when isn't the first animation of a property in order to
ensure it can properly read the end value of the previous animation and is able to guess the correct type.

### Video sync
- Add `storyStart`, `storyEnd`, `videoStart` and `videoEnd` multiple segment parameters.
- Research more about video sync by using canvas API.

### Expressions
- Implement `not` operator.
- Implement `power` operator.
- Add more functions and operators to Numeric Arrays.
- Implement compiled expressions for faster access.

### Adapters
- Implement teleportable canvas adapter.
- Implement teleportable SVG adapter.

### General Tasks
- Improve `factory` task in order to be more dynamic.
- Make the `factory` task destroy the generated html code if it's reverse rendering/bypassing.
- Implement `repeater` task.
- Implement `tracer` as SVG generator in order to create a dynamic svg path that adds points
as `t` iterator increases.
- Implement `slide` task for elements.
- Implement `playback-controls` task to test reversibility.

### Charts
- Decouple LabelsX from data series and support define LabelsX tick parameters.
- Implement position=bottom to Legend.
- Implement Horizontal vs Stacked Legend.
- Improve the calculation of the number of digits for Labels.
- Support Teleportable canvas adapter to extend the drawing capabilities.
- Support labels on data series.

### Shapes
- Improved Shape task with animation support.
- Implement Arrow shape task.
- Make the `shape` task destroy the generated html code if it's reverse rendering/bypassing.

### Paths
- Implement Segmenter path.
- Implement Polyline path.

### Attacks
- Implement Glitch attack task.
- Implement Color band attack task.

### Functions
- Add more functions to `datetime-functions` plugin.
- Add more functions to `format-functions` plugin.
- Add more functions to `color-functions` plugin.

### Text tasks
- Improve the typewriter to allow to add and remove text.
- Implement 3D text by using multiple shadows to simulate the effect.
- Implement `punch-text` creating the effect of the text has been hit with a punch.

### Oscillators
- Cut parameters for harmonic oscillator.

### Gallery
- animate-abeamer: fix the text centering.
- easings-gallery: add a tracer to improve the visibility of the path followed by the easing.
- animate-pulsar: add a tracer to improve the visibility of the path followed by the pulsar.
- animate-transition: improve the generate quality of this example.
- animate-virtual: improve the generate quality of this example.
- animate-flyover: format the output so it doesn't keeps changing the number of digits.

## In a study phase

- Electron container.
- Audio support.
- Teleportable non-default scenes.
