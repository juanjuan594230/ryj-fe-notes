# 组件注册

两种方式：
- 全局注册
- 局部注册

## 全局注册

**用法**
```javascript
// register
Vue.component(id: String, definition: Object | Function)
// get component
Vue.component(id);
```

**定义**
```javascript
// initGlobalAPI -> initAssetRegisters
Vue.component = function(
    id: string,
    definition: Function | Object
): Function | Object | void  {
    // get logic
    if (!definition) {
        return this.options.components[id];
    }
    // definition is Object Vue.extend(definition)将其转换成构造函数
    if (isPlainObject(definition)) {
        definition.name = definition.name || id;
        definition = this.options._base.extend(definition); // return Sub
    }
    // save
    this.options.components[id] = definition;
    return definition;
}
```

`Vue.component(id, definition)`将组件保存到了`Vue.options.components`中，`key`为组件的name, value为组件的构造函数。

在子组件构造函数的创建过程中，会将`Vue.options`与`extendOptions`进行 merge，并将其保存到 `Sub.options`中。

组件实例化时，`initInternalComponent`中，`vm.$options = Object.create(vm.constructor.options)`;

这也就是全局注册的组件，可以在任意组件内直接访问到的原因。

## 局部注册

```javascript
import HelloWorld from './HelloWorld.vue';
const componentOptions = {
    name: 'AAA',
    components: {
        HelloWorld
    }
}
```
