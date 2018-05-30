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

  export const repos = {
    main: '',
    mainRaw: '',

    release: '',
    releaseRaw: '',

    galleryRelease: '',
    galleryReleaseRaw: '',

    docs: '',
  };

  /**
   * Initializes the web links based if isLocal or not.
   */
  export function setup(isLocal: boolean) {
    const LOCAL_PORT = 9000;

    const server = !isLocal
      ? 'https://github.com/a-bentofreire/__REPO__/' // blog/master/
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const rawServer = !isLocal
      ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/'  // master/
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const galleryReleaseServer = !isLocal
      ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
      : `http://localhost:${LOCAL_PORT}/gallery-release`;

    const docsServer = !isLocal
      ? 'https://a-bentofreire.github.io/abeamer-docs'
      : `http://localhost:${LOCAL_PORT}/docs/build`;


    const main = !isLocal ? 'abeamer' : '';
    const mainPrefix = !isLocal ? 'abeamer-' : '';

    repos.main = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
    repos.mainRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');

    repos.release = server.replace(/__REPO__/, `${mainPrefix}release`);
    repos.releaseRaw = rawServer.replace(/__REPO__/, `${mainPrefix}release`);

    repos.galleryRelease = galleryReleaseServer + '/';
    repos.galleryReleaseRaw = repos.galleryRelease;

    repos.docs = docsServer;
  }
}
