$(window).on("load", function () {
    var story = ABeamer.createStory(/*FPS:*/ 20);
    var scene0 = story.scenes[0];
    scene0.addAnimations([{
            selector: '#hello',
            props: [{
                    prop: 'left',
                    value: 100,
                }],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map