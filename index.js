var exec = require("child_process").exec;
var ndictionaryParser = require("./ndictionary-parser");

var rawConfig = function(callback) {
  exec('defaults read com.apple.spaces', function(err, stdout, stderr) {
    callback(JSON.parse(ndictionaryParser.parse(stdout)));
  });
};

var spaces = function(callback) {
  rawConfig(function(map) {
    var spaceArr = [];

    var monitors = map.SpacesDisplayConfiguration['Management Data'].Monitors;
    if (monitors) {
      monitors.forEach(function(m) {
        if (m.Spaces) {
          m.Spaces.forEach(function(s) {
            spaceArr.push({
              displayUUID: m['Display Identifier'],
              spaceUUID: s.uuid
            });
          });
        }
      });
    }

    callback(spaceArr);
  });
};


var spacesByDisplay = function(callback) {
  spaces(function(collectedSpaces) {
    var spaceMap = {};
    var displayUUIDs = [];
    collectedSpaces.forEach(function(s) {
      spaceMap[s.displayUUID] = spaceMap[s.displayUUID] || [];
      spaceMap[s.displayUUID].push(s.spaceUUID);
      if (displayUUIDs.indexOf(s.displayUUID) === -1) {
        displayUUIDs.push(s.displayUUID);
      }
    });

    callback(displayUUIDs.map(function(duuid) {
      return {
        displayUUID: duuid,
        spaceUUIDs: spaceMap[duuid]
      };
    }));
  });
};

module.exports = {
  rawConfig: rawConfig,
  spaces: spaces,
  spacesByDisplay: spacesByDisplay
};
