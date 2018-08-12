class BinaryTree {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
    // 前序遍历
    preOrder() {
        const root = this;
        if (!root) {
            return;
        }
        console.log(root.val);
        if (root.left) {
            root.left.preOrder();
        }
        if (root.right) {
            root.right.preOrder();
        }
    }
    // 中序遍历
    centerOrder() {
        const root = this;
        if (!root) {
            return;
        }
        if (root.left) {
            root.left.centerOrder();
        }
        console.log(root.val);
        if (root.right) {
            root.right.centerOrder();
        }
    }
    // 后序遍历
    nextOrder() {
        const root = this;
        if (!root) {
            return;
        }
        if (root.left) {
            root.left.nextOrder();
        }
        if (root.right) {
            root.right.nextOrder();
        }
        console.log(root.val);
    }
    // 层遍历··
    layerOrder() {
        const root = this;
        const array = [];
        if (!root) {
            return null;
        }
        array.push(root);
        while (array.length > 0) {
            const node = array.shift();
            console.log(node.val);
            if (node.left) {
                array.push(node.left);
            }
            if (node.right) {
                array.push(node.right);
            }
        }
    }
    // 深度
    deep() {
        const root = this;
        if (!root) {
            return 0;
        }
        const m = root.left ? root.left.deep() : 0;
        const n = root.right ? root.right.deep() : 0;
        // +1 代表本身节点的深度
        return m > n ? m + 1 : n + 1;
    }
    // 复制二叉树
    clone() {
        const root = this;
        if (!root) {
            return null;
        }
        const _root = new BinaryTree(root.val);
        _root.left = root.left ? root.left.clone() : null;
        _root.right = root.right ? root.right.clone() : null;
        return _root;
    }
    // 反转二叉树 左右反转
    reverse() {
        const root = this;
        if (!root) {
            return;
        }
        const temp = root.left;
        root.left = root.right ? root.right.reverse() : null;
        root.right = temp ? temp.reverse() : null;
        return root;
    }
    // 根据先序与中序，还原二叉树(假设无重复)
    static buildTree(pre, vin) {
        if (!Object.prototype.toString.call(pre) === '[object Array]'
            || !Object.prototype.toString.call(vin) === '[object Array]') {
            return null;
        }
        if (!pre.length || !vin.length || pre.length !== vin.length) {
            return null;
        }
        const rootVal = pre[0];
        const rootIndex = vin.indexOf(rootVal);
        const root = new BinaryTree(rootVal);
        const vinLeft = vin.filter((item, index) => {
            return index < rootIndex;
        });
        const vinRight = vin.filter((item, index) => {
            return index > rootIndex;
        })
        const leftLen = vinLeft.length;
        const preLeft = pre.slice(1, leftLen + 1);
        const preRight = pre.slice(leftLen + 1);
        root.left = this.buildTree(preLeft, vinLeft);
        root.right = this.buildTree(preRight, vinRight);
        return root;
    }

}

/* 
    输入两棵树，判断B是否是A的子结构
*/
function hasSubtree(root1, root2) {
    const result = false;
    if (!root1 && !root2) {
        if (root1.val === root2.val) {
            result = doesTreeHaveTree2(root1, root2);
        }
        if (!result) {
            result = hasSubtree(root1.left, root2);
        }
        if (!result) {
            result = hasSubtree(root1.right, root2);
        }
    }
    return result;
}

function doesTreeHaveTree2(root1, root2) {
    if (!root2) {
        return true;
    }
    if (!root1) {
        return false;
    }
    if (root1.val !== root2.val) {
        return false;
    }
    return doesTreeHaveTree2(root1.left, root2.left) && doesTreeHaveTree2(root1.right, root2.right);
}

module.exports = BinaryTree;