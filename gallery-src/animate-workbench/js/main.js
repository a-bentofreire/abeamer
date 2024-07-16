"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    var expr = "=iff(t<0.2 or t>0.7, 0, 1)";
    var pathExpr = '=[x0+(x1-x0)*t, y0-(y0-10)*t*t]';
    var tests = [{
            enabled: true,
            label: 'easeInQuart',
            // easing by Id
            easing: ABeamer.EasingName.easeInQuart,
        }, {
            label: 'Harmonic',
            oscillator: {
                handler: ABeamer.OscillatorName.harmonic,
                params: {
                // shift: 0.25,
                },
            },
        }, {
            enabled: true,
            label: 'Damped',
            oscillator: {
                // oscillator by name
                handler: 'damped',
            },
        }, {
            label: 'Harmonic+easeInQuart(X)',
            easingX: 'easeInQuart',
            oscillator: {
                handler: 'harmonic',
            },
        }, {
            label: 'Harmonic+easeInQuart',
            easing: 'easeInQuart',
            oscillator: {
                handler: 'harmonic',
            },
        }, {
            label: 'Harmonic+easeOutCubic',
            easing: 'easeOutCubic',
            oscillator: {
                handler: 'harmonic',
            },
        }, {
            enabled: true,
            label: "path: ".concat(pathExpr),
            path: { handler: pathExpr },
        }, , {
            enabled: true,
            label: "easing:".concat(expr),
            easing: expr,
        }];
    var h = story.height;
    var margin = 10;
    var d = 2; // duration in seconds
    var allowMultiple = true;
    var x0 = margin;
    var x1 = story.width - 2 * margin;
    var y0 = h / 2;
    tests.forEach(function (test, index) {
        if (index && !allowMultiple) {
            return;
        }
        var props = !test.path
            ? [{
                    prop: 'left',
                    easing: test.easingX,
                    valueStart: "".concat(margin, "px"),
                    value: x1,
                }, {
                    prop: 'top',
                    easing: test.easing,
                    oscillator: test.oscillator,
                    valueStart: "".concat(h / 2, "px"),
                    value: h / 8,
                }]
            : [{
                    prop: 'left-top',
                    path: test.path,
                }];
        scene1
            .addAnimations([{
                selector: '#dot',
                duration: "".concat(d, "s"),
                enabled: test.enabled,
                tasks: [{
                        handler: 'add-vars',
                        params: {
                            vars: {
                                x0: x0,
                                x1: x1,
                                y0: y0,
                            },
                        },
                    }],
                props: props,
            },
            {
                selector: '#label',
                duration: 1,
                props: [{
                        prop: 'text',
                        valueFormat: test.label,
                    }],
            }]);
    });
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map