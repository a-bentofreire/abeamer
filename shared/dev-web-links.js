"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid: 00070273-0c00-4574-b824-a9e4a79e9a3f
// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------
/** @module developer | This module won't be part of release version */
var DevWebLinks;
(function (DevWebLinks) {
    var LOCAL_PORT = 9000;
    DevWebLinks.localServer = "http://localhost:" + LOCAL_PORT;
    DevWebLinks.webDomain = 'https://www.abeamer.com';
    function getServer(isLocal) {
        return isLocal ? DevWebLinks.localServer : DevWebLinks.webDomain;
    }
    DevWebLinks.getServer = getServer;
})(DevWebLinks = exports.DevWebLinks || (exports.DevWebLinks = {}));
//# sourceMappingURL=dev-web-links.js.map