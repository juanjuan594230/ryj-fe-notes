'use strict';

const target = {
    name: 'renyujuan',
    phone: '12345678900'
}

const handler = {};

const proxy1 = new Proxy(target, handler);

console.log(proxy1.name); // renyujuan handler is empty behavior like original target
console.log(target.name); // renyujuan

// const proxy2 = new Proxy(target, {
//     get(target, prop, receiver) {
//         return `hello`;
//     }
// });

// console.log(proxy2.name); // hello
// console.log(proxy2.phone); // hello


// handler包含了get方法，在尝试获取target的属性，被触发。
const proxy2 = new Proxy(target, {
    get(target, prop, receiver) {
        return `hello ${target[prop]}`;
    }
});

console.log(proxy2.name); // hello renyujuan
console.log(proxy2.phone); // hello 12345678900