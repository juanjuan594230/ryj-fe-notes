# buffer

> A buffer is a place in memory(typically RAM) that stores binary data. 内存中的一块地方，用来存储二进制数据。

在Node.js中，可以使用内置的Buffer类获取内存中的这些地方。

Buffer保存了一系列的整数（类似JS中的数组，但大小不能改变，在创建的时候就已经确定）.

> RAM Random Access Memory 随机存取存储器  可以直接与CPU交换数据的内部存储器，可以随时读取

> A buffer is a space in memory (typically RAM) that stores binary data. In Node.js, we can access these spaces of memory with the built-in Buffer class. Buffers store a sequence of integers, similar to an array in JavaScript. Unlike arrays, you cannot change the size of a buffer once it is created.

总结：buffer内存中的一块地方，用来存放二进制数据。Node.js中的Buffer类可以创建和操作这些空间，空间在创建时确定，不可以再改变。

> You may have used buffers implicitly if you wrote Node.js code already. For example, when you read from a file with fs.readFile(), the data returned to the callback or Promise is a buffer object.
>  Additionally, when HTTP requests are made in Node.js, they return data streams that are temporarily stored in an internal buffer when the client cannot process the stream all at once.

## TODOS

编码这些都不太懂

## goals

- 创建buffer
- 读取buffer
- 写入 & 复制
- 转换（二进制 & 编码数据）
- buffer API

### create

Buffer.alloc(size) 单位字节

const firstBuf = Buffer.alloc(1024)  1KB buffer 填充二进制0占位

> Binary data can come in many different formats. 二进制数据可以有许多不同的格式

01110110 ascii letter v
使用其他编码，则可能代表其他信息

Buffer.from() 从一个已经存在的data创建buffer。

data的类型：
- 整数数组(0-255)
- ArrayBuffer
- string
- another buffer
- JS object have Symbol.toPrimitive property[[TODO]]

### Access

获取buffer中的单个字节 类似数组下标访问
提取buffer中的完整内容 toString()

### modify

- 类数组修改
- write(str)
