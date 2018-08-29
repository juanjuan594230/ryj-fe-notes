function createFunctions() {
  var result = new Array();
  for (let i = 0; i < 10; i++) {
    result[i] = function() {
      return i;
    }
  }
  return result;
}

const funcArr = createFunctions();
let i = 0;
while (i < 10) {
  console.log(funcArr[i]());
  i++;
}