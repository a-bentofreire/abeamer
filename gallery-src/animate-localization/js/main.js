"use strict";
$(window).on("load", () => {
  ABeamer.pluginManager.addLocalization({
    locale: "pt_PT",
    functionalities: [[ABeamer.Functionalities.functions, [
      { src: "sin", dst: "sen" },
      { src: "iff", dst: "se" }
    ]]],
    messages: {
      /* spell-checker: disable */
      MustNatPositive: "O valor de %p% tem de ser um n\xFAmero natural positivo"
    }
  });
  const story = ABeamer.createStory(
    /*FPS:*/
    8
  );
  const d = "2s";
  const scene1 = story.scenes[0];
  scene1.addAnimations([{
    selector: "#dot",
    duration: d,
    props: [{
      prop: "top",
      oscillator: {
        handler: "=sin(t*pi*4)"
      },
      valueStart: "=frameHeight/2 +'px'",
      value: "=frameHeight/2-20"
    }, {
      prop: "left",
      value: "=frameWidth-10"
    }]
  }]).addAnimations([{
    selector: "#title, #expr",
    props: [{
      prop: "text",
      duration: 1,
      // Portuguese iff = se
      valueText: "=se(elIndex==0,'Portugu\xEAs', '\\'=sen(t)\\'')"
    }]
  }, {
    selector: "#dot",
    duration: d,
    props: [{
      prop: "top",
      oscillator: {
        // Portuguese sin = sen
        handler: "=sen(t*pi*4)"
      },
      valueStart: "=frameHeight/2 +'px'",
      value: "=frameHeight/2-20"
    }, {
      prop: "left",
      valueStart: "10px",
      value: "=frameWidth-10"
    }]
  }]);
  story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map
