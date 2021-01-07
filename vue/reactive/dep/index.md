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
        // ?
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

    // ?
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

    update() {}

    run() {}

    evaluate() {}

    depend() {}

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

