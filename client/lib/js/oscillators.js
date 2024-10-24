"use strict";
var ABeamer;
((ABeamer2) => {
  let OscillatorName;
  ((OscillatorName2) => {
    OscillatorName2[OscillatorName2["harmonic"] = 1e3] = "harmonic";
    OscillatorName2[OscillatorName2["damped"] = 1001] = "damped";
    OscillatorName2[OscillatorName2["pulsar"] = 1002] = "pulsar";
  })(OscillatorName = ABeamer2.OscillatorName || (ABeamer2.OscillatorName = {}));
  let NegativeBuiltInFuncs;
  ((NegativeBuiltInFuncs2) => {
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["none"] = 0] = "none";
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["clip"] = 1] = "clip";
    NegativeBuiltInFuncs2[NegativeBuiltInFuncs2["abs"] = 2] = "abs";
  })(NegativeBuiltInFuncs = ABeamer2.NegativeBuiltInFuncs || (ABeamer2.NegativeBuiltInFuncs = {}));
  let PulsarType;
  ((PulsarType2) => {
    PulsarType2[PulsarType2["normal"] = 0] = "normal";
    PulsarType2[PulsarType2["sine"] = 1] = "sine";
    PulsarType2[PulsarType2["random"] = 2] = "random";
    PulsarType2[PulsarType2["positiveRandom"] = 3] = "positiveRandom";
  })(PulsarType = ABeamer2.PulsarType || (ABeamer2.PulsarType = {}));
  function _oscillatorNumToStr(num) {
    return OscillatorName[num] || _easingNumToStr(num);
  }
  ABeamer2._oscillatorNumToStr = _oscillatorNumToStr;
  function _parseNegativeHandler(negativeHander) {
    if (typeof negativeHander === "string") {
      negativeHander = NegativeBuiltInFuncs[negativeHander];
    }
    if (typeof negativeHander === "number") {
      switch (negativeHander) {
        case 2 /* abs */:
          return (t) => Math.abs(t);
        case 1 /* clip */:
          return (t) => Math.abs(t);
      }
    }
    return negativeHander;
  }
  _easingFunctions["harmonic"] = _harmonicOscillator;
  function _harmonicOscillator(t, params) {
    if (!params._isPrepared) {
      params._cycles = params.cycles || 1;
      params._negativeHandler = _parseNegativeHandler(params.negativeHander);
      params._shift = params.shift || 0;
    }
    const cycles = params._cycles;
    const v = Math.sin(Math.PI * 2 * (t + params._shift) * cycles);
    return params._negativeHandler ? params._negativeHandler(v) : v;
  }
  _easingFunctions["damped"] = _dampedOscillator;
  function _dampedOscillator(t, params) {
    if (!params._isPrepared) {
      params._isPrepared = true;
      params._curFrequency = params.frequency || 0.1;
      params._curAmplitude = 1;
      params._scale = 1 - (params.friction || 0.1);
      params._shift = 0;
      params._negativeHandler = _parseNegativeHandler(params.negativeHander);
    }
    let t1 = t - params._shift;
    if (t1 >= params._curFrequency) {
      params._shift = t;
      params._curFrequency = params._curFrequency * params._scale;
      params._curAmplitude = params._curAmplitude * params._scale;
      t1 = t - params._shift;
    }
    const v = Math.sin(Math.PI * 2 * (t1 / params._curFrequency)) * params._curAmplitude;
    return params._negativeHandler ? params._negativeHandler(v) : v;
  }
  _easingFunctions["pulsar"] = _pulsarOscillator;
  function _pulsarOscillator(t, params) {
    if (!params._isPrepared) {
      params._isPrepared = true;
      params.midpoint = params.midpoint || 0.5;
      params.spread = params.spread || 0.1;
      params.type = params.type || 0 /* normal */;
      if (typeof params.type === "string") {
        params.type = PulsarType[params.type];
      }
    }
    const midpoint = params.midpoint;
    const spread = params.spread;
    if (t <= midpoint - spread || t >= midpoint + spread) {
      return 0;
    }
    const pulsarType = params.type;
    switch (pulsarType) {
      case 0 /* normal */:
        let t1 = (t - (midpoint - spread)) / spread;
        if (t > midpoint) {
          t1 = 2 - t1;
        }
        return (Math.exp(t1) - 1) / (Math.E - 1);
      case 1 /* sine */:
        const t2 = (t - (midpoint - spread)) / spread;
        return Math.sin(Math.PI * t2);
      case 2 /* random */:
        return Math.random() * 2 - 1;
      case 3 /* positiveRandom */:
        return Math.random();
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=oscillators.js.map
