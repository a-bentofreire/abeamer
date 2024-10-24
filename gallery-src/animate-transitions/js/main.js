"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    20
    // uncomment the code line bellow to create a `getStoryToTeleport`.
    // For testing purposes, just run `abeamer render --teleport`
    // read more details on teleport documentation.
    // { toTeleport: true }
  );
  story.metadata.comments = ["My first project"];
  const scene1 = story.scenes[0];
  scene1.addAnimations(
    [
      {
        // pac-man
        selector: "#scene1-img",
        duration: "2s",
        props: [
          {
            // moves the actor
            prop: "left",
            value: 100
          },
          {
            // makes it look like is looking back and forth
            prop: "transform",
            oscillator: {
              handler: "harmonic",
              params: {
                cycles: 2
              }
            },
            valueStart: 0,
            valueText: "='scaleX(' + iff(t < 0, -1, 1) + ')'"
          }
        ]
      },
      {
        // increases the score
        selector: "#pac-score",
        duration: "2s",
        props: [{
          prop: "text",
          easing: "easeOutQuad",
          valueStart: 100,
          valueFormat: "%d",
          value: 500
        }]
      }
    ]
  );
  const scene2 = story.scenes[1];
  scene2.addAnimations([
    {
      selector: "#scene2-img1",
      duration: "2s",
      props: [
        {
          prop: "left",
          duration: "1s",
          value: 133,
          iterationCount: 2,
          direction: ABeamer.Directions.alternate
        },
        {
          prop: "top",
          duration: 1,
          position: "1s",
          value: "+5"
        },
        {
          prop: "src",
          duration: 5,
          iterationCount: 10,
          valueText: ["assets/pixabay/invader-42007_640-A.png", "assets/pixabay/invader-42007_640-AB.png"]
        }
      ]
    },
    {
      selector: "#scene2-img2",
      props: [
        {
          prop: "left",
          duration: "1s",
          value: 5,
          iterationCount: 2,
          direction: ABeamer.Directions.alternate
        }
      ]
    }
  ]);
  const scene3 = story.scenes[2];
  scene3.addStills("1s").addAnimations([
    {
      selector: "#player1",
      duration: "1s",
      tasks: [{
        handler: "typewriter",
        params: {
          text: "Animation 50pts"
        }
      }]
    },
    {
      selector: "#player2",
      duration: "1s",
      tasks: [{
        handler: "typewriter",
        params: {
          text: "Beamer 50pts"
        }
      }]
    }
  ]).addStills("1s");
  const scene4 = story.scenes[3];
  scene4.addStills("1s");
  scene1.transition = {
    handler: ABeamer.StdTransitions.slideLeft,
    duration: "1s"
  };
  scene2.addAnimations([{
    tasks: [
      {
        handler: "scene-transition",
        params: {
          handler: ABeamer.StdTransitions.slideTop,
          duration: "1s"
        }
      }
    ]
  }]);
  scene3.transition = {
    handler: "slideRight",
    duration: "1s"
  };
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
