# Compiler

template -> render fn

runtime + compiler
runtime (需借助vue-loader将template编译为render fn)

## runtime with compiler

```javascript
// entry runtime with compiler
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function(
    el?: string | Element,
    hydrating?: boolean
):Component {
    el = el && query(el); // query(el) 中使用了querySelector查找DOM element，并返回第一个匹配到的元素；使用的是深度优先先序遍历算法。

    const options = this.$options;
    // FOCUS1: resolve template/el and convert to render function
    if (!options.render) { //... }

    mount.call(this, el, hydrating);
}

// FOCUS1 resolve template/el and convert to render function
template = options.template;
// generate template
if (template) {

} else if (el) {
    template = getOuterHTML(el);
}

// FOCUS2: template -> render fn
if (template) {

}
```

### template to render fn