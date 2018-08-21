class LinkList {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }

    reverse() {
        let head = this;
        if (!head || !head.next) {
            return head;
        }
        let previousNode = null,
              nextNode = null;
        while (head) {
            nextNode = head.next;
            head.next = previousNode;
            previousNode = head;
            head = nextNode;
        }
        return previousNode;
    }

    push(newNode) {
        let head = this;
        if (!head) {
            head = newNode;
        }
        while(head.next) {
            head = head.next;
        }
        head.next = newNode;
    }

    delete(val) {
        let head = this;
        let deleteNode = null;
        if (head.val === val) {
            deleteNode = head;
            head = head.next;
            return deleteNode;
        }
        while(head.next && head.next.val !== val) {
            head = head.next;
        }
        if (head.next && head.next.val === val) {
            deleteNode = head.next;
            head.next = head.next.next;
        }
        return deleteNode;
    }
}

// 链表
const c = new LinkList('c');
const b = new LinkList('b', c);
const a = new LinkList('a', b);

/* 
    从尾到头打印链表
    思路：遍历节点到数组，最后逆序输出
    书上思路：利用栈结构后进先出的特性，JS中数组的pop和push方法，正好可以模拟栈数据结构
    如果栈结构可以，那么也可以用递归实现
*/

function printListReverse(phead) {
    let node = phead;
    if (!phead || !phead.next) {
        console.log(phead);
        return;
    }
    const _arr = [];
    while (node) {
        _arr.push(node);
        node = node.next;
    }
    while (_arr.length > 0) {
        console.log(_arr.pop());
    }
}

function printListReverse1(phead) {
    let node = phead;
    if (!phead) {
        return;
    }
    if(node.next) {
        printListReverse1(node.next);   
    }
    console.log(node);
}
// printListReverse1(a);

/* 
    在o(1)的时间删除链表节点
*/
function deleteNode(phead, deleteNode) {
    if (!phead || !deleteNode) {
        return;
    }
    // 不是尾节点
    if (deleteNode.next) {
        let next = deleteNode.next;
        deleteNode.val = next.val;
        deleteNode.next = next.next;
        next = null;
    } 
    // 只有一个节点
    else if (phead === deleteNode) {
        deleteNode = null;
        phead = null;
    } 
    // 多个节点，删除尾节点
    else {
        let node = phead;
        while(node.next !== deleteNode) {
            node = node.next;
        }
        node.next = null;
        deleteNode = null;
    }
}

/* deleteNode(a);
console.log(a); */

/* 
    链表中的倒数第k个节点
    两个指针，一个先走，走到k的时候停住，两个一起走，第一个走到最后一个元素，第二个指针所在的位置就是倒数第k个节点。
    未考虑到的点：当k的值大于链表中节点的个数时呢？
*/
const _6 = new LinkList(6);
const _5 = new LinkList(5, _6);
const _4 = new LinkList(4, _5);
const _3 = new LinkList(3, _4);
const _2 = new LinkList(2, _3);
const _1 = new LinkList(1, _2);
function findKthToTail(phead, k) {
    if (!phead || typeof k !== 'number' || k <= 0) {
        return null;
    }
    let index1 = phead,
        index2 = phead,
        i = 0;
    while (i < k - 1) {
        if (index1.next) {
            index1 = index1.next;
            i++;
        } else {
            return null;
        }
    }
    while (index1.next) {
        index1 = index1.next;
        index2 = index2.next;
    }
    return index2.val;
}
// console.log(findKthToTail(_1, 3));

/* 
    反转链表
*/
function reverseList(phead) {
    if (!phead || !phead.next) {
        return phead;
    }
    let previous = null,
        next = null,
        node = phead;
    while (node) {
        next = node.next;
        node.next = previous;
        previous = node;
        node = next;
    }
    return previous;
}
// console.log(reverseList(a));

/* 
    合并两个排序的链表(dizeng)
*/
function merge(phead1, phead2) {
    if (!phead1) {
        return phead2;
    }
    if (!phead2) {
        return phead1;
    }
    let mergeHead = null;
    if (phead1.val <= phead2.val) {
        mergeHead = phead1;
        mergeHead.next = merge(phead1.next, phead2);
    } else {
        mergeHead = phead2;
        mergeHead.next = merge(phead1, phead2.next);
    }
    return mergeHead;
}

/* 
    判断链表是否形成环
    思路1: 建立一个set数据类型的变量，遍历一个节点，先去判断set结构中是否存在，不存在，添加；存在，则证明单链表中有环
    思路2: 两个指针，都指向链表的头节点，指针1一次移动一步，指针2一次移动2步，当两个指针指向同一节点时，则证明有环
    实现：以思路2的方式实现
*/
const D = new LinkList('d');
const C = new LinkList('c', D);
const B = new LinkList('b', C);
const A = new LinkList('a', B);
D.next = B;
function hasCircle(phead) {
    if (!phead || !phead.next) {
        return false;
    }
    let p1 = p2 = phead;
    while(p1 && p2) {
        p1 = p1.next;
        p2 = p2.next.next;
        if (p1 === p2) {
            return true;
        }
    }
    return false;
}
// console.log(hasCircle(A));

/* 
    如果链表中存在环，请找出环的入口点
    思路：两个指针p1&p2, 假设环中节点的树木为n，则p1先走n步，之后两个指针步调一致，指向同一元素，即为环的入口点
    那么，如何获得环中节点的数目呢？
    利用判断是否有环的思想，当链表中存在环时，两个指针相遇的节点一个在环中，当再一次走到该节点时，就可以得到环中的个数了
*/
function circleEntry(phead) {
    // 不存在环时
    if (!hasCircle(phead)) {
        return null;
    }
    let nodeNum = 1;
    let p1 = p2 = phead;
    while (p1 && p2) {
        p1 = p1.next;
        p2 = p2.next.next;
        if (p1 === p2) {
            break;
        }
    }
    while (p1.next !== p2) {
        p1 = p1.next;
        nodeNum++;
        if (p1 === p2) {
            break;
        }
    }
    p1 = p2 = phead;
    while (nodeNum > 0) {
        p1 = p1.next;
        nodeNum--;
    }
    while (p1 !== p2) {
        p1 = p1.next;
        p2 = p2.next;
    }
    return p1;
}
console.log(circleEntry(A));


module.exports = LinkList;