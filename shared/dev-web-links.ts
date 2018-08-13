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

  export const enum RepoType {
    main,
    release,
    galleryRelease,
    docs,
  }


  const LOCAL_PORT = 9000;
  const localUrl = `http://localhost:${LOCAL_PORT}`;
  const repoUrl = `https://github.com/a-bentofreire/`;
  const pagesUrl = `https://a-bentofreire.github.io/`;
  const docsUrl = `https://www.abeamer.com`;
  const rawUrl = `https://raw.githubusercontent.com/a-bentofreire/`;


  const urlMapper = {
    'docs/release': 'docs/latest',
    'gallery-release': 'gallery/latest',
    'release': 'release/latest',
  };

  const urlMapperKeys = Object.keys(urlMapper);

  const exceptionsUrls = [/blob\/master/, /archive\/master\.zip/, /\/issues\/$/];


  export function convertLink(link: string, isTargetLocal: boolean): string {
    if (isTargetLocal) {

      if (exceptionsUrls.findIndex(regEx => link.search(regEx) !== -1) !== -1) {
        return link;
      }

      let [all, findKey, subUrl] = link
        .match(/^.*\/(abeamer[\w\-]*(?:\/(?:end-user|developer))?)(?:\/master)?(.*)$/)
        || ['', '', ''];
      if (all && subUrl !== '') {
        const matchKey = urlMapperKeys.find(key => findKey === urlMapper[key]);
        if (matchKey) {
          subUrl = matchKey + subUrl;
        } else {
          subUrl = subUrl.substr(1);
        }
        const resUrl = localUrl + '/' + subUrl;
        return resUrl;
      }
    } else {
      if (link.startsWith(localUrl)) {
        const isMedia = link.search(/\.(?:gif|png|mp4|jpg|zip)$/) !== -1;
        let [all, subUrl] = link.match(/^http:\/\/[^\/]+\/(.*)$/) || ['', ''];
        if (all) {
          const matchKey = urlMapperKeys.find(key => subUrl.startsWith(key));
          if (matchKey) {
            subUrl = urlMapper[matchKey] + subUrl.substr(matchKey.length);
          } else {
            subUrl = 'abeamer/' + subUrl;
          }

          const resUrl = (isMedia
            ? rawUrl + subUrl.replace(/([\w\-]+)/, '$1/master')
            : pagesUrl + subUrl);
          return resUrl;
        }
      }
    }
    return link;
  }


  export const repos = {
    main: '',
    mainRaw: '',

    release: '',
    releaseRaw: '',
    releaseStatic: '',

    galleryRelease: '',
    galleryReleaseRaw: '',

    docs: '',
  };

  /**
   * Initializes the web links based if isLocal or not.
   */
  export function setup(isLocal: boolean): void {

    // @TODO: Port this code to RepoType
    const server = !isLocal
      ? 'https://github.com/a-bentofreire/__REPO__/' // blog/master/
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const rawServer = !isLocal
      ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/'  // master/
      : `http://localhost:${LOCAL_PORT}/__REPO__/`;

    const galleryReleaseServer = !isLocal
      ? 'https://www.abeamer.com/gallery/latest'
      : `http://localhost:${LOCAL_PORT}/gallery-release`;

    const docsServer = !isLocal
      ? 'https://www.abeamer.com/docs/latest'
      : `http://localhost:${LOCAL_PORT}/docs/release`;


    const releaseStatic = !isLocal
      ? 'https://www.abeamer.com/release/latest/'
      : `http://localhost:${LOCAL_PORT}/release/`;


    const main = !isLocal ? 'abeamer' : '';
    const mainPrefix = !isLocal ? 'abeamer-' : '';

    repos.main = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
    repos.mainRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');

    repos.release = server.replace(/__REPO__/, `${mainPrefix}release`);
    repos.releaseRaw = rawServer.replace(/__REPO__/, `${mainPrefix}release`);
    repos.releaseStatic = releaseStatic;

    repos.galleryRelease = galleryReleaseServer + '/';
    repos.galleryReleaseRaw = repos.galleryRelease;

    repos.docs = docsServer;
  }
}
