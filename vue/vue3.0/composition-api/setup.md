# setup

one of option in component options; is a function, accept tow argus(props, context), return an object(which component other part can use directly).

```javascript
export default {
    props: {
        title: string
    },
    setup(props, context) {
        return {}
    }
}
```

## arguments

### props

不可以直接解构，会丢失属性的响应式；应当使用toRefs(props)再解构。

如果是一个非必须属性，则需要 const { title } = toRef(props, 'title');

### context

普通的javascript对象，包含了三个组件属性： attrs\slots\emit

## access component properties

setup 执行的时候，组件实例还未创建。因此data\computed\methods选项是没有办法获取到的。

## usage with render fn

```javascript
import { ref } from 'vue';
{
    setup(props, context) {
        const title = ref('this is title');
        return () => {
            h('div', [title])
        }
    }
}
```

## lifecycle hooks

setup执行的时机：组件的beforeCreate之后，created之前。更准确一点是，props初始化之后。

所以：setup中beforeCreate和created钩子是不需要写的。

```javascript
{
    setup() {
        // lifecycle hooks on-hookName
        onBeforeMount(callback) // beforeMount call by component, the callback will be called
        onMounted(callback)
        onBeforeUpdate()
        onUpdated()
        // 对应beforeUnmount & unmounted 应该是对应vue2.x的beforeDestroy destroyed
        onBeforeUnmount()
        onUnmounted()
        // 分别对应 errorCaptured renderTracked renderTriggered
        onErrorCaptured()
        onRenderTracked()
        onRenderTriggered()
    }
}
```

## provide/inject

long-range props 远距离props

vue2.x: 父组件向子组件传递值依靠props。组件嵌套较深的话，props需要一层一层传递下去。
vue3: 为父子组件传值提供了新的方式-provide/inject对。

> Parent components can serve as dependency provider for all its children, regardless how deep the component hierarchy is. This feature works on two parts: parent component has a provide option to provide data and child component has an inject option to start using this data.(父组件作为其所有孩子的依赖提供者，不管子组件嵌套的层级有多深。父组件提供一个provide option, 提供数据；子组件提供一个inject option, 用来使用数据)

**那么存在了provide/inject, props是否会被替代？？？**

```javascript
// parent component
{
    data: {
        msg: 'message'
    },
    provide: {
        user: 'renyujuan',
        msg: this.msg // parent component instance prop, this maybe undefined; so throw error
    },
    // for parent component instance prop
    provide() {
        return {
            user: 'renyujuan',
            msg: this.msg
        }
    }
}
// child component
{
    inject: ['user', 'msg']
}
```

### working with reactivity

provide/inject 默认不是响应式的

我们可以通过向provide传入一个ref/reactive 对象来改变这样的行为。

**这里有一个疑惑哈？？？**

给出的例子是从父组件向子组件传递一个list的length；直接传递length，子组件中的length并不是响应式的，也就是无法随着父组件list的长度改变而改变。所以需要将length作为一个计算属性传递出去。

```javascript
{
    data() {
        return {
            toDos: []
        }
    }
    provide() {
        toDoLen: computed(() => this.toDos.length)
    }
}
```

那么假如直接传递toDos呢？也是非响应式的嘛？？？

### provide/inject with composition api

```javascript
// src/components/MyMap.vue
<template>
  <MyMarker />
</template>

<script>
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  provide: {
    location: 'North Pole',
    geolocation: {
      longitude: 90,
      latitude: 135
    }
  }
}
</script>

// src/components/MyMarker.vue
<script>
export default {
  inject: ['location', 'geolocation']
}
</script>
```

#### use provide in setup. use provide fn provide by vue;
#### use inject
#### reactivity
**add Reactivity**
**mutating reactive props**
> it is recommended to keep any mutations to reactive properties inside of the provider whenever possible.(将变化逻辑维护在provider内部)

```javascript
import { provide, readonly, ref, reactive } from 'vue';
export default {
    components: {
        MyMarker
    },
    setup(props, context) {
        // provide(name, value)
        // un reactivity
        // provide('location', 'North Pole');
        // provide('geolocation', {
        //     longitude: 90,
        //     latitude: 135
        // });

        // Add reactivity prop change 子组件自动更新
        const location = ref('North Pole');
        const geolocation = reactive({
            longitude: 90,
            latitude: 135
        });
        const updateLocation = (location) => {
            location.value = location
        }

        // use readonly prevent child component change prop
        // provide updateLocation fn, so can only update location by updateLocation
        provide('location', readonly(location));
        provide('geolocation', readonly(geolocation));
        provide('updateLocation', updateLocation);

        return {
            location
        }
    }
}

import { inject } from 'vue';
export const MyMarker = {
    setup() {
        const userLocation = inject('location', 'The Universe');
        const userGeolocation = inject('geolocation');
        const updateUserLocation = inject('updateLocation');
        return {
            userLocation,
            userGeolocation,
            updateUserLocation
        }
    }
}
```

## template refs

setup中可以定义一个模板引用， 并返回

来一个例子体验一下吧~

```javascript
<template>
    <div ref="root">this is a root element</div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const root = ref(null);

        onMounted(() => {
            console.log(root.value) // <div>This is a root element</div>
        });

        return {
            root
        }
    }
}
</script>
```

> Here we are exposing root on the render context and binding it to the div.
>  In the Virtual DOM patching algorithm, if a VNode's ref key corresponds to a ref on the render context, the VNode's corresponding element or component instance will be assigned to the value of that ref.(在虚拟DOM的patch算法中，假如vnode的ref的key对应于渲染内容的引用，即div的ref key为root，渲染内容也有一个root的引用；那么这个vnode对应的元素或者组件实例将会被赋值给渲染内容的ref，即this.root = div element)

