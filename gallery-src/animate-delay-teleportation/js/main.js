"use strict";
$(window).on("load", () => {
  const story = ABeamer.createStory(
    /*FPS:*/
    20,
    {
      // Uncomment to set into teleportation mode
      //  toTeleport: true, 
      toStartTeleporting: false
    }
  );
  const d = story.args.vars.duration || "3s";
  const json = story.args.vars.json || "acme";
  $.getJSON(`${json}.json`, (data) => {
    $("#name").text(data.name);
    story.startTeleporting();
    const scene1 = story.scenes[0];
    scene1.addAnimations(
      [
        {
          selector: "canvas",
          tasks: [{
            handler: "chart",
            params: {
              chartType: ABeamer.ChartTypes.line,
              animeSelector: "graph",
              data: [data.clicks],
              strokeColors: ["#dd5252"],
              strokeWidth: 2,
              sweepStart: 0.1,
              props: [{}]
            }
          }]
        },
        {
          selector: "%graph",
          duration: d,
          props: [
            {
              prop: "sweep",
              value: 1
            }
          ]
        },
        {
          selector: "#users",
          duration: d,
          props: [
            {
              prop: "text",
              valueStart: 0,
              valueFormat: "%d",
              value: data.users
            }
          ]
        }
      ]
    );
    story.render(story.bestPlaySpeed());
  });
});
//# sourceMappingURL=main.js.map
