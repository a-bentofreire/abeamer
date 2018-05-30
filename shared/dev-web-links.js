"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var DevWebLinks;
(function (DevWebLinks) {
    /**
     * Initializes the web links based if isLocal or not.
     */
    function setup(isLocal) {
        var LOCAL_PORT = 9000;
        var server = !isLocal
            ? 'https://github.com/a-bentofreire/__REPO__/blog/master/'
            : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
        var rawServer = !isLocal
            ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/'
            : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
        var galleryReleaseServer = !isLocal
            ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
            : "http://localhost:" + LOCAL_PORT + "/gallery-release";
        var main = !isLocal ? 'abeamer' : '';
        var mainPrefix = !isLocal ? 'abeamer-' : '';
        DevWebLinks.mainRepo = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.mainRepoRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.releaseRepo = server.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.releaseRepoRaw = rawServer.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.galleryReleaseRepo = galleryReleaseServer + '/';
        DevWebLinks.galleryReleaseRepoRaw = DevWebLinks.galleryReleaseRepo;
    }
    DevWebLinks.setup = setup;
})(DevWebLinks = exports.DevWebLinks || (exports.DevWebLinks = {}));
//# sourceMappingURL=dev-web-links.js.map