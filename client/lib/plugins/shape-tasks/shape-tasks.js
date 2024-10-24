"use strict";
var ABeamer;
((ABeamer2) => {
  let Shapes;
  ((Shapes2) => {
    Shapes2[Shapes2["rectangle"] = 0] = "rectangle";
    Shapes2[Shapes2["line"] = 1] = "line";
    Shapes2[Shapes2["circle"] = 2] = "circle";
    Shapes2[Shapes2["speech"] = 3] = "speech";
  })(Shapes = ABeamer2.Shapes || (ABeamer2.Shapes = {}));
  ABeamer2.DEFAULT_SPEECH_START = 10;
  ABeamer2.DEFAULT_SPEECH_WIDTH = 10;
  ABeamer2.DEFAULT_SPEECH_HEIGHT = 10;
  ABeamer2.DEFAULT_SPEECH_SHIFT = 0;
  let SpeechPosition;
  ((SpeechPosition2) => {
    SpeechPosition2[SpeechPosition2["left"] = 0] = "left";
    SpeechPosition2[SpeechPosition2["right"] = 1] = "right";
  })(SpeechPosition = ABeamer2.SpeechPosition || (ABeamer2.SpeechPosition = {}));
  pluginManager.addPlugin({
    id: "abeamer.shape-tasks",
    uuid: "3e5d5813-348a-4eb1-a8b5-9c87c3988923",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/shape-tasks/shape-tasks.js"],
    teleportable: true
  });
  pluginManager.addTasks([["shape", _shapeTask]]);
  function _shapeTask(anime, _wkTask, params, stage, args) {
    function buildSvg(inTextHtml, shapeTag, width, height, attrs, x0 = 0, y0 = 0) {
      inTextHtml.push(` width="${width}"`);
      inTextHtml.push(` height="${height}"`);
      inTextHtml.push(` viewBox="${x0} ${y0} ${width} ${height}"`);
      inTextHtml.push(` ><${shapeTag}`);
      attrs.forEach((attr) => {
        const [name, value] = attr;
        if (value !== void 0) {
          inTextHtml.push(` ${name}="${value}"`);
        }
      });
    }
    function buildRectangle(inTextHtml, sw, sr) {
      const rw = ExprOrNumToNum(sr.width, 0, args);
      const rh = ExprOrNumToNum(sr.height, 0, args);
      const rx = ExprOrNumToNum(sr.rx, 0, args);
      const ry = ExprOrNumToNum(sr.ry, 0, args);
      buildSvg(
        inTextHtml,
        "rect",
        rw,
        rh,
        [
          ["x", sw],
          ["y", sw],
          ["rx", rx],
          ["ry", ry],
          ["width", rw - 2 * sw],
          ["height", rh - 2 * sw]
        ]
      );
    }
    function buildSpeech(inTextHtml, sw, sp) {
      const w = ExprOrNumToNum(sp.width, 0, args);
      const h = ExprOrNumToNum(sp.height, 0, args);
      const srx = ExprOrNumToNum(sp.rx, 0, args);
      const sry = ExprOrNumToNum(sp.ry, 0, args);
      const x0 = -sw;
      const rx = srx || sry || 0;
      const ry = sry || rx || 0;
      const isRound = rx !== 0 && ry !== 0;
      let speechStart = Math.max(sp.speechStart || ABeamer2.DEFAULT_SPEECH_START, rx);
      const speechWidth = Math.max(sp.speechWidth || ABeamer2.DEFAULT_SPEECH_WIDTH, 0);
      const speechHeight = sp.speechHeight || ABeamer2.DEFAULT_SPEECH_HEIGHT;
      let speechShift = sp.speechShift || ABeamer2.DEFAULT_SPEECH_SHIFT;
      const path = [];
      if (!sp.speechPosition || sp.speechPosition === 0 /* left */ || SpeechPosition[sp.speechPosition] === "left") {
        speechShift = -speechShift - speechWidth;
        speechStart = w - speechStart - speechWidth;
      }
      path.push(`M${rx} 0 H${w - rx}`);
      if (isRound) {
        path.push(`A ${rx} ${ry} 0 0 1 ${w} ${ry}`);
      }
      path.push(`V${h - ry}`);
      if (isRound) {
        path.push(`A ${rx} ${ry} 0 0 1 ${w - rx} ${h}`);
      }
      path.push(`h${-speechStart}`);
      path.push(`l${speechShift} ${speechHeight}`);
      path.push(`l${-speechWidth - speechShift} ${-speechHeight}`);
      path.push(`H${rx}`);
      if (isRound) {
        path.push(`A ${rx} ${ry} 0 0 1 0 ${h - ry}`);
      }
      path.push(`V${ry}`);
      if (isRound) {
        path.push(`A ${rx} ${ry} 0 0 1 ${rx} 0`);
      }
      buildSvg(
        inTextHtml,
        "path",
        w + 2 * sw,
        h + speechHeight + 2 * sw,
        [["d", path.join(" ")]],
        x0,
        -sw
      );
    }
    function buildArrow(inTextHtml, sa, isArrow) {
      let x = ExprOrNumToNum(sa.x, 0, args);
      let y = ExprOrNumToNum(sa.y, 0, args);
      let x0 = 0;
      let y0 = 0;
      let radDir;
      let len;
      if (params.direction) {
        radDir = ExprOrNumToNum(sa.direction, 0, args) * Math.PI / 180;
        len = ExprOrNumToNum(sa.length, 0, args);
        x = Math.cos(radDir) * len;
        y = Math.sin(radDir) * len;
      } else {
        if (isArrow) {
        }
      }
      x0 = Math.min(0, x);
      y0 = Math.min(0, y);
      buildSvg(
        inTextHtml,
        "line",
        Math.abs(x),
        Math.abs(y),
        [["x1", 0], ["y1", 0], ["x2", x], ["y2", y]],
        x0,
        y0
      );
    }
    switch (stage) {
      case TS_INIT:
        const sw = ExprOrNumToNum(params.strokeWidth, 0, args);
        const shape = parseEnum(params.shape, Shapes, 0 /* rectangle */);
        const inTextHtml = [`<svg`];
        switch (shape) {
          case 0 /* rectangle */:
            buildRectangle(inTextHtml, sw, params);
            break;
          case 1 /* line */:
            buildArrow(inTextHtml, params, false);
            break;
          case 2 /* circle */:
            const r = ExprOrNumToNum(params.radius, 0, args);
            const r_sw = r + sw;
            buildSvg(
              inTextHtml,
              "circle",
              2 * r_sw,
              2 * r_sw,
              [["cx", r_sw], ["cy", r_sw], ["r", r]]
            );
            break;
          case 3 /* speech */:
            buildSpeech(inTextHtml, sw, params);
            break;
          default:
            return TR_EXIT;
        }
        if (params.fill) {
          inTextHtml.push(` fill="${params.fill}"`);
        }
        if (params.stroke) {
          inTextHtml.push(` stroke="${params.stroke}"`);
        }
        if (sw) {
          inTextHtml.push(` stroke-width="${sw}"`);
        }
        inTextHtml.push("/></svg >");
        const elAdapters = args.scene.getElementAdapters(anime.selector);
        elAdapters.forEach((elAdapter) => {
          elAdapter.setProp("html", elAdapter.getProp("html") + inTextHtml.join(""), args);
        });
        return TR_EXIT;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=shape-tasks.js.map
