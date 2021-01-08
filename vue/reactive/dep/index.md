# dep & watcher

依赖收集 & 派发更新

## dep

依赖收集：`dep.depend()`
派发更新：`dep.notify()`

```javascript
class Dep {
    static target: ?Watcher
    constructor() {
        this.id = uid++; // uid = 0 自增
        this.subs: Array<Watcher> = []; // 存放watcher
    }

    addSub(sub: Watcher) {
        this.subs.push(sub);
    }

    removeSub(sub: Watcher) {
        remove(this.subs, sub);
    }

    // collect as dependency
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    notify() {
        const subs = this.subs.slice();
        for (let sub of subs) {
            sub.update();
        }
    }
}
// This is globally unique
Dep.target = null;
const targetStack = [];
function pushTarget(target: ?Watcher) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    dep.target = targetStack[targetStack.length - 1];
}
```

## Watcher

```javascript
class Watcher {
    vm: Component;
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean; // user watcher
    lazy: boolean; // computed watcher
    sync: boolean;
    dirty: boolean; // computed watcher need update
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: SimpleSet;
    newDepIds: SimpleSet;
    before: ?Function;
    getter: Function;
    value: any;

    constructor(
        vm: Component,
        expOrFn: string | Function
        cb: Function,
        options?: ?Object,
        isRenderWatcher?: boolean
    ) {
        this.vm = vm;
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        // ? maybe user watcher cb(val, oldValue)
        this.cb = cb;
        this.id = uid++;
        // ?
        this.active = true;
        this.dirty = this.lazy;
        // dep
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        // ?
        this.expression = '';
        // this.getter eg: renderWatcher this.getter = () => { vm._update(vm._render()) };
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
            }
        }
        this.value = this.lazy ? undefined : this.get();
    };

    get() {
        pushTarget(this); // Dep.target = this;
        let value;
        const vm = this.vm;
        try {
            value = this.getter.call(vm, vm); // eg: renderWatcher vm_update(vm._render()) vnode -> patch -> real DOM
        } catch() {

        } finally() {
            if (this.deep) {
                traverse(value);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }

    addDep(dep: Dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length;
        while(i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        // depIds = newDepIds deps = newDeps
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.depIds;
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    // dep.notify() -> subs[i].update()
    // Will be called when a dependency changes
    update() {
        if (this.lazy) { // computed watcher
            this.dirty = true;
        } else if (this.sync) {
            this.run();
        } else {
            queueWatcher(this);
        }
    }

    run() {
        if (this.active) {
            const value = this.get();
            if (
                value !== this.value ||
                isObject(value) ||
                this.deep
            ) {
                const oldValue = this.value;
                this.value = value;
                if (this.user) {
                    this.cb.call(this.vm, value, oldValue); // user watcher cb
                } else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }

    // this only gets called for lazy watchers
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }

    // Depend on all deps collected by this watcher.
    // ???
    depend() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend();
        }
    }

    teardown() {}
}
```

### 关于依赖的收集与清除

涉及的操作：
- addDep(dep)
- cleanupDep()

涉及的属性：
- deps
- depIds
- newDeps 暂时性的变量
- newDepIds 暂时性变量

**An example**

通过切换`flag`的值，显示不同的视图

```javascript
<template>
  <div>
    <div v-if="flag">{{ msg1 }}</div>
    <div v-else>{{ msg2 }}</div>
    <button
      @click="aaa"
    >switch</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      flag: true,
      msg1: 'on',
      msg2: 'off'
    }
  },
  methods: {
    aaa () {
      this.flag = !this.flag
      console.log('vm', this)
    }
  }
}
</script>

// process analysis
// observe data
data = {
    flag: true,
    msg1: 'on',
    msg2: 'off',
    __ob__: ob1
    flag get: reactiveGetter // closureDep6
    flag set: reactiveSetter // closureDep6
    msg1 get: reactiveGetter // closureDep7
    msg1 set: reactiveSetter // closureDep7
    msg2 get: reactiveGetter // closureDep8
    msg2 set: reactiveSetter // closureDep8
}
// initial flag = true vmApp._watcher = watcher2(renderWatcher)
// watcher2
cDep6.subs = [watcher2]
cDep7.subs = [watcher2]
cDep8.subs = []
deps = [cDep6, cDep7];
depIds:Set = { 6, 7}
newDeps = []
newDepIds:Set = {}
// switch flag false cDep6.notify -> watcher2.getter() -> Dep.target = watcher2; vmApp._update(vmApp._render());
// 3-1 get flag
cDep6.depend();
    Dep.target.addDep(cDep6) = watcher2.addDep(cDep6);
function addDep(cDep6) {
    if (!this.newDepIds.has(cDep6.id)) {
        this.newDepIds.add(cDep6.id); // {6}
        this.newDeps = [cDep6]; // 本次依赖的dep list [cDep6]
        if (!this.depIds.has(cDep6.id)) { // 上一次依赖cDep6, 因此条件判断不成立；证明cDep6.subs中已经添加的watcher2，无需重复添加。
            cDep6.addSub(this);
        }
    }
}
// 3-2 get msg2
cDep8.depend();
    Dep.target.addDep(cDep8) = watcher2.addDep(cDep8);
function addDep(cDep8) {
    if (!this.newDepIds.has(cDep8.id)) {
        this.newDepIds.add(cDep8.id); // {6, 8}
        this.newDeps = [cDep6]; // 本次依赖的dep list [cDep6, cDep8]
        if (!this.depIds.has(cDep6.id)) { // 上一次没依赖cDep8, 因此条件判断成立
            cDep6.addSub(this); // cDep8.subs = [watcher2] collect as dependency
        }
    }
}
// 此时
deps = [ cDep6, cDep7]; depIds = { 6, 7}
newDeps = [cDep6, cDep8]; newDepIds = { 6, 8}
// vmApp._update(vnode) done popTarget call cleanupDeps
watcher2.cleanupDeps() {
    // 遍历deps，找出存在于deps中，但不存在与newDeps中的dep<不再是本次watcher2的依赖>；执行dep.removeSub(this); cDep7.subs = []
    // 交换newDeps & deps  newDepIds & depIds；清空newDeps newDepIds
}
// finally
deps = [cDep6, cDep8]; depsIds = { 6, 8 }
newDeps = []; newDepIds = {}
```

**有两个需要关注一下**

1、添加依赖时， 如果watcher已经存在于当前依赖的subs中，则不重复添加
2、不再需要的依赖，需要将watcher从其对应的subs列表中移除，避免不必要的update
3、newDeps newDepIds记录本次的依赖；deps、depIdS记录上一次的依赖；有了这两类变量，1、2才能顺利执行
4、newDeps newDepIds只存在于派发更新的过程中。

### 派发更新

#### renderWatcher

```javascript
// $mount() -> mountComponent()
function mountComponent(vm, el: ?Element, hydrating?: boolean) {
    // ...
    const updateComponent = () => {
        vm._update(vm._render());
    }
    const before = () => {
        if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
        }
    }
    const options = { before }
    const rw = new Watcher(vm, updateComponent, noop, options, true);
    // rw = {
    //     vm: vm,
    //     getter: updateComponent,
    //     cb: noop,
    //     before: before,
    //     deep: false,
    //     user: false,
    //     lazy: false,
    //     sync: false,
    //     dirty: false
    // }
}

// suppose dep.notify() -> rw.update() -> queueWatcher(rw) 推入异步队列 依次执行watcher.run() 完成更新；callUpdatedHooks
// observer/scheduler.js
const queue: Array<Watcher> = []
const activatedChildren = []
const has = {}; // eg: {1: true}
let flushing = false;
let index = 0;
let waiting = false;
// push a watcher into the watcher queue
function queueWatcher(watcher: Watcher) {
    const id = watcher.id;
    if (has[id] === null) {
        has[id] === true;
        //
        if (!flushing) {
            queue.push(watcher);
        } else {
            // if already flushing, splice the watcher based on its id;
            // if already pass its id, it will be run next immediately
            let i = queue.length - 1;
            while( i > index && queue[i].id > watcher.id ) { i-- } // 寻找插入点 [0,1,2,3,4,5,6,8,9,10] i = 10 index = 4; finally i = 6
            queue.splice(i + 1, 0, watcher); // insert watcher in right position
        }
        // queue the flush
        if (!waiting) {
            waiting = true;
            nextTick(flushScheduleQueue);
        }
    }
}
function flushScheduleQueue() {
    flushing = true;
    let watcher, id;
    // sort queue before flush
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id);

    // queue.length is dynamic  all watcher update
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before()
        }
        id = watcher.id
        has[id] = null
        watcher.run(); // important
    }

    const activatedQueue = activatedChildren.slice(); // keep-alive ???
    const updatedQueue = queue.slice()

    resetSchedulerState()

    callActivatedHooks(activatedQueue)
    callUpdatedHooks(updatedQueue)


}
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = null;
    waiting = flushing = false;
}
```

#### ComputedWatcher

```javascript
// computed use
// computed: {
//     key1: Function,
//     key2: {
//         get() {},
//         set() {}
//     }
// }
const computedWatcherOptions = { lazy: true };
function initComputed(vm: Component, computed: Object) {
    const watchers = vm._computedWatchers = Object.create(null);
    for (let key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions // lazy: true
            )
            // watcher[key]: {
            //     getter,
            //     deep: false,
            //     user: false,
            //     sync: false,
            //     lazy: true,
            //     dirty: true
            //     value: undefined // important lazy = true
            // }
        }

        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        }
    }
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
// vm key descriptor
function defineComputed(
    target: any,
    key: string,
    userDef: Object | Function
) {
    const shouldCache = !isServerRending();
    // 构造descriptor.get & set
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? shouldCache && userDef.cache !== false // userDef.cache ???
                ? createComputedGetter(key)
                : createGetterInvoker(userDef.get);
        sharedPropertyDefinition.set = userDef.set || noop;
    }
    // Object.defineProperty(target, key, descriptor)
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]; // computed watcher
        if (watcher) {
            // initial computedWatcher.dirty = true; 之后：vm[key] -> get trigger -> watcher.evaluate
            if (watcher.dirty) {
                watcher.evaluate(); // watcher.value = watcher.get() -> watcher.getter(); watcher.dirty = false;
            }
            // ??? computedWatcher.deps -> deps[i].subs = [computedWatcher, renderWatcher] ? 将renderWatcher也加入到computedWatcher dep 的subs中？
            // dep.notify() -> computedWatcher重新求值；renderWatcher重新渲染
            // renderWatcher -> ComputedC
            // computedWatcher -> propA
            // 为了让propA change；computedWatcher & renderWatcher都可以触发更新。
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value;
        }
    }
    return computedGetter;
}
```

**An Example**

```javascript
<template>
  <div>
    {{ fullName }}
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      firstName: 'ren',
      lastName: 'yujuan'
    }
  },
  computed: {
    fullName () {
      return `${this.firstName}-${this.lastName}`
    }
  },
  mounted () {
    console.log('vm', this)
  }
}
</script>
```

```javascript
// step1. initData() -> observe(data)
data: {
    firstName: 'ren',
    lastName: 'yujuan'
    __ob__: ob1,
    firstName get: reactiveGetter, // closureDep6 cDep6
    firstName set: reactiveSetter, // closureDep6
    lastName get: reactiveGetter, // closureDep7 cDep7
    lastName set: reactiveSetter // closureDep7
}
// step2 initComputed()
vm._computedWatchers = {
    fullName: fullNameComputedWatcher // initial lazy = dirty = true; value = undefined
}
Object.defineProperty(vmApp, 'fullName', {
    enumerable: true,
    configurable: true,
    get: computedGetter,
    set: noop
});
// Dep.target = renderWatcher vmApp._update(vmApp._render()); vmApp.fullName -> trigger fullName get<computedGetter>
function computedGetter() {
    const watcher = fullNameComputedWatcher;
    if (watcher) {
        if (watcher.dirty) {
            // 1、value = fullNameComputedWatcher.get(); Dep.target = fullNameComputedWatcher fullNameComputedWatcher.getter() Dep.target = renderWatcher;
                // getter execute; firstName get trigger lastName get trigger cDep6.subs = [fullNameComputedWatcher] cDep7.subs = [fullNameComputedWatcher]
                // fullNameComputedWatcher.deps = [cDep6, cDep7]
            // 2、watcher.dirty = false;
            watcher.evaluate(); // watcher.value = 'ren-yujuan'
        }
        // Dep.target = renderWatcher
        if (Dep.target) {
            // fullNameComputedWatcher.depend()
            // 遍历deps = [cDep6, cDep7] 执行deps[i].depend();
            // eg: cDep6.depend() -> renderWatcher.addDep(cDep6) -> renderWatcher.deps = [cDep6] cDep6.subs = [fullNameComputedWatcher, renderWatcher]
            // cDep7 同理； finally renderWatcher.deps = [cDep6, cDep7] cDep6.subs = cDep7.subs = [fullNameComputedWatcher, renderWatcher]
            // 这样做是为了firstName or lastName setter trigger -> dep.notify()时，可以出发computedWatcher and renderWatcher的更新。
            watcher.depend();
        }
        return watcher.value;
    }
}

// update case1 firstName or lastName 都不更新，则fullNameComputedWatcher.dirty = false; 视图更新时，fullNameComputedWatcher不会触发重新求值。

// update case2 firstName or lastName 更新。
fullNameComputedWatcher.update() -> fullNameComputedWatcher.dirty = true;
renderWatcher.update() -> fullName get trigger -> fullNameComputedWatcher.evaluate();

```

**总结**

- 计算属性的watcher中，lazy = true; 初始化时dirty也为true；
- get 触发，根据dirty决定是使用缓存的value，还是重新求值；假如，dirty为true，则重新求值，dirty置为false；dirty为false，则直接返回value
- 只有computedWatcher的相关依赖变化，dirty才会重新置为true，以便下次get可以重新求值。
- 如果有renderWatcher，则也需要将其加入到相关依赖的subs中。以便依赖更新，视图也可以重新绘制。

#### user watcher

使用方式

```javascript
data = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
}
watch = {
    a: function(val, oldVal) {},
    b: 'methodName',
    c: {
        handle: function(val, oldVal) {},
        deep: true
    },
    d: {
        handle: function(val, oldVal) {},
        immediate: true
    },
    e: [
        'handler1',
        function(val, oldVal) {},
        {
            handler: function(val, oldVal) {}
        }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function(val, oldVal) {}
}
```

```javascript
initWatch(vm: Component, watch: Object) {
    for (const key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            for (let item of handler) {
                createWatcher(vm, key, item);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher(
    vm: Component,
    expOrFn: string | Function, // function ?
    handler: any,
    options?: Object
) {
    // handler
    if (isPlainObject(handler)) { // { handler: fn, deep: true}
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}

Vue.prototype.$watch = function(
    expOrFn: string | Function,
    cb: Object | Function,
    options?: Object // deep or immediate
): Function {
    const vm: Component = this;
    // user watcher 不会走到这一步。直接调用$watch() maybe
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true; // flag user watcher
    const watcher = new Watcher(vm, expOrFn, cb, options);
        // expOrFn maybe string<watch key>
        // if (typeof expOrFn === 'function') { this.getter = expOrFn }
        // else { this.getter = parsePath(expOrFn) };
            // this.getter = function(obj) {
            //     // segments is closure variable
            //     for (let segment of segments) {
            //         if (!obj) { return }
            //         obj = obj[segment];
            //     }
            //     return obj;
            // }
        // this.get() -> this.getter(vm) // expOrFn = 'e.f' segments = [e, f]  this.getter(vm) return vm.e.f = { g: 5 }; watcher.value = { g: 5}
    // immediate = true cb 会立即调用依次
    if (options.immediate) {
        cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown()
    }
}

// a or e.f
function parsePath(path: string) {
    const segments = path.split('.');
    const fn = function(obj) {
        for (let segment of segments) {
            if (!obj) { return }
            obj = obj[segment];
        }
        return obj;
    }
    return fn;
}

// 着重分析一下$watch中的expOrFn and new Watcher()
$watch(
    expOrFn: string | Function, // options.watch call $watch 时，expOrFn 均为 string 类型 eg: a or a.b.c; 直接调用$watch时可能是function类型
    cb: Object | Function, // options.watch call $watch 时, cb 为 function； 直接调用$watch时可能为Object类型
    options?: Object
) {
    // 先只分析options.watch的情况
    const watcher = new Watcher(vm, expOrFn, cb, options);
        // new Watcher() process
        // expOrFn 为 string 类型
        // parsePath 内部保存了一个闭包变量 segments，并返回一个fn 赋值给this.getter.
        // segments = expOrFn.split('.') // segments是一个保存了对象属性层级的数组 a.b.c = [a, b, c]
        this.getter = parsePath(expOrFn);
        this.value = this.get();
            // 这个getter中可以访问闭包变量segments，最后会返回vm.a.b.c this.value = vm.a.b.c
            // 这个过程也会触发相应prop的get，将userWatcher搜集到对应的依赖列表中。
            this.getter.call(vm, vm);
}

// 着重分析一下options.deep = true的情况
a = {
    b: {
        c: {
            name: 'aaa'
        }
    }
}
'a': {
    handler: function() {},
    deep: true // handler会在任何被侦听的对象的property改变时，被调用。无论嵌套的有多深
}

watcher.get = function() {
    pushTarget(this);
    const value = this.getter.call(vm, vm);
    if (this.deep) {
        traverse(value);
    }
    popTarget();
    cleanupDeps();
    return value
}

// observer -> traverse.js
const seenObjects = new Set();
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
}

// value = {
//     b: {
//         c: {
//             name: 'aaa'
//         }
//     }
// }
// seen = Set(0) {}
// seen store depId
// val.__ob__.dep and all property closureDep 都保存了userWatcher
// property closureDep 在 property get 时会触发依赖收集，此时dep.target为userWatcher
// val.__ob__.dep什么时候搜集的依赖？
// suppose value = { c: { name: 'aaa' }}
// value.c -> c get trigger -> get中闭包dep.depend; childOb = c.__ob__; childOb.dep.depend()
// 就是在获取当前属性的时候，闭包dep会collect dependency; 如果value是Object、Array时，对应的childOb也会collect dependency
function _traverse(val, seen) {
    let i, keys;
    if (val.__ob__) {
        const depId = val.__ob__.dep.id
        if (seen.has(depId)) {
            return
        }
        seen.add(depId)
    }
    if (Array.isArray(val)) {
        i = val.length;
        while (i--) _traverse(val[i], seen)
    } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) _traverse(val[keys[i]], seen) // val[keys[i]] get trigger Dep.target = userWatcher so dep.subs = [userWatcher]
    }
}

// 当传入的是一个数组，包含多个handler；会生成多个userWatcher
watch = {
    user: [
        function(val) { console.log(val) },
        function(val) { console.log(val) }
    ]
}
vm._watchers = [
    0: userWatcher,
    1: userWatcher,
    2: renderWatcher
]
```


