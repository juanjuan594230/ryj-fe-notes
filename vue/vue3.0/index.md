## introduction

1、应用实例与根组件实例的区别是什么？
2、生命周期函数中的beforeDestroy & destroyed 替换成了 beforeUnmount & unmounted
3、指令属性值应为单个的javascript表达式（a single javascript expression)）, v-if & v-for 例外。

```javascript
const app = createApp(rootComponent); // 应用实例
const vm = app.$mount('#app'); // 返回根组件实例
```
createApp(RootComponent) 创建应用实例

## directive
指令的作用是，当属性值发生变化时，响应式的将影响应用到DOM。
除了v-if & v-for，指令的属性值都必须是单个的javascript表达式。
指令参数: 如v-bind:href中的href 以及 v-on:click中的click; 参数可以是一个变量 v-on:[eventName] = ''

## TODO
Node.js-based build tools (vue-cli)

## 值得注意的新特性

### 组合式API

#### setup

- ref() 创建响应式引用（包装对象）
- toRefs()
- lifecycle hooks onX fn
- watch(响应式引用, callback, options)

```javascript
const componentOpts = {
    // ...
    props: {
        user: {
            type: string,
            required: true
        }
    }
    // 组件创建之前，当组件实例被创建，初始化props后被调用，作为组合API的入口
    setup(props, context) {
        console.log(props); // { user: ''}
        return {}; // 返回的任何内容都可以用于组件的其余部分
    }
}
```

**props**

setup(props, context)
props是响应式，不可以使用解构赋值。？？？

**context**

非响应式，可以安全的使用解构赋值。
{ attrs, slots, emit } = context

**疑惑**
问：
为什么响应式的不可以使用解构赋值？为什么会消除响应式？？？

#### ref()

在setup()中创建一个可以在内部管理的值，可以使用ref()函数。 ？？？

ref()返回一个包装对象（只有一个value属性值）。

**为什么需要包装对象**

```javascript
// msg传递出去的只是一个值，当setup内部改变了msg之后，组件中无法感知变化
setup() {
    let msg = 'hello';

    setTimeout(() => {
        msg = 'welcome'
    }, 1000);

    return {
        msg
    }
}

// use ref()
setup() {
    let msg = ref('hello'); // msg 是一个包装对象 msg: { value: 'hello'}

    setTimeout(() => {
        msg.value = 'welcome';
    });

    return {
        msg // 传递引用类型、响应式数据源
    }
}
```

> 包装对象的意义就在于提供一个让我们能够在函数之间以引用的方式传递任意类型值的容器。Vue 的包装对象同时还是响应式的数据源。有了这样的容器，我们就可以在封装了逻辑的组合函数中将状态以引用的方式传回给组件。组件负责展示（追踪依赖），组合函数负责管理状态（触发更新）

包装对象自动展开：即可以在模板中直接使用{{ msg }}



#### lifecycle

```javascript
// beforeCreate created do not need
setup() {
    onBeforeMount(callback)
    onMounted(callback)
    onBeforeUpdate(callback)
    onUpdated(callback)
    onBeforeUnmount(callback)
    onUnmounted(callback)
    onErrorCaptured(callback)
    onRenderTracked(callback)
    onRenderTriggered(callback)
}
```