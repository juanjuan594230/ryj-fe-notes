# Symbol

ES6新增的一种基本数据类型
string\number\boolean\null\undefined\symbol

## 创建symbol类型

symbol类型创建没有字面量语法，必须使用`Symbol` fn进行创建。

*Symbol不能作为构造函数使用*
*Symbol值作为对象属性名时，需要放在中括号内*
*读取对象的symbol属性值时，也需要将symbol值放在中括号内*

```javascript
const firstName = Symbol();
console.log('firstName', typeof firstName); // symbol

// Symbol(description) description为可选参数，但不能用来访问变量
const name = Symbol('name');
const person = {};
person[name] = 'renyujuan';

console.log('name' in person); // false
console.log(person[name]); // renyujuan
console.log(name); // Symbol(name)
```

## 使用symbol类型

作为对象属性的唯一标识，防止对象属性冲突发生。

一个有趣的例子：你看上了公司前来的前台妹纸，想了解关于她的更多信息，于是就询问Hr同事，扫地阿姨，于是得到类似这样信息

```javascript
let info = {};
const info1 = {
    name: 'tingting',
    age: '23',
    desc: '平时喜欢做做瑜伽，人家有男朋友，你别指望了'
};
const info2 = {
    desc: '这小姑娘挺好的，挺热情的，嘿嘿嘿……'
}
// 最后对信息进行汇总，由于存在同样的desc属性，导致会发生冲突与覆盖，最后丢失了有男朋友的重要信息。
Object.assign(info, info1, info2);

// 假如使用symbol
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
console.log('info', info); // { ..., [Symbol(desc)]: '有男朋友', [Symbol(desc)]: '嘿嘿嘿'}
```

## 共享symbol

es6提供了一种全局的symbol注册方法。

创建一个共享的symbol值，调用`Symbol.for()`。

## 遍历

`for-in` `for-of` `Object.keys()` `Object.getOwnPropertyNames()`遍历对象属性时，不会遍历到symbol属性名。