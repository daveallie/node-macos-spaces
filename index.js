var exec = require("child_process").exec;
var plist = require('plist');

var rawConfig = function(callback) {
  exec('defaults export com.apple.spaces -', function(err, stdout, stderr) {
    if (err) { callback(err) };
    callback(plist.parse(stdout));
  });
};

var extract = function(raw) {
  var spaceArr = [];

  var monitors = raw.SpacesDisplayConfiguration['Management Data'].Monitors;
  if (monitors) {
    monitors.forEach(function (monitor, key) {
      var spaces = monitor.Spaces;
      if (spaces) {
        spaces.forEach(function (space) {
          spaceArr.push({
            displayUUID: monitor['Display Identifier'],
            spaceUUID: space.uuid,
          });
        });
      }
    });
  }

  return spaceArr;
};

var spaces = function(raw, callback) {
  if (typeof raw == 'function') {
    callback = raw;
    return rawConfig(function(raw) {
      callback(extract(raw));
    });
  }
  callback(extract(raw));
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
  allSpaces: spacesByDisplay,
  spacesByDisplay: spacesByDisplay
};
