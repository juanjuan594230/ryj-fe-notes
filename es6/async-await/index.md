# ASYNC-AWAIT

## description

用来简化基于promise的API。

- async function 中可以包含0个或者多个await语句。
- await 关键字可以使得程序暂停执行，直至promise的状态从pending切换到fulfilled/rejected
- fulfilled时，resolve(value) value会被await返回
- 一般使用try-catch块包裹async code.

Async function 始终返回一个promise。

```javascript
async function foo() {
    return 1;
}

// 等同于
async function foo() {
    return Promise.resolve(1);
}
```

## return value

A promise which will be resolved with the value return by the async function;
or rejected with an exception throw from, or uncaught within, the async function.


# Symbol

## REASON

### Add new core-features with backward compatibility

添加向后兼容的核心功能

```javascript
const myObject = {
  firstName: 'ren',
  lastName: 'yujuan'
}

console.log(Object.keys(myObject)); // [firstName, lastName]
myObject.age = 22;
console.log(Object.keys(myObject)); // [firstName, lastName, age]
```

???how show just[firstName, lastName] — and not [firstName, lastName, newProperty] . How to do that?

**the answer is Symbol;**

> If you add newProperty as a symbol, then Object.keys(myObject) would ignore this (as it doesn’t know about it), and still return [firstName, lastName] !

??? 这样有什么场景吗???

### 避免名称冲突

### Enable hooks to core methods via “Well-known” Symbols???
