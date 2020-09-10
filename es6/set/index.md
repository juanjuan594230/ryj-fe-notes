# Set & Map

A set is a list of values that cannot contain duplicates.
it’s much more common to just check a set to see if a value is present.

Set数据结构保存了一组值，其中不包含重复的值。通常用来检查一个值是否存在于set中。

A map is a collection of keys that correspond to specific values.
Maps are frequently used as caches, for storing data to be quickly retrieved later.

Map是键值对的集合。通常用来存储数据，便于之后快速访问。

## ES5时代，使用对象模仿Set和Map

```javascript
const set = Object.create(null); // 无prototype
set.foo = true; // value true 代表存在
if (set.foo) {
    // ...
}

const map = Object.create(null);
map.foo = 'foo'; // value stored
```

### 缺陷

key limit string，不能是别的类型（ES6中可以是新增的symbol类型）

```javascript
const key1 = {};
const key2 = {};
const obj = {};
obj[key1] = 'aaa'; // object call toString
obj[key2] = 'bbb'; // object call toString
```

## set

ECMAScript 6 adds a Set type that is an ordered list of values without duplicates.

??? an ordered list of values如何理解。

set中不存在重复的值。但5和'5'是两个不同的值。

```javascript
const key1 = {};
const key2 = {};
const set = new Set();
set.add(5);
set.add('5');
set.add(key1); // object not call toString
set.add(key2);
console.log(set.size); // 4
```

### init with array

set初始化时可以接受一个数组。set的构造函数将会确保不会存在重复的值。

```javascript
const set = new Set([1,2,4,5,4,5]);
console.log(set.size); // 4
```
延伸：`new Set()`接受任意的iterable对象作为参数。

### add and has

add向set中添加一个值。

has检测某个值是否存在于set中，返回boolean值

### delete

`delete` fn remove single value

`clear` fn remove all value

### forEach

*first arguments and second arguments are same*

```javascript
const set = new Set([1,2,4,5,6,3]);
set.forEach((val, val, set) => {
    // ...
})
```

*可以传递this参数作为forEach的第二个参数*
```javascript
let set = new Set([1, 2]);

let processor = {
    output(value) {
        console.log(value);
    },
    process(dataSet) {
        dataSet.forEach(function(value) {
            this.output(value);
        }, this);
        // arrow fn
        // dataSet.forEach(value => {
        //     this.output(value);
        // });
    }
};

processor.process(set);
```

### convert a set to an Array

```javascript
const set = new Set([1,2,3,4]);
console.log([...set]);
```

可以使用这种方法去做数组去重

### weak set

WeakSet 和 Set最大的区别在于保持对象值的时候。

??? set类型通常也被称为强集，因为它存储对象引用的方式。存储在set实例中的对象实际上与存储在变量中的对象一样，**只要set的引用存在，对象占据的内存无法被释放**。

```javascript
const set = new Set();
let key = {};
set.add(key);
key = null; // {}占用的内存无法被GC释放，有可能会造成内存泄漏
console.log(set.size); // 1 {}仍被set引用，无法释放内存
```

`WeakSet`
```javascript
const weakSet = new WeakSet();
let key = {};
weakSet.add(key);
console.log(weakSet.size); // undefined weakSet不存在size属性???
key = null; // {}的引用不存在了，weakSet中的{}也会移除, {}会被GC回收并释放内存
```

- `WeakSet`中使用add方法添加一个值，如果不是对象，则会报错。
- 不是可迭代的（没有forEach\不能使用for-in\）
- 没有size属性

**如果只是追踪对象引用，建议使用WeakSet**

## Map

Map是键值对的有序列表。键和值都可以是任意类型。key不会执行toString操作

### method

#### constructor

`new Map()`

```javascript
const map = new Map([["name": "renyujuan"], ["age", "8"]]); // [[key1, value1], [key2, value2]]
```

#### set

向map中添加键值对 `map.set(key, value)`

#### get

获取map中执行key的值 `map.get(key)` 不存在则返回undefined

#### 和set相同的fn and property

- `has(key)` return boolean
- `delete(key)`
- `clear()`
- `size` 返回包含的键值对个数

#### forEach

```javascript
const map = new Map([["name": "renyujuan"], ["age", "8"]]);
map.forEach((value, key, map) => { // 按照插入的顺序遍历
    // ...
})
```

### WeakMap

**key必须为object**
**只有key为弱引用，value仍旧为正常引用**
**弱引用，当weakMap的key没有引用时，对应的键值对也会从map中移除**

The most useful place to employ weak maps is when creating an object related to a particular DOM element in a web page.
For example, some JavaScript libraries for web pages maintain one custom object for every DOM element referenced in the library, and that mapping is stored in a cache of objects internally.

```javascript
const elem = document.getElementById('app');
const wm = new WeakMap([[elem, someData]]); // wm中elem的引用不被会计入垃圾回收，也就是说目前elem的引用个数为1。一旦elem = null, 则对应的对象就会被GC释放内存
```

#### special

no `clear()`
no `size`

#### use

WeakMap结合DOM元素使用。

???存储对象实例私有的数据