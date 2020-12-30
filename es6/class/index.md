# class

首先需要了解的是class背后的机制

## ES5的类class结构

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.sayName = function() {
    console.log(this.name);
}
const RYJ = new Person('renyujuan');
RYJ.sayName(); // renyujuan
console.log(RYJ instanceof Person); // true
console.log(RYJ instanceof Object); // true
```

## A Basic Class Declaration

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    // 等同于Person.prototype.sayName
    sayName() {
        console.log(this.name);
    }
}
```

## ES6 Class 与 ES5 function type的不同

- `function`存在声明提升，`Class`存在暂时性死区
- `Class`内部的代码都是在严格模式下执行的。
- `Class`内部定义的方法不能使用`new`操作符，因为不存在`[[construct]]`方法，否则会报错
- `Class`只能以构造函数的方式调用，否则会报错
- `Class`内部定义的所有方法都是不可枚举的。

## Class一等公民

## 静态方法

通过类本身来调用，不会被实例继承。

## 继承

ES5继承

```javascript

```

ES6继承

```javascript
```

**继承其他类的类统称为派生类。在派生类中，当存在构造函数时，必须调用super()**

**关于super**

- 只能在派生类中使用
- 在构造函数中，获取this之前，调用super

### 派生类中的影子方法

可以在派生类中定义与基类名称相同的方法，以达到重新定义的目的<原型链查找更靠前，基类中定义的方法在查找中靠后>

### 静态成员的继承

派生类可以直接调用基类的静态方法

`extends`后面的类具有`[[constructor]]`和proptotype即可被继承。