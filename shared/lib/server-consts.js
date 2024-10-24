"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var server_consts_exports = {};
__export(server_consts_exports, {
  ServerConsts: () => ServerConsts
});
module.exports = __toCommonJS(server_consts_exports);
var ServerConsts;
((ServerConsts2) => {
  ServerConsts2._SRV_CNT = {
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
})(ServerConsts || (ServerConsts = {}));
//# sourceMappingURL=server-consts.js.map
