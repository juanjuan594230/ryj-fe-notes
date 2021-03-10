# webpack summary

> webpack is a static module bundler for modern JavaScript applications.

**core concepts**

- entry
- output
- loaders  webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.(转换某些特定类型的模块，eg: .sass .vue ...)
- plugins 可用于执行更广泛的任务，如：绑定优化
- mode development production and test...
- browser compatibility

## functions

- 模块打包
- babel 将代码转换成ES5，使得开发时可以使用JS的最新特性
- 开发环境web服务器
- 热加载
- tree shaking
- 各种loaders(处理.js/.json以外的文件类型，如css、txt...) eg：开发时使用css预处理语言，打包时转换成css文件 can use require() import 引入module，会使用对应的loader去处理，然后再引入。
- 各种plugins（打包优化、环境变量注入等。。。）
- 将打包的文件切割成多个文件，降低首次加载的耗时，提升性能
- 图片上传CDN


webpack-bundle-analyzer