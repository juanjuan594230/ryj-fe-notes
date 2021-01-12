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
    <div>{{ msg }}</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
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
function patch() {
    // createELm done ...
    invokeInsertHook(vnodeAppPH, [vnodeHW, vnodeAppPh], false); // loop queue; queue[i].data.hook.insert(queue[i]); _isMounted = true; callHook('mounted') 先子后父，子vnode先插入
    return vnodeAppPH.elm;
}
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
      return; // done DOM insert body
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
            // create placeHolder VNode installComponentHooks() data.hook = { init: initHook }
            // vnode.componentInstance = child child.$mount(undefined, false);
            i(vnode, false); // done vnodeAppPH.data.pendingInsert = [ vnodeHW ]; vnodeAppPH.componentInstance.$el 保存了真实DOM结构
        }
        if (isDef(vnode.componentInstance)) {
            // done
            // insertedVnodeQueue = [vnodeHW, vnodeAppPH]
            // vnodeAppPH.elm = vnodeAppPH.componentInstance.$el
            initComponent(vnode, insertedVnodeQueue);
            insert(parentElm, vnodeAppPH.elm, refElm); // parentElm = body DOM insert
        }
    }
}
```

### `vnode.data.hook.init(vnode, false)`

init hook call 完成子组件的实例化及挂载过程。

**子组件实例化 & 挂载**

Component App 是一个单文件组件，其中template 经过`vue-template-compiler`会被预处理为渲染函数，最终注入到APP组件对象中。

```javascript
// vnode.data.hook.init fn
const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
child.$mount(undefined, false);

// $mount -> updateComponent -> vm._update(vm._render(), false)
child.render = function() {
  var _vm = this; // child
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h // child._c = (a,b,c,d) => createElement(child, a, b, c, d, false)
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c("div", [_vm._v(_vm._s(_vm.msg))]),
      _c("HelloWorld", { attrs: { msg: "Welcome to Your Vue.js App" } })
    ],
    1
  )
}
_v = createTextVnode
_s = toString
_v(_s(msg)) = createTextVnode(child.msg);

render.call(child, child.$createElement);
_c(
    'div',
    { attrs: { id: 'app'}},
    [
        _c('div', [child._v(child._s(child.msg))]), // vnode div
        _c('HelloWorld', { attrs: { msg: 'Welcome to Your Vue.js App'}}) // HelloWorld Component placeHolder vnode; vnode.componentOptions._Ctor = HelloWorld Component constructor
    ]
)
// child._render() done return vnodeApp
vnodeApp = {
    tag: 'div',
    children: [
        { tag: 'div', children: [TextVNode]},
        { tag: 'vue-component-2-HelloWorld'}
    ]
}

// child._update(vnodeApp)
prevEl = child.$el; // undefined
prevVnode = child._vnode; // undefined
activeInstance = child;
child._vnode = vnodeApp;
child.$el = child.__patch__(undefined, vnodeApp, false, false); // oldVnode undefined

// patch(undefined, vnodeApp, false, false);
function patch(oldVnode = undefined, vnode = vnodeApp, hydrating = false, removeOnly = false) {
    // oldVnode 不存在啊 直接创建新的节点即可
    let isInitialPatch = false
    const insertedVnodeQueue = []
    if (isUndef(oldVnode)) {
        isInitialPatch = true;
        createElm(vnodeApp, insertedVnodeQueue); // done vnodeApp.elm 保存了真实的DOM结构 insertedVnodeQueue = [vnodeHW]
    }
    invokeInsertHook(vnodeApp, insertedVnodeQueue, isInitialPatch); // vnodeApp.parent.data.pendingInsert = [vnodeHW]; vnodeApp.parent 即 APP placeHolderVnode
    return vnodeApp.elm
} // patch done child.$el = vnodeApp.elm;

// createElm(vnodeApp, insertedVnodeQueue)
createElm(vnodeApp, insertedVNodeQueue) {
    // vnodeApp is  not a component vnode createComponent fn return false
    if (createComponent(vnodeApp)) {
        return;
    }

    // create element
    vnodeApp.elm = createElement(tag, vnode);
    createChildren(vnodeApp, children, insertedVnodeQueue); // children loop done vnodeApp.elm中保存了DOM结构
    insert(parentElm, vnode.elm, refElm); // parent undefined so do noting;
}

createChildren(vnode, children, insertedVnodeQueue) {
    // children = [ vnode<div>, vnode<HelloWorld>]
    // vnode.elm = DOM element div
    for (let i = 0; i < children.length; i++) {
        // i = 0
        // createElm() normal node createElement and insert(vnodeApp.elm, node div, null); 过程中还经历过一次createChildren, 最终vnode<div>插入到了vnodeApp.elm中
        // i = 1
        // createElm(vnodeHW, insertedVnodeQueue, vnodeApp.elm, null, true, children, 1);
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
    }
} // loop done insertedVnodeQueue = [vnodeHW]

    // 递归进入createElm HelloWorldVNode
    createElm(vnodeHW, insertedVnodeQueue, vnodeApp.elm, null, true, children, 1) {
        // component vnode return true
        if (createComponent(vnodeHw, insertedVnodeQueue, vnodeApp.elm, null)) {
            return;
        }
    } // createElm HelloWorldVNode done; DOM inserted and insertedVnodeQueue = [vnodeHW]

        // createComponent HelloWorld
        createComponent(vnodeHW, insertedVnodeQueue, vnodeApp.elm, null) {
            // HelloWorld component instance & mount
            // suppose init done _vnodeHW.elm已经挂载了HelloWorld 组件的真实DOM结构。 内部实例化与挂载的过程先忽略（大致与APP一致）
            vnodeHw.data.hook.init(vnodeHW); // patch -> invokeInsertHook(_vnodeHW, insertedVnodeQueue, isInitialPatch) _vnodeHW 代表vnodeHW代表的真实vnode结构，而非占位VNode

            if (isDef(vnodeHW.componentInstance)) {
                initComponent(vnodeHw, insertedVnodeQueue); // insertedVnodeQueue = [vnodeHW]
                insert(vnodeApp.elm, vnodeHw.elm, null); // 将vnodeHW.elm 插入到vnodeApp.elm中， 组件HelloWorld DOM 插入
                // keep-alive later
                if (isTrue(isReactivated)) {
                    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
                }
                return true;
            }
        }

            // vnodeHw.data.hook.init(vnodeHW) process
            // vnodeHw 挂载 patch 中 invokeInsertHook analysis
            invokeInsertHook(vnode = _vnodeHW, queue = [], initial = true) {
                if (isTrue(initial) && _vnodeHW.parent) { // _vnodeHw.parent = vnodeHW(HelloWorld component placeHolder vnode);
                    _vnodeHW.parent.data.pendingInsert = queue;
                }
            }

            // createComponent(vnodeHW, insertedVnodeQueue, vnodeApp.elm, null) process
            // initComponent
            initComponent(vnodeHW, insertedVnodeQueue) {
                // vnodeHW.data.pendingInsert = []
                // because of empty， so no operate
                if (isDef(vnode.data.pendingInsert)) {
                    insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
                    vnode.data.pendingInsert = null
                }

                vnodeHw.elm = vnodeHW.componentInstance.$el; // _vnodeHW.elm

                if (isPatchable(vnodeHW)) { // 是否已经patch过 false;
                    // update logic later
                } else {
                    insertedVnodeQueue.push(vnodeHW);
                }
            }

```

子组件APP 实例化及挂载完成之后，`vmApp.$el`中保存了真实的DOM结构；

## TODO

vm.$options.abstract ??

## 单文件组件

### template

`vue-template-compiler` 预处理为JS渲染函数，最终注入到`<script>`导出的组件中。