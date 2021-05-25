uni-app 实现小程序跨端 编译器 + 运行时

## 编译器

uni-app遵循Vue.js语法规范，单文件组件，三段式结构

小程序每一个页面都包含了四种文件(wxml/wxss/js/json)

uni-app会在编译阶段，将.vue的单文件拆分成小程序工具接受的多文件。

![](../images/uniapp-to-wx.png)

## 运行时

![](../images/runtime.png)

