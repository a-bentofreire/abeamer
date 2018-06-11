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
    DevWebLinks.repos = {
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
    function setup(isLocal) {
        var LOCAL_PORT = 9000;
        var server = !isLocal
            ? 'https://github.com/a-bentofreire/__REPO__/' // blog/master/
            : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
        var rawServer = !isLocal
            ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/' // master/
            : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
        var galleryReleaseServer = !isLocal
            ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
            : "http://localhost:" + LOCAL_PORT + "/gallery-release";
        var docsServer = !isLocal
            ? 'https://a-bentofreire.github.io/abeamer-docs'
            : "http://localhost:" + LOCAL_PORT + "/docs/build";
        var main = !isLocal ? 'abeamer' : '';
        var mainPrefix = !isLocal ? 'abeamer-' : '';
        DevWebLinks.repos.main = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.repos.mainRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.repos.release = server.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.repos.releaseRaw = rawServer.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.repos.galleryRelease = galleryReleaseServer + '/';
        DevWebLinks.repos.galleryReleaseRaw = DevWebLinks.repos.galleryRelease;
        DevWebLinks.repos.docs = docsServer;
    }
    DevWebLinks.setup = setup;
})(DevWebLinks = exports.DevWebLinks || (exports.DevWebLinks = {}));
//# sourceMappingURL=dev-web-links.js.map