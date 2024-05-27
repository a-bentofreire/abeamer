"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const dates = [
    { var: 'now', label: 'now', expr: `=now()` },
    { var: 'strDt', label: `'1974-04-25 12:20:10'`, expr: `=date('1974-04-25 12:20:10')` },
    { var: 'numDt3', label: 'date(1985,6,12)', expr: `=date(1985,6,12)` },
    { var: 'numDt6', label: 'date(1755,11,1,9,40,0)', expr: `=date(1755,11,1,9,40,0)` },
  ];

  const dateTimeFuncs = ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Second'];

  const formats = ['YYYY-MM-DD HH:mm:ss', 'ddd, MMM D (YY) hA'];

  // add as many scenes as labels
  $('#story').html(dates.map((_label, sceneIndex) =>
    `<div class="abeamer-scene" id=scene${sceneIndex}></div>`).join('\n'));


  const animations: ABeamer.Animation[][] = [];
  const vars = {};

  dates.forEach((date, sceneIndex) => {
    const injectHtml = [`<div class=label>${date.label}</div>`];

    const tests = dateTimeFuncs.map(sel => {
      return {
        sel,
        label: sel + ': ',
        classes: '',
        expr: `=${sel.toLowerCase()}(${date.var})`,
      };
    });


    formats.forEach((format, index) => {
      tests.push({
        sel: `format${index}`,
        classes: 'format',
        label: format,
        expr: `=formatDateTime('${format}', ${date.var})`,
      });
    });

    vars[date.var] = date.expr;

    animations.push(tests.map(rec => {
      injectHtml.push(`<span class="${rec.classes}">${rec.label}<span id=${rec.sel}></span></span>`);
      return {
        selector: `#${rec.sel}`,
        props: [{
          prop: 'text',
          valueText: rec.expr,
        }],
      };
    }));

    $(`#scene${sceneIndex}`).html(injectHtml.join('\n'));
  });


  const story: ABeamer.Story = ABeamer.createStory(/*FPS:*/10);

  // ------------------------------------------------------------------------
  //                               Scene
  // ------------------------------------------------------------------------

  let scene: ABeamer.Scene;
  scene = story.scenes[0];

  scene
    .addAnimations([{
      tasks: [{
        handler: 'add-vars',
        params: {
          allowExpr: true,
          vars,
        } as ABeamer.AddVarsTaskParams,
      }],
    }]);


  const wait = 1.6 * 2;
  dates.forEach((_date, sceneIndex) => {
    scene = story.scenes[sceneIndex];
    scene
      .addAnimations(animations[sceneIndex])
      .addStills(`${wait}s`);

    if (sceneIndex < dates.length - 1) {
      scene.transition = {
        handler: ABeamer.StdTransitions.slideLeft,
        duration: `${wait / 2}s`,
      };
    }
  });



  story.render(story.bestPlaySpeed()/* , { renderCount: wait * 10 * 3 - 4 } */);
});
