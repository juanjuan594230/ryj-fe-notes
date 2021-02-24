CommonJS 是一种规范，定义的很多方面，模块仅仅是其中的一项。

CommonJS就像是一种理论（类似JS在浏览器端的W3C定义的规范），而nodejs是一种实现。

node借鉴CommonJS的Module规范，实现了一套模块系统。

## CommonJS Module 规范

CommonJS Module规范主要分为模块引用、模块定义、模块标识三部分。

### 模块引用

通过require(模块标识)引入一个模块的API到当前的上下文中。

### 模块定义

module 代表模块自身
module.exports 用于导出当前模块的方法或者变量

## Node 模块实现

- 路径分析
- 文件定位
- 编译执行

优先从缓存中寻找已经被编译执行过的module