# init

```javascript
Vue.prototype._init = function(options?: Object) {
    const vm = this;
    vm._uid = uid++;
    vm._isVue = true;

    // step1 合并配置
    // 实例化子组件 调用子构造函数
    // patch -> createElm -> createComponent -> init -> initComponentInstanceForVnode
    // options = { _isComponent: true, _parentVnode: placeHolderVnode, parent: activeInstance }
    if (options && options._isComponent) {
        initInternalComponent(vm, options);
    }
    // new Vue(options)
    else {
        // different key has different merge strategy
        // eg. 相同的生命周期的钩子函数，最后会合并成一个数组
        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor), // eg: Vue.options point1
            options || {},
            vm
        )
    }

    vm._renderProxy = vm;
    vm._self = vm;

    // kinds of init
    initLifeCycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook('beforeCreate');
    initInjections();
    initState();
    initProvide();
    callHook(vm, 'created');

    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
}
```

## component merge options

```javascript
// Vue.extend(extendOptions)
// ...
Sub.options = mergeOptions(Vue.options, extendOptions);
// ...
return Sub;
// new Sub(options)
new Sub({
    _isComponent: true,
    parent: activeInstance,
    _parentVnode: vnode
});

function initInternalComponent(vm, options) {
    // options = { _isComponent: true, parent: parentVm, _parentVnode: placeHolderVnode }
    const opts = vm.$options = Object.create(vm.constructor.options); // vm.$options.__proto__ = Sub.options
    const parentVnode = options._parentVnode; // placeHolderVnode
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    const vnodeComponentOptions = vnode.componentOptions; // { Ctor, data, context, children, tag }
    opts.propsData = vnodeComponentOptions.propsData
    opts._parentListeners = vnodeComponentOptions.listeners
    opts._renderChildren = vnodeComponentOptions.children
    opts._componentTag = vnodeComponentOptions.tag

    if (options.render) {
        opts.render = options.render
        opts.staticRenderFns = options.staticRenderFns
    }
}
```

## Vue.options

```javascript
// initGlobalAPI(Vue)
for(let key of ['component', 'directive', 'filter']) {
    Vue.options[key + 's'] = {};
}
Vue.options._base = Vue;
extend(Vue.options.component, builtInComponents); // Vue.options.components = { KeepAlive: {}} // 内置组件 全局

// web/runtime/index
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives) // platformDirectives = { model, show } Vue.options.directives = { model: {}, show: {}}
extend(Vue.options.components, platformComponents) // platformDirectives = { Transition, TransitionGroup } Vue.options.components = { KeepAlive, Transition, TransitionGroup }

// finally Vue.options
Vue.options = {
    // global components
    components: {
        KeepAlive: { name: 'keep-alive', ...},
        Transition: {},
        transitionGroup: {}
    },
    directives: {
        model: {},
        show: {}
    },
    filters: {},
    _base: Vue
}
```

## mergeOptions

```javascript
// extend
function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to;
}
function mergeOptions(child, parent, vm) {
    // some logic
    const options = {};
    let key;
    for (key in parent) {
        mergeFiled(key);
    }
    for(key in child) {
        if (!Object.hasOwnProperty(parent, key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        // 不同类型的key，合并策略不同；
        // 采用策略模式，根据key，选择对应的合并策略
        const strategy = strategies[key] || defaultStrategy; // POINT
        options[key] = strategy(parent[key], child[key], vm, key)
    }
    return options;
}

// merge method
const strategies = {
    data: mergeDataPrev,
    // LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'beforeMounted', 'beforeUpdate', 'beforeUpdated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated']
    beforeCreate: mergeHooks,
    //...
    // ASSET_TYPES
    components: mergeAssets,
    directives: mergeAssets,
    filters: mergeAssets,
    watch: mergeWatch,
    props: mergeCommon,
    methods: mergeCommon,
    computed: mergeCommon,
    inject: mergeCommon
}
const defaultStrategy = function() {}

// components/directives/filters
function mergeAssets(
    parentVal: ?Object,
    childVal: ?Object,
    vm,
    key
) {
    const res = Object.create(parentVal || null);
    if (childVal) {
        return extend(res, childVal); // key in childVal res[key] = childVal[key]
    } else {
        return res;
    }
}
// hooks merged as Array
function mergeHooks(
    parentVal: ?Array<Function>,
    childVal: ?Function | ?Array<Function>
): ?Array<Function> {
    const res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : Array.isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res; // dedupeHooks ??
}
// other merge strategy
```



## kinds of init

### initLifeCycle

- relationship of parent and children
- init some props(eg: _watcher)

```javascript
function initLifeCycle(vm) {
    const options = vm.$options;
    if (options.parent && !options.parent.abstract) { // TODO parent.abstract ? keep-alive transition transition-group abstract: true
        parent.$children.push(vm);
    }
    vm.$parent = options.parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null; // save vm render watcher
    vm._inactive = null; // ?
    vm._directInactive = false; // ?
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
```

### initEvents

```javascript
function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false
    // init parent attached events
    const listeners = vm.$options._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}
```