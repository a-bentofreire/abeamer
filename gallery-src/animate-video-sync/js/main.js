"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    20
  );
  const scene1 = story.scenes[0];
  scene1.addAnimations(
    [{
      selector: "#wow",
      props: [
        {
          prop: "font-size",
          duration: "4.72s",
          value: 60,
          oscillator: {
            handler: "damped"
          }
        }
      ]
    }]
  );
  story.addFlyover("video-sync", {
    selector: "#video",
    serverRender: false
  });
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
