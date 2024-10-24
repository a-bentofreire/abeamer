"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    10
  );
  const scene1 = story.scenes[0];
  scene1.addStills("0.5s");
  const storyPels = scene1.pElsFadeIn("#storyTxt");
  scene1.addStills("1s");
  const justPels = scene1.pElsFadeIn("#just");
  scene1.addStills("1s");
  justPels.fadeOut("100ms");
  scene1.pElsFadeOut("#storyTxt", "0.5s");
  const aPls = scene1.pElsHide("#a");
  scene1.addAnimations([{
    // [TOPIC] uses aPls as a selector, but it's not teleportable.
    selector: !story.isTeleporting ? aPls : "#a",
    duration: 1,
    props: [{
      prop: "text",
      valueFormat: "BUT A"
    }, {
      prop: "visible"
    }]
  }]);
  storyPels.fadeIn("0.2s");
  scene1.addAnimations([{
    // [TOPIC] uses aPls as a selector, but it's not teleportable.
    selector: !story.isTeleporting ? justPels : "#just",
    duration: 1,
    props: [{
      prop: "text",
      valueFormat: "CAN CHANGE"
    }, {
      prop: "visible"
    }, {
      prop: "opacity",
      duration: "0.4s"
    }]
  }]);
  scene1.addStills("0.5s");
  const endPels = scene1.getPEls("#world, #img");
  endPels.fadeIn("2s");
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
