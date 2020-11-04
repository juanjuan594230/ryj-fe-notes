'use strict';

// const target = {
//     name: 'renyujuan',
//     phone: '12345678900'
// }

// const handler = {};

// const proxy1 = new Proxy(target, handler);

// console.log(proxy1.name); // renyujuan handler is empty behavior like original target
// console.log(target.name); // renyujuan

// const proxy2 = new Proxy(target, {
//     get(target, prop, receiver) {
//         return `hello`;
//     }
// });

// console.log(proxy2.name); // hello
// console.log(proxy2.phone); // hello


// handler包含了get方法，在尝试获取target的属性，被触发。
// const proxy2 = new Proxy(target, {
//     get(target, prop, receiver) {
//         return `hello ${target[prop]}`;
//     }
// });

// console.log(proxy2.name); // hello renyujuan
// console.log(proxy2.phone); // hello 12345678900

// use

// let target3 = {
//     id: 1,
//     name: 'AAA'
// };

// target3 = new Proxy(target3, {
//     get(target, prop, rec) {
//         console.log('target', target);
//         console.log('prop', prop);
//         // console.log('rec', rec);
//         return 'hahaha';
//     }
// });

// console.log(target3.id); // target { id: 1, name: 'AAA' } prop id hahaha


const hide = (target, prefix = '_') => new Proxy(target, {
    has: (obj, prop) => (!prop.startsWith(prefix) && prop in obj),
    ownKeys: (obj) => Reflect.ownKeys(obj)
      .filter(prop => (typeof prop !== "string" || !prop.startsWith(prefix))),
    get: (obj, prop, rec) => {
        // console.log('rec', rec === hide);
        return (prop in rec) ? obj[prop] : undefined
    }
})


let userData = hide({
    firstName: 'Tom',
    mediumHandle: '@tbarrasso',
    _favoriteRapper: 'Drake'
  })
console.log(userData._favoriteRapper)       // undefined
console.log(('_favoriteRapper' in userData)) // false
console.log(Object.keys(userData)) // [ 'firstName', 'mediumHandle' ]