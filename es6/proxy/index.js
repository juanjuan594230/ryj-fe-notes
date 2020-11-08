// 'use strict';

// set trap
// const target = {};

// const handler = {
//     // 修改赋值操作的默认行为
//     set(targetObj, key, value, receiver) {
//         // validate
//         if (typeof value !== 'number') {
//             throw new Error('属性值必须为数值');
//         }
//         Reflect.set(targetObj, key, value, receiver);
//     }
// }

// const proxy = new Proxy(target, handler);

// proxy.first = 1;
// console.log(proxy.first); // 1
// proxy.second = '1'; // throw error

// get trap
// const target = {
//     name: 'renyujuan',
//     sex: 'women'
// };
// const proxy = new Proxy(target, {
//     get(targetObj, key, receiver) {
//         // if (!targetObj.hasOwnProperty(key)) {
//         //     throw new Error('该对象上不存在此属性');
//         // }
//         if (!(key in receiver)) {
//             throw new Error('该对象上不存在此属性');
//         }
//         return Reflect.get(targetObj, key, receiver);
//     }
// });
// console.log(proxy.name);
// console.log(proxy.age);


// has trap

// const target = {
//     name: 'renyujuan'
// };
// console.log('name' in target);
// console.log('toString' in target);

// const target = {
//     name: 'target',
//     value: 42,
// };
// const proxy = new Proxy(target, {
//     has(targetObj, key) {
//         if (key === 'value') {
//             return false;
//         }
//         return Reflect.has(targetObj, key);
//     }
// });
// console.log('value' in proxy);
// console.log('name' in proxy);



// deleteProperty trap

// const target = {
//     name: 'target',
//     value: 42
// };
// Object.defineProperty(target, 'value', {
//     configurable: false
// });
// const result1 = delete target.name;
// console.log('name' in target); // false
// console.log(result1); // true
// const result2 = delete target.value; // error
// console.log('value' in target);
// console.log(result2);


// const target = {
//     name: 'target',
//     value: 42
// };
// const proxy = new Proxy(target, {
//    deleteProperty(targetObj, key) {
//        if (key === 'value') {
//             return false;
//        }
//        return Reflect.deleteProperty(targetObj, key);
//    }
// });
// const resultDeleteValue = delete proxy.value;
// console.log(resultDeleteValue); // false
// console.log('value' in proxy); // true
// const resultDeleteName = delete proxy.name;
// console.log(resultDeleteName); // true
// console.log('name' in proxy); // false


// prototype proxy trap

// const target = {};
// const proxy = new Proxy(target, {
//     getPrototypeOf(trapTarget) {
//         return null; // 隐藏原型对象
//     },
//     setPrototypeOf(trapTarget, proto) {
//         return false; // 限制不能修改原型对象
//     }
// })
// const targetPtoto = Object.getPrototypeOf(target);
// const proxyProto = Object.getPrototypeOf(proxy);
// console.log(targetPtoto);
// console.log(proxyProto);

// const result = Object.getPrototypeOf(1);
// console.log(result);
// Reflect.getPrototypeOf(1);


// 对象可扩展的陷阱

// const target = {};
// const proxy = new Proxy(target, {
//     preventExtensions(trapTarget) {
//         return Reflect.preventExtensions(trapTarget);
//     },
//     isExtensible(trapTarget) {
//         console.log(trapTarget === target);
//         return Reflect.isExtensible(trapTarget);
//     }
// });
// console.log(Object.isExtensible(proxy));
// console.log(Object.isExtensible(target));

// Object.preventExtensions(proxy);
// console.log(Object.isExtensible(proxy));
// console.log(Object.isExtensible(target));

console.log(Object.isExtensible(1));
console.log(Reflect.isExtensible(1));

