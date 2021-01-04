# router

## SPA & 前端路由

> SPA 通过动态重写当前页面来与用户交互，而非传统的从服务器重新加载整个页面。

### SPA & 浏览器历史记录

整个应用只有一个页面，看起来的多页面是由JS操作来完成的。因此在操纵浏览器的历史记录时（比如回退），可能返回的真正的上一个页面，而不是用户期望的SPA应用中的上个页面。

因此需要用到前端路由。

前端路由：通过JS操纵浏览器的会话历史。

### Frontend Routing

- hash mode
- history mode

#### hash mode

hash: URL中`#`及之后的内容

hash值的变化，不会重新向服务器发送请求；会触发hashchange事件(浏览器前进/后退，window.location.hash = 'xxx')，可以在事件处理程序中做一些操作。

```javascript
// url: http://growth-material.corp.kuaishou.com/#/agentManagement
window.location.hash = '#/agentManagement';
```

一个例子：`window.location.hash`重新赋值会修改浏览器的会话记录。

```javascript
// https://fanyi.baidu.com/
// window.location.hash = '#/aaa' 地址栏变成 https://fanyi.baidu.com/#/aaa
// window.location.hash = '#/bbb' 地址栏变成 https://fanyi.baidu.com/#/bbb

// 操作浏览器的后退按钮，地址栏变成 https://fanyi.baidu.com/#/aaa
// 操作浏览器的后退按钮 地址栏变成 https://fanyi.baidu.com

// 操作浏览器的前进按钮 地址栏变成 https://fanyi.baidu.com/#/aaa
```

### history mode

HTML5提供了操纵浏览器会话记录的API `pushState` `replaceState`

`popstate`事件可以监听浏览器的前进、后退操作；以及`history.back()` `history.forward()` `history.go()`

**path的切换会向服务器发起请求，所以history模式下，需要在nginx层（或web服务器层）做配置（统一都返回index.html），否则可能会出现404**

## Vue-Router

![](../images/router/vue-router.png)
*vue router 整体架构*

### 行为层

#### 用户行为

点击页面中的link标签、点击手动调用push/replace API ，最终都会触发transitionTo，找到匹配的route，执行完所有的导航守卫、完成route的更新之后，会调用**pushHash**或者**pushState**完成会话记录的更新。(pushHash方法中，如果browser支持pushState，则会调用pushState完成会话记录的添加；不支持的话，会直接修改window.location.hash<会话记录会相应改变>).

#### 浏览器行为

点击浏览器的前进后退按钮、或者通过history API（back、forward、go）操作会话历史，则会触发popstate事件或者hashchange事件，通过注册的事件处理函数调用transitionTo()完成路由的匹配及更新。

==push()中通过window.location.hash = XXX的方式更新hash值，会触发hashchange事件。代码中监听的hashchange事件，其处理函数中又会调用transitionTo()做路由切换，不会有问题吗？==

transitionTo中调用confirmTransition中会对相同路由做判断。

### 响应式

#### 派发更新

==vmRoot._route = route; vmRoot._route setter trigger==

transitionTo()完成路由的匹配、导航守卫等操作后，会updateRoute
	在updateRoute中，首先会修改history.current；其次调用history.cb(route);
		history.cb是在router init的时候，调用history.listen(cb)完成赋值的。
			cb = (route) > { 遍历router.apps, 更改app._route = route }
	updateRoute之后，vueRootInstance._route更新；
	beforeCreate()中，对vueRootInstance._route做了响应式处理，setter触发后，对应的依赖watcher会更新（包括router-view组件，重新根据当前的route，匹配需要渲染的组件，完成派发更新）

#### 依赖收集

**summary**

vmRoot._route 响应式

vmInstance.$route -> vmRoot._route

Router-View Component -> render fn (get vmInstance.$route) -> vmRoot._route(对router-view render watcher add dep)

**detail**

install

Object.defineProperty(Vue.prototype, '$route', {
    get() { return this._routerRoot._route }; // this._routerRoot 根Vue实例
});

Vue.mixin(
    beforeCreate() {
        ...
        Vue.util.defineReactive(this, '_route', this._router.history.current); // 对vmRoot._route做了响应式处理
    }
)

Router-View Component

const route = parent.$route; // 读取了vmRoot._route，所以对Router-View Component render watcher做了依赖收集。



```javascript
history.confirmTransition(route, onComplete, onAbort) {
    ...
    onComplete();
}

function onComplete() {
    const prev = this.current
    this.updateRoute(route)
    // ...
}

function updateRoute(route) {
    history.current = route;
    history.cb && history.cb(route); // app._route = route  _route setter
}

// 关于history.cb
// class history
listen(cb) {
    this.cb = cb;
}

// class Router
init(app) {
    history.listen(route => {
        this.apps.forEach(app => {
            app._route = route;
        })
    })
}

router.history.cb = route => {
    router.apps.forEach(app => {
        app._route = route;
    })
}
```

### three class

- router
- history
- matcher

#### class Router

```javascript
class Router {
    constructor(options) {
        this.app = null;
        this.apps = [];
        this.beforeHooks = [];
        this.afterHooks = [];
        this.resolveHooks = [];

        // this.matcher = { match: fn, addRoutes: fn}
        this.matcher = createMatcher(options.routes || [], this);

        // 根据options.mode 创建不同的history instance
        switch(mode) {
            case 'history':
                this.history = new HTML5History(this, options.base);
            case 'hash':
                this.history = new HashHistory(this, options.base, this.fallback);
            case 'abstract':
                this.history = new AbstractHistory(this, options.base);
        }
    }

    // VueRouter.install时，在Vue的每一个组件中都混入了beforeCreate钩子函数，当vm为根组件实例时，会调用this._router.app(this);
    init(app) {
        this.apps.push(app);
        this.app = app;

        // 首次route匹配、跳转
        // setupListeners = () => { this.history.setupListeners(); // ...} 添加事件监听 popstate or hashchange
        this.history.transitionTo(
            history.getCurrentLocation,
            setupListeners, // onComplete
            setupListeners // onAbort
        );

        // this.history.cb = cb 会在transitionTo -> confirmTransition -> 之后调用
        this.history.listen(route => {
            this.apps.forEach(app => {
                app_route = route; // setter 派发更新
            })
        })

    }
}
```

#### class History



```javascript
class History {
    constructor() {}

    transitionTo(location, onComplete, onAbort) {
        const route = this.router.match(location, this.current); // 匹配要跳转的路由
        this.confirmTransition(
            route,
            // success cb
            () => {
                // ...
            },
            // fail cb
            () => {
                // ...
            }
        )
    }

    // 确认切换
    confirmTransition(route, onComplete, onAbort) {
        isSameRoute(route, current) && return;

        // 解析出更新的、失活的、激活的RouteRecord
        const { updated, deactivated, activated } = resolveQueue(this.current.matched, route.matched);

        // queue 导航守卫数组
        const queue: Array<?NavigationGuard> = [].concat(
            extractLeaveGuards(deactivated), // 获取所有失活的组件定义的beforeRouteLeave钩子函数
            this.router.beforeHooks, // 全局的beforeEach钩子 全局导航守卫
            extractUpdateHooks(updated), // 路由改变，组件复用时调用beforeRouteUpdate钩子
            activated.map(m => m.beforeEnter), // 需要渲染组件的beforeEnter守卫钩子 路由独享守卫
            resolveAsyncComponents(activated) // 解析异步路由组件
        );

        // 定义迭代器
        const iterator = (hook, next) => {
            hook(route, current, (to) => {
                // ...
                next(to)
            });
        };

        runQueue(queue, iterator, () => {
            // step1. activated component call beforeRouteEnter
            const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
            // step. queue = [activated beforeRouteEnter, 全局的beforeResolve queue]
            const queue = enterGuards.concat(this.router.resolveHooks);
            // 依次执行queue中的beforeResolve hook
            runQueue(queue, iterator, () => {
                // ...
                onComplete(route); // queue execute done, call onComplete<transitionTo call confirmTransition param>
                // 调用beforeRouterEnter中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入？？？
                if (this.router.app) {
                    this.router.app.$nextTick(() => {
                        postEnterCbs.forEach(cb => {
                            cb();
                        })
                    });
                }
            });
        })
    }

    // updateRoute
    updateRoute(route) {
        this.current = route;
        this.cb && this.cb(route); // this.router.app._route = route;
    }

    // html5 history ensureURL 实现 update history session
    ensureURL (push?: boolean) {
        if (getLocation(this.base) !== this.current.fullPath) {
            const current = cleanPath(this.base + this.current.fullPath)
            push ? pushState(current) : replaceState(current)
        }
    }

    // hash history ensureURL 实现 update history session
    ensureURL (push?: boolean) {
        const current = this.current.fullPath
        if (getHash() !== current) {
            push ? pushHash(current) : replaceHash(current)
        }
    }

}

// execute queue && 执行完成之后，调用cb
function runQueue(queue:Array<?NavigationGuard>, fn, cb) {
    const step = index => {
        // queue execute done
        if (index >= queue.length) {
            cb();
        } else [
            // hook exist
            if (queue[index]) {
                // iterator(hook, next), 因此必须执行next，才会执行下一步。
                fn(queue[index], () => {
                    step(index + 1);
                });
            } else {
                step(index + 1)
            }
        ]
    }
    step(0);
}

// confirmTransition onComplete
function onComplete() {
    const prev = this.current;
    // 更新导航
    this.updateRoute(route)
    onComplete && onComplete(route) // transitionTo onComplete param
    this.ensureURL() // pushState/replaceState/window.location.hash更改会话历史
    // 调用全局的afterEach hooks
    this.router.afterHooks.forEach(hook => {
        hook && hook(route, prev)
    })

    // fire ready cbs once
    if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => {
        cb(route)
        })
    }
}
```

**导航守卫**

导航守卫主要分为了三大类

- 全局导航守卫 `beforeEach` `beforeResolve` `afterEach`
- 路由独享守卫 `beforeEnter`
- 组件内守卫 `beforeRouteEnter` `beforeRouteUpdate` `beforeRouteLeave`

![](../images/router/vue-router-guard.png)

主要分析confirmTransition中导航的解析流程

```javascript
const queue = [].concat(
    // step1 获取失活 routeRecords 中的 beforeRouteLeave hooks 组件内守卫 定义在组件内部
    // 深入到每一个deactivated routeRecord 的components 中的每一个component<组件中可能引用了其他的组件> 中寻找 beforeRouteLeave hook，绑定对应的Vue instance 到 guard；最后返回由这些 guard 组成的数组。
    extractLeaveGuards(deactivated);

    // step2 全局的beforeHooks
    this.router.beforeHooks;

    // step3 获取可复用 routeRecords 中的beforeRouteUpdate hooks 组件内守卫，定义在组件内部
    // 深入到每一个updated routeRecord 的components 中的每一个component 中寻找 beforeRouteUpdate hook，绑定对应的Vue instance 到 guard；最后返回由这些 guard 组成的数组。
    extractUpdateHooks(updated);

    // step4 activated routeRecord 中的 beforeEnter 路由独享守卫
    activated.map(m => m.beforeEnter);

    // step5 async component return fn
    resolveAsyncComponents(activated);
);

// 执行queue中的guard 第三个参数为queue中的guard执行完成之后，调用的fn
runQueue(queue, iterator, () => {
    // ...
    // step6 提取被激活组件 beforeRouteEnter 组件内守卫 定义在组件内部
    // postEnterCbs中存放了beforeRouteEnter next方法传入的回调，并在导航确认执行，遍历postEnterCbs，执行该回调函数。
    // 执行该guard时，组件实例还不存在。如需访问，需要将cb传入到next中，第一个参数为vm实例
    const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);

    // step7 提取全局解析守卫 beforeResolve
    const resolveHooks = this.router.resolveHooks;

    const queue = [].concat(enterGuards, resolveHooks); // queue 中存放了 beforeRouteEnter hooks & beforeResolve Hooks

    // 依次执行queue中的guard
    runQueue(queue, iterator, () => {
        onComplete(route); // confirmTransition onComplete 完成导航更新 step8 执行全局的afterEach hooks step9. 触发DOM更新
        // step10 调用beforeRouteEnter 中传递给next的cb，创建的组件实例会作为参数传入
        postEnterCbs.forEach(cb => {
            cb();
        })
    })



})

// step1 return array of function
function extractLeaveGuards(deactivated:Array<RouteRecord>) :Array<?Function> {
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}

// step6
function extractEnterGuards(activated, cbs, isValid) {
    return extractGuards(
        activated,
        'beforeRouteEnter',
        (guard, _, match, key) => {
            return bindEnterGuard(guard, match, key, cbs, isValid)
        } // 与extractLeaveGuards不同之处。extractLeaveGuards返回绑定了this(Vue instance)的guard fn列表 ；extractEnterGuards 返回了一个fn列表。
    )
}

// extractEnterGuards 返回的fn 列表 单个fn例子。执行导航守卫，等于在执行routeEnterGuard，也意味着在执行guard(to, from , cb);
function bindEnterGuard(guard, match, key, cbs, isValid) {
    return function routeEnterGuard(to, from, next) {
        return guard(to, from, cb => {
            if (typeof cb === 'function') {
                cbs.push(() => {
                // #750
                // if a router-view is wrapped with an out-in transition,
                // the instance may not have been registered at this time.
                // we will need to poll for registration until current route
                // is no longer valid.
                    poll(cb, match.instances, key, isValid)
                })
            }
            next(cb)
        })
    }

    // use guard = (to, from, _next) { _next((vm) => { // vm instance })}  _next区分 routeEnterGuard 中的next
    // execute guard(to, from , _next = (cb) => { // ... }); 执行guard fn，内部执行_next((vm) => { //...})
    // _next((vm) => {}) 执行。若typeof cb === function, 则将其加入到postEnterCbs中。并且调用 routeEnterGuard 中的next，继续执行下一个guard
    // postEnterCbs 在导航最终确认之后，会遍历执行数组中的cb，此时可以访问组件实例
}
```

**`extractGuards`解析**
```javascript
function extractGuards(records:Array<RouteRecord>, name, bind:Function, reverse?:boolean) {
    // step1
    const guards = flatMapComponents(records, (def, instance, match, key) => {
        const guard = extractGuard(def, name)
        if (guard) {
            return Array.isArray(guard)
                ? guard.map(guard => bind(guard, instance, match, key))
                : bind(guard, instance, match, key)
        }
    });
    // step2
    return flatten(reverse ? guards.reverse() : guards); // flatten 将二维数组扁平化处理
}

function flatMapComponents(matched:Array<RouteRecord>, fn:Function) {
    return flatten(matched.map(m => {
        return Object.keys(m.components).map(key => fn(m.components[key], m.instances[key], m, key));
    }));
    // 拆解
    // 每一项都是一个routeRecord
    // matched = [
    //     {
    //         components: {
    //             default: compDef
    //         }
    //     },
    //     {
    //         components: {
    //             default: compDef
    //         }
    //     }
    // ]
    // arr = [item0 = [result0, ..., resultN], ..., itemN]
    const arr = matched.map(m => {
        const keys = Object.keys(m.components); // m.components = { default: componentDef, ...} keys = ['default', ...]
        // item = [fn(m.components[default], m.instances[default], m, 'default'), ...] routeRecord.components中每一个key 执行fn() 返回结果，组成的数组
        const item = keys.map(key => {
            const result = fn(m.components[key], m.instances[key], m, key);
            return result;
        });
        return item;
    });
    return flatten(arr); // arr 扁平化
}

fn = (def, instance, match, key) => {
    const guard = extractGuard(def, name)
    if (guard) {
        return Array.isArray(guard)
            ? guard.map(guard => bind(guard, instance, match, key))
            : bind(guard, instance, match, key) // bind this to Vue instance
    }
}

// bind vue instance
function bindGuard(guard:NavigationGuard, instance: ?_Vue) {
    if (instance) {
        return function boundRouteGuard () {
            return guard.apply(instance, arguments)
        }
    }
}
```



#### class Matcher



## Component

### View

### Link



## todo
- [ ] route.matched


