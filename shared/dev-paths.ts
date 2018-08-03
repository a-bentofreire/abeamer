"use strict";
// uuid: 4fa2cbfb-aecc-4b28-be0e-7d107b8ba1a7

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

import { fsix } from "./vendor/fsix.js";

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * This module contains posix file paths for building and testing.
 *
 */
export namespace DevPaths {

  export const CLIENT_PATH = 'client';
  export const LIB_PATH = `${CLIENT_PATH}/lib`;
  export const JS_PATH = `${LIB_PATH}/js`;
  export const PLUGINS_PATH = `${LIB_PATH}/plugins`;
  export const TYPINGS_PATH = `${LIB_PATH}/typings`;
  export const SHARED_PATH = 'shared';
  export const SHARED_LIB_PATH = `${SHARED_PATH}/lib`;
  export const GALLERY_PATH = 'gallery';
  export const DOCS_PATH = 'docs';

  export const END_USER_DOCS_PATH = `${DOCS_PATH}/release/latest/end-user`;
  export const DEV_DOCS_PATH = `${DOCS_PATH}/release/latest/developer`;
  export const SOURCE_DOCS_PATH = `${DOCS_PATH}/sources`;
  export const SOURCE_DEV_DOCS_PATH = `${DOCS_PATH}/sources-dev`;
  export const MODULES_LIST_FILE = `${fsix.toPosixSlash(__dirname)}`
    + `/../${LIB_PATH}/modules-list.json`;
}
