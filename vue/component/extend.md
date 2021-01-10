### Vue.extend

```javascript
Vue.extend = function(extendOptions: Object): Function {
    extendOptions = extendOptions || {};
    const super = this; // Vue
    const superId = Super.cid; // 0

    // 子构造函数做缓存
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId];
    }

    // 组件name校验
    // Sub Ctor
    const Sub = function VueComponent(options) {
        this._init(options);
    }
    Sub.prototype = Object.create(Super.prototype); // Vue.prototype 通过原型链实现继承
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    ),
    Sub['super'] = Super;
}
```