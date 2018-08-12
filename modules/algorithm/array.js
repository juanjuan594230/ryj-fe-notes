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

// 数组扁平化
const arr1 = [1, [2,3], 4, [6,7,[8,9]]];
function delayering(arr, delayer) {
  delayer = delayer ? delayer : [];
  if (!arr) {
    return;
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    if (Object.prototype.toString.call(arr[i]) === '[object Array]') {
      delayering(arr[i], delayer);
    } else {
      delayer.push(arr[i]);
    }
  }
  return delayer;
}
/* const delayerArr = delayering(arr1);
console.log(delayerArr); */

/* 
  旋转数组的最小数字 
*/
/* const arr2 = [3,4,5,1,2];
function min(arr) {
  if (!arr || arr.length === 0) {
    return;
  }
  if (arr.length === 1) {
    return arr[0];
  }
  let start = 0,
      end = arr.length - 1,
      mid = start;
  while (end - start > 1) {
    const mid = Math.floor((start + end) / 2);
    if (arr[mid] >= arr[start]) {
      start = mid;
    } else {
      end = mid;
    }
  }
  return arr[end];
}
console.log(min(arr2)); */

/* 
  调整数组，使得奇数位于偶数签名
  移动指针之后，start  < end 的判断非常重要
  扩展：将奇数位于偶数后面 -》 将负数位于正数前面，考虑传递一个比较的函数进去，解耦
*/
const arr3 = [1,2,3,4,5,6,7,8];
function reorderOddEven(arr) {
  if (!arr || arr.length <= 1) {
    return;
  }
  let start = 0,
      end = arr.length - 1;
  while (start < end) {
    if (start < end && arr[start] % 2 !== 0) {
      start++;
    }
    if (start < end && arr[end] % 2 === 0) {
      end--;
    }
    if (start < end) {
      const _temp = arr[start];
      arr[start] = arr[end];
      arr[end] = _temp;
    }
  }
}
// reorderOddEven(arr3);
// console.log(arr3);
