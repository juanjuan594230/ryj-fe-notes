# 异步编程

## Event Loop

> The event loop is a perpetual(永久的) process that checks if the call stack(主线程执行栈) is empty.
> If it is, then the first item in the message queue is moved to the call stack.

[call stack] [event loop] [message queue]

[job queue] call stack empty/before next loop start

## callback & promise

```javascript
// callback
doSomething1(url, () => {
    doSomething2(() => {
        doSomething3();
    });
})

const doSomething = function() {
    return new Promise(() => { ... });
}
doSomething()
    .then(() => {
        return new Promise(executor)
    })
    .then(() => {})
    .catch(() => {})
```

## async & await
