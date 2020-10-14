# block bindings

大纲：

1、var声明的变量会提升到全局或者函数作用域的顶部
2、let、const引入了块级作用域的概念，在作用域内没有变量声明提升；相同作用域存在的变量不能重复声明；存在暂时性死区
3、const声明时需要初始化，且不能重新赋值（不能修改绑定）；


## `var`声明与提升

`var`关键字声明的变量会被提升到函数或者全局作用域的顶部

## block-level Declarations

块级作用域(词法作用域 lexical scope) function or {}

`let` & `const`用来定义变量，没有变量提升，只在当前的块级作用域有效；并且在变量定义时变量才可用，因此存在暂时性死区。

* `const`声明的变量值不能改变，且必须在声明变量的同时初始化变量

```javascript
const name; // syntax error: missing initialization
```

* `const`防止修改绑定，而非绑定的值(类似人与身份证的关系，身份证对应的人不能改变，但这个人的姓名、家庭住址等信息可以改变)*

```javascript
const name = 'renyujuan';
name = 'ryj'; // TypeError: assignment to constant variable

const renyujuan = {
    name: 'renyujuan',
}
renyujuan.name = 'ryj'
renyujuan = {} // TypeError: assignment to constant variable
```

### 暂时性死区

这个术语在ECMAScript中没有明确定义，一般用来描述`let` `const`定义的变量在声明语句执行之前是不可以被访问的。

**`var`定义的变量，其声明会被提升到函数或全局作用域的顶部；`let` `const`则会存在暂时性死区**

**在DTZ时，`typeof`操作符也不是安全的。**

eg:
```javascript
let condition = true;
if (condition) {
    console.log(value); // ReferenceError TDZ 暂时性死区
    const value = 'XXX';
}
```

eg:深入理解TDZ
```javascript

```

* `let` `const` declaration in loops

```javascript
const fns = [];
for (let i = 0; i < 10; i++) {
    fns.push(function() {
        console.log(i)
    })
}
fns.forEach(fn => { fn() }) // 0 1 2 3 ... 9

// for-in for-of与for表现一致 for-in遍历一个对象除了Symbol属性之外的可枚举属性 for-of遍历可迭代对象(iterator)
```

`const` for loop
```javascript
const fns = [];
for (const i = 0; i < 10; i++) {
    fns.push(function() {
        console.log(i) // 第一次循环可，第二次循环：TypeError: Assignment to constant variable
    })
}
fns.forEach(fn => { fn() })
```

`const` `for-in` `for-of` no-error 创建了一个新的绑定
```javascript
// for-in
const fns = [];
const obj = {
    a: true,
    b: true,
    c: true
}
for (const key in obj) {
    fns.push(function() {
        console.log(key);
    })
}
fns.forEach(fn => { fn() }); // a b c

// for-of
const fns2 = [];
const nums = [1,2,3];
for (const num of nums) { // 循环中num绑定不能被改变
    fns2.push(function() {
        console.log(num);
    })
}
fns2.forEach(fn => { fn() }); // 1 2 3
```

## global block binding

```javascript
var name = 'renyujuan'; // name成为window的一个属性 window.name = renyujuan
var RegExp = 'hello'; // window.RegExp被改写为hello

// let const
let name1 = 'renyujuan'; // name仅仅是全局作用域下的一个变量，不会挂载到window下
```

## summary

- `let` `const`引入了块级作用域（词法作用域）; `const`防止修改绑定
- `let` `const`不存在变量提升，使用变量需要在变量声明之后<`const`需要在声明变量的时候，同时初始化完成绑定>，否则会存在暂时性死区<TDZ>，此时`typeof`操作不是安全的；`var`定义的变量存在变量声明提升，提升至函数或全局作用域的顶部。
- `let` `const`定义的循环变量在for loop中的表现不一致。`const`定义的循环变量在循环语句中，会抛出错误
- `let` `const`定义在循环变量在`for-in` `for-of`中的表现一致，不会抛出错误<创建了一个重新绑定>；但`const`定义的变量在循环体内不能被重新绑定。
- `var`在全局作用域中定义的变量，会成为`window` <browser环境下> 的属性，因此`window`下的变量存在被覆盖的风险; `let` `const`在全局作用域中定义的变量，仅存在于全局作用域下，不会成为`window`对象的属性
- 关于最佳实践，优先使用`const`; 明确会发生改变的话，使用`let`