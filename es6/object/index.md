# Object

## category

- Oridinary objects
- Exotic objects
- Standard objects
- Built-in objects

## 对象字面量语法扩展

- property initializer
- Concise methods
```javascript
const person = {
    sayName() {
        // es6 省略了冒号和function关键字 并且可以使用super
    }
    sayName: function() {
        // es5 不可使用super
    }
}
```
- Computed Property Names

对象定义的时候，可以使用[]方括号来包含有变量的属性名

```javascript
const lastname = 'lastName';
const suffix = 'Name';
const person = {
    [lastname]: 'yujuan', // person.lastName = 'yujuan'
    ['first' + suffix]: 'ren' // person.firstName = 'ren'
}
```

## New Methods

### Object.is()

用来比较两个值是否相等。大部分情况，比较结果与`===`是相同的。

特别地： +0 & -0  NAN & NAN

```javascript
console.log(+0 === -0) // true
console.log(NaN === NaN) // false
console.log(Object.is(+0, -0)) // false
console.log(Object.is(NaN, NaN)) // true
```

`Object.is不是用来代替全等运算符的，若代码中需要考虑到特殊情况，可以按需使用两者`

### Object.assign()

`Mixin`是JS中，对象组合的一种流行模式。提供了一种除继承以外，另一种从其他对象获取属性的方式。

```javascript
// 类似 浅拷贝
function mixin(receiver, supplier) {
    Object.keys(supplier).forEach(key => {
        receiver[key] = supplier[key]
    });
    return receiver;
}
```

`Object.assign`就是这种混入模式的ES6实现。接受一个receiver，一个或者多个supplier。返回receiver。

*不能拷贝supplier对象的访问器属性为receiver对象的访问器属性*

由于`Object.assign`内部采用赋值运算符将supplier对象的属性拷贝到receiver对象上，当supplier对象存在访问器属性时，拷贝到receiver
对象上时会变成一个数据属性。

```javascript
const receiver = {};
const supplier = {
    get name() {
        return 'renyujuan';
    }
}
Object.assign(receiver, supplier);
const descriptor = Object.getOwnPropertyDescriptor(receiver, 'name');
console.log(descriptor.value); // renyujuan
console.log(descriptor.get); // undefined
```

## 复制对象字面量属性

```javascript
var person = {
    name: 'AAA',
    name: 'BBB' // es5 strict mode 语法错误
}
const person = {
    name: 'AAA,
    name: 'BBB' // es5 strict or non-strict 均不会抛出错误 且会覆盖之前的值
}
```

## 自身属性的枚举顺序

es5没有定义对象属性的枚举顺序，这留给JS引擎来决定。

但ES6严格定义了枚举自身属性时返回的顺序。这一改变，有两个地方受到影响。

1、使用`Object.getOwnPropertyNames()`和`Reflect.ownKeys`时，属性是如何返回的
2、`Obejct.assign`使用时，属性的顺序。

### basic order

1、数字key，以升序返回
2、字符串key，按照被添加到对象的先后顺序返回
3、symbol key，按照被添加到对象的先后顺序返回

```javascript
const obj = {
    a: 1,
    0: 1,
    c: 1,
    2: 1,
    b: 1,
    1: 1
}
obj.d = 1;
console.log(Object.getOwnPropertyNames(obj).join('')); // 012acbd
```

*`for-in` `Object.keys()` `JSON.stringify`没有指定枚举顺序*

## 更强大的原型

### 改变一个对象的原型

`Object.setPrototypeOf(obj, prototype obj)` 改变一个对象的原型

`[[Prototype]]`内部属性保存这对象的原型。

`Object.getPrototypeOf`用来获取一个对象的原型（保存在[[prototype]]中的值）
`Object.setPrototypeOf`改变一个对象的原型（改变[[prototype]]中保存的值）

### 使用super更容易访问原型

对象定义的属性方法中通过super能直接访问到其原型对象。但只能在对象定义的方法中使用，不能用于别的地方。

## 形式化的方法定义

### method

```javascript
const person {
    getGreeting() { // method getGreeting内部的[[HomeObject]指向person
        // ...
    }
}
// not a method
function shareGreeting() {
    // ...
}
```
??? 任何对`super`的引用，都需要`[[HomeObject]]`来决定???

上一节，对象内定义的方法，其内部可以使用`super`来访问原型对象。这一节说到，`super`的引用，都需要`[[HomeObject]]`来决定。
`[[HomeObject]]`只存在于method中，这应该也是super只能在对象内定义的方法中使用的原因。

### `super`工作原理

1、使用Object.getPrototypeOf(getGreeting.[[HomeObject]]) 来获取包含对象的原型。person
2、在原型对象上寻找相同属性名的方法 person.getGreeting
3、this绑定，方法调用 person.getGreeting.call(this)

```javascript
const person = {
    getGreeting() {
        return 'hello';
    }
}
const friend = {
    getGreeting() {
        return super.getGreeting() + ' friend';
    }
}
Object.setPrototypeOf(friend, person);
friend.getGreeting(); // hello friend
```
