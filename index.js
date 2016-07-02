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
      for (var i = 0; i < monitors.length; i++) {
        if (monitors[i].Spaces) {
          for (var j = 0; j < monitors[i].Spaces.length; j++) {
            spaceArr.push({
              displayUUID: monitors[i]['Display Identifier'],
              spaceUUID: monitors[i].Spaces[j].uuid
            });
          }
        }
      }
    }

    callback(spaceArr);
  });
};


var spacesByDisplay = function(callback) {
  spaces(function(collectedSpaces) {
    var spaceMap = {};
    var displayUUIDs = [];
    var displayUUID;
    for (var i = 0; i < collectedSpaces.length; i++) {
      displayUUID = collectedSpaces[i].displayUUID;
      spaceMap[displayUUID] = spaceMap[displayUUID] || [];
      spaceMap[displayUUID].push(collectedSpaces[i].spaceUUID);
      if (displayUUIDs.indexOf(displayUUID) === -1) {
        displayUUIDs.push(displayUUID);
      }
    }

    var groupedArr = [];
    for (i = 0; i < displayUUIDs.length; i++) {
      groupedArr.push({
        displayUUID: displayUUIDs[i],
        spaceUUIDs: spaceMap[displayUUIDs[i]]
      });
    }

    callback(groupedArr);
  });
};

module.exports = {
  rawConfig: rawConfig,
  spaces: spaces,
  spacesByDisplay: spacesByDisplay
};
