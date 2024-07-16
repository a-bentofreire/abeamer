"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelConsts = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Constants shared by cli, server, exact but not by client/lib
var RelConsts;
(function (RelConsts) {
    RelConsts.DEFAULT_WIDTH = 640;
    RelConsts.DEFAULT_HEIGHT = 480;
    RelConsts.DEFAULT_FPS = 25;
    RelConsts.DEFAULT_SERVER = 'puppeteer';
    RelConsts.NODE_SERVERS = ['puppeteer'];
    RelConsts.SUPPORTED_SERVERS = ['phantomjs', 'slimerjs', 'puppeteer'];
})(RelConsts || (exports.RelConsts = RelConsts = {}));
//# sourceMappingURL=rel-consts.js.map