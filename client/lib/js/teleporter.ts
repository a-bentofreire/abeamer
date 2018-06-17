"use strict";
// uuid: 19d4bf0d-48f2-4d72-bcfa-32a636038b50

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * <i class="fa fa-exclamation-triangle fa-lg"></i>
 * **Warning** This is still an experimental technology,
 * to push forward the development in this field,
 * please, consider leaving your donation or become a sponsor.
 *
 * **Teleporting** is the process of splitting the story created in one machine
 * into its constituting pieces and then from this pieces,
 * recreate the story in a remote machine, in order to generate
 * the physical story frames images in this remote machine.
 *
 * Teleporting allows a user to create animations just by using **a web browser
 * from a computer or tablet** without the need of installed software
 * nor direct access to the computer files.
 *
 * It was created with the main goal of allowing video hosting services,
 * ad network, and e-commerce companies to allow their users
 * or employees to build their animation in their machines,
 * and then generate the video on the company's machines.
 *
 * It can also be used, in case where the user is on a controlled
 * computer environment defined by the company's policy
 * or in case there is a faster machine available for rendering,
 * specially when the story contains heavy computational WebGL elements.
 *
 * The [ABeamer Animation Editor](animation-editor.md) will allow
 * to bring the remote rending to new heights.
 *
 * Without the ABeamer Animation Editor, it's required that the user has
 * basic skills of CSS and HTML. JavaScript programming skills aren't required.
 *
 * Due restrictions imposed by [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
 * It's required that:
 *
 * - The client either runs on a remote link or runs under a live server.
 *   ABeamer includes a live server. Just execute `abeamer serve`
 * - The render server agent must execute the url from a live server.
 *
 * With the current technology still has following limitations,
 * some of them imposed due security reasons:
 *
 * - [Code Handlers](Code Handler) aren't allowed.
 * - Only default scenes are allowed.
 * - Scenes can't be removed during the execution.
 * - Only fixed remote assets are allowed.
 * - Use only functionality that isn't marked as: doesn't supports teleporting.
 * - Assets inside CSS files must have the `url("....") format`
 * and be part of the project structure.
 * - No `<style>` tag inside html file is allowed.
 * - No `<script>` files are allowed.
 *
 *
 * ## Usage
 *
 * The whole process is fairly simple, just follow these steps:
 *
 * 1. create a project using abeamer command line called `my-project`.
 * `abeamer create my-project`.
 *
 * 2. download [animate-transitions](https://a-bentofreire.github.io/abeamer-gallery-release/animate-transitions/code.zip),
 * and unzip to the newly created folder `my-project`. When asked to overwrite the files, select 'Yes'.
 * This is just a complete example of story ready to teleport.
 * The following steps are for testing purposes, for production mode will be
 * described after.
 *
 * 3. Run the live server: `abeamer serve`.
 * Due CORS and since this is a local file it requires a live server.
 *
 * 4. Execute:
 * `abeamer render my-project --url http://localhost:9000/my-project/ --teleport`
 * This will create a file called `story.json` on `my-project` folder.
 *
 * 5. create a project using abeamer command line called `server`.
 * `abeamer create server`.
 * Download [remote-server](https://a-bentofreire.github.io/abeamer-gallery-release/remote-server/code.zip),
 * and unzip  to the newly created folder `server`. When asked to overwrite the files, select 'Yes'.
 *
 * 4. Copy the `story.json` from the `my-project` folder to the `server` folder.
 *
 * 6. Copy all the assets sub-folder from the `my-project` folder to the `server` folder.
 *
 * 7. Execute:
 * ```
 * abeamer render \
 * --url http://localhost:9000/server/ \
 * --allowed-plugins server/.allowed-plugins.json \
 * --inject-page server/index.html \
 * --config server/story.json
 * ```
 * This will generate the frames on `server/story-frames`
 *
 *
 * The previous steps where built for testing purposes,
 * since the teleporter was built to be used without the need of using anything
 * but the web browser.
 *
 * For production mode:
 *
 * 1. Open on chrome the following url: `http://localhost:9000/gallery/animate-transitions/`.
 *
 * 2. Uncomment both code lines on the 'animate-transitions/js/main.ts'.
 * And either compile using TypeScript or port those lines into main.js.
 * This will create the story with `{ toTeleport: true }`.
 * Which will record every part of the animation and instruct the library and plugins
 * to behave differently.
 *
 * 3. On chrome developer tools, you will see on the console the complete story as string.
 * This data was generated via `story.getStoryToTeleport()`
 * This is the data you have to send via Ajax to the remote server.
 *
 * In this case is no longer needed: `abeamer render --teleport`, nor access to the computer disk.
 *
 * ## How it works?
 *
 * When a story is created with `toTeleport = true`, ABeamer will:
 *
 * 1. Store a copy of the initial html and CSS (due CORS, it requires a live server).
 * 2. When transitions, stills or pEls are used, it will behave differently in order to be recorded into a file.
 * 3. On each addAnimations, a deep copy will be stored before tasks modify its content.
 * 4. Plugins will check if it's on teleporting mode, and act according to it.
 *
 * Instead of calling render, the `getStoryToTeleport` will generate data ready to be teleported.
 * This data must be **beamed** to the remote machine, usually via Ajax.
 *
 * The remote machine has an empty story body,
 * see [remote-server](https://a-bentofreire.github.io/abeamer-gallery-release/#remote-server), where it fills
 * with the data has been teleported and injects the plugins.
 *
 *
 * ## Security tips
 *
 * ABeamer is an open-source library, which runs inside a contained environment such as a web browser,
 * and doesn't allows the execution of any javascript code except from plugins.
 * However, in order to prevent malicious users or plugins, ensure that:
 *
 * 1. **Only allow 3rd party plugins from trusted sources**.
 * 2. Execute the live server in a contained environment.
 * 3. Don't place any password files accessible to the live server.
 * 4. The provided live server, is just a simple live server, consider using a more restrict live server.
 * 5. Blacklist from the browser the access to the local network resources.
 * 6. Use only the latest versions of the ABeamer, browser, and render server.
 * 7. Set the maxWidth, maxHeight, maxFps and maxFrameCount parameters for `abeamer render`
 * 8. Move the files .allowed-plugins.json and story.json from the user access.
 */
namespace ABeamer {

  interface CSSRule {
    /**
     * Path is the local path to CSS file used to remap url references.
     */
    path: string;
    text: string;
  }


  export class _Config {
    version?: string;

    width?: uint;
    height?: uint;
    fps?: uint;
    file?: string;
    userAgent?: string;

    locale?: string;

    renderPos?: uint;
    renderCount?: int;

    metadata?: StoryMetadata;

    plugins?: PluginInfo[];
    html?: string[];
    css?: CSSRule[];
    animations?: Animations[][];
  }


  export class _Teleporter {

    protected _active: boolean = false;
    protected _cfg: _Config;
    protected _story: _StoryImpl;
    hasStory: boolean = false;


    constructor(story: _StoryImpl, cfg: _Config, isTeleport: boolean) {
      this._story = story;
      this._cfg = cfg;

      if (isTeleport) {
        pluginManager._plugins.forEach(plugin => {
          if (!plugin.teleportable) {
            throwErr(`Plugin ${plugin.id} doesn't supports teleporting`);
          }
        });

        this._active = true;
        // these parameters should come first
        cfg.version = VERSION;
        cfg.locale = pluginManager._locale;
        cfg.file = cfg.file || "__PROJDIR__/index.html";
        cfg.renderPos = 0;
        cfg.renderCount = 0;
        cfg.userAgent = window.navigator.userAgent;
        cfg.metadata = {};

        // this parameters because tend to be longer should come at the end.
        cfg.plugins = pluginManager._plugins;
        cfg.animations = [];
        cfg.html = (story.storyAdapter.getProp('html', story._args) as string).split(/\n/);
        cfg.css = _getStoryCSS();
      } else {
        this.hasStory = cfg.html !== undefined;
      }
    }


    get active() {
      return this._active;
    }


    _getStoryToTeleport(isPretty?: boolean): string {

      this._cfg.renderPos = this._story.renderFramePos;
      this._cfg.renderCount = this._story.renderFrameCount;
      this._cfg.metadata = this._story.metadata;

      return JSON.stringify({
        config: { abeamer: this._cfg },
      }, undefined, isPretty ? 2 : undefined);
    }


    _rebuildStory(): void {
      const story = this._story;

      // css must be rebuilt before html.
      if (this._cfg.css) {
        _buildCssRulesFromConfig(this._cfg.css);
      }

      if (this._cfg.html) {
        story.storyAdapter.setProp('html',
          _sanitizeHtml(this._cfg.html.join('\n')), story._args);
        story.addDefaultScenes();
      }

      if (this._cfg.animations) {
        story.addStoryAnimations(this._cfg.animations);
      }

      if (this._cfg.metadata) {
        _filteredDeepCopy(this._cfg.metadata, story.metadata);
      }
    }


    _addScene(): void {
      this._cfg.animations.push([]);
    }


    _addAnimations(anime: Animations, sceneIndex: uint): void {
      this._cfg.animations[sceneIndex].push(_filteredDeepCopy(anime, []));
    }


    _fillFrameOpts(frameOpts: RenderFrameOptions): RenderFrameOptions {
      frameOpts = frameOpts || {};
      // during teleporting don't use stored frameOptions.
      if (this._active) { return frameOpts; }

      // disabled for now, until is found a fix.
      // frameOpts.renderPos = frameOpts.renderPos || this._cfg.renderPos;
      // frameOpts.renderCount = frameOpts.renderCount || this._cfg.renderCount;
      return frameOpts;
    }
  }


  function _getStoryCSS(): CSSRule[] {
    const pageRoot = _getPageRoot();
    const styleSheets = window.document.styleSheets;
    const rules: CSSRule[] = [];
    for (let sheetI = 0; sheetI < styleSheets.length; sheetI++) {
      const style = styleSheets[sheetI] as CSSStyleSheet;
      const styleHref = style.href;
      if (styleHref.endsWith('normalize.css')
        || styleHref.endsWith('abeamer.min.css')) {
        continue;
      }
      const path = styleHref.startsWith(pageRoot) ?
        styleHref.substr(pageRoot.length).replace(/\/[^/]*$/, '/') : '';
      const cssRules = style.cssRules;
      for (let ruleI = 0; ruleI < cssRules.length; ruleI++) {
        const cssRule = cssRules[ruleI];
        rules.push({ path, text: cssRule.cssText });
      }
    }
    return rules;
  }


  /**
   * Recursively copies one object into another, and sanitizes the input
   * to ensure there are no javascript functions.
   * keys starting with `_` aren't copied.
   */
  function _filteredDeepCopy(src: any, dst: any): any {
    if (Array.isArray(src)) {
      src.forEach(item => {
        switch (typeof item) {
          case 'function':
            throwI8n(Msgs.NoCode);
            break;
          case 'object':
            dst.push(_filteredDeepCopy(item, Array.isArray(item) ? [] : {}));
            break;
          default:
            dst.push(item);
        }
      });
    } else {
      Object.keys(src).forEach(key => {
        if (key[0] !== '_') {
          const item = src[key];
          switch (typeof item) {
            case 'function':
              throwI8n(Msgs.NoCode);
              break;
            case 'object':
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


  function _buildCssRulesFromConfig(cssRules: CSSRule[]): void {
    const pageRoot = _getPageRoot();
    const styleSheets = window.document.styleSheets;
    const lastSheet = styleSheets[styleSheets.length - 1] as CSSStyleSheet;
    let cssRulesLen = lastSheet.cssRules.length;
    for (let i = 0; i < cssRules.length; i++) {
      const cssRule = cssRules[i];
      const prefixedCssRule = _handleVendorPrefixes(cssRule.text);
      const remappedRule = _remapCSSRuleLocalLink(pageRoot, cssRule.path,
        prefixedCssRule);
      lastSheet.insertRule(remappedRule, cssRulesLen++);
    }
  }


  /** Prevents scripts to be injected to the teleported story. */
  function _sanitizeHtml(html: string): string {
    return html.replace(/\<\s*script/gi, '');
  }


  /** Returns the url location of the current web page without the html file name. */
  function _getPageRoot(): string {
    const location = window.location;
    return location.origin + (location.pathname || '').replace(/\/[^/]*$/, '/');
  }


  /**
   * Adds or removes vendor prefixes from the teleported story.
   */
  function _handleVendorPrefixes(text: string): string {
    return text.replace(/([\w\-]+)\s*:([^;]*;)/g, (all, propName, propValue) => {
      const propNames = _propNameToVendorProps(propName);
      return propNames.map(name => `${name}: ${propValue}`).join(' ');
    });
  }


  /**
   * When CSS rules are injected, the web browser has a different behavior
   * regarding local url links inside CSS files.
   * This function from the original path and current host generates a new link.
   */
  function _remapCSSRuleLocalLink(pageRoot: string, path: string,
    cssText: string): string {

    return !path ? path : cssText.replace(/url\("([^"]+)"\)/g, (all, link) => {
      if (link.startsWith('http')) { return all; }
      const newLink = pageRoot + path + link;
      return `url("${newLink}")`;
    });
  }
}
