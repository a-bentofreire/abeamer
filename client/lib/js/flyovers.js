"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2._flyoverFunctions = {};
  function _buildWorkFlyover(handler, params, toTeleport, args) {
    let flyoverFunc;
    switch (typeof handler) {
      case "string":
        flyoverFunc = ABeamer2._flyoverFunctions[handler];
        break;
      case "function":
        flyoverFunc = handler;
        throwIfI8n(toTeleport, Msgs.NoCode);
        break;
    }
    if (!flyoverFunc) {
      throwI8n(Msgs.UnknownOf, { type: Msgs.flyover, p: handler });
    }
    const wkFlyover = {
      func: flyoverFunc,
      name: handler,
      params: params || {}
    };
    if (toTeleport) {
      wkFlyover.func(wkFlyover, wkFlyover.params, TS_TELEPORT, args);
    }
    return wkFlyover;
  }
  ABeamer2._buildWorkFlyover = _buildWorkFlyover;
  ABeamer2._flyoverFunctions["info"] = _infoFlyover;
  function _infoFlyover(_wkFlyover, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        if (!params._elAdapters) {
          params._elAdapters = args.story.getElementAdapters(params.selector || ".info-flyover");
        }
        break;
      case TS_ANIME_LOOP:
        const format = params.format || "${storyFrameNr}";
        const story = args.story;
        params._elAdapters.forEach((elAdapter) => {
          const text = format.replace(/\$\{(\w+)\}/g, (_all, macro) => {
            switch (macro) {
              case "storyFrameNr":
                return story.renderFramePos.toString();
              case "storyElapsedMS":
                return frame2Time(
                  story.renderFramePos,
                  story.fps,
                  TimeUnit.ms
                );
              case "storyElapsedS":
                return frame2Time(
                  story.renderFramePos,
                  story.fps,
                  TimeUnit.s
                );
              case "storyElapsedM":
                return frame2Time(
                  story.renderFramePos,
                  story.fps,
                  TimeUnit.m
                );
            }
            return "";
          });
          if (args.isVerbose) {
            args.story.logFrmt("info-flyover", [["text", text]]);
          }
          elAdapter.setProp("text", text, args);
        });
        break;
    }
  }
  ABeamer2._flyoverFunctions["video-sync"] = _videoSyncFlyover;
  function _videoSyncFlyover(_wkFlyover, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        if (!params._elAdapters) {
          params._elAdapters = args.story.getElementAdapters(params.selector || "#video");
          break;
        }
      case TS_ANIME_LOOP:
        const storyFps = args.story.fps;
        if (!args.hasServer || params.serverRender !== false) {
          params._elAdapters.forEach((elAdapter) => {
            const currentTime = args.story.renderFramePos / storyFps;
            if (args.isVerbose) {
              args.story.logFrmt("video-sync", [["currentTime", currentTime]]);
            }
            elAdapter.setProp("currentTime", currentTime, args);
          });
        }
        break;
    }
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=flyovers.js.map
