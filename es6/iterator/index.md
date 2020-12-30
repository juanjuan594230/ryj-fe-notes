# iterator

## background

传统的For循环是通过变量跟踪数组的下标来实现的。当for循环发生嵌套时，就需要跟踪多个变量，就会给编程带来一定的复杂性，也会导致引入错误。

- 迭代器使得遍历集合数据更加容易。
- 异步编程更加简单

`for-of` 、扩展运算符`...`基于iterator工作。

## es6为什么引入iterator

???

迭代器只是实现了iterator接口的对象。所有的迭代器对象都有一个`next`方法，并且返回一个对象。

```javascript
const obj = iterator.next();
// obj
{
    value: the next value,
    done: boolean value true: 没有更多的value返回
}
```

使用ES5实现一个简单的迭代器

```javascript
function createIterator(items) {
    var i = 0;
    return {
        next: function() {
            var done = i >= item.length;
            var value = !done ? item[i++] : undefined;
            return {
                value: value
                done: done
            }
        }
    }
}

const iterator = createIterator([1,2,4]);
console.log(iterator.next()); // { value: 1, done: false}
console.log(iterator.next()); // { value: 2, done: false}
console.log(iterator.next()); // { value: 4, done: false}
console.log(iterator.next()); // { value: undefined, done: true}
```

## generator

一般的function执行之后，无法停止，直到执行完最后一句（or 使用return语句 or 抛出错误）；再次调用则会重新从最顶部的语句开始执行。

### 定义

`generator`是一个fn，返回iterator对象。==可以在中途停止执行，然后从停止的地方继续执行。==

其他常见的定义：

生成器是一类特殊的函数，简化编写迭代器的任务。
生成器是一个函数，返回一系列的结果

在JS中，generator是一个函数，返回一个对象（包含next fn）。每次调用next fn，都会返回一个对象（包含了value和done两个属性）。当返回的对象属性done为true时，生成器停止执行，并且不会再生成新的值。

### 创建

`function *` 语法。生成器仅仅是一个function，可以作为对象的属性定义，也可以作为类的方法定义...
- `*`表明了方法是一个generator，位于`function`关键字后面

`yield`（产出）关键字。生成器遇到yield关键字，便会将yield关键字后面的值作为返回对象value属性的值。
- `yield`表明了，iterator调用next之后，返回的value值；生成器函数会在每个yield语句之后，停止执行。继续执行的条件，调用next方法

在生成器函数中也可以使用return关键字。return关键字会使得生成器返回对象的done属性变成true，因此生成器将不会再生成更多的值。如果没有明确的return语句，默认在函数的最后会有return undefined.

调用生成器函数会返回一个生成器对象（iterator对象）；

在生成器返回的对象上，可以调用next fn，生成器便开始执行。

```javascript
function *createIterator() {
    console.log(111);
    yield 1;
    yield 2;
    yield 3;
}
let iterator = createIterator(); // 111没有打印
console.log(iterator.next()); // 111 遇到yield语句，产出 { value: 1, done: false } 并停止执行，等待下一次的next 调用
console.log(iterator.next()); // 调用之后，从上次停止的地方开始执行，遇到yield语句， 产出{ value: 2, done: false } 并停止执行，等待下一次的next 调用
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: false }
```

**`yield`关键字只能用在generator函数中，除此之外会抛出语法错误，包括在generator函数内部的函数**
```javascript
function *createIterator(items) {

    items.forEach(function(item) {

        // syntax error
        yield item + 1;
    });
}
```

### generator函数表达式

```javascript
const createIterator = function *() {
    // ...
}
```

**创建同时也是生成器的箭头函数是不可能的**

### generator可以作为对象的属性

```javascript

const obj = {
    // es5对象字面量
    createIterator: function *() {
        // ...
    },
    // es6
    *createIterator() {
        // ...
    }
}
```

### generator的使用

#### 实现迭代器

使用iterator实现的迭代器
```javascript
const iterableObj = {
    [Symbol.iterator]() {
        let step = 0;
        return {
            next() {
                step++;
                if (step === 1) {
                    return { value: 'This', done: false };
                } else if (step === 2) {
                    return { value: 'is', done: false };
                } else if (step === 3) {
                    return { value: 'iterable', done: false};
                }
                return { value: undefined, done: true };
            }
        }
    }
}
for (let val of iterableObj) {
    console.log(val); // this is iterable
}
```

使用generator实现的迭代器
```javascript
function * createIterator() {
    yield 'This';
    yield 'is';
    yield 'iterable'
}

for(let value of createIterator()) {
    console.log(value);
}
```

#### 更好的异步功能

generator 结合 Co。Co模块，自动执行器
async/await。 generator函数的语法糖，内置自动执行器，不再需要co

```javascript

```

#### 无限的数据流

？？？使用场景
```javascript
function * naturalNumbers() {
  let num = 1;
  while (true) {
    yield num;
    num = num + 1
  }
}
const numbers = naturalNumbers();
console.log(numbers.next().value)
console.log(numbers.next().value)
```

#### generator 作为观察者 ？？？

Generators can also receive values using the next(val) function. Then the generator is called an observer since it wakes up when it receives new values. In a sense, it keeps observing for values and acts when it gets one. You can read more about this pattern

https://exploringjs.com/es6/ch_generators.html#sec_generators-as-observers

### 生成器的好处

#### Lazy Evaluation 惰性求值

惰性求值：是一种评估模型，延迟求值直至值有需要的时候。惰性求值可以使得性能得到提升，还可以构造无限的数据类型

```javascript
function * powerSeries(number, power) {
    let base = number;
    while(true) {
        yield Math.pow(base, power);
        base++;
    }
}
const powerOf2 = powerSeries(3,2); // 仅仅是创建了一个iterator对象，没有任何值被计算。
console.log(powerOf2.next().value); // 9
```

#### Memory Efficient

惰性求值带来最直接的效果就是，generator是高效记忆（存储）。仅仅生成需要的值。

对于普通函数来说，需要提升生成所有的value，并且需要在环境中保存他们，以防之后使用。

## iterables and for-of

- 一个对象具有`Symbol.iterator`属性，那该对象就是可迭代的
- `Symbol.iterator`本身是一个函数（可以理解为是generator函数），返回给定对象的迭代器
- `null` `undefined`是不可迭代的。使用`for-of`会报错


每次`for-of`循环执行时，都会在iterator上调用next方法，并将返回的value值赋值到变量上；直至返回的done为true，循环结束

```javascript
const nums = [1,2,4];
for(let num of nums) {
    console.log(num) // 1 2 3
}
```

1 `for-of` loop call `Symbol.iterator`方法获取nums数组的迭代器对象。

2 `iterator.next()` called，并返回obj = `{value: 1, done: false}`

3 `num = obj.value`

4 循环2.3步骤，直至`iterator.next()` called之后，返回的对象done属性为`true`

5 循环结束

### 获取默认的iterator对象

```javascript
const nums = [1,2,4];
const iterator1 = nums[Symbol.iterator](); // 获取nums默认的iterator对象
console.log(iterator1.next()); // { value: 1, done: false }
console.log(iterator1.next()); // { value: 2, done: false }
console.log(iterator1.next()); // { value: 4, done: false }
console.log(iterator1.next()); // { value: undefined, done: true }
```

### 判断一个对象是否是可迭代的

```javascript
function isIterable(obj) {
    return typeof obj[Symbol.iterator] === 'function';
}
console.log(isIterable([])); // true
console.log('aaa'); // true
console.log(isIterable({})); // false
console.log(isIterable(new Set())); // true
console.log(isIterable(new Map())); // true
console.log(isIterable(new WeakSet())); // false
console.log(isIterable(new WeakMap())); // false
```

### 自定义[Symbol.iterator]

`Object`类型默认是不可迭代的

```javascript
const obj = {
    name: 'renyujuan',
    *[Symbol.iterator]() {
        const keys = Object.keys(obj);
        for(let i = 0; i < keys.length; i++) {
            yield [keys[i], obj[keys[i]]];
        }
    }
}
const iterator2 = obj[Symbol.iterator]();
console.log(iterator2.next()); // { value: [ 'name', 'renyujuan' ], done: false }
console.log(iterator2.next()); // { value: undefined, done: true }

for(let [key, val] of obj) {
    console.log(key + ':' + val); // name:renyujuan
}
```

### 集合的内置迭代器

`array` `set` `map`三种集合类型都包含了三种内置的迭代器

- `entries()` [key, value]
- `values()` value
- `keys()` key

集合使用`for-of`的默认迭代器

`array` `set`使用`for-of`默认的迭代器为`values()`
`map`使用`for-of`默认的迭代器为`entries()`

### 扩展运算符

扩展运算符用于一切可迭代的集合。是将可迭代对象转换成数组最方便的方法。

```javascript
const set = new Set([1,2,3,4,5,5]);
const arr = [...set]; // [1,2,3,4,5];

const map = new Map([["name", "renyujuan"], ["age", "秘密"]]);
const arr1 = [...map]; // [["name", "renyujuan"], ["age", "秘密"]]

const arr2 = [1,2,...arr, ...arr1];

console.log([...'hello']); // ['h','e','l','l','o']
```

## 先进的迭代器给功能

### 参数传递

可以通过next方法或者在生成器中使用yield语句向迭代器传递参数。

==使用next传递的参数，在生成器函数中会成为yield语句返回的值==

```javascript
function *createIterator() {
    let first = yield 1;
    let second = yield first + 2;
    yield second + 3;
}
const iterator = createIterator();
console.log(iterator.next()); // { value: 1, done: false} 通过yield语句向iterator传值
console.log(iteratot.next(4)); // { value: 6, done: false }
console.log(iteratot.next(5)); // { value: 8, done: false }
console.log(iteratot.next(4)); // { value: undefined, done: true }
```

首次调用next方法比较特别，因为通过next传递的参数会丢失。???

Since arguments passed to next() become the values returned by yield, an argument from the first call to next() could only replace the first yield statement in the generator function if it could be accessed before that yield statement. That’s not possible, so there’s no reason to pass an argument the first time next() is called.

第二次调用next，传递参数为4；4在生成器函数中被作为yield语句1的返回值，赋值给first变量;

第三次调用next，传递参数为5；4在生成器函数中被作为yield语句2的返回值，赋值给变量second;

图示：

![image](http://note.youdao.com/yws/public/resource/6f8baa634087372c46dc6be235dd29aa/xmlnote/F12D852A5E414BAA9830A09CB39067D0/18002)

### 在迭代器iterator中抛出错误

`iterator`实现了`throw`方法，指示迭代器抛出错误。这种能力在异步编程中是非常重要的，也让生成器更具弹性，可以返回value或者抛出错误。

```javascript
function *createIterator() {
    let first = yield 1;
    let second = yield first + 2;
    yield second + 3;
}
const iterator = createIterator();
console.log(iterator.next());                   // "{ value: 1, done: false }"
console.log(iterator.next(4));                  // "{ value: 6, done: false }"
console.log(iterator.throw(new Error("Boom"))); // error thrown from generator
```

### 生成器中的`return`语句

生成器本质上是函数，因此可以使用`return`语句退出执行、并为最后一次的`next`调用返回value。在生成器函数中，使用`return`意味着执行完成(done: true)

```javascript
function createIterator() {
    yield 1;
    return;
    yield 2; // not execute
}
const iterator = createiterator();
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: undefined, done: true }
```

可以使用`return`指定一个返回值

```javascript
function createIterator() {
    yield 1;
    return 77;
}
const iterator = createiterator();
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 77, done: true }
iterator.next(); // { value: undefined, done: true }
```

==`for-of`和扩展运算符判断迭代完成的依据是done是否为true==

### 委派生成器

```javascript
function *createNumsIterator() {
    yield 1;
    yield 2;
}

function *createColorIterator() {
    yield 'red';
    yield 'black';
}

// 首先委托给从createNumsIterator返回的迭代器
// 其次委托给从createColorIterator返回的迭代器
// 最后是createCombineIterator返回的迭代器
function *createCombineIterator() {
    yield *createNumsIterator();
    yield *createColorIterator();
    yield true;
}

const iterator = createCombineIterator();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 'red', done: false }
console.log(iterator.next()); // { value: 'black', done: false }
console.log(iterator.next()); // { value: true, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

**生成器委派还允许进一步使用生成器返回的值。这是访问此类返回值最简单的方法，在执行复杂任务时会非常有用**。

```javascript
function *createNumsIterator() {
    yield 1;
    yield 2;
    return 3;
}

function *createIterator(twice) {
    for(let i = 0; i < twice; i++) {
        yield 'repeat'
    }
}

function *createCombineIterator() {
    const result = yield *createNumsIterator();
    yield *createIterator(result);
}

const iterator = createCombineIterator();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 'repeat', done: false }
console.log(iterator.next()); // { value: 'repeat', done: false }
console.log(iterator.next()); // { value: 'repeat', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

==注意：当调用next fn时，value: 3从未输出过。它只存在于createCombineIterator中==

==`yield * 'hello'`会返回string默认的迭代器==

**使用返回值的生成器委托是一种非常强大的范例，尤其是与异步编程结合的时候**

## 异步任务执行器

`generator`大部分的实践是与异步编程结合。

==内部暂停==

### 一个简单的任务执行器

```javascript
function runTask(taskDef) {
    const iterator = taskDef(); // taskDef is a generator
    let result = iterator.next();
    function step() {
        if (!result.done) {
            result = iterator.next();
            step();
        }
    }
    step();
}
```

### 异步任务执行器

与同步任务执行不同，==异步任务执行器需要回调并且知道什么时候执行回调函数==；异步任务执行器也需要知道当前执行的任务是否是异步任务。

可能会用以下方式标识一个异步操作。返回值是一个`function`, 执行回调函数

```javascript
function fetchData() {
    return function(callback) {
        callback(null, 'hi');
    }
}
```

```javascript
let fs = require("fs");

// 标识一个异步操作
function readFile(filename) {
    return function(callback) {
        fs.readFile(filename, callback);
    };
}

function asyncRun(generator) {
    const task = generator(); // iterator
    // result.value即为调用readFile()返回的fn(callback) {fs.readFile(filename, callback)}
    let result = task.next();
    function step() {
        if (result.done) {
            return;
        }
        // 异步任务
        if (typeof result.value === 'function') {
            // result.value()调用真正的异步操作。并将next的调用放在callback中。
            result.value((error, data) => {
                if (error) {
                    result = task.throw(error);
                    return;
                }
                result = task.next(data);
                step();
            })
        } else {
            result = task.next(result.value);
            step();
        }
    }
    step();
}

asyncRun(function *() {
    // yield将readFile()的返回值传递到执行器，因此通过返回一个fn来标识异步任务<但标识异步任务的方式不是唯一的>
    let content = yield readFile('index.js');
    console.log('content', content);
});
```

**虽然判断异步操作的方式存在很多缺陷，但最重要的是理解背后的原理。`promise`提供了更强大的方式调度异步任务**