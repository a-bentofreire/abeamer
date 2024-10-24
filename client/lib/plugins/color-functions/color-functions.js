"use strict";
var ABeamer;
((ABeamer2) => {
  pluginManager.addPlugin({
    id: "abeamer.color-functions",
    uuid: "ce739c9f-13ba-4742-b1c3-dec56624be7d",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/color-functions/color-functions.js"],
    teleportable: true
  });
  function _parseColorInput(params, req, hasTransparency) {
    if (params.length === 1) {
      req.checkParams(req, 1, [ExFuncParamType.Array]);
      const res = params[0].arrayValue;
      const resLen = res.length;
      if (resLen !== (hasTransparency ? 4 : 3)) {
        throwI8n(Msgs.ExpHasErrors);
      }
      return res;
    } else if (hasTransparency) {
      req.checkParams(req, 4, [
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number
      ]);
      return params.map((p) => p.numValue);
    } else {
      req.checkParams(req, 3, [
        ExFuncParamType.Number,
        ExFuncParamType.Number,
        ExFuncParamType.Number
      ]);
      return params.map((p) => p.numValue);
    }
  }
  function _rgb2HslFunc(r, g, b) {
    const numR = r / 255;
    const numG = g / 255;
    const numB = b / 255;
    const maxRGB = Math.max(numR, numG, numB);
    const minRGB = Math.min(numR, numG, numB);
    let h;
    let s;
    const l = (maxRGB + minRGB) / 2;
    if (maxRGB === minRGB) {
      h = s = 0;
    } else {
      const delta = maxRGB - minRGB;
      s = l > 0.5 ? delta / (2 - maxRGB - minRGB) : delta / (maxRGB + minRGB);
      switch (maxRGB) {
        case numR:
          h = (numG - numB) / delta + (numG < numB ? 6 : 0);
          break;
        case numG:
          h = (numB - numR) / delta + 2;
          break;
        case numB:
          h = (numR - numG) / delta + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  function _hue2Rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function _hsl2RgbFunc(h, s, l) {
    let r;
    let g;
    let b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = _hue2Rgb(p, q, h + 1 / 3);
      g = _hue2Rgb(p, q, h);
      b = _hue2Rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  function _hslaCommon(params, req, hasTransparency) {
    const color34 = _parseColorInput(params, req, hasTransparency);
    const rgb = _hsl2RgbFunc(color34[0], color34[1], color34[2]);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = _rgbaToStr(!hasTransparency ? rgb : [rgb[0], rgb[1], rgb[2], color34[3]]);
  }
  function _hsl(params, req) {
    _hslaCommon(params, req, false);
  }
  function _hsla(params, req) {
    _hslaCommon(params, req, true);
  }
  function _hsl2Rgb(params, req) {
    const color34 = _parseColorInput(params, req, false);
    req.res.paType = ExFuncParamType.Array;
    req.res.arrayValue = _hsl2RgbFunc(color34[0], color34[1], color34[2]);
  }
  function _rgb2Hsl(params, req) {
    const color34 = _parseColorInput(params, req, false);
    req.res.paType = ExFuncParamType.Array;
    req.res.arrayValue = _rgb2HslFunc(color34[0], color34[1], color34[2]);
  }
  function _rgbaToStr(color34) {
    return color34.map((pa, index) => {
      let numValue = pa;
      if (index === 3) {
        numValue = numValue * 255;
      }
      numValue = Math.round(Math.max(Math.min(numValue, 255), 0));
      const v = numValue.toString(16);
      return v.length < 2 ? "0" + v : v;
    }).join("");
  }
  function _rgbaCommon(params, req, hasTransparency) {
    const color34 = _parseColorInput(params, req, hasTransparency);
    req.res.paType = ExFuncParamType.String;
    req.res.sValue = _rgbaToStr(color34);
  }
  function _rgb(params, req) {
    _rgbaCommon(params, req, false);
  }
  function _rgba(params, req) {
    _rgbaCommon(params, req, true);
  }
  pluginManager.addFunctions([
    ["rgb", _rgb],
    ["rgba", _rgba],
    ["hsl", _hsl],
    ["hsla", _hsla],
    ["hsl2Rgb", _hsl2Rgb],
    ["rgb2Hsl", _rgb2Hsl]
  ]);
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=color-functions.js.map
