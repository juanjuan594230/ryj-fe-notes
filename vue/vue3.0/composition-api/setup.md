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