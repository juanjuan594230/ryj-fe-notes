## unicode

code point: unique identifier to every char; start at 0;

> unicode: 使用十六进制的数字对全世界的字符进行编码。

> UTF-8/UTF-16/UTF-32等: 将十六进制的unicode编码转换成二进制。
> > UTF-8: 以字节为单位对unicode进行编码

平面：unicode目前存在17个平面，每个平面可以存放65536个字符（2^16）。

>Basic Multilingual Plane(BMP)：基本多文种平面(最前面的65536个字符,码点范围U+0000~U+FFFF)，占用2个字节。

>supplementary planes(SMP)：补充平面， 除基本平面的码点外，剩余的码点都存在于辅助平面上。码点范围U+010000~U+10FFFF，占用4个字节；

>surrogate pairs: 代理对(一个code point对应两个16-bit代码单元)

javascript使用的编码集`UCS-2`。在对补充平面的字符做一些操作时，会出现意想不到的情况。

```javascript
const text = '𠮷';
console.log(text.length) // 2
console.log(text.charCodeAt(0)); // 55362 会拆分成两个码点
console.log(text.charCodeAt(1)); // 57271
```

### String.ptototype.codePointAt

返回字符对应的code point

```javascript
const text = '𠮷';
console.log(text.codePointAt(0)); // 134071 返回完整的code point
console.log(text.codePointAt(1)); // 返回后一个16-bit对应的code point
```

### String.fromCodePoint

根据码点，返回对应的字符。非原型方法

```javascript
console.log(String.fromCodePoint(134071)); // 𠮷
```

## Methods for Identifying Substrings

```javascript
str.includes(searchStr, [position])
str.startsWith(searchStr, [position])
str.endsWith(searchStr, [length]) // 从0到length-1的位置查找 default: str.length
```
