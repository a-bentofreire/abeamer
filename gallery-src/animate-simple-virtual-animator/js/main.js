"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // let drawCallTimes = 0;
    // ------------------------------------------------------------------------
    //                               CanvasAnimator
    // ------------------------------------------------------------------------
    var CanvasAnimator = /** @class */ (function (_super) {
        __extends(CanvasAnimator, _super);
        function CanvasAnimator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * This method is called after each property were updated.
         * In this case, it would generate 3x times more calls since there are
         * the 3 animation properties in this example.
         * Use animateProps instead.
         */
        CanvasAnimator.prototype.animateProp = function (name, value) {
            // this.draw();
        };
        /**
         * This method is called after all properties were updated.
         * It's the preferable method of this case.
         * You can get the values props property.
         */
        CanvasAnimator.prototype.animateProps = function () {
            this.draw();
        };
        CanvasAnimator.prototype.draw = function () {
            var w = canvas.width;
            ctx.clearRect(0, 0, w, canvas.height);
            var y = canvas.height - 10;
            ctx.font = "30px sans-serif";
            ctx.fillStyle = this.props.colors;
            ctx.textBaseline = 'bottom';
            var text = this.props.text;
            var sz = ctx.measureText(text);
            ctx.fillText(text, (w - sz.width) / 2, y);
            var lineWidth = this.props.lineWidth;
            ctx.fillStyle = '#FF3333';
            ctx.fillRect((w - lineWidth) / 2, y + 2, lineWidth, 4);
            // drawCallTimes++;
            // console.log(`drawCallTimes: ${drawCallTimes}`);
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