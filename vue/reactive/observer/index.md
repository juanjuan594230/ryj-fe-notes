# 响应式

**An Example**

```javascript

```

## data

### Object

### Array

- new Observer(value)的过程中改写了value的原型指向
- 遍历value，对数组中的每一项都执行observe(value[i])
- 如果获取的属性对应的值为数组的话，不仅要执行相应的childOb.depend，还要执行dependArray(value) 保证数组中的每一项的__ob__都可以收集相应的依赖。
- 指向的新原型对象中的方法，会先执行Array.prototype[method]；如果是向数组中新增元素的话，还会对新增的元素执行ob.observeArray(inserted); 然后调用ob.dep.notify()触发依赖更新

```javascript
const arrayMethods = Object.create(Array.prototype); // arrayMethods.__proto__ = Array.prototype 原型链

const methodsToPatch = ['push', 'pop', 'shift', 'unShift', 'splice', 'sore', 'reverse']; // 变异方法
for (let method of methodsToPatch) {
    const original = Array.prototype[method]; // 缓存Array.prototype[method] fn
    Object.defineProperty(arrayMethods, method, {
        value: mutator,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch(method) {
        case 'push':
        case 'unShift':
            inserted = args;
            break;
        case 'splice':
            inserted = args.slice(2); // splice(start, deleteCount, item1, item2) item1, item2要添加进数组中的元素 inserted = [item1, item2]
            break;
    }
    if (inserted) {
        ob.observeArray(inserted);
    }
    ob.dep.notify();
    return result;
}

class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        Object.defineProperty(value, '__ob__', {
            value: this,
            //...
        });
        // 只关注array
        if (Array.isArray(value)) {
            // 1.修改value的__proto__指向
            value.__proto__ = arrayMethods; // value.__proto__ = arrayMethods；arrayMethods.__proto = Array.prototype 原型链
            // 2 遍历数组，对每一项执行observe(item);
            this.observeArray(value);
        }
    }

    observeArray(items: Array<any>) {
        for (let item of items) {
            observe(item);
        }
    }
}

function defineReactive() {
    get: () => {
        if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
                dependArray(value); // important 让value中的每一项内部的__ob__都搜集依赖
            }
        }
    }
}

function dependArray(values) {
    for (let value of values) {
        if (value.__ob__) {
            value.__ob__.dep.depend(); // { name: 'ren', __ob__: ob3} ob3.subs = [watcher1] { name: 'liu', __ob__: ob4} ob4.subs = [watcher1]
            if (Array.isArray(value)) {
                dependArray(value); // 递归调用
            }
        }
    }
}

// An Example
<template>
    <ul>
        <li v-for="item in userList">{{ item.name }}</li>
    </ul>
</template>
const data = {
    userList: [
        { name: 'ren' },
        { name: 'liu' }
    ];
}
// initData
data = {
    userList: [
        {
            name: 'ren',
            __ob__: ob3,
            get name: reactiveGetter, // closureDep2
            set name: reactiveSetter // closureDep2
        },
        {
            name: 'liu',
            __ob__: ob4,
            get name: reactiveGetter, // closureDep3
            set name: reactiveSetter // closureDep3
        },
        length: 2,
        __ob__: ob2,
        __proto__: arrayMethods // arrayMethods.__proto__ = Array.prototype
    ],
    __ob__: ob1,
    userList get: reactiveGetter, // closureDep1
    userList set: reactiveSetter // closureDep1
}
defineReactive(data, 'userList');
    childOb = !shallow && observe(data.userList);
        observe([{ name: 'ren'}, { name: 'liu'}]);
            new Observer([{name: 'ren'}, {name: 'liu'}]);
                // 修改value的__proto__
                // 遍历value，observe(item)

// get collect as dependency
// suppose watcher1(view render watcher)
// get data.userList data.userList[0].name data.userList[1].name
// 1 data.userList get
closureDep1.subs = [watcher1]
// childOb = ob2 = observe([{ name: 'ren'}, { name: 'liu'}]);
// if(childOb) {
//     childOb.dep.depend(); // ob2.dep.subs = [watcher1]
//     if (Array.isArray([{ name: 'ren'}, { name: 'liu'}])) {
//         dependArray([{ name: 'ren'}, { name: 'liu'}]); // important
//     }
// }
ob2.dep.subs = [watcher1]
// value = [{ name: 'ren'}, { name: 'liu'}] dependArray(value); so:
ob3.dep.subs = [watcher1]
ob4.dep.sub3 = [watcher1]
// 2 data.userList[0].name
closureDep2.subs = [watcher1]
// 3 data.userList[1].name
closureDep3.subs = [watcher1]

// set
// case1 data.userList = xxx setter
closureDep1.notify();

// case2 data.userList.push({ name: 'sam'}) 其余方法同理
data.userList.push -> arrayMethods.push ->
    Array.prototype.push.apply(data.userList, args);
    const ob = data.userList.__ob__; // ob2
    ob.observeArray(inserted) // 新插入的{name: sam}做响应式处理
    ob.dep.notify(); // watcher1.update

// case3 data.userList[0].name = 'renyujuan'
closureDep2.notify();

// case4 Vue.set(data.userList[0], 'age', 18) 删除属性同理
const ob = target.__ob__; // target 已经被观察过 ob3
defineReactive(ob.value, key, val);
ob.dep.notify();
```
**上述例子包含对基于数组的所有的改动，都可以正常的触发依赖的更新**

#### 闭包dep 与 ob.dep

```javascript
// ob.dep
function observe(value, asRootData) {
    if (!isObject(value)) { return; } // value !== null && typeof value === 'object' 才是需要观察的
    // 若已经被观察过，则直接返回ob对象
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if () { // 一些判断逻辑
        ob = new Observer(value);
    }
    return ob;
}

class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        // value.__ob__ = this; value.__ob__.dep 就是对象属性中的dep
        Object.defineProperty(value, '__ob__', {
            value: val,
            enumerable: true,
            writable: true,
            configurable: true
        });
        if (Array.isArray(value)) { // array
            // ...
        } else { // object
            this.walk(value);
        }
    }

    // This method should only be called when value type is Object
    walk(obj) {
        const keys = Object.keys(obj);
        for (let key of keys) {
            defineReactive(obj, key); // 将obj中的每一个属性都定义成响应式的
        }
    }
}

// define a reactive property on an object
function defineReactive(obj, key, val, customSetter, shallow) {
    const dep = new Dep(); // 闭包dep important！！！
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }
    // ...
    const childOb = !shallow && observe(obj[key]); // 递归调用，为obj[key]对应的值创建Observer instance。
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            // collect as dependency
            if (Dep.target) {
                dep.depend(); // 闭包dep
                if (childOb) {
                    childOb.dep.depend(); // ob.dep
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter() {

        }
    });
}

function set(target, key, val) {
    // ...
    const ob = target.__ob__; // target 已经被观察过
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}

// An example
const data = {
    user: {
        name: 'ren'
    }
}
// initData 之后
data: {
    user: {
        name: 'ren',
        __ob__: ob2,
        get name: reactiveGetter closureDep2
        set name: reactiveSetter closureDep2
    }
    __ob__: ob1
    get user: reactiveGetter closureDep1
    set user: reactiveSetter closureDep1
}

// step1
// childOb = user.__ob__
// data.user trigger get user,  closureDep1.depend()<suppose watcher1> closureDep1.subs = [watcher1]
// childOb exist so user.__ob__(ob2).dep.depend() ob2.dep.sub = [watcher1]
defineReactive(data, user);

// suppose step2-1
data.user = { name: 'liu' }; // setter trigger; closureDep1.notify() -> watcher1.update

// suppose step2-2 data.user add reactive property
// ob = data.user.__ob__ = ob2
// defineReactive({ name: 'ren'}, 'age', 18);
// ob2.dep.notify() watcher1.update;
Vue.set(data.user, 'age', 18);

// suppose step2-3 del property similar to add property
```

**总结**

closureDep 针对值本身的获取或重新赋值
ob.dep 针对值增删属性；数组的操作（之后再看）