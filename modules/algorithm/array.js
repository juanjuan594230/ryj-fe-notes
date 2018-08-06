const arr = [1,5,8,3,5,8];
// forEach  对数组的每一项执行相应操作，无返回值
function _forEach(arr, cb) {
  if (!arr || arr.length === 0) {
    return;
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    cb.call(arr, arr[i], i);
  }
}

// map 让数组通过某种计算，产生一个新数组
