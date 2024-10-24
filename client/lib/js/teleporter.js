"use strict";
var ABeamer;
((ABeamer2) => {
  class _InnerConfig {
  }
  ABeamer2._InnerConfig = _InnerConfig;
  class _Teleporter {
    constructor(story, cfg, isTeleport) {
      this._active = false;
      this.hasStory = false;
      this._story = story;
      this._cfg = cfg;
      if (isTeleport) {
        pluginManager._plugins.forEach((plugin) => {
          if (!plugin.teleportable) {
            throwErr(`Plugin ${plugin.id} doesn't supports teleporting`);
          }
        });
        this._active = true;
        cfg.version = VERSION;
        cfg.locale = pluginManager._locale;
        cfg.file = cfg.file || "__PROJDIR__/index.html";
        cfg.renderPos = 0;
        cfg.renderCount = 0;
        cfg.userAgent = window.navigator.userAgent;
        cfg.metadata = {};
        cfg.plugins = pluginManager._plugins;
        cfg.animations = [];
      } else {
        this.hasStory = cfg.html !== void 0;
      }
    }
    createSnapshot() {
      this._cfg.html = this._story.storyAdapter.getProp("html", this._story._args).split(/\n/);
      this._cfg.css = _getStoryCSS();
    }
    get active() {
      return this._active;
    }
    _getStoryToTeleportAsConfig() {
      this._cfg.renderPos = this._story.renderFramePos;
      this._cfg.renderCount = this._story.renderFrameCount;
      this._cfg.metadata = this._story.metadata;
      return { config: { abeamer: this._cfg } };
    }
    _rebuildStory() {
      const story = this._story;
      if (this._cfg.css) {
        _buildCssRulesFromConfig(this._cfg.css);
      }
      if (this._cfg.html) {
        story.storyAdapter.setProp(
          "html",
          _sanitizeHtml(this._cfg.html.join("\n")),
          story._args
        );
        story.addDefaultScenes();
      }
      if (this._cfg.animations) {
        story.addStoryAnimations(this._cfg.animations);
      }
      if (this._cfg.metadata) {
        _filteredDeepCopy(this._cfg.metadata, story.metadata);
      }
    }
    _addScene() {
      this._cfg.animations.push([]);
    }
    _addAnimations(anime, sceneIndex) {
      this._cfg.animations[sceneIndex].push(_filteredDeepCopy(anime, []));
    }
    _fillFrameOpts(frameOpts) {
      frameOpts = frameOpts || {};
      if (this._active) {
        return frameOpts;
      }
      return frameOpts;
    }
  }
  ABeamer2._Teleporter = _Teleporter;
  function _getStoryCSS() {
    const pageRoot = _getPageRoot();
    const styleSheets = window.document.styleSheets;
    const rules = [];
    for (let sheetI = 0; sheetI < styleSheets.length; sheetI++) {
      const style = styleSheets[sheetI];
      const styleHref = style.href;
      if (styleHref.endsWith("normalize.css") || styleHref.endsWith("abeamer.min.css")) {
        continue;
      }
      const path = styleHref.startsWith(pageRoot) ? styleHref.substr(pageRoot.length).replace(/\/[^/]*$/, "/") : "";
      const cssRules = style.cssRules;
      for (let ruleI = 0; ruleI < cssRules.length; ruleI++) {
        const cssRule = cssRules[ruleI];
        rules.push({ path, text: cssRule.cssText });
      }
    }
    return rules;
  }
  function _filteredDeepCopy(src, dst) {
    if (Array.isArray(src)) {
      src.forEach((item) => {
        switch (typeof item) {
          case "function":
            throwI8n(Msgs.NoCode);
            break;
          case "object":
            dst.push(_filteredDeepCopy(item, Array.isArray(item) ? [] : {}));
            break;
          default:
            dst.push(item);
        }
      });
    } else {
      Object.keys(src).forEach((key) => {
        if (key[0] !== "_") {
          const item = src[key];
          switch (typeof item) {
            case "function":
              throwI8n(Msgs.NoCode);
              break;
            case "object":
              dst[key] = Array.isArray(item) ? [] : {};
              _filteredDeepCopy(item, dst[key]);
              break;
            default:
              dst[key] = item;
          }
        }
      });
    }
    return dst;
  }
  function _buildCssRulesFromConfig(cssRules) {
    const pageRoot = _getPageRoot();
    const styleSheets = window.document.styleSheets;
    const lastSheet = styleSheets[styleSheets.length - 1];
    let cssRulesLen = lastSheet.cssRules.length;
    for (let i = 0; i < cssRules.length; i++) {
      const cssRule = cssRules[i];
      const prefixedCssRule = _handleVendorPrefixes(cssRule.text);
      const remappedRule = _remapCSSRuleLocalLink(
        pageRoot,
        cssRule.path,
        prefixedCssRule
      );
      lastSheet.insertRule(remappedRule, cssRulesLen++);
    }
  }
  function _sanitizeHtml(html) {
    return html.replace(/\<\s*script/gi, "");
  }
  function _getPageRoot() {
    const location = window.location;
    return location.origin + (location.pathname || "").replace(/\/[^/]*$/, "/");
  }
  function _handleVendorPrefixes(text) {
    return text.replace(/([\w\-]+)\s*:([^;]*;)/g, (_all, propName, propValue) => {
      const propNames = _propNameToVendorProps(propName);
      return propNames.map((name) => `${name}: ${propValue}`).join(" ");
    });
  }
  function _remapCSSRuleLocalLink(pageRoot, path, cssText) {
    return !path ? path : cssText.replace(/url\("([^"]+)"\)/g, (all, link) => {
      if (link.startsWith("http")) {
        return all;
      }
      const newLink = pageRoot + path + link;
      return `url("${newLink}")`;
    });
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=teleporter.js.map
