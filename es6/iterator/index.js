'use strict';

function *createIterator() {
    console.log(111);
    yield 1;
    yield 2;
    yield 3;
}
let iterator = createIterator();
// console.log(iterator.next()); // { value: 1, done: false }
// console.log(iterator.next()); // { value: 2, done: false }
// console.log(iterator.next()); // { value: 3, done: false }
// console.log(iterator.next()); // { value: undefined, done: false }

// const nums = [1,2,4];
// const iterator1 = nums[Symbol.iterator]();
// console.log(iterator1.next()); // { value: 1, done: false }
// console.log(iterator1.next()); // { value: 2, done: false }
// console.log(iterator1.next()); // { value: 4, done: false }
// console.log(iterator1.next()); // { value: undefined, done: true }

// function isIterable(obj) {
//     return typeof obj[Symbol.iterator] === 'function';
// }
// console.log(isIterable([])); // true
// console.log(isIterable({})); // false
// console.log(isIterable(new Set())); // true
// console.log(isIterable(new Map())); // true
// console.log(isIterable(new WeakSet())); // false
// console.log(isIterable(new WeakMap())); // false

const obj = {
    name: 'renyujuan',
    *[Symbol.iterator]() {
        const keys = Object.keys(obj);
        for(let i = 0; i < keys.length; i++) {
            yield [keys[i], obj[keys[i]]];
        }
    }
}
const iterator2 = obj[Symbol.iterator]();
console.log(iterator2.next()); // { value: [ 'name', 'renyujuan' ], done: false }
console.log(iterator2.next()); // { value: undefined, done: true }

for(let [key, val] of obj) {
    console.log(key + ':' + val); // name:renyujuan
}