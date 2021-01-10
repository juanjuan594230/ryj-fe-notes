# Component

> components is reusable Vue instances. they accept same options as `new Vue`, such as `data` `computed` `watch` `methods`, and lifeCycle hooks. except `el` which is one of the root-specific options.

> each time you use a component, a new instance of it created; 组件的每一次复用，都会创建一个新的Vue实例。

**data must be a function, return the data object. because of data separate for component reuse**

## Component Vnode & Ctor

An Example

`HelloWorld` Component
```javascript
// HelloWorld.vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
      console.log('hello mounted');
  }
}
</script>
```

`App` Component
```javascript
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>
```

```javascript
// main.js
import Vue from 'vue';
import App from './app';
new Vue({
  render: h => h(App),
}).$mount('#app');
```

**process analysis**
```javascript
// renderWatcher -> get -> getter.call(vmRoot) -> updateComponent() -> vmRoot._update(vmRoot._render(), false); -> vmRoot._render() -> wmRoot.options.render.call(vm, $createElement)
// new Vue() -> _init() -> initRender
function initRender(vm) {
    // ...
    // bind the createElement fn to this instance; so that wo get proper render context inside it ??
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // render fn compiled from templates
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
    // user-written render function
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
    // ...
}

Vue.prototype._render() {
    // ...
    const { render, _parentVnode } = vm.$options;
    vm.$vnode = _parentVnode;
    vnode = render.call(vm, vm.$createElement);
    vnode.parent = _parentVnode;
    return vnode;
}

function createElement(
    context: Component,
    tag: any,
    data: any,
    children: any,
    normalizationType: any,
    alwaysNormalize: boolean
): VNode | Array<VNode> {
    // data params not exist
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(
    context: Component,
    tag?: string | Class<Component> | Function | Object,
    data?: VNodeData,
    children?: any,
    normalizationType?: Number
): VNode | Array<VNode> {
    // normalize children
    // create vnode
    if (typeof tag === 'string') {
        let Ctor;
        let ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag); // ???
        // HTML 保留 tag
        if (config.isReservedTag(tag)) {
            vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.options, 'components', tag))) {
            // component 暂时先搁置
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            vnode = new VNode(tag, data, children, undefined, undefined, context);
        }
    } else {
        vnode = createComponent(tag, data, context, children);
    }

    // someCode
    return vnode;
}

// this case Ctor is an object
// create sub Ctor
// install hooks
// create VNode instance
function createComponent(
    Ctor: Class<Component> | Function | Object | Void,
    data: ?VNodeData,
    context: Component,
    children: ?Array<VNode>,
    tag?: string
): VNode | VNode<Array> | void {
    // step1 create sub ctor 创建组件对应的构造函数 继承自Vue
    if (isObject(Ctor)) {
        // Vue.extend(Ctor); return Sub fn 组件的构造函数
        Ctor = context.$options._base.extend(Ctor);
    }

    // async component logic TODO

    data = data || {}

    // transform component v-model data into props & events TODO
    if (isDef(data.model)) {
        transformModel(Ctor.options, data)
    }

    // extract props TODO
    const propsData = extractPropsFromVNodeData(data, Ctor, tag)

    // functional component TODO
    if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    const listeners = data.on;
    data.on = data.nativeOn;

    // step2 安装组件钩子函数
    installComponentHooks(data); // data.hooks.init/prepatch/insert/destroy

    // 创建VNode实例
    const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,
        { Ctor, propsData, listeners, tag, children },
        asyncFactory
    )

    return vnode; // component vnode(placeHolder vnode)
}
```

组件`VNode`的`componentOptions`组件中保存了组件的构造函数。

## Component instantiation

`vm.render()`返回了一个`VNode` 实例；

接下来进行`vm._update(VNode)` 将`VNode`转化为真实的DOM node；

**process analysis**

```javascript
// vm._update(VNode) -> patch(oldVNode, VNode) -> createElm()
// VNode -> real DOM element
function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
) {
    // component vnode
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // normal vnode
    // node create
    // createChildren iterate children 递归调用createElm
    // insert children to node
}

function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data;
    if (isDef(i)) {
        // TODO keep-alive component
        const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false);
        }
    }
}

```