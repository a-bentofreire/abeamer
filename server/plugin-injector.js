"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var plugin_injector_exports = {};
__export(plugin_injector_exports, {
  PluginInjector: () => PluginInjector
});
module.exports = __toCommonJS(plugin_injector_exports);
var PluginInjector;
((PluginInjector2) => {
  PluginInjector2.plugins = [];
  let allowedPlugins = [];
  function loadAllowedPlugins(fileName, existsSync, readUtf8Sync) {
    if (!existsSync(fileName)) {
      throw `${fileName} doesn't exists`;
    }
    allowedPlugins = JSON.parse(readUtf8Sync(fileName)).plugins;
  }
  PluginInjector2.loadAllowedPlugins = loadAllowedPlugins;
  function processUrl(urlBase, url) {
    return url.search(/^http/) !== -1 ? url : `${urlBase}/${url}`;
  }
  PluginInjector2.processUrl = processUrl;
  function inject(existsSync, readUtf8Sync, writeFileSync) {
    if (!allowedPlugins.length) {
      return;
    }
    if (!PluginInjector2.injectPage || !existsSync(PluginInjector2.injectPage)) {
      throw `${PluginInjector2.injectPage} doesn't exists`;
    }
    PluginInjector2.plugins.forEach((plugin) => {
      if (!plugin.uuid || !plugin.author) {
        throw `Invalid plugin uuid: ${plugin.uuid} author: ${plugin.author}`;
      }
      const match = allowedPlugins.find((allowedPlugin) => allowedPlugin.uuid === plugin.uuid);
      if (!match) {
        throw `Forbidden plugin uuid: ${plugin.uuid} author: ${plugin.author}`;
      }
      plugin.jsUrls = match.jsUrls;
      plugin.cssUrls = match.cssUrls;
    });
    let content = readUtf8Sync(PluginInjector2.injectPage);
    writeFileSync(PluginInjector2.injectPage + ".bak.html", content);
    const urlMatches = content.match(/["']([^"']+)\/css\/abeamer\.[\w\.]*css["']/);
    if (!urlMatches) {
      throw `Couldn't parse abeamer script link`;
    }
    const urlBase = urlMatches[1];
    content = content.replace(
      /(#plugins-js-block-start.*\n)((?:.|\n)*)(\n.*#plugins-js-block-end)/,
      (_all, before, _replaceArea, after) => {
        const output = [];
        PluginInjector2.plugins.forEach((plugin) => {
          (plugin.jsUrls || []).forEach((url) => {
            output.push(`    <script src="${processUrl(urlBase, url)}"><\/script>`);
          });
        });
        return before + "\n" + output.join("\n") + "\n" + after;
      }
    );
    content = content.replace(
      /(#plugins-css-block-start.*\n)((?:.|\n)*)(\n.*#plugins-css-block-end)/,
      (_all, before, _replaceArea, after) => {
        const output = [];
        PluginInjector2.plugins.forEach((plugin) => {
          (plugin.cssUrls || []).forEach((url) => {
            output.push(`    <link href="${processUrl(urlBase, url)}" rel="stylesheet">`);
          });
        });
        return before + "\n" + output.join("\n") + "\n" + after;
      }
    );
    writeFileSync(PluginInjector2.injectPage, content);
  }
  PluginInjector2.inject = inject;
})(PluginInjector || (PluginInjector = {}));
//# sourceMappingURL=plugin-injector.js.map
