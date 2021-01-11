# Component VNode Hooks

`createComponent` 生成组件Vnode的过程中，会安装组件的钩子函数到data.hook = {}上面。

```javascript
const componentVNodeHooks = {
    init: initHook,
    prepatch: prepatchHook,
    insert: insertHook,
    destroy: destroyHook
}
// hook detail definition later analysis
function initHook() {},
function prepatchHook() {},
function insertHook() {},
function destroyHook() {}

const hooksToMerge = Object.keys(componentVNodeHooks); // ['init', 'prepatch', 'insert', 'destroy']
function installComponentHooks(data: VNodeData) {
    const hooks = data.hook || data.hook = {};
    for (const hookName of hooksToMerge) {
        const existing = hooks[hookName];
        const toMerge = componentVNodeHooks[hookName];
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[hookName] = existing ? mergeHook(toMerge, existing) : toMerge;
        }
    }
}

function mergeHook(f1, f2) {
    const merged = (a, b) => {
        f1(a, b),
        f2(a, b)
    };
    merged._merged = true;
    return merged;
}
```

## initHook

```javascript
const init = function(vnode: VNodeWithData, hydrating: boolean) {
    if () {} // keep-alive component TODO
    else {
        const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
}

function createComponentInstanceForVnode(vnode, parent): Component {
    // *** options ***
    const options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent
    };
    // *** TODO ???
    // check inline-template render functions
    const inlineTemplate = vnode.data.inlineTemplate
    if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render
        options.staticRenderFns = inlineTemplate.staticRenderFns
    }
    return vnode.componentOptions._Ctor(options);
}
```