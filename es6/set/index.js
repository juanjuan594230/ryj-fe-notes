'use strict';

const key1 = {};
const key2 = {};
const set = new Set();
set.add(5);
set.add('5');
set.add(key1);
set.add(key2);
// console.log(set.size); // 4

// init with array
const set2 = new Set([1,2,4,5,4,5]);
// console.log(set2.size); // 4

// const weakSet = new WeakSet();
// let key = {};
// weakSet.add(key);
// console.log(weakSet.size); // undefined
// key = null; // {}的引用不存在了，weakSet中的{}也会移除
// console.log(weakSet.has(key)); // false

const set3 = new Set();
let key = {};
set3.add(key);
key = null; // {}占用的内存无法被GC释放，有可能会造成内存泄漏
console.log(set3.size); // 1 {}仍被set引用，无法释放内存