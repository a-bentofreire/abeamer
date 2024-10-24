"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var build_gallery_latest_exports = {};
__export(build_gallery_latest_exports, {
  BuildGalleryLatest: () => BuildGalleryLatest
});
module.exports = __toCommonJS(build_gallery_latest_exports);
var sysFs = __toESM(require("fs"));
var import_child_process = require("child_process");
var import_fsix = require("../vendor/fsix.js");
var BuildGalleryLatest;
((BuildGalleryLatest2) => {
  BuildGalleryLatest2.EXAMPLE_ZIP_FILE = "code.zip";
  BuildGalleryLatest2.releaseExamples = [];
  function populateReleaseExamples(cfg) {
    const exclusions = import_fsix.fsix.loadJsonSync(`${cfg.paths.GALLERY_SRC_PATH}/exclude-from-release.json`);
    sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH).forEach((folder) => {
      if (exclusions.indexOf(folder) !== -1) {
        return;
      }
      const srcFullPath = `${cfg.paths.GALLERY_SRC_PATH}/${folder}`;
      const dstFullPath = `${cfg.paths.GALLERY_LATEST_PATH}/${folder}`;
      const iniFileName = `${srcFullPath}/abeamer.ini`;
      if (sysFs.existsSync(iniFileName)) {
        const ex = {
          width: 0,
          height: 0,
          folder,
          srcFullPath,
          dstFullPath,
          iniFileName,
          description: [],
          usesLive: false,
          noGifImage: false,
          genMovie: false,
          teleportable: true,
          movieSnapshot: "",
          movieViewPage: ""
        };
        let prevNr = 0;
        let lastDescLine = "";
        import_fsix.fsix.readUtf8Sync(iniFileName).replace(
          /[\$@]abeamer-([a-z\-]+)(\d*)\s*:\s*"?([^";]+)"?/g,
          (_all, id, nr, value) => {
            switch (id) {
              case "description":
                nr = parseInt(nr || "1");
                if (nr !== prevNr + 1) {
                  console.warn(`Incorrect description numbering in ${iniFileName}`);
                }
                prevNr = nr;
                if (lastDescLine && !lastDescLine.match(/[:\.]$/)) {
                  lastDescLine += " " + value;
                  ex.description[ex.description.length - 1] = lastDescLine;
                } else {
                  ex.description.push(value);
                  lastDescLine = value;
                }
                break;
              case "width":
                ex.width = parseInt(value);
                break;
              case "height":
                ex.height = parseInt(value);
                break;
              case "uses-live":
                ex.usesLive = value.toLowerCase() === "true";
                break;
              case "no-gif-image":
                ex.noGifImage = value.toLowerCase() === "true";
                break;
              case "gen-movie":
                ex.genMovie = value.toLowerCase() === "true";
                ex.noGifImage = ex.noGifImage || ex.genMovie;
                break;
              case "teleportable":
                ex.teleportable = value.toLowerCase() === "true";
                break;
              case "movie-snapshot":
                ex.movieSnapshot = value;
                break;
              case "movie-view-page":
                ex.movieViewPage = value;
                break;
            }
            return "";
          }
        );
        if (!ex.description.length) {
          ex.description.push(folder);
        }
        BuildGalleryLatest2.releaseExamples.push(ex);
      }
    });
  }
  BuildGalleryLatest2.populateReleaseExamples = populateReleaseExamples;
  function buildReadMe(cfg) {
    const galleryLinks = [];
    const missingFiles = [];
    const rnd = Math.round(Math.random() * 1e8);
    function checkFile(fileName) {
      if (!sysFs.existsSync(fileName)) {
        missingFiles.push(fileName);
      }
      return fileName;
    }
    BuildGalleryLatest2.releaseExamples.forEach((ex) => {
      galleryLinks.push(`
--------------------------
### ${ex.folder}
${ex.description.join("  \n")}${"  "}`);
      const storyFramesFolder = `${ex.folder}/story-frames`;
      if (!ex.noGifImage) {
        checkFile(`./${cfg.paths.GALLERY_SRC_PATH}/${ex.folder}/story-frames/story.gif`);
        galleryLinks.push(`
  
![Image](${storyFramesFolder}/story.gif?${rnd})${"  "}
  `);
      }
      if (ex.genMovie) {
        galleryLinks.push(`
  
[![Image](${storyFramesFolder}/../${ex.movieSnapshot})](${storyFramesFolder}/../${ex.movieViewPage})${"  "}
  `);
      }
      galleryLinks.push(`
Download code: [zip](${ex.folder}/${BuildGalleryLatest2.EXAMPLE_ZIP_FILE}).${"  "}
Try it <a href="${ex.folder}/index-online.html">online</a>.${"  "}
${ex.usesLive ? "**WARNING** This example requires a live server.  \n" : "  \n"}
${!ex.teleportable ? "**WARNING** This example doesn't supports teleportation.  \n" : "  \n"}
    `);
    });
    const outREADME = import_fsix.fsix.readUtf8Sync(`${cfg.paths.GALLERY_SRC_PATH}/README-rel.md`) + galleryLinks.join("");
    sysFs.writeFileSync(`${cfg.paths.GALLERY_LATEST_PATH}/README.md`, outREADME);
    if (missingFiles.length) {
      console.error(`Missing files:
` + missingFiles.join("\n"));
    }
  }
  BuildGalleryLatest2.buildReadMe = buildReadMe;
  function runSpawn(cmdLine, args, callback) {
    console.log(`spawn cmdLine: ${cmdLine}`);
    console.log(`args: ${args}`);
    const ls = (0, import_child_process.spawn)(cmdLine, args);
    ls.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    ls.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    ls.on("close", () => {
      callback();
    });
  }
  function buildGifs(cfg) {
    populateReleaseExamples(cfg);
    BuildGalleryLatest2.releaseExamples.forEach((example) => {
      if (example.noGifImage) {
        return;
      }
      runSpawn("npm", [
        "run",
        "--",
        "render",
        "--dp",
        "--url",
        `${cfg.webLinks.localServer}/${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/`,
        "--config",
        `./${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/abeamer.ini`
      ], () => {
        runSpawn(
          "npm",
          ["run", "--", "gif", `${cfg.paths.GALLERY_SRC_PATH}/${example.folder}/`],
          () => {
            console.log(`Done example: ${example.folder}`);
          }
        );
      });
      console.log(`example.folder: ${example.folder}`);
    });
  }
  BuildGalleryLatest2.buildGifs = buildGifs;
})(BuildGalleryLatest || (BuildGalleryLatest = {}));
//# sourceMappingURL=build-gallery-latest.js.map
