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
    var IS_LOCAL = false;
    var LOCAL_PORT = 9000;
    var SERVER = !IS_LOCAL
        ? 'https://github.com/a-bentofreire/__REPO__/blog/master/'
        : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
    var RAW_SERVER = !IS_LOCAL
        ? 'https://raw.githubusercontent.com/a-bentofreire/__REPO__/master/'
        : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
    var GALLERY_RELEASE_SERVER = !IS_LOCAL
        ? 'https://a-bentofreire.github.io/abeamer-gallery-release'
        : "http://localhost:" + LOCAL_PORT + "/__REPO__/";
    var MAIN = !IS_LOCAL ? 'abeamer' : '';
    var MAIN_PREFIX = !IS_LOCAL ? 'abeamer-' : '';
    DevWebLinks.MAIN_REPO = SERVER.replace(/__REPO__/, MAIN).replace(/\/\/$/, '/');
    DevWebLinks.MAIN_REPO_RAW = RAW_SERVER.replace(/__REPO__/, MAIN).replace(/\/\/$/, '/');
    DevWebLinks.RELEASE_REPO = SERVER.replace(/__REPO__/, MAIN_PREFIX + "release");
    DevWebLinks.RELEASE_REPO_RAW = RAW_SERVER.replace(/__REPO__/, MAIN_PREFIX + "release");
    DevWebLinks.GALLERY_RELEASE_REPO = GALLERY_RELEASE_SERVER + '/';
    DevWebLinks.GALLERY_RELEASE_REPO_RAW = DevWebLinks.GALLERY_RELEASE_REPO;
})(DevWebLinks = exports.DevWebLinks || (exports.DevWebLinks = {}));
//# sourceMappingURL=dev-web-links.js.map