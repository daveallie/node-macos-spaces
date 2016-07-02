# macOS Spaces

Gets information about workspaces in macOS

## Usage

```javascript
var macOSSpaces = require("macos-spaces");


// spaces (defaults to only showing active spaces / monitors)
// [
//   {
//     "monitorId": "Main",
//     "spaces": [
//       "",
//       "D3D53AA0-93B8-4F33-8FF1-5A6A603C5EE6"
//     ]
//   }
// ]
macOSSpaces.spaces(function(spaces) {
  console.log(spaces);
});


// allSpaces (includes non active spaces / monitors)
// [
//   {
//     "monitorId": "Main",
//     "spaces": [
//       "",
//       "D3D53AA0-93B8-4F33-8FF1-5A6A603C5EE6"
//     ]
//   },
//   {
//     "monitorId": "513958C1-FE8C-A864-07A6-7D3E07A10528",
//     "spaces": []
//   }
// ]
macOSSpaces.allSpaces(function(spaces) {
  console.log(spaces);
});
```
