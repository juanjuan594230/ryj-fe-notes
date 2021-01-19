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