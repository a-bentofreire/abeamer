"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    20
  );
  const d1 = "5s";
  const d2 = "1s";
  const scene1 = story.scenes[0];
  scene1.addAnimations([
    {
      selector: "#p2t",
      duration: d1,
      tasks: [{
        handler: "typewriter",
        params: {
          text: "BECOME A SPONSOR",
          cursor: true
        }
      }]
    },
    {
      selector: "#counter",
      duration: d1,
      props: [
        {
          prop: "text",
          easing: "easeInExpo",
          valueText: "=iff(t<1000, floor(t),floor(t/1000)+'k')",
          value: 9e4
        }
      ]
    },
    {
      selector: "#paypal",
      duration: d2,
      props: [
        {
          prop: "left",
          position: "+0s",
          easing: "easeInBounce",
          value: 12
        },
        {
          prop: "left",
          position: "+2s",
          value: 56
        }
      ]
    },
    {
      selector: "#bitcoin",
      duration: d2,
      props: [
        {
          prop: "left",
          position: "+3s",
          easing: "easeInBounce",
          value: -10
        },
        {
          prop: "left",
          position: "+5s",
          value: 56
        }
      ]
    }
  ]).addStills("0.5s");
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
