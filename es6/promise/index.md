# Promise And Async Programing

作为一种web语言，JS需要有回应异步用户交互的能力，如点击事件、键盘事件等。

callback

promise指定一些代码延后执行，并明确的对成功和失败做了区分，而且可以链式调用。

## 异步编程背景

JS引擎建立在单线程事件循环概念的基础上。

### 事件模式

事件模式是JS最基本的异步编程模式。适用于处理用户交互的一些场景。

事件类型及处理函数，当事件触发，对应的处理函数则会加到job queue的末尾，等待某次时间循环的时候执行处理函数的代码。

### 回调函数模式

这种模式可以向回调函数传递参数。

回调地域，代码理解和调试困难
依赖两个异步操作全部完成时，如何操作？

## promise基本概念
promise是异步操作结果的占位符。

### promise 生命周期

pending：异步操作尚未完成，promise尚未解决。

异步操作完成，promise settled。则promise可能会进入两种可能状态的一种fulfilled or rejected.

fulfilled: 异步操作完成，并且成功
rejected: 异步操作完成，发生错误或者其他失败原因。

属性`[[PromiseState]]`用来反映promise当前的状态，但这个属性未暴露出来，不能以编程的形式去更改。但在promise状态改变之后，可以通过then方法执行特定的行为。

==建议始终添加rejection handler==

#### then

promise状态从pending改变成fulfilled或者rejected时，可以通过调用then方法来执行一些特定的行为

`then`方法的参数有两个，一个成功的回调，一个失败的回调。两个参数都是可选的。

```javascript
const promise = new Promise((resolve, reject) => {});
// two optional arguments
promise.then((data) => {
    // fulfilled callback
}, (error) => {
    // rejected callback
})
```

#### catch

当then方法中，只传递了rejection handler时，它与catch的表现是一致的

```javascript
const promise = new Promise((resolve, reject) => {});
// 以下两种方式在功能上是等价的
promise.then(null, (error) => {
    // do something
});
promise.catch((error) => {
    // do something
})
```

Each call to then() or catch() creates a new job to be executed when the promise is resolved. But these jobs end up in a separate job queue that is reserved strictly for promises. The precise details of this second job queue aren’t important for understanding how to use promises so long as you understand how job queues work in general.

对then（）或catch（）的每次调用都会创建一个新作业，以便在promise状态改变后执行。但这些作业最终会在一个单独的作业队列中结束，而这个队列是严格为promise而保留的。第二个作业队列的确切细节对于理解如何使用承诺并不重要，只要您了解作业队列的一般工作原理。

### 创建一个unsettled promise

```javascript
const promise = new Promise(executor:fn)

executor = function(resolve:fn, reject:fn) {}
```

`executor`中包含了promise初始化的代码。resolve fn call意味着promise ready to fulfilled；reject fn call意味着promise ready to rejected。

一个例子：
```javascript
const fs = require('fs');
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (error, content) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(content);
        });
    })
}
// executor fn在readFile调用时，会立即执行。当resolve或reject方法调用时，将会触发一个异步操作，传入then或者catch中的fn被添加到job queue。
const promise = readFile('index.js');
promise.then((content) => {
    console.log('read success', content);
}, (error) => {
    console.log('read fail');
})
```

### create settled promise

#### Promise.resolve(val)

Promise.resolve(val)用来创建一个settled promise<fulfilled>

#### Promise.reject(val)

Promise.reject(val)用来创建一个settled promise<rejected>

```javascript
const promise1 = Promise.resolve('fulfilled');
promise1.then((data) => {
    console.log(data);
})
const promise2 = Promise.reject('rejected');
promise.catch((msg) => {
    console.log(msg);
})
```

### 非promise的thenable对象

> Any object that implements the then() method in this way is called a thenable. All promises are thenables, but not all thenables are promises.

```javascript
// A non-promise thenable object
const obj = {
    then(resolve, reject) {
        // ...
    }
}
```

Promise.resolve() and promise.reject()提供了将non-promise转换成正式promise的能力。

Promise.resolve() and promise.reject()接受non-promise thenables as arguments. 当传入一个非peomise的thenable对象时，Promise.resolve() and promise.reject()将会创建一个新的promise对象，然后在then函数之后调用它

```javascript
const obj = {
    then(resolve, reject) {
        resolve('non-promise thenable obj')
    }
}
const p1 = Promise.resolve(obj); // promise.resolve()调用了obj.then() 创建了一个fulfilled promise
p1.then((data) => {
    console.log(data);
})

const obj2 = {
    then(resolve, reject) {
        resolve('non-promise thenable obj rejected')
    }
}
const p2 = Promise.resolve(obj2); // 创建了一个rejected promise
```

### executor errors

如果在executor中抛出错误的话。promise的rejection handler将会被调用。但当rejection handler没有提供时，错误就会被隐藏。

```javascript
const p1 = new Promise((resolve, reject) => {
    throw new Error('error');
});
p1.catch((error) => {
    console.log(error.message); // error
})

// 等价于
const p2 = new Promise((resolve, reject) => {
    try {
        throw new Error('error');
    } catch(error) {
        reject(error);
    }
});
p2.catch((error) => {
    console.log(error.message);
});
```

### 全局的rejection handler

promise最有争议的点之一就是promise rejected，但是没有rejection handler。

#### nodeJS rejection handler

process对象上有两个事件与promise相关

`unhandledrejection` Emitted when a promise is rejected and no rejection handler is called within one turn of the event loop
`rejectionhandled` Emitted when a promise is rejected and a rejection handler is called after one turn of the event loop

==rejection handler如果在同一轮的事件循环中调用的话，则handledRejection事件捕获不到==

```javascript
process.on('unhandledRejection', (reason, promise) => {
    console.log('reason', reason);
    console.log('promise', promise);
});

const p1 = Promise.reject(new Error("Explosion!"));

// rejectionHandled
// 会先触发unhandledRejection事件，等待下一轮时间循环调用catch之后，触发rejectionHandled事件
process.on('unhandledRejection', (reason, promise) => {
    console.log('reason', reason);
    console.log('promise', promise);
});
process.on('rejectionHandled', function (promise) {
    console.log('promise', promise);
});
const p1 = Promise.reject(new Error("Explosion!"));
// 未触发事件
// p1.catch((error) => {
//     console.log(error.message);
// });

// 可以触发事件
setTimeout(() => {
    p1.catch((error) => {
        console.log(error.message);
    });
}, 0);
```

正确的跟踪unhandled rejection

```javascript
const unhandledMap = new Map();
process.on('unhandledRejection', (reason, promise) => {
    unhandledMap.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
    unhandledMap.delete(promise);
});
const p1 = Promise.reject(new Error("Explosion1!"));
const p2 = Promise.reject(new Error("Explosion2!"));
setTimeout(() => {
    p2.catch((error) => {
        console.log(error.message);
    });
}, 0);
```

#### browser rejection handler

window对象有两个事件与promise相关。事件名称与nodejs一样。

`unhandledrejection` Emitted when a promise is rejected and no rejection handler is called within one turn of the event loop
`rejectionhandled` Emitted when a promise is rejected and a rejection handler is called after one turn of the event loop.

```javascript
window.addEventListener('unhandledrejection', (event) => {
    // event.type
    // event.reason
    // event.promise
});
window.addEventListener('rejectionhandled', (event) => {
    // event.type
    // event.reason
    // event.promise
})
```

### 链式调用

每次调用then或者catch都会返回一个新的promise对象。

#### catching errors

Promise chaining allows you to catch errors that may occur in a fulfillment or rejection handler from a previous promise.

==Always have a rejection handler at the end of a promise chain to ensure that you can properly handle any errors that may occur.==

#### promise链式调用中返回值

```javascript
const p1 = new Promise((resolve, reject) => {
    resolve(42);
});
// p1.then()返回的值将会传入它返回的promise的fulfillment handler。
p1.then((data) => {
    return data + 1;
    // return new Promise((resolve, reject) => { resolve(data + 1)}) 应该是等价的。
}).then((data) => {
    console.log('data', data); // 43
});

// rejection handler 返回的值也可以传递
const p2 = new Promise((resolve, reject) => {
    reject(42);
});
p2.catch((data) => {
    return data + 1;
}).then((data) => {
    console.log('data', data); // 43
});
```

#### promise链式调用中返回promise对象

```javascript
let p1 = new Promise(function(resolve, reject) {
    resolve(42);
});

let p2 = new Promise(function(resolve, reject) {
    resolve(43);
});

p1.then(function(value) {
    // first fulfillment handler
    console.log(value);     // 42
    return p2;
}).then(function(value) {
    // second fulfillment handler
    console.log(value);     // 43
});

// 这种模式在，当你想要前一个promise settled后，再执行另一个promise的executor
let p1 = new Promise(function(resolve, reject) {
    resolve(42);
});

p1.then(function(value) {
    console.log(value);     // 42

    // create a new promise
    let p2 = new Promise(function(resolve, reject) {
        resolve(43);
    });

    return p2
}).then(function(value) {
    console.log(value);     // 43
});
```

### 多个promise

更多的时候，下一步的操作执行依赖于多个promise对象的执行情况。

ES6提供了两种方法去取监控多个promise对象的执行情况，Promise.all()和Promise.race()

#### Promise.all()

参数 - 接受一个由promise对象组成的可迭代结构
返回值 - 返回一个promise
    当迭代器中的每一个promise对象都fulfilled，这个promise会fulfilled，。
    当迭代器中有任意一个promise rejected。返回的promise立即变为rejected状态，不会再等待其他promise的状态。

```javascript
// fulfilled
let p1 = new Promise(function(resolve, reject) {
    resolve(42);
});

let p2 = new Promise(function(resolve, reject) {
    resolve(43);
});

let p3 = new Promise(function(resolve, reject) {
    resolve(44);
});

let p4 = Promise.all([p1, p2, p3]);
p4.then((value) => {
    console.log(value); // [42, 43, 44]
});

// rejected
let p1 = new Promise(function(resolve, reject) {
    resolve(42);
});

let p2 = new Promise(function(resolve, reject) {
    reject(43); // 立即停止
});

let p3 = new Promise(function(resolve, reject) {
    resolve(44);
});

let p4 = Promise.all([p1, p2, p3]);

p4.catch(function(value) {
    console.log(Array.isArray(value))   // false
    console.log(value);                 // 43
});
```

#### Promise.race()

参数 - 接受一个由promise对象组成的可迭代结构
返回值 - 返回一个promise
    当迭代器中有任意一个promise率先 rejected, 则返回的promise状态变成rejected
    当迭代器中有任意一个promise率先 fulfilled, 则返回的promise状态变成fulfilled

