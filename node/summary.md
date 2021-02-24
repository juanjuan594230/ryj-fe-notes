基于Google V8 的 javascript 运行时。使用事件驱动，非阻塞IO，使得nodeJS是轻量和高效的。有大量的npm包资源。

目前 Node.js 在大部分领域都占有一席之地，尤其是 I/O 密集型的，比如 Web 开发，微服务，前端构建等。

nodeJS编程应用，如：npm webpack 等；在大型网站中做前端渲染与架构优化。

缺点：
- callback hell
- 不适用与CPU密集任务（fibjs 可以考虑用作CPU密集型任务）

## 实际的一些应用场景

跨平台（移动，PC， 混合）
工具（编译、构建工具；webpack）
服务端
前端 react、Vue

SSR
PWA

**摘**

如果你是前端开发工程师，你本地电脑上不可避免的要安装 Nodejs，作为工具也好，作为服务器也好，要帮助你做掉很多又脏又累的事情，比如
less/scss 的编译
ES6/7 到 ES5 的转换
Javascript 代码的压缩合并
切页面调试样式的热更新
无论是通过社区迅速更新换代的 Grunt/Gulp/Webpack，还是通过自己集成或者定制到本地的其他模块，Nodejs 的这个运行环境都是你得力的助手。

## nodejs是什么？

- javascript运行时，基于chrome V8
- 事件驱动，非阻塞IO
- 轻量、高效

v8 javascript
事件循环 libuv(c/c++编写的事件循环处理库)
线程池 libuv

## 如何学习

面向过程编程
面向对象
函数式编程


