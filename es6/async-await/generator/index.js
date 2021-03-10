// EXAMPLE1
// function *generator(a, b) {
//     let k = yield a + b;
//     let m = yield a + b + k;
//     yield a + b + k + m;
// }

// const generatorObj = generator(1,2);
// console.log(generatorObj.next()); // 3
// console.log(generatorObj.next(3)); // 6
// console.log(generatorObj.next(6)); // 12
// console.log(generatorObj.next()); // undefined done: true

// EXAMPLE2 CO
const co = require('co');

function *generator() {
    const a = yield new Promise(resolve => setTimeout(() => { resolve(1)}, 2000));
    const b = yield new Promise(resolve => setTimeout(() => { resolve(2)}, 1000));
    console.log('a', a);
    console.log('b', b);
}

co(generator)
    .catch(err => console.log(err.message));


