"use strict";
// uuid: 00070273-0c00-4574-b824-a9e4a79e9a3f

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * List of all the external web links mostly GitHub Repositories.
 */
export namespace DevWebLinks {

  const IS_LOCAL = false;
  const LOCAL_PORT = 9000;

  const SERVER = !IS_LOCAL
    ? 'https://github.com/a-bentofreire/__REPO__/blog/master/'
    : `http://localhost:${LOCAL_PORT}/__REPO__/`;

  const RAW_SERVER = !IS_LOCAL
    ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/'
    : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const GALLERY_RELEASE_SERVER = !IS_LOCAL
    ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
    : `http://localhost:${LOCAL_PORT}/__REPO__/`;


  const MAIN = !IS_LOCAL ? 'abeamer' : '';
  const MAIN_PREFIX = !IS_LOCAL ? 'abeamer-' : '';

  export const MAIN_REPO = SERVER.replace(/__REPO__/, MAIN).replace(/\/\/$/, '/');
  export const MAIN_REPO_RAW = RAW_SERVER.replace(/__REPO__/, MAIN).replace(/\/\/$/, '/');

  export const RELEASE_REPO = SERVER.replace(/__REPO__/, `${MAIN_PREFIX}release`);
  export const RELEASE_REPO_RAW = RAW_SERVER.replace(/__REPO__/, `${MAIN_PREFIX}release`);

  export const GALLERY_RELEASE_REPO = GALLERY_RELEASE_SERVER + '/';
  export const GALLERY_RELEASE_REPO_RAW = GALLERY_RELEASE_REPO;
}
