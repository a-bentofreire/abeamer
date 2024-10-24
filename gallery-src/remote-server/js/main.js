"use strict";
$(window).on("load", () => {
  ABeamer.createStoryFromConfig(
    "story.json",
    (story) => {
      story.render(story.bestPlaySpeed());
    }
  );
});
//# sourceMappingURL=main.js.map
