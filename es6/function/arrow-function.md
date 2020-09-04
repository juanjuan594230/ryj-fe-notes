# Arrow Function

## this

箭头函数没有this绑定。箭头函数的this需要查找作用域链来确定

箭头函数可以调用`call` `apply` `bind`，但内部的`this`指向不受影响。

## arguments

箭头函数没有它自身的`arguments`绑定。但可以访问到包含函数的`arguments`对象。

## 用途

替代匿名函数表达式

