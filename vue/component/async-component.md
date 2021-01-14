# async component

**用法**
```javascript
//工厂函数，接受resolve, reject两个参数。异步操作执行完毕，调用resolve(component definition) 或者reject(reason)
Vue.component(id, function(resolve, reject) {
    setTimeout(() => {
        resolve({
            name: '',
            template: ''
        })
    }, 1000);
});
Vue.component(id, () => import('my-async-component')); // factory is a promise object
```