# custom directive
> there may be cases where you need some low-level DOM access on plain elements, and this is where custom directives would still be useful.（需要对普通元素做一些低级的DOM访问）

**划重点** DOM访问

```javascript
const app = Vue.createApp({});
app.directive('focus', directiveDefineOptions)

// directiveDefineOptions hook functions
directiveDefineOptions = {
    created(el, binding, vnode, preVnode) {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {}
}
```