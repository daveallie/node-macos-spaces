var fs = require("fs");
var exec = require("child_process").exec;
var helpers = require("./helpers");
var ndictionaryParser = require("./ndictionary-parser");
var spacesPlist = process.env.HOME + '/Library/Preferences/com.apple.spaces.plist';

var rawConfig = function(callback) {
  exec('defaults read com.apple.spaces', function(err, stdout, stderr) {
    callback(JSON.parse(ndictionaryParser.parse(stdout)));
  });
};

var spaceData = function(filterActive, callback) {
  rawConfig(function(map) {
    var monitors = map.SpacesDisplayConfiguration['Management Data'].Monitors;
    var activeSpaces = map.SpacesDisplayConfiguration['Space Properties'].map(function(s) {
      return s.name;
    });

    var containsActive;
    var spaces;
    var spaceMap;

    if (monitors) {
      spaceMap = monitors.map(function(m) {
        containsActive = false;

        if (m.Spaces) {
          spaces = m.Spaces.map(function(s) {
            containsActive = containsActive || (activeSpaces.indexOf(s.uuid) > -1);
            return s.uuid;
          });
        } else {
          spaces = [];
        }

        if (!filterActive || containsActive) {
          return {
            monitorId: m['Display Identifier'],
            spaces: spaces
          };
        }
      });
    } else {
      spaceMap = [];
    }

    callback(helpers.cleanArray(spaceMap, undefined));
  });
};

var allSpaces = function(callback) {
  spaceData(false, callback);
};

var spaces = function(callback) {
  spaceData(true, callback);
};

module.exports = {
  rawConfig: rawConfig,
  spaces: spaces
};
