const bs = require('./binary-search');
// const LinkList = require('./link-list');
const BinaryTree = require('./tree');
// require('./sort');
// require('./stack');
// require('./queue');
// require('./array');
require('./string');
// require('./recursion');
// require('./other');

// bianrySearch test demo
/* const arr1 = [2,9,17,23,36,76,99];
const arr2 = [];
const arr3 = null;
const arr4 = [2,9,9,9,23,56,98,121,345,456];

const index1 = bs.binarySearch(arr1, 9);
const index2 = bs.binarySearch(arr2, 9);
const index3 = bs.binarySearch(arr3, 9);
const index4 = bs.binarySearch(arr4, 9);

console.log(index1);  // 1
console.log(index2);  // -1
console.log(index3);  // -1
console.log(index4);  // 1 */

/* const arr1 = [2,9,17,23,36,76,99];
const arr2 = [];
const arr3 = null;
const arr4 = [2,9,9,9,23,56,98,121,345,456];

const index1 = bs.binarySearch_plus(arr1, 9);
const index2 = bs.binarySearch_plus(arr2, 9);
const index3 = bs.binarySearch_plus(arr3, 9);
const index4 = bs.binarySearch_plus(arr4, 9);

console.log(index1);  // 1
console.log(index2);  // -1
console.log(index3);  // -1
console.log(index4);  // 1 */

// 链表
/* const c = new LinkList('c');
const b = new LinkList('b', c);
const a = new LinkList('a', b); */

// 链表反转
/* const headReverse = a.reverse();
console.log(headReverse); */

// 向链表的尾部插入一个节点
/* const newNode = new LinkList('d');
a.push(newNode); */


/* 二叉树相关算法 */
/* const l = new BinaryTree(12, null, null);
const k = new BinaryTree(11, null, null);
const j = new BinaryTree(10, null, null);
const i = new BinaryTree(9, l);
const h = new BinaryTree(8, null, null);
const g = new BinaryTree(7, null, null);
const f = new BinaryTree(6, null, k);
const e = new BinaryTree(5, null, j);
const d = new BinaryTree(4, h, i);
const c = new BinaryTree(3, f, g);
const b = new BinaryTree(2, d, e);
const a = new BinaryTree(1, b, c); */

// a.preOrder();      // 1, 2, 4, 8, 9, 12, 5, 10, 3, 6, 11, 7
// a.centerOrder();   // 8, 4, 12, 9, 2, 5, 10, 1, 6, 11, 3, 7
// a.nextOrder();     // 8, 12, 9, 4, 10, 5, 2, 11, 6, 7, 3, 1

// depth
// const deeps = a.deep();
// console.log(deeps);   // 5

// copy
// const cloneTree = a.clone();
// console.log(cloneTree.right);

// reverse
// const root = a.reverse();
// console.log(root.right);

// const pre = [1, 2, 4, 8, 9, 12, 5, 10, 3, 6, 11, 7];
// const vin = [8, 4, 12, 9, 2, 5, 10, 1, 6, 11, 3, 7];
// const root = BinaryTree.buildTree(pre, vin);
// console.log(root);

// a.layerOrder();
