# webpack summary

> webpack is a static module bundler for modern JavaScript applications.

**core concepts**

- entry
- output
- loaders  webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.(转换某些特定类型的模块，eg: .sass .vue ...)
- plugins 可用于执行更广泛的任务，如：绑定优化
- mode development production and test...
- browser compatibility


webpack-bundle-analyzer