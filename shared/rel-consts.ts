"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Constants shared by cli, server, exact but not by client/lib

export namespace RelConsts {

  export const DEFAULT_WIDTH = 640;
  export const DEFAULT_HEIGHT = 480;
  export const DEFAULT_FPS = 25;
  export const DEFAULT_SERVER = 'puppeteer';

  export const NODE_SERVERS = ['puppeteer'];
  export const SUPPORTED_SERVERS = ['phantomjs', 'slimerjs', 'puppeteer'];

}
