# 对象 数组解构

## 对象解构赋值

### 使用场景

- 变量赋值
- 函数传参

```javascript
const person = {
    name: 'renyujuan'
}
const { name } = person;

function sayName({ name }) {
    console.log(name);
}
sayName(person)

const { name } = null; // runtime error
const { name } = undefined; // runtime error TypeError: Cannot destructure property `name` of 'undefined' or 'null'
```

### 属性名不一致

定义的属性名与对象中包含的属性名不一致时

`{ name: newName } = obj` 从obj读取name属性值，并将其保存在newName变量中。

```javascript
const person = {
    name: 'renyujuan'
}
const { name: fullName } = person; // name为对象本身的属性名，fullName为想要赋值的变量名
console.log(fullName); // renyujuan
```

### 嵌套对象

```javascript
const person = {
    name: {
        firstName: 'ren',
        lastName: 'yujuan',
        fullName: 'renyujuan'
    }
}

const { name = { firstName, lastName, fullName } } = person;
```

## 数组

### use

数组本身不会发生变化

```javascript
const colors = ['red', 'green', 'blue'];
const [ firstColor, secondColor ] = colors;
const [ fc, , tc ] = colors;
console.log('firstColor', firstColor); // red
console.log('secondColor', secondColor); // green
console.log('fc', fc); // red
console.log('tc', tc); // blue
```

### 交换两个值

```javascript
let a = 1;
let b = 2;

// es5 swap
const temp = a;
a = b;
b = a;

// es6 array 解构赋值
[a, b] = [b, a];
```

### 嵌套

```javascript
const [ firstcolor, [ secondfirstcolor ]] = [ 'red', ['pink', 'grey']];
console.log('firstcolor', firstcolor); // red
console.log('secondfirstcolor', secondfirstcolor); // pink
```

### rest item

```javascript
const nums = [1, 2, 3, 4, 5];
const [ firstNum, ...subNums ] = nums;
console.log('firstNum', firstNum); // 1
console.log('subNums', subNums); // [2,3,4,5]
console.log('nums', nums); // [1,2,3,4,5]
console.log('subNums1', subNums1); // [0,2,3,4,5]

// 引用类型
const objs = [
    {
        name: 'obj1'
    },
    {
        name: 'obj2'
    }
]
const [...objCopy] = objs;
objCopy[0].name = 'obj0';
console.log('objs', objs); // [{ name: obj0}, { name: obj2}]
console.log('objCopy', objCopy); // [{ name: obj0}, { name: obj2}]
```

#### 用途

javascript明显的一个疏漏就是简单地实现一个数组的克隆。

```javascript
// es5
const newArr = [1,2,3].concat();
// es6
const [ ...newArr ] = [1,2,3];
```

## 混合解构

```javascript
let node = {
        type: "Identifier",
        name: "foo",
        loc: {
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 4
            }
        },
        range: [0, 3]
    };

let {
    loc: { start },
    range: [ startIndex ]
} = node;

console.log(start.line);        // 1
console.log(start.column);      // 1
console.log(startIndex); // 0
```

## 解构方法参数

解构方法的参数，可以使得方法期望的参数变得更加清晰

```javascript
// set cookie nessary(key, value) not-nessary(domain, path, secure, expires)
function setCookie(key, value, { domain, path, secure, expires}) {
    // ...
}
setCookie('mockUser', 'renyujuan', {
    domain: 'ug.viviv.com',
    path: '/'
})

// 解构的参数不传递会发生错误
setCookie('mockUser', 'renyujuan') // error 相当于 let { domain, path, secure, expires } = undefined
// 改进
function setCookie(key, value, { domain, path, secure, expires} = {}) {
    // ...
}

// 解构参数的默认值
function setCookie(key, value, { domain, path = '/', secure = false, expires}) {
    // ...
}
```