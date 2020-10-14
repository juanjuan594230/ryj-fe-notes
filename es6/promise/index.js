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

process.on('unhandledrejection', (reason, promise) => {
    console.log('reason', reason.message);
    console.log('promise', promise.toString());
});
process.on('rejectionhandled', function (promise) {
    console.log('promise', promise.toString());
});
const p1 = Promise.reject(new Error("Explosion!"));
// 未触发事件
// p1.catch((error) => {
//     console.log(error.message);
// });

// 可以触发事件
setTimeout(() => {
    p1.catch((error) => {
        console.log(error.message);
    });
}, 0);