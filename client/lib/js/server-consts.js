"use strict";
var ABeamer;
((ABeamer2) => {
  ABeamer2._SRV_CNT = {
    MESSAGE_PREFIX: "ABEAMER_",
    CMD_VALUE_SEP: "___",
    SERVER_SUFFIX: "abeamer-server=",
    LOG_LEVEL_SUFFIX: "loglevel=",
    TELEPORT_SUFFIX: "teleport=",
    RENDER_VAR_SUFFIX: "var=",
    WIDTH_SUFFIX: "frame-width=",
    HEIGHT_SUFFIX: "frame-height=",
    // client messages
    MSG_READY: "ready",
    MSG_RENDER: "render",
    MSG_RENDER_FINISHED: "render-finished",
    MSG_LOG_MSG: "log",
    MSG_LOG_WARN: "warn",
    MSG_LOG_ERROR: "error",
    MSG_SET_FPS: "set-fps",
    MSG_SET_FRAME_NR: "set-frame-nr",
    MSG_SET_FRAME_COUNT: "set-frame-count",
    MSG_TELEPORT: "teleport",
    MSG_EXIT: "exit",
    // server messages
    MSG_SERVER_READY: "server-ready",
    MSG_RENDER_DONE: "render-done"
  };
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=server-consts.js.map
