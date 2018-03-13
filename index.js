var exec = require("child_process").exec;
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var rawConfig = function(callback) {
  exec('defaults export com.apple.spaces -', function(err, stdout, stderr) {
    if (err) { callback(err) };
    var doc = new dom().parseFromString(stdout);
    callback(doc);
  });
};

var spaces = function(callback) {
  rawConfig(function(doc) {
    var spaceArr = [];

    var monitors_query = "//dict[preceding-sibling::key='SpacesDisplayConfiguration']//dict[key='Current Space']";
    var monitors = xpath.select(monitors_query, doc);

    if (monitors) {
      monitors.forEach(function (monitor, key) {
        var index = "[" + (key + 1) + "]";
        var display = xpath.select(monitors_query + index + "/string[preceding-sibling::key='Display Identifier']", monitor);
        var displayUUID = display[0].firstChild.data;
        var spaces = xpath.select(monitors_query + "/array/dict" + index + "/string[preceding-sibling::key='uuid']", monitor);
        if (spaces) {
          spaces.forEach(function (space) {
            spaceArr.push({
              displayUUID: displayUUID,
              spaceUUID: space.firstChild.data
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
  allSpaces: spacesByDisplay,
  spacesByDisplay: spacesByDisplay
};
