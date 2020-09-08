'use strict';

const firstName = Symbol();
// console.log('firstName', typeof firstName); // symbol

const name = Symbol('name');
const person = {};
person[name] = 'renyujuan';

// console.log('name' in person); // false
// console.log(person[name]); // renyujuan
// console.log(name); // Symbol(name)

const info = {};
const info1 = {
    name: 'tingting',
    age: '23',
    [Symbol('desc')]: '平时喜欢做做瑜伽，人家有男朋友，你别指望了'
};
const info2 = {
    [Symbol('desc')]: '这小姑娘挺好的，挺热情的，嘿嘿嘿……'
}
Object.assign(info, info1, info2);
console.log('info', info);