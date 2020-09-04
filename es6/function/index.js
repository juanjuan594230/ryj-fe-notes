'use strict';
function mixArgs(first, second) {
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    first = "c";
    second = "d";
    console.log('arguments', arguments); // { '0': 'c', '1': 'd' } noStrict // { '0': 'a', '1': 'b' } strict
    console.log(first === arguments[0]); // strict false
    console.log(second === arguments[1]); // strict false
}

// mixArgs("a");

function add(first, second = first) {
    return first + second;
}
// console.log(add(1,1)); // 2
// console.log(add(2)); // 4

const book = {
    name: 'understanding es6',
    author: 'a people'
}
function pick(obj, ...keys) {
    console.log('arguments', arguments);
    console.log('keys', keys);
    const result = Object.create(null);
    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = obj[keys[i]];
    }
}

// pick(book, 'name'); // arguments length = 2 包含了所有的参数； keys length === 1 只包含了多余的参数


const obj = {
    name: 'AAA',
    sayName() {
        console.log(this.name);
    }
};
const obj2 = {
    name: 'BBB'
}
const obj3 = {
    name: 'CCC'
}
const sayName2 = obj.sayName.bind(obj2);
const sayName3 = obj.sayName.bind(obj3);
// console.log(sayName2.name); // bound sayName
// console.log(sayName3.name); // bound sayName
// console.log(sayName2()); // BBB


const doSomething = function doSomethingElse() {
    console.log(111);
}
// console.log(doSomething.name);

const person = {
    get firstName() {
        return 'ren';
    },
    sayName() {
        console.log(this.name);
    }
}
// console.log(person.sayName.name);
// console.log(person.firstName.name); // undefined
var descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
// console.log('descriptor', descriptor);
// console.log(descriptor.get.name); // "get firstName"


// block-level fn
if (true) {
    // console.log(typeof doSomething);
    let doSomething = function () {
        // ...
    }
    doSomething();
}
// block end doSomething not exist
console.log(typeof doSomething);

