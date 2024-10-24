"use strict";
var ABeamer;
((ABeamer2) => {
  const INFO_PER_SERVER = {
    _default: {
      map: {},
      features: {
        hasLogging: true
      }
    },
    puppeteer: {
      map: {},
      features: {
        hasLogging: true
      }
    }
  };
  function _setServer(serverName) {
    const serverInfo = INFO_PER_SERVER[serverName] || INFO_PER_SERVER._default;
    _addServerDOMPropMaps(serverInfo.map);
    return serverInfo.features;
  }
  ABeamer2._setServer = _setServer;
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=server-features.js.map
