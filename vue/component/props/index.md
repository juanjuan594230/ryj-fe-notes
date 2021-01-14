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