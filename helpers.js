var cleanArray = function(arr, deleteValue) {
  var newArray = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== deleteValue) {
      newArray.push(arr[i]);
    }
  }

  return newArray;
};

module.exports = {
  cleanArray: cleanArray
};
