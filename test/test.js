var fs = require('fs');
var plist = require('plist');
var assert = require('assert');
var spaces = require('../');

function fixture(version) {
  var file = __dirname + '/fixtures/' + version + '.xml';
  return plist.parse(fs.readFileSync(file).toString());
}

describe('macos_spaces', function () {
  it('should return at least one space for Main display', function(callback) {
    spaces.spaces(function (result) {
      assert(result.length > 0);
      assert.equal(result[0].displayUUID, 'Main');
      callback();
    });
  });

  it('should group spaces by display', function(callback) {
    spaces.allSpaces(function (result) {
      assert(result.length > 0);
      assert.equal(result[0].displayUUID, 'Main');
      assert(result[0].spaceUUIDs.length > 0);
      callback();
    });
  });

  it('should support the 10.13.2 version of the macos', function(callback) {
    var raw = fixture('10_13_2');
    spaces.spaces(raw, function(result) {
      assert.deepEqual(result, [
        { displayUUID: 'Main', spaceUUID: '' },
        {
          displayUUID: 'Main',
          spaceUUID: 'C2D62982-48DC-435F-9B6D-0EA0D326ECC6'
        },
        {
          displayUUID: '8B1B6AA4-6370-6B17-94DB-E5866993EEF6',
          spaceUUID: '6E11A511-AA71-4298-956B-399DDACC9276'
        },
        {
          displayUUID: 'A4E9F91C-43D3-F813-0657-825CEC917723',
          spaceUUID: 'F1259E54-EACF-4EB6-AA3A-CDCBF8FAC5AB'
        },
        {
          displayUUID: 'A4E9F91C-43D3-F813-0657-825CEC917723',
          spaceUUID: 'A71C4963-DCE9-4EF6-801D-53CC5D2AD7EF'
        }
      ]);
      callback();
    });
  });

  it('should support the 10.13.3 version of the macos', function (callback) {
    var raw = fixture('10_13_3');
    spaces.spaces(raw, function (result) {
      assert.deepEqual(result, [
        {
          displayUUID: 'Main',
          spaceUUID: '947650F4-ADA5-4543-AD98-50FAAE676F03'
        },
        {
          displayUUID: 'Main',
          spaceUUID: 'D6C50A54-A1DE-4380-9799-2DF0EAF92AA2'
        },
        {
          displayUUID: 'CB5A19E1-6C20-C98E-BB2D-70FC3BB550B4',
          spaceUUID: 'EFA0227A-C583-45D8-A84F-279CCCC05D47'
        },
        {
          displayUUID: 'CB5A19E1-6C20-C98E-BB2D-70FC3BB550B4',
          spaceUUID: 'B566A902-924B-47DA-AA8C-EA16922DE36E'
        }
      ]);
      callback();
    });
  });
});