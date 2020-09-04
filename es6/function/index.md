# Function

## 方法参数的默认值

### es5

需要在代码中去做处理

```javascript
function makeRequest(url, timeout, callback) {
    timeout = timeout === undefined ? 2000 : timeout;
    callback = callback === undefined ? () => {} : callback;
}
```

### es6 为可选参数提供默认值
```javascript
// url 定义为必传参数 timeout callback为可选参数，提供了默认值
function makeRequest(url, timeout = 2000, callback = () => {}) {
    // do something
}
```

### 参数默认值对arguments对象的影响

1、ES5中，非严格模式下，arguments对象不反应方法调用的初始状态；严格模式下，保留函数调用的初始参数状态

```javascript
// no-strict
function mixArgs(first, second) {
    console.log(first === arguments[0]); // true
    console.log(second === arguments[1]); // true
    first = "c";
    second = "d";
    console.log(first === arguments[0]); // true
    console.log(second === arguments[1]); // true
}
mixArgs("a", "b");

// use strict
function mixArgs(first, second) {
    console.log(first === arguments[0]); // true
    console.log(second === arguments[1]); // true
    first = "c";
    second = "d";
    console.log(first === arguments[0]); // false
    console.log(second === arguments[1]); // false
}

mixArgs("a", "b");
```

2、ES6中，arguments对象反应了初始调用状态。严格模式和非严格模式下，表现行为都是一致的

```javascript
function mixArgs(first, second = "b") {
    console.log(arguments.length); // 1 方法调用时只传了一个参数，arguments中只包含了first，与预期一致
    console.log(first === arguments[0]); // true
    console.log(second === arguments[1]); // arguments[1] === undefined false
    first = "c";
    second = "d"
    console.log(first === arguments[0]); // false
    console.log(second === arguments[1]); // false
}

mixArgs("a");
```

### 默认参数表达式

参数的默认值可以是一个表达式，比如方法的调用(传递了值的话，方法不会调用，只有未传递对应的参数值时，方法才会调用)。

位置靠前的参数可以作为位置相对靠后参数的默认值。反之不可，会出现暂时性死区TDZ。

```javascript
// 1
function add(first, second = first) {
    return first + second;
}
console.log(add(1,1)); // 2
console.log(add(2)); // 4
// 2
function add(first = second, second) {
    return first + second;
}
add(1, 1);
```

## 其余参数  rest params

`...变量名` 用于获取函数的多余参数

`arguments`包含了fn的所有参数`

```javascript
// ES5
function pick(obj) {
    // 多余参数的获取只能通过arguments对象，且arguments对象包含了fn的所有参数（具名的 + 多余的），访问的下标不是从0开始
}
// ES6
function pick(obj, ...keys) {
    // 多余的参数可以通过keys来获取，只包含了obj参数后的多余参数
}
```

### 两个限制

1、rest params必须是最后一个参数，否则会导致语法错误
2、rest params不能用于对象的setter中 ？？？

## The Spread Operator 扩展运算符

eg
```javascript
Math.max(2,4); // easy

// but 想找到一个number数组中的最大值
Math.max.apply(Math, nums); // es5
Math.max(...nums); // es6
```

## name property

[译]javascript给了多种方式去定义一个函数，因此识别函数具有挑战性。此外，匿名函数表达式的普遍使用，使得调试变得更加困难，通常会导致难以阅读和解码的堆栈追踪。基于以上原因，ES6为所有的函数增加了name属性。

### special case of the name property
```javascript
// case 1
const doSomething = function doSomethingElse() {
    console.log(111);
}
console.log(doSomething.name); // doSomethingElse 函数表达式的名称优先于给函数分配的变量

// case 2
const person = {
    get fristName() {
        return 'ren';
    },
    sayName() {
        console.log(this.name);
    }
}
console.log(person.sayName.name); // sayName
// console.log(person.firstName.name); // undefined
var descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log(descriptor.get.name); // "get firstName"
```

### bind fn name
```javascript
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
console.log(sayName2.name); // bound sayName
console.log(sayName3.name); // bound sayName
console.log(sayName2()); // BBB
```

## 函数直接调用 & new 调用

`javascript`中函数有两种使用方式。一种是直接调用，另一种是使用new 操作符。

`function`存在两个内部方法`[[Call]]` `[[Construct]]`。
    直接调用函数时，`[[Call]]`函数被执行，执行的是函数体的代码；
    使用`new`操作符，`[[Construct]]`函数被执行，它的作用是创建一个新的对象，将this指向该对象并执行函数体代码，最后返回新创建的对象。

*不是所有的函数都有`[[Construct]]`属性，比如箭头函数，因此箭头函数不能使用new操作符*

### 如何确定方法使用的是new操作符 ???

#### es5
use `instanceof`

#### es6
use `new.target`  *在函数外部使用`new.target`会导致语法错误*

## Block-Level function

1、函数声明提升至块级作用域的顶部<假如使用let来定义，则不会提升，存在TDZ>
2、块级内部可以访问。块级外部，不可访问

```javascript
if (flag) {
    console.log(typeof doSomething); // function 函数声明提升至block top
    function doSomething() {
        // ...
    }
    doSomething(); // block-level exist
}
// block end doSomething not exist
console.log(typeof doSomething); // undefined
```

```javascript
if (flag) {
    console.log(typeof doSomething); // let TDZ error 引用错误
    let doSomething = function () {
        // ...
    }
    doSomething(); // block-level exist
}
// block end doSomething not exist
console.log(typeof doSomething); // undefined
```

*es6 非严格模式*
```javascript
if (flag) {
    console.log(typeof doSomething); // function
    function doSomething() {
        // ...
    }
    doSomething(); // block-level exist
}
console.log(typeof doSomething); // function 函数声明提升至全局，still exist there
```

## Tail Call Optimization 尾调用优化

严格模式下，ES6致力于减少尾调用调用栈的大小。

清除并重用当前堆栈信息，而不是为尾调用创建一个新的堆栈信息。前提是要满足以下条件：

- 尾调用不访问当前堆栈环境中的变量（意味着这个函数不是闭包）
- 尾调用返回之后，没有其余的代码需要执行。
- 尾调用结果作为函数值返回（所以必须是return fn()）

```javascript
function f() {
    let m = 1;
    let n = 2;
    return g(m + n) // optimized
}

function f() {
    g(); // not optimized no return 不满足第三条
}

function f() {
    return 1 + g(); // not optimized 不满足2
}

function f() {
    const result = g();
    return result; // not optimized
}

function f() {
    const num = 1;
    g = () => num;
    return g(); // not optimized closure 闭包
}
```

### 如何利用尾调用

尾调用优化主要应用在递归中。

##总结
- 默认值
- rest params ...变量名
- new.target 区分函数是否使用new操作符  ES5使用instanceof  但使用改变this的方法会存在误差。函数内部存在[[Call]] [[Construct]]两个函数
- 箭头函数用来代替匿名函数表达式 没有this绑定，没有arguments绑定；内部不存在[[Construct]]方法，因此不能使用new操作符，因此也不存在proptotype属性；this无法改变；
- 尾调用优化(清除并重用当前堆栈环境，而不是为调用开辟新的堆栈环境) 3个限制（不使用当前堆栈环境中的变量，返回后无其他操作、作为函数值返回）；通常用于递归。
- 扩展运算符，方便地展开数组传递参数
- name property  bind/get


