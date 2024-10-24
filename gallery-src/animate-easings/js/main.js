"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    20
  );
  const d = "2s";
  const scene1 = story.scenes[0];
  scene1.addAnimations([{
    selector: "#text",
    duration: d,
    props: [{
      prop: "left",
      value: 9,
      easing: "easeOutBounce"
    }]
  }]).addStills("1s").addAnimations([{
    selector: "#text",
    duration: d,
    props: [{
      prop: "left",
      value: -270,
      easing: "easeOutCubic"
    }]
  }, {
    selector: "#text2",
    duration: d,
    props: [{
      prop: "left",
      value: 10,
      easing: "easeInExpo"
    }]
  }]).addStills("1s").addAnimations([{
    selector: "#text2",
    duration: d,
    props: [{
      prop: "left",
      value: -280,
      easing: "easeOutQuart"
    }]
  }, {
    selector: "#text3",
    duration: d,
    props: [{
      prop: "left",
      value: 4,
      easing: "easeOutBack"
    }]
  }]).addStills("1s").addAnimations([{
    selector: "#text3",
    duration: d,
    props: [{
      prop: "left",
      value: -280,
      easing: "easeInBack"
    }]
  }, {
    selector: "#text4",
    duration: d,
    props: [{
      prop: "left",
      value: 4,
      easing: "easeInExpo"
    }]
  }]).addStills("1s");
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
