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
    // [TOPIC] using a DOM Scene and virtual element
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var patImg = document.getElementById('pat');
    var patHeight = 14;
    // ------------------------------------------------------------------------
    //                               VirtualElement
    // ------------------------------------------------------------------------
    var Player = /** @class */ (function () {
        function Player(id, left, height) {
            this.id = id;
            this.left = left;
            this.height = height;
            this.top = 0;
            this.img = document.getElementById(this.id);
        }
        Player.prototype.setProp = function (name, value) {
            this[name] = value;
            console.log("Set [".concat(this.id, "] [").concat(name, "]=[").concat(value, "]"));
            if (name === 'left' || name === 'top') {
                drawGame();
            }
        };
        Player.prototype.getProp = function (name) {
            console.log("Get [".concat(this.id, "] [").concat(name, "]=[").concat(this[name], "]"));
            return this[name];
        };
        Player.prototype.draw = function () {
            context.drawImage(this.img, this.left, story.height - this.height
                - patHeight - this.top);
        };
        return Player;
    }());
    var android = new Player('android', 10, 31);
    var iphone = new Player('iphone', story.width - 30, 44);
    // ------------------------------------------------------------------------
    //                               drawGame
    // ------------------------------------------------------------------------
    function drawGame() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(patImg, 0, story.height - patHeight);
        android.draw();
        iphone.draw();
    }
    // // ------------------------------------------------------------------------
    // //                               Scene1
    // // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    story.onGetVirtualElement = function (id, args) {
        switch (id) {
            case 'android': return android;
            case 'iphone': return iphone;
            default:
                ABeamer.throwErr('Unsupported Id');
        }
    };
    scene1
        .addAnimations([{
            selector: '%android',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    value: story.width - 30,
                },
                {
                    prop: 'top',
                    position: '+0.2s',
                    oscillator: {
                        handler: 'harmonic',
                        params: {
                            negativeHander: ABeamer.NegativeBuiltInFuncs.abs,
                        },
                    },
                    value: 30,
                },
            ],
        },
        {
            selector: '%iphone',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    value: 0,
                },
            ],
        },
    ]);
    // ------------------------------------------------------------------------
    //                               Scene2
    // ------------------------------------------------------------------------
    var infoScene = document.getElementById('info-scene');
    var PureVirtual = /** @class */ (function (_super) {
        __extends(PureVirtual, _super);
        function PureVirtual(id, left) {
            var _this = _super.call(this, id, left, 0) || this;
            _this.info = document.getElementById("info-".concat(id));
            return _this;
        }
        PureVirtual.prototype.setProp = function (name, value) {
            this[name] = value;
            console.log("Set [".concat(this.id, "] [").concat(name, "]=[").concat(value, "]"));
            this.info.textContent = "Set [".concat(this.id, "] [").concat(name, "]=[").concat(value, "]");
        };
        return PureVirtual;
    }(Player));
    // [TOPIC] Using Virtual scenes and virtual elements
    var myVirtualScene = /** @class */ (function () {
        function myVirtualScene(id) {
            this.id = id;
            this.vElements = {};
            this.vElements['#field'] = new PureVirtual('field', 60);
            this.vElements['#popcorn'] = new PureVirtual('popcorn', 20);
        }
        myVirtualScene.prototype.setProp = function (name, value) {
            this[name] = value;
            console.log("Set [".concat(this.id, "] [").concat(name, "]=[").concat(value, "]"));
            infoScene.textContent = "Set [".concat(this.id, "] [").concat(name, "]=[").concat(value, "]");
        };
        myVirtualScene.prototype.getProp = function (name) {
            console.log("Get [".concat(this.id, "] [").concat(name, "]=[").concat(this[name], "]"));
            return this[name];
        };
        myVirtualScene.prototype.query = function (selector, iterator) {
            var _this = this;
            var index = 0;
            selector.split(/\s*,\s*/).forEach(function (selElement) {
                var vElement = _this.vElements[selElement];
                if (vElement) {
                    iterator(vElement, index);
                    index++;
                }
            });
        };
        return myVirtualScene;
    }());
    var scene2 = story.addScene(new myVirtualScene('scene2'));
    scene2
        .addAnimations([{
            selector: '#field',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    value: 200,
                },
            ],
        },
        {
            selector: '#popcorn',
            duration: '1s',
            props: [
                {
                    prop: 'left',
                    value: 150,
                },
            ],
        },
    ]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map