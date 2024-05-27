"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

$(window).on("load", () => {
  ABeamer.createStoryFromConfig('story.json',
    (story: ABeamer.Story) => {
      story.render(story.bestPlaySpeed());
    });
});
