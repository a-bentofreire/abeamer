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

  export let mainRepo: string;
  export let mainRepoRaw: string;

  export let releaseRepo: string;
  export let releaseRepoRaw: string;

  export let galleryReleaseRepo: string;
  export let galleryReleaseRepoRaw: string;

  /**
   * Initializes the web links based if isLocal or not.
   */
  export function setup(isLocal: boolean) {
    const LOCAL_PORT = 9000;

    const server = !isLocal
      ? 'https://github.com/a-bentofreire/__REPO__/blog/master/'
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const rawServer = !isLocal
      ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/'
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const galleryReleaseServer = !isLocal
      ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
      : `http://localhost:${LOCAL_PORT}/gallery-release`;


    const main = !isLocal ? 'abeamer' : '';
    const mainPrefix = !isLocal ? 'abeamer-' : '';

    mainRepo = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
    mainRepoRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');

    releaseRepo = server.replace(/__REPO__/, `${mainPrefix}release`);
    releaseRepoRaw = rawServer.replace(/__REPO__/, `${mainPrefix}release`);

    galleryReleaseRepo = galleryReleaseServer + '/';
    galleryReleaseRepoRaw = galleryReleaseRepo;
  }
}
