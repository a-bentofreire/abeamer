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
    var repoSuffixes = ['*', 'release', 'gallery-release', 'docs'];
    var LOCAL_PORT = 9000;
    var localUrl = "http://localhost:" + LOCAL_PORT;
    var repoUrl = "https://github.com/a-bentofreire/";
    var pagesUrl = "https://a-bentofreire.github.io/";
    var docsUrl = "https://www.abeamer.com";
    var rawUrl = "https://raw.githubusercontent.com/a-bentofreire/";
    var urlMapper = {
        'docs/build/end-user': 'end-user',
        'docs/build/developer': 'developer',
        'gallery-release': 'abeamer-gallery-release',
        'release': 'abeamer-gallery-release',
    };
    var urlMapperKeys = Object.keys(urlMapper);
    var exceptionsUrls = [/blob\/master/, /archive\/master\.zip/, /\/issues\/$/];
    function convertLink(link, isTargetLocal) {
        if (isTargetLocal) {
            if (exceptionsUrls.findIndex(function (regEx) { return link.search(regEx) !== -1; }) !== -1) {
                return link;
            }
            var _a = link
                .match(/^.*\/(abeamer[\w\-]*(?:\/(?:end-user|developer))?)(?:\/master)?(.*)$/)
                || ['', '', ''], all = _a[0], findKey_1 = _a[1], subUrl = _a[2];
            if (all && subUrl !== '') {
                var matchKey = urlMapperKeys.find(function (key) { return findKey_1 === urlMapper[key]; });
                if (matchKey) {
                    subUrl = matchKey + subUrl;
                }
                else {
                    subUrl = subUrl.substr(1);
                }
                var resUrl = localUrl + '/' + subUrl;
                return resUrl;
            }
        }
        else {
            if (link.startsWith(localUrl)) {
                var isMedia = link.search(/\.(?:gif|png|mp4|jpg|zip)$/) !== -1;
                var _b = link.match(/^http:\/\/[^\/]+\/(.*)$/) || ['', ''], all = _b[0], subUrl_1 = _b[1];
                if (all) {
                    var matchKey = urlMapperKeys.find(function (key) { return subUrl_1.startsWith(key); });
                    if (matchKey) {
                        subUrl_1 = urlMapper[matchKey] + subUrl_1.substr(matchKey.length);
                    }
                    else {
                        subUrl_1 = 'abeamer/' + subUrl_1;
                    }
                    var resUrl = (isMedia
                        ? rawUrl + subUrl_1.replace(/([\w\-]+)/, '$1/master')
                        : pagesUrl + subUrl_1);
                    return resUrl;
                }
            }
        }
        return link;
    }
    DevWebLinks.convertLink = convertLink;
    DevWebLinks.repos = {
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
    function setup(isLocal) {
        // @TODO: Port this code to RepoType
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
            ? 'https://www.abeamer.com/docs'
            : "http://localhost:" + LOCAL_PORT + "/docs/build";
        var releaseStatic = !isLocal
            ? 'https://a-bentofreire.github.io/abeamer-release/'
            : "http://localhost:" + LOCAL_PORT + "/release/";
        var main = !isLocal ? 'abeamer' : '';
        var mainPrefix = !isLocal ? 'abeamer-' : '';
        DevWebLinks.repos.main = server.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.repos.mainRaw = rawServer.replace(/__REPO__/, main).replace(/\/\/$/, '/');
        DevWebLinks.repos.release = server.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.repos.releaseRaw = rawServer.replace(/__REPO__/, mainPrefix + "release");
        DevWebLinks.repos.releaseStatic = releaseStatic;
        DevWebLinks.repos.galleryRelease = galleryReleaseServer + '/';
        DevWebLinks.repos.galleryReleaseRaw = DevWebLinks.repos.galleryRelease;
        DevWebLinks.repos.docs = docsServer;
    }
    DevWebLinks.setup = setup;
})(DevWebLinks = exports.DevWebLinks || (exports.DevWebLinks = {}));
//# sourceMappingURL=dev-web-links.js.map