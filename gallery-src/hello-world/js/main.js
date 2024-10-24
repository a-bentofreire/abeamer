$(window).on("load", () => {
    const story = ABeamer.createStory(/*FPS:*/ 20);
    const scene1 = story.scenes[0];
    scene1.addAnimations([{
            selector: '#hello',
            duration: '2s',
            props: [{
                    // pixel property animation.
                    // uses CSS property `left` to determine the start value.
                    prop: 'left',
                    // this is the end value. it must be numeric.
                    value: 100,
                },
                {
                    // formatted numerical property animation.
                    prop: 'transform',
                    valueFormat: 'rotate(%fdeg)',
                    // this is the start value,
                    // it must be always defined for the property `transform`.
                    valueStart: 10,
                    // this is the end value. it must be numeric.
                    value: 100,
                }],
        }, {
            selector: '#world',
            duration: '2s',
            props: [{
                    // textual property animation.
                    prop: 'text',
                    valueText: ['World', 'Mars', 'Jupiter'],
                }],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map