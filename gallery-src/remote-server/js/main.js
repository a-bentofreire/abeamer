"use strict";
// uuid: eb5271fa-47f3-40dd-b8e0-11b55e783f6e
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
$(window).on("load", function () {
    ABeamer.createStoryFromConfig('story.json', function (story) {
        story.render(story.bestPlaySpeed());
    });
});
//# sourceMappingURL=main.js.map