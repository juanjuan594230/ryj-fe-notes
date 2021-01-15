# props

**demo**
```javascript
// HelloWorld Component .vue file
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
      console.log('hello mounted');
  }
}

// App Component .vue file
<template>
  <div id="app">
    <div>{{ msg }}</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
      return {
          msg: 'msgApp'
      }
  }
}

// main.js
import Vue from 'vue';
import App from './App.vue';

new Vue({
    render: h => h(App)
}).$mount('#app');
```

**props login analysis**

```javascript
// vnodeAppPH App Component的占位vnode
vnodeAppPH.componentOptions._Ctor.render = function() {
  var _vm = this; // vmApp
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h // vmApp._c = (a,b,c,d) => createElement(child, a, b, c, d, false)
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c("div", [_vm._v(_vm._s(_vm.msg))]),
      _c("HelloWorld", { attrs: { msg: "Welcome to Your Vue.js App" } }) // vnodeHelloWorldPH
    ],
    1
  )
}

// vmApp.$mount(undefined) -> vmApp._render() -> vmApp.$options.render.call(vmApp)
// 其中_c("HelloWorld", { attrs: { msg: "Welcome to Your Vue.js App" } })
createElement(vmApp, 'HelloWorld', { attrs: { msg: 'Welcome to Your Vue.js App'}}, undefined, undefined, false);
    _createElement(vmApp, 'HelloWorld', { attrs: { msg: 'Welcome to Your Vue.js App'}}, undefined, undefined, 1 );
        vnode = createComponent(
            vmApp.$options.components.HelloWorld,
            { attrs: { msg: 'Welcome to Your Vue.js App'}},
            vmApp,
            undefined,
            'HelloWorld'
        );
        return vnode; // vnodeHelloWorldPH

// createComponent(Ctor, data, context, children, tag)
Ctor = vmApp.$options.components.HelloWorld // Vue 单文件组件编译之后的Object，已经包含了render fn
data: { attrs: { msg: 'Welcome to Your Vue.js App' }}
vmApp,
undefined,
'HelloWorld'

if (isObject(Ctor)) {
    Ctor = Vue.extend(Ctor);
}

const propsData = extractPropsFromVNodeData(data, Ctor, tag)

// ...
return vnodeHelloWorldPH; // vnodeHelloWorldPH.componentOptions.propsData = propsData

// Vue.extend(extendOptions) 有一段关于props的逻辑
    if (Sub.options.props) {
        initProps(Sub); // get (组件实例中访问props[key])Sub.prototype.key -> Sub.prototype._props.key ???
    }

    function initProps (Comp) {
    const props = Comp.options.props
    for (const key in props) {
        proxy(Comp.prototype, `_props`, key)
    }
    }

    function proxy (target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
    }
// Vue.extend over
```

**HelloWorld Component instance**

## 换个方式

```javascript
// parent
const App = {
    name: 'App',
    template: `<div><HelloWorld :msg="msg" /></div>`
    data() {
        return {
            msg: 'MY APP'
        }
    }
}
// child
const HelloWorld = {
    name: 'HelloWorld',
    template: `<div>{{msg}}</div>`,
    props: {
        msg: {
            required: true,
            type: string
        }
    }
}

// vmApp.render fn
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "app" } },
    [_c("HelloWorld", { attrs: { msg: _vm.msg } })],
    1
  )
}

// call render fn
render.call(vmApp, vmApp.$createElement); // _vm = vmApp

// 1 vnodeHelloWorldPH _c
const vnodeHelloWorld = _c("HelloWorld", { attrs: { msg: vmApp.msg } });
    createElement(vmApp, 'helloWorld', { attrs: {msg: vmApp.msg}}, undefined, undefined, false)
        _createElement(vmApp, 'helloWorld', { attrs: {msg: vmApp.msg}}, undefined, undefined, 1)
            // tag is string && Ctor = find component definition from vmApp.$options.components by tag('HelloWorld')
            vnode = createComponent(Ctor, { attrs: {msg: vmApp.msg}}, vmApp, undefined, 'HelloWorld');
            return vnode;


// 1.1 vnode = createComponent(Ctor, { attrs: {msg: vmApp.msg}}, vmApp, undefined, 'HelloWorld');
createComponent(Ctor, { attrs: {msg: vmApp.msg}}, vmApp, undefined, 'HelloWorld')
    // 1. proxy Sub.prototype.key to this._props.key 即：this.key -> this._props.key
    // 这样所有的实例中访问 this.key -> Sub.prototype.key -> this._props.key 不需要在每一次组件实例化的时候，都调用object.defineProperty()
    // 2. Sub.options = mergeOptions(Vue.options, extendOptions) 合并时将props做了格式化，统一格式化为对象形式。
    // 3. return Sub;
    Ctor = Vue.extend(Ctor);

    // extract props
    // keys Object.keys(Ctor.options.props)
    // loop keys -> find value from data.props/attrs by key
    // add key value to res
    // return res
    const propsData = extractPropsFromVNodeData(data, Ctor, tag);
    const vnode = new VNode(); // vnode.componentOptions = { Ctor, propsData, listeners, tag, children }
    return vnode;
```

VNodeAPP 接下来会走入patch的过程，`createElement(vnodeHelloWorldPH)` 进入创建HelloWorld组件实例的过程

```javascript
const vmHelloWorld = vnodeHelloWorld.componentInstance = new VnodeHelloWorldPH.componentOptions.Ctor({
    _isComponent: true,
    parent: activeInstance, // vmApp
    _parentVnode: vnodeHelloWorldPH
});

// 1 _init
_init(options);
    // 1.1 组件 合并 options 只涉及props相关的
    this.$options = Object.create(this.constructor.options); // this.$options 的原型链上层为Sub.options
    this.$options.propsData = this.options._parentVnode.componentOptions.propsData; // vnodeHelloWorldPH.componentOptions.propsData

    // 1.2 initState -> initProps
    initState(this); // this = vmHelloWorld

// 1.2 initState
initState(vmHelloWorld);
    vmHelloWorld.$options.props && initProps(vmHelloWorld, propsOptions);

// initProps ***
initProps(vmHelloWorld, propsOptions)

function initProps(vm, propsOptions) {
    const propsData = vm.$options.propsData || {};
    const props = vm._props = {}; // vm._props define
    const keys = vm.$options._propKeys = []; // cache prop keys
    const isRoot = !vm.$parent; // 难道props还会定义在root Vue instance中?
    // TODO!!!
    if (!isRoot) {
        toggleObserving(false);
    }
    // important!!! loop propsOptions key
    for (const key in propsOptions) {
        keys.push(key);
        // 1. validate and return value
        const value = validateProp(key, propsOptions, propsData, vm);
        // 2. defineReactive
        // ATTENTION: defineReactive 传递了value
        // 子组件的renderWatcher or other watcher加入到了父组件中props.key对应的value的闭包dep中。父组件value setter，子组件watcher可以得到通知
        // 如果value不是一个简单类型，则会对其进行深度观察（包含了value本身属性的增删、以及属性对应的值得改变等）
        // vm._props.key = xxx
        defineReactive(props, key, value);
        // 3. proxy
        // vm.key -> vm._props.key
        // 非根组件 proxy 发生在 vue.extend(extendOptions)中 proxy(vm.constructor.prototype, '_props', key);
        // vm.key -> vm.__ptoto__.key -> vm._props.key
        !key in vm && proxy(vm, '_props', key);
    }
    toggleObserving(true);
}
```

### 附加逻辑整理

下面是在上述分析过程中，涉及到的一些方法。单独在这里摘出来做梳理。

#### validateProp

- boolean type
- default value
- asset prop

#### defineReactive

关于this.props.key 对应的value中属性的改变及增删，会触发父组件的setter、进而通知依赖更新；

子组件中，如果访问了value.a，那么就会将子组件的renderWatcher加入到对应的闭包dep的依赖中；这样父组件中改变value.a的值时，通知依赖的时候，可以通知到子组件

```javascript
// 对props.key对应的value做了响应式处理。将当前使用props.key 的组件的renderWatcher加入到了dep中。
// 当父组件的value内属性发生改变时，可以通知到子组件的watcher进行派发更新。
defineReactive(props = {}, key = 'msg', value = 'MY APP')
    const dep = new Dep(); // closureDep
    // 加入value是一个Object/Array 此时已经是被观察过的了，直接返回了ob，如果访问value中的某些属性，则会将子组件的renderWatcher搜集到对应的依赖列表中。
    let childOb = !shallow && observe(value); // undefined
    Object.defineProperty(props, 'msg', {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(props) : value;
            if (Dep.target) {
                dep.depend(); // collect as a dep
            }
        },
        set: function reactiveSetter(newVal) {
            // ...
            dep.notify();
        }
    })
```

#### vmParent.key = XXX vmChild._props.key 重新赋值

**但是父组件this.key改变时，也就是子组件中this._props.key的值发生变化，是如何触发依赖更新的呢？**

依旧是上面的APP & HelloWorld的例子；假如设置一个定时器，mounted之后1S后，将vmApp.msg = 'AAA';

```javascript
// vmApp.msg = 'AAA' setter 触发  vmApp._watcher.update() queueWatcher(vmApp._watcher);
// vmApp._update(vmApp._render()) -> patch(oldVnodeApp, vnodeApp)
patch(oldVnodeApp, vnodeApp) // 不是placeHolder vnode
    sameVnode(oldVnodeApp, vnodeApp) && patchVnode(oldVnodeApp, vnodeApp)
        // patchVnode
        oldCh = [oldVnodeHelloWorldPH]
        ch = [vnodeHelloWorldPH]
        patch(oldVnodeHelloWorldPH, vnodeHelloWorldPH) // index = 0
            i = vnodeHelloWorldPH.data.hook.prepatch && i(oldVnodeHelloWorldPH, vnodeHelloWorldPH)
                // prepatch
                const options = vnode.componentOptions;
                const child = vnode.componentInstance = oldVnode.componentInstance;
                updateChildComponent(
                    child,
                    options.propsData, // new propsData
                    options.listeners, // updated listeners
                    vnode, // new parent vnode
                    options.children // new children
                );
                    // updateChildComponent
                    if (propsData && vm.$options.props) {
                        toggleObserving(false)
                        const props = vm._props
                        const propKeys = vm.$options._propKeys || []
                        for (let i = 0; i < propKeys.length; i++) {
                            const key = propKeys[i]
                            const propOptions: any = vm.$options.props // wtf flow?
                            // vm._props.key = new Val setter dep.notify
                            props[key] = validateProp(key, propOptions, propsData, vm)
                        }
                        toggleObserving(true)
                        // keep a copy of raw propsData
                        vm.$options.propsData = propsData
                    }

```

#### vmParent.key.subKey = xxx

当`vmParent.key` 对应的value为数组或者对象类型时。在vmParent初始化的时候会对value进行observe

子组件实例化时，initProps中存在一段这样的逻辑。

```javascript
// defineReactive内部由于val已经是observe过的了，因此childOb = observe(value)直接返回在vmParent中生成的ob对像，访问value.key时， 也是直接在vmParent中生成的闭包dep上直接操作。
// 因此子组件在获取value.key 或者改变给value增减属性时，都会触发相应的依赖收集。也就是子组件对应的watcher会搜集在父组件中观察过的value对应的dep中。
// vmParent.value.key update 就可以通知对应的依赖，更新对应的视图。
defineReactive(vm._props, key, val);
Object.defineProperty(vm._props, key, )
```

