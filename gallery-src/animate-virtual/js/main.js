"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", () => {
    const story = ABeamer.createStory(/*FPS:*/ 20);
    // [TOPIC] using a DOM Scene and virtual element
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const patImg = document.getElementById('pat');
    const patHeight = 14;
    // ------------------------------------------------------------------------
    //                               VirtualElement
    // ------------------------------------------------------------------------
    class Player {
        constructor(id, left, height) {
            this.id = id;
            this.left = left;
            this.height = height;
            this.top = 0;
            this.img = document.getElementById(this.id);
        }
        setProp(name, value) {
            this[name] = value;
            console.log(`Set [${this.id}] [${name}]=[${value}]`);
            if (name === 'left' || name === 'top') {
                drawGame();
            }
        }
        getProp(name) {
            console.log(`Get [${this.id}] [${name}]=[${this[name]}]`);
            return this[name];
        }
        draw() {
            context.drawImage(this.img, this.left, story.height - this.height
                - patHeight - this.top);
        }
    }
    const android = new Player('android', 10, 31);
    const iphone = new Player('iphone', story.width - 30, 44);
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
    const scene1 = story.scenes[0];
    story.onGetVirtualElement = (id, args) => {
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
    const infoScene = document.getElementById('info-scene');
    class PureVirtual extends Player {
        constructor(id, left) {
            super(id, left, 0);
            this.info = document.getElementById(`info-${id}`);
        }
        setProp(name, value) {
            this[name] = value;
            console.log(`Set [${this.id}] [${name}]=[${value}]`);
            this.info.textContent = `Set [${this.id}] [${name}]=[${value}]`;
        }
    }
    // [TOPIC] Using Virtual scenes and virtual elements
    class myVirtualScene {
        constructor(id) {
            this.id = id;
            this.vElements = {};
            this.vElements['#field'] = new PureVirtual('field', 60);
            this.vElements['#popcorn'] = new PureVirtual('popcorn', 20);
        }
        setProp(name, value) {
            this[name] = value;
            console.log(`Set [${this.id}] [${name}]=[${value}]`);
            infoScene.textContent = `Set [${this.id}] [${name}]=[${value}]`;
        }
        getProp(name) {
            console.log(`Get [${this.id}] [${name}]=[${this[name]}]`);
            return this[name];
        }
        query(selector, iterator) {
            let index = 0;
            selector.split(/\s*,\s*/).forEach((selElement) => {
                const vElement = this.vElements[selElement];
                if (vElement) {
                    iterator(vElement, index);
                    index++;
                }
            });
        }
    }
    const scene2 = story.addScene(new myVirtualScene('scene2'));
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