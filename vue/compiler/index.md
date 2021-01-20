# Compiler

template -> render fn

runtime + compiler
runtime (需借助vue-loader将template编译为render fn)

## runtime with compiler

```javascript
// entry runtime with compiler
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function(
    el?: string | Element,
    hydrating?: boolean
):Component {
    el = el && query(el); // query(el) 中使用了querySelector查找DOM element，并返回第一个匹配到的元素；使用的是深度优先先序遍历算法。

    const options = this.$options;
    // FOCUS1: resolve template/el and convert to render function
    if (!options.render) { //... }

    mount.call(this, el, hydrating);
}

// FOCUS1 resolve template/el and convert to render function
template = options.template;
// generate template
// FOCUS2: template -> render fn
if (template) {
    const compileOptions = {
        // ...
    }
    const { render, staticRenderFns } = compileToFunctions(template, compileOptions, this);
}
```

### template to render fn

**函数柯里化**

把一个多参数函数转换成一系列只带单个参数的函数。

```javascript
function multiply(a, b, c) {
    return a * b * c;
}

// currying
function multiply(a) {
    return (b) => {
        return (c) => {
            return a * b * c;
        }
    }
}
```

**柯里化思想在Vue compiler中的应用**

```javascript
function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions) {
        function compile() { // closure variable
            //do something use closure variable baseCompile
        }
        return function compileToFunctions = createCompileToFunctionFn(compile);
    }
}

function createCompileToFunctionFn(compile) {
    const cache = Object.create(null); // closure variable
    return function compileToFunctions(
        template,
        options,
        vm
    ) {
        // ...
    }
}
```

#### function compileToFunctions

```javascript
// type CompiledFunctionResult
interface CompiledFunctionResult: {
    render: Function,
    staticRenderFns: Array<Function>
}

function compileToFunctions(
    template,
    options,
    vm
): CompiledFunctionResult {
    // check cache cache = { key: { render, staticRenderFns }}
    const key = template;
    if (cache[key]) { return cache[key]};

    // compile
    const compiled = compile(template, options);

    // deal and save and return
    const res = {};
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compile.staticRenderFns.map(code => createFunction(code, fnGenErrors));
    cache[key] = res;
    return res;

}

// function compile
interface CompiledResult: {
    ast: ?ASTElement,
    render: string,
    staticRenderFns: Array<string>,
    stringRenderFns?: Array<string>,
    errors?: Array<string | WarningMessage>,
    tips?: Array<string | warningMessage>
};
function compile(
    template,
    options
):CompiledResult {
    const finalOptions = Object.create(options);
    const errors = [];
    const tips = [];

    // deal with options
    if (options) {
        // do something
    }

    // compile core
    const compiled = baseCompile(template.trim(), finalOptions);

    compiled.errors = errors;
    compiled.tips = tips;
    return compiled;
}

// function baseCompile
// 下面着重对这个方法进行阐述
```

## baseCompile

- 解析模板字符生成AST parse
- optimize AST optimize
- 生成code generate

```javascript
function baseCompile(template, options) {
    const ast = parse(template.trim(), options);
    optimize(ast, options);
    const code = generate(ast, options);

    return {
        ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    }
}
```

### parse

```javascript
// Convert HTML string to ast
function parse(template, options): ASTElement {
    const stack = [];
    let root; // ast root node
    parseHTML(template, options);
    return root;
}

// regex
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*` // 匹配以英文字符或下划线开头的接[-.0-9_a-zA-Z]的字符串
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // (?:x)非捕获括号 匹配x但不记住匹配项 (?:${ncname}\\:)?的零个或1个
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签及标签名 eg<div

function parseHTML(html, options) {
    const stack = [];
    let index = 0;
    let last;
    let lastTag; // stack 栈顶的tag
    while(html) {
        last = html;
        // Make sure we're not in a plaintext content element like script/style
        if (!lastTag || !isPlainTextElement(lastTag)) {
            const textEnd = html.indexOf('<');
            if (textEnd === 0) {
                // comment
                // DOCTYPE
                // endTag
                const endTagMatch = html.match(endTag); // eg: html = '</div>' endTagMatch = ['</div>', 'div']
                if (endTagMatch) {
                    const curIndex = index;
                    advance(endTagMatch[0].length); // html = ''
                    parseEndTag(endTagMatch[1], curIndex, index);
                }
                // startTag
                const startTagMatch = parseStartTag(); // return match obj
                if (startTagMatch) {
                    handleStartTag(startTagMatch);
                    continue;
                }
            }

            // handleText
            let text;
            let rest;
            if (textEnd >= 0) {
                rest = html.slice(textEnd);
                text = html.substring(0, textEnd)
            } else {
                text = html;
            }

            if (text) {
                advance(text.length);
            }

            if (options.chars && text) {
                options.chars(text, index - text.length, index)
            }
        }
    }

    // parseStartTag
    // 解析开始标签，并返回match
    // match = {
    //     tagName,
    //     start, // 在html整个字符串中的开始与结束位置
    //     end,
    //     attrs, // 标签中的attr信息
    //     unarySlash, // 是否是自闭合标签标志
    // }
    function parseStartTag() {
        // string.prototype.match return an Array; the array has some additional props, like: groups, index, input
        // 不适用/g，只返回第一个匹配到的内容及其相关内容
        // html = '<div id="app">{{ msg }}</div>' start = ['<div', 'div'] start.group = undefined; start.index = 0; start.input = html
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            };
            advance(start[0].length); // html = ' id="app">{{ msg }}</div>'
            var end, attr;
            // 动态属性 & 属性 key=value
            while(!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                // loop1:
                // attr = [' id="app"', 'id', '=', 'app', undefined, undefined] index = 0; input = html; groups = undefined
                // end = null
                attr.start = index; // attr在整个template中的开始位置
                advance(attr[0].length); // html = '>{{ msg }}</div>'
                attr.end = index; // attr在整个template中的结束位置
                match.attrs.push(attr);
                // loop2: end = ['>', '']; groups = undefined; index = 0; input = '>{{ msg }}</div>' 循环结束
            }
            if (end) {
                match.unarySlash = end[1]; // 本次的例子为''
                advance(end[0].length); // html = '{{ msg }}</div>'
                match.end = index;
                return match;
            }
        }
    }

    function handleStartTag(match) {
        const tagName = match.tagName;
        const unarySlash = match.unarySlash;
        // ...
        const unary = isUnaryTag(tagName) || !!unarySlash; // 是否是一元标签，自闭合标签
        const attrs = [];
        for (let i = 0; i <match.attrs.length; i++) {
            // 遍历match.attrs，将键值对以{key: 'xxx', value: xxx}的形式保存在attrs中: a 标签需要decode
        }
        if (!unary) {
            stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end }); // 入栈
            lastTag = tagName; // 标识栈顶的tag
        }
        if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end);
        }
    }

    function parseEndTag(tagName, start, end) {
        // 匹配栈顶元素，调用options.end(); 出栈，闭合标签
        // 实际上不仅仅会匹配栈顶元素，是从栈顶开始找，找到匹配的元素，所有该元素之上的tag都调用options.end做闭合操作（出栈、重置currentParent，closeElement）
    }

    // options.start
    // create ast element
    function start() {
        // create ast element
        let element: ASTElement = createASTElement(tag, attrs, currentParent);
        // pre ??? 先省略
        // 对element做了一些扩展 如processFor/processIf...
        if (!root) {
            root = element;
        }
        if (!unary) {
            currentParent = element;
            stack.push(element);
        } else {
            closeElement();
        }
    }

    // options.chars
    // 生成ASTNode
    // push 到parent的children数组中
    // 其他逻辑暂时先不看
    function chars(text, start, end) {
        // ...
        const children = currentParent.children;
        // 根据text，生成不同类型ASTNode eg: type:3 纯文本；type:2: 包含了一些表达式
        const child = {}; // ASTNode
        children.push(child);
    }
}
```

#### parseHTML

parseHTML的过程就是利用正则表达式对template做匹配的过程。当前这一段匹配结束之后，会前进相应的步数（也就是将匹配完的字符从template中去除），对剩余的template继续做匹配；直至整个template匹配完成，

```javascript
// 匹配过程用到的正则表达式
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // (?:x) 匹配x但不记录 非捕获括号
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配startTag and tagName eg: <div id="app"></div>.match(startTagOpen) = ['<div', 'div']
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
// 伪代码
function parserHTML(html, options) {
    let index = 0;
    let lastTag;
    let last
    while(html) {
        last = html;
        if (!lastTag || !isPlainTextElement(lastTag)) {
            const textEnd = html.indexOf('<');
            if (textEnd === 0) {
                if (matchComment) {
                    advance(commentLength);
                    continue;
                }

                if (matchDoctype) {
                    advance(doctypeLength);
                    continue;
                }

                if (matchEndTag) {
                    advance(endTagLength);
                    parseEndTag();
                    continue;
                }

                if (matchStartTag) {
                    parseStartTag();
                    handleStartTag();
                    continue;
                }
            }
            handleText();
            advance(textLength);
        } else {
            handlePlainTextElement();
            parseEndTag();
        }
    }

    if (html === last) {
        options.chars && options.chars(html);
        break;
    }

    // 移动index 切割html
    function advance(n) {
        index += n;
        html.substring(n);
    }
}
```

**注释节点 & 文档类型节点**

这两类型的节点的处理方式都是直接前进相应的步长，继续解析剩余的html；

```javascript
// regex
const doctype = /^<!DOCTYPE [^>]+>/i // <!DOCTYPE html>
const comment = /^<!\--/ // <!--
const conditionalComment = /^<!\[/ // 条件注释 <![

// 注释节点: 寻找到注释节点的结尾处，前进index，并截取剩余的html
// 条件注释的节点处理方式也是类似的
if(comment.test(html)) {
    const commentEnd = html.indexOf('-->');
    if (commentEnd >= 0) {
        advance(commentEnd + 3)
        continue;
    }
};

// 文档类型节点
const doctypeMatch = html.match(doctype);
if (doctypeMatch) {
    advance(doctypeMatch[0].length);
    continue;
}
```

**startTag**

匹配到startTag，解析出tagName/attrs，判断是否是一元标签，不是的话，将表示这个标签的一些属性值组成对象，并入栈。lastTag = tagName; 然后调用options.start

```javascript
// regex
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配startTag and tagName eg: <div id="app"></div>.match(startTagOpen) = ['<div', 'div']
const startTagClose = /^\s*(\/?)>/;
if (textEnd === 0) {
    // startTag
    const startTagMatch = parseStartTag();
    if (startTagMatch) {
        handleStartTag(startTagMatch);
        continue;
    }
}

// parseStartTag parseHTML中的函数，因此可以访问一些闭包变量
// return a match obj includes tagName attrs start end unarySlash ...
function parseStartTag() {
    // string.prototype.match(regex) return an array; and some additional props, like groups index input
    const start = html.match(startTagOpen); // eg: <div id="app"></div> start = ['<div', 'div']
    if (start) {
        const match = {
            tagName: start[1],
            attrs: [],
            start: index
        };
        advance(start[0].length); // eg: html = ' id="app"></div>'
        let end, attr;
        // 循环遍历标签上的属性
        // loop1
        // attr = [' id="app"', 'id', '=', 'app', undefined, undefined] index = 0; input = html; groups = undefined
        // end = null
        // loop2 end = ['>', ''] 循环end 第二项表示是否匹配到了自闭合标签
        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
            attr.start = index;
            advance(attr[0].length);
            attr.end = index;
            match.attrs.push(attr);
        }
        if (end) {
            match.unarySlash = end[1];
            advance(end[0].length);
            match.end = index;
            return match;
        }
    }
}

// 对match做一些处理
function handleStartTag(match) {
    const { tagName, unarySlash } = match;

    // 是否是一元标签
    const unary = isUnaryTag(tagName) || !unarySlash;

    // 对match.attrs做处理
    // 遍历match.attrs，提取match.attrs[i]中对应的key & value，将{key: xxx, value:xxx}push到attrs数组中
    const attrs = [
        { key: xxx, value: xxx},
        ...
    ];

    // stack中push了一个描述这个标签的对象
    if (!unary) {
        stack.push({
            tag: tagName,
            attrs,
            start: match.start,
            end: match.end,
            lowerCasedTag: tagName.toLowerCase()
        });
        lastTag = tagName;
    }

    // TODO options.start稍后再分析
    if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
    }
}

```

**endTag**

遇到endTag，就应该要从stack中pop元素了。

```javascript
// regex
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
if (endText === 0) {
    const endTagMatch = html.match(endTag);
    if (endTagMatch) {
        const curIndex = index;
        advance(endTagMatch[0].length);
        parseEndTag(endTagMatch[1], curIndex, index);
        continue;
    }
}

function parseEndTag(tagName, start, end) {
    // 从stack的末尾寻找第一个与当前endTag匹配的元素。
    // 在遇到startTag 且不是一元标签时，会将其以及包含属性等的对象压栈。遇到endTag，就是从栈顶开始做匹配的过程
    // 正常情况下，栈顶的元素应该能和当前的endTag匹配
    // 异常情况下，某些标签未正确闭合，eg: <div><span>xxx</div> 此时stack = [div, span] 但目前的endTag为</div> 此时就需要从栈顶开始，直至找到第一个与endTag相匹配的标签，记录在栈中的位置
    let pos;
    if (tagName) {
        for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].tagName === tagName) {
                break;
            }
        }
        // loop end pos is the match tag position
    } else {
        pos = 0;
    }

    if (pos >= 0) {
        for (let i = stack.length - 1; i >= pos; i--) {
            options.end && options.end(stack[i].tag, start, end);
        }
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
    }
}
```

**TextTag**

```javascript
const textEnd = html.indexOf('<');
// eg: html = '<aaa</div>' textEnd = 0 但是没有匹配到注释、文档类型、tagOpen、tagEnd中的任意一种
// 因此应该是文本节点中包含了<符号
// find whole text 其中涉及了当文本中包含了<的处理
let text, rest, next;
if (textEnd >= 0) {
    rest = html.slice(textEnd);
    // textEnd 处所匹配到的<，其实属于文本节点中的一部分；这种情况下，需要正确找到文本节点的结束之处；也就是找到真正的不代表文本的< textEnd最后所指的位置就是这里。0 - textEnd之间的，就是文本
    // eg: rest = <aaa</div> textEnd = 0;
    // loop1: next = 4 textEnd = 0 + 4; rest = </div> 此时就找到了正确的文本结束位置
    while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
        // str.indexOf(searchValue [, fromIndex])
        next = rest.indexOf('<', 1); // find next <
        if (next < 0) break;
        textEnd += next;
        rest = html.slice(textEnd);
    }
    text = html.substring(0, textEnd);
}

if (textEnd < 0) {
    text = html;
}

if (text) {
    advance(text.length);
}

if (options.chars && text) {
    options.chars(text, index - text.length, index);
}
```

**parseHTML options**

```javascript
options = {
    start: fn,
    end: fn,
    chars: fn
}
```

在上述处理不同的标签时，最后都调用了不同的options中的方法。下面看看这些方法吧。


1. start 处理开始tag

```javascript
function start(tag, attrs, unary, start, end) {
    // 创建对应的ASTElement
    const element = createASTElement(tag, attrs, currentParent);
    // 处理element
    processElement(element);
    treeManagement();
}

// step1 createASTElement
createASTElement(tag, attrs, parent): ASTElement {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        rawAttrsMap: {},
        children: [],
        parent
    }
}

// step deal with ASTElement
// 结果就是扩展ASTElement元素的属性
// pre-transforms ???
// 对包含的指令做处理
processFor(element);
processIf(element);
processOnce(element);

// step3. tree management
if (!root) {
    root = element;
}
if (!unary) {
    stack.push(element); // ASTElement push stack
    currentParent = element;
} else {
    closeElement(); // 会将element push 到 parent.children中
}

```

2. end 处理endTag

```javascript
// 在parseEndTag中，会对pos之前的元素做闭合操作。也就是调用end
function end(tag, start, end) {
    // 元素出栈
    const element = stack[stack.length - 1];
    stack.length -= 1;
    currentParent = stack[stack.length - 1];
    closeElement(element);
}

function closeElement(element) {
    // ...
    currentParent.children.push(element);
    element.parent = currentParent;
    // 其余逻辑先不看
}
```

3. text 处理text

```javascript
function chars(text, start, end) {
    const children = currentParent.children;
    let child;
    // type = 2 or type = 3
    if (!inPre && text !== ' ' && res = parseText(text, delimiters)) {
        child = {
            type: 2,
            expression: res.expression
            tokens: res.tokens,
            text
        }
    } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
        child = {
            type: 3,
            text
        }
    }
    children.push(child);
}

// parseText 完了再分析吧
```