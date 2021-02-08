# vue next

Class-API -> Function-based component API(Composition API)
Options-API -> Composition API (更好的逻辑复用、代码组织、类型推导等)



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

#### 为什么需要组合式API
> Creating Vue components allows us to extract repeatable parts of the interface coupled with its functionality into reusable pieces of code. This alone can get our application pretty far in terms of maintainability and flexibility. However, our collective experience has proved that this alone might not be enough, especially when your application is getting really big – think several hundred components. When dealing with such large applications, sharing and reusing code becomes especially important.

当我们的应用程序中包含了好几百个组件时，处理这种量级的应用程序时，**共享**和**重用**代码就变得尤其重要。

#### setup

组件的一个option，组合API执行的地方。

> The new setup component option is executed before the component is created, once the props are resolved, and serves as the entry point for composition API's. ???
这个created代表的是组件的生命周期钩子created吗？
猜想应该是的。那上面这段话的意思就是，setup执行的时机是在initProps之后，created之前。
但，文档中又标明，这个时候没有组件实例this。按照之前的逻辑在initProps时，组件实例已经是存在的。
**N脸懵逼中。。。**

执行的时机： beforeCreate 和 created 之间。

```javascript
const componentOpts = {
    // ...
    props: {
        user: {
            type: string,
            required: true
        }
    }
    setup(props, context) {
        console.log(props); // { user: ''}
        return {}; // 返回的任何内容都可以用于组件的其余部分(computed properties, methods, lifecycle hooks...)
    }
}
```

#### An Example

```javascript
// a component
export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    //   repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    // getUserRepositories () {
    //   // using `this.user` to fetch user repositories
    // }, // 1
    updateFilters () { ... }, // 3
  },
//   mounted () {
//     this.getUserRepositories() // 1
//   }

  // first login concern mark 1
  setup(props, context) {
    // before extract
    const { user } = toRefs(props);
    // // let repositories = []; // 这样定义的不具备响应式
    // const repositories = ref([]);
    // const getUserRepositories = async () => {
    // //    repositories = await fetchUserRepositories(props.user)
    //    repositories.value = await fetchUserRepositories(props.user)
    // },
    // onMounted(getUserRepositories);
    // watch('user', getUserRepositories);
    // return {
    //     repositories,
    //     getUserRepositories // functions returned behave same as methods
    // }

    // after extract
    const { repositories, getUserRepositories } = useUserRepositories(user);
    return {
        repositories,
        getUserRepositories
    }
  }
}

// 将login1抽取到独立的组合函数中
// src/composables/useUserRepositories.js
import { fetchUserRepositories } from '@/api/repositories';
import { ref, onMounted, watch } from 'vue';
export default function useUserRepositories(user) {
    const repositories = ref([])
    const getUserRepositories = async () => {
        repositories.value = await fetchUserRepositories(user.value)
    }

    onMounted(getUserRepositories)
    watch(user, getUserRepositories)

    return {
        repositories,
        getUserRepositories
    }
}
```

**Lifecycle Hook Registration Inside setup**

前缀 on + 生命周期函数 eg: onMounted

接受一个callback，在组件的mounted执行时， 调用callback

**function-based-API**

从setup的抽取可以看出，vue3.0将watch\computed等都抽取成了单独的函数，方便使用。这难道就是基于函数API？？？

- ref() 创建响应式引用（包装对象）
- toRefs()
- lifecycle hooks onX fn
- watch(响应式引用, callback, options)

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

```javascript
const count = ref(0); // count = { value: 0 }
const user = ref({ name: 'ren' }); // value is an object; use reactive method deeply reactive
```

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

### reactivity

#### reactive

reactive fn 从JS对象创建出一个响应式的状态。类似于Vue2.x的Vue.observable()。

```javascript
import { reactive } from 'vue';
const state = reactive({
    count: 0
});

// 解构响应式状态
const { count } = state; // error 响应式联系断了
const { count } = toRefs(state);
```

#### ref

独立的原始值 standalone primitive value, like: msg = 'a string value';

now, we want to make it reactive. wo can use the ref fn of Vue;

> ref will return a reactive and mutable object that serves as a reactive reference to the internal value. （ref 方法返回一个响应式的可变的对象，作为其内部value的响应式引用）

```javascript
import { ref } from 'vue';
const count = ref(0); // { value: 0 }
```

**ref UnWrapping**

从setup中返回的ref object， 在组件template中使用时，会自动展开，不需要读取其value属性。

#### readOnly 防止更改响应式对象

```javascript
import { reactive, readOnly } from 'vue';
const original = reactive({
    count: 0
});

const readOnlyOriginal = readOnly(original);
```

use case: provide & inject