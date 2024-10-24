"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    1
  );
  const scene1 = story.scenes[0];
  scene1.addAnimations(
    [{
      selector: "#l4klogo",
      // use only 4 frames because it generates very large images
      duration: "4f",
      props: [
        {
          prop: "right",
          easing: "linear",
          value: 5
        }
      ]
    }]
  );
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
