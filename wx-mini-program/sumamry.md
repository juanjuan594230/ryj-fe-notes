## 宿主环境

小程序的运行环境分为渲染层和逻辑层；其中WXML和WXSS工作在渲染层、JS脚本工作在逻辑层。

小程序的渲染层和逻辑层是由两个不同的线程管理（这一点与浏览器的单线程不一样）。

渲染层界面使用webView线程进行渲染；逻辑层采用JSCore线程运行脚本。这两个线程的通信会通过微信客户端（native）做中转。逻辑层发送网络请求也是由客户端做中转。

一个小程序存在多个页面，因此渲染层存在多个WebView线程。

**???那么逻辑层只有一个JSCore线程吗???**
**???宿主环境与微信客户端应该不是一个东西吧???**

![](../images/wx-mini-project/小程序通信.png)

## 框架

### 逻辑层

```javascript
// 注册小程序 app.js App(option) option用来指定小程序的生命周期回调等
App({
    onLaunch({ path, scene, query, shareTicket, referrerInfo }) {} // 小程序初始化
    onShow({ path, scene, query, shareTicket, referrerInfo }) {} // 小程序进入前台或启动
    onHide() {} // 小程序进人后台
    onError(msg) {}
    onUnhandledRejection({ reason, promise }) {} // 未处理的promise reject事件监听函数
    onPageNotFound({ path, query, isEntryPage }) {}
});

// 注册页面 Page(option) Component(option)
// Page()用来注册简单的页面 Component()可以注册复杂页面 方法需要放在methods中
// option指定页面的初始数据、生命周期函数、事件处理函数等
Page({
    data: {} // 初始化数据
    onLoad(options) {} // 创建
    onShow() {} // 进入前台
    onReady() {} // DOM done
    onHide() {} // 后台
    onUnload() {} // 销毁
    ... // 还存在一些如下拉刷新、触底加载、滚动、尺寸变化等监听的函数
})
```

#### 页面生命周期

![](./images/page-lifecycle.png)

小程序渲染层与逻辑层运行在不同的线程中，因此会存在两个线程进行通信。如初始化页面时，等待渲染线程发出接受数据的通知；等待渲染线程发出页面渲染完成的通知等。逻辑层数据的变动，也会通知渲染线程进行rerender

渲染线层存在四个阶段：start inited ready end
逻辑线程存在五个阶段：start created active(前台) alive(后台) end(销毁)；active & alive阶段都会触发rerender

#### 页面路由

页面栈 getCurrentPages() 获取当前页面栈

切换Tab的时候，页面会全部出栈，只留下当前的tab页面

## 运行时

### 环境

逻辑层：javascriptCore V8
渲染层：WkWebview chrome渲染内核
### 机制

前台/后台
启动(冷启动、热启动)/销毁（进入后台一段时间或者系统资源紧张）

启动场景：

## behaviors

类似vue中的mixin