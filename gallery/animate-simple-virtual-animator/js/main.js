"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// uuid: c5257dbc-b1ac-4e4b-ba65-cd631b0e3d7a
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // ------------------------------------------------------------------------
    //                               CanvasAnimator
    // ------------------------------------------------------------------------
    var CanvasAnimator = /** @class */ (function (_super) {
        __extends(CanvasAnimator, _super);
        function CanvasAnimator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CanvasAnimator.prototype.animateProp = function (name, value) {
            this.draw();
        };
        CanvasAnimator.prototype.draw = function () {
            var w = canvas.width;
            ctx.clearRect(0, 0, w, canvas.height);
            var y = 80;
            ctx.font = "30px sans-serif";
            ctx.fillStyle = this.props.colors;
            ctx.textBaseline = 'bottom';
            var text = this.props.text;
            var sz = ctx.measureText(text);
            ctx.fillText(text, (w - sz.width) / 2, y);
            var lineWidth = this.props.lineWidth;
            ctx.fillStyle = '#FF3333';
            ctx.fillRect((w - lineWidth) / 2, y + 2, lineWidth, 4);
        };
        return CanvasAnimator;
    }(ABeamer.SimpleVirtualAnimator));
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    var texts = ['LIFE', 'IS AN', 'ENDLESS', 'JOURNEY'];
    var colors = ['#333333', '#883333', '#338833', '#333388'];
    var ca = new CanvasAnimator();
    ca.selector = 'canvas-fx';
    ca.props.lineWidth = 10;
    ca.props.text = texts[0];
    ca.props.colors = colors[0];
    ca.draw();
    story.addVirtualAnimator(ca);
    scene1
        .addAnimations([{
            selector: '%canvas-fx',
            duration: '2s',
            props: [
                {
                    prop: 'lineWidth',
                    value: story.width - 10,
                },
                {
                    prop: 'text',
                    valueText: texts,
                },
                {
                    prop: 'colors',
                    valueText: colors,
                },
            ],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map