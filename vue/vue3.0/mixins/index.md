# mixin

为Vue组件提供可重用的功能。

> a mixin object can contain any component options.

当一个组件使用mixin时，mixin中的option会以不同的策略合并到组件的option上。

## merge strategy

### data option

component option具有较高的优先级，遇到冲突，会覆盖mixin中data对应的值。

```javascript
const mixin = {
    data() {
        return {
            message: 'hello',
            foo: 'abc'
        }
    }
}

const app = Vue.createApp({
    mixins: [mixin],
    data() {
        return {
            message: 'goodbye',
            bar: 'def'
        }
    }
});

// finally
data = {
    message: 'goodbye',
    foo: 'abc',
    bar: 'def'
}
```

### lifecycle hooks

同样的hook，会合并到一个数组中，依次调用。mixin中的先被调用。

### methods components directives

methods components directives will be merge into the same obj;

合并策略也是覆盖，组件的option拥有更高的优先级。

## global mixin

会影响到每一个组件。

vuex、vue-router都用到了global mixin. 挂载store\router实例。

## custom merge strategy

可以自定义合并策略

## 限制

- 容易冲突
- 重用限制