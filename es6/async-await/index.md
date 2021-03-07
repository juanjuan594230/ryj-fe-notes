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

