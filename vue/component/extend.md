### Vue.extend

**Vue.extend**

```javascript
// return constructor extend Vue
Vue.extend = function(extendOptions: Object): Function {
    const Super = this;
    // 缓存优化
    extendOptions._Ctor && return extendOptions._Ctor;
    // 经典继承方式实现
    const Sub = function() {
        this._init();
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Super.options, options);
    Sub.super = Super;

    // props & computed ???
    Sub.options.props && initProps(Sub);
    Sub.options.computed && initComputed(Sub);
    // extend mixin use ???
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;
    // component directive filter ???
    ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type]
    })
    Sub.options.components[name] = Sub;

    extendOptions._Ctor = Sub; // 缓存
    return Sub;
}
// why Super.fn 不是可以通过原型链直接调用吗？ 为什么还要再做赋值
// props & computed 又是因为什么？
function initProps(Comp) {
    const props = Comp.options.props;
    for (const key in props) {
        proxy(Comp.prototype, '_props', key);
    }
}
```

### JS extend
```javascript
function Parent() {}
Parent.prototype.parentMethod = function() {};

function Child() {}
Child.prototype = Object.create(Parent.prototype);
console.log(Child.prototype.constructor); // parent
Child.prototype.constructor = Child; // wsm yao execute 这一句

// if
Child.prototype.create = function() {
    return new this.constructor();
}
new Child().create(); // parent instance
```