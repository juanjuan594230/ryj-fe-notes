'use strict';

// function *createIterator() {
//     console.log(111);
//     yield 1;
//     yield 2;
//     yield 3;
// }
// let iterator = createIterator();
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

// const obj = {
//     name: 'renyujuan',
//     *[Symbol.iterator]() {
//         const keys = Object.keys(obj);
//         for(let i = 0; i < keys.length; i++) {
//             yield [keys[i], obj[keys[i]]];
//         }
//     }
// }
// const iterator2 = obj[Symbol.iterator]();
// console.log(iterator2.next()); // { value: [ 'name', 'renyujuan' ], done: false }
// console.log(iterator2.next()); // { value: undefined, done: true }

// for(let [key, val] of obj) {
//     console.log(key + ':' + val); // name:renyujuan
// }

// function *createIterator() {
//     let first = yield 1;
//     let second = yield first + 2;
//     yield second + 3;
// }
// const iterator = createIterator();
// console.log(iterator.next(2)); // { value: 1, done: false} 通过yield语句向iterator传值
// console.log(iterator.next(4)); // { value: 6, done: false }
// console.log(iterator.next(5)); // { value: 8, done: false }
// console.log(iterator.next(4)); // { value: undefined, done: true }


// 委派生成器 delegate generators

// function *createNumsIterator() {
//     yield 1;
//     yield 2;
// }

// function *createColorIterator() {
//     yield 'red';
//     yield 'black';
// }

// function *createCombineIterator() {
//     yield *createNumsIterator();
//     yield *createColorIterator();
//     yield true;
// }

// const iterator = createCombineIterator();

// console.log(iterator.next()); // { value: 1, done: false }
// console.log(iterator.next()); // { value: 2, done: false }
// console.log(iterator.next()); // { value: 'red', done: false }
// console.log(iterator.next()); // { value: 'black', done: false }
// console.log(iterator.next()); // { value: true, done: false }
// console.log(iterator.next()); // { value: undefined, done: true }


// 使用委派生成器iterator的返回值

// function *createNumsIterator() {
//     yield 1;
//     yield 2;
//     return 3;
// }

// function *createIterator(twice) {
//     for(let i = 0; i < twice; i++) {
//         yield 'repeat'
//     }
// }

// function *createCombineIterator() {
//     const result = yield *createNumsIterator();
//     yield *createIterator(result);
// }

// const iterator = createCombineIterator();
// console.log(iterator.next()); // { value: 1, done: false }
// console.log(iterator.next()); // { value: 2, done: false }
// console.log(iterator.next()); // { value: 'repeat', done: false }
// console.log(iterator.next()); // { value: 'repeat', done: false }
// console.log(iterator.next()); // { value: 'repeat', done: false }
// console.log(iterator.next()); // { value: undefined, done: true }

// 简单的任务执行器

// function run(generator) {
//     const task = generator(); // return iterator
//     let result = task.next();
//     function step() {
//         if (!result.done) {
//             result = task.next();
//             step();
//         }
//     }
//     step();
// }

// console.log(run(function *createIterator() {
//     console.log(1);
//     yield;
//     console.log(2);
//     yield;
//     console.log(3);
// })); // 1 2 3 unfefined

// 异步 想迭代器传入值和传出值

// function run1(generator) {
//     const task = generator(); // return iterator
//     let result = task.next();
//     function step() {
//         if (!result.done) {
//             result = task.next(result.value); // input
//             step();
//         }
//     }
//     step();
// }

// run(function *() {
//     let value = yield 1;
//     console.log('value', value); // 1 output
//     value = yield value + 3;
//     console.log('value', value); // 4 output
// });

// 异步任务执行器

// 任务执行器需要知道回调函数，并且知道怎么使用。
// yield表达式向任务执行器传递了回调函数的value，这意味着方法调用需要返回值，该值表明调用是一个异步操作，任务执行器需要等待。

// 可能以这样一种返回值的形式表明是一个异步操作
// function fetchData() {
//     return function(callback) {
//         callback(null, 'hi');
//     }
// }

let fs = require("fs");

function readFile(filename) {
    return function(callback) {
        fs.readFile(filename, callback);
    };
}

function asyncRun(generator) {
    const task = generator();
    let result = task.next();
    console.log('result', result.value);
    function step() {
        if (result.done) {
            return;
        }
        if (typeof result.value === 'function') {
            result.value((error, data) => {
                if (error) {
                    result = task.throw(error);
                    return;
                }
                result = task.next(data);
                step();
            })
        } else {
            result = task.next(result.value);
            step();
        }
    }
    step();
}

asyncRun(function *() {
    let content = yield readFile('index.js');
    console.log('content', content);
});

