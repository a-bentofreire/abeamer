"use strict";
var ABeamer;
((ABeamer2) => {
  let RevealDir;
  ((RevealDir2) => {
    RevealDir2[RevealDir2["disabled"] = 0] = "disabled";
    RevealDir2[RevealDir2["toRight"] = 1] = "toRight";
    RevealDir2[RevealDir2["toLeft"] = 2] = "toLeft";
    RevealDir2[RevealDir2["toCenter"] = 3] = "toCenter";
  })(RevealDir = ABeamer2.RevealDir || (ABeamer2.RevealDir = {}));
  pluginManager.addPlugin({
    id: "abeamer.text-tasks",
    uuid: "8b547eff-a0de-446a-9753-fb8b39d8031a",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/text-tasks/text-tasks.js"],
    teleportable: true
  });
  function _textSplitter(params) {
    const text = params.text;
    return params.splitBy === "word" ? text.replace(/(\s+)/g, "\0$1").split(/\0/) : text.split("");
  }
  pluginManager.addTasks([["text-split", _textSplit]]);
  function _textSplit(anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        const inTextArray = _textSplitter(params);
        const elAdapters = args.scene.getElementAdapters(anime.selector);
        const inTextHtml = inTextArray.map(
          (item, index) => `<span data-index="${index}" data="${item.replace(/[\n"']/g, "")}">${item.replace(/ /g, "&nbsp;").replace(/\n/g, "<br>")}</span>`
        );
        elAdapters.forEach((elAdapter) => {
          elAdapter.setProp("html", inTextHtml.join(""), args);
          if (params.realign && !elAdapter.isVirtual) {
            const $spans = $(elAdapter.htmlElement).find("span");
            let left = 0;
            $spans.each((_index, domEl) => {
              domEl.style.left = `${left}px`;
              left += domEl.clientWidth;
            });
          }
        });
        return TR_EXIT;
    }
  }
  pluginManager.addTasks([["typewriter", _typewriter]]);
  function _typewriter(anime, _wkTask, params, stage, _args) {
    switch (stage) {
      case TS_INIT:
        const textInter = [];
        const inTextArray = _textSplitter(params);
        const len = inTextArray.length;
        const hasCursor = params.cursor !== void 0;
        const cursorChar = hasCursor ? params.cursorChar || "\u2590" : "";
        let accText = "";
        for (let i = 0; i < len; i++) {
          accText += inTextArray[i];
          textInter.push(accText + cursorChar);
        }
        if (hasCursor) {
          textInter.push(accText);
        }
        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: "text", valueText: textInter });
        return TR_DONE;
    }
  }
  pluginManager.addTasks([["decipher", _decipherTask]]);
  function _decipherTask(anime, _wkTask, params, stage, _args) {
    function isInsideRange(code, ranges) {
      return ranges.findIndex((range) => range[0] <= code && range[1] >= code) !== -1 ? ranges : void 0;
    }
    function reveal(textInter, text, _textLen, rangesByIndex, _revealDir, revealCharIterations, i, scale) {
      if (rangesByIndex[i]) {
        scale++;
        let textInterPos = textInter.length - 1;
        const downCounter = revealCharIterations * scale;
        for (let j = 0; j < downCounter; j++) {
          if (textInterPos < 0) {
            return;
          }
          textInter[textInterPos][i] = text[i];
          textInterPos--;
        }
      }
      return scale;
    }
    switch (stage) {
      case TS_INIT:
        const cc_A = "A".charCodeAt(0);
        const cc_Z = "Z".charCodeAt(0);
        const cc_a = "a".charCodeAt(0);
        const cc_z = "z".charCodeAt(0);
        const cc_0 = "0".charCodeAt(0);
        const cc_9 = "9".charCodeAt(0);
        const iterations = params.iterations;
        const text = params.text;
        const textLen = text.length;
        const upperCharRanges = params.upperCharRanges || [[cc_A, cc_Z]];
        const lowerCharRanges = params.lowerCharRanges || [[cc_a, cc_z]];
        const digitRanges = [[cc_0, cc_9]];
        const revealCharIterations = params.revealCharIterations || 1;
        const revealDir = parseEnum(params.revealDirection, RevealDir, 0 /* disabled */);
        throwIfI8n(!isPositiveNatural(iterations), Msgs.MustNatPositive, { p: "iterations" });
        throwIfI8n(!textLen, Msgs.NoEmptyField, { p: "text" });
        const rangesByIndex = [];
        for (let charI = 0; charI < textLen; charI++) {
          const charCode = text.charCodeAt(charI);
          const ranges = isInsideRange(charCode, upperCharRanges) || isInsideRange(charCode, lowerCharRanges) || isInsideRange(charCode, digitRanges);
          rangesByIndex.push(ranges);
        }
        const textInter = [];
        for (let i = 0; i < iterations - 1; i++) {
          const dText = text.split("");
          for (let charI = 0; charI < textLen; charI++) {
            const ranges = rangesByIndex[charI];
            if (ranges) {
              const charRangesLen = ranges.length;
              const charRangesIndex = charRangesLen === 1 ? 0 : Math.floor(Math.random() * charRangesLen);
              const charRange = ranges[charRangesIndex];
              const range = charRange[1] - charRange[0];
              const winnerChar = String.fromCharCode(Math.round(Math.random() * range) + charRange[0]);
              dText[charI] = winnerChar;
            }
          }
          textInter.push(dText);
        }
        let scale = 0;
        switch (revealDir) {
          case 2 /* toLeft */:
            for (let i = textLen - 1; i >= 0; i--) {
              scale = reveal(
                textInter,
                text,
                textLen,
                rangesByIndex,
                revealDir,
                revealCharIterations,
                i,
                scale
              );
            }
            break;
          case 1 /* toRight */:
            for (let i = 0; i < textLen; i++) {
              scale = reveal(
                textInter,
                text,
                textLen,
                rangesByIndex,
                revealDir,
                revealCharIterations,
                i,
                scale
              );
            }
            break;
          case 3 /* toCenter */:
            const midLen = Math.floor(textLen / 2);
            for (let i = midLen - 1; i >= 0; i--) {
              scale = reveal(
                textInter,
                text,
                textLen,
                rangesByIndex,
                revealDir,
                revealCharIterations,
                i,
                scale
              );
              scale = reveal(
                textInter,
                text,
                textLen,
                rangesByIndex,
                revealDir,
                revealCharIterations,
                textLen - i - 1,
                scale
              );
            }
            break;
        }
        textInter.push(text.split(""));
        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: "text", valueText: textInter.map((inter) => inter.join("")) });
        return TR_DONE;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=text-tasks.js.map
