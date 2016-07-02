# macOS Spaces

Gets information about workspaces in macOS

## Usage

```javascript
var macOSSpaces = require("macos-spaces");


// [
//   {
//     "displayUUID": "Main",
//     "spaceUUID": ""
//   },
//   {
//     "displayUUID": "Main",
//     "spaceUUID": "60776AC5-A552-4A66-87FD-B4DF2C195DA2"
//   }
// ]
macOSSpaces.spaces(function(spaces) {
  console.log(spaces);
});


// [
//   {
//     "displayUUID": "Main",
//     "spaceUUIDs": [
//       "",
//       "60776AC5-A552-4A66-87FD-B4DF2C195DA2"
//     ]
//   }
// ]
macOSSpaces.allSpaces(function(spaces) {
  console.log(spaces);
});
```
