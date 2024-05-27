<!--- @ -->
<!--- @author: Alexandre Bento Freire -->
# Description

ABeamer is designed to be able to freeze the properties of each element in a scene for every frame and send it frame by frame to be stored in the disk, on a similar manner that video editors operate while taking the advantage of the browser tools and web designer skills.   
To archive this goal, it splits the story, representing the whole animation, into scenes.  
Each scene has its own animation pipeline, which it will be later rendered.   

If you know already the basics of adding animations, jump into  
[Understanding the pipeline](#understanding-the-pipeline)

## Animation Pipeline

The animation pipeline is built by adding animations via:   
```js
  scene.addAnimations(<animation list>);
```  
This method will add a list of parallel animations to the pipeline.   
A typical use would be:   
```js
  scene0.addAnimations([{
    selector: '#hello',
    duration: '2s',
    props: [{
      prop: 'left',
      value: 100,
    },
    {
      prop: 'top',
      value: 100,
    }],
  }]);
```
In this example, `#hello` will move will move `left` and `top` property for 2s.   

Each element and each property can have a different `duration`.   
```js
  scene0.addAnimations([{
    selector: '#hello',
    duration: '1s',
    props: [{
      prop: 'left',
      value: 100,
    },
    {
      prop: 'top',
      duration: '1500ms',
      value: 100,
    }],
  },
  {
    selector: '#world',
    props: [
    {
      prop: 'left',
      duration: '3s',
      value: 100,
    }],
  }]);
```
In the example above, after this method, the pipeline will be 3s longer, since 3s it's the longest animation in this addition.  
  
Animations can be off-sync by using `position` property.  
```js
  scene0.addAnimations([{
    selector: '#hello',
    duration: '2s',
    props: [{
      prop: 'left',
      value: 100,
    },
    {
      prop: 'top',
      position: '+1s',
      value: 100,
    }],
  }]);
```
In the example above, the `top` property only starts being animated 1s later, therefore in this example the total duration is 3s.  
  
The position can also be set to negative values, allowing to start the animation before the current end point.  
  
To add animations in series use:  
```js
scene0.addSerialAnimations([[{
    selector: '#hello',
    duration: '1s',
    props: [{
      prop: 'left',
      value: 100,
    }],
  }],[
  {
    selector: '#world',
    props: [
    {
      prop: 'left',
      duration: '3s',
      value: 100,
    }],
  }]]);
```
This will a series of parallel animations.  
  
## Understanding the pipeline

When the user adds an animation to the scene, ABeamer will first determine 
the start value of the [property](faq.md#why-addanimation-uses-properties-naming-and-not-attributes-), 
if the user doesn't provides the `startValue`, it will compute from the current element's CSS property value.  
Then it will transform the duration into frames, and for each frame, 
it will compute and store the interpolated value for that element.  
If a new `addAnimations` is added that modifies the same elements' property, 
the last stored value is used as the new starting value.  
  
In essence, the animation pipeline **doesn't modifies** the current elements' property, 
only computes the expected values for each frame.  
This method has the benefit of:  
  
- Supports [teleporting](teleporter.md).   
- Allow [off-sync](glossary.md#off-sync) animations, where a new animation can insert at any point in the pipeline.   
- Generate complex computations not built for rendering.   
- Bypass parts of the animation, where only segments of the whole animation are rendered.   
- Support reverse rendering.   
