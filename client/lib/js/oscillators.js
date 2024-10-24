"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **oscillator** is an optional interpolator that runs `t` from [easing(0), easing(1)]
 * and the usually outputs a value from [-1, 1] where usually
 * f(0) = 0 and f(1) = 0.
 * Its output will be generate `v = valueStart + (value - valueStart) * oscillator(easing(t))`
 * and then will be injected into a path as input.
 *
 * An oscillator has the following usages:
 *
 * 1. A rotational movement, where the oscillator defines the rotation and
 * the easing the defines the speed.
 *
 * 2. Flashing elements, where an element changes its `opacity` or `text-shadow`,
 * and these values oscillate between [0, 1].
 *
 * 3. Uni-dimensional oscillators. Unlike oscillators, the oscillators have their value stored
 * in the Action Link, allowing to link the end value to the next animation.
 *
 * An oscillator if it's used together with an easing will if it's in the same dimension
 * deform the wave and if it's in different dimensions the easing will define
 * the speed of oscillator.
 *
 * The oscillators shares the namespace with [](easings), allowing any easing function
 * to operate also as a oscillator.
 * Since the main function of an oscillator is to return to its original position
 * at the end of the animation cycle, when an easing is used as an oscillator the
 * best is to use the following:
 * ```json
 * { iterationCount: 2,
 *   direction: alternate
 * }
 * ```
 *
 * One type of oscillators are `pulsars`.
 * Pulsars only have energy during a certain amount of time,
 * the rest of the time are motionless.
 *
 *
 * ## Core oscillators
 * **WARNING!** In the ABeamer 2.x these core oscillators will move `core-oscillators` plugin.
 * To prevent breaking changes include now the js script `core-oscillators.js` on the html file.
 *
 *  ABeamer has the following core oscillators:
 *
 * - `harmonic` - it generates a sinusoidal function that repeats it self every
 * duration / cycles.
 * @see gallery/animate-oscillator
 *
 * - `damped` - it's a sinusoidal function that reduces its amplitude due friction in
 * every cycle.
 * To reduce the user's effort, ABeamer uses cycles parameter to compute the friction.
 *
 * - `pulsar` - outside the range of [midpoint - spread, midpoint + spread]
 * it will return 0, and inside the range will generate a function depending of
 * the parameter `type`:
 *     * `normal` - a bell shape curve. this is the default type.
 *     * `sine` - a sinusoidal function.
 *     * `random` - a random value within [-1, 1].
 *     * `positive-random` - a random value with [0, 1].
 * @see gallery/animate-pulsar
 */
var ABeamer;
(function (ABeamer) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Oscillators
    // ------------------------------------------------------------------------
    /** List of the built-in oscillators */
    let OscillatorName;
    (function (OscillatorName) {
        OscillatorName[OscillatorName["harmonic"] = 1000] = "harmonic";
        OscillatorName[OscillatorName["damped"] = 1001] = "damped";
        OscillatorName[OscillatorName["pulsar"] = 1002] = "pulsar";
    })(OscillatorName = ABeamer.OscillatorName || (ABeamer.OscillatorName = {}));
    /**
     * List of Negative built-in functions:
     * - `abs` Math.abs
     * - `clip` If v < 0 then v = 0
     */
    let NegativeBuiltInFuncs;
    (function (NegativeBuiltInFuncs) {
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["none"] = 0] = "none";
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["clip"] = 1] = "clip";
        NegativeBuiltInFuncs[NegativeBuiltInFuncs["abs"] = 2] = "abs";
    })(NegativeBuiltInFuncs = ABeamer.NegativeBuiltInFuncs || (ABeamer.NegativeBuiltInFuncs = {}));
    /** List of the built-in pulsar type */
    let PulsarType;
    (function (PulsarType) {
        PulsarType[PulsarType["normal"] = 0] = "normal";
        PulsarType[PulsarType["sine"] = 1] = "sine";
        PulsarType[PulsarType["random"] = 2] = "random";
        PulsarType[PulsarType["positiveRandom"] = 3] = "positiveRandom";
    })(PulsarType = ABeamer.PulsarType || (ABeamer.PulsarType = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    function _oscillatorNumToStr(num) {
        return OscillatorName[num] || ABeamer._easingNumToStr(num);
    }
    ABeamer._oscillatorNumToStr = _oscillatorNumToStr;
    /** Transforms the user `negativeHandler` value into a Code Handler. */
    function _parseNegativeHandler(negativeHander) {
        if (typeof negativeHander === 'string') {
            negativeHander = NegativeBuiltInFuncs[negativeHander];
        }
        if (typeof negativeHander === 'number') {
            switch (negativeHander) {
                case NegativeBuiltInFuncs.abs: return (t) => Math.abs(t);
                case NegativeBuiltInFuncs.clip: return (t) => Math.abs(t);
            }
        }
        return negativeHander;
    }
    ABeamer._easingFunctions['harmonic'] = _harmonicOscillator;
    /** Implements the Harmonic Oscillator */
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
    ABeamer._easingFunctions['damped'] = _dampedOscillator;
    /** Implements the Damped Oscillator */
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
        // @TODO: Improve the damped function
        const v = Math.sin(Math.PI * 2 * (t1 / params._curFrequency)) * params._curAmplitude;
        return params._negativeHandler ? params._negativeHandler(v) : v;
    }
    ABeamer._easingFunctions['pulsar'] = _pulsarOscillator;
    /** Implements the Pulsar Oscillator */
    function _pulsarOscillator(t, params) {
        if (!params._isPrepared) {
            params._isPrepared = true;
            params.midpoint = params.midpoint || 0.5;
            params.spread = params.spread || 0.1;
            params.type = params.type || PulsarType.normal;
            if (typeof params.type === 'string') {
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
            case PulsarType.normal:
                let t1 = (t - (midpoint - spread)) / spread;
                if (t > midpoint) {
                    t1 = 2 - t1;
                }
                return (Math.exp(t1) - 1) / (Math.E - 1);
            case PulsarType.sine:
                const t2 = (t - (midpoint - spread)) / spread;
                return Math.sin(Math.PI * t2);
            case PulsarType.random:
                return Math.random() * 2 - 1;
            case PulsarType.positiveRandom:
                return Math.random();
        }
    }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=oscillators.js.map