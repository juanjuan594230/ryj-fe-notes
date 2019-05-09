'use strict';

const target = {
    name: 'renyujuan',
    age: 28
}

Object.defineProperty(target, 'age', {
    // TypeError: Cannot assign to read only property 'age' of object '#<Object>'
    writable: false,
    // configurable: false,
    // value: undefined
});

const handler = {
    get (target, key) {
        return target[key];
    },
    set (target, key, value) {
        target[key] = value;
        return true;
    }
}
const proxy = new Proxy(target, handler);

console.log(proxy.name);
proxy.age = 18;
console.log(proxy.age);