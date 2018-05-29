$(window).on("load", () => {
  const story: ABeamer.Story = ABeamer.createStory(/*FPS:*/20);

  const scene0 = story.scenes[0];
  scene0.addAnimations([{
    selector: '#hello',
    props: [{
      prop: 'left',
      value: 100,
    }],
  }]);

  story.render(story.bestPlaySpeed());
});
