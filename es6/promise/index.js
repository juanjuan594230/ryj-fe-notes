'use strict';
const process = require('process');

// const p1 = new Promise((resolve, reject) => {
//     throw new Error('error');
// });
// p1.catch((error) => {
//     console.log(error.message); // error
// })

// // 等价于
// const p2 = new Promise((resolve, reject) => {
//     try {
//         throw new Error('error');
//     } catch(error) {
//         reject(error);
//     }
// });
// p2.catch((error) => {
//     console.log(error.message);
// });


// process.on('unhandledrejection', (reason, promise) => {
//     console.log('reason', reason);
//     console.log('promise', promise);
// });

// const p1 = Promise.reject(new Error("Explosion!"));

// process.on('unhandledrejection', (reason, promise) => {
//     console.log('reason', reason.message);
//     console.log('promise', promise.toString());
// });
// process.on('rejectionhandled', function (promise) {
//     console.log('promise', promise.toString());
// });
// const p1 = Promise.reject(new Error("Explosion!"));
// // 未触发事件
// // p1.catch((error) => {
// //     console.log(error.message);
// // });

// // 可以触发事件
// setTimeout(() => {
//     p1.catch((error) => {
//         console.log(error.message);
//     });
// }, 0);

// const p1 = new Promise((resolve, reject) => {
//     resolve(42);
// });
// p1.then((data) => {
//     return data + 1;
// }).then((data) => {
//     console.log('data', data);
// });

// const p2 = new Promise((resolve, reject) => {
//     reject(42);
// });
// p2.catch((data) => {
//     return data + 1;
// }).then((data) => {
//     console.log('data', data); // 43
// });

let p1 = new Promise(function(resolve, reject) {
    resolve(42);
});

let p2 = new Promise(function(resolve, reject) {
    resolve(43);
});

let p3 = new Promise(function(resolve, reject) {
    resolve(44);
});

let p4 = Promise.all([p1, p2, p3]);
p4.then((value) => {
    console.log('value', value); // [42, 43, 44]
});