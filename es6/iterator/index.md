# iterator

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

what?`generator`是一个fn，返回iterator

how? `function *createIterator()`

`*` & `yield`关键字

- `*`表明了方法是一个generator，位于`function`关键字后面
- `yield`表明了，iterator调用next之后，返回的value值；生成器函数会在每个yield语句之后，停止执行。

```javascript
function *createIterator() {
    console.log(111);
    yield 1;
    yield 2;
    yield 3;
}
let iterator = createIterator(); // 111没有打印
console.log(iterator.next()); // 111 { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
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

## iterables and for-of

- 一个对象具有`Symbol.iterator`属性，那该对象就是可迭代的
- `Symbol.iterator`本身是一个函数，返回给定对象的迭代器
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

