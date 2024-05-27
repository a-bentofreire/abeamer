"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Checks if plugins are valid and inject their css and js into the index.html

/** @module internal | This module is to be read only by developers */

// @WARN: Don't import any nodejs modules nor
// any other modules depending on node modules since it can be called by phantomjs

export namespace PluginInjector {

  export interface PluginInfo {
    id: string;
    uuid: string;
    author: string;
    email: string;
    copyrights?: string;
    jsUrls?: string[];
    cssUrls?: string[];
    assetsUrls?: string[];
    telemetricUrl?: string[];
    teleportable: boolean;
  }


  export let plugins: PluginInfo[] = [];
  export let injectPage: string;
  let allowedPlugins: PluginInfo[] = [];


  export function loadAllowedPlugins(fileName: string,
    existsSync: (fileName: string) => boolean,
    readUtf8Sync: (fileName: string) => any) {

    if (!existsSync(fileName)) {
      throw `${fileName} doesn't exists`;
    }

    allowedPlugins = JSON.parse(readUtf8Sync(fileName)).plugins;
  }


  export function processUrl(urlBase: string, url: string): string {
    return url.search(/^http/) !== -1 ? url : `${urlBase}/${url}`;
  }


  export function inject(
    existsSync: (fileName: string) => boolean,
    readUtf8Sync: (fileName: string) => any,
    writeFileSync: (fileName: string, data) => void) {

    // check if allowedPlugins was defined.
    if (!allowedPlugins.length) {
      return;
    }

    if (!injectPage || !existsSync(injectPage)) {
      throw `${injectPage} doesn't exists`;
    }

    // check if the plugins are allowed and replace the urls with safe urls.
    plugins.forEach(plugin => {
      if (!plugin.uuid || !plugin.author) {
        throw `Invalid plugin uuid: ${plugin.uuid} author: ${plugin.author}`;
      }
      const match = allowedPlugins.find(allowedPlugin => allowedPlugin.uuid === plugin.uuid);
      if (!match) {
        throw `Forbidden plugin uuid: ${plugin.uuid} author: ${plugin.author}`;
      }
      plugin.jsUrls = match.jsUrls;
      plugin.cssUrls = match.cssUrls;
    });


    let content = readUtf8Sync(injectPage);
    writeFileSync(injectPage + '.bak.html', content);
    const urlMatches = content.match(/["']([^"']+)\/css\/abeamer\.[\w\.]*css["']/);
    if (!urlMatches) {
      throw `Couldn't parse abeamer script link`;
    }
    const urlBase = urlMatches[1];
    // inject js scripts
    content = content.replace(/(#plugins-js-block-start.*\n)((?:.|\n)*)(\n.*#plugins-js-block-end)/,
      (_all, before, _replaceArea, after) => {
        const output = [];
        plugins.forEach(plugin => {
          (plugin.jsUrls || []).forEach(url => {
            output.push(`    <script src="${processUrl(urlBase, url)}"></script>`);
          });
        });
        return before + '\n' + output.join('\n') + '\n' + after;
      });

    // inject css links
    content = content.replace(/(#plugins-css-block-start.*\n)((?:.|\n)*)(\n.*#plugins-css-block-end)/,
      (_all, before, _replaceArea, after) => {
        const output = [];
        plugins.forEach(plugin => {
          (plugin.cssUrls || []).forEach(url => {
            output.push(`    <link href="${processUrl(urlBase, url)}" rel="stylesheet">`);
          });
        });
        return before + '\n' + output.join('\n') + '\n' + after;
      });

    writeFileSync(injectPage, content);
  }
}
