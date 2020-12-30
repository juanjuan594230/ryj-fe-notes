# patch

patch的过程就是将VNode tree 转换成真实DOM的过程。

说的更直白一些，就是对比新旧的Vnode，执行diff，寻找差异的过程。最后以最小的代价去更新DOM

## patch过程

oldVnode & vnode

- vnode不存在，执行destroy
- oldVnode & vnode都存在
  - sameVnode(oldVnode, vnode) 需要进一步对比
  - 不是相同的vnode，直接进行新的元素的创建、旧元素的移除及销毁工作 **Vue根组件渲染时，oldVnode可能是一个DOM元素，这种情况，会将其先转换成一个Vnode节点**
- oldVnode不存在，直接创建新的元素

- [] 为什么要将oldVnode不存在的情况单独处理？

```javascript
// hydrating   SSR
// removeOnly  transition can ignore temp
function patch(oldVnode, node, hydrating, removeOnly) {
    // destroy
    if(vnode is undefined) {
        oldVnode is defined invokeDestroyHook()
        return;
    }

    let isInitialPatch = false;
    const insertedVnodeQueue = [];

    if (oldVnode is undefined) {
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue)
    } else {
        const isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly) // diff
        } else {
            // 1.oldVnode是真实的DOM（根组件的首次渲染）
            // 2.oldVnode不是真实的DOM，oldVnode与vnode不相同
            if (isRealElement) {
                // some code ssr
                oldVnode = emptyNodeAt(oldVnode);
            }
            createElm() // important!!! VNode -> VNode.elm real DOM Tree
        }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
}
```

VNode Tree Example:

    VNode-DIV
        VNode-H1
            VNode-A
        VNode-BACK-BTN<占位VNode>

patch process:

    patch(div#app, VNode-DIV)
        createElm(VNode-DIV, insertedVnodeQueue = [], parentElm = body, refElm = text)
            createComponent(VNode-DIV, insertedVnodeQueue = [], parentElm = body, refElm = text) return false;
            children = [VNode-H1, VNode-BACK_BTN]
            tag = 'div'
            VNode-DIV.elm = document.createElement('div', VNode-DIV);
            createChildren(VNode-DIV, [VNode-H1, VNode-BACK_BTN], insertedVnodeQueue = []);
                // 遍历children
                for (let i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
                }
                createElm(VNode-H1, insertedVnodeQueue = [], VNode-DIV.elm, null, nested = true, children = [VNode-H1, VNode-BACK_BTN], i = 0)
                    createComponent(VNode-H1, [], VNode-DIV.elm, null) return false;
                    children = [VNode-A]
                    tag = 'h1'
                    VNode-H1.elm = document.createElement('h1', VNode-H1);
                    createChildren(VNode-H1, [VNode-A], insertedVnodeQueue = []);
                        // 遍历children
                        for (let i = 0; i < children.length; ++i) {
                            createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
                        }
                        createElm(VNode-A, insertedVnodeQueue = [], VNode-H1.elm, null, nested = true, children = [VNode-A], i = 0)
                            createComponent(VNode-A, [], VNode-H1, null) return false;
                            children = undefined
                            tag = 'a'
                            VNode-A.elm = document.createElement('a', VNode-A);
                            invokeCreateHook() ??? isDef(VNode.data)
                            insert(parentElm = VNode-H1, VNode-A, null) // 执行插入操作, h1->a
                    insert(parentElm = VNode-DIV, VNode-H1, null) // 执行插入操作, div -> h1 -> a
                createElm(VNode-BACK-BTN, [], VNode-DIV, null, nested = true, children = [VNode-H1, VNode-BACK_BTN], i = 1)
                    createComponent(VNode-BACK-BTN, [], VNode-DIV, null)
                        i = VNode-BACK-BTN.data
                        isDef(i = i.hooks) && isDef(i = i.init) i(VNode-BACK-BTN)
                            // 这一段需要单独拆除了详细梳理
                            const child = VNode-BACK-BTN.componentInstance = vnode.componentInstance = createComponentInstanceForVnode(VNode-BACK_BTN, activeInstance) // 创建组件实例
                            child.$mount(hydrating ? vnode.elm : undefined, hydrating)
                        if(isDef(VNode-BACK-BTN.componentInstance)) {
                            initComponent(VNode-BACK-BTN, insertedVnodeQueue = [])
                                VNode-BACK_BTN.elm = VNode-BACK-BTN.componentInstance.$el
                                insertedVnodeQueue = [VNode-BACK-BTN] // important!!! invokeCreateHooks(VNode-BACK-BTN, insertedVnodeQueue)
                            insert(VNode-DIV, VNode-BACK_BTN.elm, null) // 执行插入操作 div(h1-a, button)
                        }
            insert(parentELm = body, VNode-DIV.elm, refElm = text)
        invokeInsertHook(VNode-DIV, insertedVnodeQueue = [VNode-BACK-BTN], isInitialPatch = false) // 子组件mounted
    return VNode-DIV.ELM

    // BACK-BTN组件实例化之后，patch process  下面涉及到的VNode-BACK-BTN表示非占位VNode
    patch(oldVnode = undefined, VNode-BACK-BTN, hydrating = false, removeOnly = false)
        // 进入子组件首次patch
        insertedVnodeQueue = [];
        isInitialPatch = true;
        createElm(VNode-BACK-BTN, insertedVnodeQueue)
        invokeInsertHook(VNode-BACK-BTN, insertedVnodeQueue, isInitialPatch)
        return VNode-BACK-BTN.elm(button->click me back)

    // BACK-BTN组件更新 patch -> patchVnode过程
    patch()
        !isRealElement && sameVnode(oldVnode, vnode)
            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)

### patchVnode

当传入的oldVnode & vnode is sameVnode时，会进入到patchVnode中。

```javascript
function patchVnode(oldVnode, vnode) {
    if oldVnode === vnode return;

    if vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key
        vnode.componentInstance = oldVnode.componentInstance; return;

    // update component vnode
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    // execute update ['updateAttributes', 'updateClass', 'updateDOMListeners', 'updateDOMProps', 'updateStyle', 'update', 'updateDirectives']
    // 对当前vnode执行一些update操作，暂时先不探究
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }

    const elm = vnode.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode.children;

    if isUndef(vnode.text)
        if oldCh && ch updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        if !oldCh && ch
            if oldVnode.text setTextContent(elm, '')
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        if oldCh && !ch
            removeVnodes(oldCh, 0, oldCh.length - 1)
        if oldVnode.text
            setTextContent(elm, '')
    else
        if oldVnode.text !== vnode.text
            if oldCh removeVnodes
            setTextContent(elm, vnode.text);

}
```

### updateChildren

对oldVnode & vnode 的 children 执行diff  同层比较（diff核心）

节点的改变可能有以下几种：

更新
删除
新增
移动

1. oStart nStart
2. oEnd   nEnd
3. oStart nEnd
4. oEnd   nStart
5. 从oldCh中寻找与newStartVnode相同的vnode节点

A B C D E

C E D B A F

loop1:

oStart: 0
oEnd: 4
nStart: 0
nEnd: 5

四种规则都未匹配，进入最后的else逻辑。

**从oldCh中寻找与newStartVnode相同的vnode节点**
从[A, B, C, D, E]中find C，最后得到idxInOld = 2.
    oldKeyToIdx: 建立oldCh index 与 oldCh[index] 的对应关系
    idxInOld = isDef(newStartVnode.key) ? oldKeyToIndex[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oStart, oEnd);
**if isDef(idxInOld = 2)**
    **vnodeToMove = oldCh[idxInOld];**
    **if sameVnode(vnodeToMove, new StartVnode) patchVnode; oldCh[idxInOld] = undefined; parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm);**
    else createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
else createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
++nStart

**finally**

==C== A B undefined D E
C E D B A F

loop2:

oStart: 0(A)
oEnd: 4(E)
nStart: 1(E)
nEnd: 5(F)

oldEndVnode === newStartVnode
    patchVnode(oldEndVnode, newStartVnode);
    parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
    --oEnd
    ++nStart

**finally**

==C== ==E== A B undefined D E
C E D B A F

loop3:

oStart: 0(A)
oEnd: 3(D)
nStart: 2(D)
nEnd: 5(F)

oldEndVnode === newStartEnd同loop2

**finally**

==C== ==E== ==D== A B undefined D E
C E D B A F

loop4:

oStart: 0(A)
oEnd: 2(undefined)
nStart: 3(B)
nEnd: 5(F)

if isUnDef(oldCh[oEnd]) --oEnd

**finally**

==C== ==E== ==D== A B undefined D E
C E D B A F

loop4:

oStart: 0(A)
oEnd: 1(B)
nStart: 3(B)
nEnd: 5(F)

oldEndVnode === newStartVnode 同loop2\3

**finally**

==C== ==E== ==D== ==B== A B undefined D E
C E D B A F

loop5:
oStart: 0(A)
oEnd: 0(A)
nStart: 4(A)
nEnd: 5(F)

oldStartVnode === newStartVnode
    patchVnode; ++oStart; ++nStart;

**finally**
==C== ==E== ==D== ==B== A B undefined D E
C E D B A F

loop6:

oStart: 1(A)
oEnd: 0(A)
nStart: 5(A)
nEnd: 5(F)

oStart > oEnd loop end

此时，oldCh节点都已经遍历完了，newCh中还有未处理的元素，这些都是新增加的节点。

if oStart > oEnd
    ==refElm==的选择
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, nStart, nEnd, insertedVnodeQueue);

**finally**
==C== ==E== ==D== ==B== ==F== A B undefined D E
C E D B A F

over.

```javascript
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    // 对撞指针
    oldStartIdx = 0;
    oldEndIdx = oldCh.length - 1;

    newStartIdx = 0;
    newEndIdx = newCh.length - 1;

    oldStartVnode = oldCh[oldStartIdx];
    oldEndVnode = oldCh[oldEndIdx];
    newStartVnode = newCh[newStartIdx];
    newEndVnode = newCh[newEndIdx];

    // move operation base on real DOM element
    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 通过key寻找到需要移动的vnode时，会将oldCh列表中的对应项置为undefined，如果碰到，直接跳过
        if oldStartVnode === undefined oldStartVnode = oldCh[++oldStartIndex]
        else if oldEndVnode === undefined oldEndVnode === oldCh[--oldEndIndex]

        // 四种特殊的匹配

        // position not change
        else if (sameVnode(oldStartVnode, newStartVnode))
            // patchVnode index 作用
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx) // 不涉及移动，继续进行diff
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        else if (sameVnode(oldEndVnode, newEndVnode))
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx) // 不涉及移动，继续进行diff
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]

        // position need change
        else if (sameVnode(oldStartVnode, newEndVnode))
            patchVnode;
            // 插在oldEndVnode.elm.nextSibling的前面，若未null，则插入parentElm的末尾
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            ++oldStartIdx // 自增，并赋值，此处简写
            --newEndIdx
        else if (sameVnode(oldEndVnode, newStartVnode))
            patchVnode;
            // 插在oldStartVnode.elm的前面
            parentElm.insertBefore(oldEndValue.elm, oldStartVnode.elm);
            --oldEndIdx
            ++newStartIdx

        // need find
        else
            oldKeyToIdx // 保存oldCh中vnode.key 与 index 的映射
            // find 与newStartVnode相同的vnode，在oldCh中的index。
            idxInOld //若newStartVnode.key存在，则直接根据key从oldKeyToIdx获取；否则遍历oldCh(start-end) find
            if isUnDef(idxInOld) 未找到
                newStartVnode is a new element createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            else 找到了
                vnodeToMove = oldCh[idxInOld]
                if sameVnode(vnodeToMove, newStartVnode)
                    patchVnode;
                    oldCh[idxInOld] = undefined
                    parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm) // 插入到oldStartVnode.elm的前面
                else
                    new element createElm()
            ++newStartIdx
    }

    if oldStartIdx > oldEndIdx // oldCh遍历完毕，需要将newCh剩余的vnode，创建元素并插入
        refElm = isUnDef(newCh[newEndIdx + 1]) ? null : newCh[newIdx + 1].elm; // 插入的参照位置
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
            *tip addVnodes中，遍历newCh<start-end>部分，调用createElm; createElm中最后会调用insert完成插入，eg:insert(parentElm, elm, ref)*
            *insert中，当ref存在，则调用insertBefore，将elm插入到参照物的前面；否则，直接append到parentELm的末尾*
    else if newStartIdx > newEndIdx
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);


}
```



